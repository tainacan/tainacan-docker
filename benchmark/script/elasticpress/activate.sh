#!/bin/bash
COMMAND='wp --allow-root --path=/var/www/html'

#if [ $(${COMMAND} plugin is-installed elasticpress) ]; then
  echo "activate elasticpress plugin"
  ${COMMAND} plugin activate elasticpress
#else
#  echo "Install elasticpress plugin"
  #${COMMAND} plugin install elasticpress --activate
#fi
