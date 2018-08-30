FROM php:7.2.0-apache

ENV PHP_DEPS \
        pdo \
        pdo_mysql \
        mysqli \
        mbstring \
        curl \
        fpm \
        gd \
        mcrypt \
        imagick \
        xml

ENV RUBY_DEPS \
        ruby \
        ruby-dev

ENV TOOLS_DEPS \
        mysql-client \
        gnupg \
        wget \
        nmap \
        sudo \
        curl \
        nano \
        git \
        vim
#npm \
#composer \

RUN apt-get update && apt-get install -y \
    $TOOLS_DEPS \    
    $RUBY_DEPS \
    libmemcached-dev zlib1g-dev && \
    docker-php-ext-install pdo pdo_mysql mysqli && \
    pecl install \
    xdebug-2.6.0 \
    memcached-3.0.4
    
RUN docker-php-ext-enable xdebug memcached
 
ENV path="/var/www/html"
ENV url="localhost"

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php \
    && php -r "unlink('composer-setup.php');" \
    && mv composer.phar /usr/local/bin/composer

# install phpunit
RUN curl https://phar.phpunit.de/phpunit.phar -L > phpunit.phar \
  && chmod +x phpunit.phar \
  && mv phpunit.phar /usr/local/bin/phpunit \
  && phpunit --version

# Instalando o wp-cli
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp    

# Baixando o Wordpress
RUN chown -R www-data:www-data $path \
    && wp --allow-root core download --path="$path"
    #RUN wp config create --dbname=${WORDPRESS_DB} --dbuser=${WORDPRESS_DB_USER} --dbpass=${WORDPRESS_DB_PASSWORD} --dbhost=${WORDPRESS_DB_HOST} --allow-root \
    #    && wp core install --allow-root

RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - \
    && apt-get install -y nodejs \
    && curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install yarn \
    && gem install sass
    
COPY ./repo/ /repo/
COPY ./repo/confs_wp/wp-config.php /var/www/html/wp-config.php
RUN chmod +x /repo/build_plugin.sh /repo/build_theme.sh

EXPOSE 80
EXPOSE 443


