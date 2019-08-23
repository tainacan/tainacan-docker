#!/bin/bash
set -e

bold=$(tput bold)
normal=$(tput sgr0)

wp_path='/var/www/html'
plugin_wp_path="${wp_path}/wp-content/plugins"
COMMAND='wp --allow-root --path=/var/www/html'

# if [ -f "${wp_path}/wp-config.php" ]; then
#   echo "define('DISABLE_WP_CRON', true);" >> ${wp_path}/wp-config.php
# fi

if $(${COMMAND} core is-installed); then  
  echo "WordPress already Installed"
else
  echo "WP Core is not prepared, install WP core!"
  echo "what is the ${bold}URL address${normal} of the new site (with http)?"
  read var_site_url
  echo "what is the ${bold}title${normal} of the new site?"
  read var_site_title
  echo "what is the ${bold}admin username${normal} of the new site?"
  read var_site_admin_user
  echo "what is the admin user ${bold}e-mail${normal}?"
  read var_site_admin_email
  echo "what is the language of the site (e.g. pt_BR) [en_US]?"
  read var_site_language
  ${COMMAND} core install --url=$var_site_url --title=$var_site_title --admin_user=$var_site_admin_user --admin_email=$var_site_admin_email
fi

var_site_language=${var_site_language:-en_US}

wp-install-language.sh ${var_site_language}
install-tainacan-plugin.sh
install-tainacan-theme.sh
${COMMAND} language plugin install ${var_site_language} --all
${COMMAND} option set permalink_structure "/%year%/%monthnum%/%day%/%postname%/"
${COMMAND} rewrite flush


if [ "$(id -u)" = '0' ]; then
  user='www-data'
  group='www-data'
else
  user="$(id -u)"
  group="$(id -g)"
fi

chown -R $user:$group $wp_path

