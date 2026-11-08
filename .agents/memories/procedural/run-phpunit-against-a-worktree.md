---
type: procedural
tags: [testing, phpunit, worktree, builder, docker, branches]
created: 2026-11-08
updated: 2026-11-08
source: investigation
confidence: high
status: active
related: [procedural/run-tainacan-phpunit, semantic/tainacan-plugin-lives-in-src]
---

# How to run the plugin tests against a git worktree

**When:** you keep several fix branches of the plugin in separate worktrees
(`git -C tainacan worktree add <path> -b fix/x upstream/develop`) and want to
test one of them without touching the submodule checkout the stack mounts.

The `builder` service mounts `./tainacan` as `/repo`. Override that mount for a
one-off run and reuse the main checkout's Composer vendor and test config so the
worktree needs neither `composer install` nor a copied `bootstrap-config.php`:

    D=/home/you/dev/tainacan-docker; WT=/path/to/worktree
    docker compose -f $D/docker-compose.yml --project-directory $D --profile watch \
      run --rm --no-deps \
      -v $WT:/repo \
      -v $D/tainacan/src/vendor:/repo/src/vendor \
      -v $D/tainacan/tests/bootstrap-config.php:/repo/tests/bootstrap-config.php:ro \
      -e WP_TESTS_DIR=/tmp/wp-tests/wordpress-tests-lib \
      builder sh -lc 'cd /repo && src/vendor/bin/phpunit --filter "Test_Migrations"'

**Expected:** the suite boots from the worktree's `src/` and `tests/`, the
`wp_tests` volume already holds the WordPress test library (first `make test`
installs it), and a filtered run takes 10–90 s.

**Gotchas:**

- Run worktrees one at a time. Every run shares the `tainacan_test` database;
  parallel runs collide.
- Use absolute paths everywhere (`-f`, `--project-directory`, mounts). The
  shell's working directory is not reliable across tool calls, and a relative
  `$PWD/tainacan/src/vendor` mounted from the wrong directory yields
  `src/vendor/bin/phpunit: not found`.
- Mounting `bootstrap-config.php` read-only beats copying it: nothing to clean
  up in the worktree afterwards (`git status` stays clean).
- Tests that run DDL (`ALTER TABLE`) commit implicitly and escape the
  per-test transaction; make them restore the schema themselves.
- Direct SQL writes in a test are invisible to `get_post_meta()` until
  `wp_cache_flush()`.
- `--filter` matches class and method names, not file names
  (see `run-tainacan-phpunit`).
