# Sprint 08 — Vector spaces and storage

**Status:** done
**Phase:** 2 — Tainacan Semantic Search
**Work breakdown:** 2.2
**Depends on:** 07

## Goal

Give embeddings somewhere to live. A space is provider + model + modality +
dimensions, and it owns one physical table built for exactly that dimension. This
is the sprint that makes arbitrary embedding sizes possible, and the one where the
ANN index — deferred by the diagnostics in Sprint 07 — is actually proven.

## Why one table per space

`VECTOR(n)` needs a literal dimension in the column type. That rules out a shared
table unless you either accept a fixed catalogue of sizes as null-padded columns or
create a per-dimension table anyway.

- **Any dimension works.** The table is built for the dimension the caller supplies,
  after the environment report confirms the server accepts it.
- **No wasted storage.** A wide table with `v384, v768, v1536, v3072` columns spends
  a row's worth of NULLs on every insert and still cannot hold 1024.
- **Drop and rebuild.** Switching provider means dropping one table, not migrating a
  shared one.
- **Correct isolation.** Vectors from different models are not comparable even at
  equal dimensions, so a query belongs to exactly one space.

`Space_Repository` owns the registry (`{prefix}tainacan_vec_spaces`) and the DDL for
space tables. Table names come from a strict sanitiser and are truncated to fit
MySQL's 64-character identifier limit, because a caller-supplied string must never
reach DDL.

## Four findings

**1. The migration class cannot hold helpers.** `run_migrations()` walks
`get_class_methods()` and *calls every method as a migration*. A private helper
placed there would be invoked as one. The DDL therefore lives in the repository and
the migration method is a one-line call.

**2. DDL cannot be exercised inside the test suite.** `CREATE TABLE` causes an
implicit commit, which breaks the transaction rollback the suite relies on — the
same constraint that shaped Sprint 07's probes. So the tests assert the generated
SQL, the sanitiser and every validation path, and the real table is created and
inspected in a live smoke outside the transactional suite.

**3. A silent bug in `delete_space`.** It read `$space['table_name']` while the
normaliser exposes `table`, so `DROP TABLE IF EXISTS ` ran with an empty identifier
and dropped nothing, then reported success. The live smoke caught it; a unit test
now pins the row shape that other methods read, because a test that only exercises
validation cannot see a wrong array key.

It also left an orphaned table with no registry row. Re-creating the space then
fails with a clear `Table ... already exists`, which is the right behaviour —
adopting a stray table silently could destroy data — but it does mean an operator
may need to drop one by hand. Recorded rather than hidden.

**4. `VECTOR INDEX` is not what MariaDB reports back.** It normalises the clause to
`VECTOR KEY \`vec_idx\` (\`v\`)` in `SHOW CREATE TABLE`, so a substring check for
"VECTOR INDEX" gives a **false negative on a table that does have the index**. The
reliable check is `INFORMATION_SCHEMA.STATISTICS` with `INDEX_TYPE = 'VECTOR'`, and
that is now `has_vector_index()`. The first smoke run reported the index missing
when it was there — worth remembering before trusting a string match against DDL.

## Live proof

Nine checks against the site, not the test database:

| Check | Result |
|---|---|
| Create a 384-dimension text space | space 3, table `wp_tainacan_vec_openai_text_embedding_3_small_text_384` |
| ANN index present | yes, via `INDEX_TYPE = 'VECTOR'` |
| Insert two opposing vectors | 2 rows |
| Nearest neighbour for the first | item 1, distance `0` |
| Activate | yes |
| List | 1 space, active text = 3 |
| Delete | yes |
| Table gone | yes |
| Registry empty | yes |

## Abilities

| Ability | Notes |
|---|---|
| `tainacan/rag-space-list` | spaces plus the active one per modality |
| `tainacan/rag-space-create` | builds the table for the given dimension |
| `tainacan/rag-space-activate` | exactly one active per modality |
| `tainacan/rag-space-delete` | destructive, drops the table |

All four use a `manage_options` floor, alongside `tainacan/rag-environment`.

## Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `make guard`, `php -l` | clean |
| 2 | `phpunit --filter Test_Abilities` | OK, 59 tests, 864 assertions |
| 2 | `make test` | OK, 460 tests, 5029 assertions |
| 2 | Live smoke | 9 of 9 checks pass |
| 3 | Working tree on feature/taincan-ai, uncommitted | space registry and storage |

## Execution log

Findings, appended as work happens. Not intentions.

### What is deliberately deferred

The `activation` change does **not** rebuild anything yet. Switching to a space with
different dimensions leaves old embeddings in another table, and nothing warns the
caller beyond the ability description. That is Sprint 12's problem, once retrieval
exists and can show that a stale space returns nothing useful. Writing reindex
machinery before the indexer exists would be guessing.

### Notes for the next sprint

- Sprint 09 adds providers and embedding generation. `create_space` already validates
  a dimension against the environment report, so a provider must report its
  dimensions before a space can be created for it.
- `has_vector_index()` is the honest answer to Sprint 07's deferred check and belongs
  in the status screen Sprint 13 builds.
