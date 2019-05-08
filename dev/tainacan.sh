#!/bin/bash

for i in "$@"
do
    case $i in
        --build-image)
            echo "[BUILD IMAGE]"
            sudo docker-compose -f docker-compose-dev.yml build
            exit
        ;;
        --build-image-elastic)
            echo "[BUILD IMAGE WITH ELASTICSEARCH]"
            sudo docker-compose -f docker-compose-dev-elastic.yml build
            exit
        ;;
        --build)
            echo "[BUILD TAINACAN]"
            sudo ./scripts/build_tainacan.sh --build
            exit
        ;;
        --watch-build)
            echo "[BUILD WATCH TAINACAN]"
            sudo ./scripts/build_tainacan.sh --watch-build
            exit
        ;;
        --stop)
            echo "[STOP TAINACAN]"
            sudo docker-compose -f docker-compose-dev.yml down
            sudo docker-compose -f docker-compose-dev-elastic.yml down
            exit
        ;;
        --start)
            echo "[START TAINACAN]"
            sudo docker-compose -f docker-compose-dev.yml up
            exit
        ;;
        --start-elastic)
            echo "[START TAINACAN WITH ELASTICSEARCH]"
            sudo docker-compose -f docker-compose-dev-elastic.yml up
            exit
        ;;
        --clone)
            echo "[CLONE REPO TAINACAN]"
            ./scripts/clone.sh
            exit
        ;;
        --ssh-clone)
            echo "[CLONE REPO TAINACAN - SSH]"
            ./scripts/clone.sh --ssh
            exit
        ;;        
        --run-tests)
            echo "[EXECUTANDO TESTES--PHPUnit]"
            sudo docker exec -it wordpress_tainacan sh /repo/run_tests.sh
            exit
        ;;
        --bash)
            echo "[INTO A CONTAINER /bin/bash]"
            sudo docker exec -it wordpress_tainacan /bin/bash
            exit
        ;;
        --bash-mysql)
            echo "[INTO A CONTAINER OF MYSQL /bin/bash]"
            sudo docker exec -it mysql_tainacan /bin/bash            
            exit
        ;;
        --help)
            echo "
            --build-image =  build docker images for application and database (super user).
            --build-image-elastic =  build docker images for application, database and elasticsearch server (super user).
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
            --help        =  displays this help message
            "
            exit
        ;;
    esac
done
echo "opção invalida, para ajuda: --help"
#docker-compose -f docker-compose-dev.yml up --build
