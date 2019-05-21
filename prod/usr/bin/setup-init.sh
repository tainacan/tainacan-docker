#!/bin/bash
set -e
docker-entrypoint.sh
directory_prefix='/var/www/html/wp-content/plugins/'
if [ ! -d "${directory_prefix}tainacan" ]; then
  url_tainacan='https://downloads.wordpress.org/plugin/tainacan.zip'
  wget --directory-prefix=${directory_prefix} ${url_tainacan}
  unzip -q ${directory_prefix}/tainacan.zip -d ${directory_prefix}
else
  echo -e "\e[33m The tainacan plugin folder has exist!"
fi
echo -e '\E[32;46m'
#apache2-foreground
