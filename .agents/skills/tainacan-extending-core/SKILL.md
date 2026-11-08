---
name: tainacan-extending-core
description: Use when writing a separate WordPress plugin (or theme code) that extends Tainacan without patching the core. Triggers on "extension plugin", "extend Tainacan", "tainacan_register_admin_hook", "admin form hook", "register metadata type", "register filter type", "view mode", "tainacan_register_view_mode", "wp.hooks faceted search", "tainacan-fetch-args", "tainacan-api-prepare-items-args", "tainacan-item-to-array", "_option_", "tnc_col_", "tnc_tax_", "taxquery", "metaquery", "fetch_only", "Requires Plugins", "textdomain", "what not to copy from the core".
---

# Extending Tainacan from a separate plugin

Audience: an agent writing a plugin that depends on Tainacan. The goal is to use
the core's public surface (repositories, entities, hooks, REST) and to avoid
copying the core's own shortcuts. File:line citations are relative to
`tainacan/src/` at Tainacan 1.4.1 (`develop`); re-check them when the core moves.

Hook catalogue with signatures and citations: [`hooks.md`](hooks.md).

## 1. Data access: repositories and entities, never `$wpdb`

- Repositories are singletons: `\Tainacan\Repositories\Items::get_instance()` or
  the loaders `tainacan_items()`, `tainacan_metadata()`, `tainacan_collections()`,
  `tainacan_taxonomies()`, `tainacan_terms()`, `tainacan_item_metadata()`
  (`classes/tainacan-loaders.php:9-82`). Never `new`.
- `validate()` before `insert()`. `Repository::insert()` throws
  `Entities must be validated before you can save them` for publish/future/
  private/pending entities that were not validated
  (`classes/repositories/class-tainacan-repository.php:161-167`);
  `Item_Metadata::insert()` throws unconditionally
  (`classes/repositories/class-tainacan-item-metadata.php:30-35`). On failure read
  `$entity->get_errors()` (`classes/entities/class-tainacan-entity.php:335`).
- Permission comes from the entity, not from `current_user_can('manage_options')`:
  `$entity->can_read()`, `can_edit()`, `can_delete()`, `can_publish()`
  (`class-tainacan-entity.php:422-452`) delegate to the repository, which maps to
  the entity's capability object (`class-tainacan-repository.php:756-774`).
  Collection-scoped checks: `$collection->user_can('edit_items')` builds
  `tnc_col_<id>_edit_items` (`classes/entities/class-tainacan-collection.php:1288-1294`).
  Capability names live in `Tainacan\Roles`: repository-wide `tnc_rep_*` and
  `manage_tainacan` (`classes/class-tainacan-roles.php:95-156`), per-collection
  `tnc_col_%d_*` with `tnc_col_all_*` supercaps (`:252-293`).
- Bulk writes: `$repo->disable_logs()` / `enable_logs()`
  (`class-tainacan-repository.php:67-78`); every insert is logged otherwise.

```php
$items = tainacan_items();
$item  = new \Tainacan\Entities\Item();
$item->set_collection( $collection );
$item->set_title( 'Title' );
$item->set_status( 'publish' );
if ( ! $item->validate() ) { return $item->get_errors(); }
$item = $items->insert( $item );
```

## 2. Hook surface (summary; details in `hooks.md`)

**Queries.** `tainacan-fetch-args ($args, $type)` runs in every repository
`fetch()` with `$type` in `items`, `collections`, `metadata`, `metadata-section`,
`taxonomies`, `filters`, `logs` (`classes/repositories/class-tainacan-items.php:395`
and siblings). `tainacan-api-prepare-items-args ($args, $request)` is the last
step of REST argument translation (`classes/api/class-tainacan-rest-controller.php:188`).
`tainacan-item-to-array ($array, $item)` shapes every item serialization
(`classes/entities/class-tainacan-item.php:69`).

**Persistence.** `tainacan-pre-insert`, `tainacan-insert ($obj, $diffs, $is_update)`,
`tainacan-insert-<post_type>` (e.g. `tainacan-insert-tainacan-collection`),
`tainacan-pre-delete`, `tainacan-deleted` (`class-tainacan-repository.php:173-240`,
`:681-698`). Item metadata fires `tainacan-insert-Item_Metadata_Entity`
(`class-tainacan-item-metadata.php:116-117`).

**Admin form hooks.** Register inside `tainacan-register-admin-hooks` (fired on
`admin_init`, `views/admin/classes/hooks/class-tainacan-admin-hooks.php:13-17`)
with `tainacan_register_admin_hook( $context, $callback, $position, $conditional )`
(`admin-hooks-functions.php:8`). Contexts: `collection`, `metadatum`, `item`,
`taxonomy`, `term`, `filter`, `role`, `metadataSection`; positions `begin-left`,
`begin-right`, `end-left`, `end-right` (`:20-26`). Contract: the callback is
called at registration time and must **return** a string, otherwise the hook is
dropped (`:48-59`). The string reaches the Vue admin as `tainacan_plugin.form_hooks`
and is injected with `v-html` inside `<form class="form-hook-region">`
(`views/class-tainacan-pages.php:389`, `item-edition-form.vue:198-202`), so:
inline `<script>` never runs, nested `<form>` is discarded, and the Vue app
re-renders the markup. Enqueue your JS separately and listen to the
`tainacan-<entity>-hook-reload` event on `document`
(`views/admin/js/mixins.js:99-105`). Save in `tainacan-insert-tainacan-<entity>`
reading `tainacan_get_api_postdata()` after `$object->can_edit()`, and expose the
meta key through `tainacan-api-response-<entity>-meta` so the form repopulates
(official guide: `tainacan/docs/admin-form-hooks.md`).

**Registries.** Metadata type: `tainacan-register-metadata-type ($helper)` ->
`$helper->register_metadata_type( $handle, $class, $script_path, $args )`
(`metadata-type-helper/class-tainacan-metadata-type-helper.php:40`, `:62`), class
extends `\Tainacan\Metadata_Types\Metadata_Type`. Filter type:
`tainacan-register-filter-type` -> `register_filter_type()`
(`filter-type-helper/class-tainacan-filter-type-helper.php:41`, `:63`), extends
`\Tainacan\Filter_Types\Filter_Type`. Both actions fire **while
`tainacan.php` is being included** (`classes/tainacan-creator.php:165`, `:169`,
required from `tainacan.php:36`), so `add_action` must sit at the top level of
your main file and your plugin must load before Tainacan (WordPress loads
plugins in alphabetical order of their path); an `add_action` inside
`plugins_loaded` is too late. Importers, exporters, exposers, mappers and
generic processes register on `init` (`tainacan-register-importers`,
`-exporters`, `-exposers`, `-mappers`, `tainacan-register-generic_process`, note
the underscore) with arrays requiring `name`, `slug`, `class_name`
(`class-tainacan-importer-handler.php:83`, `:128-141`;
`class-tainacan-generic-handler.php:34-44`).

**View modes.** `tainacan_register_view_mode( $slug, $args )`
(`classes/theme-helper/template-tags.php:1231`) defaults to
`type => 'template'` with `template => <stylesheet>/tainacan/view-mode-<slug>.php`
(`class-tainacan-theme-helper.php:1111-1134`); call it on `init` after the core
registers its own (priority 10, `:117`). Template output is injected with
`v-html`, so no inline scripts. Filters `tainacan-default-view-mode-for-themes`
(`:1161`) and `tainacan-enabled-view-modes-for-themes` (`:1182`). There is no
`tainacan-register-view-mode` action.

**Item page.** Type-specific value filters
`tainacan-item-metadata-get-value-as-html--type-<type>` exist for compound,
control, description, date, geocoordinate, relationship, taxonomy, text,
textarea, url, user; the generic `tainacan-item-metadata-get-value-as-html` only
runs when the type has no `get_value_as_html()`
(`classes/entities/class-tainacan-item-metadata-entity.php:146-156`, `:207`).
Per-metadatum wrappers `tainacan-get-item-metadatum-as-html-{before,after}`
with `--type-`, `--id-`, `--index-` variants (`class-tainacan-item.php:873-908`).
Everything is passed through `wp_kses(..., 'tainacan_content')` (`:792`); the
outermost document filter after kses is `tainacan-get-the-document`
(`template-tags.php:104`).

**Dashboard.** `tainacan-dashboard-cards` (array of `id`, `title`,
`description`, `content` callback, `icon`, `color`, `position`,
`views/dashboard/class-tainacan-dashboard.php:268-275`),
`tainacan-dashboard-before-cards` / `-after-cards` (`views/dashboard/page.php:49`, `:62`).

**JavaScript (`wp.hooks`).** Faceted search per-item filters `(html, item) => string`
in `views/gutenberg-blocks/blocks/faceted-search/theme-search/js/view-modes-mixin.js:56-79`.
Name mismatch: `hasAfterHook()` tests `tainacan_faceted_search_collection_item_after`
(`:64`) while `getAfterHook()` applies `tainacan_faceted_search_item_after`
(`:76`); register the same callback on both names or use the per-collection
name `tainacan_faceted_search_collection_<id>_item_after`, which both methods
use. Region filters (`..._items_list_before`, `_search_control_before`, ...) are
read once when the app parses hooks (`theme.vue:1370-1421`), so register them
in a script with the `wp-hooks` dependency loaded before the block. The list
dispatches `tainacan-items-list-is-loading-items` on `document` (`theme.vue:1237`).
Admin actions: `tainacan_navigation_path_updated` (`views/admin/admin.vue:38`),
`tainacan_item_edition_item_loaded`, `tainacan_item_edition_metadata_loaded`
(`item-edition-form.vue:1488`, `:1532`). Cards use `:key="index"`
(`view-mode-cards.vue:25`); do not keep per-item state in the DOM.

## 3. Data model gotchas

- Items are posts of type `tnc_col_<collection_id>_item`
  (`class-tainacan-collection.php:85`, `:92`, `:507`), registered with
  `exclude_from_search => true` (`:145`), so `post_type => 'any'` skips them.
  Taxonomies are `tnc_tax_<taxonomy_id>` (`class-tainacan-taxonomy.php:51`, `:197`).
  Fixed types: `tainacan-collection`, `tainacan-metadatum`, `tainacan-taxonomy`,
  `tainacan-filter` (`class-tainacan-collection.php:72` and siblings).
- Metadata type options live in one serialized postmeta `metadata_type_options`
  (`classes/repositories/class-tainacan-metadata.php:160`) plus an exploded index
  `_option_<key>` written with `update_post_meta` and never deleted
  (`:1749-1757`). Read with `$metadatum->get_metadata_type_options()`
  (`class-tainacan-metadatum.php:249`) or `get_post_meta($id, '_option_taxonomy_id', true)`;
  `get_post_meta($id, 'taxonomy_id')` is always empty. Filters have
  `filter_type_options` and no `_option_` index (`class-tainacan-filters.php:55`).
- `collections_ids` on a taxonomy is a denormalised cache updated only by the
  `tainacan-taxonomy-added-to-collection` / `-removed-from-collection` actions
  (`class-tainacan-metadata.php:1710-1729`, `class-tainacan-taxonomies.php:25-26`).
  The core itself derives the real relation from `_option_taxonomy_id` +
  `collection_id` postmeta when registering taxonomies (`:342-376`) and the REST
  response rebuilds it from `get_taxonomy()->object_type` (`class-tainacan-rest-taxonomies-controller.php:150-161`).
  Treat the metadata as the source of truth.
- Taxonomy values are term relationships, not postmeta; other types are postmeta
  keyed by the metadatum id (`class-tainacan-item-metadata.php`, see `fetch()` `:326`).

## 4. REST gotchas for clients (`tainacan/v2`)

`prepare_filters()` whitelists clause keys (`class-tainacan-rest-controller.php:94-188`):

- `taxquery[n]` accepts `taxonomy`, `metadatum` (becomes `field`), `terms`,
  `operator`, `relation` (`:155-161`). `field` is ignored and `include_children`
  is dropped, so `WP_Tax_Query` defaults to including children.
- `metaquery[n]` accepts `key`, `value`, `compare`, `relation`, `metadatumtype`
  (becomes `type`; `type` itself is dropped) (`:131-137`). A root
  `metaquery[relation]=OR` is copied to `meta_query['relation']` (`:315-316`).
  The items controller overrides `type` with the registered filter's type for
  keys that match a filter (`class-tainacan-rest-items-controller.php:698-707`).
- `perpage` maps to `posts_per_page`; values `< 1` become the safe maximum
  (`:175-177`, `:198-201`) and anything above
  `$TAINACAN_API_MAX_ITEMS_PER_PAGE` is clamped (`items-controller:710-714`). The
  cap is `TAINACAN_API_MAX_ITEMS_PER_PAGE` (min 12) or the option
  `tainacan_option_search_results_per_page`, default 96 (`tainacan.php:27`).
  Read `X-WP-Total` / `X-WP-TotalPages` (`items-controller:799-805`).
- Without `fetch_only` every item carries all metadata with `value_as_html`;
  use `fetch_only=title,thumbnail` plus `fetch_only_meta=<ids>`
  (`items-controller:295-327`, `:759-767`).
- `perm=readable` is always appended (`rest-controller:186`).
- Exposer output requested through the URL parameter is passed through
  `wp_kses('tainacan_content')` and then `exit()` (`class-tainacan-exposers-handler.php:148-150`);
  unknown XML tags are stripped.

## 5. Do not copy from the core

- SQL assembled by interpolation, even under `phpcs:ignore`
  (`classes/class-tainacan-bulk-edit.php:100-101`, `:408`;
  `class-tainacan-taxonomies.php:350-361`). Use repositories; if a table has no
  repository, `$wpdb->prepare()` with placeholders.
- `htmlspecialchars()` applied to input mid-processing instead of escaping at
  output (`class-tainacan-rest-items-controller.php:1313`, `:1328`;
  `classes/exposers/class-tainacan-html.php:108`). Sanitize on input, escape on
  output with `esc_html`/`esc_attr`/`wp_kses`.
- Mutable global state such as `Theme_Helper::$visiting_collection_cover`, a
  public property set while swapping `$wp_query` and read back later
  (`class-tainacan-theme-helper.php:20`, `:586-589`, `:1236-1237`). Pass context
  explicitly.
- `get_svg_icon()` does `file_get_contents()` without checking the file exists
  (`classes/traits/class-tainacan-svg-icon.php:17-25`); test `is_readable()` first.
- Hooks that swallow errors (`register()` returning `false` silently,
  `class-tainacan-admin-hooks.php:44-46`): in your own API, return `WP_Error`.

## 6. Checklist for a new extension plugin

1. Header: `Requires Plugins: tainacan`, `Requires at least: 6.5`,
   `Requires PHP: 7.4` (the core's floor, `tainacan.php` header), own
   `Text Domain` equal to the plugin slug. Never load strings under the
   `tainacan` textdomain.
2. Prefix everything global (functions, options, transients, handles, REST
   namespace `<slug>/v1`, CSS root class); classes under your own namespace.
3. Guard against Tainacan being inactive: check `class_exists('\Tainacan\Repositories\Items')`
   or `function_exists('tainacan_items')` before use; admin notice otherwise.
4. Registration timing: metadata/filter types at top level (section 2);
   admin hooks inside `tainacan-register-admin-hooks`; view modes, importers,
   exposers on `init`.
5. Permissions: `can_*()` on entities, `tnc_*` capabilities in every REST
   `permission_callback`; never `__return_true` on writes.
6. Assets: enqueue only on the screens that use them (`hook_suffix`, block or
   shortcode presence), versioned by your constant, no CDN; declare `wp-hooks`
   when using `wp.hooks`.
7. Data: own postmeta keys for extra fields; read Tainacan data through
   repositories and `get_metadata_type_options()`; treat `collections_ids` as a
   cache.
8. Uninstall hygiene: `uninstall.php` removes your options, postmeta and
   transients only; never touch Tainacan tables or the background-process queue.
9. Verify in the real admin (form hook, faceted search, item page) with the
   theme in use and other plugins active; console and `debug.log` clean.
