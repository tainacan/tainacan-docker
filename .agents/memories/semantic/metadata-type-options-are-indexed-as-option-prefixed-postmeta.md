---
type: semantic
tags: [metadata, metadata-types, postmeta, repositories, extensions]
created: 2026-11-08
updated: 2026-11-08
source: investigation
confidence: high
status: active
related: [semantic/repositories-are-singletons-and-insert-requires-validate]
---

# Metadata type options live in one serialized meta and are indexed as `_option_<key>` postmeta

A metadatum's type-specific configuration (the `taxonomy_id` of a Taxonomy
metadatum, the `collection_id` of a Relationship, `map_provider` of a
GeoCoordinate, and so on) is **not** stored under its own key. Two places hold it:

1. The mapped property `metadata_type_options`, a single serialized array in
   the metadatum post's meta. This is the source of truth and what
   `Metadatum::get_metadata_type_options()` reads (through the metadata type
   object, which merges defaults).
2. An index written by `Metadata::update_metadata_type_index()` after every
   `Metadata::insert()`: each option is copied to its own postmeta row named
   `'_option_' . $option`. The core itself queries this index, for example
   `_option_taxonomy_id` when resolving taxonomy metadata and
   `_option_collection_id` / `_option_display_in_related_items` when fetching
   related items.

Consequences:

- `get_post_meta( $metadatum_id, 'taxonomy_id', true )` is always `''`; read
  through the entity (`$metadatum->get_metadata_type_options()['taxonomy_id']`)
  or, in a raw `meta_query`, through `_option_taxonomy_id`.
- Writing a `_option_*` row directly has no effect on the plugin, because the
  serialized array is what the entity reads; change options with
  `set_metadata_type_options()` and save through the repository, which rebuilds
  the index.
- The index is only ever updated, never pruned: a key removed from the array
  keeps its stale `_option_*` row.
- The taxonomy slug for a Taxonomy metadatum is derived as `'tnc_tax_' . $taxonomy_id`
  (`Taxonomy::$db_identifier_prefix`).

**Evidence:** `tainacan/src/classes/repositories/class-tainacan-metadata.php:160`
(`metadata_type_options` in the map), `:749-755` (`insert()` calls
`update_metadata_type_index()` after `parent::insert()`), `:1749-1759` (the
index writer, `update_post_meta( ..., '_option_' . $option, $value )` at :1756);
`tainacan/src/classes/entities/class-tainacan-metadatum.php:249-255`
(`get_metadata_type_options()`);
`tainacan/src/classes/api/endpoints/class-tainacan-rest-items-controller.php:519`
and `tainacan/src/classes/repositories/class-tainacan-items.php:857-861` (core
queries on `_option_*`);
`tainacan/src/classes/entities/class-tainacan-taxonomy.php:51` (`tnc_tax_`).
Checked on `upstream/develop` (plugin header 1.4.1).
**Verify by:** `grep -n "_option_" tainacan/src/classes/repositories/class-tainacan-metadata.php tainacan/src/classes/repositories/class-tainacan-items.php`.
