# Sprint 13 — Admin console

**Status:** done
**Phase:** 2 — Tainacan Semantic Search
**Work breakdown:** 2.8
**Depends on:** 12

## Goal

Give an operator one screen that answers "what does the index contain, what does it
cover, what is failing, and what will a search actually return", and the buttons that
the earlier sprints kept deferring to "an operator or the settings screen".

## Scope

| File | Role |
|---|---|
| `Rag\Status` | read-only aggregation: environment, spaces, storage, coverage, queue, pauses |
| `Rag\Index_Queue` | `failed_rows()` and `retry_failed()` added |
| `views/rag/class-tainacan-rag-console.php` | the page: menu entry, actions, notices |
| `views/rag/page.php` | markup for the five panels |

Abilities: `tainacan/rag-status` (read-only) and `tainacan/rag-queue-retry`
(non-destructive, idempotent), both at `manage_options`.

## Decisions

**The screen presses the ability callbacks; it does not reimplement them.** Every
button — retry, run the queue, create/activate/delete a space, start or step a
backfill, clear a paused provider — calls the same method the ability is registered
with. A screen that grew its own copy of "retry the queue" would be a second
implementation to keep correct, and the agent-facing surface would drift from the
human-facing one. The smoke asserts this by retrying through the ability after
rendering the page.

**Server-rendered, no build step.** The panels are tables. A Vue page would mean a
webpack entry, a Sass entry and `make assets` for every copy change, and the plugin
mount is read-only. `Pages` already enqueues `tainacan-pages.css`, so the console
inherits the Tainacan page container for free. The inline style block is scoped to
`.tainacan-rag-console` and follows the same pattern the system-check page already
uses.

**A space whose table was dropped is reported, not thrown.** A registry row outlives
its table whenever someone drops it by hand. Every read of a space table suppresses
database errors and returns `available: false` plus the server's message, so the
screen still renders and the operator learns which space is the broken one. That is
also why `has_index` is `null` rather than `false` when there is no table: "no index"
and "no table" are different problems.

**Storage is an estimate, labelled as one.** `chunks × dimensions × 4` bytes for the
vector column (MariaDB stores float32), plus the summed length of `content`. The
server's own `information_schema` figure is included next to it when present, because
an estimate that hides its basis invites planning on it.

**Coverage omits collections with no published items.** "0 of 0" is noise on a screen
whose job is to point at gaps.

**Retry keeps the attempt counter.** A row that failed five times should not look new
after being requeued, and the backoff stays honest if it fails again. Only `state` and
`available_at` change, which is what makes the button safe to press twice — the
second press finds nothing left in `failed`.

**Actions run on the page's `load-` hook.** They finish before any output and end in
`wp_safe_redirect`, so a refresh cannot repeat a write and the notice survives in the
URL.

## What the screen shows

- **Requirements** — the environment verdict (ready / degraded / unsupported), the
  database version, the largest dimension the server accepted, and which space is
  active per modality. Create-space is disabled unless the verdict is ready.
- **Spaces** — provider, model, modality, dimensions, whether the vector index is
  actually there, chunks and items, estimated vector size, queue depth, active flag,
  and activate/delete.
- **Indexing** — queue depth by state, "process 5 items now", "requeue failed rows",
  "clear provider pauses", the paused pairs with the time left, and the ten most
  recent failures with their error text.
- **Coverage** — per collection and per space: published items, indexed items, and
  what is missing, with start/step backfill buttons.
- **Search preview** — runs `Semantic_Search::search()` with the real visibility
  filter and reports returned items, candidates scanned and candidates dropped. That
  third number is the point: it separates "nothing matched" from "matches were
  hidden".

## Live proof

Fake provider, real space, one published item, one unpublished item indexed on
purpose, one failed queue row:

| Check | Result |
|---|---|
| Report carries every panel | pass |
| Space appears with its vector index | pass |
| Storage measured | 4 chunks, 128 vector bytes |
| Coverage counts the collection | indexed 1 of 1 |
| Failure reported with its reason | pass |
| Page renders | pass, 25 KB of markup |
| Requirements, spaces, queue, coverage panels present | pass |
| Preview runs and reports the drop | pass |
| **Preview does not leak the draft** | pass |
| No PHP warnings in the markup | pass |
| Retry ability requeues the failure | 1 requeued, depth back to 0 |
| Console class loads through the pages creator | pass, slug `tainacan_rag` |

18 of 18 checks.

## A defect the smoke caught in the smoke

The first run failed `coverage counts the collection` with "indexed 0 of 1". The
coverage array was correct; the assertion read `coverage[0]`, which on this
long-lived development database is whichever collection sorts first, not the one the
run had just created. The check now looks the collection up by id. Worth recording
because it is the same class of mistake as reading a hard-coded index anywhere else:
the panel was right and the test was wrong.

## What is still missing

- No settings section. The spaces and provider settings live in this page, not in
  `create_tainacan_setting()` as the design sketched. Provider credentials are still
  options written elsewhere; nothing here edits them.
- No per-item drill-down: a failure names an item id and a space id, and the operator
  follows the link to the item themselves.
- No orphan sweep. Vectors whose item was deleted are removed by the indexer on
  delete; a vector that survives that (a direct database edit, a restore) is still
  invisible to this screen.
- Image spaces are listed and measurable but nothing writes to them yet.

## Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `php -l` on four edited or new files | clean |
| 2 | `wp_get_abilities()` | 72 = 3 core + 69 Tainacan |
| 2 | `phpunit --filter Test_Abilities` | OK, 100 tests, 1088 assertions |
| 2 | `make test` | OK, 501 tests, 5253 assertions |
| 2 | Live console smoke | 18 of 18 checks pass |
| 3 | `make guard` | clean |
| 3 | `make docs-build` | OK |

## Execution log

Findings, appended as work happens. Not intentions.

### Editing tabs with a diff tool

Four separate edits landed with the wrong indentation: `apply_diff` turned tabs into
`tab + space` inside one block and over-indented another, so two files needed a
`perl -i` pass and one needed an extra `}` removed before `php -l` passed again. The
rule for the rest of Phase 2: whole-file writes for PHP with indentation, and check
`php -l` plus a tab-marked dump after any structural diff.

### What the counts are for

`filtered_out` is the number that makes a preview trustworthy. A page that showed
"2 results" would look identical whether the other twelve candidates were irrelevant
or unreadable, and only one of those means the filter is doing work. The same number
belongs in the RAG answer ability in Sprint 14.

### Notes for the next sprint

- `Search_Engine` is the place for hybrid ranking, and it must stay Tainacan-scoped:
  the hook already replaces search for item queries only.
- The console is where a `rag-answer` button belongs, next to the preview, once an
  answer ability exists to press.
