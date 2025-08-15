# 📊 Checklist Financeiro Semanal

**Seu Ritual de Domingo para Organizar as Finanças da Semana**

Um aplicativo web completo para acompanhar suas finanças semanais, baseado no conceito de checklist financeiro que deve ser executado todo domingo para manter o controle financeiro.

## ✨ Funcionalidades

### 🎯 Checklist Semanal
- **Etapa 1: Olhar para Trás (A Semana que Passou)**
  - Revisar os Gastos da Semana (5 min)
  - Atualizar a Planilha ou App de Controle (5 min)

- **Etapa 2: Olhar para Frente (A Semana que Vem)**
  - Definir Limites para a Semana Seguinte (5 min)
  - Verificar o Progresso das Metas (5 min)

### 💰 Controle de Gastos
- Registro de gastos por categoria
- Acompanhamento semanal
- Visualização por categoria
- Gráficos de progresso

### 🎯 Metas Financeiras
- Criação de metas personalizadas
- Acompanhamento de progresso
- Tipos: Reserva de Emergência, Viagem, Outros
- Prazos opcionais

### 📱 Dashboard Interativo
- Visão geral da semana
- Progresso do checklist
- Resumo de gastos
- Status das metas

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com **Express**
- **TypeScript** para tipagem
- **SQLite** como banco de dados
- **UUID** para identificadores únicos

### Frontend
- **React 18** com **TypeScript**
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **React Router** para navegação
- **Lucide React** para ícones
- **Date-fns** para manipulação de datas

### Deploy
- **Railway** para hospedagem gratuita
- Configuração automática de build

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd checklist-financeiro
```

### 2. Instale as dependências
```bash
npm run install:all
```

### 3. Execute em desenvolvimento
```bash
npm run dev
```

Isso iniciará:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000

### 4. Build para produção
```bash
npm run build
```

## 🗄️ Gerenciamento do Banco de Dados

### Scripts Disponíveis

```bash
# Backup e Restauração
npm run db:backup              # Criar backup do banco
npm run db:backup create       # Backup normal
npm run db:backup create:compressed  # Backup comprimido
npm run db:backup restore <arquivo>  # Restaurar backup
npm run db:backup list         # Listar backups

# Migrações
npm run db:migrate             # Executar migrações pendentes
npm run db:migrate status      # Status das migrações
npm run db:migrate help        # Ajuda sobre migrações

# Dados Iniciais
npm run db:seed                # Popular com dados de exemplo
npm run db:seed --clear        # Limpar e popular
npm run db:reset               # Backup + limpar + popular
```

### Estrutura do Banco

- **checklist_items**: Itens do checklist semanal
- **gastos**: Registro de gastos por semana
- **metas**: Metas financeiras e progresso
- **semanas_financeiras**: Configurações semanais
- **migrations**: Controle de versões do banco

### Migrações Disponíveis

1. **v1**: Schema inicial (tabelas principais)
2. **v2**: Índices para performance
3. **v3**: Preferências do usuário

## 🏗️ Estrutura do Projeto

```
checklist-financeiro/
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── routes/        # Rotas da API
│   │   ├── database.ts    # Configuração do banco
│   │   └── index.ts       # Servidor principal
│   ├── package.json
│   └── tsconfig.json
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── contexts/      # Contextos React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── App.tsx        # Componente principal
│   │   └── main.tsx       # Ponto de entrada
│   ├── package.json
│   └── vite.config.ts
├── scripts/                # Scripts de banco de dados
│   ├── backup-db.js       # Backup e restauração
│   ├── migrate-db.js      # Migrações
│   └── seed-db.js         # Dados iniciais
├── package.json            # Scripts principais
├── railway.json           # Configuração Railway
├── docker-compose.yml     # Docker para desenvolvimento
└── Dockerfile             # Containerização
```

## 🔌 API Endpoints

### Checklist
- `GET /api/checklist` - Obter itens do checklist

### Gastos
- `GET /api/gastos/semana/:semana` - Gastos por semana
- `GET /api/gastos/categoria/:categoria` - Gastos por categoria
- `POST /api/gastos` - Adicionar novo gasto

### Metas
- `GET /api/metas` - Obter todas as metas
- `POST /api/metas` - Criar nova meta
- `PUT /api/metas/:id/progresso` - Atualizar progresso

## 🚀 Deploy no Railway

### 1. Conecte seu repositório
- Acesse [railway.app](https://railway.app)
- Conecte com GitHub/GitLab
- Selecione este repositório

### 2. Configuração automática
O Railway detectará automaticamente:
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Health Check**: `/health`

### 3. Variáveis de ambiente (opcional)
```env
NODE_ENV=production
PORT=3000
```

## 🐳 Docker

### Desenvolvimento Local
```bash
# Usar Docker Compose
npm run docker:compose

# Parar containers
npm run docker:compose:down

# Build manual
npm run docker:build
npm run docker:run
```

### Produção
```bash
# Build da imagem
docker build -t checklist-financeiro .

# Executar container
docker run -p 3001:3001 checklist-financeiro
```

## 📊 Monitoramento e Processos

### PM2 (Process Manager)
```bash
# Gerenciar processos
npm run pm2:start          # Iniciar aplicação
npm run pm2:stop           # Parar aplicação
npm run pm2:restart        # Reiniciar aplicação
npm run pm2:logs           # Ver logs
npm run pm2:status         # Status dos processos
```

### Logs e Monitoramento
- Logs automáticos em `./logs/`
- Health check em `/health`
- Métricas de performance
- Restart automático em caso de falha

## 🎨 Personalização

### Cores
Edite `client/tailwind.config.js` para personalizar:
- Cores primárias
- Cores de sucesso/aviso
- Paleta de cores

### Checklist
Modifique `server/src/database.ts` para:
- Adicionar novos itens
- Alterar descrições
- Modificar categorias

### Categorias de Gastos
Edite `client/src/pages/Gastos.tsx` para:
- Adicionar novas categorias
- Modificar existentes

## 🔧 Scripts Disponíveis

```json
{
  "dev": "Executa backend e frontend simultaneamente",
  "dev:server": "Executa apenas o backend",
  "dev:client": "Executa apenas o frontend",
  "dev:no-warnings": "Executa sem avisos de depreciação",
  "build": "Build completo para produção",
  "start": "Inicia aplicação em produção",
  "install:all": "Instala todas as dependências",
  
  "db:backup": "Fazer backup do banco de dados",
  "db:migrate": "Executar migrações pendentes",
  "db:seed": "Popular com dados iniciais",
  "db:reset": "Backup + limpar + popular",
  
  "docker:build": "Build da imagem Docker",
  "docker:run": "Executar container Docker",
  "docker:compose": "Usar Docker Compose",
  
  "pm2:start": "Iniciar com PM2",
  "pm2:stop": "Parar aplicação PM2",
  "pm2:restart": "Reiniciar aplicação PM2"
}
```

## ⚠️ Resolução de Avisos de Depreciação

Se você encontrar avisos como `[DEP0060] DeprecationWarning: The util._extend API is deprecated`:

### Solução 1: Usar script sem avisos
```bash
npm run dev:no-warnings
```

### Solução 2: Configurar variáveis de ambiente
```bash
# Windows PowerShell
$env:NODE_OPTIONS="--no-deprecation"
npm run dev

# Windows CMD
set NODE_OPTIONS=--no-deprecation
npm run dev

# Linux/Mac
export NODE_OPTIONS="--no-deprecation"
npm run dev
```

### Solução 3: Atualizar dependências
```bash
npm run install:all
```

### Solução 4: Usar versão específica do Node.js
```bash
# Usar Node.js 18.19.0 (recomendado)
nvm use 18.19.0
npm run dev
```

**Nota**: Os avisos de depreciação não afetam a funcionalidade da aplicação, mas são suprimidos automaticamente em produção.

## 🔄 Migração para PostgreSQL

Para migrar do SQLite para PostgreSQL:

1. **Instale dependências**:
   ```bash
   cd server && npm install pg @types/pg
   ```

2. **Configure variáveis de ambiente**:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/checklist_financeiro
   ```

3. **Use o arquivo de exemplo**:
   - Copie `server/src/database-postgres.ts` para `server/src/database.ts`
   - Ajuste as configurações de conexão

4. **Execute migrações**:
   ```bash
   npm run db:migrate
   ```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- Inspirado no conceito de checklist financeiro semanal
- Ícones por [Lucide](https://lucide.dev/)
- Estilização com [Tailwind CSS](https://tailwindcss.com/)
- Deploy gratuito com [Railway](https://railway.app/)

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões:
1. Abra uma [Issue](https://github.com/seu-usuario/checklist-financeiro/issues)
2. Descreva o problema detalhadamente
3. Inclua passos para reproduzir

## 🚀 Roadmap

### Próximas Funcionalidades
- [ ] Autenticação de usuários
- [ ] Múltiplas contas bancárias
- [ ] Relatórios mensais/anuais
- [ ] Notificações e lembretes
- [ ] Exportação de dados (CSV, PDF)
- [ ] Integração com APIs bancárias
- [ ] App mobile (React Native)

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] Cache Redis
- [ ] Rate limiting
- [ ] Logs estruturados
- [ ] Métricas Prometheus
- [ ] CI/CD completo

---

**🎯 Lembre-se: Cada domingo é uma nova oportunidade para organizar suas finanças e alcançar suas metas!**
