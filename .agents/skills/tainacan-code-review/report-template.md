# Review report template

Copy, fill, keep the order. Severity: blocker, major, minor, nit. Confidence:
confirmed (reproduced or traced hop by hop) or plausible (reading only).

```markdown
## Review: <PR #N | branch X vs upstream/develop | path>

**Verdict:** approve | approve with changes | request changes
**Checked with:** make test (<result>), php -l, phpcs, php:8.4-cli lint, manual REST calls (<which>)
**Security findings:** <n> sent privately (Patchstack VDP, src/readme.txt:81-83); none listed here

| # | Finding | Where | Severity | Confidence |
|---|---|---|---|---|
| 1 | <one line> | `path/file.php:42` | major | confirmed |
| 2 | <one line> | `path/file.php:88-91` | minor | plausible |

### 1. <Finding title>

- **Where:** `path/file.php:42`
- **Scenario:** <input or state> -> <wrong result>. For permission issues:
  who (role, capabilities), which request, what they obtain.
- **Evidence:** <test run, request + response, or the trace file:line -> file:line>
- **Fix:** <concrete change, with the WordPress or Tainacan API to use>

### 2. <Finding title>
...

### Reviewed, no finding

- <area or checklist item>: <what was checked, where>
- Security 3.1: permission callbacks on routes A, B; `perm => readable` kept in ...
- Performance 3.2: no query in the item loop at ...
- Tests: <new tests present / existing cover the change>

### Out of scope

- <pre-existing debt noticed, file:line, not widened by this change>
```

Rules:

- A row in the table without a section below it is incomplete.
- Plausible findings may be grouped in one section titled "Plausible, to verify".
- Nothing about a security issue beyond the count, even if already fixed in
  the PR, until the maintainers say the report may be public.
