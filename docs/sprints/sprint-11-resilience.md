# Sprint 11 — Backfill and provider resilience

**Status:** done
**Phase:** 2 — Tainacan Semantic Search
**Work breakdown:** 2.6
**Depends on:** 10

## Goal

Index content that already exists, survive an interruption halfway through, and stop
hammering a provider that is down instead of retrying it row by row forever.

## Scope

| Class | Role |
|---|---|
| `Rag\Backfill` | resumable per-collection walk with a persisted cursor |
| `Rag\Provider_Circuit_Breaker` | pauses a provider+model pair after repeated failures |

Abilities: `tainacan/rag-backfill-start` and `tainacan/rag-backfill-step`. The queue
runner now reports `skipped` and `paused` so a stopped run says why.

## Decisions

**The cursor is the highest queued item ID, not an offset.** An offset walks a list
that shifts underneath it: an import running alongside the backfill would make it skip
or repeat items. An ID cursor is stable under inserts.

**Backfill only enqueues.** Embedding stays in the worker, so a backfill cannot become
a long request that times out halfway with no record of where it stopped.

**The breaker pauses the pair, not the row.** Row-level backoff already existed in the
queue, but it cannot help when the provider is down or the account is out of credit:
every row retries and fails on its own schedule, producing a slow trickle of doomed
requests. Three consecutive failures pause the provider+model pair, doubling from 60
seconds up to an hour. State lives in one option because a pause is about the
provider, not about any particular item.

**A paused pair stops the whole run**, leaving rows pending rather than failed. A
failure would burn an attempt and start a backoff clock for work that never got a real
chance to run.

## A fix the test forced

`step()` originally declared completion only when a batch came back short. With
exactly one batch of work left, the final step returned a full batch and reported
`running`, making an operator poll again for nothing. It now asks whether anything
remains beyond the new cursor when the batch was full. The test caught this because it
asserted the observable outcome — "the second step completes the backfill" — rather
than an internal counter.

## Live proof

Fake provider, real space, three published items:

| Check | Result |
|---|---|
| `rag-backfill-start` | total 3 |
| `rag-backfill-step` batch 2 | enqueued 2, status `running` |
| `rag-backfill-step` batch 2 again | enqueued 3, status `complete` |
| `rag-queue-run` | 3 processed, not paused |
| Three failures then `rag-queue-run` | **0 processed**, `paused` reported |
| Breaker cleared then `rag-queue-run` | 1 processed |

The fifth row is the point: the run stopped instead of retrying every pending row
against a provider already known to be failing, and the sixth shows it resumes
cleanly once the pause is lifted.

## What is still missing

The breaker records failures but does not yet distinguish a rate limit (429) from a
billing problem (402) or a bad model name, which deserve different pauses. The queue
does not retry `failed` rows automatically; an operator or the settings screen has to
put them back. Both belong with the admin console in Sprint 13, where an operator can
see the state before acting on it.

## Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `make guard`, `php -l` on two new classes | clean |
| 2 | `wp_get_abilities()` | 68 = 3 core + 65 Tainacan |
| 2 | `phpunit --filter Test_Abilities` | OK, 81 tests, 993 assertions |
| 2 | `make test` | OK, 482 tests, 5158 assertions |
| 2 | Live backfill and breaker smoke | 7 of 7 checks pass |
| 3 | Working tree on feature/taincan-ai, uncommitted | per instruction, commits are the operator's job |

## Execution log

Findings, appended as work happens. Not intentions.

### Testing without DDL, again

The backfill tests need a space to point at, but creating one runs `CREATE TABLE`,
which commits and breaks test isolation. Instead the test inserts a registry row
directly and gives it a table name nothing queries, because backfill only enqueues and
never touches the vector table. That keeps the behaviour under test real while staying
inside the transaction.

This is the third sprint where the same constraint shaped the tests. It is now a
standing rule for Phase 2: DDL is proven in a live smoke, logic is proven in the suite.

### Notes for the next sprint

- Sprint 12 is retrieval. It needs `get_active()`, the space table, and the
  visibility filter through the `Items` repository — all in place.
- `counts()` on the queue and `has_vector_index()` on the space are the two facts the
  status screen needs.
