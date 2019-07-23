#!/bin/bash
id_teste=1
for filename in csv/i1024000/*.csv; do
    echo "Importando Arquivo ${filename}";
    #docker exec -it dspacedb bash
    #/dspace/bin/dspace metadata-import -f ./${filename} -e vnicius.nm.ba@gmail.com -s;
    docker exec -it dspace /dspace/bin/dspace metadata-import -f /scripts/${filename} -e vnicius.nm.ba@gmail.com -s;
    ./run_tests.sh ${filename} ${id_teste};
    id_teste=$((id_teste+1))
done

# /dspace/bin/dspace structure-builder -f struct.xml -o ~/struct.out.xml -e vnicius.nm.ba@gmail.com
# /dspace/bin/dspace metadata-import -f ~/in.csv -e vnicius.nm.ba@gmail.com -s
