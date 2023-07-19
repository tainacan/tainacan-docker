#!/bin/bash
set -e

file_env() {
   local var="$1"
   local fileVar="${var}_FILE"
   local def="${2:-}"

   if [ "${!var:-}" ] && [ "${!fileVar:-}" ]; then
      echo >&2 "error: both $var and $fileVar are set (but are exclusive)"
      exit 1
   fi
   local val="$def"
   if [ "${!var:-}" ]; then
      val="${!var}"
   elif [ "${!fileVar:-}" ]; then
      val="$(< "${!fileVar}")"
   fi
   export "$var"="$val"
   unset "$fileVar"
}

SITE_LANGUAGE=${SITE_LANGUAGE:-en_US}
SITE_URL=${SITE_URL:-http://localhost}
SITE_TITLE=${SITE_TITLE:-Tainacan}
SITE_ADMIN_USER=${SITE_ADMIN_USER:-tainacan}
SITE_ADMIN_EMAIL=${SITE_ADMIN_EMAIL:-tainacan@local.org}
file_env "SITE_ADMIN_PASSWORD"
SKIP_WP_INSTALL=${SKIP_WP_INSTALL:-true}

DB_NAME=${DBNAME:-tainacan}
DB_USER=${DB_USER:-tainacan}
file_env "DB_PSWD"
DB_HOST=${DB_HOST:-'tainacan_db:3306'} 

# Instalando o wp-cli
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

if $SKIP_WP_INSTALL; then
    echo "*** Skiped WordPress install"
else
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
        chown -R $APACHE_RUN_USER:$APACHE_RUN_GROUP $APACHE_DOCUMENT_ROOT
    else
        echo "WordPress already Installed"
    fi
fi

set -eo pipefail
/init
USER $APACHE_RUN_USER