# Abilities, semantic search, and agent expertise: three-phase plan

This page is the delivery plan for three phases of work on the Tainacan plugin:

1. **Phase 1 — Tainacan Abilities.** Expose Tainacan's REST surface and its main
   repository workflows through the WordPress Abilities API, exposed to agents
   over MCP, so an agent can build collections, upload items with files, set
   metadata, publish and unpublish, and configure the repository end to end.
2. **Phase 2 — Tainacan Semantic Search.** Turn item data, metadata, document
   text and images into vectors stored in MariaDB, and expose semantic and
   similarity search over them, with an admin interface, a capability gate, and
   its own RAG abilities.
3. **Phase 3 — Agent expertise.** Ship the skills, workflow playbooks,
   instructions and a generated capability manifest that let an agent in the
   user's own environment act as a Tainacan expert, plus a narrow set of
   assisted-authoring features that call external models without ever hosting an
   agent.

Phase 2 depends on Phase 1: the RAG configuration and indexing controls are
abilities like any other, and an agent that cannot create content cannot
meaningfully index it. Phase 3 depends on both, because skills without a stable
capability surface are folklore.

The stack reference is [`architecture.md`](architecture.md); plugin conventions
live in `AGENTS.md` in the repository root.

## The trust boundary: no agents inside WordPress

This is a design invariant for all three phases, not a preference.

WordPress is a **deterministic capability server**. It never plans, never loops
over its own output, never chooses which action to take next. All agentic
behaviour happens in the client: the user's IDE agent, MCP client, or script. The
site exposes abilities; the client decides what to call.

That leaves two surfaces, and they must not blur:

| Surface | What it is | Determinism | Who decides |
|---|---|---|---|
| Capability | Registered abilities, permission-checked, auditable | Deterministic: same input, same effect | The external client |
| Inference | Single-shot assisted-authoring calls to an external provider | Non-deterministic, proposal only | The human in the form |

Rules that follow, and how each is enforced rather than merely intended:

1. **No server-side tool-calling loop.** An ability callback may make at most one
   inference call, and must return data. It never interprets a model response as
   a command to run another ability.
2. **Inference output is a proposal, not a commit.** Assisted features populate
   form state. Persisting requires a separate explicit action — a human click, or
   an external agent calling a write ability of its own accord.
3. **Assisted features cannot write.** They are structured so this is visible in
   review: the assist classes depend on read paths and provider clients, never on
   repository `insert()`/`update()`. A test asserts the assist category contains
   no ability whose annotations claim write access.
4. **Untrusted text stays data.** Item titles, metadata values, filenames, OCR
   output and extracted PDF text are attacker-controllable. They go into a
   delimited data block in a prompt, never into the instruction portion, and they
   can never change which ability runs or which arguments are used.
5. **Egress is opt-in and visible.** A site administrator enables each assisted
   feature. Where privacy matters, private and draft items are excluded by
   default, and every call is recorded in Tainacan Logs with the provider and
   model used.
6. **Spend is bounded.** Per-feature enablement plus a request budget, so a
   misconfigured client cannot run up an invoice.
7. **Credentials never travel in artifacts.** Keys live in `wp_options`, are
   never returned by a route, and never appear in a skill file or manifest.
8. **Least privilege for clients.** An external agent connects with an
   application password belonging to a dedicated role, not an administrator
   account, and the MCP transport permission is set to that role.

The single-paragraph version: the model never gets the keys to the site. It gets
proposals, and a human or an explicitly-instructed external client does the
committing.

## Delivery status

**Phase 1 is complete.** Sprints 01 to 06 landed 55 Tainacan abilities alongside
the three core ones, with the suite at 446 tests and 4920 assertions. The sprint
pages under `docs/sprints/` carry the findings; the short version is that building
on real dispatch found four plugin defects that the documented API surface hid:

1. `create_item()` validated an entity it never inserted, so creating a *published*
   item over REST had never worked — drafts were fine, which is why nobody noticed.
2. The taxonomies controller reused a single shared entity, so a second taxonomy
   created in one PHP process returned `false`.
3. The terms controller had the same defect.
4. Zero-argument abilities were uncallable through the abilities run endpoint,
   because a client that omits input sends `null` and a strict object schema
   rejected it before the callback.

Two decisions changed during delivery, both recorded rather than quietly applied:
the capability floor stays at `read` because structure permissions are per
collection, and import/export composites were reduced to primitives because the
mapping step depends on the importer type.

**Phase 2 is complete** (sprints 07 to 14). What exists: the environment gate, the
space registry with one physical table per space, the provider contract with OpenAI
and Ollama, the chunking and indexing pipeline, resumable backfill with a provider
circuit breaker, retrieval with post-ANN visibility filtering, the operator console,
hybrid keyword-plus-vector ranking, and grounded answers with citations.

Two decisions from that work are worth stating here because they constrain what comes
next. The console is a Tainacan admin page over `Rag\Status` rather than a settings
section, and each of its buttons presses the callback its ability is registered with,
so the human and agent surfaces cannot drift. And hybrid reordering of
`Search_Engine` output is opt-in and page-local: it changes order, never page
membership, because deciding which page a result belongs to means owning the query
rather than filtering its output.

Four findings belong here rather than in a sprint page:

- **The vector index is created but not used.** On MariaDB 11.8.9, `EXPLAIN` reports a
  full scan with `Using filesort` for `ORDER BY VEC_DISTANCE_COSINE(...) LIMIT n`,
  with or without a `WHERE`, and `FORCE INDEX (vec_idx)` does not change it. Storage
  and ranking are correct; retrieval is a bounded scan over one space table. The
  ordering shape below is still the only one that could ever use the index, so it is
  what the code emits.
- **A vector index has no concept of capabilities**, which is why the visibility
  stage in the retrieval design is not an optimisation detail but the security
  boundary. It is now implemented in `Rag\Semantic_Search` and covered by tests that
  assert hidden text never reaches a response.
- **A registry row can outlive its table.** Anything that reports on spaces has to
  treat a missing table as a state to display, not as an error to throw: "no index"
  and "no table" are different problems with different fixes, which is why the status
  report answers `null` for the index in the second case instead of `false`.
- **Cosine similarity and a keyword rank have no common unit.** Adding them is a
  fiction, so fusion is by reciprocal rank: an item scores `1 / (k + rank)` per list
  and agreement between lists wins. Generation is the only inference in the plugin,
  and with no generator wired `rag-answer` returns citations and `no_generator`
  instead of prose.
- **Embedding credentials belong to WordPress AI, not to Tainacan.** The default and
  only offered provider is the WordPress AI connector, so a site configures one
  provider once, in `Settings → Connectors`, instead of pasting the same key into a
  second screen that then has to track vendor names. OpenAI and Ollama remain
  reachable through `tainacan_rag_register_embedding_providers` for a site that wants
  a direct key, and the embeddings client itself arrives through
  `tainacan_rag_wordpress_ai_embed` rather than being guessed at an API that varies by
  AI plugin version.

## Verified baseline

Measured against the running stack, not assumed. Re-check before starting.

| Fact | Value | Consequence |
|---|---|---|
| WordPress | 7.1.3 | Abilities API is core; `meta.public` also drives `show_in_rest` from 7.1 |
| Abilities API | `wp_register_ability`, `wp_register_ability_category`, `wp_get_abilities`, `wp_get_ability`, `wp_has_ability`, `WP_Ability::execute()` | Full API, including categories and `meta` |
| Required ability args | `label`, `description`, `category`, `execute_callback`, `permission_callback` | Validated in `WP_Ability::prepare_properties()`; a missing one throws |
| Optional ability args | `input_schema`, `output_schema`, `meta` | `meta.annotations` is validated as an array |
| Abilities REST | `/wp-abilities/v1/abilities`, `.../{name}`, `.../{name}/run`, `/categories` | Free HTTP surface for every ability |
| Core abilities | `core/get-site-info`, `core/get-user-info`, `core/get-environment-info` | Tainacan abilities sit alongside, in own categories |
| MariaDB | 11.8.9 | `VECTOR` exists from 11.7 |
| `VECTOR` DDL | `VECTOR(n)` column plus `VECTOR INDEX` works | Native ANN storage available |
| Vector functions | `VEC_FromText`, `VEC_ToText`, `VEC_DISTANCE_COSINE`, `VEC_DISTANCE_EUCLIDEAN` | Verified ranking: `0.0000`, `0.0061`, `1.0000` |
| Vector literal | `'[1,0,0]'` raises `ERROR 1292 Incorrect vector value` | Always wrap in `VEC_FromText()` |
| `tainacan/v2` REST surface | **137 operations**, 22 controllers | Size of the Phase 1 problem |
| Existing text pipeline | `Tainacan\Media::$content_index_meta = 'document_content_index'`, `tainacan_extract_document_content` filter, `Items::extract_document_content()` | Phase 2 chunk source already exists |
| Existing AI seam | `Tainacan\Integrations\WordPress_AI` already calls `wp_has_ability( 'ai/alt-text-generation' )` | Plugin already consumes abilities |
| Admin page seam | `src/views/class-tainacan-pages.php` (`\Tainacan\Pages`), used by Oráculo | Correct place for the new screen |
| Settings seam | `src/views/settings/class-tainacan-settings.php` (`create_tainacan_setting()`) | Additive settings section |

Must be probed at runtime rather than assumed: the maximum `VECTOR(n)` this
server accepts, whether `VECTOR INDEX` builds on a given column, and
`max_allowed_packet`. The design below validates a dimension *before* creating a
table instead of hard-coding a limit.

## Requirement: the capability gate

The new screen must not render controls that cannot work. Registration of the
menu happens always; the *content* depends on a graded environment check.

`Tainacan\Rag\Environment_Check` returns a verdict with per-check detail:

| Check | Hard requirement | Why |
|---|---|---|
| `function_exists( 'wp_register_ability' )` | Phase 1 | No Abilities API, no abilities |
| `wp_register_ability_category` exists and core categories register | Phase 1 | Categories are mandatory |
| `meta.public` honoured by core (`show_in_rest`) | Phase 1, 7.1+ | Agents/clients cannot discover abilities otherwise |
| MCP adapter present (optional) | Phase 1 MCP exposure | Without it, abilities stay in WordPress |
| MariaDB exists (`DBI` type `maria` through `$wpdb->dbh`/`SELECT VERSION()`) | Phase 2 | Native vectors are MariaDB-only |
| Version ≥ 11.7, or `VECTOR` probe succeeds | Phase 2 | `VECTOR` type availability |
| `CREATE TABLE (... v VECTOR(n), VECTOR INDEX (v))` probe succeeds for the chosen dimension | Phase 2 | Dimension limits and index support are server-specific |
| `ORDER BY VEC_DISTANCE_COSINE( ... ) LIMIT k` returns rows | Phase 2 | Confirms the ANN path, not just the type |
| InnoDB default, `max_allowed_packet` sufficient | Phase 2 | Table creation and batch insert reliability |

Verdicts:

- **Ready** — full interface.
- **Degraded** — Phase 1 works, Phase 2 blocked (for example MySQL instead of
  MariaDB, or MariaDB < 11.7). Show the RAG tab disabled, with an explicit
  upgrade message naming the failed check and the minimum version.
- **Unsupported** — Abilities API missing. The menu still appears so an
  administrator learns *why* features are absent, rather than a menu that
  silently is not there.

Implementation detail: run the probes once, cache the verdict in an option with
a short TTL, expose a "re-check" action and a
`tainacan_rag_environment_verdict` filter. Never run DDL probes on every admin
page load. The probe tables are created in a scratch name and dropped
immediately; nothing is left behind. Because these probes issue DDL, they run
only for a user with `manage_options` and only on explicit request or on version
change, never on the front end.

## Phase 1 — Tainacan Abilities

### Registration contract

Two hooks, in this order, and nothing outside them:

```php
add_action( 'wp_abilities_api_categories_init', [ $this, 'register_categories' ] );
add_action( 'wp_abilities_api_init',            [ $this, 'register_abilities' ] );
```

Registering anywhere else returns `null` and fires `_doing_it_wrong`, which is
silent when `WP_DEBUG` is off. Categories must exist before abilities reference
them. Guard the whole bootstrap with
`if ( ! function_exists( 'wp_register_ability' ) ) { return; }`.

### Where the code lives

Add one constant and one autoloader branch, copying the existing `Integrations`
case in `tainacan/src/classes/tainacan-creator.php`:

```php
const TAINACAN_ABILITIES_DIR = __DIR__ . '/abilities/';
```

```php
} else if ( isset( $class_path[1] ) && $class_path[1] === 'Abilities' ) {
    $dir = TAINACAN_ABILITIES_DIR;
}
```

`TAINACAN_INTEGRATIONS_DIR` is deliberately absent from `DIRS` and still
resolves because the explicit branch wins. Follow that pattern instead of adding
`Abilities` to `DIRS`, since the `DIRS` loop would otherwise probe every ability
file for every unrelated class.

```text
src/classes/abilities/
    class-tainacan-abilities-bootstrap.php   the two hooks, guard clause
    class-tainacan-abilities-categories.php  category registration
    class-tainacan-ability-bridge.php        REST request <-> ability adapter
    class-tainacan-abilities-registry.php    declarative table, one row per ability
    class-tainacan-ability-collections.php   one class per resource group
    class-tainacan-ability-items.php
    class-tainacan-ability-media.php
    ...
```

### Naming, categories, and MCP exposure

MCP rewrites `/` to `-`, so `tainacan/collection-create` is seen by clients as
`tainacan-collection-create`. Choose names with that in mind; they are the agent
surface.

Categories (registered on the categories hook, slug pattern
`[a-z0-9]+(?:-[a-z0-9]+)*`):

`tainacan`, `tainacan-content`, `tainacan-structure`, `tainacan-media`,
`tainacan-search`, `tainacan-admin`, `tainacan-rag`.

Every agent-facing ability needs:

```php
'meta' => [
    'public'      => true,          // expose to clients incl. MCP (and show_in_rest on 7.1+)
    'mcp'         => [ 'type' => 'tool' ],
    'annotations' => [
        'readonly'    => true,      // → readOnlyHint
        'destructive' => false,     // → destructiveHint
        'idempotent'  => true,      // → idempotentHint
    ],
],
```

Without `meta.public` the ability exists but no agent can see it, which is the
most likely silent failure of Phase 1. Annotations use the WordPress spelling
and the adapter converts them.

### Coverage: three tiers

A literal mapping of 137 operations produces overlapping tools that agents
choose badly (`bulk-edit/add`, `bulk-edit/remove`, `bulk-edit/replace`…). Tier
them instead.

**Tier 1 — curated resource abilities (~55).** `<resource>-<verb>` over the
controller that already exists:

| Ability | Backed by |
|---|---|
| `tainacan/collection-list`, `-get`, `-create`, `-update`, `-delete` | collections controller |
| `tainacan/item-list`, `-get`, `-create`, `-update`, `-delete` | items controller |
| `tainacan/item-publish`, `item-unpublish` | items controller status transitions |
| `tainacan/item-metadata-get`, `-set` | item-metadata controller |
| `tainacan/metadata-list`, `-get`, `-create`, `-update`, `-delete` | metadata controller |
| `tainacan/metadata-section-*` | metadata-sections controller |
| `tainacan/taxonomy-*`, `tainacan/term-*` | taxonomies, terms controllers |
| `tainacan/filter-*`, `tainacan/facet-get` | filters, facets controllers |
| `tainacan/metadata-types-list`, `filter-types-list`, `exposers-list`, `capabilities-get` | read-only introspection |
| `tainacan/attachment-upload`, `attachment-get` | media handling, see below |

**Tier 2 — workflow abilities (~15).** Multi-call sequences as one intent. These
are what make an agent able to "upload an entire collection".

| Ability | Composes |
|---|---|
| `tainacan/collection-scaffold` | create collection, create metadata sections, create metadata in one call |
| `tainacan/item-create-with-metadata` | item create plus metadata values plus document attachment |
| `tainacan/bulk-edit-apply` | one ability with an `operation` enum over the 15 bulk-edit routes |
| `tainacan/import-run` | importer session, mapping, run, poll |
| `tainacan/export-run` | exporter session, run, poll |
| `tainacan/batch-items-create` | many items with metadata in one call, chunked internally |
| `tainacan/taxonomy-bulk-terms` | replaces `terms/bulkinsert` |

**Tier 3 — escape hatch (1).** `tainacan/rest-request`, taking `route`, `method`
and `params`, with the route restricted to the `tainacan/v2` prefix. It must
enforce the target route's own permission callback; it is a coverage guarantee,
not a privilege bypass.

### The media gap

An agent that cannot attach a file cannot build a real collection. Tainacan
stores an item's document as an attachment ID, so Phase 1 needs:

- `tainacan/attachment-upload` — accepts base64 content, a URL, or a filename
  plus bytes, creates the attachment through `media_handle_sideload()` /
  `wp_upload_bits()`, sets alt text, and returns the attachment ID and URL. Gate
  with `upload_files` plus the collection's `tainacan_edit_items`. Content type
  allow-list applies (never trust the extension).
- `tainacan/item-set-document` — binds an attachment ID or external URL to an
  item, and triggers the existing extraction path.

This is the difference between "an agent can create metadata" and "an agent can
load a repository".

### Execution: call the controller, never loop back

Build a `WP_REST_Request` and invoke the controller callback directly:

```php
$request = new \WP_REST_Request( $method, $route );
$request->set_query_params( $query_args );
$request->set_body_params( $body_args );
$request->set_url_params( $url_args );

$permitted = call_user_func( $handler['permission_callback'], $request );
if ( true !== $permitted && is_wp_error( $permitted ) ) {
    return $permitted;
}
$response = call_user_func( $handler['callback'], $request );
```

HTTP loopback is wrong here for the same reason background processes fail in
this stack: containers cannot reach the published `WP_SITE_URL`. Resolve handlers
from `rest_get_server()->get_routes()` at runtime rather than transcribing 137
JSON schemas that will rot.

Normalize the result: `WP_REST_Response` → `get_data()`, escalating a status
`>= 400` to `WP_Error`; pass `WP_Error` through unchanged.

Declare only the parameters that matter in `input_schema` (`collection_id`, `id`,
`per_page`, `search`, `metaquery`, `orderby`, `status`), leave
`additionalProperties` open, and let the controller validate the rest. An
over-tight schema rejects legitimate Tainacan query arguments and is worse than a
loose one. Use object schemas; reserve flattened schemas for single-value
abilities.

### Permissions

Abilities are a second door, so they must not be a weaker one.

1. Reuse the controller's `permission_callback` verbatim — it already encodes
   `Tainacan\Roles` capabilities and per-collection checks.
2. Mark `delete`, `bulk-edit` destructive operations, `import-run` and
   `item-set-document` as `destructive` so clients can gate them.
3. Transport permission in the MCP adapter gates a whole server; treat it as an
   additional layer, never as the only check.

### What this unlocks for an agent

1. `tainacan/collection-scaffold` → collection plus metadata schema.
2. `tainacan/attachment-upload` per file, then `tainacan/batch-items-create`
   with metadata and document IDs.
3. `tainacan/item-publish` to make them visible.
4. `tainacan/rag-configure` and `tainacan/rag-index-collection` (Phase 2).
5. `tainacan/rag-search` to verify the index answers sensibly.

That sequence is the acceptance test for the whole programme.

## Phase 2 — Tainacan Semantic Search

### The dimension problem, stated precisely

`VECTOR(n)` requires a literal dimension in the column type, so a single column
cannot hold arbitrary dimensions. Two further facts drive the design:

- Vectors from different models are **not comparable**, even at equal dimension.
  A `text-embedding-3-small` 1536-vector and a 1536-vector from another model
  live in different spaces.
- Therefore "which column" is the wrong question. The right unit is a **vector
  space**: provider + model + modality + dimension. Everything is queried
  *within* one space.

This is why the earlier single-table, pinned-dimension design is discarded.

### Design: registry plus one physical table per space

**Table 1 — registry** (created in `src/migrations.php`):

```sql
CREATE TABLE {$prefix}tainacan_vec_spaces (
    id            bigint(20) unsigned NOT NULL auto_increment,
    space_key     varchar(96)  NOT NULL,   -- e.g. openai:text-embedding-3-small:1536:text
    provider      varchar(64)  NOT NULL,
    model         varchar(128) NOT NULL,
    modality      varchar(16)  NOT NULL,   -- text | image
    dimensions    smallint(5) unsigned NOT NULL,
    table_name    varchar(64)  NOT NULL,   -- the physical chunk table
    is_active     tinyint(1)   NOT NULL default 0,
    status        varchar(16)  NOT NULL default 'pending',
    created_at    datetime     NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY space_key (space_key),
    KEY active (modality, is_active)
) ENGINE=InnoDB;
```

**Table 2..n — one chunk table per space**, created on demand when a space is
first configured:

```sql
CREATE TABLE {$prefix}tainacan_vec_<slug> (         -- slug from space_key, sanitized
    id           bigint(20) unsigned NOT NULL auto_increment,
    item_id      bigint(20) unsigned NOT NULL,
    collection_id bigint(20) unsigned NOT NULL,
    metadatum_id bigint(20) unsigned NULL,
    source       varchar(16) NOT NULL,   -- title | metadata | document | image
    chunk_index  int(10) unsigned NOT NULL default 0,
    content      mediumtext NOT NULL,    -- text, or a caption/description for images
    content_hash char(40) NOT NULL,
    attachment_id bigint(20) unsigned NULL, -- for image spaces
    embedding    VECTOR(<dimensions>) NOT NULL,
    indexed_at   datetime NOT NULL,
    PRIMARY KEY (id),
    KEY item_source (item_id, source),
    KEY coll (collection_id),
    KEY content_hash (content_hash),
    VECTOR INDEX vec_idx (embedding)
) ENGINE=InnoDB;
```

Why this shape:

- **Any dimension works.** `<dimensions>` comes from the provider at
  configuration time; nothing is hard-coded. A 384-dimension local model and a
  3072-dimension API model coexist as separate tables.
- **No wasted storage.** Unlike a wide table with `v768, v1024, v1536, v3072`
  columns, nothing is nullable-padded. I considered the multi-column approach you
  suggested: it caps you to a curated set of dimensions and wastes a row's worth
  of NULLs per column, so it is the wrong primary design. It survives only as a
  fallback if dynamic DDL proves unacceptable in a given hosting environment.
- **Per-space drop and rebuild.** Changing provider or dimension means dropping
  one table, not migrating a shared one. Reindex becomes a blunt, safe
  operation.
- **Correct isolation.** A query never compares vectors across spaces.

The registry lets the UI and the diagnostic screen answer "what exists, how big
is it, is it active" without touching dynamic table names.

Guardrails on dynamic DDL: table names are derived from `space_key` through a
strict sanitizer (`[a-z0-9_]`, length-capped) and validated against the registry;
never interpolate a user-supplied string into DDL. Dimensions are validated by
probing `VECTOR(n)` on a scratch table before the real table is created.

### One active space per modality

Several spaces can be defined; **exactly one is active per modality**. All
collections share it, which is the "standard sizing across collections" you
asked for. Switching the active space — or changing a provider whose dimension
differs — puts the UI in a blocking state that says, plainly, that the existing
index is in a different vector space and must be rebuilt, then offers the rebuild.
That is expected, not a surprise.

### Providers and modalities

`Tainacan\Rag\Providers\Embedding_Provider`:

```php
interface Embedding_Provider {
    public function get_id(): string;
    public function get_label(): string;
    public function supported_modalities(): array;   // ['text'], ['text','image']
    public function get_dimensions( string $model ): int;
    public function get_max_batch(): int;
    public function embed_text( array $texts, string $model ): array;
    public function embed_image( array $paths, string $model ): array;
}
```

Ship in this order: OpenAI (text), Voyage (text, multimodal), Cohere (text,
multimodal), Gemini (text, multimodal), Ollama (text, local), and a generic
OpenAI-compatible base class so self-hosted gateways work without new code. A
`tainacan_rag_register_embedding_providers` filter lets a site add one.

**Images.** Two strategies, and both should be available because they trade
quality against universality:

- **Caption-then-embed** — a vision model describes the image, and a normal text
  space embeds the description. Works with any text provider, makes images
  searchable in the same space as text, but loses visual-only similarity.
- **Native image embeddings** — a multimodal model (CLIP-family, Cohere
  multimodal, Voyage multimodal, Gemini) produces image vectors. Enables true
  visual similarity and text-to-image search *within that space*, but requires a
  multimodal provider.

Because the two live in different spaces, the UI must state which space a search
runs against. Cross-modal search is only offered for spaces whose provider
declares a shared space.

**Documents.** Reuse `document_content_index` as text, but embed the **full
extracted text at index time**, not the truncated meta used for keyword search —
`document_content_index_max_characters` truncation would silently degrade
retrieval. Chunk with overlap, size derived from the model's token limit, and
store the hash so re-indexing only touches changed chunks.

### Decision: standalone pipeline, borrowed design

Tainacan owns embedding storage and retrieval. It does **not** register as a
WordPress AI embedding consumer, because that manager is text-only, stores in its
own schema, and offers no native vector index — three things this phase
explicitly needs. What it reuses is the *architecture*, which was validated on
the same WP 7.1.3 / PHP 8.3 combination against a local Ollama model.

Consequences worth stating, because they are the reason for the choice:

- Arbitrary dimensions stay possible, since each space creates a table whose
  `VECTOR(n)` comes from the provider.
- Images get first-class support, which a text-only consumer model cannot offer.
- Retrieval uses MariaDB ANN instead of a full scan, so it stays usable as a
  collection grows.
- Tainacan's index and any WP AI index are independent. Both may embed the same
  `tainacan-item` posts without conflict, but they are separate tables, separate
  costs, and separate switches. The settings screen should say so, so an operator
  does not pay twice by accident.
- WordPress AI is still used for one thing: optional answer generation in
  `tainacan/rag-answer`, through the existing `Tainacan\Integrations\WordPress_AI`
  checks. Generation is not embeddings, and that integration already exists.

### Indexing pipeline

| Concern | Approach |
|---|---|
| Change capture | Watch item save, metadata save, document change, term save; enqueue, never embed inline |
| Immediate removal | On unpublish, trash, password-protect or delete, remove vectors right away, not on the next run |
| Worker | Time-boxed run with a lock, reschedules itself; runs through Tainacan's existing background-process infrastructure and heartbeat |
| Backfill | Explicit per-collection or site-wide backfill, batch cursor persisted so an interrupted run resumes |
| Idempotency | `content_hash` per chunk; identical text is never re-embedded |
| Failure handling | Per provider+model pause on 429/402, exponential retry, circuit breaker after repeated failures |
| Model sharing | One embed per chunk per space, shared by every consumer of that space |
| Orphans | Sweep vectors whose item no longer exists or no longer qualifies |

Tainacan already has the container for this: `Generic_Process_Handler` and the
heartbeat in `Background_Process_Heartbeat`. A `Rag_Indexer_Process` subclass
slots in beside the importers.

Known trap in this stack: background processes stay in `waiting` unless
`TAINACAN_BG_PROCESS_LOOPBACK_URL` is set (see
[`../reference/make-targets.md`](../reference/make-targets.md), `make bg-loopback`).
An indexer that never starts is that bug, not an embeddings bug.

### Retrieval

`Tainacan\Rag\Semantic_Search`, always scoped to one space:

1. Embed the query in the active space for the requested modality.
2. ANN query:
   `SELECT ... FROM {space_table} WHERE collection_id IN (...) ORDER BY VEC_DISTANCE_COSINE(embedding, VEC_FromText(%s)) LIMIT %d`.
   The `ORDER BY ... LIMIT` shape is the only one MariaDB could answer from a vector
   index. On 11.8.9 it does not, which the delivery status above records.
3. Re-fetch hits through the `Items` repository (`post__in`) so collection
   privacy, `tainacan_read_private_items`, status and `Private_Files` still apply.

Step 3 is not optional. A vector index has no concept of capabilities; skipping
it returns private items to users who cannot open them.

**WordPress search integration.** Do it where it is safe: Tainacan's
`Search_Engine` already replaces search for Tainacan item queries, so hybrid
ranking (keyword plus vector) belongs there and affects only Tainacan items.
Other post types are untouched. Front-end widgets and a Tainacan-only search
component are the fallback if the hybrid proves risky to ship at once, which is
the order this plan takes: Tainacan-scoped component first, WP search integration
after.

### The Phase 2 interface

Registered through `\Tainacan\Pages` (`src/views/class-tainacan-pages.php`), with
settings added through `create_tainacan_setting()` in a new
`tainacan_settings_rag` section:

- **Requirements panel** — the capability gate verdict; if not ready, only this
  renders, with the specific failed check and the upgrade needed.
- **Spaces** — providers configured, model, dimension (read-only once indexed),
  modality, active flag, reindex-on-switch warning.
- **Indexing** — per-collection coverage, pending queue depth, failures with
  reasons, backfill and orphan-sweep actions.
- **Search preview** — run a query against the active space and show scored
  chunks, so an operator can judge quality before exposing it.
- **Storage** — chunk counts and estimated bytes per space.

Secrets never render and are never returned by a route; the UI shows
configured/not-configured and a masked field. Assets follow the repository rules:
webpack entry in `webpack.common.js`, SCSS line in `compile-sass.sh`, enqueue
with `TAINACAN_VERSION`, then `make assets`. Nothing under `src/assets/js/` or
`src/assets/css/` is edited by hand, and because the plugin mount is read-only,
configuration and queue state live in options and tables.

### RAG abilities

| Ability | Behaviour | Notes |
|---|---|---|
| `tainacan/rag-status` | spaces, dimensions, counts, queue depth, last index | readonly |
| `tainacan/rag-configure` | create or update a space, choose active space | admin only |
| `tainacan/rag-index-collection` | enqueue a collection backfill | idempotent |
| `tainacan/rag-index-item` | enqueue one item | idempotent |
| `tainacan/rag-search` | query → scored items and snippets | respects item visibility |
| `tainacan/rag-similar-items` | item → similar items | same space |
| `tainacan/rag-search-images` | text → images, or image → images | only for image-capable spaces |
| `tainacan/rag-answer` | retrieve, then answer via a WP AI connector | optional |

`rag-configure` and `rag-answer` require `manage_options`; `rag-search` follows
the read capabilities of the items it returns.

## Phase 3 — Agent expertise, outside WordPress

### Objective

Give a user's own agentic environment enough Tainacan knowledge to work as an
expert: the vocabulary, the order of operations, the preconditions, the
verification, and the known failure modes. Delivery target is **portable
artifacts**, not a product-specific integration — the same content should serve
an IDE agent, an MCP client, or a script.

The reason this needs its own phase is that generic model knowledge of Tainacan
is thin and often wrong. An agent that guesses metadata types, invents capability
names, or assumes collections are WordPress categories will produce plausible,
broken work. Skills exist to replace guessing with a contract.

### Deliverable A — a generated capability manifest

Hand-written tool documentation drifts from the code within one release. Generate
it:

- Source of truth: the abilities registry. Walk `wp_get_abilities()`, filter to
  the `tainacan` namespace, and emit for each ability: registration name, MCP
  tool name, label, description, category, input and output schema, annotations,
  required capabilities, and one worked example payload.
- Outputs: `tainacan-abilities.json` for machines and `ABILITIES.md` for humans,
  written by a Make target (automation lives in the `Makefile`) that runs inside
  the builder container, following the `generate_docs.sh` precedent.
- Drift control: a test fails when the committed manifest does not match the
  registry, so a new ability cannot ship undocumented.

This manifest is what makes the rest cheap: skills reference abilities by name and
the manifest guarantees those names exist.

### Deliverable B — skills library

Follow the `SKILL.md` house style already used in this repository
(`.agents/skills/`): front matter with name, description and concrete trigger
phrases, then body sections for preconditions, the ability mapping, the ordered
procedure, verification, and failure modes.

| Skill | Teaches |
|---|---|
| `tainacan-repository-modeling` | collection architecture, metadata sections, metadatum types, required versus multiple, filters and facets, mapper compatibility |
| `tainacan-content-ingest` | item creation, metadata values, attachments as documents, batch loading, status lifecycle |
| `tainacan-metadata-conventions` | core, taxonomy, compound and relationship types; when a value belongs in a taxonomy instead of a text metadatum |
| `tainacan-import-export` | importer sessions, mapping, CSV and XLSX conventions, exporters, OAI |
| `tainacan-semantic-search` | vector spaces, provider choice, indexing, quality verification, rebuild on provider change |
| `tainacan-access-control` | roles, `tainacan_*` capabilities, private files, collection visibility, application passwords |
| `tainacan-operations-troubleshooting` | background processes stuck in `waiting`, loopback URL, extraction failures, indexing stalls, cron |

Each skill must state that Tainacan vocabulary is exact: an **item** is not a
post in conversation, a **metadatum** is not a custom field, a **facet** is not a
filter value. Getting the words right is most of getting the work right.

### Deliverable C — workflow playbooks

End-to-end recipes, each with a preflight, ordered steps, a verification step and
a rollback path. Playbooks are where an agent stops being plausible and becomes
useful.

1. **Bootstrap a collection from a specification** — schema first, content second.
2. **Load a folder of documents plus a metadata CSV** — the flagship: scaffold,
   upload, batch create, publish, verify counts.
3. **Retrofit metadata onto an existing collection** — non-destructive ordering,
   backfill, and how to check nothing was orphaned.
4. **Enable semantic search and validate quality** — configure a space, index a
   sample, run known queries, judge, then index everything.
5. **Bulk publish or unpublish with an audit trail** — including which log
   entries to read afterwards.
6. **Change embedding provider** — the rebuild sequence and why the old space
   must be dropped rather than mixed.
7. **Hand-off audit** — a checklist an agent runs to certify a collection it
   built: schema matches specification, item count matches source, attachments
   resolve, index coverage is complete, no private item leaked into results.

### Deliverable D — connection guide and least-privilege role

Document at least three ways a client connects, because hosting environments
differ:

| Mode | Requires | Notes |
|---|---|---|
| MCP over HTTP | MCP adapter plugin, application password | Preferred for agent clients; transport permission scoped to the agent role |
| Direct REST | application password | Fallback; abilities available at `/wp-abilities/v1/...` |
| WP-CLI | shell access | Useful for verification and bulk work, not for agents on managed hosts |

Ship a recommended role definition with the minimum capability set that can
create collections and items but not manage users or plugins, and instruct agents
to use it. Include a copy-paste configuration block on the admin screen so the
user does not assemble it from documentation.

### Deliverable E — verification

An agent must be able to check its own work, or it will report success falsely.

- `tainacan/health` ability: environment verdict from Phase 2's check, index
  coverage, queue depth, last run, and counts by collection. Read-only.
- A conformance checklist per playbook: expected abilities present, sample
  create → read → delete round trip, expected item counts, index coverage.
- Failure messages that name the cause. The most likely false success in this
  stack is content that exists but never indexes because background processes are
  stuck in `waiting`; the checklist must detect exactly that.

### Deliverable F — assisted authoring (the only inference allowed)

Narrow, single-shot, proposal-only features that call external providers through
the site's WordPress AI connectors. These are the only place a model runs `on
behalf of` WordPress, and per the trust boundary they cannot act.

| Feature | Input | Output | Written by |
|---|---|---|---|
| `tainacan/ai-describe-image` | attachment | alt text and a description | human accepts it |
| `tainacan/ai-suggest-metadata` | item form state plus extracted document text | proposed values for text and date metadata | human accepts them |
| `tainacan/ai-suggest-terms` | item content | proposed **existing** terms from the collection's taxonomies | human accepts them |
| `tainacan/ai-summarize-document` | extracted text | summary for the content index or RAG grounding | human accepts it |

Design constraints, all of which follow from the trust boundary:

- `ai-suggest-terms` may only choose from terms that already exist. Creating
  vocabulary as a side effect of assistance is how taxonomies rot.
- Output is validated against the metadata definition before it reaches the form;
  a value that fails validation is shown as rejected, never silently coerced.
- Mark these abilities `readonly: true` where they persist nothing, put them in
  the `tainacan-assist` category, and gate them behind an explicit setting.
- Expose them to MCP as well: an external agent generating alt text is a
  legitimate use, and it is still the client making the decision. Keep the
  per-feature switch as the control.
- This continues an existing pattern rather than inventing one:
  `Integrations\WordPress_AI::is_alt_text_generation_available()` already gates
  alt-text generation in the item editor using
  `wp_has_ability( 'ai/alt-text-generation' )`. Reuse that availability-check
  style for the new features.

### Where the artifacts live

Ship them inside the plugin under a documentation path, versioned with the plugin
so the manifest always matches the installed abilities, and surface a "Connect an
agent" panel in the Tainacan admin that shows the manifest version, the connection
modes, and the copy-paste configuration. Generated output is produced by the
builder, never hand-edited, and never written at runtime — the plugin mount is
read-only.

## What we harness from the references

**tainacan-oraculo** — proves the feature set is wanted and shows the shape of
the admin surface: dashboard with tabs (status, indexing, settings), provider
list, per-collection prompts, REST namespace, and `wp <ns> index|reindex|stats`
commands. It stores vectors without a native vector index, which is precisely
the part this plan does differently. It also documents the integration seam we
will use: the Tainacan Pages API.

**mcp-adapter creating-abilities guide** — supplies the exposure rules
(`meta.public`, `meta.mcp.type`, `meta.annotations`), the category-hook ordering,
the tool-name sanitization that turns `tainacan/item-create` into
`tainacan-item-create` for clients, the flattened-schema option, and the
two-layer permission model.

**WordPress/ai PR #1135** — supplies a validated architecture for embedding
lifecycles: consumer registration, change listener, time-boxed locked worker,
resumable backfill, chunk hashing, shared vectors per model, provider backoff and
circuit breaking. Tainacan reuses the *design*, not the storage, because the
requirement here is native MariaDB vectors with arbitrary dimensions plus
multimodal support, which that manager does not provide.

## Work breakdown

### Phase 1 — Tainacan Abilities

| Step | Deliverable | Exit criteria |
|---|---|---|
| 1.1 | `Tainacan\Abilities` namespace, autoloader branch, bootstrap on the two hooks, category registration | Abilities and categories appear in `wp_get_abilities()`; test asserts registration and hook ordering |
| 1.2 | `Ability_Bridge`: route resolution, request building, permission reuse, response normalization | Bridge unit tests cover `WP_REST_Response`, `WP_Error` and plain returns |
| 1.3 | Declarative ability table plus Tier 1 collections and items | Create, read, update, delete and publish verified through ability execution and through `/wp-abilities/v1/.../run` |
| 1.4 | Tier 1 metadata, sections, taxonomies, terms, filters, facets | Each resource has an execute test and a permission-denied test |
| 1.5 | Media abilities: `attachment-upload`, `attachment-get`, `item-set-document` | An item can be created with a real file and its extracted text appears in `document_content_index` |
| 1.6 | Tier 2 workflows: scaffold, create-with-metadata, batch create, bulk-edit-apply, import-run, export-run | An agent-style script creates a collection and 50 items in one sequence |
| 1.7 | Tier 3 `rest-request` with route restriction and permission passthrough | Non-`tainacan/v2` routes rejected; low-capability user rejected |
| 1.8 | MCP exposure: `meta.public`, `meta.mcp.type`, annotations; lint test over the table | An MCP client lists Tainacan tools and executes a create |

### Phase 2 — Tainacan Semantic Search

| Step | Deliverable | Exit criteria |
|---|---|---|
| 2.1 | `Environment_Check` with probes, cached verdict, filtered result | Ready, degraded and unsupported verdicts each rendered correctly; no DDL on normal page loads |
| 2.2 | Registry migration plus dynamic per-space table creation with dimension probing | Two spaces of different dimensions coexist; ANN query returns ranked rows in both |
| 2.3 | Provider interface, OpenAI-compatible base, OpenAI plus one local provider | Embed text and image through the interface; dimensions reported and validated |
| 2.4 | Chunker, content hashing, sources for title, metadata, document text | Re-index of unchanged content embeds zero chunks |
| 2.5 | `Rag_Indexer_Process`, change capture, immediate removal on unpublish, trash and delete | Trash an item, its vectors are gone before the next worker run |
| 2.6 | Backfill with persisted cursor, provider backoff, circuit breaker, orphan sweep | Interrupted backfill resumes; a forced 429 pauses the pair instead of looping |
| 2.7 | `Semantic_Search` with space scoping and post-ANN visibility filtering | Query never returns an item the current user cannot read |
| 2.8 | Admin interface: requirements panel, spaces, indexing, search preview, storage | Operator configures and reindexes without WP-CLI |
| 2.9 | RAG abilities: status, configure, index, search, similar, image search | Agent enables semantic search and queries it end to end |
| 2.10 | Hybrid ranking inside `Search_Engine` for Tainacan items | Keyword and vector results merge; other post types unaffected |

Phase 1 step 1.6 plus Phase 2 step 2.9 is the acceptance test for phases 1 and 2:
an agent creates a collection, uploads items with files, publishes them, configures
semantic search, indexes the collection, and gets sensible ranked answers.

### Phase 3 — Agent expertise

| Step | Deliverable | Exit criteria |
|---|---|---|
| 3.1 | Manifest generator plus Make target, emitting JSON and Markdown from the registry | Regenerating produces no diff when abilities are unchanged; a stale manifest fails the test suite |
| 3.2 | `tainacan/health` ability: environment verdict, index coverage, queue depth, counts | An agent can detect a stalled indexer without reading logs |
| 3.3 | Least-privilege agent role plus the three connection modes | A client authenticated with the agent role can create a collection and an item, and cannot manage users or plugins |
| 3.4 | Skills library, seven `SKILL.md` files in the house style | Each skill names only abilities present in the manifest, verified by a link check |
| 3.5 | Seven workflow playbooks with preflight, steps, verification and rollback | The flagship playbook loads a document folder plus CSV end to end from a cold start |
| 3.6 | Assisted authoring: describe image, suggest metadata, suggest terms, summarize document | Every feature is proposal-only, schema-validated, logged, switchable, and cannot write |
| 3.7 | Trust-boundary test suite | Tests assert the assist category contains no writing ability and that no ability callback runs a second ability from model output |
| 3.8 | Admin "Connect an agent" panel with copy-paste configuration | A user can connect a client using only what the screen shows |
| 3.9 | Hand-off audit playbook | An agent certifies a collection it built: schema, counts, attachments, index coverage, no private leaks |

Phase 3 step 3.5 plus step 3.9 is the acceptance test for the programme as a
whole: an agent with no prior Tainacan knowledge reads the artifacts, builds and
loads a collection, enables semantic search, and then audits its own work honestly.

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Ability registered outside `wp_abilities_api_init` | Silently absent | Bootstrap only hooks the two hooks; a test asserts registration |
| Category registered after abilities | Silent absence with `WP_DEBUG` off | Categories hook runs first; test asserts every referenced slug exists |
| `meta.public` omitted | Invisible to MCP clients | Lint test over the declarative table |
| Abilities weaken permissions | Data leak | Reuse controller callbacks; test logged-out and low-capability users |
| Dynamic DDL with unsafe names | SQL injection | Strict sanitizer plus registry validation; dimensions probed first |
| Wrong space queried | Nonsense rankings | Space id is required at query time; UI shows the active space |
| ANN results bypass capabilities | Private items leak | Post-ANN visibility filtering through `Items` |
| Embedding cost and rate limits | Failures, surprise bills | Hash skip, batching, provider backoff, dry-run counts in the UI |
| Indexer never starts | Silent stall | Loopback URL check surfaced in the requirements panel |
| Vector storage growth | Disk pressure | Per-space byte estimates; drop space reclaims immediately |
| An agent is hosted inside WordPress | Unbounded cost, untraceable actions, injection blast radius | Trust boundary holds: no server-side loops, inference is single-shot and proposal-only |
| Prompt injection through item content | Model steers a write | Untrusted text stays in a delimited data block; assist features have no write dependency; a test enforces it |
| Assisted output written without review | Bad metadata silently committed | Proposals populate form state only; validation rejects rather than coerces |
| Stale skill with the installed plugin | Agent calls abilities that no longer exist | Manifest generated from the registry in the same build step |
| Agent runs with administrator credentials | Privilege escalation | Dedicated least-privilege role, application password, scoped MCP transport permission |
| Agent stops mid-workflow | Half-built collection, truncated batch | Playbooks are resumable and verify counts; the hand-off audit catches incomplete batches |

## Decisions taken

1. **WP AI relationship — resolved.** Standalone Tainacan pipeline. Own vector
   spaces, own tables, own retrieval; borrow the queue, backfill, hashing and
   backoff design. WordPress AI is used only for optional answer generation.
2. **Agents run outside WordPress — decided.** WordPress is a deterministic
   capability server. The only inference it performs is single-shot assisted
   authoring that returns proposals and cannot write. Everything agentic happens
   in the user's environment, over MCP or REST, with a least-privilege role.

## Open decisions

2. **Image strategy.** Caption-then-embed only, native multimodal only, or both
   as separate spaces (recommended).
3. **Search rollout.** Tainacan-scoped component first (recommended) or hybrid
   inside `Search_Engine` from the start.
4. **Tier 1 cut.** Whether reports and logs belong in Phase 1 or in the Tier 3
   escape hatch.
5. **MCP packaging.** Rely on the MCP adapter plugin's default server, or ship a
   Tainacan-specific server with transport permissions scoped to Tainacan
   abilities.
6. **Artifact distribution.** Ship the manifest and skills inside the plugin
   (recommended, so they always match the installed version), or publish them as a
   separate companion repository that can be updated independently.
7. **Skill scope.** Seven focused skills as listed, or fewer and larger skills.
   Fewer, larger skills load faster but lose trigger precision.
