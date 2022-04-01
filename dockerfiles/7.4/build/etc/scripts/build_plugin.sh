#!/bin/bash

DIR="/src/tainacan/"
if  [[ ! -d "$DIR" ]]
then
    echo "Clone repository...."
    git clone https://github.com/tainacan/tainacan.git $DIR
    cd $DIR && git remote set-url origin git@github.com:tainacan/tainacan.git
fi

FILE_CFG="/src/tainacan/build-config.cfg"
if [[ ! -f "$FILE_CFG" ]]
then
    echo "importing 'build-config' configuration file ..."
    cp /src_base/cfg/plugin.build-config.cfg /src/tainacan/build-config.cfg
fi


cd /src/tainacan/
for i in "$@"
do
    case $i in
        --build)
            ./build.sh
        ;;
        --watch-build)
            ./build-watch.sh
        ;;
        --build-prod)
            ./build.sh --prod
        ;;
    esac
done