# Tainacan Docker

A local development stack for the [Tainacan](https://tainacan.org) WordPress
plugin. Official images, live source mounts, one Makefile.

- **PHP edits are live.** The plugin source is bind-mounted into WordPress. Save
  a file, refresh the page. No rebuild, no copy step.
- **Assets recompile on change.** A builder container runs the upstream Tainacan
  build (webpack, sass) and writes the result back into the source tree.
- **Nothing leaks back into the repository.** WordPress core lives in a named
  volume, and the plugin directory is mounted **read-only** for the web tier.

The stack runs the official `wordpress:php8.3-fpm` image behind `nginx`, plus
`mariadb:11`. The WordPress image already bundles every extension Tainacan
needs (imagick, exif, gd, mbstring, curl, xml, zip, intl); the thin custom layer
only adds Tainacan's PHP limits, and nginx handles static files and pretty
permalinks.

## Requirements

- Docker Desktop (or Docker Engine + Compose v2)
- `make`
- Git, for the submodule

## Quick start

```sh
git clone --recurse-submodules <this-repo>
cd tainacan-docker
make setup
```

`make setup` builds the asset bundle, starts the stack, installs WordPress,
activates the Tainacan plugin, sets pretty permalinks, and applies the updater
hardening. The first run downloads npm and Composer dependencies, so expect a few
minutes.

Then open <http://localhost:8080> and sign in with the credentials from `.env`
(defaults: `tainacan` / `tainacan`).

## Where the source comes from

The plugin lives in `tainacan/src/` — that is the directory the upstream build
script publishes, and the one mounted into WordPress:

| WordPress path | Host source |
|---|---|
| `wp-content/plugins/tainacan` | `${TAINACAN_PLUGIN_PATH}/src` |

It defaults to the checked-out submodule. To point at an external clone instead,
change the path in `.env` — no compose edits:

```sh
TAINACAN_PLUGIN_PATH=/Users/you/projects/tainacan
```

The value is the repository root (the directory containing `build.sh`); the
stack appends `/src` itself.

## Daily workflow

```sh
make up        # start db + WordPress (detached)
make watch     # second terminal: rebuild assets on change
```

- Edit a PHP file under `tainacan/src/` and refresh the browser.
- Edit a `.js`, `.vue` or `.scss` file and the watcher rebuilds automatically.

If you prefer building on demand instead of watching:

```sh
make assets        # development build
make assets-prod   # production build
```

`make watch` uses polling rather than inotify, because Docker on macOS does not
deliver filesystem events from the host into Linux containers. Polling is the
reliable choice on macOS and also works on Linux.

## Make targets

Run `make` or `make help` for the list. The main ones:

| Target | Purpose |
|---|---|
| `make vendor` | Install the plugin's PHP dependencies when `src/vendor` is missing |
| `make setup` | First run: assets, stack, WordPress install, hardening |
| `make up` / `make down` | Start / stop the stack |
| `make reset` | Stop and delete the database and WordPress volumes |
| `make watch` | Rebuild assets on change |
| `make assets` / `make assets-prod` | One-shot asset builds |
| `make package` | Production zip at `dist/tainacan.zip` for another WordPress site |
| `make shell` / `make db-shell` | Shells into WordPress / MariaDB |
| `make wp ARGS="plugin list"` | Run any wp-cli command |
| `make logs` | Follow WordPress logs |
| `make up-elastic` | Enable Elasticsearch 8 for Tainacan |
| `make test` | Run the plugin PHPUnit suite |
| `make bg-loopback` | Point the background-process loopback at internal nginx (fixes processes stuck in `waiting`) |
| `make cron` | Run the due WP-Cron events once (the stack has no cron daemon) |
| `make docs-serve` / `make docs-build` | Serve / build the documentation site |
| `make guard` | Fail if WordPress files leaked into a Tainacan checkout |

## Keeping WordPress out of the Tainacan repositories

The plugin is mounted into the web root, which is exactly the
direction that can leak generated files back into a source repository. Four
layers prevent it:

1. **Structural.** WordPress core, `wp-config.php`, uploads and cache live only
   in the `wordpress_data` named volume. The host exposes just the two source
   trees.
2. **Read-only mounts.** `wordpress` and `nginx` mount the plugin directory
   `:ro`. Only the builder gets write access, and it is never reachable over
   HTTP. The web tier cannot create or overwrite a file in the repository, so a
   plugin update fails loudly instead of polluting the tree.
3. **wp-config hardening.** `AUTOMATIC_UPDATER_DISABLED`, `WP_AUTO_UPDATE_CORE`
   and `DISALLOW_FILE_EDIT` are set on install. `make harden` adds
   `DISALLOW_FILE_MODS` to freeze the filesystem entirely.
4. **Detection.** `make guard` scans both checkouts for WordPress core artifacts
   and fails if any appear. Run it before committing.

### Core updates

WordPress core lives in the `wordpress_data` volume, which is seeded once from
the image and then keeps whatever version it was created with. Left alone it
drifts behind the image and the admin shows a "Please update now" notice.

To avoid that, `make setup` runs `wp core update` followed by `wp core update-db`
right after install, so both a fresh setup and a re-run bring the volume to the
latest release. Background auto-updates (`AUTOMATIC_UPDATER_DISABLED`,
`WP_AUTO_UPDATE_CORE`) stay disabled; the update is explicit, part of setup.

## Elasticsearch

```sh
make up-elastic
```

Elasticsearch 8.15 runs as a single node with security disabled and is reachable
from WordPress at `http://elasticsearch:9200`. Point Tainacan's Elasticsearch
settings at that URL. Elasticsearch needs `vm.max_map_count >= 262144`; on Linux
run `sudo sysctl -w vm.max_map_count=262144` (the Docker Desktop VM on macOS
usually already satisfies it).

## Troubleshooting

- **Pretty permalinks 404.** nginx needs its vhost config, mounted from
  `dockerfiles/nginx/default.conf`. Recreate the container with
  `docker compose up -d --force-recreate nginx`.
- **Plugin activates but the admin is blank.** The front-end assets are missing
  because Composer or npm did not run. Run `make assets`.
- **`make guard` fails.** A WordPress artifact exists inside `tainacan/`. Delete
  it and find out how it got there; the read-only mount should have prevented it.
- **A Tainacan import, export or bulk edit stays in `waiting`.** Background
  processes dispatch themselves with a loopback HTTP request to the site, and
  `WP_SITE_URL` (`http://localhost:8080`) points at a host port the container
  cannot reach. `make setup` sets `TAINACAN_BG_PROCESS_LOOPBACK_URL=http://nginx`;
  apply it to an existing install with `make bg-loopback`. WP-Cron is
  request-driven too, so run `make cron` to fire due events such as the
  background-process watchdog.
- **Node builds feel slow.** `node_modules` is a named volume, not the host bind
  mount, to avoid macOS file-sharing overhead. If dependencies change, rebuild
  with `make assets`.
- **Elasticsearch container exits.** Check `vm.max_map_count` (see above).
- **`make test` cannot find the WordPress test library.** The suite installs it
  into `/tmp` inside the builder. Make sure the `tainacan` submodule is
  populated and run `make assets` first.
- **`Operation not permitted` when listing the plugin inside a container.** The
  host source directory was deleted and recreated, for example after restoring
  the submodule, so the container holds a stale bind mount.
  Recreate the web tier: `docker compose up -d --force-recreate wordpress nginx`.

## Documentation

The docs site is built from the Markdown under `docs/`. Its HTML is produced on
demand and never committed: `site/` is gitignored, and `make docs-build` writes
to a throwaway path inside the container, so a validation run leaves nothing
behind. There is no generated HTML to push; publish it from a build artifact
instead of the repository.

```sh
make docs-serve    # preview at http://localhost:8000
make docs-build    # strict validation; keeps no output
```

## Layout

```
Makefile                     single entry point
docker-compose.yml           db, wordpress (php-fpm), nginx, builder
docker-compose.elastic.yml   Elasticsearch override
dockerfiles/wordpress/       PHP limits over the official php-fpm image
dockerfiles/nginx/           nginx vhost (static files + fastcgi to php-fpm)
dockerfiles/builder/         node 22 + PHP 8.3 + composer + rsync build image
tainacan/                    plugin submodule (source, dev)
.agents/skills/              skills for coding agents
.agents/memories/            durable memory recorded across sessions
docs/ + mkdocs.yml           documentation site (Diátaxis, MkDocs Material)
AGENTS.md                    project guide for coding agents
```

### Final remarks

The `www/wp-content` folder will have all your plugins and themes. So if you want to have addtional plugins or themes, simply add them there.

The repositories are cloned inside the `src` folder. After making changes to the code, enter those directories to commit.


