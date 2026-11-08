---
type: semantic
tags: [items, metadata-sections, hooks, filters, theme, templates]
created: 2026-11-08
updated: 2026-11-08
source: investigation
confidence: high
status: active
related: [semantic/generic-item-metadata-html-filter-skips-types-with-own-renderer]
---

# `tainacan-get-metadata-section-as-html-*--index-N` counts rendered sections, not configured ones

`Item::get_metadata_sections_as_html()` loops over the collection's metadata
sections and calls `get_metadata_section_as_html($section, $args, $section_index)`
with a counter that **increments only when the section produced non-empty
HTML**. Inside, `get_metadata_section_as_html()` returns `''` for a section
whose metadata list is empty unless `hide_empty` is `false` (the default is
`true`), and the positional filters

- `tainacan-get-metadata-section-as-html-before--index-N`
- `tainacan-get-metadata-section-as-html-before-name--index-N`
- `tainacan-get-metadata-section-as-html-after-name--index-N`
- `tainacan-get-metadata-section-as-html-before-metadata-list--index-N`
- `tainacan-get-metadata-section-as-html-after-metadata-list--index-N`
- `tainacan-get-metadata-section-as-html-after--index-N`

are applied only when a numeric `$section_index >= 0` was passed. So `N` is the
position among sections that actually rendered for *that item*: the same
section can be index 1 on one item and index 0 on another whose first section
had no values. Code that must target a specific section should use the `--id-<id>`
variants (always applied, keyed by the section's post ID), and treat `--index-N`
as "the N-th visible section".

The item-metadatum counterpart (`tainacan-get-item-metadatum-as-html-before/after--index-N`)
follows the same idea inside a section's metadata list.

**Evidence:** `tainacan/src/classes/entities/class-tainacan-item.php:1200-1206`
(`$section_index` starts at 0 and `++` only inside `if (!empty($section_as_html))`),
`:1255` (`get_metadata_section_as_html($metadata_section, $args = array(), $section_index = null)`),
`:1276` (`'hide_empty' => true` default), `:1297-1299`
(`$has_metadata_list || !$args['hide_empty']` gate), `:1311-1315` (`--id-`
always, `--index-` under `is_numeric($section_index) && $section_index >= 0`),
`:1413-1417` (same for `after`); metadatum-level index filters at `:877` and `:902`.
Checked on `upstream/develop` (plugin header 1.4.1).
**Verify by:** `grep -n "section_index" tainacan/src/classes/entities/class-tainacan-item.php`.
