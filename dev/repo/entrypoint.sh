#!/bin/bash
set -e

#Instalando e configurando o plugin do Tainacan
cd /src/tainacan/
cp /src/confs_plugin/build-config.cfg /src/tainacan/
./build.sh
chown -R www-data:www-data /var/www/html/wp-content/plugins/

#Instalando e configurando o tema do Tainacan
cd /src/tainacan-theme \
cp /src/confs_theme/build-config.cfg /src/tainacan-theme/ \
./build.sh \
chown -R www-data:www-data /var/www/html/wp-content/themes/
