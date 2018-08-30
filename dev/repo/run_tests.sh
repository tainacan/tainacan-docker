#!/bin/bash

cd /repo/tainacan/
./tests/bin/install-wp-tests.sh $WORDPRESS_DB_TEST $WORDPRESS_DB_USER $WORDPRESS_DB_PASSWORD $WORDPRESS_PATH_TEST $WORDPRESS_DB_HOST 4.9.8
phpunit 
