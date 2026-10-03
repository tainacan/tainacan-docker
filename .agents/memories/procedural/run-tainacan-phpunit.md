---
type: procedural
tags: [testing, phpunit, make, wordpress]
created: 2026-10-03
updated: 2026-10-03
source: investigation
confidence: high
status: active
related: [semantic/tainacan-plugin-lives-in-src]
---

# How to run the Tainacan PHPUnit suite

**When:** you need to run or debug plugin tests.

    make test

**Expected:** the WordPress test library is installed into the `wp_tests` volume
once, then `src/vendor/bin/phpunit` runs. A green run exits 0.

Single file:

    docker compose --profile watch run --rm --no-deps \
      -e WP_TESTS_DIR=/tmp/wp-tests/wordpress-tests-lib \
      builder sh -lc 'src/vendor/bin/phpunit tests/test-api-items.php'

**Gotchas:**

- `tests/bootstrap.php` requires `tests/bootstrap-config.php` unconditionally.
  `make test` copies it from `bootstrap-config-sample.php`; a manual run needs it.
- `WP_TESTS_DIR` must point at `.../wordpress-tests-lib`, not the test dir; the
  installer's `<test-dir>` argument is `/tmp/wp-tests` and the library lands one
  level below it.
- The install script must run as `root`, because the application DB user cannot
  create the `tainacan_test` database.
- Only `test-*.php` files are collected. `__test-*` and `_test-*` are skipped.
- Tests need `src/vendor`, so run `make assets` first if dependencies are absent.

**Evidence:** `tainacan/tests/bootstrap.php`,
`tainacan/tests/bin/install-wp-tests.sh` (usage line 4), `tainacan/phpunit.xml.dist`.
