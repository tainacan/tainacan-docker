#!/bin/bash
for filename in csv/i1000/*.csv; do
    echo "Importando Arquivo ${filename}";
    docker exec -it dspace /dspace/bin/dspace metadata-import -f /scripts/${filename} -e vnicius.nm.ba@gmail.com -s;
    #/dspace/bin/dspace metadata-import -f /dspace/assetstore/import/${filename} -e vnicius.nm.ba@gmail.com -s
done

# /dspace/bin/dspace structure-builder -f struct.xml -o ~/struct.out.xml -e vnicius.nm.ba@gmail.com
# /dspace/bin/dspace metadata-import -f ~/in.csv -e vnicius.nm.ba@gmail.com -s
