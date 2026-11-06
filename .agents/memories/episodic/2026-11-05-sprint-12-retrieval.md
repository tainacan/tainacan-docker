---
type: episodic
tags: [sprint, retrieval, semantic-search, visibility, bugfix, vector]
created: 2026-11-05
updated: 2026-11-05
source: work-session
confidence: high
status: active
related: [semantic/mariadb-vector-index-created-but-unused]
---

# Sprint 12 landed retrieval; it also exposed a scoping defect from Sprint 10

`Rag\Semantic_Search` with two abilities (`tainacan/rag-search`,
`tainacan/rag-similar-items`), 494 tests / 5202 assertions, live smoke 16 of 16.

What is worth remembering:

- **`Indexer` wrote the space id into `collection_id`.** The space table is already
  per space, so every row carried the same value and `collection_id IN (...)` matched
  everything: a search scoped to one collection silently returned items from all of
  them. `Indexer::collection_id_for()` now maps the item's post type back through
  `Collections::get_id_by_db_identifier()`. **Any index built before 2026-11-05 holds
  space ids in that column and must be rebuilt**; a filtered search over such a table
  returns nothing rather than everything, which is the quieter failure mode.
- **The visibility filter is the security boundary, not an optimisation.** Candidates
  come from vectors, then the candidate item IDs are re-fetched through
  `Repositories\Items`, which applies collection readability, status and per-collection
  `read_posts` caps. `filtered_out` in the response is what makes the drop observable.
- **`publish` is the default status list; `private` is added only when the user holds
  the capability in every collection present among the candidates.** A mixed status
  array handed to `WP_Query` skips WordPress's own capability check, so one unreadable
  collection in the mix would make that bypass real.
- **A draft vector was deliberately indexed in the smoke** to prove the filter does the
  work, instead of relying on the indexer having removed it.
- **Variable shadowing bit once.** `query_space()` reused `$query` for the statement it
  had just built, so the response's `query` field stringified an array. Caught by the
  smoke, not by the suite: assert on the shape of the response, not just its count.
