# 🚀 Guia de Deploy no Railway

Este guia detalha como fazer o deploy da aplicação **Checklist Financeiro Semanal** na plataforma Railway.

## 📋 Pré-requisitos

- ✅ Conta no [Railway](https://railway.app)
- ✅ Repositório GitHub/GitLab configurado
- ✅ Node.js 18+ no projeto
- ✅ Scripts de build configurados

## 🔧 Configuração do Projeto

### 1. Verificar Scripts no package.json

Certifique-se de que seu `package.json` tenha os scripts necessários:

```json
{
  "scripts": {
    "build": "npm run build:server && npm run build:client",
    "build:server": "cd server && npm run build",
    "build:client": "cd client && npm run build",
    "start": "cd server && npm start"
  }
}
```

### 2. Verificar Railway Configuration

O arquivo `railway.json` deve estar configurado:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 3. Verificar Health Check

Certifique-se de que o endpoint `/health` está funcionando:

```typescript
// server/src/index.ts
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Checklist Financeiro API funcionando!' });
});
```

## 🚀 Deploy no Railway

### Passo 1: Acessar Railway

1. Acesse [railway.app](https://railway.app)
2. Faça login com sua conta GitHub/GitLab
3. Clique em **"New Project"**

### Passo 2: Conectar Repositório

1. Selecione **"Deploy from GitHub repo"**
2. Escolha o repositório `checklist-financeiro`
3. Clique em **"Deploy Now"**

### Passo 3: Configuração Automática

O Railway detectará automaticamente:
- **Framework**: Node.js
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: 3001 (ou variável PORT)

### Passo 4: Variáveis de Ambiente

Configure as seguintes variáveis de ambiente:

```env
NODE_ENV=production
PORT=3001
```

**Como configurar:**
1. No projeto Railway, vá para **"Variables"**
2. Adicione cada variável
3. Clique em **"Add"**

### Passo 5: Deploy

1. O Railway iniciará o build automaticamente
2. Aguarde a conclusão do build
3. A aplicação estará disponível na URL fornecida

## 🔍 Verificação do Deploy

### 1. Health Check

Teste o endpoint de saúde:
```bash
curl https://seu-app.railway.app/health
```

Resposta esperada:
```json
{
  "status": "OK",
  "message": "Checklist Financeiro API funcionando!"
}
```

### 2. Logs

Verifique os logs no Railway:
1. Vá para **"Deployments"**
2. Clique no deployment mais recente
3. Verifique se não há erros

### 3. Funcionalidades

Teste as principais funcionalidades:
- ✅ Dashboard principal
- ✅ Checklist semanal
- ✅ Controle de gastos
- ✅ Metas financeiras

## 🛠️ Solução de Problemas

### Erro: Build Failed

**Possíveis causas:**
- Dependências não instaladas
- Scripts de build incorretos
- Erro de TypeScript

**Solução:**
1. Verifique os logs de build
2. Teste localmente: `npm run build`
3. Corrija os erros e faça novo commit

### Erro: App não inicia

**Possíveis causas:**
- Porta incorreta
- Dependências faltando
- Erro no servidor

**Solução:**
1. Verifique a variável `PORT`
2. Teste localmente: `npm start`
3. Verifique os logs de runtime

### Erro: Banco de dados

**Possíveis causas:**
- SQLite não tem permissão de escrita
- Erro na inicialização do banco

**Solução:**
1. Verifique permissões de arquivo
2. Use PostgreSQL em produção
3. Configure variáveis de banco

## 🔄 Deploy Automático

### GitHub Actions

Configure o workflow `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [ main, master ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to Railway
      uses: bervProject/railway-deploy@v1.0.0
      with:
        railway_token: ${{ secrets.RAILWAY_TOKEN }}
        service: ${{ secrets.RAILWAY_SERVICE }}
```

### Configurar Secrets

1. No GitHub, vá para **Settings > Secrets and variables > Actions**
2. Adicione:
   - `RAILWAY_TOKEN`: Token do Railway
   - `RAILWAY_SERVICE`: ID do serviço

## 📊 Monitoramento

### Métricas Disponíveis

- **Uptime**: Tempo de funcionamento
- **Response Time**: Tempo de resposta
- **Error Rate**: Taxa de erros
- **Resource Usage**: Uso de recursos

### Alertas

Configure alertas para:
- ⚠️ **Downtime**: App offline
- ⚠️ **High Error Rate**: Muitos erros
- ⚠️ **High Response Time**: Resposta lenta

## 🔒 Segurança

### Recomendações

1. **HTTPS**: Ativado automaticamente
2. **CORS**: Configurado para produção
3. **Helmet**: Headers de segurança
4. **Rate Limiting**: Considere implementar

### Variáveis Sensíveis

Nunca commite:
- 🔑 **API Keys**
- 🔐 **Senhas de banco**
- 🎫 **Tokens de acesso**

## 💰 Custos

### Plano Gratuito

- ✅ **500 horas/mês** de execução
- ✅ **1GB** de RAM
- ✅ **1GB** de armazenamento
- ✅ **Domínio personalizado**

### Planos Pagos

- 💳 **$5/mês**: 1000 horas, 2GB RAM
- 💳 **$20/mês**: 2000 horas, 4GB RAM

## 🚀 Próximos Passos

### Após o Deploy

1. **Teste** todas as funcionalidades
2. **Configure** domínio personalizado
3. **Monitore** performance
4. **Configure** alertas

### Melhorias

1. **PostgreSQL**: Migre do SQLite
2. **Redis**: Cache para performance
3. **CDN**: Para assets estáticos
4. **Logs**: Sistema de logs estruturados

## 📞 Suporte

### Recursos

- 📚 [Documentação Railway](https://docs.railway.app/)
- 💬 [Discord Community](https://discord.gg/railway)
- 🐛 [GitHub Issues](https://github.com/seu-usuario/checklist-financeiro/issues)

### Comandos Úteis

```bash
# Verificar status
railway status

# Ver logs
railway logs

# Conectar via SSH
railway connect

# Variáveis de ambiente
railway variables
```

---

**🎉 Parabéns! Sua aplicação está rodando no Railway!**

Lembre-se de:
- ✅ Monitorar regularmente
- ✅ Fazer backups do banco
- ✅ Atualizar dependências
- ✅ Testar funcionalidades
