---
name: tainacan-code-review
description: Use when reviewing a change to the Tainacan plugin or to an extension plugin before merge. Triggers on "review", "code review", "review this PR", "audit", "security review", "analyse this diff", "is this safe to merge", "permission_callback", "N+1", "found_posts", "migration", "phpcs", "PHP 8.4 deprecation".
---

# Tainacan code review

A tool-agnostic procedure for reviewing core PRs and extension plugins. Paths
below are relative to the plugin repository (`tainacan/` in this stack). Line
numbers were checked against `develop` and drift; re-check before quoting.

## 1. Scope the target

Write the target at the top of the report: PR number, branch against base
(`git diff upstream/develop...HEAD`), commit range, or a whole module. Read
each changed hunk with its full function and its callers. Pre-existing debt
outside the diff is noted under "out of scope" and does not block, unless the
change widens it.

## 2. Evidence rule

- Every finding cites `file:line` and a concrete trigger: input or state that
  produces the wrong result (`request X by user Y -> private item returned`).
- Mark confidence: **confirmed** (reproduced by running a test, a request or a
  query, or traced end to end with a `file:line` at each hop) or **plausible**
  (reasoned from reading only). Plausible findings go in their own section.
- Rank by severity: blocker, major, minor, nit.
- **Security findings never go into a public issue, PR comment or commit
  message.** The core's disclosure policy is the Patchstack VDP
  (`src/readme.txt:81-83`, "Where do I report security bugs found in this
  plugin?"). Report there, or privately to the maintainers, and keep the public
  review to "one finding sent privately". `CONTRIBUTING.md` has no separate
  security channel, so do not invent one.
- No finding without a scenario. "Consider improving readability" is not a
  finding.

## 3. Checklists

Each item names where the core does it right, so you can compare.

### 3.1 Security

1. `permission_callback` present on every route and never `__return_true`
   (grep `src/classes/api`: zero occurrences today). Callbacks return `true`,
   `false` or `WP_Error`.
2. Authorization on the object acted upon, not only on the collection in the
   URL: `$entity->can_read/can_edit/can_delete/can_publish()` delegate to the
   repository (`src/classes/entities/class-tainacan-entity.php:422-455`).
   Pattern to copy: `class-tainacan-rest-item-metadata-controller.php:298-316`
   fetches both item and metadatum and requires `$item->can_edit() &&
   $metadatum->can_read()`.
3. IDs from the request body must belong to the target: a `metadatum_id`,
   `term_id` or `item_id` in the body must be checked against the collection
   or item of the route (compare `get_collection_id()`), otherwise a user with
   edit rights in one collection acts on another.
4. Private and draft visibility: list queries get `'perm' => 'readable'` from
   `Rest_Controller::prepare_filters()`
   (`src/classes/api/class-tainacan-rest-controller.php:186`); the items
   repository builds the status clause from the collection's
   `read_private_posts` cap (`class-tainacan-items.php:456-489`); metadata
   visibility uses `tnc_col_<id>_read_private_metadata` and the private
   metadata-section filter (`class-tainacan-metadata.php:455-495`). A new
   query that bypasses the repository must reproduce this.
5. Output escaping at the point of output (`esc_html`, `esc_attr`, `esc_url`,
   `wp_kses_post`), including `printf` arguments. REST input that will be
   rendered goes through `Rest_Controller::sanitize_value()`
   (`class-tainacan-rest-controller.php:263-277`).
6. `$wpdb->prepare()` for every variable, one `prepare()` per clause; a value
   containing `%` must not reach a second `prepare()`
   (`class-tainacan-metadata.php`, `fetch_all_metadatum_values`, comment at
   the `$search_clause` block). `IN (...)` lists via `array_fill` placeholders.
7. URLs that come from users or from imported data are fetched with
   `wp_safe_remote_get()` / `wp_safe_remote_post()` (blocks loopback and
   private ranges); `wp_remote_get()` on such a URL is an SSRF finding.
8. CSV/XLSX output: `fputcsv()` and spreadsheet writers quote cells but do not
   neutralize a leading `=`, `+`, `-`, `@` (formula injection). New export
   paths must write user text as plain strings (prefix or explicit string
   type). Anything found in an existing path is a SECURITY finding (item 2).
9. `v-html` only with data already sanitized server side (`valuesAsHtml`,
   i18n strings); never with raw request or user input.
10. State-changing AJAX: `check_ajax_referer()` as in
    `class-tainacan-async-request.php:207`; `wp_ajax_nopriv_` only with a
    nonce or token check.
11. Uploads and private files: `Tainacan\Private_Files` serves private
    attachments; a new file path must go through it, not through `uploads/`.

### 3.2 Performance

Assume 100k items, 50 collections, hundreds of metadata, anonymous traffic.

1. `found_posts` costs `SQL_CALC_FOUND_ROWS`; it is needed for pagination
   headers (`class-tainacan-rest-items-controller.php:467`) and nowhere else.
   Loops that only need rows set `'no_found_rows' => true`.
2. N+1: `fetch_all_metadatum_values()` with `count_items` runs one items
   `fetch()` per term (`class-tainacan-metadata.php:1448-1462`). Do not add a
   facet or listing that repeats the pattern; batch or push the count into SQL.
3. No `fetch()`, `WP_Query`, `get_post_meta()` or HTTP call inside a loop
   over items or terms.
4. `perpage` is capped by `$TAINACAN_API_MAX_ITEMS_PER_PAGE`
   (`src/tainacan.php:27`, enforced at
   `class-tainacan-rest-items-controller.php:710-714`); non-positive values
   fall back to `get_minimum_safe_perpage()`
   (`class-tainacan-rest-controller.php:174-176`). Never pass
   `posts_per_page => -1` on a request path.
5. `meta_query` with `LIKE`, `REGEXP` or `CAST` on item metadata scans
   `wp_postmeta`; needs a justification and a measurement.
6. Caching: expensive, stable data goes in a transient with a key that
   includes every input and an invalidation hook (pattern:
   `class-tainacan-rest-reports-controller.php:977`). No cache of data that
   depends on the current user's permissions.
7. Long work goes to a background process (`Tainacan\Background_Process`
   importers, exporters, generic processes), never to a REST request.
8. Scripts and styles enqueued only on the screens that use them, versioned
   with `TAINACAN_VERSION`.
9. Nothing heavy on `init`, `wp_head` or `rest_api_init`; options that are
   large are not autoloaded.
10. Importer or bulk step that logs, invalidates cache or reindexes per item:
    check it is bounded by the step size.

### 3.3 Tainacan API usage

1. Repositories are singletons: `Repositories\Items::get_instance()` or
   `tainacan_items()`; never `new`.
2. `validate()` before `insert()`: the repository throws when a publishable
   status is not validated (`class-tainacan-repository.php:161-166`);
   `Item_Metadata::insert()` always throws (`class-tainacan-item-metadata.php:30-33`).
   `get_errors()` must be surfaced, not swallowed. `insert()` returns a new
   instance; use the return value.
3. Entity getters and setters, not raw `get_post_meta()`. Metadatum options
   come from `get_metadata_type_options()`
   (`class-tainacan-metadatum.php:249`); the indexed copy uses the `_option_`
   prefix (`class-tainacan-metadata.php:1734-1756`); a metadatum's collection
   is the `collection_id` postmeta, not `post_parent`.
4. Hook names must exist. Verified list (grep `do_action('tainacan-` and
   `apply_filters('tainacan-`): `tainacan-insert`, `tainacan-pre-insert`,
   `tainacan-deleted`, `tainacan-pre-delete` (and their `-<Entity>` suffixes,
   e.g. `tainacan-insert-Item_Metadata_Entity`),
   `tainacan-register-admin-hooks`, `tainacan-register-metadata-type`,
   `tainacan-register-filter-type`, `tainacan-api-prepare-items-args`,
   `tainacan-api-items-response`, `tainacan-api-response-item-meta`,
   `tainacan-get-item-metadatum-as-html-before/after` (plus `--type-`,
   `--id-`, `--index-` variants), `tainacan-fetch-all-metadatum-values`,
   `tainacan-api-items-tainacan-filter-<type>-filter-arguments`. Common
   mistakes: `tainacan_insert` (underscore), `tainacan-item-inserted`,
   `tainacan-after-insert`, `tainacan-register-metadata-types` (plural),
   `tainacan-api-items-after`. Callbacks on `tainacan-insert` must not type
   the argument (it receives any entity).
5. Admin hooks: `tainacan_register_admin_hook( $context, $callback, $position )`
   returns HTML and runs inside `tainacan-register-admin-hooks`
   (`src/views/admin/classes/hooks/admin-hooks-functions.php:8`).
6. REST params the API renames or drops: in `taxquery` the key is `metadatum`
   and maps to `field` (`class-tainacan-rest-controller.php:155-161`);
   `include_children` is not in the mapping and is silently dropped. Readers
   should pass `fetch_only` / `fetch_only_meta`
   (`class-tainacan-rest-items-controller.php:295-327`).
7. Migrations: one static method in `Tainacan\Migrations`
   (`src/migrations.php`), run once and marked with the `_migration_<method>`
   option (`src/migrations.php:9-24`). Schema checks query
   `INFORMATION_SCHEMA` filtered by `table_schema = DB_NAME`
   (`src/migrations.php:524-529`); without the filter a column in another
   database on the same server skips the migration. Must be idempotent.
8. Autoloader: `Tainacan\Foo_Bar` loads `class-tainacan-foo-bar.php` from a
   directory in `DIRS` (`src/classes/tainacan-creator.php:23`, `:153`). Wrong
   filename or directory means the class silently never loads.
9. Metadata and filter types register through the repositories
   (`class-tainacan-metadata.php:311`, `class-tainacan-filters.php:279`) at top
   level, before `init` completes.
10. Capabilities are per collection (`tnc_col_<id>_*`), repository-wide
    (`tnc_rep_*`) or the super cap `manage_tainacan`
    (`src/classes/class-tainacan-roles.php:95-130`). Check with the entity's
    `can_*()`, not with `current_user_can('edit_posts')`.

### 3.4 Compatibility and coexistence

1. PHP range is 7.4 to 8.4 (`src/readme.txt:6`). No PHP 8-only syntax
   (named args, `match`, enums, readonly). No implicit nullable
   (`Type $x = null` -> `?Type $x = null`, deprecated in 8.4); no dynamic
   properties on classes without `#[\AllowDynamicProperties]` (8.2).
2. Coding standard: `phpcs.xml.dist` is `WordPress-Core` + `WordPress-Docs`.
   A `phpcs:ignore` needs a justification that says why the canonical API
   does not fit (see `class-tainacan-private-files.php:152`).
3. i18n: the `tainacan` textdomain is only for the core. Extensions use their
   own slug. Placeholders numbered when more than one (`%1$s`), with a
   `/* translators: */` comment.
4. Tests: only `tests/test-*.php` is collected (`phpunit.xml.dist`); REST tests
   extend `TAINACAN_UnitApiTestCase` (`tests/tainacan-unit-api-test-case.php:10`).
   New behaviour without a test is a major finding.
5. Built assets are not committed: `src/assets/js/*.js` and
   `src/assets/css/*.css` are gitignored (`.gitignore`). A change to `.vue`,
   `.js` or `.scss` is only verifiable after `make assets`; a PR that adds
   files under `src/assets/js` or `src/assets/css` is wrong.
6. New SCSS entry needs a line in `compile-sass.sh`; new webpack entry needs
   `webpack.common.js` and the matching enqueue.
7. In `tainacan-docker`, automation is a Make target; no shell scripts, no git
   hooks (`AGENTS.md`, rule 4). The plugin is mounted read-only, so nothing
   may write into the plugin directory at runtime.
8. Extensions: prefixed globals (functions, options, transients, handles,
   AJAX actions, CSS classes); filters on `the_content`, `pre_get_posts`,
   `template_include`, `rest_*` restricted to Tainacan post types; no
   `remove_all_*`, no `flush_rewrite_rules()` on every load; no reading of
   another plugin's options or tables instead of its API.
9. WordPress minimum is 6.5 (`src/readme.txt:4`); do not call functions newer
   than that without a guard.

## 4. Verification tools in this stack

```sh
make test                                   # full suite in the builder image
docker compose --profile watch run --rm --no-deps \
  -e WP_TESTS_DIR=/tmp/wp-tests/wordpress-tests-lib \
  builder sh -lc 'src/vendor/bin/phpunit --filter "Test_Class_Or_Method"'
git -C tainacan diff --name-only upstream/develop -- '*.php' \
  | xargs -I{} php -l tainacan/{}                              # syntax
docker run --rm -v "$PWD/tainacan:/app" -w /app php:8.4-cli \
  sh -c 'find src -name "*.php" -not -path "*/vendor/*" -exec php -l {} \;' \
  | grep -v "No syntax errors"                                 # 8.4 deprecations
tainacan/src/vendor/bin/phpcs --standard=tainacan/phpcs.xml.dist <files>
make guard                                  # no WordPress files in the checkout
```

Use `--filter`, not a file path (PHPUnit derives the class from the filename
and the plugin's classes do not match). Details: `tainacan-testing` skill and
`.agents/memories/procedural/run-tainacan-phpunit.md`. A finding is
**confirmed** when one of these reproduces it, or a REST call against
`http://localhost:8080/wp-json/tainacan/v2/...` shows the wrong result.

## 5. Report

Use `report-template.md` in this folder: a summary table (#, finding, where,
severity, confidence), one section per finding (scenario, evidence, fix), then
"Reviewed, no finding" listing what was checked, then "Out of scope". Security
findings appear in the public report only as a count.
