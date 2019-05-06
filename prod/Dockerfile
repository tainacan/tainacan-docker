FROM wordpress

ENV TOOLS_DEPS \
        wget \
        curl \
        nano \
        git

COPY ./usr/conf.d/php.config.ini /usr/local/etc/php/conf.d/php.config.ini

RUN apt-get update && apt-get install -y $TOOLS_DEPS
RUN apt-get update && apt-get install -y libmagickwand-dev --no-install-recommends
RUN pecl install imagick && docker-php-ext-enable imagick

# Instalando o wp-cli
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

VOLUME /var/www/html/wp-content/themes/
VOLUME /var/www/html/wp-content/plugins/
VOLUME /var/www/html/wp-content/uploads/

COPY ./usr/bin/install-tainacan.sh /usr/local/bin/install-tainacan.sh
RUN chmod +x /usr/local/bin/install-tainacan.sh
RUN chown -R  www-data:www-data /var/www/html/wp-content/uploads/

EXPOSE 80
