#!/bin/bash
# dev.sh - Script utilitário para gerenciamento do ambiente Docker do Tainacan

# Funções auxiliares
function fn_stop {
    echo "[STOP TAINACAN]"
    docker compose -f docker-compose.yml down
    docker compose -f docker-compose.dev.yml down
    docker compose -f docker-compose.nginx.yml down
    docker compose -f docker-compose.dev.elastic.yml down
}

function fn_start {
    echo "[START TAINACAN]"
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up
    fn_build
}

function fn_build {
    echo "[BUILD TAINACAN]"
    docker exec -it tainacan_build sh -c "/src_base/scripts/build_plugin.sh --build"
    docker exec -it tainacan_build sh -c "/src_base/scripts/build_theme.sh"
}

function fn_build_prod {
    echo "[BUILD TAINACAN - PROD]"
    docker exec -it tainacan_build sh -c "/src_base/scripts/build_plugin.sh --build-prod"
    docker exec -it tainacan_build sh -c "/src_base/scripts/build_theme.sh"
}

function fn_watch_build {
    echo "[BUILD WATCH TAINACAN]"
    docker exec -it tainacan_build sh -c "/src_base/scripts/build_theme.sh"
    docker exec -it tainacan_build sh -c "/src_base/scripts/build_plugin.sh --watch-build"
}

function fn_error_logs {
    echo "[ERROR LOGS tainacan-dev]"
    docker logs -f tainacan_fpm_apache > /dev/null
}

function fn_help {
    cat <<EOF
Comandos disponíveis:
  --build-image         : Build docker images for application and database (super user).
  --build-image-elastic : Build docker images for application, database and elasticsearch server (super user).
  --build-image-nginx   : Build docker images for application and database (super user) using nginx.
  --start               : Start the containers (super user).
  --start-elastic       : Start the containers and the elasticsearch server (super user).
  --stop                : Stop all containers (super user).
  --run-tests           : Run phpunit tests (super user).
  --bash                : Enter the main container shell.
  --bash-mysql          : Enter the MySQL container shell.
  --build               : Build Tainacan plugin and theme (super user).
  --watch-build         : Watch for changes in the plugin and theme and build them (super user).
  --build-prod          : Build Tainacan plugin and theme (super user) as production mode.
  --error-logs          : Display the error logs.
  --help                : Display this help message.
EOF
}

# Processamento dos argumentos
for i in "$@"
do
    case $i in
        --build-image)
            echo "[BUILD IMAGE]"
            docker compose -f docker-compose.yml -f docker-compose.dev.yml build
            exit 0
        ;;
        --build-image-nginx)
            echo "[BUILD IMAGE WITH NGINX]"
            docker compose -f docker-compose.nginx.yml -f docker-compose.dev.yml build
            exit 0
        ;;
        --build-image-elastic)
            echo "[BUILD IMAGE WITH ELASTICSEARCH]"
            docker compose -f docker-compose.dev.elastic.yml -f docker-compose.dev.yml build
            exit 0
        ;;
        --build)
            fn_build
            exit 0
        ;;
        --build-prod)
            fn_build_prod
            exit 0
        ;;
        --watch-build)
            fn_watch_build
            exit 0
        ;;
        --stop)
            fn_stop
            exit 0
        ;;
        --start)
            fn_start
            exit 0
        ;;
        --start-nginx)
            echo "[START TAINACAN WITH NGINX]"
            docker compose -f docker-compose.nginx.yml -f docker-compose.dev.yml up
            exit 0
        ;;
        --start-elastic)
            echo "[START TAINACAN WITH ELASTICSEARCH]"
            sysctl -w vm.max_map_count=262144
            docker compose -f docker-compose.dev.elastic.yml -f docker-compose.dev.yml up
            exit 0
        ;;
        --run-tests)
            echo "[RUNNING TESTS -- PHPUnit]"
            docker exec -it tainacan_build sh -c "/src_base/scripts/run_tests.sh"
            exit 0
        ;;
        --bash)
            echo "[ENTERING MAIN CONTAINER /bin/bash]"
            docker exec -it tainacan_build /bin/bash
            exit 0
        ;;
        --bash-mysql)
            echo "[ENTERING MYSQL CONTAINER /bin/bash]"
            docker exec -it tainacan_db /bin/bash
            exit 0
        ;;
        --error-logs)
            fn_error_logs
            exit 0
        ;;
        --help)
            fn_help
            exit 0
        ;;
    esac
    # Se chegou aqui, argumento não reconhecido
    echo "Opção inválida: $i. Para ajuda, use: --help"
    exit 1
done
