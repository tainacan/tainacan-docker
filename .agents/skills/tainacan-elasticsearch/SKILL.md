---
name: tainacan-elasticsearch
description: Use when enabling, configuring, debugging or indexing Tainacan with Elasticsearch. Triggers on "elasticsearch", "elasticpress", "make up-elastic", "search engine", "index", "facets slow", "vm.max_map_count", "9200", "cluster health", "reindex", "Search_Engine", "integrations".
---

# Tainacan and Elasticsearch

Tainacan can serve faceted search from MySQL or from Elasticsearch. Elasticsearch
is optional and off by default.

## Starting it

```sh
make up-elastic
```

This merges `docker-compose.elastic.yml` and starts an Elasticsearch 8.15 single
node with security disabled, plus a named `es_data` volume. It is reachable from
WordPress at `http://elasticsearch:9200`.

Check it:

```sh
curl -s http://localhost:9200/_cluster/health | jq
```

On Linux, Elasticsearch needs `vm.max_map_count >= 262144`:

```sh
sudo sysctl -w vm.max_map_count=262144
```

The Docker Desktop VM on macOS usually already satisfies this.

## How the integration works

- `src/classes/class-tainacan-search-engine.php` is the engine abstraction that
  decides whether queries go to MySQL or to the indexed engine.
- `src/classes/integrations/class-tainacan-elastic-press.php` adapts Tainacan to
  ElasticPress. `class-tainacan-elastic-press-lte4.php` is the variant for
  ElasticPress 4 and older.
- Tainacan does not require the ElasticPress admin UI; the integration is wired
  through Tainacan's own settings.

## Enabling it

1. Start the service: `make up-elastic`.
2. In the Tainacan admin, enable the Elasticsearch/ElasticPress engine in the
   settings and point the host at `elasticsearch:9200`.
3. Index the content. Depending on the integration path this is either the
   Tainacan reindex action or an ElasticPress index command; follow the setting
   screen.

From the CLI:

```sh
make wp ARGS="option get tainacan_search_engine"
make wp ARGS="plugin list"
```

## Verifying

- Cluster health is `yellow` or `green`.
- Faceted search returns results and filters narrow them.
- Compare a filtered query before and after enabling; counts should match MySQL.

## Version compatibility

The stack ships Elasticsearch 8.15. Tainacan's ElasticPress integration has
historically been validated against Elasticsearch 7.x, and ElasticPress added
ES 8 support later. If the integration reports version incompatibilities, change
the image tag in `docker-compose.elastic.yml` to a 7.17.x release:

```yaml
image: docker.elastic.co/elasticsearch/elasticsearch:7.17.24
```

The `-lte4` integration class exists precisely to cover older ElasticPress
versions, so the codebase already expects version variance.

## Backing out

Stop the service and disable the engine in Tainacan settings. Search falls back
to MySQL. To also delete the index data:

```sh
make down
docker volume rm tainacan-docker_es_data
```

## Pitfalls

- Indexing is asynchronous; a change is not searchable until the index catches up.
- Re-index after bulk imports, or facets will be stale.
- `es_data` is a separate volume from `db_data`; `make reset` removes both.
- Security is disabled for development. Do not reuse this configuration anywhere
  reachable.
- Elasticsearch memory: the override pins `ES_JAVA_OPTS` to 512m. Raise it in
  `docker-compose.elastic.yml` if you index large collections.
