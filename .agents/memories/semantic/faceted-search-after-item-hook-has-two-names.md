---
type: semantic
tags: [faceted-search, wp-hooks, javascript, theme, gutenberg-blocks]
created: 2026-11-08
updated: 2026-11-08
source: investigation
confidence: high
status: active
related: []
---

# The faceted-search "after item" JS hook is checked under one name and applied under another

The view modes of the faceted search (theme side of the `faceted-search` block)
expose `wp.hooks` filters that let a plugin inject HTML before and after each
item card. The "before" pair is symmetric, the "after" pair is not:

| Method | Checks / applies | Name used |
|---|---|---|
| `hasBeforeHook()` | `hasFilter` | `tainacan_faceted_search_item_before` or `tainacan_faceted_search_collection_<id>_item_before` |
| `getBeforeHook()` | `applyFilters` | the same two names |
| `hasAfterHook()` | `hasFilter` | **`tainacan_faceted_search_collection_item_after`** or `tainacan_faceted_search_collection_<id>_item_after` |
| `getAfterHook()` | `applyFilters` | **`tainacan_faceted_search_item_after`** or `tainacan_faceted_search_collection_<id>_item_after` |

The view-mode templates render the "after" slot under `v-if="hasAfterHook()"`
and fill it with `getAfterHook(item)`. Consequences for an extension:

- registering only `tainacan_faceted_search_item_after` produces HTML that is
  never rendered, because the `v-if` stays false;
- registering only `tainacan_faceted_search_collection_item_after` renders an
  empty slot, because `getAfterHook()` never applies that name;
- the per-collection name `tainacan_faceted_search_collection_<id>_item_after`
  is used by both methods and works alone.

A generic (all collections) after-item hook therefore has to be registered under
both names with the same callback; the HTML is still added once, because only
`tainacan_faceted_search_item_after` is applied.

**Evidence:** `tainacan/src/views/gutenberg-blocks/blocks/faceted-search/theme-search/js/view-modes-mixin.js:56-78`
(`hasBeforeHook` :56-60, `hasAfterHook` :62-66, `getBeforeHook` :68-72,
`getAfterHook` :74-78), checked on `upstream/develop` (plugin header 1.4.1).
**Verify by:** `grep -n "item_after" tainacan/src/views/gutenberg-blocks/blocks/faceted-search/theme-search/js/view-modes-mixin.js`
and compare the names on the `hasFilter` line with the ones on the `applyFilters` line.
