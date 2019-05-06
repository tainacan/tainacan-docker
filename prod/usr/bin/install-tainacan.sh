#!/bin/bash
COMMAND='wp --allow-root --path=/var/www/html'
echo "Tainacan Installing plugins and themes"

if [ $(${COMMAND} plugin is-installed tainacan) ]; then
  echo "Update Tainacan plugin"
  ${COMMAND} plugin update tainacan --activate
else
  echo "Install Tainacan plugin"
  ${COMMAND} plugin install tainacan --activate
fi

if [ $(${COMMAND} theme is-installed tainacan-interface) ]; then
  echo "Update Tainacan interface"
  ${COMMAND} theme update tainacan-interface
else
  echo "Install Tainacan interface"
  ${COMMAND} theme install tainacan-interface
fi
