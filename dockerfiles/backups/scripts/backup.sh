#!/bin/bash

# Configurações do banco de dados MySQL
MYSQL_USER="tainacan"
MYSQL_PASSWORD="tainacan"

# Pasta de destino para salvar os backups
BACKUP_DIR="/backups"

# Verifica se o diretório de backup existe, caso não exista, cria o diretório
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
fi

# Obtém a lista de todas as bases de dados no servidor MySQL
databases=$(mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "SHOW DATABASES;" | grep -Ev "(Database|information_schema|performance_schema|mysql)")

# Loop através de cada banco de dados para fazer o backup individual
for db in $databases; do
    echo "Fazendo backup do banco de dados: $db"
    
    # Cria uma pasta para cada banco de dados se não existir
    db_backup_dir="$BACKUP_DIR/$db"
    if [ ! -d "$db_backup_dir" ]; then
        mkdir -p "$db_backup_dir"
    fi

    # Nome do arquivo de backup contendo a data de criação
    backup_file="$db_backup_dir/$(date '+%Y-%m-%d_%H-%M-%S').sql"

    # Realiza o backup e salva no arquivo nomeado com a data de criação
    mysqldump -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$db" > "$backup_file"
    echo "Backup de $db concluído e salvo em $backup_file"

    # Mantém apenas os 10 arquivos mais recentes para cada banco de dados
    cd "$db_backup_dir" || exit
    ls -t | awk 'NR>10' | xargs rm -- || true
done

echo "Todos os backups foram concluídos."
