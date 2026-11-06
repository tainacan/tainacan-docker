# Sprint 02 — Tier 1 content abilities

**Status:** done
**Phase:** 1 — Tainacan Abilities
**Work breakdown:** 1.3
**Depends on:** 01

## Goal

Make an agent able to create and manage content: collections, items, the publish
lifecycle, and item metadata values. Fifteen abilities over the controllers that
already exist.

## The blocking discovery

Sprint 01's bridge sends write parameters with `set_body_params()`. Every Tainacan
write controller reads the raw body instead:

```php
$body = json_decode( $request->get_body(), true );
```

Found in the collections controller at six places, the items controller at five,
and the item-metadata controller at three. `set_body_params()` populates a
different slot, so **every write ability built on the Sprint 01 bridge would have
arrived with an empty payload** — a create that silently does nothing, or a 500
from a `null` body. This is fixed first, before any row is added.

## Scope

### 1. Bridge: send a real JSON body

For non-`GET` methods the bridge now sets header, raw body and body params:

```php
$request->set_header( 'content-type', 'application/json' );
$request->set_body( wp_json_encode( empty( $params ) ? new \stdClass() : $params ) );
$request->set_body_params( $params );
```

Both are set on purpose: the raw body is what Tainacan reads, and body params keep
`$request['key']` working for code paths that use it.

**Acceptance:** a `POST` ability reaches the controller with a non-empty decoded
body; a test asserts the controller received the sent attributes.

### 2. Bridge: constant body values

New optional definition key `body_defaults`, merged under the caller's input.
It exists so `item-publish` and `item-unpublish` are one-line rows over
`PATCH /items/{item_id}` instead of new endpoints.

**Acceptance:** input overrides a default; a default fills in when input omits it.

### 3. Collections

| Ability | Route | Notes |
|---|---|---|
| `tainacan/collection-list` | `GET /collections` | filters and pagination pass through |
| `tainacan/collection-get` | `GET /collections/{collection_id}` | |
| `tainacan/collection-create` | `POST /collections` | `name` required |
| `tainacan/collection-update` | `PATCH /collections/{collection_id}` | |
| `tainacan/collection-delete` | `DELETE /collections/{collection_id}` | destructive |

### 4. Items

| Ability | Route | Notes |
|---|---|---|
| `tainacan/item-list` | `GET /items` | repository-wide, filterable by `collection_id` |
| `tainacan/item-list-in-collection` | `GET /collection/{collection_id}/items` | |
| `tainacan/item-get` | `GET /items/{item_id}` | |
| `tainacan/item-create` | `POST /collection/{collection_id}/items` | |
| `tainacan/item-update` | `PATCH /items/{item_id}` | |
| `tainacan/item-delete` | `DELETE /items/{item_id}` | destructive |
| `tainacan/item-publish` | `PATCH /items/{item_id}` | `body_defaults` status publish |
| `tainacan/item-unpublish` | `PATCH /items/{item_id}` | `body_defaults` status draft |

### 5. Item metadata values

| Ability | Route | Notes |
|---|---|---|
| `tainacan/item-metadata-list` | `GET /item/{item_id}/metadata` | note the singular `item` in this route |
| `tainacan/item-metadata-set` | `PATCH /item/{item_id}/metadata/{metadatum_id}` | payload key is `values`, not `value` |

The `values` plural is not a typo: the controller reads `$body['values']`. Sending
`value` produces a `null` metadata value rather than an error, which is exactly
the kind of silent wrongness these abilities must not have.

### 6. Annotations

Every row declares them, because the registry defaults are deliberately
conservative:

| Kind | readonly | destructive | idempotent |
|---|---|---|---|
| list, get | true | false | true |
| create | false | false | false |
| update, publish, set metadata | false | false | true |
| delete | false | true | true |

### 7. Tests

Extend `tests/test-abilities.php`:

| Test | Asserts |
|---|---|
| Registration of all rows | Every name in the registry table exists in the registry API |
| Body reaches the controller | Create a collection through the ability and read it back by id |
| Item round trip | Create collection, create item, get it, update the title, delete it |
| Publish lifecycle | `item-publish` sets status publish and `item-unpublish` sets draft |
| Metadata value | Set a metadatum value and read it back from the item metadata list |
| Write annotations | No writing ability claims `readonly` |
| `body_defaults` | Default applies, caller input wins |

## Out of scope

Media upload, workflow abilities, anything in Phase 2.

## Gate plan

Gate 1: `make guard`, `php -l` on changed files, plugin load.
Gate 2: `--filter Test_Abilities`, then `make test`, then a create-through-ability
smoke on the live site, then `make docs-build`.
Gate 3: submodule commit, findings below, activity log, board update.

## Exit criteria

1. Fifteen abilities registered and public.
2. A collection and an item created through abilities are readable through the
   REST API, proving the payload arrives.
3. No writing ability advertises `readonly`.
4. `make test` green.
5. Findings logged.

## Risks

| Risk | Mitigation |
|---|---|
| Empty write payload — the Sprint 02 discovery | Bridge sets the raw JSON body; round-trip test |
| `value` instead of `values` silently nulls metadata | Explicit test reading the value back |
| Wrong route pluralisation (`/items/{id}` vs `/item/{id}/metadata`) | Rows built from the live route table, not memory |
| A write row forgetting annotations and looking harmless | Defaults are conservative; lint test asserts no writer claims readonly |

## Execution log

Findings, appended as work happens. Not intentions.

### A plugin defect this sprint uncovered

**Creating a published item over REST had never worked.** `create_item()` called
`$this->item->validate()` and then inserted `$item_obj`. `prepare_item_for_database()`
returns a fresh `Entities\Item` and never assigns `$this->item`, so the code
validated an unrelated empty entity and inserted an unvalidated one.

It stayed hidden because `Repository::insert()` only enforces validation for
non-draft statuses:

```php
$required_validation_statuses = ['publish', 'future', 'private', 'pending'];
if ( in_array( $obj->get_status(), $statuses ) && ! $obj->get_validated() ) {
    throw new \Exception( 'Entities must be validated before you can save them' );
}
```

The existing REST create test posts only `title` and `description`, so the item
lands on draft, the guard is skipped, and the bug never fires. Any client that
asked for `status: publish` got an exception — which is precisely what an agent
loading a collection does. Fixed by validating `$item_obj` and reporting its
errors.

Two lessons worth carrying: a shared controller property is not per-request state
in a long-lived process, and a validation guard that only applies to some statuses
will hide a bug behind the default status.

### Corrected assumptions

- **`DELETE /items/{id}` trashes by default.** The route reads a `permanently`
  flag. The ability now exposes that flag rather than implying deletion, and the
  test asserts the item moves to `trash` first and disappears only on the second,
  permanent call.
- **The metadata payload key is `values`, plural.** A `value` key produces a null
  metadatum value with no error, so the test reads the value back rather than
  trusting the write.
- **`rest_validate_value_from_schema()` requires `type`.** A property carrying
  only a `description` throws `Undefined array key "type"` before the callback
  runs. `values` therefore declares a type list, because it legitimately accepts a
  scalar or an array.

### Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `make guard` | Clean |
| 1 | `php -l` on the four ability classes | No syntax errors |
| 2 | `wp_get_abilities()` count | 19 = 3 core + 16 Tainacan |
| 2 | `phpunit --filter Test_Abilities` | OK, 20 tests, 225 assertions |
| 2 | `make test` | OK, 421 tests, 4390 assertions |
| 2 | `make docs-build` | OK in strict mode |
| 3 | Working tree on feature/taincan-ai, uncommitted | item validation fix plus the content abilities |

### Notes for the next sprint

- `required_capability` is still a `read` floor on every row; the route's own
  permission callback is the real gate. Sprint 04 should raise the floor where a
  specific Tainacan capability is known, so a subscriber gets a clear refusal from
  the ability rather than a route-level error.
- The item and metadata routes disagree on pluralisation (`/items/{id}` but
  `/item/{id}/metadata`). Rows were built from the live route table for that
  reason.
