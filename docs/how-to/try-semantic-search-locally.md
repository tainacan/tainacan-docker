# Try semantic search locally

The console is a page in the normal Tainacan admin, so there is nothing to build
separately: it is served by the running stack.

```
http://localhost:8080/wp-admin/admin.php?page=tainacan_rag
```

Reach it from **Tainacan → Other → Semantic search**, or directly. Credentials come
from `.env` (`WP_ADMIN_USER` / `WP_ADMIN_PASSWORD`, `tainacan` / `tainacan` by
default).

## What renders without any configuration

The page reads stored state only. With no space defined you get:

- **Requirements** — the environment verdict. On this stack it reports `ready`,
  MariaDB 11.8.9 and a largest accepted dimension of 3072.
- **Spaces** — empty, plus the create form. `Create space` is disabled unless the
  verdict is ready.
- **Indexing** — queue depth by state, an inline drain button, a requeue button
  (disabled when nothing failed) and the recent failures with their reasons.
- **Coverage** — nothing to measure against until a space exists.
- **Search preview** — the form is there; submitting it without an active space
  returns `tainacan_rag_no_active_space` in the results area, which is the honest
  answer rather than an empty table.

That much is enough to check the panels, the layout and the empty states.

## Where credentials live

Nowhere in Tainacan. The Connector select on this page **is** the list of AI connectors
installed on the site, and each one's key lives in **Settings → Connectors**. A site
that wants a direct vendor key can still add OpenAI or Ollama through the
`tainacan_rag_register_embedding_providers` filter, but nothing in the plugin asks for
a secret.

The select reports `configured` or `not configured` per connector and never shows a
key. On this machine the WordPress AI plugin (1.5.0) is active with credentials, but
the `google` connector reports `not configured` until it is authenticated under
**Settings → Connectors**.

## Getting vectors in, so search actually returns something

1. Pick a **Connector**. The page reloads and asks that connector which embedding
   models it offers, then renders the **Model** field as a list of them.
2. If the connector reports no embedding model — which is the case for `google` on
   this stack — the Model field is free text and says so. The model id a connector
   accepts can still be typed, and a site that knows better can supply the list with
   the `tainacan_rag_connector_models` filter.
3. Set the **Dimension** the model produces: the space table is built for that number
   and cannot change without rebuilding the space.
4. Open **Settings → Connectors** and confirm the connector is authenticated.
5. Create the space, then create or open a collection with a couple of published items.
6. In **Coverage**, press `Start` for that collection, then `Queue next 50` — backfill
   only enqueues; it never embeds inside the request.
7. In **Indexing**, press `Process 5 items now` to drain the queue inline.
8. Watch the coverage row change from `0 of 2` to `2 of 2`, and the chunk count appear
   in the spaces table.
9. In **Search preview**, pick a collection from the select (or leave
   `All collections`), type a phrase from one of the item titles and submit. The result
   line reports items returned, candidates scanned and candidates dropped by
   visibility. Publish one item and leave another as a draft: the draft is scanned as a
   candidate and then dropped, which is the filter doing its job — and that number is
   the only place the fact is visible.

### If your WordPress AI build has no embeddings client

`embed()` reports `tainacan_rag_wordpress_ai_unavailable` and says so. Wire a client
from a small mu-plugin instead of patching the plugin:

```php
add_filter( 'tainacan_rag_wordpress_ai_embed', function ( $embedder, $inputs, $model ) {
	return function ( $inputs, $model ) {
		// Call your embeddings client here and return one float array per input.
		return my_client()->embed( $inputs, $model );
	};
}, 10, 3 );
```

A direct vendor provider is the other option:

```php
add_filter( 'tainacan_rag_register_embedding_providers', function ( $providers ) {
	$providers['openai'] = new \Tainacan\Rag\OpenAI_Provider();
	return $providers;
} );
```

## When something does not work

| Symptom | Cause |
|---|---|
| Failures reading `tainacan_rag_provider_not_configured` | that connector is not authenticated, or WordPress AI is inactive |
| Failures reading `tainacan_rag_wordpress_ai_unavailable` | this AI plugin version cannot embed and nothing supplies a client; see the snippet above |
| Failures reading `tainacan_rag_missing_model` | the space has no model; vectors from different models are not comparable, so none is assumed |
| Failures reading `tainacan_rag_provider_error` | the provider answered with an error; the message carries its own text |
| Failures reading `Space no longer exists.` | a queue row outlived its space. Deleting a space now clears its queue, so this only appears on rows created before that fix |
| Preview says `tainacan_rag_provider_paused` | the circuit breaker paused that provider and model after repeated failures; clear it from the Indexing panel |
| An item exists but never appears | check status. Only `publish` is returned to an anonymous reader, and a private item needs the reader to hold the collection's read capability |

If the queue stays at `pending 0 · failed 0` after pressing a button, the item had
nothing new to embed: chunk hashes are compared first, so an unchanged item costs
nothing.

## What this page does not do

- It does not edit credentials or vendor settings. Those belong to WordPress AI.
- It does not write anything on page load; every write is a nonce-protected form that
  redirects, so a refresh cannot repeat it.
- It does not show vectors. Storage is reported as chunk counts and byte estimates,
  never as a number you could plan capacity on without the estimate's basis.
