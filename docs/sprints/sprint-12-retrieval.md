# Sprint 12 — Retrieval

**Status:** done
**Phase:** 2 — Tainacan Semantic Search
**Work breakdown:** 2.7
**Depends on:** 11

## Goal

Turn the index into answers: one query, one space, ranked items with snippets, and
no result a caller is not allowed to open.

## Scope

| Class | Role |
|---|---|
| `Rag\Semantic_Search` | space-scoped search, similar-items, post-ANN visibility |

Abilities: `tainacan/rag-search` and `tainacan/rag-similar-items`, both at the read
floor because the results are re-checked against the reader's own permissions.

## Decisions

**The visibility filter runs after the scan, through the repository.** A vector index
cannot know about capabilities, so ranking and permission are separate stages:
candidates come from the space table, then the candidate item IDs are re-fetched
through `Repositories\Items`, which applies collection readability, post status and
the per-collection `read_private_posts` capability. Only survivors are returned, and
the count of what was dropped is reported as `filtered_out` so the filter is
observable instead of invisible.

**Over-fetch, then trim.** Asking the index for exactly `limit` candidates means a
page of drafts returns almost nothing. Every query pulls `4 × limit` candidates
(capped at 200) and trims to `limit` after filtering.

**`publish` is the default status, and `private` is added only when it is safe.** The
status list starts at `publish`. The user must hold `read_private_posts` in *every*
collection present among the candidates before `private` is added, because a mixed
status list passed to `WP_Query` bypasses WordPress's own capability check — one
unreadable collection in the mix would make that bypass real.

**A password-protected item is not a hit.** The snippet is content, so an item with a
password is dropped unless the caller can edit it. Unpublishing already removes
vectors, but a password can be added without a status change.

**`similar_to_item()` reads the stored chunk instead of re-embedding the item.** The
seed text is the item's own first chunk. That makes "not indexed" a distinct,
actionable answer (`tainacan_rag_item_not_indexed`) instead of a comparison against a
different model's geometry, and it costs nothing when the provider is paused — which
is exactly the moment an operator wants to explore the index.

**The distance is computed twice in the statement.** Once in `SELECT` so the caller
has the score, once in `ORDER BY` because `ORDER BY VEC_DISTANCE_COSINE(...) LIMIT n`
is the only form a vector index can serve. Ordering by the `distance` alias would look
tidier and permanently rule the index out. The duplication fixes the parameter order,
and a test pins the alignment rather than trusting it.

## A defect the sprint exposed

`Indexer` wrote the **space id** into the `collection_id` column. The table is already
per space, so every row carried the same value and `collection_id IN (...)` matched
everything: a search scoped to one collection silently returned items from all of
them. `Indexer::collection_id_for()` now maps the item's post type back to its
collection, and the live smoke proves both directions of the filter. Vectors indexed
before this fix hold a space id in that column and must be rebuilt.

## The ANN index is created but not used

The plan for this sprint assumed `ORDER BY ... LIMIT` would reach the vector index.
Measured on MariaDB 11.8.9 with 2,000 rows in a space table:

| Shape | Plan |
|---|---|
| `ORDER BY VEC_DISTANCE_COSINE(col, VEC_FromText('<literal>')) LIMIT 10` | `type=ALL`, `Using filesort` |
| same, with `WHERE collection_id = 1` | `type=range` on the collection key, `filesort` |
| same, selecting the distance too | `type=ALL`, `filesort` |
| `FORCE INDEX (vec_idx)` | still `type=ALL`, `filesort` |

The index exists (`INDEX_TYPE = 'VECTOR'`) and vectors are stored, but the optimizer
does not choose it for any shape tried. Retrieval is therefore correct and bounded,
but it is a scan over the space table, not an ANN scan. That is recorded here rather
than smoothed over: Sprint 08 proved the index can be *created*, which is a weaker
claim than the index being *used*, and the two had been allowed to blur.

## Live proof

Fake provider, real space, two collections, three items (one of them unpublished and
deliberately indexed so its vector is stale):

| Check | Result |
|---|---|
| Space created with a vector index | pass |
| Three items indexed | pass, 2 chunks each |
| Anonymous search returns results | 2 items |
| A draft vector is never returned | pass |
| The drop is reported | `filtered_out` = 1 |
| Scores are real distances | pass |
| Snippets carry content | pass |
| Collection A scoping excludes B | pass |
| Collection B scoping excludes A | pass |
| Similar items finds the twin | pass |
| Similar items excludes the seed | pass |
| The generated statement is accepted and planned | pass, 16 of 16 |

## What is still missing

- Item metadata values are still not chunked (unchanged from Sprint 10), so a search
  only sees title, description and extracted document text.
- `coll` on the space table is the only index the optimizer picks; until the vector
  index is actually chosen, a space table is a linear scan per query.
- No hybrid ranking. Keyword plus vector belongs in `Search_Engine`, which is a
  separate decision from this one.
- Image spaces exist in the registry but nothing retrieves against them yet: there is
  no image chunking and no image-capable provider in the default list.

## Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `php -l` on the new class and the two edited files | clean |
| 2 | `phpunit --filter Test_Abilities` | OK, 93 tests, 1037 assertions |
| 2 | `make test` | OK, 494 tests, 5202 assertions |
| 2 | Live retrieval smoke | 16 of 16 checks pass |
| 3 | `make guard` | clean |
| 3 | `make docs-build` | OK |

## Execution log

Findings, appended as work happens. Not intentions.

### The echo of the query became "Array"

`query_space()` reused the parameter name `$query` for the statement it had just
built, so `'query' => (string) $query` stringified an array. The smoke caught it as a
PHP warning plus a response field reading `Array`, which is the kind of thing a hand
test on the happy path would never look at. The local is now `$statement`.

### Testing the invisible half

`collapse_hits()` takes the rows and the visible IDs as plain arguments, so the leak
this sprint exists to prevent is unit-tested without a database: a row for an
unreadable item is passed in, and the assertion is that its text is absent from the
output. The repository re-fetch itself is covered by an anonymous-user test that
creates a published item and a draft and asserts only the published ID survives. DDL
still only happens in the live smoke, per the standing Phase 2 rule.

### Notes for the next sprint

- `Index_Queue::counts()` and `Space_Repository::has_vector_index()` remain the two
  facts the status screen needs, and `Semantic_Search::search()` is now safe to wire
  to a preview button because it filters before returning text.
- The tri-state `filtered_out` count is the number an operator should see next to a
  preview: it distinguishes "nothing matched" from "matches were hidden".
