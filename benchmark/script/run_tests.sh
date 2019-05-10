#!/usr/bin/env bash
set -e

repeat=10
collections=(1)
metadatas=(15)
#items=( 1000 2000 4000 8000 16000 32000 64000 128000 256000 512000 1024000 )
#items=( 1000 2000 4000 8000 16000 32000 64000 128000 256000 )
items=( 32000 64000 )
filters=(5)

file_base_name='env/db_name'
url_es_reindex='localhost:9200/_reindex'
folder_result='./results/'

#URL='http://localhost/wp-json/tainacan/v2/collection/5/items?perpage=12&paged=1&order=DESC&orderby=date&admin_view_mode=table&fetch_only=thumbnail&fetch_only_meta=6&search=801'
URL='http://localhost/wp-json/tainacan/v2/collection/5/items?perpage=12&paged=1&order=DESC&orderby=date&admin_view_mode=table&fetch_only=thumbnail&fetch_only_meta=6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20&search=801'

for item in "${items[@]}"
do
    base_name=base_1_15_${item}_5
    echo 'Run test to '${base_name}
    echo ${base_name} > ${file_base_name}

    echo "Mysql:"
    #//docker deactive elasticpress
    sudo docker exec -it wordpress_tainacan_benchmark sh /script/elasticpress/deactivate.sh
    array_results_mysql=()
    for (( i=0; i<repeat; ++i))
    do
        time=$(php -f benchmark_tests.php $URL)
        array_results_mysql+=( ${time} )
    done

    echo "ES:"
    #//docker active elasticpress    
    reindex='{"source": {"index": "'${base_name}'"}, "dest": {"index": "localhost-1"}}'
    curl  --data "${reindex}" -H "Content-Type: application/json" -X POST ${url_es_reindex}
    sudo docker exec -it wordpress_tainacan_benchmark sh /script/elasticpress/activate.sh
    
    array_results_es=()
    for (( i=0; i<repeat; ++i))
    do
        time=$(php -f benchmark_tests.php $URL)
        array_results_es+=( ${time} )
    done
    
    echo "r MySQL ES" > ${folder_result}/${base_name}
    for (( n=0; n<10; n++ ))
    do
        echo "$n ${array_results_mysql[${n}]} ${array_results_es[${n}]}" >> ${folder_result}/${base_name}
    done 
done
echo "FIM!"
#php -f benchmark.php base_1_15_1000_5 1 15 1024000 5 > ./bases/mysql_tainacan/empty_tainacan_base.sql
