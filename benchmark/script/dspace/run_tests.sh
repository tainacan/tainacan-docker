#!/usr/bin/env bash
set -e

# /dspace/bin/dspace structure-builder -f struct.xml -o ~/struct.out.xml -e vnicius.nm.ba@gmail.com
# /dspace/bin/dspace metadata-import -f ~/in.csv -e vnicius.nm.ba@gmail.com -s

repeat=10
#items=( 1024000 )
items=( $1 )
id_teste=$2

folder_result='./results'
#URL='localhost:8080/rest/filtered-items?query_field%5B%5D=*&query_op%5B%5D=contains&query_val%5B%5D=820&collSel%5B%5D=&limit=100&offset=0&expand=parentCollection%2Cbitstreams&filters=none'
#URL='localhost:8080/rest/filtered-items?query_field%5B%5D=*&query_op%5B%5D=contains&query_val%5B%5D=820&collSel%5B%5D=&limit=100&offset=0&filters=none'
URL='localhost:8080/rest/filtered-items?query_field%5B%5D=*&query_op%5B%5D=contains&query_val%5B%5D=item-2&collSel%5B%5D=&limit=12&offset=0&expand=metadata&filters=none&'

for item in "${items[@]}"
do
    echo 'Run test to '${item}

    echo "DSpace:"
    array_results_dspace=()
    for (( i=0; i<repeat; ++i))
    do
        echo -ne "#"
        time=$(php -f benchmark_tests.php $URL)
        array_results_dspace+=( ${time} )
    done
    
    echo "r DSpace" > ${folder_result}/${id_teste}.dat
    for (( n=0; n<10; n++ ))
    do
        echo "$n ${array_results_dspace[${n}]}" >> ${folder_result}/${id_teste}.dat
    done 
done
echo "FIM!"
