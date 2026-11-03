---
type: semantic
tags: [background-process, database, utc, timezone, watchdog]
created: 2026-11-03
updated: 2026-11-03
source: investigation
confidence: high
status: active
related: [episodic/2026-11-03-bg-heartbeat-timezone-watchdog]
---

# `tnc_bg_process` timestamps are UTC

Every DATETIME column of `{prefix}tnc_bg_process` is written in **UTC** and must
be compared against UTC:

| Column | Written by | Value |
|---|---|---|
| `queued_on` | `Background_Process::save()` | `utc_now()` |
| `processed_last` | `Background_Process::update()` and `record_heartbeat()` | `utc_now()` |
| log lines in `uploads/tainacan/bg-*.log` | `gmdate()` | UTC |

`Background_Process_Base::utc_now()` is the single source for that value. Do not
use `current_time( 'mysql' )` in this class tree: it returns the site's local
time. Mixing the two is what made the 1.4.0/1.4.1 watchdog close live processes
on any site behind UTC (issue #1285).

On the SQL side, use `UTC_TIMESTAMP()`, not `NOW()` (the MySQL session timezone
is not guaranteed to be UTC on shared hosting). See the `recent` filter in
`class-tainacan-rest-background-processes-controller.php`.

Known inconsistency, not fixed yet: `src/views/admin/components/lists/processes-list.vue`
renders `processed_last` and `queued_on` with `moment( rawDate )`, which parses a
bare `Y-m-d H:i:s` string as local time. The admin list therefore shows a value
shifted by the site offset. Fixing it means `moment.utc( rawDate ).local()` and a
`make assets` build (Vue changes are build output).
