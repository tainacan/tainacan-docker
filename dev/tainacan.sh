#!/bin/bash

for i in "$@"
do
    case $i in
        --build-image*)
            echo "[BUILD IMAGE]"
            sudo docker-compose -f docker-compose-dev.yml build
            exit
        ;;
        --build*)
            echo "[BUILD TAINACAN]"
            sudo ./scripts/build_tainacan.sh --build
            exit
        ;;
        --watch-build*)
            echo "[BUILD WATCH TAINACAN]"
            sudo ./scripts/build_tainacan.sh --watch-build
            exit
        ;;
        --stop*)
            echo "[STOP TAINACAN]"
            sudo docker-compose -f docker-compose-dev.yml down
            exit
        ;;
        --start*)
            echo "[START TAINACAN]"
            sudo docker-compose -f docker-compose-dev.yml up
            exit
        ;;
        --clone*)
            echo "[CLONE REPO TAINACAN]"
            ./scripts/clone.sh
            exit
        ;;
        --run-tests*)
            echo "[EXECUTANDO TESTES--PHPUnit]"
            sudo docker exec -it wordpress_tainacan sh /repo/run_tests.sh
            exit
        ;;
        --help)
            echo "
            --build-image =  build imagem docker (super user).
            --build       =  build do plugin e do tema do Tainacan (super user).
            --watch-build =  watch build do plugin e do tema do Tainacan (super user).
            --start       =  iniciar container do Tainacan em segundo plano (super user).
            --stop        =  para execução do container do Tainacan (super user).
            --clone       =  clona o repositorio de codigo do Tainacan.
            --run-tests   =  executa os testes unitários (super user).
            --help        =  ajuda.
            "
            exit
        ;;
    esac
done
echo "opção invalida, para ajuda: --help"
#docker-compose -f docker-compose-dev.yml up --build
