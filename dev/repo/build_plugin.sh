#!/bin/bash

cd /repo/tainacan/
cp /repo/confs_plugin/build-config.cfg /repo/tainacan/

for i in "$@"
do
    case $i in
        --build*)
            ./build.sh
        ;;
        --watch-build*)
            ./build-watch.sh
        ;;
    esac
done

chown -R www-data:www-data /var/www/html/wp-content/plugins/
