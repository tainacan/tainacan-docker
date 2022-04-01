# start a local registry:
# docker run -d -p 5000:5000 --restart=always --name registry registry:2

# stoped a local registry
# docker container stop registry

# build and send a image to local registry:
docker build -t "tainacan/docker-baseimage-s6-overlay-ubuntu:20.04" ${pwd}/dockerfiles/s6-overlay/
docker push "tainacan/docker-baseimage-s6-overlay-ubuntu:20.04"

# test pull:
docker pull "tainacan/docker-baseimage-s6-overlay-ubuntu:20.04"


docker build -t "tainacan/php:7.4-cli" ${pwd}/dockerfiles/7.4/cli/
docker push "tainacan/php:7.4-cli"


docker build -t "tainacan/php:7.4-fpm" ${pwd}/dockerfiles/7.4/fpm/
docker push "tainacan/php:7.4-fpm"


docker build -t "tainacan/php:7.4-fpm-apache" ${pwd}/dockerfiles/7.4/fpm-apache/
docker push "tainacan/php:7.4-fpm-apache"


docker build -t "tainacan/build:php-7.4" ${pwd}/dockerfiles/7.4/build/
docker push "tainacan/build:php-7.4"


docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down