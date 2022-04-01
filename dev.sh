#!/bin/bash

function fn_stop {
    echo "[STOP TAINACAN]"
    sudo docker-compose -f docker-compose.yml down
    sudo docker-compose -f docker-compose.dev.yml down
    sudo docker-compose -f docker-compose.nginx.yml down
    sudo docker-compose -f docker-compose.dev.elastic.yml down
}

function fn_start {
    echo "[START TAINACAN]"
    sudo docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
    sudo docker exec -it tainacan_build sh -c "/src_base/scripts/build_plugin.sh --build"
    sudo docker exec -it tainacan_build sh -c "/src_base/scripts/build_theme.sh"
}

for i in "$@"
do
    case $i in
        --build-image)
            echo "[BUILD IMAGE]"
            sudo docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
            exit
        ;;
        --build-image-nginx)
            echo "[BUILD IMAGE] WITH NGINX"
            sudo docker-compose -f docker-compose.nginx.yml -f docker-compose.dev.yml docker-compose -f build
            exit
        ;;
        --build-image-elastic)
            echo "[BUILD IMAGE WITH ELASTICSEARCH]"
            sudo docker-compose -f docker-compose.dev.elastic.yml -f docker-compose.dev.yml -build
            exit
        ;;
        --build)
            echo "[BUILD TAINACAN]"
            sudo docker exec -it tainacan_build sh -c "/src_base/scripts/build_plugin.sh --build"
            sudo docker exec -it tainacan_build sh -c "/src_base/scripts/build_theme.sh"
            exit
        ;;
        --build-prod)
            echo "[BUILD TAINACAN]"
            sudo docker exec -it tainacan_build sh -c "/src_base/scripts/build_plugin.sh --build-prod"
            sudo docker exec -it tainacan_build sh -c "/src_base/scripts/build_theme.sh"
            exit
        ;;
        --watch-build)
            echo "[BUILD WATCH TAINACAN]"
            sudo docker exec -it tainacan_build sh -c "/src_base/scripts/build_theme.sh"
            sudo docker exec -it tainacan_build sh -c "/src_base/scripts/build_plugin.sh --watch-build"
            exit
        ;;
        --stop)
            fn_stop
            exit
        ;;
        --start)
            fn_start
            exit
        ;;
        --start-nginx)
            echo "[START TAINACAN WUTH NGINX]"
            sudo docker-compose -f docker-compose.nginx.yml -f docker-compose.dev.yml up
            exit
        ;;
        --start-elastic)
            echo "[START TAINACAN WITH ELASTICSEARCH]"
            sudo sysctl -w vm.max_map_count=262144
            sudo docker-compose -f docker-compose.dev.elastic.yml -f docker-compose.dev.yml up
            exit
        ;;
        --run-tests)
            echo "[EXECUTANDO TESTES--PHPUnit]"
            sudo docker exec -it tainacan_build sh -c "/src_base/scripts/run_tests.sh"
            exit
        ;;
        --bash)
            echo "[INTO A CONTAINER /bin/bash]"
            sudo docker exec -it tainacan_build /bin/bash
            exit
        ;;
        --bash-mysql)
            echo "[INTO A CONTAINER OF MYSQL /bin/bash]"
            sudo docker exec -it tainacan_db /bin/bash            
            exit
        ;;
        --error-logs)
            echo "[ERRORS LOG tainacan-dev]"
            sudo docker logs -f tainacan_fpm_apache > /dev/null
            exit
        ;;
        --help)
            echo "
            --build-image =  build docker images for application and database (super user).
            --build-image-elastic =  build docker images for application, database and elasticsearch server (super user).
            --build-image-nginx =  build docker images for application and database (super user) using nginx 
            --start       =  start the containers (super user).
            --start-elastic = start the containers and the elastic search server (super user)
            --stop        =  stops all containers(super user).
            --run-tests   =  run phpunit tests (super user).
            --bash        =  enters the container
            --bash-mysql  =  enters the mysql container
            --build       =  builds tainacan plugin and theme (super user).
            --watch-build =  watches for changes in the plugin and theme and builds them (super user).
            --build-prod =  builds tainacan plugin and theme (super user) as production mode.
            --error-logs = display the error logs
            --help        =  displays this help message
            "
            exit
        ;;
    esac
done
echo "opção invalida, para ajuda: --help"