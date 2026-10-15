# Asset builder for the Tainacan plugin and theme.
#
# It carries only what the upstream build scripts need:
#   - Node (webpack, sass, clean-css)
#   - PHP CLI 8.3 + Composer (composer install writes src/vendor). The CLI must
#     match the wordpress:php8.3-fpm runtime: some locked dependencies (for
#     example maennchen/zipstream-php) require PHP ^8.3.
#     php8.3-mysqli is required by the WordPress test bootstrap (wpdb), and
#     php8.3-xml/mbstring/intl by PHPUnit and the plugin test suite.
#   - rsync (used by the plugin build.sh)
#   - inotify-tools (present so build-watch.sh can be reused, though the
#     compose watchers poll instead, because macOS does not deliver inotify
#     events across the Docker file-sharing boundary)
#   - subversion: tests/bin/install-wp-tests.sh checks out the WordPress test
#     library with `svn co`; without it the wp_tests volume is left half built.
#   - default-mysql-client: the same script creates the test database with
#     `mysqladmin`; without it the database is never created.

FROM node:22-bookworm-slim

# Debian bookworm ships PHP 8.2, which is too old for the plugin's locked
# dependencies. Install PHP 8.3 from the Sury repository so the builder matches
# the WordPress runtime.
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends ca-certificates curl gnupg; \
    curl -fsSL https://packages.sury.org/php/apt.gpg \
        -o /usr/share/keyrings/sury-php.gpg; \
    echo "deb [signed-by=/usr/share/keyrings/sury-php.gpg] https://packages.sury.org/php/ bookworm main" \
        > /etc/apt/sources.list.d/sury-php.list; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        php8.3-cli \
        php8.3-mbstring \
        php8.3-xml \
        php8.3-zip \
        php8.3-gd \
        php8.3-curl \
        php8.3-intl \
        php8.3-mysqli \
        rsync \
        inotify-tools \
        unzip \
        git \
        subversion \
        default-mysql-client; \
    rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /repo
