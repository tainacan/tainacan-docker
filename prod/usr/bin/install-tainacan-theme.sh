#!/bin/bash
COMMAND='wp --allow-root --path=/var/www/html'
echo "Tainacan installing themes"

if [ $(${COMMAND} theme is-installed tainacan-interface) ]; then
  echo "Update Tainacan interface"
  ${COMMAND} theme update tainacan-interface --activate
else
  echo "Install Tainacan interface"
  ${COMMAND} theme install tainacan-interface --activate
fi
