---
type: semantic
tags: [rest-api, items, taxquery, metaquery, wp-query, filters]
created: 2026-11-08
updated: 2026-11-08
source: investigation
confidence: high
status: active
related: []
---

# REST `taxquery` and `metaquery` clauses keep only a fixed list of keys; `include_children`, `field` and `type` are dropped

`Rest_Controller::prepare_filters()` translates request parameters into
`WP_Query` arguments through fixed maps, and `prepare_meta()` copies **only the
keys present in the map** from each clause. Everything else in a clause is
silently ignored, with no validation error.

| Request param | `WP_Query` arg | Clause keys accepted (request -> WP) |
|---|---|---|
| `metaquery` | `meta_query` | `key`, `value`, `compare`, `relation`, `metadatumtype` -> `type` |
| `taxquery` | `tax_query` | `taxonomy`, `metadatum` -> `field`, `terms`, `operator`, `relation` |
| `datequery` | `date_query` | `year`, `month`, `day`, `week`, `hour`, `minute`, `second`, `compare`, `dayofweek`, `inclusive`, `before`, `after`, `column` |

Practical consequences when building item queries against `tainacan/v2`:

- `taxquery[0][include_children]=0` does nothing; `WP_Tax_Query` falls back to
  its default `include_children = true`, so filtering by a parent term also
  returns items tagged with its descendants. To exclude children, pass the exact
  term IDs with `operator=IN`.
- `taxquery[0][field]=slug` does nothing; the key is `metadatum`.
- `metaquery[0][type]=NUMERIC` does nothing; the key is `metadatumtype`.
- On the items endpoint, even a `metadatumtype` can be overridden: after
  `prepare_filters()`, the items controller resets `meta_query[N]['type']` to the
  type derived from the filter registered for that metadatum, when one exists.

**Evidence:** `tainacan/src/classes/api/class-tainacan-rest-controller.php:94-161`
(`prepare_filters()`: `$meta_query` map :131-137, `$date_query` :139-153,
`$tax_query` :155-161), `:310-335` (`prepare_meta()` iterates `$query` and copies
only mapped keys); `tainacan/src/classes/api/endpoints/class-tainacan-rest-items-controller.php:698-707`
(`$args['meta_query'][$idx]['type'] = $filters_arg['type']` at :703).
Checked on `upstream/develop` (plugin header 1.4.1).
**Verify by:** `sed -n '131,161p' tainacan/src/classes/api/class-tainacan-rest-controller.php` and confirm `include_children`, `field` and `type` are absent as request-side keys.
