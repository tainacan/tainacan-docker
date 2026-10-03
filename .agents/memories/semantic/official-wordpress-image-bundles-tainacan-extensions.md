---
type: semantic
tags: [docker, php, extensions, imagick]
created: 2026-10-03
updated: 2026-10-03
source: tool-output
confidence: high
status: active
related: [episodic/2026-10-03-stack-rewrite]
---

# The official WordPress PHP image already has every Tainacan extension

`wordpress:php8.3-fpm` (and `php8.3-apache`) ships `imagick`, `exif`, `gd`,
`mbstring`, `curl`, `xml`, `zip` and `intl`. Do not add a compile layer for them.

An earlier plan added `pecl install imagick` plus `docker-php-ext-install exif`;
the build failed with `install failed` because `pecl` reported
"imagick is already installed and is the same as the released version 3.8.1".
The Dockerfile was reduced to copying `conf/tainacan.ini` and installing WP-CLI.

**Evidence:** `docker run --rm wordpress:php8.3-fpm php -m` lists all of the
above; the failing build log said `perl/imagick ... already installed`.

**Verify by:** `docker run --rm wordpress:php8.3-fpm php -r 'var_dump(extension_loaded("imagick"), extension_loaded("exif"));'`
