####################################################
# Tainacan -  PHP 7.4 / FPM image 
#####################################################

FROM tainacan/php:7.4-cli

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
RUN wget https://phar.phpunit.de/phpunit-6.5.7.phar \
 && chmod +x phpunit-6.5.7.phar \
 && mv phpunit-6.5.7.phar /usr/local/bin/phpunit \
 && phpunit --version

# install nodesource
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash \
    && apt-get install -y nodejs

RUN gem install sass

#clean
RUN apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

COPY etc/cfg/ /src_base/cfg/

COPY etc/scripts /src_base/scripts/

ENTRYPOINT ["/init" ]


