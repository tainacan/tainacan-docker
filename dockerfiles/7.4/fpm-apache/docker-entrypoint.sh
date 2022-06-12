#!/bin/bash
set -e

SITE_LANGUAGE=${SITE_LANGUAGE:-en_US}
SITE_URL=${SITE_URL:-http://localhost}
SITE_TITLE=${SITE_TITLE:-Tainacan}
SITE_ADMIN_USER=${SITE_ADMIN_USER:-tainacan}
SITE_ADMIN_EMAIL=${SITE_ADMIN_EMAIL:-tainacan@local.org}
SITE_ADMIN_PASSWORD=${SITE_ADMIN_PASSWORD:-tainacan}

DB_NAME=${DBNAME:-tainacan}
DB_USER=${DB_USER:-tainacan}
DB_PSWD=${DB_PSWD:-tainacan}
DB_HOST=${DB_HOST:-'tainacan_db:3306'} 

# Instalando o wp-cli
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

if ! $(wp core is-installed --path=${APACHE_DOCUMENT_ROOT} --allow-root); then
    echo "WordPress not installed"
    echo "install WP (${APACHE_DOCUMENT_ROOT})"
    wp core download --locale=$SITE_LANGUAGE --path=${APACHE_DOCUMENT_ROOT} --allow-root
    wp config create --dbname=$DB_NAME --dbuser=$DB_USER --dbpass=$DB_PSWD --dbhost=$DB_HOST --locale=$SITE_LANGUAGE --path=${APACHE_DOCUMENT_ROOT} --skip-check --force --allow-root
    wp core install --url=$SITE_URL --title=$SITE_TITLE --admin_user=$SITE_ADMIN_USER --admin_email=$SITE_ADMIN_EMAIL --path=${APACHE_DOCUMENT_ROOT} --admin_password=$SITE_ADMIN_PASSWORD --allow-root
    wp rewrite structure '/%postname%/'  --path=${APACHE_DOCUMENT_ROOT} --allow-root
    wp rewrite flush --path=${APACHE_DOCUMENT_ROOT} --allow-root
    wp plugin install tainacan --activate --path=${APACHE_DOCUMENT_ROOT} --allow-root
    wp theme install tainacan-interface --path=${APACHE_DOCUMENT_ROOT} --activate --allow-root
    chown -R webuser:webgroup $APACHE_DOCUMENT_ROOT
else
    echo "WordPress already Installed"
fi

set -eo pipefail
/init