#!/bin/bash
COMMAND='wp --allow-root --path=/var/www/html'

#if [ $(${COMMAND} plugin is-installed elasticpress) ]; then
  echo "deactivate elasticpress plugin"
  ${COMMAND} plugin deactivate elasticpress
#else
#  echo "Install elasticpress plugin"
  #${COMMAND} plugin install elasticpress
#fi

