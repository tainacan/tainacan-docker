# Docker Tainacan 

## Básico:

```
docker build . -t img-tainacan
docker run -p 80:80 --name=cnt-tainacan -d img-tainacan
docker run -p 80:80 --name some-wordpress -e WORDPRESS_DB_HOST=<DB-HOST> \
    -e WORDPRESS_DB_USER=... -e WORDPRESS_DB_PASSWORD=... -d img-tainacan
```

## Básico usando docker-composer:
```
sudo docker-compose build
sudo docker-compose up -d
```

o arquivo `.env` contém as variaveis de ambientes que devem ser configuradas para o ambiente de produção:
```Shell
#container name tainacan_${NAME_CONTAINER}
NAME_CONTAINER=name_container

#ENV for the wordpress access the database
WORDPRESS_DB_USER=tainacan
WORDPRESS_DB_PASSWORD=tainacan
WORDPRESS_DB_NAME=tainacan

#ENV for create database in mysql
MYSQL_ROOT_PASSWORD=tainacan
MYSQL_DATABASE=tainacan
MYSQL_USER=tainacan
MYSQL_PASSWORD=tainacan
```

## Básico instalando o tainacan:
```
./tainacan.sh --container=wordpress_tainacan --setup-init
./tainacan.sh --container=wordpress_tainacan --install-language=pt_BR
./tainacan.sh --help
```
