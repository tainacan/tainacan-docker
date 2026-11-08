---
type: episodic
tags: [core, audit, bugfix, pull-request, facets, importer, migrations, rest, php84, decision]
created: 2026-11-08
updated: 2026-11-08
source: investigation
confidence: high
status: active
related: [procedural/run-tainacan-phpunit, procedural/run-phpunit-against-a-worktree]
---

# 2026-11-08 — Audit of the plugin `develop` and six fix branches

**What happened.** A read-only audit of `tainacan/tainacan` at `upstream/develop`
(`ed39ee881`) covered the REST layer, repositories/entities/migrations,
importers/exporters/OAI-PMH and the Vue admin. Findings were split in two:
security issues went to the team's private report (never to public issues or
PRs); plain bugs became one branch each, created from `upstream/develop` in
separate git worktrees, each with PHPUnit coverage, reviewed with
`/code-review medium`, and pushed to the `marcossigismundo/tainacan` fork.
Pull requests against `tainacan/tainacan:develop` wait for Marcos' confirmation.

| Branch | Defect fixed | Tests |
|---|---|---|
| `fix/csv-importer-encoding-automatic` | `handle_encoding()` used an undefined variable, so every non-UTF-8 cell was imported empty with the default `automatic` option; ISO-8859-1 listed before Windows-1252 made CP1252 undetectable in strict mode | `ImporterTests::test_encode_automatic_converts_iso88591_to_utf8` |
| `fix/facets-meta-query-relation-typeerror` | the REST `relation` key reached `fetch_all_metadatum_values()` and the facets controller as a string entry of meta_query/tax_query → TypeError (HTTP 500) with two or more advanced-search conditions; `add_support_to_tax_query_like()` reindexed tax_query and dropped `taxquery[relation]` | `Facets::test_*_with_relation`, `test_items_endpoint_tax_query_relation_or_is_preserved` |
| `fix/migrations-schema-check` | `INFORMATION_SCHEMA.COLUMNS` queried without `table_schema`; migrations discovered by `get_class_methods()` (which also lists private helpers when called from inside the class); wrong meta_key in the `NOT IN` of `insert_meta_default_metadata_section` | `Test_Migrations` (new file) |
| `fix/rest-error-status-codes` | `create_item()` validated the controller's empty item instead of the prepared one (500 instead of 400); reports/terms/facets called methods on empty fetch results | items + reports API tests |
| `fix/admin-js-i18n-placeholders-and-listeners` | `getWithVariables()` ignored numbered placeholders; mitt listeners never removed or removed type-wide | none (no JS suite, issue #1141) |
| `fix/php84-deprecations` | implicit nullable parameters, dynamic properties | lint under PHP 7.4 and 8.4 |

**Decisions worth keeping.**

- Do not move `update_option('_migration_x')` after the migration call. It
  looks like "retry on failure", but `$wpdb->query()` never throws, so SQL
  migrations gain nothing, while a migration that fatals or times out would
  re-run on every `init` and keep the whole site down. The ordering was left
  as upstream has it.
- `ReflectionClass::getMethods(IS_PUBLIC | IS_STATIC)` ORs its flags, so it
  still returns private static methods. Filter visibility and `isStatic()`
  separately.
- Under an OR relation the facet must keep its own clause (dropping a
  disjunct narrows the result), and the per-value count must nest the group
  under AND. This is also the prerequisite for offering OR in the advanced
  search UI, which today hardcodes AND.
- A facets `context=extended` value whose referenced entity is gone is kept
  without the extra data; dropping it would make `X-WP-Total` inconsistent.
- Commits to the official plugin carry no AI attribution lines (project rule).
- Built assets (`src/assets/js`, `src/assets/css`) are gitignored in the plugin
  repository, so JS/Vue/SCSS branches only carry sources; verify them after
  `make assets`.

**Second round (same day).** Two feature branches were built on the findings:
`feature/advanced-search-or-relation` (AND/OR selector in the advanced search,
stacked on the facets fix because the OR path used to crash the facets) and
`feature/dashboard-theme-support-notice` (`Tainacan\Theme_Support` detection +
dismissible notice on the Tainacan dashboard, rendered through
`tainacan-dashboard-before-cards` because `admin_notices` are removed on plugin
screens). Agent knowledge went to this repository as
`docs/memories-core-extension-pitfalls` (ten semantic memories) and the skills
`tainacan-extending-core` and `tainacan-code-review`, one branch each.

Decisions: a single global AND/OR control, no per-group relation (WP_Query ANDs
meta_query and tax_query together); when a facet is applied on top of an OR
search the store nests the OR group under the default AND level; reloading a
URL with a nested group must not re-run the advanced search, or `(A OR B) AND C`
becomes `A OR B OR C`. `tainacan-register-metadata-type` fires while
`tainacan.php` is included, so extension plugins must hook it at top level and
load before the core.

**Side effects to remember.** `/code-review` forks may check out the reviewed
branch in the main submodule checkout and leave scratch test files behind;
after a review, verify `git -C tainacan rev-parse HEAD` and `git status`.

**Verify by:** `git -C tainacan branch -r | grep origin/fix/` and the test
filters above with the recipe in `procedural/run-phpunit-against-a-worktree`.
