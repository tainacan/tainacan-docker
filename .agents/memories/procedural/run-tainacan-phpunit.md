---
type: procedural
tags: [testing, phpunit, make, wordpress, builder]
created: 2026-10-03
updated: 2026-10-15
source: investigation
confidence: high
status: active
related: [semantic/tainacan-plugin-lives-in-src]
---

# How to run the Tainacan PHPUnit suite

**When:** you need to run or debug plugin tests.

    make test

**Expected:** the WordPress test library is installed into the `wp_tests` volume
once, then `src/vendor/bin/phpunit` runs. A green run exits 0. On 2026-10-15 a
clean run reported `OK (359 tests, 3907 assertions)`.

Run a subset by test class or method (recommended):

    docker compose --profile watch run --rm --no-deps \
      -e WP_TESTS_DIR=/tmp/wp-tests/wordpress-tests-lib \
      builder sh -lc 'src/vendor/bin/phpunit --filter "ImporterTests"'

**Gotchas:**

- The builder image must carry three packages the installer/bootstrap need:
  `subversion` (`install-wp-tests.sh` checks out the WordPress test library with
  `svn co`), `php8.3-mysqli` (wpdb), and a MySQL client providing `mysqladmin`
  (the script creates the test database). All three were missing before
  2026-10-15; without `svn` the `wp_tests` volume was left half-built (no
  `includes/`), and without `mysqladmin` the database was never created while
  the script misleadingly printed "Database ... already exists, skipping".
  They are now in `dockerfiles/builder/Dockerfile`.
- Do NOT run `phpunit tests/test-x.php`. PHPUnit's file mode derives the class
  name from the filename, but the plugin's test classes do not match
  (for example `test-importer.php` holds `ImporterTests`), so it fails with
  `Class test-importer could not be found`. Use `--filter "<ClassOrMethod>"`
  instead, which runs against the configured testsuite.
- `tests/bootstrap.php` requires `tests/bootstrap-config.php` unconditionally.
  `make test` copies it from `bootstrap-config-sample.php`; a manual run needs it.
- `WP_TESTS_DIR` must point at `.../wordpress-tests-lib`, not the test dir; the
  installer's `<test-dir>` argument is `/tmp/wp-tests` and the library lands one
  level below it.
- The install script must run as `root`, because the application DB user cannot
  create the `tainacan_test` database.
- The test library lives in the persistent `wp_tests` named volume. If it is
  half-built, remove it and re-run: `docker volume rm tainacan-docker_wp_tests`.
- Only `test-*.php` files are collected. `__test-*` and `_test-*` are skipped.
- Tests need `src/vendor`, so run `make assets` first if dependencies are absent.

**Evidence:** `tainacan/tests/bootstrap.php`,
`tainacan/tests/bin/install-wp-tests.sh`, `tainacan/phpunit.xml.dist`,
`dockerfiles/builder/Dockerfile` (added `subversion`, `php8.3-mysqli`,
`default-mysql-client` on 2026-10-15).
