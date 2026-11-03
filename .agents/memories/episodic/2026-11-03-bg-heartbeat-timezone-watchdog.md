---
type: episodic
tags: [background-process, watchdog, timezone, utc, bugfix, issue-1285]
created: 2026-11-03
updated: 2026-11-03
source: investigation
confidence: high
status: active
related: [episodic/2026-10-15-importer-source-file-retry-fix, semantic/tainacan-bg-timestamps-are-utc]
---

# 2026-11-03 Watchdog killed live processes on sites west of UTC (issue #1285)

**Context:** after 1.4.0 added the watchdog, users on `America/Sao_Paulo` (UTC−3)
reported duplicated rows in CSV exports and imports that restarted from item 0.
The reporter documented 96 batches processed twice and 1,920 duplicated CSV rows
on a collection with 35,718 items, plus a CSV import that died at row 224 because
the first worker deleted the source file. The watchdog fired 4 seconds after the
import started.

**Root cause 1 (the bug):** `Background_Process_Base::record_heartbeat()` stored
`current_time( 'mysql' )`, i.e. the **site's local time**, in `processed_last`.
Every other writer is UTC: `save()` (`queued_on`), `update()` (`processed_last`)
and the watchdog cutoff (`gmdate()`, `time() - $stale_process_timeout`). On a
site more than 30 minutes behind UTC a heartbeat written *now* was already older
than the cutoff, so the first watchdog run after a process started closed it as
`errored`. Because `close()` re-queues and re-dispatches (`status = 'waiting'`,
retry +1), a second worker started from the last saved offset while the original
one kept going, and both wrote the same output.

**Root cause 2 (why the damage propagated):** `handle()` validated the process
lock once, then looped without ever re-reading `status`/`retry_count`. Nothing
stopped the original worker when its process was re-queued. The watchdog also
called `unlock_process()`, so the retried request could take the lock while the
first worker was still alive.

**Decision (1.4.2):**

1. `record_heartbeat()` writes `gmdate( 'Y-m-d H:i:s' )` through a new
   `Background_Process_Base::utc_now()` helper, which `save()` and `update()` use
   too. One helper, so a future `current_time()` cannot drift back in.
2. The watchdog query ignores rows whose `processed_last` is in the future
   (beyond a 5 minute skew). Versions <= 1.4.1 wrote local time there, so on a
   site east of UTC the value is ahead of UTC now; those rows are alive. No data
   migration: the guard self-heals legacy rows, and a live worker refreshes its
   heartbeat on the next request.
3. `Background_Process::owns_process( $key )` re-reads `status`/`done` and
   compares the process lock with the value this request stored in
   `lock_process()`. `handle()` calls it at the top of every iteration and once
   more before `update()`/`close()`. On loss it logs
   "Process aborted: another worker owns this process now." and calls `wp_die()`
   **without** updating, closing or unlocking: the row and the lock belong to the
   new worker.
4. `$ownership_lost` is checked in the shutdown handler so a fatal error after
   the abort cannot close a process owned by another request.
5. The watchdog now calls `unlock_process()` **before** `close()`. `close()`
   re-dispatches immediately, and the new request needs a free lock; otherwise it
   bails out in `handle()` with "New request has ignored" and the retry only
   restarts on the next cron tick.
6. REST: the `recent` filter compared `processed_last` against `NOW()`, which is
   the MySQL session timezone. It now uses `UTC_TIMESTAMP()`. The `datequery`
   filter is a raw pass-through with no admin UI consumer, so it was left alone.

**Verification:** `tests/test-bg-process-security-reliability.php` gained six
tests: heartbeat stored in UTC, watchdog not touching a live process at UTC−3,
watchdog still marking a silent process at UTC−3, future `processed_last`
ignored, and the `owns_process()` predicate for the re-queued and lock-taken-over
cases. All three existing watchdog fixtures now build timestamps with `gmdate()`
instead of `date()` (they were only correct because the test suite runs in UTC).
Reverting `record_heartbeat()` to `current_time( 'mysql' )` makes the new UTC−3
test fail with `waiting` instead of `running`, which reproduces the issue.
`make test`: 401 tests, 4154 assertions, green.

**Consequences:**
- No schema change, so no `migrations.php` entry and nothing to upgrade on
  existing installs.
- `processed_last` and `queued_on` are both UTC now, which matches the log
  files (`gmdate()`) but exposes a **display** bug: `processes-list.vue` formats
  them with `moment( rawDate )`, which parses a bare `Y-m-d H:i:s` as local time.
  The admin list therefore shows wall-clock values shifted by the offset for both
  columns. Follow-up: `moment.utc( rawDate ).local()`.
- The importer's source file deletion (#1265) is no longer reachable through this
  path, because a worker that loses ownership aborts before deleting anything.
- The `tnc-bg_generic_process` / `tnc-bg_import` / `tnc-bg_exporter`
  `_stale_process_timeout` workaround suggested in the issue is no longer needed
  and can be removed by affected sites after upgrading.
