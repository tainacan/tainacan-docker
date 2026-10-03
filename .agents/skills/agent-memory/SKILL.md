---
name: agent-memory
description: Use to persist and recall knowledge across sessions in this repository. Triggers on "remember this", "save to memory", "write to memory", "recall", "what do we know about", "did we already decide", "forget", "consolidate memory", "memory file", "agent memory", ".agents/memories", "prior session".
---

# Agent memory (CoALA)

Persist durable knowledge in markdown so a later session does not relearn it.
This skill is the write/read protocol for `.agents/memories/`.

## Why this shape: the CoALA framework

CoALA (Cognitive Architectures for Language Agents) splits agent memory into a
short-term **working memory** and three long-term stores, and describes a cycle
of **planning -> execution -> learning** over an **action space** of internal
actions (retrieval, reasoning, learning) and external actions (tools). This skill
maps that directly onto files:

| CoALA memory | Files | Holds | Lifetime |
|---|---|---|---|
| Working | the current context; optionally `working/` | the task at hand, scratch state | session |
| Episodic | `episodic/*.md` | what happened: decisions, incidents, migrations | dated, immutable |
| Semantic | `semantic/*.md` | durable facts, invariants, environment truths | until disproven |
| Procedural | `procedural/*.md` | how to do things: recipes, commands, gotchas | until improved |

Mapping to CoALA actions:

- **Retrieval** = the recall protocol below (grep the store, read candidates).
- **Learning** = consolidation: promote an episodic record into a semantic fact or
  a procedural recipe once it stabilises.

## Layout

```
.agents/memories/
  README.md          conventions
  INDEX.md           the catalogue of every memory (keep it current)
  working/           optional scratch for in-flight tasks, not durable
  episodic/          dated event records
  semantic/          durable facts and invariants
  procedural/        reusable how-to
```

One memory per file. Filename is a kebab-case title: `tainacan-plugin-lives-in-src.md`.

## File format

Every memory starts with frontmatter:

```markdown
---
type: semantic          # semantic | episodic | procedural | working
tags: [plugin, architecture]
created: 2026-10-03
updated: 2026-10-03
source: investigation     # investigation | user | docs | tool-output | inference
confidence: high          # high | medium | low
status: active            # active | superseded | deprecated
related: []
---

# Title

One paragraph stating the memory plainly, then evidence.
```

Rules:

- `type` must match the directory.
- `status: superseded` plus a `supersedes`/`superseded_by` pair beats deleting, so
  the history stays auditable.
- `confidence` is honest. Inference is `medium` or `low` until confirmed.
- `source` tells a later agent where to re-verify.
- Never store secrets, credentials, tokens, or personal data.

## Recall protocol (retrieval)

Run this before answering "have we seen this before", "why is it like this", or
before implementing something that feels familiar:

1. Read `.agents/memories/INDEX.md`.
2. Grep the store by tag or keyword:
   ```sh
   grep -rin --include='*.md' -e "elasticsearch" -e "read-only" .agents/memories
   ```
3. Read the matching files. Prefer `status: active`, then higher `confidence`.
4. Cite the memory file you acted on, so the user can correct the record.

At the start of a session, a single pass over `INDEX.md` is usually enough.

## Write protocol (learning)

Write a memory when knowledge will still matter after this session:

- A decision was made and the reason is not obvious from the code.
- A gotcha cost real debugging time and will recur.
- A durable fact about the environment, plugin internals, or an external API.
- A recipe that worked, with the exact commands.

Do **not** write:

- Anything derivable by reading the code or running `make help`.
- Transient task state (that is working memory, and it dies with the session).
- Speculation. If unsure, write it with `confidence: low` and say how to verify.

Steps:

1. Pick the directory from the type table.
2. Create `<kebab-title>.md` from the matching template below.
3. Deduplicate first: grep for an existing memory on the same subject. Update it
   instead of adding a second file.
4. Add a row to `INDEX.md`.
5. If the new memory contradicts an old one, mark the old one `superseded` and
   link them.

## Templates

### Semantic

```markdown
---
type: semantic
tags: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
source: investigation
confidence: high
status: active
related: []
---

# <Fact>

<The fact, stated plainly.>

**Evidence:** <file:line, command, or observation that establishes it.>
**Verify by:** <command>.
```

### Episodic

```markdown
---
type: episodic
tags: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
source: investigation
confidence: high
status: active
related: []
---

# YYYY-MM-DD <What happened>

**Context:** <what we were doing.>
**Decision:** <what we chose.>
**Why:** <the trade-off.>
**Consequences:** <what this constrains later.>
**Follow-ups:** <unfinished business, or "none".>
```

### Procedural

```markdown
---
type: procedural
tags: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
source: investigation
confidence: high
status: active
related: []
---

# <How to ...>

**When:** <trigger.>

    <exact commands>

**Expected:** <what success looks like.>
**Gotchas:** <failure modes and fixes.>
```

## Consolidation

When several episodic records point at one stable fact, or a recipe survives a
few uses, promote it:

- episodic -> semantic when it becomes a durable truth ("the plugin lives in src/").
- episodic -> procedural when it becomes a repeatable procedure.
- Keep the episodic original and add `related: [refined-into-semantic/<file>]`.

Batch this at the end of a session, not on every write.

## Forgetting

Prefer `status: superseded` over deletion. Delete outright only when the memory
is wrong, not when it is old. Keep `INDEX.md` consistent either way.

## Pitfalls

- Duplicating a fact in two files guarantees they will diverge. Deduplicate.
- Recording a fact without a `source` makes it unverifiable and it will be trusted
  anyway; always include one.
- Committing `working/` noise turns the store into a log nobody reads. Keep it out
  of the durable folders, or out of git.
- Updating a memory's content without bumping `updated` breaks the audit trail.
