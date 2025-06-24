#!/bin/bash
# Verificação rápida do ambiente Docker

echo "🔍 Verificando se o Docker está instalado e em execução..."
if ! command -v docker > /dev/null 2>&1; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker antes de continuar."
    exit 1
elif ! docker info > /dev/null 2>&1; then
    echo "❌ Docker está instalado, mas não está em execução. Inicie o serviço Docker e tente novamente."
    exit 1
else
    echo "✅ Docker está instalado e em execução."
fi

echo "Verificando se as portas 80 e 3306 estão livres..."
for port in 80 3306; do
  if lsof -i :$port | grep LISTEN; then
    echo "⚠️  Porta $port está em uso!"
  else
    echo "✅ Porta $port está livre."
  fi
done
