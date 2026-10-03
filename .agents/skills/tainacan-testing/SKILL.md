---
name: tainacan-testing
description: Use when running, writing or debugging Tainacan PHPUnit tests. Triggers on "phpunit", "make test", "unit test", "test case", "bootstrap-config", "WP_TESTS_DIR", "install-wp-tests", "factory", "tests/", "WP_UnitTestCase", "REST test", "test database".
---

# Tainacan testing

## How the suite is wired

- `tainacan/phpunit.xml.dist` sets `bootstrap="tests/bootstrap.php"` and a single
  testsuite that collects files matching `./tests/` with prefix `test-` and
  suffix `.php`.
- `tests/bootstrap.php`:
  1. requires `tests/bootstrap-config.php` (gitignored; a sample is provided),
  2. resolves `WP_TESTS_DIR` from the environment, falling back to
     `tests_dir` from that config,
  3. registers `_manually_load_plugin()` on `muplugins_loaded`, which requires
     `src/tainacan.php` and fires the activation hook,
  4. requires `src/vendor/autoload.php` and the WordPress test bootstrap,
  5. loads the Tainacan factories and base test cases.
- Base test cases: `tests/tainacan-unit-test-case.php`
  (`TAINACAN_UnitTestCase`) and `tests/tainacan-unit-api-test-case.php`
  (`TAINACAN_UnitApiTestCase`, which boots `WP_REST_Server` and
  `do_action('rest_api_init')`).
- Factories live in `tests/factories/` (entity, metadatum, filter, item-metadata).

Both base cases live in the `Tainacan\Tests` namespace, so test classes declare
that namespace too.

## Prerequisites

- Composer dev dependencies installed: `make assets` runs `composer install`,
  which provides `src/vendor/bin/phpunit`.
- A `tests/bootstrap-config.php` file. `make test` creates it from the sample if
  it is missing. It only needs to exist; the real path comes from `WP_TESTS_DIR`.

## Running

```sh
make test          # installs the WP test suite if needed, then runs phpunit
make up            # the test DB lives in the same `db` service
```

`make test` executes inside the builder image:

```
tests/bin/install-wp-tests.sh tainacan_test root <db_root_password> /tmp/wp-tests db:3306 latest
src/vendor/bin/phpunit
```

The installer signature is
`<db-name> <db-user> <db-pass> <test-dir> [db-host] [wp-version] [skip-db-create]`.
It creates `/tmp/wp-tests/wordpress-tests-lib` and
`/tmp/wp-tests/wordpress-test`, then `WP_TESTS_DIR` points at the library. The
`/tmp/wp-tests` path is a named volume (`wp_tests`) so the download is cached
between runs.

To run a single file or filter:

```sh
docker compose --profile watch run --rm --no-deps \
  -e WP_TESTS_DIR=/tmp/wp-tests/wordpress-tests-lib \
  builder sh -lc 'src/vendor/bin/phpunit tests/test-api-items.php'
```

## Writing a test

```php
<?php
namespace Tainacan\Tests;

class Test_My_Feature extends TAINACAN_UnitTestCase {

    public function test_something_is_true() {
        $this->assertTrue( true );
    }
}
```

For REST coverage extend `TAINACAN_UnitApiTestCase` and use
`rest_do_request()` / `$this->server` rather than real HTTP:

```php
$request  = new \WP_REST_Request('GET', $this->namespace . '/collections');
$response = rest_do_request($request);
$this->assertEquals(200, $response->get_status());
```

Conventions: file name `test-<area>.php`, class `Test_<Area>`, namespace
`Tainacan\Tests`, `public function setUp() : void`.

## Naming gotcha

The phpunit config only collects `test-*.php`. Files named `__test-*.php` or
`_test-*.php` are intentionally **not** run. If your new test is ignored,
the filename is the first thing to check.

## Coverage map

The suite is broad. Relevant groups:

- Entities and repositories: `test-entities.php`, `test-collections.php`,
  `test-items.php`, `test-item-metadata.php`, `test-metadata.php`,
  `test-taxonomies.php`, `test-filters.php`, `test-facets.php`.
- REST: every `test-api-*.php` file maps to an endpoint controller.
- Metadata and filter types: `test-*-metadatum-types.php`, `test-api-filter-types.php`.
- Import/export: `test-importer.php`, `test-exporters.php`,
  `test-exporter-mapping.php`, `test-api-importers.php`.
- Background processing: `test-bgprocess.php`, `test-bulkedit-bg-process.php`,
  `test-api-background-processes.php`.
- Cross-cutting: `test-capabilities.php`, `test-api-roles.php`,
  `test-html-injection.php`, `test-api-oaipmh.php`, `test-utilities.php`.

## Pitfalls

- `bootstrap-config.php` is required even when `WP_TESTS_DIR` is set; `make test`
  handles this, but a manual `phpunit` invocation needs the file.
- `WP_TESTS_DIR` must point at `.../wordpress-tests-lib`, not the parent
  `test-dir`; they differ by one path segment.
- Tests need `src/vendor` (composer dev deps). Run `make assets` first.
- The test installer runs as `root` because the application DB user cannot
  create the `tainacan_test` database. Change this only if you pre-create the DB.
- Tests share the `db` container; a long test run can race a `make reset`.
