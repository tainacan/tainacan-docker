#!/bin/bash

docker exec -it tainacan-dev sh /src/build_theme.sh
for i in "$@"
do
    case $i in
        --build)
            docker exec -it tainacan-dev sh -c "/src/build_plugin.sh --build"
        ;;
        --watch-build)
            docker exec -it tainacan-dev sh -c "/src/build_plugin.sh --watch-build"
        ;;
        --build-prod)
            docker exec -it tainacan-dev sh -c "/src/build_plugin.sh --build-prod"
        ;;
    esac
done


