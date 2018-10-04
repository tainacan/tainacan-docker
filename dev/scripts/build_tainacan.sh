#!/bin/bash

docker exec -it wordpress_tainacan sh /repo/build_theme.sh
for i in "$@"
do
    case $i in
        --build*)
            docker exec -it wordpress_tainacan sh -c "/repo/build_plugin.sh --build"
        ;;
        --watch-build*)
            docker exec -it wordpress_tainacan sh -c "/repo/build_plugin.sh --watch-build"
        ;;
    esac
done


