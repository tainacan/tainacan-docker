---
type: semantic
tags: [background-process, docker, loopback, env-vars, importer, exporter]
created: 2026-10-15
updated: 2026-10-15
source: investigation
confidence: high
status: active
related: [episodic/2026-10-15-importer-source-file-retry-fix, procedural/run-tainacan-phpunit]
---

# Tainacan background processes need an internal loopback URL in the stack

Tainacan runs imports, exports and bulk edit as background processes whose queue
lives in `wp_tnc_bg_process`. To start work they dispatch an HTTP request back to
the site (`wp-admin/admin-ajax.php`, action `tnc-bg_<action>`). Inside this stack
`WP_SITE_URL`/`home` is `http://localhost:8080`, a host-published port that is
**not reachable from inside the `wordpress` container**, so the dispatch fails
silently and every process stays in `status = waiting`, `processed_last =
0000-00-00 00:00:00`, with no log file under `wp-content/uploads/tainacan/`.

The plugin supports `TAINACAN_BG_PROCESS_LOOPBACK_URL` for exactly this case
(`Async_Request::get_query_url()`), so the stack must set it to the internally
reachable nginx service: `TAINACAN_BG_PROCESS_LOOPBACK_URL=http://nginx`.

**Evidence:** `tainacan/src/classes/background-process/class-tainacan-async-request.php`
(`get_query_url()`); with the constant unset
`curl http://localhost:8080/wp-cron.php` from the `wordpress` container returns
"Failed to connect", while `curl http://nginx/wp-cron.php` returns 200 and
`http://nginx/wp-admin/admin-ajax.php` returns 403 (the expected nonce failure,
i.e. PHP ran). After setting the constant, a stuck exporter row moved from
`waiting` to `finished` (progress 100) on the next dispatch.

WP-Cron is also request-driven here (no cron daemon), and `spawn_cron()` uses
`site_url()`, so scheduled events (including the background-process watchdog) do
not fire on their own. `make cron` runs them once.

**Verify by:**
```sh
docker compose exec -T wordpress curl -sS -m 5 -o /dev/null -w '%{http_code}\n' http://nginx/wp-cron.php
make wp ARGS="config get TAINACAN_BG_PROCESS_LOOPBACK_URL --type=constant"
docker compose exec -T db mariadb -uroot -ptainacan tainacan -e "SELECT ID,action,status,done,processed_last FROM wp_tnc_bg_process ORDER BY ID DESC LIMIT 5;"
```

Re-apply on an existing install with `make bg-loopback`; `make setup` sets it for
new installs.
