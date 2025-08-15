#!/bin/bash

# Script de build otimizado para Railway
echo "🚀 Iniciando build para Railway..."

# Verificar versões
echo "📦 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

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

echo "✅ Build concluído com sucesso!"
