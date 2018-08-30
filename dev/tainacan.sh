#!/bin/bash

for i in "$@"
do
    case $i in
        --build-image*)
            echo "[BUILD IMAGE]"
            docker-compose -f docker-compose-dev.yml build
            exit
        ;;
        --build*)
            echo "[BUILD TAINACAN]"
            ./scripts/build_tainacan.sh 
            exit
        ;;    
        --stop*)
            echo "[STOP TAINACAN]"
            docker-compose -f docker-compose-dev.yml down
            exit
        ;;    
        --start*)
            echo "[START TAINACAN]"
            docker-compose -f docker-compose-dev.yml up
            ./scripts/build_tainacan.sh 
            exit
        ;;    
        --clone*)
            echo "[CLONE REPO TAINACAN]"
            ./scripts/clone.sh 
            exit
        ;;
        --help)
            echo "
            --build-image =  build imagem docker.
            --build       =  build do plugin e do tema do Tainacan.
            --start       =  iniciar container do Tainacan em segundo plano.
            --stop        =  para execução do container do Tainacan.
            --clona       =  clona o repositorio de codigo do Tainacan.
            --help        =  ajuda.
            "
            exit
        ;;
    esac
done

docker-compose -f docker-compose-dev.yml up --build
