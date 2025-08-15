#!/bin/bash

# Script de build de produção para Railway
set -e  # Exit on any error

echo "🚀 Iniciando build de produção..."

# Verificar versões
echo "📦 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Limpar instalações anteriores
echo "🧹 Limpando instalações anteriores..."
rm -rf node_modules
rm -rf server/node_modules
rm -rf client/node_modules

# Instalar dependências do projeto raiz
echo "📥 Instalando dependências do projeto raiz..."
npm install --production=false

# Instalar dependências do servidor
echo "📥 Instalando dependências do servidor..."
cd server
npm install --production=false
cd ..

# Instalar dependências do cliente
echo "📥 Instalando dependências do cliente..."
cd client
npm install --production=false
cd ..

# Build da aplicação
echo "🔨 Fazendo build da aplicação..."
npm run build

echo "✅ Build de produção concluído com sucesso!"
