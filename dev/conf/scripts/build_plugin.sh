#!/bin/bash
cd /src/tainacan/
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
