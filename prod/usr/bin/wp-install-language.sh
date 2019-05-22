#!/bin/bash

if test "$#" -ne 1; then
    echo "Illegal number of parameters"
    exit
fi

COMMAND='wp --allow-root --path=/var/www/html'
echo "Tainacan installing themes"

if $(${COMMAND} core is-installed); then  
  echo "Update Tainacan interface"
  ${COMMAND} language core install $1
else
  echo "The WP core not installed!!!!"
fi
