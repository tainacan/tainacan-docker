---
name: tainacan-build-and-assets
description: Use when building, compiling or debugging Tainacan front-end and PHP dependencies. Triggers on "npm", "webpack", "sass", "scss", "composer", "vendor", "assets", "make assets", "make watch", "build.sh", "enqueue", "styles not loading", "JS error in admin", "chunk", "production build".
---

# Tainacan build and assets

## What gets built

| Output | Produced by | Consumed by |
|---|---|---|
| `src/vendor/` | `composer install` (vendor-dir is `src/vendor`) | PHP runtime, phpunit, phpcs |
| `src/assets/js/*.js` | webpack (`npm run build` / `build-prod`) | `wp_enqueue_script` |
| `src/assets/css/*.css` | `sass` via `compile-sass.sh` | `wp_enqueue_style` |
| `src/style.css` (plugin variants) | `compile-sass.sh` | admin pages |

All of these are gitignored in the plugin repository. They are build output; never
edit them by hand.

## Build entry points

Prefer the container targets so the toolchain is identical for everyone:

```sh
make assets        # development build of the plugin
make assets-prod   # production build
make watch         # rebuild on change (polling, macOS-safe)
```

`make assets` runs the upstream `./build.sh` inside the `builder` image, which
does, in order and gated by md5 checksums so it skips unchanged steps:

1. `npm ci` when `package.json` / `package-lock.json` changed
2. `composer install` when `composer.json` changed (adds `--no-dev` for `--prod`)
3. `sh compile-sass.sh` when any `.scss` changed
4. `npm run build` or `npm run build-prod` when any `.js`/`.vue` changed
5. an `rsync` publish step to a throwaway path (harmless in this stack)

## Webpack

`webpack.common.js` defines the entries (admin pages, Gutenberg blocks, dashboard,
command palette) and outputs to `src/assets/js/`, with `publicPath`
`./wp-content/plugins/tainacan/assets/js/`. Development builds use
`webpack.dev.js`, production uses `webpack.prod.js` (minified, `.js.map` removed).

Vue 3 SFCs, Babel, PostCSS and Sass loaders are configured. `sass` is resolved
from `node_modules`.

## Sass

`compile-sass.sh` compiles a fixed list of entry files into
`src/assets/css/*.css` (admin, roles, dashboard, settings, pages, each Gutenberg
block, etc.) and prints progress. Adding a new SCSS entry means adding a line
there; it is not a directory-wide glob.

## WordPress enqueueing

Assets are registered with `TAINACAN_VERSION` for cache busting. When you add a
webpack entry, also add the corresponding `wp_enqueue_script`/`wp_enqueue_style`
call and declare dependencies. If a style is missing in the browser, check the
enqueue registration before blaming the build.

## Performance notes

- `node_modules` lives in a Docker named volume, not on the host bind mount,
  because macOS file-sharing makes module I/O slow. Do not move it.
- Watch mode polls; it is intentionally not inotify-based (see the
  dev-environment skill).
- `make assets-prod` also strips `.js.map` and development-only PHP files.

## Debugging

- **Admin JS errors after a pull.** Dependencies may have changed. `make assets`
  rebuilds; if `package-lock.json` changed it runs `npm ci`.
- **`vendor/` missing.** `composer install` has not run; `make assets` does it.
- **Sass complains about a missing file.** Confirm the path exists; the script
  compiles an explicit list, so a renamed file needs a script edit.
- **Changes not visible.** The watcher is polling; a `.scss` or `.js` save should
  trigger within a couple of seconds. Check `make logs` for the builder output.

## Pitfalls

- Do not commit `src/vendor`, `src/assets/js`, `src/assets/css`, or `src/style.css`;
  they are ignored upstream and belong to the build.
- Do not run npm or composer as root on the host; use the container targets so
  file ownership stays consistent.
- The plugin is mounted read-only in the web container, so runtime code must not
  attempt to write into `src/`.
