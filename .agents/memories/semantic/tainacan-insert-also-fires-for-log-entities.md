---
type: semantic
tags: [logs, hooks, repositories, cache, persistence, database]
created: 2026-11-08
updated: 2026-11-08
source: investigation
confidence: high
status: active
related: [semantic/repositories-are-singletons-and-insert-requires-validate]
---

# Every entity write also produces a `Log` entity, and `tainacan-insert` fires for the log too

The `Logs` repository listens to the generic persistence actions
(`tainacan-insert`, `tainacan-pre-insert`, `tainacan-deleted`, `tainacan-pre-delete`)
and, for every collection, metadatum, item, item metadata, taxonomy, term or
filter write, builds a `\Tainacan\Entities\Log` and saves it through
`Logs::insert()`. That method writes a row to the custom table
`{prefix}tainacan_logs` (created by the `tainacan_create_logs_table` migration;
logs are **not** posts on `develop`, even though `Log::$post_type` is still
`'tainacan-log'`) and then fires `tainacan-insert` and
`tainacan-insert-tainacan-log` again with the `Log` object.

Consequences for anything hooked on `tainacan-insert` (cache invalidation,
indexers, webhooks):

- the callback runs at least twice per user-visible write: once for the entity
  and once for its log, so it must check `instanceof` (or
  `get_post_type() === 'tainacan-log'`) before acting, exactly as the core's own
  `Logs::pre_insert_entity()` / `insert_entity()` do to avoid logging a log;
- the `Log` argument is not a `WP_Post`-backed entity in the usual sense (its
  ID is the custom-table `insert_id`), so code that assumes `get_post()` on the
  entity ID works will not;
- a "flush everything on any `tainacan-*` write" strategy invalidates on every
  log row as well, which doubles the churn for no change in public data.

**Evidence:** `tainacan/src/classes/repositories/class-tainacan-logs.php:36-49`
(`init()` hooks `tainacan-insert` at :38 and `tainacan-pre-insert` at :39),
`:451-454` (`get_table_name()` -> `{prefix}tainacan_logs`), `:468-526`
(`insert()`: `$wpdb->insert( $this->get_table_name(), ... )` at :514,
`do_action( 'tainacan-insert', $obj, [], false )` and
`do_action( "tainacan-insert-$post_type", $obj )` at :522-523), `:695` and
`:797` (skip when `get_post_type() === 'tainacan-log'`);
`tainacan/src/classes/entities/class-tainacan-log.php:32` (`$post_type = 'tainacan-log'`);
`tainacan/src/migrations.php:547-551` (`tainacan_create_logs_table`).
Checked on `upstream/develop` (plugin header 1.4.1).
**Verify by:** `grep -n "do_action( 'tainacan-insert'\|get_table_name\|'tainacan-log'" tainacan/src/classes/repositories/class-tainacan-logs.php`.
