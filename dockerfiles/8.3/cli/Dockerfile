#####################################################
# Tainacan -  PHP 8.3 / CLI image 
#####################################################

FROM tainacan/docker-baseimage-s6-overlay-ubuntu:20.04

LABEL maintainer="Vinícius Nunes (@vnmedeiros)"

# Make sure we keep apt silent during installs. Set other defaults as well
ENV DEBIAN_FRONTEND=noninteractive \
    S6_BEHAVIOUR_IF_STAGE2_FAILS=2 \
    WEBUSER_HOME="/var/www/html" \
    PUID=9999 \
    PGID=9999

# Install Ondrej repos for Ubuntu focal, PHP8.3, composer and selected extensions
RUN apt-get update \
    && echo "Add the default, non-privileged user..." \
    && groupadd -r -g $PGID webgroup \
    && useradd --no-log-init -r -s /usr/bin/bash -d $WEBUSER_HOME -u $PUID -g $PGID webuser \
    && echo "Install the basic software dependencies..." \
    && apt-get install -y --no-install-recommends gnupg \
    && echo "deb http://ppa.launchpad.net/ondrej/php/ubuntu focal main" > /etc/apt/sources.list.d/ondrej-php.list \
    && apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 4F4EA0AAE5267A6C \
    && apt-get update \
    && apt-get -y --no-install-recommends install \
        ca-certificates \
        nano \
        curl \
        zip \
        unzip \
        ghostscript \
        php8.3-cli \
        php8.3-common \
        php8.3-curl \
        php8.3-gd \
        php8.3-mbstring \
        php8.3-mysql \
        php8.3-redis \
        php8.3-soap \
        php8.3-sqlite3 \
        php8.3-xml \
        php8.3-zip \
        php8.3-imagick \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

# Pull the official composer 2 image, and copy the composer executable from there
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy over S6 configurations
COPY etc/cont-init.d/ /etc/cont-init.d/

COPY etc/ImageMagick-6/policy.xml /etc/ImageMagick-6/policy.xml

# Set the default work directory to our web user
WORKDIR /var/www/html

#Configure S6 to drop priveleges
ENTRYPOINT ["/init"]

# Run PHP
CMD ["php", "-a"]