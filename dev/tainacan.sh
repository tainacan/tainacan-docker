#!/bin/bash

for i in "$@"
do
    case $i in
        --setup-init)
            echo "[SETUP ENV DEV]"
            mkdir -p www
            cat > .env <<EOF
LOCAL_PATH=${PWD}
WEB_APP_PATH=/www
EOF
            ./conf/scripts/clone.sh
            sudo docker-compose -f docker-compose-dev.yml up --build
            exit
        ;;
        --build-image)
            echo "[BUILD IMAGE]"
            sudo docker-compose -f docker-compose-dev.yml build
            exit
        ;;
        --build-image-nginx)
            echo "[BUILD IMAGE] WITH NGINX"
            sudo docker-compose -f docker-compose-dev-nginx.yml build
            exit
        ;;
        --build-image-elastic)
            echo "[BUILD IMAGE WITH ELASTICSEARCH]"
            sudo docker-compose -f docker-compose-dev-elastic.yml build
            exit
        ;;
        --build)
            echo "[BUILD TAINACAN]"
            sudo ./conf/scripts/build_tainacan.sh --build
            exit
        ;;
        --build-prod)
            echo "[BUILD TAINACAN]"
            sudo ./conf/scripts/build_tainacan.sh --build-prod
            exit
        ;;
        --watch-build)
            echo "[BUILD WATCH TAINACAN]"
            sudo ./conf/scripts/build_tainacan.sh --watch-build
            exit
        ;;
        --stop)
            echo "[STOP TAINACAN]"
            sudo docker-compose -f docker-compose-dev.yml down
            sudo docker-compose -f docker-compose-dev-elastic.yml down
            sudo docker-compose -f docker-compose-dev-nginx.yml down
            exit
        ;;
        --start)
            echo "[START TAINACAN]"
            sudo docker-compose -f docker-compose-dev.yml up -d
            exit
        ;;
        --start-nginx)
            echo "[START TAINACAN WUTH NGINX]"
            sudo docker-compose -f docker-compose-dev-nginx.yml up -d
            exit
        ;;
        --start-elastic)
            echo "[START TAINACAN WITH ELASTICSEARCH]"
            sudo sysctl -w vm.max_map_count=262144
            sudo docker-compose -f docker-compose-dev-elastic.yml up -d
            exit
        ;;
        --clone)
            echo "[CLONE REPO TAINACAN]"
            ./conf/scripts/clone.sh
            exit
        ;;
        --ssh-clone)
            echo "[CLONE REPO TAINACAN - SSH]"
            ./conf/scripts/clone.sh --ssh
            exit
        ;;        
        --run-tests)
            echo "[EXECUTANDO TESTES--PHPUnit]"
            sudo docker exec -it tainacan-dev sh /src/run_tests.sh
            exit
        ;;
        --bash)
            echo "[INTO A CONTAINER /bin/bash]"
            sudo docker exec -it tainacan-dev /bin/bash
            exit
        ;;
        --bash-mysql)
            echo "[INTO A CONTAINER OF MYSQL /bin/bash]"
            sudo docker exec -it mysql_tainacan /bin/bash            
            exit
        ;;
        --error-logs)
            echo "[ERRORS LOG tainacan-dev]"
            sudo docker logs -f tainacan-dev > /dev/null
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
            --clone       =  clones tainacan and tainacan-interface repositories into the dev folder
            --ssh-clone   =  clones tainacan and tainacan-interface repositories into the dev folder using your ssh keys
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
#docker-compose -f docker-compose-dev.yml up --build
