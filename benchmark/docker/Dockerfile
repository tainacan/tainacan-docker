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
        subversion \
        vim \
        libpng-dev \
        inotify-tools \
        unzip
#npm \
#composer \

RUN apt-get update && apt-get install -y \
    $TOOLS_DEPS \    
    $RUBY_DEPS \
    libmemcached-dev zlib1g-dev && \
    docker-php-ext-install pdo pdo_mysql mysqli gd && \
    pecl install \
    xdebug-2.6.0 \
    memcached-3.0.4

RUN docker-php-ext-enable xdebug memcached

RUN a2enmod rewrite
 
ENV path="/var/www/html"
ENV url="localhost"

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php \
    && php -r "unlink('composer-setup.php');" \
    && mv composer.phar /usr/local/bin/composer

# Instalando o wp-cli
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp    

# Baixando e instalando o Wordpress
RUN chown -R www-data:www-data $path \
    && wp --allow-root core download --path="$path"

RUN mkdir $path/wp-content/uploads; \
    chown -R www-data:www-data $path/wp-content/uploads

RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - \
    && apt-get install -y nodejs \
    && curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update && apt-get install yarn \
    && gem install sass

RUN apt-get update && apt-get install -y libmagickwand-dev --no-install-recommends
RUN pecl install imagick && docker-php-ext-enable imagick

RUN wget -P $path/wp-content/plugins/ https://tainacan.org/wp-content/uploads/nightly-builds/tainacan-nightly.zip
RUN unzip $path/wp-content/plugins/tainacan-nightly.zip -d $path/wp-content/plugins/

COPY ./docker/conf/wp/wp-config.php $path/wp-config.php

EXPOSE 80
EXPOSE 443
