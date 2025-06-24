#!/bin/bash
# dev.sh - Script utilitário para gerenciamento do ambiente Docker do Tainacan

# Configuração de cores e formatação
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor
BOLD='\033[1m'

# Funções de log
log_info()    { echo -e "  ${BLUE}${BOLD}[INFO]${NC} $1"; }
log_success() { echo -e "  ${GREEN}${BOLD}[OK]${NC} $1"; }
log_warn()    { echo -e "  ${YELLOW}${BOLD}[WARN]${NC} $1"; }
log_error()   { echo -e "  ${RED}${BOLD}[ERROR]${NC} $1"; }

# Funções auxiliares

# fn_stop - Para todos os containers do tainacan
function fn_stop {
    log_info "Parando containers do Tainacan..."
    docker compose -f docker-compose.yml down
    docker compose -f docker-compose.dev.yml down
    docker compose -f docker-compose.nginx.yml down
    docker compose -f docker-compose.dev.elastic.yml down
    log_success "Containers parados."
}


# fn_start - Inicia os containers e executa o build inicial
function fn_start {
    log_info "Iniciando containers do Tainacan..."
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up
    fn_build
}

# fn_build - Complila o plugin e o tema do tainacan
function fn_build {
    local start_time=$(date +%s)
    log_info "Build do plugin Tainacan..."
    docker exec -it tainacan_build sh -c "/src_base/scripts/build_plugin.sh --build"
    log_info "Build do tema Tainacan..."
    docker exec -it tainacan_build sh -c "/src_base/scripts/build_theme.sh"
    log_success "Build concluído em $(($(date +%s) - start_time)) segundos."
}

# fn_build_prod - Compila para produção
function fn_build_prod {
    log_info "Build do plugin Tainacan (produção)..."
    docker exec -it tainacan_build sh -c "/src_base/scripts/build_plugin.sh --build-prod"
    log_info "Build do tema Tainacan..."
    docker exec -it tainacan_build sh -c "/src_base/scripts/build_theme.sh"
    log_success "Build de produção concluído."
}

# fn_watch_build - Monitora alterações e recompila automaticamente
function fn_watch_build {
    log_info "Build watch do tema Tainacan..."
    docker exec -it tainacan_build sh -c "/src_base/scripts/build_theme.sh"
    log_info "Build watch do plugin Tainacan..."
    docker exec -it tainacan_build sh -c "/src_base/scripts/build_plugin.sh --watch-build"
    log_success "Watch build ativo."
}

# fn_error_logs - Exibe logs de erro
function fn_error_logs {
    log_warn "Exibindo logs de erro do tainacan-dev..."
    docker logs -f tainacan_fpm_apache > /dev/null
}

# fn_help - Exibe ajuda
function fn_help {
    log_info "${BOLD}Comandos disponíveis:${NC}"
    echo -e "  ${BLUE}--build-image${NC}         : Build docker images for application and database (super user)."
    echo -e "  ${BLUE}--build-image-elastic${NC} : Build docker images for application, database and elasticsearch server (super user)."
    echo -e "  ${BLUE}--build-image-nginx${NC}   : Build docker images for application and database (super user) using nginx."
    echo -e "  ${BLUE}--start${NC}               : Start the containers (super user)."
    echo -e "  ${BLUE}--start-elastic${NC}       : Start the containers and the elasticsearch server (super user)."
    echo -e "  ${BLUE}--stop${NC}                : Stop all containers (super user)."
    echo -e "  ${BLUE}--run-tests${NC}           : Run phpunit tests (super user)."
    echo -e "  ${BLUE}--bash${NC}                : Enter the main container shell."
    echo -e "  ${BLUE}--bash-mysql${NC}          : Enter the MySQL container shell."
    echo -e "  ${BLUE}--build${NC}               : Build Tainacan plugin and theme (super user)."
    echo -e "  ${BLUE}--watch-build${NC}         : Watch for changes in the plugin and theme and build them (super user)."
    echo -e "  ${BLUE}--build-prod${NC}          : Build Tainacan plugin and theme (super user) as production mode."
    echo -e "  ${BLUE}--error-logs${NC}          : Display the error logs."
    echo -e "  ${BLUE}--help${NC}                : Display this help message."
}

# Verifica se o docker está instalado
if ! command -v docker &> /dev/null; then
    log_error "Docker não está instalado. Instale-o primeiro."
    exit 1
fi

# Processamento dos argumentos
if [ $# -eq 0 ]; then
    fn_help
    exit 0
fi

for i in "$@"
do
    case $i in
        --build-image)
            log_info "Buildando imagem Docker (app + db)..."
            docker compose -f docker-compose.yml -f docker-compose.dev.yml build
            log_success "Imagem Docker criada."
            exit 0
        ;;
        --build-image-nginx)
            log_info "Buildando imagem Docker (nginx)..."
            docker compose -f docker-compose.nginx.yml -f docker-compose.dev.yml build
            log_success "Imagem Docker (nginx) criada."
            exit 0
        ;;
        --build-image-elastic)
            log_info "Buildando imagem Docker (elasticsearch)..."
            docker compose -f docker-compose.dev.elastic.yml -f docker-compose.dev.yml build
            log_success "Imagem Docker (elasticsearch) criada."
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
            log_info "Iniciando containers com NGINX..."
            docker compose -f docker-compose.nginx.yml -f docker-compose.dev.yml up
            log_success "Containers iniciados com NGINX."
            exit 0
        ;;
        --start-elastic)
            log_info "Iniciando containers com Elasticsearch..."
            sysctl -w vm.max_map_count=262144
            docker compose -f docker-compose.dev.elastic.yml -f docker-compose.dev.yml up
            log_success "Containers iniciados com Elasticsearch."
            exit 0
        ;;
        --run-tests)
            log_info "Executando testes (PHPUnit)..."
            docker exec -it tainacan_build sh -c "/src_base/scripts/run_tests.sh"
            log_success "Testes finalizados."
            exit 0
        ;;
        --bash)
            log_info "Entrando no container principal (/bin/bash)..."
            docker exec -it tainacan_build /bin/bash
            exit 0
        ;;
        --bash-mysql)
            log_info "Entrando no container MySQL (/bin/bash)..."
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
    log_error "Opção inválida: $i. Para ajuda, use: --help"
    exit 1
done
