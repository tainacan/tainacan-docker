FROM wordpress

ENV TOOLS_DEPS \
        wget \
        curl \
        nano \
        git \
        unzip \
        cron \
        mysql-client \
        ghostscript

COPY ./usr/conf.d/php.config.ini /usr/local/etc/php/conf.d/php.config.ini

RUN apt-get update && apt-get install -y $TOOLS_DEPS
RUN apt-get update && apt-get install -y libmagickwand-dev --no-install-recommends
RUN docker-php-ext-enable imagick
RUN docker-php-ext-install exif
RUN docker-php-ext-enable exif

# Instalando o wp-cli
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

VOLUME /var/www/html/wp-content
VOLUME /var/www/html/wp-content/themes/
VOLUME /var/www/html/wp-content/plugins/
VOLUME /var/www/html/wp-content/uploads/

COPY ./usr/bin/install-tainacan-plugin.sh /usr/local/bin/install-tainacan-plugin.sh
COPY ./usr/bin/install-tainacan-theme.sh /usr/local/bin/install-tainacan-theme.sh
COPY ./usr/bin/update-tainacan-plugin.sh /usr/local/bin/update-tainacan-plugin.sh
COPY ./usr/bin/update-tainacan-theme.sh /usr/local/bin/update-tainacan-theme.sh
COPY ./usr/bin/wp-install-language.sh /usr/local/bin/wp-install-language.sh
COPY ./usr/bin/upgrade-wp.sh /usr/local/bin/upgrade-wp.sh
COPY ./usr/bin/setup-init.sh /usr/local/bin/setup-init.sh

RUN chmod +x /usr/local/bin/install-tainacan-plugin.sh
RUN chmod +x /usr/local/bin/install-tainacan-theme.sh
RUN chmod +x /usr/local/bin/update-tainacan-plugin.sh
RUN chmod +x /usr/local/bin/update-tainacan-theme.sh
RUN chmod +x /usr/local/bin/wp-install-language.sh
RUN chmod +x /usr/local/bin/upgrade-wp.sh
RUN chmod +x /usr/local/bin/setup-init.sh

RUN chown -R  www-data:www-data /var/www/html/wp-content/uploads/

EXPOSE 80

#CMD ["setup-init.sh"]
