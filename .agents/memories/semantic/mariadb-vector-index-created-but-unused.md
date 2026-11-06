---
type: semantic
tags: [mariadb, vector, index, retrieval, semantic-search, query-plan]
created: 2026-11-05
updated: 2026-11-05
source: measurement
confidence: high
status: active
related: [docs/sprints/sprint-12-retrieval.md]
---

# A `VECTOR INDEX` can be created on this MariaDB and still never be used

Measured on `11.8.9-MariaDB-ubu2404` with 2,000 rows in a per-space table
(`VECTOR(8)` column, `VECTOR INDEX vec_idx (embedding)`, reported by
`INFORMATION_SCHEMA.STATISTICS` as `INDEX_TYPE = 'VECTOR'`). Every statement shape
tried produced a full scan:

| Shape | Plan |
|---|---|
| `SELECT item_id FROM t ORDER BY VEC_DISTANCE_COSINE(embedding, VEC_FromText('<literal>')) LIMIT 10` | `type=ALL`, `Using filesort` |
| same plus `WHERE collection_id = 1` | `type=range` on the `coll` key, `filesort` |
| same but also selecting the distance | `type=ALL`, `filesort` |
| `FORCE INDEX (vec_idx)` on the bare shape | `type=ALL`, `filesort` |
| `ORDER BY distance` (the select alias) | `type=ALL`, `filesort` |

Consequences, in the order they matter:

1. **Do not say "ANN" about this layer.** The index is storage; the optimizer does not
   use it for ranking here. Retrieval in `Rag\Semantic_Search` is a bounded scan of
   one space table, which is correct but linear in chunk count.
2. **Still emit `ORDER BY VEC_DISTANCE_COSINE(...) LIMIT n`.** It is the only form a
   future version could serve from the index, and ordering by a select alias
   permanently rules it out.
3. **Sprint 08's claim needs reading carefully.** It proved the index can be
   *created* (and that `VECTOR INDEX` comes back as `VECTOR KEY` in `SHOW CREATE
   TABLE`, so substring checks give false negatives). That is a weaker statement than
   the index being *chosen*, and the two blurred together until Sprint 12 measured it.

Re-check this before optimising retrieval, and check the server version first: this
may be fixed in a later 11.x.
