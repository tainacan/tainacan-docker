####################################################
# Tainacan -  PHP 8.3 / FPM image 
#####################################################

FROM tainacan/php:8.3-cli

LABEL maintainer="Vinícius Nunes (@vnmedeiros)"

ENV RUBY_DEPS \
    ruby-full \ 
    rubygems \
    autogen \
    autoconf \
    libtool \
    make

ENV TOOLS_DEPS \
    build-essential \
    wget \
    mariadb-client \
    gnupg \
    nmap \
    curl \
    nano \
    git \
    subversion \
    vim \
    libpng-dev \
    inotify-tools \
    cron \
    rsync \
    grsync \
    ghostscript \
    python

RUN apt-get update -y \
    && apt-get install -y \
    $TOOLS_DEPS \    
    $RUBY_DEPS

# install phpunit
RUN wget https://phar.phpunit.de/phpunit-9.6.16.phar \
 && chmod +x phpunit-9.6.16.phar \
 && mv phpunit-9.6.16.phar /usr/local/bin/phpunit \
 && phpunit --version

# install nodesource
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash \
    && apt-get install -y nodejs

# RUN gem install sass
RUN npm install -g sass@1.58.3

#clean
RUN apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

COPY etc/cfg/ /src_base/cfg/

COPY etc/scripts /src_base/scripts/

ENTRYPOINT ["/init" ]


