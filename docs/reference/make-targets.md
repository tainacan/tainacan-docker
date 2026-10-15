# Make targets

Every workflow is a `Makefile` target. Run `make` or `make help` for the same
list. There are no shell wrapper scripts.

## Setup and lifecycle

| Target | Effect |
|---|---|
| `make help` | List targets (the default goal) |
| `make env` | Create `.env` from `.env.example` when missing |
| `make submodules` | `git submodule update --init --recursive` |
| `make config` | Write `build-config.cfg` for both submodules (gitignored upstream) |
| `make setup` | First run: assets, stack, WordPress install, hardening |
| `make up` | Start `db`, `wordpress`, `nginx` |
| `make up-elastic` | Same, plus Elasticsearch |
| `make down` | Stop all containers for this project |
| `make reset` | Stop and delete the `db_data` and `wordpress_data` volumes |
| `make restart` | Restart the `wordpress` and `nginx` containers |
| `make ps` | Container status |
| `make logs` | Follow the `wordpress` and `nginx` logs |

## Access

| Target | Effect |
|---|---|
| `make shell` | Shell in the `wordpress` (php-fpm) container, which has WP-CLI |
| `make db-shell` | MariaDB shell on the application database |
| `make wp ARGS="plugin list"` | Run any WP-CLI command inside the `wordpress` container as `www-data` |

## Build and watch

| Target | Effect |
|---|---|
| `make vendor` | Install plugin PHP dependencies (`src/vendor`) when missing; prerequisite of `make assets` |
| `make assets` | One-shot development build of the plugin |
| `make assets-prod` | One-shot production build |
| `make watch` | Rebuild assets when sources change (polling, every 2s) |

## Quality

| Target | Effect |
|---|---|
| `make test` | Install the WP test library if needed, then run PHPUnit |
| `make guard` | Fail if a WordPress core artifact appears in a Tainacan checkout |
| `make harden` | Also set `DISALLOW_FILE_MODS` in `wp-config.php` |
| `make bg-loopback` | Point the background-process loopback at internal nginx (fixes processes stuck in "waiting") |
| `make cron` | Run all due WP-Cron events once; the stack has no cron daemon |

## Documentation

| Target | Effect |
|---|---|
| `make docs-serve` | Serve this site at <http://localhost:8000> |
| `make docs-build` | Validate the docs build; strict, output is not kept |

## Environment variables

All have defaults in `.env.example`; `.env` overrides them.

| Variable | Default | Meaning |
|---|---|---|
| `WP_PORT` | `8080` | Host port for nginx |
| `WP_SITE_URL` | `http://localhost:8080` | WordPress home and site URL |
| `WP_TITLE` | `Tainacan Dev` | Site title |
| `WP_ADMIN_USER` / `WP_ADMIN_PASSWORD` / `WP_ADMIN_EMAIL` | `tainacan` / `tainacan` / `tainacan@local.test` | Admin account |
| `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_ROOT_PASSWORD` | `tainacan` | Database credentials |
| `DB_PORT` | `3306` | Host port for MariaDB |
| `DB_PREFIX` | `wp_` | Table prefix |
| `TAINACAN_PLUGIN_PATH` | `./tainacan` | Plugin repository root (submodule or absolute path) |
| `TAINACAN_BG_LOOPBACK_URL` | `http://nginx` | Internal base URL for the Tainacan background-process loopback (see below) |
| `ES_PORT` | `9200` | Host port for Elasticsearch |

## Background processes

Tainacan runs imports, exports and bulk edit as background processes that
dispatch themselves with an HTTP request back to the site (`admin-ajax.php`).
Inside the stack the public `WP_SITE_URL` (`http://localhost:8080`) points at a
host-published port the container cannot reach, so those dispatches fail and the
process stays in `waiting`. `make setup` therefore sets
`TAINACAN_BG_PROCESS_LOOPBACK_URL` to `TAINACAN_BG_LOOPBACK_URL` (`http://nginx`),
the internally reachable nginx service. Apply it to an existing install with
`make bg-loopback`.

WP-Cron is also request-driven here (no cron daemon), so scheduled events only
run when something triggers them. Use `make cron` to run the due events,
including the background-process watchdog.

## Ports and volumes

Host ports: nginx `8080`, MariaDB `3306`, Elasticsearch `9200`.

Named volumes: `db_data`, `wordpress_data`, `tainacan_node_modules`, `wp_tests`,
and `es_data` when Elasticsearch is enabled.
