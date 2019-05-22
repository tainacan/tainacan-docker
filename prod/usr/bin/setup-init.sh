#!/bin/bash
set -e

wp_path='/var/www/html'
plugin_wp_path="${wp_path}/wp-content/plugins"
COMMAND='wp --allow-root --path=/var/www/html'

if [ -f "${wp_path}/wp-config.php" ]; then
  echo "define('DISABLE_WP_CRON', true);" >> ${wp_path}/wp-config.php
fi

if $(${COMMAND} core is-installed); then  
  install-tainacan-plugin.sh
  install-tainacan-theme.sh
  wp options set permalink_structure "/%year%/%monthnum%/%day%/%postname%/"
  wp rewrite flush
else
  echo "WP Core is not prepared, creating cache to tainacan plugin!"
  if [ ! -d "${plugin_wp_path}/tainacan" ]; then
    url_tainacan='https://downloads.wordpress.org/plugin/tainacan.zip'
    wget --directory-prefix=${plugin_wp_path} ${url_tainacan}
    unzip -q ${plugin_wp_path}/tainacan.zip -d ${plugin_wp_path}
    rm ${plugin_wp_path}/tainacan.zip
  else
    echo -e "The tainacan plugin folder has exist!"
  fi
fi

if [ "$(id -u)" = '0' ]; then
  user='www-data'
  group='www-data'
else
  user="$(id -u)"
  group="$(id -g)"
fi

chown -R $user:$group $wp_path

