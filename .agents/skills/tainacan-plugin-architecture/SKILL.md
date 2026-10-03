---
name: tainacan-plugin-architecture
description: Use when adding, moving or reviewing PHP classes in the Tainacan plugin. Triggers on "Tainacan class", "repository", "entity", "metadata type", "filter type", "exposer", "mappers", "background process", "autoload", "singleton", "capabilities", "roles", "where does this code go", "src/classes".
---

# Tainacan plugin architecture

## Root vs plugin

The repository root is the **development workspace**. The plugin that WordPress
loads is `tainacan/src/`:

```
tainacan/               dev workspace (build scripts, composer, npm, tests)
    src/                the actual plugin
        tainacan.php    plugin entry point and header
        migrations.php  schema/data migrations, run on `init`
        classes/        PHP classes
        views/          Vue admin app, Gutenberg blocks, SCSS
        assets/js       webpack output (gitignored, built)
        assets/css      sass output (gitignored, built)
        vendor/         composer output (gitignored, built)
    tests/              PHPUnit suite
```

Constants in `src/tainacan.php`: `TAINACAN_VERSION`, `TAINACAN_BASE_DIR`,
`TAINACAN_CLASSES_DIR`, `TAINACAN_API_MAX_ITEMS_PER_PAGE`,
`TAINACAN_API_MAX_BATCH_TERMS`.

## The autoloader contract

`src/classes/tainacan-creator.php` registers `tainacan_autoload`. It is not PSR-4.
For a class in the `Tainacan` namespace it looks for:

```
<class-tainacan-<lowercase-name-with-dashes>.php>
```

in the directories listed in `DIRS`. So `Tainacan\My_Thing` loads from any of
`cli/ api/ oaipmh/ traits/ classes/ mappers/ background-process/{entities,importer,exporter,generic-process}/ exposers/ api/endpoints/ repositories/`.

Deeper namespaces map to subdirectories, e.g. `Tainacan\Importer\X` lives in
`background-process/importer/`, `Tainacan\Exposers\Json` in `exposers/`.

Consequences:

- The filename must match the class name exactly, dashes for underscores.
- A class placed in a directory not in `DIRS` will never load.
- Adding a new top-level directory means adding it to `DIRS`.

The plugin also uses a singleton trait, `Traits\Singleton_Instance`, for
repositories, handlers and role management.

## Main namespaces

| Namespace | Directory | Responsibility |
|---|---|---|
| `Tainacan\Entities` | `classes/entities/` | Domain models: `Collection`, `Item`, `Metadatum`, `Item_Metadata_Entity`, `Taxonomy`, `Term`, `Filter`, `Metadata_Section`, `Log` |
| `Tainacan\Repositories` | `classes/repositories/` | Data access: `Collections`, `Items`, `Metadata`, `Item_Metadata`, `Taxonomies`, `Terms`, `Filters`, `Metadata_Sections`, `Logs` |
| `Tainacan\API` | `classes/api/` | REST layer, namespace `tainacan/v2` |
| `Tainacan\Exposers` | `classes/exposers/` | Output formats (JSON, HTML, CSV, XML, TXT, OAI-PMH, JSON-LD) |
| `Tainacan\Mappers` | `classes/mappers/` | Metadata standard mappings (Dublin Core, etc.) |
| `Tainacan\Background_Process` | `classes/background-process/` | Importers, exporters, generic jobs, heartbeat |
| `Tainacan\Integrations` | `classes/integrations/` | ElasticPress, WordPress AI |
| `Tainacan\OAIPMH` | `classes/oaipmh/` | OAI-PMH protocol |
| `Tainacan\CLI` | `classes/cli/` | WP-CLI commands |
| `Tainacan` (root) | `classes/` | `Private_Files`, `Roles`, `Search_Engine`, `Bulk_Edit`, utils |

## The repository + entity pattern

Repositories extend `Repositories\Repository`. They encapsulate queries and
persistence for one entity type and also act as the entity factory
(`fetch()`, `insert()`, `update()`, `delete()`, `where()`).

Entities extend `Entities\Entity`. They expose typed getters/setters backed by
post meta or custom tables, and a `validate()` method. A common flow:

```php
$repository = \Tainacan\Repositories\Items::get_instance();
$item = $repository->fetch($id);
$item->set_title('New title');
if ($item->validate()) {
    $repository->insert($item);
}
```

Repositories are singletons: always `::get_instance()`.

## Domain model essentials

- A **collection** is the top-level container.
- A collection owns **metadata** (`Metadatum`, grouped by `Metadata_Section`).
- An **item** belongs to a collection; its values are
  **`Item_Metadata_Entity`** records, one per metadatum.
- **Metadata types** and **filter types** are registered in PHP and implemented in
  Vue under `src/views/admin/components/metadata-types/` and
  `.../filter-types/`. The directories are registered in `DIRS`
  (`TAINACAN_METADATA_TYPES_DIR`, `TAINACAN_FILTER_TYPES_DIR`).
- **Taxonomies** and **terms** wrap WordPress taxonomies with Tainacan semantics.
- **Filters** drive faceted search and are backed by metadata.

## Adding a class

1. Decide the namespace from the table above.
2. Create `class-tainacan-<name>.php` in the matching directory.
3. Match the class name exactly (`My_Class` -> `class-tainacan-my-class.php`).
4. If it needs a singleton, use the `Singleton_Instance` trait.
5. If it hooks WordPress, register hooks in the constructor or a dedicated
   `init()` called from `tainacan-creator.php`.
6. If it is publicly reachable, add a REST controller (see the rest-api skill).

## Capabilities and roles

`Tainacan\Roles` defines the capability set and maps them to WordPress roles.
Gate writes with capability checks (e.g. `tainacan_edit_items`) in permission
callbacks, not just in the UI.

## Database

Tainacan stores most entities as WordPress custom post types, with metadata in
post meta and custom tables for relationships such as item metadata and logs.
Schema changes go through `src/migrations.php`, not ad-hoc `dbDelta` calls, so
existing installs upgrade safely.

## Pitfalls

- Never edit files under `src/vendor/` or `src/assets/js/`; they are build output.
- The plugin is mounted read-only in the container, so the web process cannot
  write. Do not design features that write into the plugin directory; use uploads
  or the database.
- `error_log('Tainacan: Class X not found')` at runtime means the autoloader
  could not match the filename to a class.
