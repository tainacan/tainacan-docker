# Tainacan hook catalogue for extensions

Companion to [`SKILL.md`](SKILL.md). Paths are relative to `tainacan/src/` at
Tainacan 1.4.1. Signatures are the callback parameters. Verify before relying on
a line number; the core moves.

## PHP filters

| Hook | Callback params | Where | Notes |
|---|---|---|---|
| `tainacan-fetch-args` | `$args, $type` | `classes/repositories/class-tainacan-items.php:395`, `-collections.php:712`, `-metadata.php:389`, `-metadata-sections.php:215`, `-taxonomies.php:203`, `-filters.php:265`, `-logs.php:246` | `$type`: `items`, `collections`, `metadata`, `metadata-section`, `taxonomies`, `filters`, `logs` |
| `tainacan-api-prepare-items-args` | `$args, $request` | `classes/api/class-tainacan-rest-controller.php:188` | after whitelisting; `$args['perm']` already `readable` (`:186`) |
| `tainacan-api-get-items-alternate` | `false, $request` | `classes/api/endpoints/class-tainacan-rest-items-controller.php:680` | return a response to short-circuit the items query (external engines) |
| `tainacan-api-items-prepare-for-response` | `$item_arr, $item, $request` | `class-tainacan-rest-items-controller.php:378` | per item in REST responses |
| `tainacan-api-response-<entity>-meta` | `$extra_meta, $request` | `item` `:288`; `collection-controller:435`; `metadatum-controller:372`; `taxonomy-controller:201`; `term-controller:630`; `filter-controller:387`; `metadata-section-controller:211` | return postmeta keys to expose; required for admin form hooks to repopulate |
| `tainacan-api-items-response` | `$response, $request` | `class-tainacan-rest-items-controller.php:796` | whole items list payload |
| `tainacan-rest-response` | `$response, $request` | `class-tainacan-rest-items-controller.php:405` | single item payload |
| `tainacan-item-to-array` | `$array_item, $item` | `classes/entities/class-tainacan-item.php:69` | every `Item::_toArray()` |
| `tainacan-item-metadata-get-value-as-html--type-<type>` | `$html, $item_metadata` | `views/admin/components/metadata-types/<type>/class-tainacan-<type>.php` (compound `:269`, control `:314`, core-description `:151` as `description`, date `:129`, geocoordinate `:246`, relationship `:290`, taxonomy `:429`, text `:104`, textarea `:115`, url `:127`, user `:194`) | the generic hook below never runs for these types |
| `tainacan-item-metadata-get-value-as-html` | `$html, $item_metadata` | `classes/entities/class-tainacan-item-metadata-entity.php:207` | only reached when the type has no `get_value_as_html()` (`:152-153`) |
| `tainacan-get-item-metadatum-as-html-{before,after}[--type-X\|--id-N\|--index-N]`, `-before-title`, `-after-title`, `-before-value`, `-after-value` | `$html, $item_metadata` (see source) | `classes/entities/class-tainacan-item.php:873-908` | output then passes `wp_kses('tainacan_content')` (`:792`) |
| `tainacan-get-metadata-section-as-html-{before,after}[--id-N\|--index-N]`, `-before-name`, `-after-name` | see source | `class-tainacan-item.php:1311-1342` | `--index-` restarts per call |
| `tainacan-item-get-document-as-html` | `$html, $img_size, $item` | `class-tainacan-item.php:965` | already kses'd |
| `tainacan-get-the-document` | `$html, $item` | `classes/theme-helper/template-tags.php:104` | outermost; `tainacan_has_document()` (`:449`) depends on it |
| `tainacan_single_item_content` | `$content, $item` | `classes/theme-helper/class-tainacan-theme-helper.php:840` | default single template through `the_content` (`:169`) |
| `tainacan-default-view-mode-for-themes` | `$slug` | `class-tainacan-theme-helper.php:1161` | default from option `tainacan_option_default_view_mode` |
| `tainacan-enabled-view-modes-for-themes` | `$slugs[]` | `class-tainacan-theme-helper.php:1182` | |
| `tainacan-admin-hooks-contexts`, `tainacan-admin-hooks-positions` | `$list` | `views/admin/classes/hooks/class-tainacan-admin-hooks.php:21`, `:25` | extend contexts/positions (the Vue side must render them) |
| `tainacan-admin-ui-options` | `$options` | `views/class-tainacan-pages.php:855` | admin UI switches |
| `tainacan-dashboard-cards` | `$cards[]` | `views/dashboard/class-tainacan-dashboard.php:275` | card keys: `id`, `title`, `description`, `content` (callback), `icon`, `color` (`gray`, `blue`, `turquoise`), `position` |
| `tainacan-dashboard-welcome-message`, `tainacan-dashboard-logo-use-white` | `$value` | `views/dashboard/page.php:41`, `:18` | |
| `tainacan-status-require-validation` | `$statuses[]` | `classes/repositories/class-tainacan-repository.php:165` | which statuses force `validate()` before `insert()` |
| `tainacan-svg-icons-folder-path` | `$path` | `classes/traits/class-tainacan-svg-icon.php:22` | |
| `tainacan-default-search-sentence` | `$bool` | `class-tainacan-rest-items-controller.php:1717` | |

## PHP actions

| Hook | Callback params | Where | Notes |
|---|---|---|---|
| `tainacan-pre-insert`, `tainacan-pre-insert-<post_type>` | `$obj` | `classes/repositories/class-tainacan-repository.php:173-176`, `:209` | |
| `tainacan-insert` | `$obj, $diffs, $is_update` | `class-tainacan-repository.php:238` | fires on create and update |
| `tainacan-insert-<post_type>` | `$obj` | `class-tainacan-repository.php:240` | `tainacan-insert-tainacan-collection`, `-tainacan-metadatum`, `-tainacan-taxonomy`, `-tainacan-filter`; items use their `tnc_col_<id>_item` type |
| `tainacan-insert-Item_Metadata_Entity`, `tainacan-pre-insert-Item_Metadata_Entity` | `$item_metadata` | `classes/repositories/class-tainacan-item-metadata.php:37-38`, `:116-117` | |
| `tainacan-pre-delete`, `tainacan-deleted` (+ `-<post_type>`) | `$entity, $permanent` | `class-tainacan-repository.php:681-698`; item metadata `class-tainacan-item-metadata.php:282-297` | |
| `tainacan-register-admin-hooks` | none | `views/admin/classes/hooks/class-tainacan-admin-hooks.php:17` | on `admin_init`; call `tainacan_register_admin_hook()` here |
| `tainacan-register-metadata-type` | `$helper` | `views/admin/components/metadata-types/metadata-type-helper/class-tainacan-metadata-type-helper.php:40` | fires while `tainacan.php` is included (`classes/tainacan-creator.php:165`) |
| `tainacan-register-filter-type` | `$helper` | `views/admin/components/filter-types/filter-type-helper/class-tainacan-filter-type-helper.php:41` | same timing (`tainacan-creator.php:169`) |
| `tainacan-register-vuejs-plugin` | `$helper` | `views/admin/classes/hooks/class-tainacan-plugin-hooks.php:24` | same timing |
| `tainacan-register-vuejs-component` | `$helper` | `views/admin/classes/hooks/class-tainacan-component-hooks.php:27` | on `init` priority 80; `register_vuejs_component($handle, $script_path, $args)` (`:60`); `args.public` enqueues on the front end too |
| `tainacan-register-importers` | none | `classes/background-process/importer/class-tainacan-importer-handler.php:83` | on `init`; `Importer_Handler::get_instance()->register_importer([...])` needs `name`, `slug`, `class_name` (`:128-141`) |
| `tainacan-register-exporters` | `$handler` | `classes/background-process/exporter/class-tainacan-exporter-handler.php:54` | `register_exporter([...])`, same keys (`:63-77`) |
| `tainacan-register-exposers` | `$handler` | `classes/exposers/class-tainacan-exposers-handler.php:47` | `register_exposer($class_name)` (`:55`) |
| `tainacan-register-mappers` | `$handler` | `classes/mappers/class-tainacan-mappers-handler.php:46` | `register_mapper($class_name)` (`:54`) |
| `tainacan-register-generic_process` | none | `classes/background-process/generic-process/class-tainacan-generic-handler.php:34` | underscore; `register_generic_process(['name','slug','class_name'])` (`:37-44`); class extends `\Tainacan\GenericProcess\Generic_Process` |
| `tainacan-taxonomy-added-to-collection`, `tainacan-taxonomy-removed-from-collection` | `$taxonomy_id, $collection_id` | `classes/repositories/class-tainacan-metadata.php:1722`, `:1726` | fired when a Taxonomy metadatum changes |
| `tainacan-api-item-updated` | `$item, $attributes` | `class-tainacan-rest-items-controller.php:1033` | |
| `tainacan-api-item-duplicated` | `$item, $new_item` | `class-tainacan-rest-items-controller.php:1234` | |
| `tainacan-submission-item-finish` | `$item, $request` | `class-tainacan-rest-items-controller.php:1564` | item submission block |
| `tainacan-dashboard-before-cards`, `tainacan-dashboard-after-cards` | none | `views/dashboard/page.php:49`, `:62` | |

## Functions

| Function | Where | Notes |
|---|---|---|
| `tainacan_register_admin_hook($context, $callback, $position = 'end-left', $conditional = null)` | `views/admin/classes/hooks/admin-hooks-functions.php:8` | returns `false` on invalid context/position or non-string callback result |
| `tainacan_get_api_postdata()` | `classes/tainacan-utils.php:55` | decoded JSON body of the current REST request; use it in `tainacan-insert-*` to read extra form fields |
| `tainacan_register_view_mode($slug, $args = [])` | `classes/theme-helper/template-tags.php:1231` | defaults in `class-tainacan-theme-helper.php:1111-1134` |
| `tainacan_items()`, `tainacan_collections()`, `tainacan_metadata()`, `tainacan_item_metadata()`, `tainacan_taxonomies()`, `tainacan_terms()`, `tainacan_filters()`, `tainacan_metadata_sections()`, `tainacan_logs()`, `tainacan_roles()` | `classes/tainacan-loaders.php:9-82` | repository singletons |
| `tainacan_get_the_document($item_id = 0, $img_size = 'large')` | `classes/theme-helper/template-tags.php:96` | |

## JavaScript (`wp.hooks`)

| Hook | Kind | Where | Notes |
|---|---|---|---|
| `tainacan_faceted_search_item_before`, `tainacan_faceted_search_collection_<id>_item_before` | filter `(html, item)` | `views/gutenberg-blocks/blocks/faceted-search/theme-search/js/view-modes-mixin.js:56-72` | both names are checked and applied |
| `tainacan_faceted_search_collection_item_after` (checked) / `tainacan_faceted_search_item_after` (applied), `tainacan_faceted_search_collection_<id>_item_after` | filter `(html, item)` | `view-modes-mixin.js:62-78` | name mismatch; register on both or use the per-collection name |
| `tainacan_faceted_search_{search_control,advanced_search,filters,items_list}_{before,after}` and `..._collection_<id>_...` | filter `(html)` | `theme.vue:1370-1421` | parsed once at mount (`:1273`) and injected by `v-html` (`:700-702`, `:784-786`) |
| `tainacan_navigation_path_updated` | action `({ currentRoute, adminOptions })` | `views/admin/admin.vue:38`, `:46` | admin router |
| `tainacan_item_edition_item_loaded` | action `(collection, item)` | `views/admin/components/edition/item-edition-form.vue:1488`, `:2018` | |
| `tainacan_item_edition_metadata_loaded` | action `(collection, item, metadata)` | `item-edition-form.vue:1532` | |

DOM events on `document`: `tainacan-<entity>-hook-reload` after every Vue
update of a form with hooks (`views/admin/js/mixins.js:99-105`);
`tainacan-items-list-is-loading-items` (`CustomEvent`) when the faceted search
starts loading (`theme.vue:1237`).
