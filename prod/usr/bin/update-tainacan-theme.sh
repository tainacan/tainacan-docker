#!/bin/bash
COMMAND='wp --allow-root --path=/var/www/html'
echo "Tainacan update themes"

if [ $(${COMMAND} theme is-installed tainacan-interface) ]; then
  echo "Update Tainacan interface"
  ${COMMAND} theme update tainacan-interface
else
  echo "Tainacan theme not installed, please run: install-tainacan-theme"
fi
