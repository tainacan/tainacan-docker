# Sprint 04 — Media and ingest

**Status:** done
**Phase:** 1 — Tainacan Abilities
**Work breakdown:** 1.5
**Depends on:** 02

## Goal

Let an agent attach real files to items. Without this an agent can describe a
collection but never load one: Tainacan stores an item document as an attachment
reference, so creating items with files is the difference between a demo and a
useful tool.

## Controller audit (required before building on them)

Sprint 03 ended with two shared-state defects across three controllers, so this
sprint starts by auditing the rest for the same `$this->entity` pattern.

| Controller | `prepare_item_for_database` | Verdict |
|---|---|---|
| items | builds a fresh `Entities\Item`, returns it | safe |
| filters | builds a fresh `Entities\Filter`, returns it | safe |
| collections | returns `$this->collection`, but repeated creates in one process produce distinct IDs | safe in practice |
| taxonomies | was fixed in Sprint 03 | safe |
| terms | was fixed in Sprint 03 | safe |
| item-metadata | still mutates `$this->metadatum` | suspicious, but no ability uses that path |

The audit found no new instance in a path these abilities take. The
item-metadata prepare method is left alone deliberately: changing how that entity
is constructed could alter suggestion behaviour, and the update path this project
uses builds `Item_Metadata_Entity` directly.

## Design: abilities that are not backed by a route

There is no Tainacan REST route for uploading a file, so the registry's
route-only model needs one addition: a row may carry a `callback` instead of a
`route`. Everything else — categories, `meta.public`, annotations, permission
floor — stays identical.

This is the first ability that does real work itself rather than delegating to an
existing controller, so it carries its own security burden:

- content arrives as base64 or as a URL fetched with `wp_safe_remote_get`
- size is capped before anything touches disk
- the real type is verified with `wp_check_filetype_and_ext`; a rejected file is
  deleted rather than left behind
- the capability floor is `upload_files`, a real WordPress capability rather than
  a Tainacan per-collection one, because raw uploads are not collection-scoped

## Scope

| Ability | Backing | Notes |
|---|---|---|
| `tainacan/attachment-upload` | native callback | base64 or URL, size cap, type verified, returns id and url |
| `tainacan/attachment-get` | native callback | id, url, mime type, title, alt text, filesize |
| `tainacan/item-set-document` | `PATCH /items/{item_id}` | binds an attachment or URL to an item |
| `tainacan/item-extract-document-content` | `GET /items/{item_id}/document-content-index/extract` | runs the existing extraction and stores the text |

`item-extract-document-content` matters beyond this sprint: it is the pipeline
Phase 2 chunks for embeddings, so an agent that can trigger it can prepare a
collection for semantic search.

## Tests

| Test | Asserts |
|---|---|
| Media abilities registered | All four resolve in the registry |
| Upload round trip | Upload a 1×1 PNG from base64, read it back with `attachment-get` |
| Upload rejects junk | Invalid base64 and an unsupported extension both return `WP_Error` |
| Set document | Attach the uploaded file to an item and read the document back |
| Registry supports both shapes | A row with `callback` and a row with `route` both build valid args |
| Lint allows callbacks | The registry lint test no longer requires `route` on every row |

## Gate plan

Gate 1: `make guard`, `php -l`, ability count.
Gate 2: `--filter Test_Abilities`, `make test`, upload smoke against the live site, `make docs-build`.
Gate 3: submodule commit, findings, activity log, board.

## Risks

| Risk | Mitigation |
|---|---|
| Accepting a file whose extension lies | `wp_check_filetype_and_ext` on the written file, and delete on rejection |
| Unbounded download from a URL | `wp_safe_remote_get` plus an explicit size cap |
| Writing outside the uploads directory | Only `wp_upload_bits`, never a caller-supplied path |
| A callback row bypassing the permission model | Same floor mechanism as route rows; a test asserts the floor |
| Uploading in tests leaves files behind | Test asserts behaviour, not disk state; uploads live in the ignored test install |

## Execution log

Findings, appended as work happens. Not intentions.

### The audit moved the plan

Six controllers construct a `$this->entity` once and nine of those places are
harmless. Two were already fixed in Sprint 03. One, `item-metadata`, still mutates
a shared `$this->metadatum` in `prepare_item_for_database`, but no route this
project uses takes that path, so it is recorded rather than changed: rewriting how
that entity is built could alter suggestion behaviour for no benefit here.

Worth stating plainly, because it changes what the next sprints cost: the shared
state pattern is not everywhere, it is in the two controllers that already bit us.

### The registry grew a second execution shape

There is no route for accepting a file, so a row may now carry a `callback`
instead of a `route`. Everything else is unchanged — category, `meta.public`,
annotations, capability floor. That is deliberate: the exposure and permission
rules should not fork into two variants just because the work behind one ability
is local.

### Corrected assumptions

- **`document` must be a string, not an integer.** The items route declares the
  argument as a string, so an integer attachment ID is rejected by the REST arg
  schema before the controller runs:
  `Invalid parameter(s): document` / `document is not of type string`. The ability
  schema now says string and the description says so, because an agent will
  otherwise pass the ID it just received from `attachment-upload`, which is an
  integer.
- **`upload_files` is the right floor for uploads**, not `read`. It is a core
  WordPress capability, not a per-collection Tainacan one, so it does not
  contradict Sprint 03's decision. The capability-floor test now allows exactly
  `read` and `upload_files`, with the reasoning in the test.

### Live end-to-end smoke

Run against the site rather than the test database, as an agent would:

| Step | Result |
|---|---|
| `collection-create` | collection 43 |
| `attachment-upload` | attachment 49, `image/png` |
| `item-create` | item 50, draft |
| `item-set-document` | ok |
| `item-publish` | ok |
| `item-get` | status `publish`, document present |

### Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `make guard` | Clean |
| 1 | `php -l` on five ability classes | No syntax errors |
| 2 | `wp_get_abilities()` count | 46 = 3 core + 43 Tainacan |
| 2 | `phpunit --filter Test_Abilities` | OK, 33 tests, 583 assertions |
| 2 | `make test` | OK, 434 tests, 4748 assertions |
| 2 | `make docs-build` | OK in strict mode |
| 3 | Working tree on feature/taincan-ai, uncommitted | Media abilities and the document type fix |

### Notes for the next sprint

- Sprint 05 composes these into workflows. The composite abilities should call
  other abilities rather than re-implementing steps, so the permission floor and
  the payload shapes stay in one place.
- `item-extract-document-content` is the hand-off to Phase 2: it is what fills
  `document_content_index`, which the semantic layer chunks.
