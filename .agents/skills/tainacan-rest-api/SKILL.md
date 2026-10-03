---
name: tainacan-rest-api
description: Use when adding, changing, testing or calling Tainacan REST endpoints. Triggers on "REST API", "endpoint", "tainacan/v2", "register_routes", "permission_callback", "wp-json", "exposer", "OAI-PMH", "paginate", "metaquery", "API controller", "application password", "nonce".
---

# Tainacan REST API

## Namespace and shape

- Namespace: `tainacan/v2` (constant `TAINACAN_REST_NAMESPACE` in
  `src/classes/api/tainacan-rest-creator.php`).
- Base URL: `http://localhost:8080/wp-json/tainacan/v2/...`
- Controllers live in `src/classes/api/endpoints/` and extend
  `Tainacan\API\Rest_Controller`, which sets `$this->namespace` and calls
  `register_routes()` on `rest_api_init`.

## Existing controllers (one per resource)

`collections`, `items`, `item-metadata`, `metadata`, `metadata-types`,
`metadata-sections`, `metadatum-mappers`, `taxonomies`, `terms`, `filters`,
`filter-types`, `facets`, `logs`, `roles`, `reports`, `exporters`, `importers`,
`background-processes`, `bulkedit`, `exposers`, `sequence-edit`, and `oai`.

## Adding an endpoint

1. Create `src/classes/api/endpoints/class-tainacan-rest-<resource>-controller.php`.
2. Declare the class in the `Tainacan\API\EndPoints` namespace.
3. Extend `Rest_Controller`.
4. Implement `register_routes()` using `register_rest_route()` with
   `methods`, `callback`, `permission_callback` and `args` (with `validate_callback`
   and `sanitize_callback`).
5. Provide explicit `permission_callback` on every route. Never leave it open.
6. Instantiate the controller so its routes register. Controllers are wired in
   the API creator; follow the pattern used by an existing controller.

Skeleton:

```php
namespace Tainacan\API\EndPoints;

class Rest_My_Resource_Controller extends \Tainacan\API\Rest_Controller {
    protected function __construct() {
        $this->rest_base = 'my-resource';
        parent::__construct();
    }

    public function register_routes() {
        register_rest_route($this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_items'],
                'permission_callback' => [$this, 'get_items_permissions_check'],
            ],
        ]);
    }
}
```

## Capabilities and permissions

Reuse the capability set from `Tainacan\Roles` (for example `tainacan_edit_items`,
`tainacan_read_private_items`). Permission callbacks should return `true`,
`false`, or a `WP_Error` with the right status.

## Querying items

The items endpoint supports paging and Tainacan-specific filters:

- `page`, `perpage` (capped by `TAINACAN_API_MAX_ITEMS_PER_PAGE`)
- `metaquery` and `taxquery` for faceted filtering
- `orderby`, `order`, `search`, `fetch_only`

Batch limits: `TAINACAN_API_MAX_BATCH_TERMS` (default 200) caps bulk term
operations.

## Calling the API

```sh
# Read public data
curl -s 'http://localhost:8080/wp-json/tainacan/v2/collections' | jq

# Authenticated write via application password
curl -s -u 'tainacan:APP PASSWORD' \
  -X POST 'http://localhost:8080/wp-json/tainacan/v2/collections' \
  -H 'Content-Type: application/json' \
  -d '{"name":"My collection","status":"publish"}'
```

Inside the browser, WordPress cookie auth requires the `X-WP-Nonce` header with a
nonce from `wp_create_nonce('wp_rest')`.

## Exposers and formats

Readers can request alternative representations through the exposers layer
(`Tainacan\Exposers`): JSON, HTML, CSV, XML, TXT, JSON-LD and OAI-PMH. OAI-PMH is
served as raw XML at `/wp-json/tainacan/v2/oai` through `rest_pre_serve_request`.

## Mappers

`Tainacan\Mappers` maps Tainacan metadata to standards (Dublin Core and others)
so exposed records validate against known schemas. When adding metadata that must
map, add a mapper entry rather than hardcoding output in a controller.

## Testing endpoints

Use the REST test base class from the testing skill. In tests, prefer
`$this->factory->...` and `rest_do_request()` over real HTTP.

## Pitfalls

- `permission_callback` is mandatory in modern WordPress; omitting it triggers a
  `_doing_it_wrong` notice.
- Return `WP_REST_Response` / `WP_Error`, not raw arrays, when you need control
  over the status code.
- Sanitise every input in `args`; do not trust `$request->get_param()` directly.
- Endpoint classes must be reachable by the Tainacan autoloader (filename and
  namespace matter). See the plugin-architecture skill.
