# Sprint 05 — Workflow abilities

**Status:** done
**Phase:** 1 — Tainacan Abilities
**Work breakdown:** 1.6
**Depends on:** 02, 03, 04

## Goal

Collapse multi-call sequences into single intents, which is the whole reason
abilities exist rather than a REST client. An agent should be able to say "stand
up this collection structure" or "load these twelve items with their metadata" and
mean it.

## Design: composites call abilities, never repositories

Every workflow method goes through `wp_get_ability( $name )->execute( $input )`.
It does not touch a repository, a controller or the bridge directly. That keeps
the permission floor, the payload shape and the validation of each step defined in
exactly one row, and it means a workflow cannot drift away from the primitives it
composes.

The trade-off is a deeper call stack and repeated schema validation. Both are
cheap next to the alternative, where a composite quietly implements a second,
slightly different version of "create an item".

## Scope

| Ability | Composes |
|---|---|
| `tainacan/collection-scaffold` | `collection-create`, then `metadata-create` per definition |
| `tainacan/item-create-with-metadata` | `item-create`, optional `item-set-document`, `item-metadata-set` per value |
| `tainacan/batch-items-create` | `item-create-with-metadata` per item |
| `tainacan/bulk-set-status` | `item-publish`, `item-unpublish` or `item-delete` per item |

## The partial-failure contract

A composite is several writes, so it can fail halfway. Returning a bare error
forces the caller to guess what exists, and guessing produces duplicates. Each
workflow therefore reports its state:

- **scaffold** on a metadata failure returns `WP_Error` with data carrying
  `collection_id` and `metadata_created`, so the retry knows the collection exists.
- **item-create-with-metadata** returns `metadata_set` and a `failures` array; a
  failed metadata value does not discard the item that was already created.
- **batch-items-create** returns `created`, `item_ids` and `failures` with the
  index of each bad row.
- **bulk-set-status** returns `succeeded` and `failures` per item.

## The schema decision that follows from it

`title` is deliberately **not** required in the `batch-items-create` item schema.
Marking it required would let one malformed row reject the entire batch at the
REST validation layer, before the callback runs — the opposite of the point of
batching. Each row fails on its own and is reported by index, so 499 good items
still land.

This is the same reasoning as the partial-failure contract, applied one layer
earlier: validation that aborts the batch is not a safety feature when the caller
can fix individual rows.

## Guardrails

- Batch size is capped (`tainacan_ability_batch_max`, default 100 for creates,
  200 for status updates) so a single call cannot time out and leave the caller
  with no idea what happened.
- `bulk-set-status` maps an `operation` enum onto existing abilities instead of
  reimplementing status transitions, and is annotated `destructive` because one of
  its operations trashes content. Trash is recoverable; the `permanently` flag on
  `item-delete` is the irreversible one, and the description says so.

## Tests

| Test | Asserts |
|---|---|
| Workflow abilities registered | All four resolve |
| Scaffold | Creates a collection and two metadata definitions, visible through `metadata-list` |
| Create with metadata | Sets a value that reads back through `item-metadata-list` |
| Batch reports failures | Two items created, the third row fails alone and is reported at index 2 |
| Bulk status | Draft items publish, then one trashes |

## Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `make guard` | Clean |
| 1 | `php -l` on the six ability classes | No syntax errors |
| 2 | `wp_get_abilities()` count | 50 = 3 core + 47 Tainacan |
| 2 | `phpunit --filter Test_Abilities` | OK, 38 tests, 659 assertions |
| 2 | `make test` | OK, 439 tests, 4824 assertions |
| 3 | Working tree on feature/taincan-ai, uncommitted | Workflow abilities |

## Execution log

Findings, appended as work happens. Not intentions.

### What the composition model bought

Because the workflows delegate, three payload traps found in earlier sprints did
not have to be re-learned here: `values` plural, `document` as a string, and
`metadatum_id` at the top level of a filter payload are all encoded once in the
primitive rows. The composite just passes input through and inherits the
correction.

That is the concrete payoff of the rule, and it is worth keeping in Phase 2 where
the temptation to write a bespoke indexing path will be stronger.

### Notes for the next sprint

- Sprint 06 closes Phase 1: the `rest-request` escape hatch for the long tail, the
  `meta.public` lint, and verification against a real MCP client.
- Import and export sessions were in the original Sprint 05 scope and are deferred
  to the escape hatch plus Sprint 06. They are session-oriented (create, map, run,
  poll) and deserve their own sprint rather than being squeezed in half-built.
