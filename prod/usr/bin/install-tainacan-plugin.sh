#!/bin/bash
COMMAND='wp --allow-root --path=/var/www/html'
echo "Tainacan Installing plugins"

if $(${COMMAND} plugin is-installed tainacan); then
  echo "Update Tainacan plugin"
  ${COMMAND} plugin update tainacan
  ${COMMAND} language plugin update tainacan 
else
  echo "Install Tainacan plugin"
  ${COMMAND} plugin install tainacan --activate
  ${COMMAND} rewrite flush
fi

echo "<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^tainacan-items/.*_x_\d+/.+$ - [F,L]
</IfModule>
" > /var/www/html/wp-content/uploads/.htaccess