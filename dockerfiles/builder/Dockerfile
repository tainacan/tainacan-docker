# Asset builder for the Tainacan plugin and theme.
#
# It carries only what the upstream build scripts need:
#   - Node (webpack, sass, clean-css)
#   - PHP CLI + Composer (composer install writes src/vendor)
#   - rsync (used by the plugin build.sh)
#   - inotify-tools (present so build-watch.sh can be reused, though the
#     compose watchers poll instead, because macOS does not deliver inotify
#     events across the Docker file-sharing boundary)

FROM node:22-bookworm-slim

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        php-cli \
        php-mbstring \
        php-xml \
        php-zip \
        php-gd \
        php-curl \
        php-intl \
        rsync \
        inotify-tools \
        unzip \
        git; \
    rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /repo
