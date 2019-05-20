#!/bin/bash

for i in "$@"
do
    case $i in
        --cnt|--container)
            container="id_continer"
        ;;
    esac
done

echo "Container: " ${container};

for i in "$@"
do
    case $i in
        --install-plugin)
            echo "[INSTALL PLUGIN]"
            sudo docker exec -it ${container} sh install-tainacan-plugin
            exit
        ;;
        --install-theme)
            echo "[INSTALL THEME]"
            sudo docker exec -it ${container} sh install-tainacan-theme
            exit
        ;;
        --update-plugin)
            echo "[UPDATE PLUGIN]"
            sudo docker exec -it ${container} sh update-tainacan-plugin
            exit
        ;;
        --update-theme)
            echo "[UPDATE THEME]"
            sudo docker exec -it ${container} sh update-tainacan-theme
            exit
        ;;
        --upgrade-wp)
            echo "[UPGRADE WP]"
            sudo docker exec -it ${container} sh upgrade-wp
            exit
        ;;       
        --help)
            echo "
            --install-plugin 
            --install-theme
            --update-plugin
            --update-theme
            --upgrade-wp
            --help        =  displays this help message
            "
            exit
        ;;
    esac
done
echo "opção invalida, para ajuda: --help"
