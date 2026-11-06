# Sprint 06 — Full coverage, MCP exposure, Phase 1 close

**Status:** done
**Phase:** 1 — Tainacan Abilities
**Work breakdown:** 1.7, 1.8
**Depends on:** 01–05

## Goal

Close Phase 1: make the long tail reachable, cover the import and export
sessions, and verify that the exposure rules actually reach a client rather than
merely being set correctly in the registry.

## Scope

| Ability | Backing | Notes |
|---|---|---|
| `tainacan/rest-request` | native callback | escape hatch, restricted to the `tainacan/v2` prefix |
| `tainacan/importer-list` | `GET /importers/available` | |
| `tainacan/importer-session-create` | `POST /importers/session` | |
| `tainacan/importer-session-update` | `PATCH /importers/session/{session_id}` | |
| `tainacan/importer-session-run` | `POST /importers/session/{session_id}/run` | |
| `tainacan/exporter-list` | `GET /exporters/available` | |
| `tainacan/exporter-session-create` | `POST /exporters/session` | |
| `tainacan/exporter-session-run` | `POST /exporters/session/{session_id}/run` | |

Fifty-eight abilities registered in total: three core, fifty-five Tainacan.

## The escape hatch, and why it is not a master key

`tainacan/rest-request` exists so the remaining endpoints are reachable without a
row each. It is narrow on purpose:

- the route must start with `/tainacan/v2/`, so it cannot reach `wp/v2`, another
  plugin's routes or the abilities API itself
- the method is limited to the five verbs that make sense
- the target route's own `permission_callback` runs inside `rest_do_request()` as
  the current user

The last point is the one that matters: the escape hatch cannot do anything the
caller could not already do over HTTP. It trades discoverability for coverage,
not privilege for convenience. Its annotations say `readonly: false` and
`idempotent: false`, because a tool that can do anything must not advertise
itself as safe.

## Verification against a real client contract

The MCP adapter is not installed here, so the check targets the exact contract an
adapter consumes: the abilities REST listing and the run endpoint.

| Check | Result |
|---|---|
| Abilities listed over REST | 55 of 55 Tainacan abilities, none missing at `per_page=100` |
| `meta.public` and `meta.mcp.type` on every row | none missing |
| Read-only ability executed through `/run` | 200 |
| Write ability executed through `/run` with a JSON body | 200, collection created |
| Write ability called with GET | 405, refused by the endpoint |

## Two interoperability findings

**A zero-argument ability rejected `null` input.** The run endpoint forwards
whatever the client sent, and a client that omits input sends `null`. With
`type: object` in the schema that failed with
`input is not of type object` *before the callback ran*, so every zero-argument
ability was uncallable from such a client. Schemas now allow `null`, and a test
asserts `execute( null )` succeeds.

**`POST /run` reads the raw JSON body, not form parameters.** `set_body_params()`
is invisible to it; the input must be `{"input": {...}}` as JSON. Our own bridge
already sends raw JSON, so this is a client-facing note for the Phase 3 connection
guide rather than a defect here — but it is exactly the sort of thing that makes
an integration look broken when it is not.

## Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `make guard` | Clean |
| 1 | `php -l` on the registry and bridge | No syntax errors |
| 2 | `wp_get_abilities()` count | 58 = 3 core + 55 Tainacan |
| 2 | `phpunit --filter Test_Abilities` | OK, 45 tests, 755 assertions |
| 2 | `make test` | OK, 446 tests, 4920 assertions |
| 2 | Abilities REST listing and run endpoint | 55/55 listed, run 200 for read and write |
| 3 | Working tree on feature/taincan-ai, uncommitted | Escape hatch and session abilities |

## Execution log

Findings, appended as work happens. Not intentions.

### What Phase 1 actually cost

Six sprints, and four plugin defects surfaced along the way that had nothing to
do with abilities:

1. `create_item()` validated an entity it never inserted, so creating a published
   item over REST had never worked.
2. The taxonomies controller reused one shared entity, so a second taxonomy in a
   process returned false.
3. The terms controller had the same defect.
4. Zero-argument abilities were uncallable through the run endpoint.

None of these would have been found by writing abilities against the documented
API surface. They were found by executing each ability and reading the failure.
That is the strongest argument for the gate in this repository: every sprint that
passed Gate 2 did so against real dispatch, not a mock.

### What is deliberately not done

The plan listed an `import-run` composite that would create a session, upload a
source, inspect the mapping and run. It is not built, because the mapping step
depends on the importer type and on a source that must be uploaded first. The
primitives are in place and an agent can drive them; a composite that guessed at
the mapping would be worse than the four calls it replaces. Recorded rather than
silently dropped.

## Phase 1 exit criteria

| Criterion | Status |
|---|---|
| At least one ability registered, visible over REST | 55 |
| Categories resolve before abilities, proven by test | yes |
| Bridge normalises all result shapes, proven by tests | yes |
| No writing ability claims readonly | asserted by test |
| Permission floor pinned at `read` or `upload_files`, asserted | yes |
| `make test` green | 446 tests, 4920 assertions |
| Abilities discoverable and executable by a client contract | verified |
