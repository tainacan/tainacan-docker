---
type: semantic
tags: [plugin, architecture, mounts, autoloader]
created: 2026-10-03
updated: 2026-10-03
source: investigation
confidence: high
status: active
related: [procedural/run-tainacan-phpunit]
---

# The Tainacan plugin is `<repo>/src`, not the repository root

WordPress loads the plugin from `tainacan/src/`. The repository root is the
development workspace (build scripts, composer, npm, tests). The main plugin file
is `tainacan/src/tainacan.php`, and the plugin declares `Version: 1.3.0`.

This is why the stack binds `<repo>/src` into `wp-content/plugins/tainacan` and
not the repository root, and why `make assets` compiles into `src/assets/js` and
`src/assets/css`.

**Evidence:** `tainacan/build.sh` rsyncs `src/*` into `$wp_plugin_dir`;
`tainacan/src/tainacan.php` carries the plugin header; `tainacan/composer.json`
sets `vendor-dir` to `src/vendor`.

**Verify by:** `ls tainacan/src/tainacan.php && grep -n 'wp_plugin_dir' tainacan/build.sh`.
