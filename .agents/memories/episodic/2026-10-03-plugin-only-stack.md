---
type: episodic
tags: [docker, scope, decision, theme, git-hooks]
created: 2026-10-03
updated: 2026-10-03
source: user
confidence: high
status: active
related: [episodic/2026-10-03-compose-simplification, episodic/2026-10-03-stack-rewrite]
---

# 2026-10-03 Trimmed to a plugin-only stack: no theme, no git hook, no plans

**Context:** after the compose simplification, the user asked whether
`tainacan-interface` was needed at all, said they did not want the pre-commit
hook, and said they did not want the design plans kept.

**Decision:**

- Removed the `tainacan-interface` theme submodule along with its bind mounts,
  its builder build step, its polling branch and the `theme_node_modules` volume.
  The stack is plugin-only.
- Deleted `githooks/` and the `make guards` target, and unset `core.hooksPath` on
  the remaining submodule. `make guard` survives as a plain Make target you run
  on demand.
- Deleted `plans/`. Design rationale now lives in `.agents/memories/`.

**Why:** Tainacan is a plugin and runs on any WordPress theme, so the companion
theme is optional for plugin development and WordPress's bundled default theme is
enough. The hook and the plans directory were unwanted surface area.

**Consequences:**

- `TAINACAN_THEME_PATH` and `theme_node_modules` no longer exist.
- `make setup` no longer activates a theme.
- `make assets`, `make assets-prod` and the builder command are plugin-only.
- `guard` scans only `tainacan/`.
- There are now zero executables in the project: every workflow is a Make target.

**Follow-ups:** none.
