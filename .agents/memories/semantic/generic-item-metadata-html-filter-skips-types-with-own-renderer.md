---
type: semantic
tags: [metadata, metadata-types, hooks, filters, theme, item-metadata]
created: 2026-11-08
updated: 2026-11-08
source: investigation
confidence: high
status: active
related: []
---

# `tainacan-item-metadata-get-value-as-html` only runs for metadata types without their own `get_value_as_html()`

`Item_Metadata_Entity::get_value_as_html()` first asks the metadatum's type
object: if the type class defines `get_value_as_html()`, the entity **returns
that result immediately** and never reaches the generic
`apply_filters( 'tainacan-item-metadata-get-value-as-html', $return, $this )`
at the end of the method. Each type that renders itself applies only its own
filter, named `tainacan-item-metadata-get-value-as-html--type-<type>`.

| Metadata type class | Own renderer | Filter actually applied |
|---|---|---|
| Text | yes | `...--type-text` |
| Textarea | yes | `...--type-textarea` |
| Date | yes | `...--type-date` |
| URL | yes | `...--type-url` |
| Taxonomy | yes | `...--type-taxonomy` |
| Relationship | yes | `...--type-relationship` |
| Compound | yes | `...--type-compound` |
| User | yes | `...--type-user` |
| Control | yes | `...--type-control` |
| GeoCoordinate | yes | `...--type-geocoordinate` |
| Core_Description | yes | `...--type-description` (not `core-description`) |
| Numeric, Selectbox, Core_Title | no | generic `tainacan-item-metadata-get-value-as-html` |

So a theme or plugin that wants to transform rendered values for, say, text or
taxonomy metadata must hook the `--type-*` variants; hooking the generic name
only affects numeric, selectbox and the core title.

**Evidence:** `tainacan/src/classes/entities/class-tainacan-item-metadata-entity.php:146-154`
(`method_exists($fto, 'get_value_as_html')` -> early `return` at :152-153) and
`:198-207` (generic filter at :207);
type renderers and their filters under `tainacan/src/views/admin/components/metadata-types/`:
`text/class-tainacan-text.php:58,104`, `textarea/class-tainacan-textarea.php:69,115`,
`date/class-tainacan-date.php:72,129`, `url/class-tainacan-url.php:68,127`,
`taxonomy/class-tainacan-taxonomy.php:362,429`,
`relationship/class-tainacan-relationship.php:212,290`,
`compound/class-tainacan-compound.php:184,269`, `user/class-tainacan-user.php:156,194`,
`control/class-tainacan-control.php:260,314`,
`geocoordinate/class-tainacan-geocoordinate.php:149,246`,
`core-description/class-tainacan-core-description.php:104,151`; no
`get_value_as_html()` in `numeric/`, `selectbox/`, `core-title/`.
Checked on `upstream/develop` (plugin header 1.4.1).
**Verify by:** `grep -rln "function get_value_as_html" tainacan/src/views/admin/components/metadata-types/` and `grep -rn "get-value-as-html--type-" tainacan/src/views/admin/components/metadata-types/`.
