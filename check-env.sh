#!/bin/bash
# check-env.sh - Verificação rápida e padronizada do ambiente Docker para o Tainacan

# Configuração de cores e formatação
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor
BOLD='\033[1m'

# Funções de log
log_info()    { echo -e "  ${BLUE}${BOLD}[INFO]${NC} $1"; }
log_success() { echo -e "\t  ${GREEN}${BOLD}[OK]${NC} $1"; }
log_warn()    { echo -e "  ${YELLOW}${BOLD}[WARN]${NC} $1"; }
log_error()   { echo -e "  ${RED}${BOLD}[ERROR]${NC} $1"; }

# Função para verificar Docker
check_docker() {
    log_info "Verificando se o Docker está instalado..."
    if ! command -v docker > /dev/null 2>&1; then
        log_error "Docker não está instalado. Por favor, instale o Docker antes de continuar."
        exit 1
    fi
    log_success "Docker está instalado."

    log_info "Verificando se o Docker está em execução..."
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker está instalado, mas não está em execução. Inicie o serviço Docker e tente novamente."
        exit 1
    fi
    log_success "Docker está em execução. \n"
}

# Função para verificar portas
check_ports() {
    log_info "Verificando se as portas 80 e 3306 estão livres..."
    for port in 80 3306; do
        if lsof -i :$port | grep LISTEN > /dev/null; then
            log_warn "Porta $port está em uso!"
        else
            log_success "Porta $port está livre."
        fi
    done
}

# Execução das verificações
check_docker
check_ports
