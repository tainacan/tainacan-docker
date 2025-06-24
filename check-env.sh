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
log_warn()    { echo -e "\t  ${YELLOW}${BOLD}[WARN]${NC} $1"; }
log_error()   { echo -e "  ${RED}${BOLD}[ERROR]${NC} $1"; }

# Função que verifica se o script está sendo executado como root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "Este script precisa ser executado como superusuário (root). Use: sudo $0"
        exit 1  
    fi
}

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
    log_info "Verificando se as portas necessárias para o ambiente Tainacan estão livres..."
    # Porta 80: HTTP (acesso ao site WordPress)
    # Porta 3306: MySQL/MariaDB (banco de dados)
    declare -A port_desc
    port_desc[80]="HTTP - acesso ao site WordPress"
    port_desc[3306]="MySQL/MariaDB - banco de dados do WordPress"

    for port in 80 3306; do
        if lsof -i :$port | grep LISTEN > /dev/null; then
            log_warn "Porta $port está em uso! (${port_desc[$port]})"
        else
            log_success "Porta $port está livre. (${port_desc[$port]})"
        fi
    done
    log_info "As portas acima precisam estar livres para o ambiente Docker funcionar corretamente."
}

# Execução das verificações
check_root
check_docker
check_ports
