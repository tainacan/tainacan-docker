# Agent memories

Durable, file-based memory for agents working in this repository. The write and
read protocol lives in [`.agents/skills/agent-memory/SKILL.md`](../skills/agent-memory/SKILL.md).

The store follows the CoALA memory taxonomy:

| Folder | Memory type | Holds | Lifetime |
|---|---|---|---|
| `episodic/` | episodic | what happened: decisions, incidents, migrations | dated, immutable |
| `semantic/` | semantic | durable facts, invariants, environment truths | until disproven |
| `procedural/` | procedural | how to do things: recipes, commands, gotchas | until improved |

Working memory is the current session context and is deliberately not stored here.

## Rules

- One memory per file, named `<kebab-case-title>.md`.
- Every file carries frontmatter with `type`, `tags`, `created`, `updated`,
  `source`, `confidence`, `status`, and `related`.
- Deduplicate before writing: grep for the subject and update the existing file.
- Supersede rather than delete. Keep `INDEX.md` current.
- No secrets, credentials, tokens, or personal data.

## Entry points

1. Read [`INDEX.md`](INDEX.md) — the catalogue.
2. Grep by tag or keyword:
   ```sh
   grep -rin --include='*.md' -e "<keyword>" .agents/memories
   ```
3. Read the matches, prefer `status: active` and higher `confidence`.
4. Cite the memory you relied on when acting on it.
