import csv
import os
import math 

# /dspace/bin/dspace structure-builder -f struct.xml -o ~/struct.out.xml -e vnicius.nm.ba@gmail.com
# /dspace/bin/dspace metadata-import -f ~/in.csv -e vnicius.nm.ba@gmail.com -s

headers = [
    'id',
    'collection',
    'dc.type',
    'dc.subject',
    'dc.source',
    'dc.rights',
    'dc.relation',
    'dc.publisher',
    'dc.language',
    'dc.identifier',
    'dc.format',
    'dc.title',
    'dc.description',
    'dc.date',
    'dc.creator',
    'dc.contributor'
]
collection_id="123456789/59"

size_of_partition=1000

#items_amount = [1000, 2000, 4000, 8000, 16000, 32000, 64000, 128000, 256000, 512000, 1024000]
items_amount = [2000]

for amount in items_amount:
    path = "csv/i" + str(amount)
    if not os.path.exists(path):
        os.makedirs(path)
    partitions = int(math.ceil(amount/size_of_partition))
    i=0
    for p in range(1, partitions+1):
        file_name = path + '/import_' + str(amount) + '.p' + str(p) + '.csv'
        with open(file_name, 'w') as csvFile:
            writer = csv.writer(csvFile)
            writer.writerow(headers)
            for item in range(0, size_of_partition):
                rows = [
                    '+',
                    collection_id,
                    'type-' + str(i%2),
                    'subject-' + str(i%4),
                    'source',
                    'rights',
                    'relation',
                    'publisher',
                    'language',
                    'identifier',
                    'format',
                    'item-' + str(i),
                    'description',
                    'date',
                    'creator',
                    #'coverage',
                    'contributor'
                ]
                i=i+1
                writer.writerow(rows)
            csvFile.close()
