---
type: episodic
tags: [docker, compose, simplification, decision]
created: 2026-10-03
updated: 2026-10-03
source: investigation
confidence: high
status: active
related: [episodic/2026-10-03-stack-rewrite, episodic/2026-10-03-plugin-only-stack]
---

# 2026-10-03 Reduced the stack from eight services to four

**Context:** `docker-compose.yml` defined db, wordpress, nginx, wpcli,
watch-plugin, watch-theme, adminer and mailhog. The user asked for a simpler
file and asked whether nginx, wpcli and adminer could be removed.

**Decision:**

- Removed `wpcli`. WP-CLI already lives in the `wordpress` image, so `make wp`
  now runs `docker compose exec -T -u 33 wordpress wp ...`.
- Removed `adminer` and `mailhog`. Both were profile-gated conveniences;
  `make db-shell` covers database access and nothing used MailHog.
- Merged `watch-plugin` and `watch-theme` into one `builder` service that mounts
  both repositories, builds both at start-up, and polls both trees.
- Kept php-fpm + nginx rather than collapsing to a single Apache container,
  because that preference was explicit and nginx cannot be dropped while PHP is
  served over FastCGI.

**Why:** fewer moving parts, exactly one service with write access to sources,
and no loss of capability. `make up` is now three containers.

**Consequences:**

- `make wp` requires the stack to be running, because it uses `exec` rather than
  `run`. `make setup` depends on `up`, so this is satisfied.
- The `builder` command is longer: it builds both repositories, then watches both
  in one polling loop.
- `ADMINER_PORT`, `MAILHOG_UI_PORT` and `MAILHOG_SMTP_PORT` were dropped from
  `.env.example`.
- Named volumes `tainacan_node_modules`, `theme_node_modules` and `wp_tests`
  remain; the removed services had none.
- The `cli`, `db-admin` and `mail` compose profiles no longer exist.

**Follow-ups:** none.
