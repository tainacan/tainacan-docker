# Tainacan Docker

## English

This repository provides Docker files and scripts to build and manage Tainacan development environments.

**First, clone this repository:**

```bash
git clone <repo-url>
cd tainacan-docker
```

## Prerequisites

- Docker and Docker Compose installed
- Linux or compatible Unix system

## Main script

All environment management is done via the `dev.sh` script in the root of this repository.

## Main commands

| Command                        | Description                                      |
| ------------------------------ | ------------------------------------------------ |
| ./dev.sh --build-image         | Build Docker images for application and database |
| ./dev.sh --build-image-nginx   | Build Docker images using NGINX                  |
| ./dev.sh --build-image-elastic | Build Docker images with Elasticsearch support   |
| ./dev.sh --start               | Start the containers                             |
| ./dev.sh --start-nginx         | Start containers using NGINX                     |
| ./dev.sh --start-elastic       | Start containers with Elasticsearch              |
| ./dev.sh --stop                | Stop all containers                              |
| ./dev.sh --build               | Build Tainacan plugin and theme                  |
| ./dev.sh --build-prod          | Build plugin and theme in production mode        |
| ./dev.sh --watch-build         | Watch for changes and build automatically        |
| ./dev.sh --run-tests           | Run PHPUnit tests                                |
| ./dev.sh --bash                | Enter the main container shell                   |
| ./dev.sh --bash-mysql          | Enter the MySQL container shell                  |
| ./dev.sh --error-logs          | Show error logs                                  |
| ./dev.sh --help                | Show all available commands                      |

## Usage examples

```bash
./dev.sh --build-image
./dev.sh --start
./dev.sh --build
./dev.sh --run-tests
```

## Notes

- All plugins and themes are in the `www/wp-content` folder. Add any extra plugins or themes there.
- After editing code, enter the respective directories in `src` to commit your changes.

---

# Tainacan Docker

## Português

Este repositório fornece arquivos e scripts Docker para criar e gerenciar ambientes de desenvolvimento do Tainacan.

**Primeiro, clone este repositório:**

```bash
git clone <repo-url>
cd tainacan-docker
```

## Pré-requisitos

- Docker e Docker Compose instalados
- Linux ou sistema Unix compatível

## Script principal

Todo o gerenciamento do ambiente é feito pelo script `dev.sh` na raiz deste repositório.

## Comandos principais

| Comando                        | Descrição                                              |
| ------------------------------ | ------------------------------------------------------ |
| ./dev.sh --build-image         | Constrói as imagens Docker para aplicação e banco      |
| ./dev.sh --build-image-nginx   | Constrói as imagens Docker usando NGINX                |
| ./dev.sh --build-image-elastic | Constrói as imagens Docker com suporte a Elasticsearch |
| ./dev.sh --start               | Inicia os containers                                   |
| ./dev.sh --start-nginx         | Inicia os containers usando NGINX                      |
| ./dev.sh --start-elastic       | Inicia os containers com Elasticsearch                 |
| ./dev.sh --stop                | Para todos os containers                               |
| ./dev.sh --build               | Faz o build do plugin e tema Tainacan                  |
| ./dev.sh --build-prod          | Faz o build do plugin e tema em modo produção          |
| ./dev.sh --watch-build         | Observa mudanças e faz build automaticamente           |
| ./dev.sh --run-tests           | Executa os testes PHPUnit                              |
| ./dev.sh --bash                | Entra no shell do container principal                  |
| ./dev.sh --bash-mysql          | Entra no shell do container MySQL                      |
| ./dev.sh --error-logs          | Mostra os logs de erro                                 |
| ./dev.sh --help                | Mostra todos os comandos disponíveis                   |

## Exemplos de uso

```bash
./dev.sh --build-image
./dev.sh --start
./dev.sh --build
./dev.sh --run-tests
```

## Observações

- Todos os plugins e temas ficam na pasta `www/wp-content`. Adicione plugins ou temas extras lá.
- Após editar o código, entre nos diretórios correspondentes em `src` para commitar suas alterações.
