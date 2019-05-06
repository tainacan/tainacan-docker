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

## Básico instalando o tainacan:
```
docker exec -it [cnt-tainacan] install-tainacan.sh
```