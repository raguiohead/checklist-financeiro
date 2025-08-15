# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-01-XX

### Adicionado
- ✨ **Checklist Financeiro Semanal** - Sistema completo de checklist para domingos
- 🎯 **4 Etapas Principais** - Revisão da semana passada e planejamento da próxima
- 💰 **Controle de Gastos** - Registro e categorização de gastos semanais
- 🎯 **Metas Financeiras** - Criação e acompanhamento de metas de economia
- 📊 **Dashboard Interativo** - Visão geral das finanças semanais
- 🔄 **Sistema de Migrações** - Controle de versões do banco de dados
- 💾 **Backup Automático** - Sistema de backup com compressão
- 🌱 **Dados Iniciais** - Scripts para popular o banco com exemplos

### Funcionalidades Técnicas
- 🚀 **Backend Node.js** com Express e TypeScript
- ⚛️ **Frontend React** com TypeScript e Vite
- 🎨 **Tailwind CSS** para estilização moderna
- 🗄️ **SQLite** como banco de dados (com suporte a PostgreSQL)
- 🐳 **Docker** para containerização
- 📱 **Design Responsivo** para mobile e desktop
- 🔒 **Segurança** com Helmet e CORS configurado
- 📈 **Performance** com índices otimizados

### Scripts de Desenvolvimento
- `npm run dev` - Desenvolvimento local
- `npm run build` - Build para produção
- `npm run db:backup` - Backup do banco
- `npm run db:migrate` - Executar migrações
- `npm run db:seed` - Popular dados iniciais
- `npm run docker:compose` - Usar Docker
- `npm run pm2:start` - Gerenciar processos

### Estrutura do Projeto
- **server/** - Backend Node.js com API REST
- **client/** - Frontend React com TypeScript
- **scripts/** - Scripts de banco de dados
- **docs/** - Documentação completa
- **deploy/** - Configurações de deploy

### Deploy
- 🚀 **Railway** - Configuração automática
- 📊 **Health Check** - Endpoint `/health`
- 🔄 **CI/CD** - GitHub Actions configurado
- 📝 **Documentação** - README completo e detalhado

### Próximas Versões
- [ ] **v1.1.0** - Autenticação de usuários
- [ ] **v1.2.0** - Múltiplas contas bancárias
- [ ] **v1.3.0** - Relatórios e exportação
- [ ] **v2.0.0** - App mobile React Native

---

## Como Contribuir

Para contribuir com este projeto:

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
