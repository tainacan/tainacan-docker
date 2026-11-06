# Sprint 03 — Tier 1 structure abilities

**Status:** done
**Phase:** 1 — Tainacan Abilities
**Work breakdown:** 1.4
**Depends on:** 01

## Goal

Let an agent design a collection rather than only fill one: metadata definitions,
metadata sections, taxonomies and terms, filters, facets, and the read-only
type lists that make the write payloads valid.

## A decision reversed from Sprint 02

Sprint 02's notes said Sprint 03 should raise `required_capability` from the
blanket `read` floor to the specific Tainacan capability wherever it is known.
That is wrong, and this sprint deliberately does not do it.

Tainacan grants structure permissions **per collection**:
`tnc_col_%d_edit_metadata`, `tnc_col_%d_edit_metasection`, `tnc_col_%d_edit_filters`,
`tnc_col_%d_delete_metadata`, plus the `tnc_col_all_*` variants. A curator with
`tnc_col_5_edit_metadata` and nothing global is a normal, intended configuration.

A global floor such as `tainacan_edit_collections` would refuse that curator at the
ability layer, before the route ever gets to check the collection-scoped
capability. The floor would not tighten security; it would break delegation.

So every row keeps `required_capability => 'read'`, which only excludes anonymous
traffic, and the route's own permission callback remains the authority. The
comments in the registry say this explicitly so nobody "fixes" it later.

## Scope

| Group | Abilities |
|---|---|
| Metadata definitions | `metadata-list`, `metadata-get`, `metadata-create`, `metadata-update`, `metadata-delete` |
| Metadata sections | `metadata-section-list`, `-create`, `-update`, `-delete` |
| Taxonomies | `taxonomy-list`, `taxonomy-get`, `taxonomy-create`, `taxonomy-delete` |
| Terms | `term-list`, `term-get`, `term-create`, `term-delete` |
| Filters | `filter-types-list`, `filter-list`, `filter-get`, `filter-create`, `filter-delete` |
| Facets | `facet-get` |

Twenty-three new rows, so the registry holds thirty-nine Tainacan abilities
alongside the three core ones.

## Payload shapes worth recording

These were read from the controllers, not assumed, and three of them surprise:

| Endpoint | Shape |
|---|---|
| `POST /collection/{id}/metadata` | flat metadatum array; `metadata_type` is a class name such as `Tainacan\Metadata_Types\Text` |
| `POST /collection/{id}/metadata-sections` | flat section array, `collection_id` comes from the route |
| `POST /taxonomies` | flat taxonomy array |
| `POST /taxonomy/{id}/terms` | flat term array, `taxonomy_id` comes from the route |
| `POST /filters` | **nested**: `{ "filter": { ...attributes }, "filter_type": "..." }` |

The filter payload is the odd one out: it nests attributes under `filter` and takes
the type as a sibling `filter_type`, which the controller matches case-insensitively
against the registered types. `filter-types-list` exists so an agent can discover a
valid value instead of guessing.

## Tests

| Test | Asserts |
|---|---|
| All rows registered | Every new name resolves in the registry |
| Metadata round trip | Create a metadatum through the ability, find it in `metadata-list`, delete it |
| Section round trip | Create a section, find it in the list |
| Taxonomy and term | Create a taxonomy, create a term in it, find the term in `term-list` |
| Filter types | `filter-types-list` returns a non-empty list |
| Filter create | Build a filter from a real type returned by `filter-types-list`, then find it in `filter-list` |
| Capability floor | Rows keep a `read` floor; the comment explaining why is not decorative |

## Gate plan

Gate 1: `make guard`, `php -l`, ability count.
Gate 2: `--filter Test_Abilities`, `make test`, `make docs-build`.
Gate 3: submodule commit, findings, activity log, board.

## Risks

| Risk | Mitigation |
|---|---|
| Guessing a filter payload shape | Shape read from `prepare_item_for_database`, and the test builds from a real type |
| Hardcoding a filter type that some install lacks | Test takes the first type returned by `filter-types-list` |
| Raising the capability floor and breaking delegation | Deliberately not done; documented in the registry and here |
| `metadata_section_id` regex also accepts `default_section` | Rows pass the value through untouched rather than validating it as an integer |

## Execution log

Findings, appended as work happens. Not intentions.

### A second shared-state defect, this time two controllers

Adding rows that create a taxonomy and a term exposed the same bug as Sprint 02's
item fix, in two more places. `prepare_item_for_database()` in both the taxonomies
and the terms controllers mutated a **single shared entity** created once on
`init` and never reset it. The second create in one PHP process therefore reused
an entity that already carried an ID, `parent::insert()` returned `false`, and
`create_item()` called `tainacan_register_taxonomy()` on that `false`:

```text
Error: Call to a member function tainacan_register_taxonomy() on false
```

It never shows over HTTP, where every request is a fresh process, which is why the
existing taxonomies test passes in isolation. It fails the moment anything reuses
the controller within a process — the test suite, a persistent worker, a WP-CLI
loop — which is exactly the shape of an agent loading a repository in one run.

Both controllers now start each create from a fresh entity. A regression test
creates two taxonomies and two terms in a single test run and asserts distinct IDs,
because a test that creates only one of each cannot see this class of bug.

### Corrected assumptions

- **`metadatum_id` sits at the top level of the filter payload**, not inside
  `filter`. The controller reads `$body['metadatum_id']` and throws
  `You need provide a metadatum id` otherwise. `filter-create` therefore uses the
  collection-scoped route and takes `metadatum_id` as a sibling of `filter` and
  `filter_type`.
- **Term listings can hide terms that no item uses.** Asserting through
  `term-list` produced a green create and an empty list, which says nothing. The
  test now reads the created term back by ID.
- **The capability floor decision survived contact.** Verified against
  `tainacan-roles.php`: structure permissions are per collection
  (`tnc_col_%d_edit_metadata`, `tnc_col_all_edit_filters`, and so on), so a global
  floor would refuse legitimate curators. A test now pins the floor at `read` so a
  later "tightening" cannot break delegation by accident.

### Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `make guard` | Clean |
| 1 | `php -l` on the registry | No syntax errors |
| 2 | `wp_get_abilities()` count | 42 = 3 core + 39 Tainacan |
| 2 | `phpunit --filter Test_Abilities` | OK, 28 tests |
| 2 | Cross-class run with taxonomies and terms | OK, 56 tests, 607 assertions |
| 2 | `make test` | OK, 429 tests, 4679 assertions |
| 2 | `make docs-build` | OK in strict mode |
| 3 | Working tree on feature/taincan-ai, uncommitted | Controller fixes plus structure abilities |

### Notes for the next sprint

- Two shared-state defects in three controllers suggests auditing the remaining
  controllers for the same `$this->entity` pattern before building workflows on
  them. Cheaper to find now than inside a Tier 2 composite ability.
