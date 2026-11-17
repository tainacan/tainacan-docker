# Local agent skills

Skills specific to the tainacan-docker repository. Tainacan plugin development
skills live in the sibling
[`tainacan-skills`](https://github.com/tainacan/tainacan-skills) repository.

## Local skills

| Skill | Load it when |
|---|---|
| [`agent-memory`](agent-memory/SKILL.md) | Saving or recalling durable knowledge in `.agents/memories/` |
| [`project-documentation`](project-documentation/SKILL.md) | Writing docs under `docs/` with Diátaxis, MkDocs and Material |

## Tainacan plugin skills (external)

Clone as a sibling: `git clone https://github.com/tainacan/tainacan-skills.git ../tainacan-skills`

See the [tainacan-skills README](../../../tainacan-skills/README.md) for the
full index of 10 plugin development skills covering architecture, data model,
REST API, Vue admin, build pipeline, testing, background processes,
Elasticsearch, hooks/extensions, and the dev environment.

## How these relate

- `AGENTS.md` at the repository root is the entry point and the map. Skills
  are the deep dives it points to.
- `.agents/memories/` holds durable knowledge recorded across sessions, written
  and read through the `agent-memory` skill.
- `docs/` holds the published documentation site, authored with the
  `project-documentation` skill.

When a task touches the plugin, load the matching skill from `tainacan-skills`.
When a task touches this repository's own concerns (memory, docs), use the
local skills here.

## Adding a local skill

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
