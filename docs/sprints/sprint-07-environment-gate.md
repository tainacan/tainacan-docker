# Sprint 07 — Environment gate

**Status:** done
**Phase:** 2 — Tainacan Semantic Search
**Work breakdown:** 2.1
**Depends on:** 06

## Goal

Decide, honestly, whether this host can store and search vectors, and make the
admin surface say so. A menu that renders controls which cannot work is worse than
a menu that explains what is missing.

This sprint is the gate for all of Phase 2: nothing else is worth building if the
answer is no.

## Scope

- `Tainacan\Rag\Environment_Check`, in `classes/rag/`. The autoloader already
  resolves `Tainacan\Rag\X` to `classes/rag/class-tainacan-x.php` through its
  generic namespace branch, so no autoloader change was needed — a three-segment
  class name is enough.
- `tainacan/rag-environment` ability, `manage_options` floor, cached verdict with a
  `refresh` flag.
- Verdict grading: `ready`, `degraded`, `unsupported`.

## The probe decision that came from the database

Two things were tried before settling the design, and both changed it:

**A real `CREATE TABLE` cannot be used.** It causes an implicit commit, which
breaks the transaction rollback WordPress test cases depend on. Probes use
`CREATE TEMPORARY TABLE`, which does not commit.

**But MariaDB forbids a vector index on a temporary table:**

```
ERROR 1796 (HY000): Cannot create VECTOR index on temporary InnoDB table
```

So the ANN index is *not* probed. The diagnostic proves the `VECTOR` type, the
`VEC_FromText` cast and `VEC_DISTANCE_COSINE` ordering in one temporary-table pass,
and reports the index as `deferred` with the reason. Claiming to have checked the
index would have been a lie, and a fake green tick on the one check that most
affects query performance is exactly the kind of dishonesty that costs an operator
a week later. Index support is proven when the first real space table is created
in Sprint 08, where a failure names the configuration step.

**Dimensions are probed, not hard-coded.** 384, 768, 1024, 1536 and 3072 are tried
individually because the accepted maximum is a server property. The verdict reports
the largest one that worked rather than a number someone guessed.

## Checks and how they grade

| Key | Blocking | Detail |
|---|---|---|
| `abilities_api` | yes | Phase 1 prerequisite |
| `database` | yes | engine and version string |
| `vector_storage` | yes | temporary table accepted rows and ranked them |
| `max_dimensions` | no | largest probed dimension |
| `vector_index` | no | explicitly deferred, with the reason |

Grading: `unsupported` when the Abilities API is absent, `degraded` when a blocking
vector check fails but abilities work, `ready` otherwise. The distinction matters
because `degraded` still means Phase 1 is useful.

## Caching

The verdict is stored in `tainacan_rag_environment` with `checked_at` and
`db_version`. It is recomputed when it is older than an hour **or when the server
version string changed**, which is the case that matters after a stack upgrade and
the one a plain TTL would miss for up to an hour.

## Tests

| Test | Asserts |
|---|---|
| Ability registered | present in the registry |
| Verdict shape | status is one of three values; every check carries key, label, ok, blocking, requirement |
| Ready on this stack | verdict is `ready`, version contains mariadb, dimensions ≥ 384 |
| Stale cache discarded | a poisoned entry with a foreign `db_version` is ignored; an expired entry is ignored |
| Subscriber refused | a subscriber gets `WP_Error` because the floor is `manage_options` |

## Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `make guard`, `php -l` | clean |
| 2 | `phpunit --filter Test_Abilities` | OK, 50 tests, 802 assertions |
| 2 | `make test` | OK, 451 tests, 4967 assertions |
| 2 | Live verdict on this stack | `ready`, MariaDB 11.8.9, max dimension 3072 |
| 3 | Working tree on feature/taincan-ai, uncommitted | environment gate |

## Execution log

Findings, appended as work happens. Not intentions.

### Live output on the development stack

```text
status=ready db=11.8.9-MariaDB-ubu2404 max_dims=3072
  - abilities_api: ok
  - database: ok
  - vector_storage: ok
  - max_dimensions: ok
  - vector_index: deferred
```

### One coupling worth noting

`get_verdict()` takes a boolean, and an ability callback receives the input array.
Passing the method straight to the registry meant an array read as truthy and forced
a recompute on every call, quietly defeating the cache. Hence `for_ability()`, which
maps an explicit `refresh` flag. Small, but it is the sort of wiring mistake that
turns a cache into a no-op without anyone noticing.

### Notes for the next sprint

- Sprint 08 creates the space registry and the per-space tables. That is where the
  index is actually proven, and where a failure must name the dimension that was
  rejected.
- The `max_dimensions` value is informational for the UI: it tells an operator
  which providers are viable before they configure one.
