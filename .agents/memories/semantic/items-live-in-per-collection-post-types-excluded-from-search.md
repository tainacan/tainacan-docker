---
type: semantic
tags: [items, collections, post-types, wp-query, search, domain-model]
created: 2026-11-08
updated: 2026-11-08
source: investigation
confidence: high
status: active
related: []
---

# Each collection's items are a separate post type `tnc_col_<id>_item`, registered with `exclude_from_search => true`

There is no single "item" post type. `Collection::get_db_identifier()` returns
`Collection::$db_identifier_prefix . $id . Collection::$db_identifier_sufix`,
that is `tnc_col_<id>_item`, and `Collection::register_collection_item_post_type()`
registers one post type per collection with:

- `public => true`, `publicly_queryable => true`, `show_in_rest => true`,
  `has_archive => true`, `hierarchical => true`;
- `show_ui` / `show_in_menu` only when `tainacan_enable_dev_wp_interface()`;
- **`exclude_from_search => true`**;
- `capabilities` from `$collection->get_items_capabilities()` with `map_meta_cap`.

Registration happens in two places: `Items::register_post_type()` loops over
every collection on each request (the comment in the core flags this as a cost
for large repositories), and `Collections::insert()` registers the new
collection's type immediately and flushes rewrite rules.

Consequences for code that queries items directly:

- `WP_Query` / `get_posts()` with `'post_type' => 'any'` never returns Tainacan
  items, because WordPress expands `any` only to post types whose
  `exclude_from_search` is false. Pass `$collection->get_db_identifier()` (or the
  list of identifiers) or use `Items::fetch()`.
- A post type string can be mapped back to its collection with
  `Collections::get_id_by_db_identifier()` / `fetch_by_db_identifier()`.
- Anything keyed by post type (caches, hooks such as `tainacan-insert-<post_type>`,
  REST routes) has one key per collection, not one for "items".

**Evidence:** `tainacan/src/classes/entities/class-tainacan-collection.php:85`
(`$db_identifier_prefix = 'tnc_col_'`), `:92` (`$db_identifier_sufix = '_item'`),
`:120-171` (`register_collection_item_post_type()`, `exclude_from_search` at
:145), `:507-509` (`get_db_identifier()`);
`tainacan/src/classes/repositories/class-tainacan-items.php:216-240`
(`register_post_type()` loop, call at :239);
`tainacan/src/classes/repositories/class-tainacan-collections.php:654-662`
(`insert()` registers the type at :658), `:727-737` (`get_id_by_db_identifier()`).
Checked on `upstream/develop` (plugin header 1.4.1).
**Verify by:** `grep -n "exclude_from_search\|db_identifier_prefix\|db_identifier_sufix" tainacan/src/classes/entities/class-tainacan-collection.php`.
