#!/bin/bash
COMMAND='wp --allow-root --path=/var/www/html'
echo "Tainacan update plugins"

if [ $(${COMMAND} plugin is-installed tainacan) ]; then
  echo "Update Tainacan plugin"
  ${COMMAND} plugin update tainacan --activate
else
  echo "Tainacan plugin not installed, please run: install-tainacan-plugin"
fi
