#!/bin/bash
COMMAND='wp --allow-root --path=/var/www/html'
echo "Tainacan Installing plugins"

if [ $(${COMMAND} plugin is-installed tainacan) ]; then
  echo "Update Tainacan plugin"
  ${COMMAND} plugin update tainacan --activate
else
  echo "Install Tainacan plugin"
  ${COMMAND} plugin install tainacan --activate
fi
