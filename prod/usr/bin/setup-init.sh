#!/bin/bash
set -e

bold=$(tput bold)
normal=$(tput sgr0)

wp_path='/var/www/html'
plugin_wp_path="${wp_path}/wp-content/plugins"
COMMAND='wp --allow-root --path=/var/www/html'

if [ -f "${wp_path}/wp-config.php" ]; then
  echo "define('DISABLE_WP_CRON', true);" >> ${wp_path}/wp-config.php
fi

if $(${COMMAND} core is-installed); then  
  install-tainacan-plugin.sh
  install-tainacan-theme.sh
  ${COMMAND} option set permalink_structure "/%year%/%monthnum%/%day%/%postname%/"
  ${COMMAND} rewrite flush
else
  echo "WP Core is not prepared, install WP core!"
  echo "what the ${bold}URL address${normal} of the new site?"
  read var_site_url
  echo "what the ${bold}title${normal} of the new site?"
  read var_site_title
  echo "what the ${bold}admin user${normal} of the new site?"
  read var_site_admin_user
  echo "what the admin user${bold}e-mail${normal}?"
  read var_site_admin_email
  ${COMMAND} core install --url=$var_site_url --title=$var_site_title --admin_user=$var_site_admin_user --admin_email=$var_site_admin_email

  install-tainacan-plugin.sh
  install-tainacan-theme.sh
  ${COMMAND} option set permalink_structure "/%year%/%monthnum%/%day%/%postname%/"
  ${COMMAND} rewrite flush
fi

if [ "$(id -u)" = '0' ]; then
  user='www-data'
  group='www-data'
else
  user="$(id -u)"
  group="$(id -g)"
fi

chown -R $user:$group $wp_path

