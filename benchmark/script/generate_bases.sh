#!/usr/bin/env bash
set -e

items=( 1000 2000 4000 8000 16000 32000 64000 128000 256000 512000 1024000 )  

for item in "${items[@]}"  
do  
    base_name=base_1_15_${item}_5
    echo "BASE NAME: $base_name"
    php -f benchmark_structs.php $base_name 1 15 $item 5 > ./bases/mysql_tainacan/${base_name}.sql
done  

#php -f benchmark.php base_1_15_1000_5 1 15 1024000 5 > ./bases/mysql_tainacan/empty_tainacan_base.sql
