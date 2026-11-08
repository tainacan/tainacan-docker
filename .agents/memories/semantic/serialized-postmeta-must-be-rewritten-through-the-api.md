---
type: semantic
tags: [database, postmeta, serialization, migrations, metadata, invariant]
created: 2026-11-08
updated: 2026-11-08
source: investigation
confidence: high
status: active
related: [semantic/metadata-type-options-are-indexed-as-option-prefixed-postmeta]
---

# Serialized postmeta must be rewritten through the API, never with SQL `REPLACE()` on `meta_value`

Several Tainacan properties are stored as PHP-serialized arrays in
`wp_postmeta`, most notably a metadatum's `metadata_type_options` (which
carries, among other things, the metadata type and input type strings). PHP
serialization encodes the byte length of every string (`s:46:"..."`), so a SQL
`UPDATE ... SET meta_value = REPLACE(meta_value, 'old', 'new')` that changes the
text length produces a row that `unserialize()` rejects: `maybe_unserialize()`
returns the raw string (or `false`), and the option silently reads as empty.
The same applies to any other serialized meta in the table (attachment
`_wp_attachment_metadata`, options of other plugins) that a filter-less `UPDATE`
reaches.

Invariant for extensions and migrations: change a serialized value by loading
the entity, mutating it (`set_metadata_type_options()`), validating and saving
through the repository, or use `wp search-replace`, which is serialization-aware.
If raw SQL is unavoidable, filter by `meta_key` and exclude serialized rows
(`meta_value NOT REGEXP '^(a|O|s|b|i|d):[0-9]*[:;{]'`).

The core itself contains one historical instance of the risky shape, in the
migration that renamed the taxonomy selectbox input type: an unfiltered
`UPDATE $wpdb->postmeta SET meta_value = REPLACE(meta_value, 'tainacan-taxonomy-selectbox', 'tainacan-taxonomy-radio')`.
It is kept here as the pattern to recognise, not to copy: the two literals differ
in length (27 vs 23 bytes) and `input_type` is a key inside the serialized
`metadata_type_options` array (the Taxonomy type declares it as one of its
options), so this is exactly the shape the invariant forbids. Only the
`_option_input_type` index rows, which hold the bare string, survive such a
statement intact.

**Evidence:** `tainacan/src/migrations.php:276-287`
(`update_tainacan_selectbox_to_tainacan_radio_and_tainacan_taginput()`, the
`REPLACE()` query at :286); `tainacan/src/classes/repositories/class-tainacan-metadata.php:160`
(`metadata_type_options` is a mapped property stored as a single meta, see the
related memory); `tainacan/src/views/admin/components/metadata-types/taxonomy/class-tainacan-taxonomy.php:26`
(`'input_type' => 'tainacan-taxonomy-radio'` among the type's options).
Checked on `upstream/develop` (plugin header 1.4.1).
**Verify by:** `grep -n "REPLACE(" tainacan/src/migrations.php` and
`grep -n "'input_type'" tainacan/src/views/admin/components/metadata-types/taxonomy/class-tainacan-taxonomy.php`.
