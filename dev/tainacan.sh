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
            --build-image =  build imagem docker (super user).
            --build-image-elastic =  build imagem docker with elasticsearch (super user).
            --build       =  build do plugin e do tema do Tainacan (super user).
            --watch-build =  watch build do plugin e do tema do Tainacan (super user).
            --start       =  iniciar container do Tainacan em segundo plano (super user).
            --start-elastic = iniciar container do Tainacan em segundo plano (super user) junto com o container do elasticsearch
            --stop        =  para execução do container do Tainacan (super user).
            --clone       =  clona o repositorio de codigo do Tainacan.
            --ssh-clone   =  clona o repositorio de codigo do Tainacan usando ssh.
            --run-tests   =  executa os testes unitários (super user).
            --bash        =  CLI do container do tainacan
            --bash-mysql  =  CLI do container do mysql para o tainacan
            --help        =  ajuda.
            "
            exit
        ;;
    esac
done
echo "opção invalida, para ajuda: --help"
#docker-compose -f docker-compose-dev.yml up --build
