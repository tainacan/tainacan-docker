# Sprint 01 — Ability foundation and REST bridge

**Status:** done
**Phase:** 1 — Tainacan Abilities
**Work breakdown:** 1.1, 1.2 (plus a one-route vertical slice)
**Depends on:** nothing

## Goal

Make Tainacan able to register abilities at all, and prove the execution path with
one real route, so that every later sprint is a table row rather than new
infrastructure.

The whole sprint hinges on a single non-obvious fact: an ability registered
anywhere other than inside the `wp_abilities_api_init` action returns `null` and
fires `_doing_it_wrong`, which is silent when `WP_DEBUG` is off. Categories are
worse: they register on `wp_abilities_api_categories_init`, a *separate earlier*
hook, and an ability referencing an unregistered category simply never appears.
This sprint exists to get that sequencing right once, with tests.

## Scope

### 1. Autoloader and constants

Add to `tainacan/src/classes/tainacan-creator.php`:

- `const TAINACAN_ABILITIES_DIR = __DIR__ . '/abilities/';`
- a branch in `tainacan_autoload()` for `$class_path[1] === 'Abilities'`, copying
  the existing `Integrations` case

**Acceptance:** `Tainacan\Abilities\Abilities_Bootstrap` resolves from
`classes/abilities/class-tainacan-abilities-bootstrap.php`, and no
`Tainacan: Class ... not found` appears in `make logs`.

Do **not** add the directory to `DIRS`. The explicit branch runs first, and the
`DIRS` loop would otherwise probe every ability file for every unrelated class.

### 2. Bootstrap on the two hooks

`Abilities_Bootstrap` (singleton, per `Traits\Singleton_Instance`) required from
`tainacan-creator.php` next to the other `get_instance()` calls. It adds exactly
two actions and nothing else:

```php
add_action( 'wp_abilities_api_categories_init', [ $this, 'register_categories' ] );
add_action( 'wp_abilities_api_init',            [ $this, 'register_abilities' ] );
```

Guarded by `if ( ! function_exists( 'wp_register_ability' ) ) { return; }` so the
declared `Requires at least: 6.5` stays true and older core degrades quietly.

**Acceptance:** on core without the Abilities API the plugin loads with no fatal
and no notice.

### 3. Category registration

`Abilities_Categories` registers the namespace categories on the categories hook.
Sprint 01 registers only the ones it uses; later sprints add theirs.

Slugs must match `[a-z0-9]+(?:-[a-z0-9]+)*`.

**Acceptance:** every slug referenced by a registered ability exists in
`wp_get_ability_categories()`.

### 4. Declarative ability table

`Abilities_Registry` holds one row per ability: name, label, description,
category, route, method, schema, annotations, required capability. The bridge
reads routes from `rest_get_server()->get_routes()` at runtime — the table stores
the *route*, never a transcription of its arguments, because 137 hand-copied
schemas will rot within one release.

**Acceptance:** adding an ability is a one-row change for simple reads, and the
table is the single place `meta.public` and annotations live.

### 5. REST bridge

`Ability_Bridge`:

1. resolves the route to a handler from the REST server,
2. builds a `WP_REST_Request` from ability input (query, body, url params),
3. calls the controller's `permission_callback` with that same request and
   returns the `WP_Error` unchanged when it refuses,
4. calls the controller callback,
5. normalizes: `WP_REST_Response` → `get_data()`, escalating status `>= 400` to
   `WP_Error`; pass `WP_Error` through; anything else as-is.

No HTTP loopback: containers cannot reach the published `WP_SITE_URL`, which is
the same failure mode as background processes stuck in `waiting`.

**Acceptance:** unit tests cover all five normalization paths, and a permission
refusal never reaches the controller callback.

### 6. Vertical slice — `tainacan/metadata-types-list`

One real ability over `GET /tainacan/v2/metadata-types`, chosen because it is the
cheapest route that exercises the whole path: no required arguments, no writes, a
permission callback that exists today.

Registered with:

```php
'meta' => [
    'public'      => true,
    'mcp'         => [ 'type' => 'tool' ],
    'annotations' => [ 'readonly' => true, 'destructive' => false, 'idempotent' => true ],
],
```

**Acceptance:** `wp_get_ability( 'tainacan/metadata-types-list' )->execute( [] )`
returns the same data as `rest_do_request()` for the same route.

### 7. Tests — `tainacan/tests/test-abilities.php`

Filename matters: `test-*.php` is collected, `__test-*` and `_test-*` are skipped.

| Test | Asserts |
|---|---|
| Registration | The ability appears in `WP_Abilities_Registry` |
| Hook order | Categories exist before abilities; a missing category fails the test, not silently disappears |
| Registry lint | Every ability has `label`, `description`, a registered `category`, `meta.public`, and `annotations` |
| Execute parity | Ability output equals `rest_do_request()` output |
| Permission refused | A logged-out user gets `WP_Error` and the controller callback is never called |
| Degraded core | With the Abilities API absent, the bootstrap returns without a notice |

### 8. Repository bookkeeping

The three new pages must be listed in `mkdocs.yml` under `nav`, which cannot be
edited from a Markdown-only mode:

```yaml
  - Sprints:
      - Roadmap: sprints/roadmap.md
      - Sprint 01 Foundation and bridge: sprints/sprint-01-foundation-and-bridge.md
  - Progress:
      - Activity log: progress/activity-log.md
```

**Acceptance:** `make docs-build` passes in strict mode.

## Out of scope

Collections, items, media, workflows, MCP client verification, anything in
Phase 2. Sprint 02 starts Tier 1 content.

## Gate plan

**Gate 1 — Build and load**

```sh
make guard
make wp ARGS="eval 'echo TAINACAN_VERSION;'"
```

**Gate 2 — Tests and smoke**

```sh
make test
make wp ARGS="eval 'echo count( wp_get_abilities() );'"
make wp ARGS="eval 'var_dump( wp_has_ability( \"tainacan/metadata-types-list\" ) );'"
```

**Gate 3 — Checkpoint**

- Commit inside `tainacan/` as `sprint-01: ability foundation and REST bridge`.
- Fill the execution log below with findings.
- One line in [`../progress/activity-log.md`](../progress/activity-log.md).
- Flip the board row in [`roadmap.md`](roadmap.md).

## Exit criteria

1. The plugin registers at least one ability, visible in `wp_get_abilities()` and
   at `/wp-abilities/v1/abilities`.
2. Categories resolve before abilities, proven by a test.
3. The bridge normalizes all five result shapes, proven by tests.
4. `make test` green and no `Class ... not found` in the logs.
5. Findings logged on this page.

## Risks

| Risk | Mitigation |
|---|---|
| Registering on `init` or at file scope — silent absence | Only the two hooks; a test asserts registration |
| Category registered after abilities | Separate earlier hook; order asserted by test |
| `meta.public` omitted, so no client sees the ability | Registry lint test |
| 2-segment class name lands in `classes/` root, not `abilities/` | Explicit autoloader branch, checked in Gate 1 |
| Bridge accidentally running the callback after a permission refusal | Test asserts the callback is not invoked |

## Execution log

Findings, appended as work happens. Not intentions.

### Where the implementation deviates from the plan

1. **The bridge uses `rest_do_request()` instead of hand-invoking the controller's
   `callback` and `permission_callback`.** The plan said "call the controller
   callback directly". `rest_do_request()` is the same no-HTTP path but goes
   through real dispatch, so route regex matching, argument validation and the
   controller's own permission check apply exactly as they do for an HTTP client.
   Hand-invoking would have created a second dispatch path that drifts. Proven by
   the permission-refusal test: `POST /tainacan/v2/collections` as an anonymous
   user returns `WP_Error` and the controller never runs.
2. **`output_schema` is omitted unless a row provides one.** The Abilities API
   validates the callback's return value against the declared schema, and an
   imprecise schema over a rich Tainacan payload produces false failures. This is
   a deliberate omission, not an oversight, and Sprint 02 will keep it for
   collection and item payloads.
3. **Annotation defaults were flipped to conservative** in a follow-up commit. An
   unannotated row was described as readonly, which is the one annotation error
   that could make a client auto-approve a write. Rows must now declare themselves
   as reads.

### Things that cost time

- **`meta.public` alone is enough on 7.1.** After registration the stored meta
  contained `show_in_rest: true` alongside `public: true`, derived by core.
  `wp_get_abilities( [ 'meta' => [ 'show_in_rest' => true ] ] )` and
  `GET /wp-abilities/v1/abilities` both list the ability, and the listing
  controller filters on `meta.show_in_rest`.
- **A false negative in my own smoke test.** The first REST visibility check
  reported MISSING because it searched `json_encode()` output, where `/` is
  escaped as `\/`. Compare names from `get_data()`, never from encoded JSON.
- **`mkdocs build --strict` fails on Markdown links to non-documentation files.**
  Two links into `tainacan/src/...php` aborted the build. Non-doc paths must be
  code spans, not links.

### Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `make guard` | `GUARD OK: no WordPress core artifacts found.` |
| 1 | `php -l` on the four ability classes and `tainacan-creator.php` | No syntax errors |
| 1 | `make wp` plugin load | Version echoes; `wp_has_ability( 'tainacan/metadata-types-list' )` is true |
| 2 | `phpunit --filter Test_Abilities` | OK, 12 tests, 32 assertions |
| 2 | `make test` | OK, 412 tests, 4194 assertions |
| 2 | `GET /wp-abilities/v1/abilities` | 200, 4 abilities, includes `tainacan/metadata-types-list` |
| 2 | `make docs-build` | Docs build OK in strict mode |
| 3 | Working tree on feature/taincan-ai, uncommitted | ability classes, bridge and the test suite |

### Observations for later sprints

- `Abilities_Categories` already declares all eight categories, so later sprints
  only add registry rows. The lint test fails if a row names a category that is
  not in that list.
- The `tainacan_register_abilities` filter is the seam Phase 2 uses for RAG rows
  and Phase 3 uses to generate the capability manifest.
- `rest_do_request()` means an ability row costs a route, a method and a few
  metadata fields. That is what makes Tier 1 in Sprint 02 a table-filling job.
