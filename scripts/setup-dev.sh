#!/bin/bash

# Script para configurar ambiente de desenvolvimento
# Executar: chmod +x scripts/setup-dev.sh && ./scripts/setup-dev.sh

echo "🚀 Configurando ambiente de desenvolvimento..."

# Configurar variáveis de ambiente para suprimir avisos
export NODE_OPTIONS="--no-deprecation"
export NODE_ENV="development"

echo "✅ NODE_OPTIONS configurado: $NODE_OPTIONS"
echo "✅ NODE_ENV configurado: $NODE_ENV"

# Verificar versão do Node.js
NODE_VERSION=$(node --version)
echo "📦 Versão do Node.js: $NODE_VERSION"

# Verificar versão do npm
NPM_VERSION=$(npm --version)
echo "📦 Versão do npm: $NPM_VERSION"

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências..."
    npm run install:all
else
    echo "✅ Dependências já instaladas"
fi

echo ""
echo "🎯 Ambiente configurado! Agora você pode executar:"
echo "   npm run dev          # Com avisos"
echo "   npm run dev:no-warnings  # Sem avisos"
echo ""
echo "💡 Dica: Use 'npm run dev:no-warnings' para evitar avisos de depreciação"

# Adicionar ao .bashrc ou .zshrc se solicitado
read -p "Deseja adicionar essas configurações ao seu perfil de shell? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if [ -f "$HOME/.bashrc" ]; then
        echo 'export NODE_OPTIONS="--no-deprecation"' >> "$HOME/.bashrc"
        echo "✅ Configurações adicionadas ao .bashrc"
    elif [ -f "$HOME/.zshrc" ]; then
        echo 'export NODE_OPTIONS="--no-deprecation"' >> "$HOME/.zshrc"
        echo "✅ Configurações adicionadas ao .zshrc"
    else
        echo "❌ Arquivo de perfil não encontrado"
    fi
fi
