#!/bin/bash

cd /repo/tainacan/
cp /repo/confs_plugin/build-config.cfg /repo/tainacan/
./build.sh
chown -R www-data:www-data /var/www/html/wp-content/plugins/
