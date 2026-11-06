by a list of the installed connector# Sprint 14 — Hybrid ranking and grounded answers

**Status:** done
**Phase:** 2 — Tainacan Semantic Search
**Work breakdown:** 2.9, 2.10
**Depends on:** 13

## Goal

Make the two retrieval modes usable together, and make the one inference this plugin
performs incapable of inventing an answer.

## Scope

| File | Role |
|---|---|
| `Rag\Hybrid_Ranking` | keyword + vector results merged by reciprocal rank fusion |
| `Rag\Answer` | retrieve, build a grounded prompt, return citations and an optional answer |
| `Search_Engine` | opt-in reordering of Tainacan search pages |

Abilities: `tainacan/rag-hybrid-search` (read floor) and `tainacan/rag-answer`
(`manage_options`, read-only).

## Decisions

**Fuse by rank, never by score.** Cosine similarity lives in `[-1, 1]` and is
model-specific; a keyword ranking has no score at all, only an order. Reciprocal rank
fusion scores each item `1 / (k + rank)` per list, so agreement between the lists wins
and a single high similarity cannot drown a term match. Ties break on the lower ID, so
identical input always produces identical order — a ranking that reshuffles itself
makes every later comparison worthless.

**Keyword search is the fallback, not the exception.** Every vector-side failure — no
active space, provider missing, provider not configured, provider paused, unreadable
table — degrades to keyword results and names the reason in `degraded`. A search box
that returns nothing because an API key expired is worse than one returning worse
results.

**Answers cite what the caller could see, or they do not exist.** Citations are built
from the snippets retrieval actually returned *to this caller*, after the visibility
filter. An answer therefore cannot quote a document the reader could not open, and the
smoke asserts the unpublished item never reaches a citation.

**No generator, no answer text.** The generator arrives through
`tainacan_rag_answer_generator`. When nothing supplies one the response is
`answer: null`, `reason: no_generator`, citations and prompt intact. That is the state
of this stack: no `ai/*` ability is registered, so a hard dependency on the WordPress
AI plugin would be dead code exercisable only by mocking its internals. A filter is the
same seam `tainacan_rag_register_embedding_providers` already uses.

**The prompt is returned with the answer.** "Why did it say that" needs the exact
context and instructions. It contains only snippets the caller already received.

**Reordering search results is opt-in and page-local.** `Search_Engine` gained a
`the_posts` filter that reorders one page of Tainacan item results, enabled only when
`tainacan_rag_hybrid_search_enabled` returns true. It reorders what WordPress already
selected and never changes page membership, so `found_posts` and pagination stay
WordPress's. Making hybrid ranking decide which page a result belongs to means owning
the query, not filtering its output, and that is a different change with a different
risk — deliberately not bundled here.

**A mixed query is not reordered.** If any post type in the query is not a Tainacan
item type, the collection lookup returns empty and the reorder is skipped, rather than
treating pages and products as items that failed to match.

## Live proof

Fake provider, real space, two published items sharing a term, one unpublished item
indexed on purpose:

| Check | Result |
|---|---|
| Hybrid returns results | 6 |
| Fusion is RRF, k = 60 | pass |
| Both sides contributed | vector 2, keyword 5 |
| The term match ranks first | pass |
| Both ranks reported per result | pass |
| The draft is not a hybrid result | pass |
| A broken space degrades instead of failing | pass, `tainacan_rag_space_not_found` |
| Keyword results survive the degradation | pass |
| No generator means no answer text | pass, `no_generator` |
| Citations returned anyway | 2 sources |
| The prompt is returned too | pass |
| Citations exclude the draft | pass |
| A wired generator's text comes back | pass |
| The generator received the prompt | 511 bytes |
| A generator error propagates | pass |
| The error still carries citations | pass |
| Reordering is a no-op while disabled | pass, 2 posts |
| Enabled reordering keeps every result | pass |

22 of 22.

## What is still missing

- No generator is wired on this stack, so `rag-answer` returns citations and the
  prompt. That is the designed behaviour, not a gap.
- Hybrid reordering is off by default and reorders one page only. Nothing changes
  which page a result lands on.
- The keyword side uses the existing Tainacan search engine, so it inherits whatever
  that engine matches — including metadata values — and inherits its limits.
- Item metadata values are still not chunked, so the vector side still sees title,
  description and extracted document text only. That gap is now six sprints old and is
  the single largest quality limiter left in Phase 2.

## Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `php -l` on four edited or new files | clean |
| 2 | `wp_get_abilities()` | 74 = 3 core + 71 Tainacan |
| 2 | `phpunit --filter Test_Abilities` | OK, 114 tests, 1142 assertions |
| 2 | `make test` | OK, 515 tests, 5307 assertions |
| 2 | Live hybrid and answer smoke | 22 of 22 checks pass |
| 3 | `make guard` | clean |
| 3 | `make docs-build` | OK |

## Execution log

Findings, appended as work happens. Not intentions.

### A filter whose value is a callable

The first run of the generator test failed because the test registered the generator
*as* the filter callback: `apply_filters` passed `null` into it, it returned a string,
and a string is not callable. The filter's contract is "receive the current value,
return the new one", so the test now returns the closure from a closure. Worth
recording because a generator filter is the kind of thing a site will wire once, by
hand, and get subtly wrong in exactly this way.

### An assertion that proved nothing

The first smoke reported `posts 1` for the reorder check, which meant
`hybrid_reorder` took its `count < 2` early return and the fusion path never ran. The
check passed while testing nothing. Giving both items a shared term made the query
return two posts, and the same check now exercises the real path. Same class of mistake
as Sprint 13's `coverage[0]`: a green check that does not touch the code it names.

### Three things clicking the page changed

Opening the console in a browser at `http://localhost:8080/wp-admin/admin.php?page=tainacan_rag`
— rather than asserting against its markup — produced three changes that no test asked
for:

1. **Queue rows outlived their space.** Two rows sat in `failed` with "Space no longer
   exists", left behind by deleted spaces, and the requeue button could never help
   them. `Space_Repository::delete_space()` now calls
   `Index_Queue::delete_for_space()`, so a space takes its queue with it. Found in
   about ten seconds of looking at a screen, missed by two sprints of tests.
2. **The preview's Collection field was a number input.** It is now a select of
   collection names and ids, because an operator should not look an id up in another
   tab and type it from memory.
3. **Providers were the wrong surface.** The create-space form offered OpenAI and
   Ollama, each with its own key to manage here. Credentials belong to the WordPress
   AI connectors, so the default provider is now a single `wordpress-ai` provider whose
   embeddings client arrives through `tainacan_rag_wordpress_ai_embed`; the vendor
   providers remain available through `tainacan_rag_register_embedding_providers` for a
   site that wants a direct key. Two places to configure one provider is two places to
   rotate a secret.

The lesson is not "test in a browser", it is that all three were *design* faults
visible only when the thing was used as a screen rather than called as a function.

### Notes for the next sprint

- Phase 3 opens with the capability manifest: walk `wp_get_abilities()`, filter to the
  `tainacan` namespace, emit name, description, input schema and annotations. The
  registry is the only source of truth, so the manifest is generated, never written.
- `filtered_out` and `degraded` are the two fields an agent should read before
  trusting a RAG answer; both belong in the manifest's notes.
