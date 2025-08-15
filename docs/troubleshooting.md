# 🔧 Guia de Resolução de Problemas

## ⚠️ Avisos de Depreciação

### Problema: `[DEP0060] DeprecationWarning: The util._extend API is deprecated`

Este aviso ocorre quando alguma dependência usa APIs internas do Node.js que foram depreciadas.

#### Soluções:

**1. Usar script sem avisos (Recomendado)**
```bash
npm run dev:no-warnings
```

**2. Configurar ambiente automaticamente**

**Windows (PowerShell):**
```bash
npm run setup:win
```

**Unix/Linux/Mac:**
```bash
npm run setup:unix
```

**3. Configuração manual**

**Windows PowerShell:**
```powershell
$env:NODE_OPTIONS="--no-deprecation"
npm run dev
```

**Windows CMD:**
```cmd
set NODE_OPTIONS=--no-deprecation
npm run dev
```

**Unix/Linux/Mac:**
```bash
export NODE_OPTIONS="--no-deprecation"
npm run dev
```

**4. Atualizar dependências**
```bash
npm run install:all
```

**5. Usar versão específica do Node.js**
```bash
nvm use 18.19.0
npm run dev
```

## 🚀 Problemas de Inicialização

### Erro: "Cannot find module"

**Solução:**
```bash
npm run install:all
```

### Erro: "Port already in use"

**Solução:**
```bash
# Verificar processos na porta 3001
netstat -ano | findstr :3001

# Matar processo (Windows)
taskkill /PID <PID> /F

# Matar processo (Unix/Linux)
kill -9 <PID>
```

### Erro: "Database locked"

**Solução:**
```bash
# Fazer backup e resetar
npm run db:reset
```

## 📱 Problemas do Frontend

### Erro: "Module not found"

**Solução:**
```bash
cd client
npm install
```

### Erro: "Vite dev server not responding"

**Solução:**
```bash
# Parar todos os processos
Ctrl+C

# Limpar cache
cd client
rm -rf node_modules/.vite
npm run dev
```

## 🗄️ Problemas do Backend

### Erro: "SQLite database error"

**Solução:**
```bash
# Verificar permissões do arquivo
ls -la data.db

# Recriar banco
npm run db:reset
```

### Erro: "TypeScript compilation failed"

**Solução:**
```bash
cd server
npm run build
```

## 🐳 Problemas do Docker

### Erro: "Container won't start"

**Solução:**
```bash
# Verificar logs
docker-compose logs app

# Reconstruir imagem
npm run docker:build
npm run docker:compose
```

### Erro: "Port already allocated"

**Solução:**
```bash
# Parar containers
npm run docker:compose:down

# Verificar portas em uso
netstat -ano | findstr :3001
```

## ☁️ Problemas de Deploy

### Erro: "Build failed on Railway"

**Solução:**
1. Verificar logs no Railway
2. Confirmar versão do Node.js (18.x)
3. Verificar se todos os arquivos estão commitados

### Erro: "Health check failed"

**Solução:**
1. Verificar se a rota `/health` está funcionando
2. Confirmar configuração do `railway.toml`
3. Verificar logs da aplicação

## 🔍 Verificação de Ambiente

### Comando para verificar configuração:
```bash
# Verificar versões
node --version
npm --version

# Verificar variáveis de ambiente
echo $NODE_OPTIONS
echo $NODE_ENV

# Verificar dependências
npm list --depth=0
```

### Arquivos de configuração importantes:
- `.nvmrc` - Versão do Node.js
- `package.json` - Scripts e dependências
- `railway.toml` - Configuração do Railway
- `docker-compose.yml` - Configuração do Docker

## 📞 Suporte Adicional

Se nenhuma das soluções acima resolver seu problema:

1. **Verificar logs completos:**
   ```bash
   npm run dev:server 2>&1 | tee server.log
   npm run dev:client 2>&1 | tee client.log
   ```

2. **Criar issue no GitHub** com:
   - Descrição detalhada do problema
   - Passos para reproduzir
   - Logs de erro
   - Versões do Node.js e npm
   - Sistema operacional

3. **Verificar documentação:**
   - [README.md](../README.md)
   - [DEVELOPMENT.md](./DEVELOPMENT.md)
   - [API_REFERENCE.md](./API_REFERENCE.md)

---

**💡 Dica:** Sempre use `npm run dev:no-warnings` para evitar avisos de depreciação durante o desenvolvimento!
