# Develop with live reload

Work on the plugin with your edits appearing in the running site. This guide
assumes the stack is already running (`make up`) and that `make setup` has run
once.

## Change PHP and see it immediately

PHP is read straight from the bind mount, so there is nothing to build.

1. Edit any file under `tainacan/src/`, for example
   `tainacan/src/classes/repositories/class-tainacan-items.php`.
2. Save the file.
3. Reload the page in your browser.

If the change does not appear, confirm the file is really under `tainacan/src/`
and not elsewhere in the plugin repository. WordPress only loads `src/`.

## Rebuild CSS and JavaScript while you work

1. Start the watchers in a second terminal:

   ```sh
   make watch
   ```

2. Edit a `.scss` file under `tainacan/src/views/` or a `.js`/`.vue` file.
3. The watcher detects the change and recompiles. Reload the browser.

Watch mode polls every two seconds rather than using filesystem events, because
Docker on macOS does not forward inotify events into containers. A two-second
delay after saving is expected.

## Build assets once instead of watching

```sh
make assets         # development build
make assets-prod    # production build, minified, no source maps
```

## Run a single PHP file's tests

```sh
docker compose --profile watch run --rm --no-deps \
  -e WP_TESTS_DIR=/tmp/wp-tests/wordpress-tests-lib \
  builder sh -lc 'src/vendor/bin/phpunit tests/test-api-items.php'
```

## Open a shell in the running site

```sh
make shell                      # php-fpm container, has wp-cli
make wp ARGS="plugin list"      # wp-cli as www-data, best for writes
```

Use `make wp` for anything that writes to `wp-config.php`, so the file stays
owned by `www-data`.

## Point at an external plugin clone

By default the plugin comes from the `tainacan/` submodule. To develop against a
clone elsewhere on disk, edit `.env`:

```sh
TAINACAN_PLUGIN_PATH=/absolute/path/to/tainacan
```

Then recreate the containers:

```sh
make down && make up
```

Pass the repository root; the stack appends `/src` itself.

## Troubleshoot a change that does not appear

| Symptom | Fix |
|---|---|
| PHP edit invisible | confirm the file is under `tainacan/src/` |
| Styles unchanged | the watcher is not running, or the SCSS entry is not in `tainacan/compile-sass.sh` |
| `Read-only file system` | expected for the web tier; write through the builder or the database |
| Blank admin | assets are missing; run `make assets` |
