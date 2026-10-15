---
type: episodic
tags: [importer, background-process, watchdog, retry, bugfix]
created: 2026-10-15
updated: 2026-10-15
source: investigation
confidence: high
status: active
related: [procedural/run-tainacan-phpunit]
---

# 2026-10-15 Importer source file deleted before a retry (issue #1249)

**Context:** Tainacan 1.4.0 added a watchdog and a retry mechanism to
`Background_Process`. Users on shared hosting reported that long CSV imports
always ended as `errored`, and that the uploads folder lost the CSV mid-import.

**Root cause:** `Background_Importer::close()` deletes the importer source file
(and its attachment) via `delete_source_file()` **before** calling
`parent::close()`. The parent, seeing `errored` with retries left, re-queues the
process — but the source file is already gone. Every retry then died with
`array_map(): Argument #2 ($array) must be of type array, false given` in
`CSV::process_item()`, because `raw_source_metadata()` returns `false` when the
file cannot be opened.

**Decision:**

1. Added `Background_Process::get_retry_state( $key, $status )`, which returns the
   process row when a retry is still due (status `errored` and
   `retry_count < max_retries`), or `false` otherwise. `close()` now uses it, so
   the retry predicate lives in one place.
2. `Background_Importer::close()` only deletes the source file when
   `get_retry_state()` is `false`. The CSV survives while a retry is pending and
   is removed once the process is final (`finished`, `finished-errors`,
   `cancelled`, or `errored` with retries exhausted).
3. `CSV::process_item()` now checks that `raw_source_metadata()` (and the
   `fgetcsv()` row) returned an array, logs a readable error and returns `false`
   instead of letting PHP raise a fatal `TypeError`.

**Why:** the retry path is only useful if the input it re-runs against still
exists; deleting on non-final statuses made the retry mechanism self-defeating.

**Consequences:** the existing test
`test_source_file_is_removed_when_background_import_errors()` asserted the old
behaviour and was replaced by two tests: the file is kept while a retry is
pending (`..._errors_and_will_retry`) and removed once retries are exhausted
(`..._errors_and_retries_are_exhausted`). A regression test for the fatal
(`test_process_item_returns_false_when_source_file_is_missing`) was added.

**Follow-ups:**
- Reported in https://github.com/tainacan/tainacan/issues/1249 and
  https://tainacan.discourse.group/t/importador-da-versao-1-4-interrompe-durante-importacao-de-csv/2872
- The discourse reporter asked to document that the process identifier is
  `tnc-bg_import` (hyphen, because `$prefix = 'tnc-bg'`) for the
  `tnc-bg_import_stale_process_timeout` / `..._default_time_limit` filters.
- CHANGELOG / release notes for the fix are still to be written upstream.
