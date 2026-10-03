# Very thin layer over the official WordPress php-fpm image.
#
# The official wordpress:php8.3-fpm image already bundles every PHP extension
# Tainacan needs (imagick, exif, gd, mbstring, curl, xml, zip, intl, mysqli), so
# nothing is compiled here. This layer adds Tainacan's PHP limits and WP-CLI.
#
# PHP is served by nginx (see dockerfiles/nginx/default.conf); this container
# listens on the FastCGI port 9000 and is not published to the host.

FROM wordpress:php8.3-fpm

# Tainacan PHP limits (see conf/tainacan.ini).
COPY conf/tainacan.ini /usr/local/etc/php/conf.d/zz-tainacan.ini

# WP-CLI.
#
# The official FPM image does not ship WP-CLI, so copy it from the official CLI
# image. That keeps the build offline and pinned to a known-good WP-CLI build.
#
# The phar is installed under /usr/local/lib and wrapped: `docker compose exec`
# runs as root by default, and WP-CLI refuses to run as root without
# --allow-root. The wrapper adds the flag only for uid 0, so both root execs and
# non-root invocations behave as expected. The `cli` service keeps using the
# genuine, unwrapped `wp` from the CLI image.
COPY --from=wordpress:cli-php8.3 /usr/local/bin/wp /usr/local/lib/wp-cli.phar
RUN set -eux; \
    printf '%s\n' \
      '#!/bin/sh' \
      'if [ "$(id -u)" = "0" ]; then exec php /usr/local/lib/wp-cli.phar --allow-root "$@"; fi' \
      'exec php /usr/local/lib/wp-cli.phar "$@"' \
      > /usr/local/bin/wp; \
    chmod +x /usr/local/bin/wp; \
    wp --version
