---
type: semantic
tags: [rag, hybrid-search, ranking, answers, wordpress-ai, abilities]
created: 2026-11-05
updated: 2026-11-05
source: work-session
confidence: high
status: active
related: [docs/sprints/sprint-14-hybrid-and-answers.md]
---

# Keyword and vector results fuse by rank, and there is no AI generator on this stack

Two facts that shape every later retrieval change.

**1. Fusion is reciprocal rank, never a score sum.** Cosine similarity is model
specific and lives in `[-1, 1]`; a keyword ranking has no score at all. Adding them
produces a number that looks like a ranking and means nothing. `Rag\Hybrid_Ranking`
scores each item `1 / (60 + rank)` per list, so agreement between the lists wins, and
ties break on the lower ID so identical input always produces identical order. Do not
"improve" this by adding normalised scores — that reintroduces the unit problem the
design exists to avoid.

**2. No `ai/*` ability is registered on this WordPress build.** `wp_get_abilities()`
returns zero `ai/*` entries, so `Rag\Answer` cannot call a generator directly and must
not pretend to. The generator arrives through the `tainacan_rag_answer_generator`
filter; with nothing wired the answer is `null`, `reason: no_generator`, and the
citations plus prompt are returned. That is the designed state of this stack, not a
missing feature — and it is the same seam style as
`tainacan_rag_register_embedding_providers`, so a site with the AI plugin wires it in
one function.

Consequences worth remembering:

- A filter that supplies a generator must **return** the callable; registering the
  callable as the filter itself passes `null` into it and yields a string, which is
  then (correctly) dropped. This cost one test failure and one retelling.
- Citations are built from snippets retrieval returned *to the caller*, after the
  visibility filter, so an answer can never quote a document the reader could not
  open.
- Hybrid reordering of `Search_Engine` output is opt-in
  (`tainacan_rag_hybrid_search_enabled`, default false) and page-local. Changing page
  membership would mean owning `found_posts` and pagination — a different change.
