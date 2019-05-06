# Docker Tainacan 

## Básico:

```
docker build . -t img-tainacan
docker run -it -p 80:80 --name=cnt-tainacan -d img-tainacan
```

## Básico usando docker-composer:
```
sudo docker-compose build
sudo docker-compose up -d
```