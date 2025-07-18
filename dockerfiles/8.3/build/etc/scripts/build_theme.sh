#!/bin/bash

DIR="/src/tainacan-theme/"
if  [[ ! -d "$DIR" ]]
then
    echo "Clone repository...."
    git clone https://github.com/tainacan/tainacan-theme.git $DIR
    cd $DIR && git remote set-url origin git@github.com:tainacan/tainacan-theme.git
fi

FILE_CFG="/src/tainacan-theme/build-config.cfg"
if [[ ! -f "$FILE_CFG" ]]
then
    echo "importing 'build-config' configuration file ..."
    cp /src_base/cfg/theme.build-config.cfg /src/tainacan-theme/build-config.cfg
fi

cd /src/tainacan-theme
./build.sh
