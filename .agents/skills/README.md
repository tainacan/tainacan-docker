# Agent skills

Eight focused skills for working on Tainacan in this repository. Each is a
directory with a `SKILL.md` that an agent loads on demand.

They live under `.agents/skills/` (they previously lived in `skills/`).

| Skill | Load it when |
|---|---|
| [`tainacan-dev-environment`](tainacan-dev-environment/SKILL.md) | Starting, stopping or debugging the Docker stack, mounts, ports, guard rails |
| [`tainacan-plugin-architecture`](tainacan-plugin-architecture/SKILL.md) | Adding or moving PHP classes, choosing a namespace, the autoloader contract |
| [`tainacan-rest-api`](tainacan-rest-api/SKILL.md) | Adding or calling REST endpoints, permissions, exposers, OAI-PMH |
| [`tainacan-build-and-assets`](tainacan-build-and-assets/SKILL.md) | npm, webpack, sass, composer, asset output and enqueueing |
| [`tainacan-testing`](tainacan-testing/SKILL.md) | Running or writing PHPUnit tests, factories, REST test cases |
| [`tainacan-elasticsearch`](tainacan-elasticsearch/SKILL.md) | Enabling, indexing or debugging Elasticsearch and faceted search |
| [`agent-memory`](agent-memory/SKILL.md) | Saving or recalling durable knowledge in `.agents/memories/` |
| [`project-documentation`](project-documentation/SKILL.md) | Writing docs under `docs/` with Diátaxis, MkDocs and Material |

## How these relate

- `AGENTS.md` at the repository root is the entry point and the map. The skills
  are the deep dives it points to.
- `.agents/memories/` holds durable knowledge recorded across sessions, written
  and read through the `agent-memory` skill.
- `docs/` holds the published documentation site, authored with the
  `project-documentation` skill.

When a task touches one area, load that skill; otherwise start with `AGENTS.md`.

## Adding a skill

Create `.agents/skills/<name>/SKILL.md` with YAML frontmatter:

```markdown
---
name: <name>
description: One or two sentences starting with "Use when ...", including the
  concrete trigger words a user or agent would actually type.
---

# Title

Body: prerequisites, steps, commands, gotchas, references.
```

Keep the trigger words specific; the description is what selection relies on.
Then add a row to the table above.
