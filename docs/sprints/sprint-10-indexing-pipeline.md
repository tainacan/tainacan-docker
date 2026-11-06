# Sprint 10 — Chunking and the indexing pipeline

**Status:** done
**Phase:** 2 — Tainacan Semantic Search
**Work breakdown:** 2.4, 2.5
**Depends on:** 09

## Goal

Turn an item into vectors without blocking a save and without paying to re-embed
content that did not change.

## Three rules

**Never embed inline on save.** A provider round trip inside a save request blocks
the editor and times out on an import. Saving enqueues; a worker drains. The queue
is per space, because two spaces mean two embeddings of the same item and they can
fail independently.

**Never re-embed unchanged content.** Every chunk carries a `sha1` of its
*normalised* text, and only chunks whose hash is absent go to the provider. Without
normalisation a stray newline between saves would re-embed an entire document.

**Remove immediately, do not wait for the worker.** Unpublish, trash and delete drop
the vectors at once, because a stale vector is a result the user is no longer
allowed to see — the same reasoning that makes the visibility filter in retrieval
non-negotiable.

## Scope

| Class | Role |
|---|---|
| `Rag\Chunker` | normalise, split with overlap, hash. Pure string work |
| `Rag\Index_Queue` | queue table, idempotent enqueue, reserve, backoff on failure |
| `Rag\Indexer` | change capture, chunk building, hash diff, embed, insert, stale delete |

Abilities: `tainacan/rag-index-item` (enqueue) and `tainacan/rag-queue-run` (drain).

## Decisions

**Chunk size is measured in characters, not tokens.** Token counts need the model's
tokenizer, and a per-provider tokenizer would make chunk boundaries depend on which
provider happens to be active — so a provider switch would re-chunk everything. The
overlap is clamped to half the size, because an overlap at or above the size is an
infinite loop rather than a preference.

**The diff is a pure function.** `plan( $chunks, $existing_hashes )` returns what to
embed and what to delete with no database involved, which is what makes the
hash-skip behaviour testable instead of hopeful.

**The provider's `get_max_batch()` is respected.** Chunks are embedded in provider
sized batches, and a response with a different vector count than inputs is rejected
rather than paired up by position.

**Enqueue is idempotent.** An item already pending is not queued twice, so a burst of
metadata saves does not produce a burst of embedding calls.

## Live proof

Fake provider registered through the filter, real space, real item, no network:

| Check | Result |
|---|---|
| Create and activate a 384-dimension space | space 4 |
| Enqueue `tainacan/rag-index-item` | queued |
| `tainacan/rag-queue-run` | 1 item processed, **3 chunks stored** |
| Re-enqueue the unchanged item and run again | **0 embedded**, 3 unchanged, 3 rows |
| Remove the item | 3 removed, table empty |

That third row is the whole point of the sprint: the second run cost nothing.

## What is not indexed yet

Chunks come from the item title, the description and the extracted document text.
Item **metadata values** are not included: the item-metadata read API is a different
shape and guessing at it would produce chunks that quietly omit half the record.
Recorded as a gap rather than papered over — it belongs with retrieval in Sprint 12,
where a query can prove whether the omission hurts.

## Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `make guard`, `php -l` on three new classes and migrations | clean |
| 2 | `wp_get_abilities()` | 66 = 3 core + 63 Tainacan |
| 2 | `phpunit --filter Test_Abilities` | OK, 76 tests, 947 assertions |
| 2 | `make test` | OK, 477 tests, 5112 assertions |
| 2 | Live indexing smoke | 6 of 6 checks pass |
| 2 | Hook wiring on the live site | all three callbacks at priority 20 |
| 3 | Working tree on feature/taincan-ai, uncommitted | chunking and indexing |

## Execution log

Findings, appended as work happens. Not intentions.

### A test that measured the harness, not the code

The first version asserted `has_action( 'save_post', [ $indexer, 'on_save' ] )` and
failed, while the same check on the live site returned priority 20 for all three
callbacks. Asserting hook retention inside this harness measures the harness, not the
plugin, so the test was replaced with two behavioural ones: item post-type detection,
and a save on a regular post queuing nothing. The wiring itself is verified live and
recorded above.

This is the third time an assertion has been wrong rather than the code. The pattern
is consistent — asserting an implementation detail instead of an observable effect —
and the fix each time was to assert the effect.

### Notes for the next sprint

- Sprint 11 adds the resumable backfill and the provider circuit breaker. Backoff
  already exists at the queue level (`mark_failed` doubles the delay, capped at an
  hour), so the circuit breaker is about pausing a provider rather than a row.
- `has_vector_index()` and the queue counts are both ready for the status screen in
  Sprint 13.
