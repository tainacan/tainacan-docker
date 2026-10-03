---
name: project-documentation
description: Use when writing, moving or restructuring documentation in this repository. Triggers on "write docs", "document this", "docs/", "mkdocs", "material theme", "mkdocs.yml", "diataxis", "tutorial", "how-to guide", "reference", "explanation", "docs site", "make docs-serve", "nav", "admonition".
---

# Project documentation (Diátaxis + MkDocs Material)

Documentation lives in `docs/` and is built with MkDocs and the Material theme.
Its structure follows **Diátaxis**.

## Diátaxis in one table

Diátaxis splits documentation on two axes: **action vs cognition** (doing vs
knowing) and **practical vs theoretical** (work vs study). Four modes result, and
each page must belong to exactly one:

| Mode | Oriented to | Answers | Reader state | Shape |
|---|---|---|---|---|
| Tutorial | learning | "Teach me to do this for the first time" | a beginner following along | one guaranteed path, no options |
| How-to guide | a task | "How do I accomplish X?" | competent, goal in hand | steps for one real goal |
| Reference | information | "What are the exact options and signatures?" | looking something up | austere, complete, consistent |
| Explanation | understanding | "Why is it designed this way?" | reflecting, not doing | discursive, no instructions |

The most common failure is mixing modes. A tutorial that explains trade-offs, or
a reference page that teaches, serves neither purpose. Split it.

### Choosing a mode

- Cannot be done without a teacher guiding every step -> tutorial.
- A specific task with a known outcome -> how-to.
- Lookup of a thing's facts, mostly consulted not read -> reference.
- The question is "why" or "what are the implications" -> explanation.

## Layout

```
mkdocs.yml                 site config and nav
requirements-docs.txt      build dependency
docs/
  index.md                 landing page: what the four sections are for
  tutorials/               learning-oriented
  how-to/                  task-oriented
  reference/               information-oriented
  explanation/             understanding-oriented
```

`nav` in `mkdocs.yml` mirrors these four sections, in that order.

## Commands

Never require a host Python toolchain for docs. Use the container targets:

```sh
make docs-serve    # live site at http://localhost:8000
make docs-build    # strict validation; output is not kept
```

`--strict` turns warnings (including broken internal links and pages missing from
`nav`) into errors. Keep the build green.

`make docs-build` runs inside the container and discards its output, so
validating the docs never leaves a generated `site/` directory in the repository.
If you build on the host instead, `site/` is gitignored.

## Authoring rules

- **One mode per page.** Create a new page rather than bolting a second mode onto
  an existing one.
- **Link, do not duplicate.** Reference `AGENTS.md`, `README.md` and the skills
  instead of copying their content, which would drift.
- **Every page is in `nav`.** An unlisted page fails `--strict` and is invisible.
- **Reference pages are complete.** If a flag or config key exists, it is
  documented with its default and type.
- **Tutorials are linear.** No "you could also", no alternatives, no dead ends;
  every step works in order for a fresh clone.
- **How-to titles start with a verb.** "Configure Elasticsearch", "Run a single
  test file".
- **Explanations may be opinionated**, but must not contain step-by-step
  instructions.

### Useful Material features

````markdown
!!! note "Admonitions"
    Use `note`, `tip`, `warning`, `danger` sparingly and semantically.

=== "Tabbed variant"
    Use tabs for platform or alternative variants, never to hide required steps.

```php title="Code with a title and annotations"
$item->set_title('Example');  # (1)!
```

1. Code annotations keep prose out of the snippet.
````

Mermaid diagrams work through `pymdownx.superfences`; keep node labels free of
parentheses and quotes, and do not put quotes inside `[...]` labels.

## Adding a page

1. Decide the mode, then create `docs/<section>/<kebab-title>.md`.
2. Write the page, linking to related pages in the other three modes.
3. Add it to `nav` in `mkdocs.yml`.
4. Run `make docs-build` and fix anything it reports.

## Pitfalls

- A page that is not in `nav` is unreachable; the strict build catches it.
- Renaming a file without updating `nav` and inbound links breaks the build.
- Long code blocks duplicated from the repo rot. Include the minimum that makes
  the point and link to the file.
- Do not commit generated output (`tainacan/docs/` comes from the plugin's own
  `generate_docs.sh`; `site/` is a host-side MkDocs artifact and is gitignored).
