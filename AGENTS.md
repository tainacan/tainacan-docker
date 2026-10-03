# AGENTS.md

Guide for coding agents (and humans) working in this repository.

This repository is a **local development environment** for the Tainacan WordPress
plugin. It is not the plugin. The plugin is a git submodule that is mounted into
a containerised WordPress at runtime.

If you only read one section, read [Rules](#2-rules-that-are-not-negotiable). If
you are about to touch a specific area, load the matching skill from
[`.agents/skills/`](.agents/skills/README.md).

---

## 1. What this repository is

| Thing | Where | Notes |
|---|---|---|
| The environment | this repository | Docker Compose, Makefile, thin images |
| The plugin | `tainacan/` (submodule) | the WordPress plugin you develop |
| Design record | `.agents/memories/` | why the stack looks like this |
| Agent skills | `.agents/skills/` | eight focused skills |
| Agent memory | `.agents/memories/` | durable knowledge recorded across sessions |
| Docs site | `docs/` + `mkdocs.yml` | Diátaxis documentation built with MkDocs Material |

The plugin that WordPress actually loads is `tainacan/src/`, **not** the plugin
repository root. Everything outside `src/` in the plugin repo is the development
workspace: build scripts, composer, npm, tests.

---

## 2. Rules that are not negotiable

1. **Never let WordPress files into a Tainacan checkout.** No `wp-admin/`,
   `wp-includes/`, `wp-content/`, `wp-config.php`, `wp-settings.php`,
   `.htaccess`, `uploads/` or `debug.log` inside `tainacan/`. Run `make guard`
   before committing.
2. **The plugin is mounted read-only** for the `wordpress` and `nginx`
   containers. Do not design features that write into the plugin
   directory at runtime; use the database or the uploads volume. Writes into the
   source only ever come from the builder.
3. **Never edit build output.** `src/vendor/`, `src/assets/js/`,
   `src/assets/css/` and generated `src/style.css` are produced by Composer,
   webpack and Sass.
4. **Automation lives in the `Makefile`.** Do not add shell scripts of any kind,
   including git hooks. Everything is a Make target.
5. **Stay close to upstream images.** The only custom Dockerfiles are PHP limits
   over the official WordPress FPM image, an nginx vhost, and the builder
   toolchain. Do not reintroduce the removed custom `tainacan/php` images.
6. **Commit inside the submodule.** Changes to plugin code belong to the plugin
   repository, not to this one. When you change the stack, commit here.

---

## 3. Repository map

```
AGENTS.md                    this file
README.md                    user-facing setup and usage
Makefile                     every workflow target
docker-compose.yml           core stack
docker-compose.elastic.yml   Elasticsearch override
.env.example                 documented defaults (copy to .env)
.gitmodules                  pinned tainacan submodule
dockerfiles/wordpress/       PHP limits over wordpress:php8.3-fpm
dockerfiles/nginx/           nginx vhost (static files + fastcgi)
dockerfiles/builder/         node 22 + php + composer + rsync + inotify-tools
.agents/skills/              skills for agents
.agents/memories/            durable agent memory
docs/                        documentation site (Diátaxis, MkDocs Material)
mkdocs.yml                   documentation site config
tainacan/                    plugin submodule
```

---

## 4. Environment architecture

### 4.1 Services

| Service | Image | Role | Published |
|---|---|---|---|
| `db` | `mariadb:11` | database, healthcheck, `db_data` volume | `${DB_PORT}` |
| `wordpress` | `wordpress:php8.3-fpm` (+ PHP limits + WP-CLI) | PHP-FPM on 9000; `make wp` and `make shell` run here | no |
| `nginx` | `nginx:1.27-alpine` | static files + fastcgi proxy | `${WP_PORT}` |
| `builder` | `dockerfiles/builder` | assets, watch and tests; profile `watch`; only writer of sources | no |
| `elasticsearch` | ES 8.15 | optional, override file | `${ES_PORT}` |

Request flow: browser -> `nginx:80` -> static files from the shared volume, or
`fastcgi_pass wordpress:9000` for PHP -> `wordpress` -> `db`.

### 4.2 Mounts

| Host | Container | Mode | Services |
|---|---|---|---|
| `tainacan/src` | `/var/www/html/wp-content/plugins/tainacan` | read-only | wordpress, nginx |
| `tainacan/` | `/repo` | read-write | builder |
| `dockerfiles/nginx/default.conf` | `/etc/nginx/conf.d/default.conf` | read-only | nginx |

Named volumes: `db_data`, `wordpress_data`, `tainacan_node_modules`, `wp_tests`,
and `es_data` in the override.

`wordpress_data` holds core, `wp-config.php` and uploads. It is never on the
host, which is what keeps WordPress out of the repositories.

### 4.3 Environment variables

All defaults are documented in `.env.example`. Important ones:
`WP_PORT`, `WP_SITE_URL`, `WP_TITLE`, `WP_ADMIN_*`, `DB_*`, `DB_PREFIX`,
`TAINACAN_PLUGIN_PATH`, `ES_PORT`.

`TAINACAN_PLUGIN_PATH` accepts `./tainacan` (submodule) or an absolute path to an
external clone. Pass the repository root; the stack appends `/src` itself.

### 4.4 Make targets

| Target | Does |
|---|---|
| `make help` | list targets (default goal) |
| `make env` | create `.env` from `.env.example` if missing |
| `make submodules` | `git submodule update --init --recursive` |
| `make config` | write gitignored `build-config.cfg` for both submodules |
| `make setup` | first run: assets, stack, WordPress install, hardening |
| `make up` / `up-elastic` | start the stack (with Elasticsearch) |
| `make watch` | rebuild assets on change (polling) |
| `make assets` / `assets-prod` | one-shot development / production build |
| `make down` / `reset` | stop / stop and delete data volumes |
| `make restart`, `make logs`, `make ps` | lifecycle and observability |
| `make shell` / `db-shell` | shells |
| `make wp ARGS="..."` | wp-cli |
| `make test` | PHPUnit suite |
| `make guard` | containment check |
| `make harden` | add `DISALLOW_FILE_MODS` |

### 4.5 WP-CLI

WP-CLI 2.12 runs **inside the `wordpress` container**. There is no separate CLI
service.

- **`make wp ARGS="plugin list"`** is the canonical entry point. It runs
  `docker compose exec -T -u 33 wordpress wp ...`, so WP-CLI runs as `www-data`
  and anything it writes (such as `wp-config.php`) stays owned by the web user.
- **`make shell` then `wp ...`** also works. `exec` runs as root by default, so
  the wrapper installed in `dockerfiles/wordpress/Dockerfile` adds `--allow-root`
  automatically. Prefer `make wp` for writes, because a root-owned
  `wp-config.php` would block later writes by uid 33.

Both use `/var/www/html` as the WordPress root, and both need `make up` running.

---

## 5. Lifecycle

```sh
git clone --recurse-submodules <repo> && cd tainacan-docker
make setup          # slow first time: npm ci + composer install
# edit PHP -> refresh browser
make watch          # in a second terminal, for JS/CSS/SCSS
make down           # stop;  make reset to wipe data
```

`make setup` builds assets, starts the stack, installs WordPress, activates the
plugin, sets pretty permalinks and applies hardening constants via
`wp config set`.

---

## 6. Working on the plugin

### 6.1 The autoloader contract

`tainacan/src/classes/tainacan-creator.php` registers a **non-PSR-4** autoloader.
For `Tainacan\Some_Class` it looks for a file literally named
`class-tainacan-some-class.php` inside the directories listed in `DIRS`.

Consequences:

- Filename must match the class: `My_Thing` -> `class-tainacan-my-thing.php`.
- A file in a directory not in `DIRS` will never load.
- Deeper namespaces map to subdirectories (`Tainacan\Importer\X` ->
  `background-process/importer/`).
- If you see `Tainacan: Class X not found`, it is a filename or directory problem.

### 6.2 Namespaces

| Namespace | Directory | Responsibility |
|---|---|---|
| `Tainacan\Entities` | `classes/entities/` | models: Collection, Item, Metadatum, Item_Metadata_Entity, Taxonomy, Term, Filter, Metadata_Section, Log |
| `Tainacan\Repositories` | `classes/repositories/` | persistence and queries; singletons via `::get_instance()` |
| `Tainacan\API` | `classes/api/` | REST controllers |
| `Tainacan\Exposers` | `classes/exposers/` | JSON, HTML, CSV, XML, TXT, OAI-PMH, JSON-LD |
| `Tainacan\Mappers` | `classes/mappers/` | standards such as Dublin Core |
| `Tainacan\Background_Process` | `classes/background-process/` | importers, exporters, generic jobs, heartbeat |
| `Tainacan\Integrations` | `classes/integrations/` | ElasticPress, WordPress AI |
| `Tainacan\OAIPMH` | `classes/oaipmh/` | OAI-PMH protocol |
| `Tainacan\CLI` | `classes/cli/` | WP-CLI commands (`wp tainacan ...`) |
| root `Tainacan` | `classes/` | Private_Files, Roles, Search_Engine, Bulk_Edit, utils |

Repositories and handlers use the `Traits\Singleton_Instance` trait.

### 6.3 Repository + entity pattern

```php
$items = \Tainacan\Repositories\Items::get_instance();
$item  = $items->fetch($id);
$item->set_title('New title');
if ($item->validate()) {
    $items->insert($item);
}
```

Repositories are the data access layer and the entity factory. Always
`::get_instance()`; never `new`.

### 6.4 Domain model

- A **collection** is the container.
- A collection owns **metadata**, grouped into **metadata sections**.
- An **item** belongs to a collection; each value is an
  **`Item_Metadata_Entity`**.
- **Metadata types** and **filter types** have a PHP registration and a Vue
  component under `src/views/admin/components/{metadata-types,filter-types}/`.
  Both directories are registered in `DIRS`.
- **Filters** drive faceted search and are backed by metadata.
- **Taxonomies** and **terms** wrap WordPress taxonomies with Tainacan semantics.

### 6.5 Migrations

Schema changes go through `tainacan/src/migrations.php`, which runs on `init`.
Do not add ad-hoc `dbDelta` calls elsewhere; existing installs must upgrade
cleanly.

### 6.6 Capabilities

`Tainacan\Roles` defines capabilities (for example `tainacan_edit_items`) and maps
them to WordPress roles. Enforce them in REST permission callbacks and in the
admin UI.

---

## 7. Build pipeline

### 7.1 Outputs

| Output | Produced by | Consumed by |
|---|---|---|
| `src/vendor/` | `composer install` (vendor-dir `src/vendor`) | PHP runtime, phpunit, phpcs |
| `src/assets/js/*.js` | webpack | `wp_enqueue_script` |
| `src/assets/css/*.css` | `compile-sass.sh` | `wp_enqueue_style` |

### 7.2 Order and gating

`tainacan/build.sh` runs, gated by md5 checksums so unchanged steps are skipped:

1. `npm ci` when `package.json` / lock file changed
2. `composer install` when `composer.json` changed (`--no-dev` with `--prod`)
3. `sh compile-sass.sh` when any `.scss` changed
4. `npm run build` or `build-prod` when any `.js` / `.vue` changed

It then rsyncs to a throwaway path (`/tmp/tainacan-dist`, set by `make config`),
which is harmless here because WordPress reads the mounted source directly.

### 7.3 Webpack and Sass

Webpack entries and output live in `webpack.common.js` (output
`src/assets/js/`, `publicPath` `./wp-content/plugins/tainacan/assets/js/`).
`compile-sass.sh` compiles an explicit list of entry files, one line each;
adding a new SCSS entry means editing that list.

### 7.4 Why watch polls

Docker Desktop on macOS does not deliver inotify events from host files into
Linux containers. The watchers poll every 2 seconds. Do not change this to
inotify.

### 7.5 Performance

`node_modules` is a Docker named volume, not the host bind mount, because macOS
file sharing makes module I/O slow. Keep it that way.

---

## 8. Testing

### 8.1 Wiring

- `tainacan/phpunit.xml.dist`: bootstrap `tests/bootstrap.php`, one testsuite
  collecting `./tests/` with prefix `test-` and suffix `.php`.
- `tests/bootstrap.php` requires `tests/bootstrap-config.php` (gitignored),
  resolves `WP_TESTS_DIR` from the environment (falling back to the config),
  loads the plugin via `muplugins_loaded`, then the WordPress test bootstrap and
  the Tainacan factories.
- Base cases: `TAINACAN_UnitTestCase`, `TAINACAN_UnitApiTestCase` (boots
  `WP_REST_Server` and fires `rest_api_init`), both in namespace `Tainacan\Tests`.
- Factories in `tests/factories/`.

### 8.2 Running

```sh
make test
```

This creates `tests/bootstrap-config.php` from the sample if missing, then runs
inside the builder image:

```
tests/bin/install-wp-tests.sh tainacan_test root <db_root_password> /tmp/wp-tests db:3306 latest
src/vendor/bin/phpunit
```

The installer signature is
`<db-name> <db-user> <db-pass> <test-dir> [db-host] [wp-version] [skip-db-create]`.
It populates `/tmp/wp-tests`, which is the `wp_tests` named volume, so the
WordPress test library is downloaded once. `WP_TESTS_DIR` must point at
`/tmp/wp-tests/wordpress-tests-lib`, not the parent directory.

Single file:

```sh
docker compose --profile watch run --rm --no-deps \
  -e WP_TESTS_DIR=/tmp/wp-tests/wordpress-tests-lib \
  builder sh -lc 'src/vendor/bin/phpunit tests/test-api-items.php'
```

### 8.3 Writing tests

File `test-<area>.php`, class `Test_<Area>`, namespace `Tainacan\Tests`,
`public function setUp() : void`. For REST, extend `TAINACAN_UnitApiTestCase` and
use `rest_do_request()`.

**Naming gotcha:** only `test-*.php` is collected. Files named `__test-*.php` or
`_test-*.php` are deliberately skipped. If a new test does not run, check the
filename first.

Full coverage map and pitfalls: the `tainacan-testing` skill.

---

## 9. Documentation

| Artifact | Audience | Rule |
|---|---|---|
| `README.md` | users setting up the stack | keep commands accurate; it is the front door |
| `AGENTS.md` | coding agents | this file; update when architecture changes |
| `.agents/skills/` | agents, on demand | one skill per area; keep trigger words specific |
| `.agents/memories/` | agents, across sessions | durable knowledge; follow the agent-memory skill |
| `docs/` + `mkdocs.yml` | users and maintainers | Diátaxis site built with MkDocs Material; `make docs-build` |
| `tainacan/docs/` + `tainacan/generate_docs.sh` | plugin developers | generated API/hook/OpenAPI docs; run inside the plugin repo |

`generate_docs.sh` (in the plugin repo) generates phpDocumentor output, hook
documentation (`wp-documentor`), OpenAPI specs and class diagrams into
`tainacan/docs/`. It needs the Composer dev dependencies
(`composer install`), which `make assets` provides.

External sources of truth for the plugin:

- Official wiki: <https://wiki.tainacan.org/>
- Developer docs: <https://tainacan.github.io/tainacan-wiki/#/dev/>
- Plugin on WordPress.org: <https://wordpress.org/plugins/tainacan/>

When you change the stack, update `README.md` and `AGENTS.md`, and record the
decision in `.agents/memories/` per the agent-memory skill.

---

## 10. REST API

- Namespace `tainacan/v2` (`TAINACAN_REST_NAMESPACE`).
- Controllers in `src/classes/api/endpoints/`, extending
  `Tainacan\API\Rest_Controller`.
- One controller per resource: collections, items, item-metadata, metadata,
  metadata-types, metadata-sections, metadatum-mappers, taxonomies, terms,
  filters, filter-types, facets, logs, roles, reports, exporters, importers,
  background-processes, bulkedit, exposers, sequence-edit, oai.
- Every route needs an explicit `permission_callback`; gate writes with
  capabilities from `Tainacan\Roles`.
- Readers can request alternative formats through the exposers layer; OAI-PMH is
  served as XML at `/wp-json/tainacan/v2/oai`.

Details and a skeleton controller: the `tainacan-rest-api` skill.

---

## 11. Elasticsearch

Optional. `make up-elastic` starts ES 8.15 with security disabled, reachable at
`http://elasticsearch:9200`. The engine abstraction is
`classes/class-tainacan-search-engine.php`; the integration is
`classes/integrations/class-tainacan-elastic-press.php` (plus the `-lte4`
variant for older ElasticPress). Details, version-compatibility guidance and
verification steps: the `tainacan-elasticsearch` skill.

---

## 12. Task recipes

**Add a REST endpoint.** Create
`src/classes/api/endpoints/class-tainacan-rest-<resource>-controller.php` in
namespace `Tainacan\API\EndPoints`, extend `Rest_Controller`, implement
`register_routes()` with permission callbacks, and wire the controller the same
way an existing one is wired. Then add `tests/test-api-<resource>.php`.

**Add a PHP class.** Choose the namespace from the table in section 6.2, create
`class-tainacan-<lowercase-dashed-name>.php` in the matching directory, use the
singleton trait if needed, and register any hooks from `tainacan-creator.php`.

**Add a webpack entry.** Add the entry to `webpack.common.js`, then add the
matching `wp_enqueue_script` with `TAINACAN_VERSION`, then `make assets`.

**Add a Sass entry.** Add the compile line to `tainacan/compile-sass.sh` and the
matching enqueue, then `make assets`.

**Add a test.** Add `tests/test-<area>.php` (see section 8), extend the right base
case, run `make test`.

**Change the stack.** Edit `docker-compose.yml` or the Dockerfiles, run
`docker compose config` to validate, `make down && make up`, then update
`README.md` and `AGENTS.md`.

**Point at an external clone.** Set `TAINACAN_PLUGIN_PATH` in `.env` to an
absolute path and `make up`.

**Refresh assets after a pull.** `make assets`. If `package-lock.json` changed it
runs `npm ci`; if `composer.json` changed it runs `composer install`.

**Write documentation.** Add a page under `docs/<section>/` in the correct
Diátaxis mode, list it in `nav` in `mkdocs.yml`, then `make docs-build`. See the
project-documentation skill.

**Record a memory.** Write one markdown file under
`.agents/memories/{semantic,episodic,procedural}/` and add it to
`.agents/memories/INDEX.md`. See the agent-memory skill.

---

## 13. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Blank admin, missing styles | assets not built: `make assets` |
| nginx 502 | php-fpm not up or wrong service name; nginx proxies to `wordpress:9000`; check `make ps` and `make logs` |
| Port already in use | change `WP_PORT` in `.env`, `make up` |
| DB connection error | `db` still starting; it has a healthcheck, wait or `make logs` |
| Permalinks 404 | `docker compose up -d --force-recreate nginx` |
| `Read-only file system` | expected: sources are mounted read-only for the web tier; write via the builder or the database |
| `Tainacan: Class X not found` | autoloader filename/directory mismatch |
| Sass complains about a missing file | `compile-sass.sh` uses an explicit list; add or fix the line |
| Test ignored | file must be named `test-*.php`, not `__test-*` or `_test-*` |
| `bootstrap-config.php` missing | `make test` creates it; for manual runs copy `tests/bootstrap-config-sample.php` |
| ES container exits | `vm.max_map_count` too low (see the elasticsearch skill) |
| `Operation not permitted` under `wp-content` | the host source dir was deleted and recreated (for example after restoring a submodule), leaving a stale bind mount: `docker compose up -d --force-recreate wordpress nginx` |

---

## 14. Skills index

| Skill | Scope |
|---|---|
| [`.agents/skills/tainacan-dev-environment`](.agents/skills/tainacan-dev-environment/SKILL.md) | stack, mounts, make targets, guard rails, troubleshooting |
| [`.agents/skills/tainacan-plugin-architecture`](.agents/skills/tainacan-plugin-architecture/SKILL.md) | autoloader, namespaces, repositories and entities, domain model |
| [`.agents/skills/tainacan-rest-api`](.agents/skills/tainacan-rest-api/SKILL.md) | endpoints, permissions, exposers, OAI-PMH, calling the API |
| [`.agents/skills/tainacan-build-and-assets`](.agents/skills/tainacan-build-and-assets/SKILL.md) | npm, webpack, sass, composer, enqueueing |
| [`.agents/skills/tainacan-testing`](.agents/skills/tainacan-testing/SKILL.md) | PHPUnit wiring, factories, REST tests |
| [`.agents/skills/tainacan-elasticsearch`](.agents/skills/tainacan-elasticsearch/SKILL.md) | enabling, indexing, debugging faceted search |
| [`.agents/skills/agent-memory`](.agents/skills/agent-memory/SKILL.md) | CoALA memory store in `.agents/memories/` |
| [`.agents/skills/project-documentation`](.agents/skills/project-documentation/SKILL.md) | Diátaxis + MkDocs Material site in `docs/` |

---

## 15. Glossary

- **Collection** — top-level container of items and metadata.
- **Item** — a record in a collection.
- **Metadatum** — a metadata definition owned by a collection or shared.
- **Item_Metadata_Entity** — the value of one metadatum for one item.
- **Exposer** — an output format for a resource (JSON, CSV, OAI-PMH, ...).
- **Mapper** — maps Tainacan metadata to an external standard.
- **Facet** — a filterable metadata dimension in search.
- **Builder** — the container that runs npm, webpack, sass and composer.
- **Guard** — the check that refuses WordPress files inside a Tainacan checkout.
