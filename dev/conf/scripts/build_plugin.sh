#!/bin/bash
cd /src/tainacan/
for i in "$@"
do
    case $i in
        --build)
            ./build.sh
        ;;
        --build-prod)
            ./build.sh --prod
        ;;
        --watch-build*)
            ./build-watch.sh
        ;;
    esac
done
