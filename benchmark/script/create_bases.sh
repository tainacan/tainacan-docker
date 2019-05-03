#!/usr/bin/env bash
set -e
source env.sh

echo "create database ${NEW_BASE}; GRANT ALL PRIVILEGES ON ${NEW_BASE}.* TO ${WORDPRESS_DB_USER}@${DB_HOST} identified by 'password';" | mysql -u root -h ${DB_HOST} -p
mysql -u ${WORDPRESS_DB_USER} -D ${NEW_BASE} -h ${DB_HOST} -p < sql/create_empty_tainacan_base.sql
