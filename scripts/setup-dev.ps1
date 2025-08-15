# Script para configurar ambiente de desenvolvimento
# Executar: .\scripts\setup-dev.ps1

Write-Host "🚀 Configurando ambiente de desenvolvimento..." -ForegroundColor Green

# Configurar variáveis de ambiente para suprimir avisos
$env:NODE_OPTIONS = "--no-deprecation"
$env:NODE_ENV = "development"

Write-Host "✅ NODE_OPTIONS configurado: $env:NODE_OPTIONS" -ForegroundColor Yellow
Write-Host "✅ NODE_ENV configurado: $env:NODE_ENV" -ForegroundColor Yellow

# Verificar versão do Node.js
$nodeVersion = node --version
Write-Host "📦 Versão do Node.js: $nodeVersion" -ForegroundColor Cyan

# Verificar versão do npm
$npmVersion = npm --version
Write-Host "📦 Versão do npm: $npmVersion" -ForegroundColor Cyan

# Instalar dependências se necessário
if (-not (Test-Path "node_modules")) {
    Write-Host "📥 Instalando dependências..." -ForegroundColor Blue
    npm run install:all
} else {
    Write-Host "✅ Dependências já instaladas" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Ambiente configurado! Agora você pode executar:" -ForegroundColor Green
Write-Host "   npm run dev          # Com avisos" -ForegroundColor White
Write-Host "   npm run dev:no-warnings  # Sem avisos" -ForegroundColor White
Write-Host ""
Write-Host "💡 Dica: Use 'npm run dev:no-warnings' para evitar avisos de depreciação" -ForegroundColor Yellow
