---
type: episodic
tags: [docker, architecture, decision, nginx, php-fpm]
created: 2026-10-03
updated: 2026-10-03
source: investigation
confidence: high
status: active
related: [semantic/tainacan-plugin-lives-in-src, semantic/official-wordpress-image-bundles-tainacan-extensions, episodic/2026-10-03-compose-simplification, episodic/2026-10-03-plugin-only-stack]
---

# 2026-10-03 Replaced the build-copy pipeline with live mounts

**Context:** the repository shipped a custom `tainacan/php` image plus a build
container that cloned the plugin at start-up and copied the compiled result into
`wp-content/plugins/tainacan`. Edits were never live.

**Decision:** delete that pipeline and rebuild on official images, with the plugin
and theme sources bind-mounted and a builder container that writes assets back
into the same tree. Web tier is `wordpress:php8.3-fpm` behind nginx, at the
user's request. All automation moved into a single `Makefile`.

**Why:** the copy step was the obstacle to live PHP. Official images remove the
maintenance burden of custom PHP images, and the official image already carries
every extension Tainacan needs.

**Consequences:**

- The plugin and theme are mounted **read-only** for the web tier; only the
  builder has write access. This is the containment guarantee and it is
  intentional. (The `wpcli` service named here was later folded into
  `wordpress`; see `2026-10-03-compose-simplification`.)
- Watch mode polls instead of using inotify, because Docker on macOS does not
  deliver host filesystem events into Linux containers.
- Hardening constants are applied by `make setup` via `wp config set` rather than
  `WORDPRESS_CONFIG_EXTRA`, so they are verifiable in `wp-config.php`. The extra
  is evaluated at runtime by the image template, which `var_dump` cannot inspect.
- The old pipeline was deleted; `git status` shows the removals as `RD` entries.

**Follow-ups:** the first full `make setup` (npm ci + composer install + webpack)
was not executed end to end; only the toolchain was verified.
