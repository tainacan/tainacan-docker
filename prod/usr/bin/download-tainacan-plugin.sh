#!/bin/bash
url_tainacan='https://downloads.wordpress.org/plugin/tainacan.zip'
wget --directory-prefix=/var/www/html/wp-content/plugins/ ${url_tainacan}
