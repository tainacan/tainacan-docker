FROM ubuntu:22.04
LABEL maintainer="Vinícius Nunes (@vnmedeiros)"

ARG OVERLAY_VERSION="v3.2.1.0"
ARG OVERLAY_ARCH="x86_64"

ARG DEBIAN_FRONTEND="noninteractive"
ENV HOME="/root" \
    LANGUAGE="en_US.UTF-8" \
    LANG="en_US.UTF-8" \
    TERM="xterm"

# Instala dependências e extrai s6-overlay (noarch + arch)
RUN apt-get update && \
    apt-get install -y curl ca-certificates xz-utils && \
    curl -L -o /tmp/s6-overlay-noarch.tar.xz https://github.com/just-containers/s6-overlay/releases/download/${OVERLAY_VERSION}/s6-overlay-noarch.tar.xz && \
    curl -L -o /tmp/s6-overlay.tar.xz https://github.com/just-containers/s6-overlay/releases/download/${OVERLAY_VERSION}/s6-overlay-${OVERLAY_ARCH}.tar.xz && \
    tar -C / -Jxpf /tmp/s6-overlay-noarch.tar.xz && \
    tar -C / -Jxpf /tmp/s6-overlay.tar.xz && \
    rm -f /tmp/s6-overlay-*.tar.xz && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/init"]
