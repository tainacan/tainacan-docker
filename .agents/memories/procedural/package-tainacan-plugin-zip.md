---
type: procedural
tags: [build, package, zip, wordpress, make]
created: 2026-10-15
updated: 2026-10-15
source: investigation
confidence: high
status: active
related: [semantic/tainacan-plugin-lives-in-src]
---

# Package an installable Tainacan zip

**When:** a production plugin zip is needed for another WordPress site or a release check.

```sh
make package
```

**Expected:** `dist/tainacan.zip` (gitignored), with `tainacan/tainacan.php` at the archive root, no `.vue` files, no `.js.map` files, and no `vendor/phpunit`. The plugin tree is not left on the host.

**Gotchas:**

- `make assets-prod` does not keep this tree. `build.sh` rsyncs to `/tmp/tainacan-dist` inside a container that `--rm` deletes. `make package` zips that path before the container exits and writes only `dist/tainacan.zip`.
- Do not bind-mount the package tree onto the host. The builder runs as root, so every directory it creates is root-owned and the host user cannot `rm -rf` it. A different host folder has the same problem. `dist/` itself stays owned by the user, so replacing the zip does not need `chown`.
- Zipping an absolute path stores `home/.../tainacan.php`. WordPress then reports that it found no valid plugin file.
- The target deletes `tainacan/last-*` inside the builder so `./build.sh --prod` runs `composer install --no-dev`. It runs `composer install` again afterwards so `src/vendor` keeps development packages.
- Compiled files left in `tainacan/src/assets` are the production build. `make assets` restores a development build.
