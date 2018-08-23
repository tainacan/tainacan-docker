#!/bin/bash

docker exec -it wordpress_tainacan sh /repo/build_plugin.sh
docker exec -it wordpress_tainacan sh /repo/build_theme.sh
