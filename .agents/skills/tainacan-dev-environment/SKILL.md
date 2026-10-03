---
name: tainacan-dev-environment
description: Use when starting, stopping, debugging or changing the local Tainacan development stack in this repository. Triggers on "make setup", "make up", "make watch", "docker compose", "stack", "containers", "WordPress won't load", "read-only file system", "permissions", "port", "nginx 502", "php-fpm", "reset the environment", "tainacan-docker".
---

# Tainacan dev environment

This repository is a **runtime environment**, not the plugin. The plugin is a git
submodule mounted into WordPress. Change plugin code in `tainacan/`, not here,
unless the change is to the stack itself.

## Layout of the runtime

| Service | Image | Role |
|---|---|---|
| `db` | `mariadb:11` | Database, named volume `db_data`, healthcheck |
| `wordpress` | `wordpress:php8.3-fpm` + PHP limits + WP-CLI | PHP only, no published port, listens on 9000 |
| `nginx` | `nginx:1.27-alpine` | Serves static files, proxies `*.php` to `wordpress:9000`, publishes `${WP_PORT}` |
| `builder` | `dockerfiles/builder` | Assets, watch and tests; profile `watch`; only writer of sources |
| `elasticsearch` | ES 8.15 | Optional, override file only |

Mounts that matter:

| Host | Container | Mode |
|---|---|---|
| `tainacan/src` | `/var/www/html/wp-content/plugins/tainacan` | read-only (wordpress, nginx) |
| `tainacan/` | `/repo` in `builder` | read-write |

`wordpress_data` is a named volume holding WordPress core, `wp-config.php` and
uploads. It is never on the host.

## Everyday commands

```sh
make setup      # first run: build assets, start stack, install WP, harden
make up         # start db, wordpress, nginx
make watch      # rebuild assets on change (second terminal)
make assets     # one-shot development build
make assets-prod
make down
make reset      # destructive: removes db_data and wordpress_data volumes
make shell      # bash inside the php-fpm container
make db-shell
make wp ARGS="plugin list"
make logs
make ps
```

`make help` lists everything. There are no shell wrapper scripts; all workflow is
in the `Makefile`.

WP-CLI runs inside the `wordpress` container; there is no separate CLI service.
`make wp ARGS="..."` is the canonical entry point and runs as uid 33, so writes
to `wp-config.php` keep `www-data` ownership. `make shell` also has `wp`
installed; because `exec` runs as root, a wrapper adds `--allow-root`
automatically, but prefer `make wp` for writes.

## Why there is no rebuild step for PHP

The plugin is bind-mounted, so editing a PHP file under `tainacan/src/` is
immediately visible in WordPress. Only assets (JS, Vue, SCSS) need a build.

## Why watch uses polling

Docker Desktop on macOS does not deliver inotify events from host files into
Linux containers, so the watchers poll every 2 seconds. This is intentional; do
not "fix" it by switching to inotify.

## Guard rails

The plugin is mounted **read-only** for the `wordpress` and `nginx` containers. A
write attempt fails with `Read-only file system`. Only the builder gets write
access. This prevents WordPress from writing generated files into the repository.

`make guard` fails if a WordPress core artifact (`wp-admin/`, `wp-includes/`,
`wp-content/`, `wp-config.php`, `wp-settings.php`, `.htaccess`, `uploads/`,
`debug.log`) appears inside `tainacan/`. There is no git hook; run `make guard`
before committing.

## Troubleshooting

- **nginx 502.** php-fpm is not ready or the service name is wrong. nginx proxies
  to `wordpress:9000`. Check `make logs` and `make ps`.
- **Port already in use.** Change `WP_PORT` in `.env` and `make up` again.
- **Blank admin / missing styles.** Assets were never built. Run `make assets`.
- **DB connection error on first boot.** The stack waits for the `db` healthcheck;
  if it persists, `make logs` and check `.env` credentials.
- **Pretty permalinks 404.** Recreate nginx: `docker compose up -d --force-recreate nginx`.
- **Elasticsearch exits.** Raise `vm.max_map_count` (see the elasticsearch skill).
- **Changes to `.env` not applied.** Compose reads `.env` at parse time; recreate
  the affected containers.

## Pitfalls

- Do not add `container_name`; several stacks may coexist.
- Do not bind-mount the repository root as the document root; WordPress files
  would land in the repo.
- `TAINACAN_PLUGIN_PATH` in `.env` accepts a submodule path (`./tainacan`) or an
  absolute path to an external clone. The stack appends `/src` itself; pass the
  repository root.
