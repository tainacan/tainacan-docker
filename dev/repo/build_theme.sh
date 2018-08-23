#!/bin/bash

cd /repo/tainacan-theme
cp /repo/confs_theme/build-config.cfg /repo/tainacan-theme/
./build.sh
chown -R www-data:www-data /var/www/html/wp-content/themes/
