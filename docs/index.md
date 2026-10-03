# Tainacan Dev Stack

Documentation for this repository: a local development environment for the
Tainacan WordPress plugin.

The plugin is a git submodule mounted into a containerised WordPress.
PHP edits are live; assets rebuild through a watcher container.

## How this documentation is organised

These pages follow [Diátaxis](https://diataxis.fr/). Each page is exactly one of
four kinds, so you can predict what you will get:

| Section | You want to | Start here |
|---|---|---|
| [Tutorials](tutorials/get-started.md) | learn by doing, from zero | [Get started](tutorials/get-started.md) |
| [How-to guides](how-to/develop-with-live-reload.md) | accomplish a specific task | [Develop with live reload](how-to/develop-with-live-reload.md) |
| [Reference](reference/make-targets.md) | look up an exact command or value | [Make targets](reference/make-targets.md) |
| [Explanation](explanation/architecture.md) | understand why it is built this way | [Architecture](explanation/architecture.md) |

## Related material

- `README.md` (repository root) — the front door: prerequisites, setup,
  troubleshooting.
- `AGENTS.md` — the complete map for coding agents, including plugin internals,
  build pipeline and testing.
- `.agents/skills/` — focused skills for specific areas.
- `.agents/memories/` — durable notes recorded across sessions.

Building and serving this site: see [Make targets](reference/make-targets.md).
