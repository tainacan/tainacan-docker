FROM docker:latest
COPY ./scripts/backup.sh /backup.sh
# Adicione a tarefa do cron para executar o script periodicamente
RUN echo "0 3 * * * /bin/sh /backup.sh" >> /etc/crontabs/root

# Inicialize o container
CMD ["/usr/sbin/crond", "-f", "-d", "8"]