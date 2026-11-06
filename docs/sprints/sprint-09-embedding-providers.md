# Sprint 09 — Embedding providers

**Status:** done
**Phase:** 2 — Tainacan Semantic Search
**Work breakdown:** 2.3
**Depends on:** 08

## Goal

Turn text into vectors without locking the site to one vendor. A provider must be
able to answer "how many dimensions do you produce" *before* a table is built for
it, and must fail loudly when the answer was wrong.

## Scope

| Class | Role |
|---|---|
| `Rag\Embedding_Provider` | abstract contract: id, label, modalities, dimensions, batch size, `embed()` |
| `Rag\OpenAI_Compatible_Provider` | shared implementation of the OpenAI `/v1/embeddings` shape |
| `Rag\OpenAI_Provider` | 1536 and 3072 dimension models |
| `Rag\Ollama_Provider` | local path, no key, tag-insensitive model names |
| `Rag\Provider_Registry` | defaults plus the `tainacan_rag_register_embedding_providers` filter |

Plus one ability: `tainacan/rag-provider-list`.

One base class covers OpenAI and every gateway that copies its wire format,
including Ollama. That is the point of the requirement that a user can add any
provider: the OpenAI shape is the closest thing to a lingua franca, and a
self-hosted gateway needs configuration rather than code.

## Three decisions

**Providers live in `classes/rag/`, not a `Providers` subdirectory.** The autoloader
maps `Tainacan\Rag\Providers\X` to `classes/rag/Providers/`, preserving the
capital P. That resolves on macOS and fails on a case-sensitive Linux host — the
kind of defect that only appears on the reviewer's machine. Three-segment names
avoid the question entirely.

**Dimensions are known data, not a guess.** `create_space()` already builds a
`VECTOR(n)` column, so a provider that cannot report its length would produce a
table that rejects every insert. Each provider carries a model → dimensions map.
An unknown model reports `0`, which means *unknown* rather than *unsupported*:
`create_space()` then falls back to the environment maximum, and `embed()` skips its
length check. Adding a model to the map is what switches that check on.

**`embed()` validates the returned length against the reported one.** If a gateway
quietly swaps models, the vectors would not fit the column and the failure would
surface at insert time, far from the cause. Instead the error names the model, the
length returned and the length expected. It is checked after the response is parsed
and before anything is stored.

## What is deliberately not exposed

`embed()` is not an ability. An agent calling it in a loop would spend real money on
someone's OpenAI account with no indexing work to show for it. The indexer in
Sprint 10 calls the provider directly; `rag-provider-list` is the only provider
surface, and it never returns credentials.

## Credentials

Keys live in `tainacan_rag_provider_{id}_api_key`, base URLs in
`tainacan_rag_provider_{id}_base_url`, and both are read only by the provider. The
only check that counts is writing a known secret and asserting that exact string is
absent from an ability result.

## Gate results

| Gate | Command | Result |
|---|---|---|
| 1 | `make guard`, `php -l` on five new classes | clean |
| 2 | `wp_get_abilities()` | 64 = 3 core + 61 Tainacan |
| 2 | `phpunit --filter Test_Abilities` | OK, 67 tests, 895 assertions |
| 2 | `make test` | OK, 468 tests, 5060 assertions |
| 2 | Live provider list | openai not configured, ollama configured, models listed |
| 2 | Live secret check | value and `sk-live` prefix both absent from the result |
| 3 | Working tree on feature/taincan-ai, uncommitted | providers |

## Execution log

Findings, appended as work happens. Not intentions.

### Two of my own assertions were wrong, twice

The live smoke printed `FAIL key_present` because it searched the encoded payload
for the substring `api_key`. The payload contains a field *named*
`requires_api_key`, so the check failed on a field name while the secret was
correctly absent — a false alarm.

Between this and Sprint 06's `json_encode` slash escaping, two ad-hoc smoke
assertions have now been wrong in a way that looked like a product defect. The rule
that comes out of it: assert on a specific value, never on a substring of an encoded
payload. The unit test does it correctly — it writes a known secret and asserts that
exact string is absent — and that is the version worth keeping.

### Notes for the next sprint

- Sprint 10 chunks and indexes. It needs `get_max_batch()` respected, and it should
  reuse the dimension check rather than trusting the provider.
- The provider list already reports `configured`, which is what the settings screen
  needs to show before an operator wonders why indexing does nothing.
