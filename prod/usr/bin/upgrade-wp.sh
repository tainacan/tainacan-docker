#!/bin/bash
COMMAND='wp --allow-root --path=/var/www/html'

if [ $(${COMMAND} core is-installed) ]; then
  ${COMMAND} core update
else
  echo "The WP core not installed!!!!"
fi
