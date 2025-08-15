# 🛠️ Guia de Desenvolvimento

Este guia é destinado aos desenvolvedores que querem contribuir ou modificar a aplicação **Checklist Financeiro Semanal**.

## 🚀 Configuração do Ambiente

### Pré-requisitos

- **Node.js** 18.0.0 ou superior
- **npm** 8.0.0 ou superior
- **Git** para controle de versão
- **VS Code** (recomendado) ou editor de sua preferência

### Extensões VS Code Recomendadas

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

## 📦 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/checklist-financeiro.git
cd checklist-financeiro
```

### 2. Instale as Dependências

```bash
npm run install:all
```

Este comando instalará as dependências de:
- ✅ Projeto raiz
- ✅ Servidor backend
- ✅ Cliente frontend

### 3. Verifique a Instalação

```bash
# Verificar versões
node --version    # Deve ser >= 18.0.0
npm --version     # Deve ser >= 8.0.0

# Verificar dependências
npm list --depth=0
```

## 🔧 Scripts de Desenvolvimento

### Comandos Principais

```bash
# Desenvolvimento
npm run dev                    # Backend + Frontend simultaneamente
npm run dev:server            # Apenas backend (porta 3001)
npm run dev:client            # Apenas frontend (porta 3000)

# Build
npm run build                 # Build completo para produção
npm run build:server          # Build apenas do backend
npm run build:client          # Build apenas do frontend

# Banco de Dados
npm run db:backup             # Backup do banco
npm run db:migrate            # Executar migrações
npm run db:seed               # Popular dados iniciais
npm run db:reset              # Backup + limpar + popular

# Docker
npm run docker:compose        # Usar Docker Compose
npm run docker:build          # Build da imagem Docker
```

### Desenvolvimento Local

```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev:client
```

## 🏗️ Estrutura do Projeto

### Backend (`/server`)

```
server/
├── src/
│   ├── routes/           # Rotas da API
│   │   ├── checklist.ts  # Endpoints do checklist
│   │   ├── gastos.ts     # Endpoints de gastos
│   │   └── metas.ts      # Endpoints de metas
│   ├── database.ts       # Configuração e operações do banco
│   └── index.ts          # Servidor principal
├── package.json          # Dependências do backend
└── tsconfig.json         # Configuração TypeScript
```

### Frontend (`/client`)

```
client/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   └── Header.tsx    # Cabeçalho da aplicação
│   ├── contexts/         # Contextos React
│   │   ├── ChecklistContext.tsx
│   │   ├── GastosContext.tsx
│   │   └── MetasContext.tsx
│   ├── pages/            # Páginas da aplicação
│   │   ├── Dashboard.tsx
│   │   ├── Checklist.tsx
│   │   ├── Gastos.tsx
│   │   └── Metas.tsx
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Ponto de entrada
├── package.json          # Dependências do frontend
└── vite.config.ts        # Configuração Vite
```

### Scripts (`/scripts`)

```
scripts/
├── backup-db.js          # Backup e restauração do banco
├── migrate-db.js         # Sistema de migrações
└── seed-db.js            # População com dados iniciais
```

## 🗄️ Banco de Dados

### Estrutura das Tabelas

```sql
-- Checklist semanal
CREATE TABLE checklist_items (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria TEXT NOT NULL,
  ordem INTEGER NOT NULL,
  ativo BOOLEAN DEFAULT 1
);

-- Gastos
CREATE TABLE gastos (
  id TEXT PRIMARY KEY,
  descricao TEXT NOT NULL,
  valor REAL NOT NULL,
  categoria TEXT NOT NULL,
  data TEXT NOT NULL,
  semana TEXT NOT NULL,
  observacoes TEXT
);

-- Metas financeiras
CREATE TABLE metas (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  valor_objetivo REAL NOT NULL,
  valor_atual REAL DEFAULT 0,
  tipo TEXT NOT NULL,
  data_criacao TEXT NOT NULL,
  data_objetivo TEXT
);

-- Semanas financeiras
CREATE TABLE semanas_financeiras (
  id TEXT PRIMARY KEY,
  data_inicio TEXT NOT NULL,
  data_fim TEXT NOT NULL,
  limite_lazer REAL DEFAULT 0,
  limite_compras REAL DEFAULT 0,
  meta_economia REAL DEFAULT 0,
  status TEXT DEFAULT 'ativa'
);
```

### Operações do Banco

```typescript
// Exemplo de uso do Database
import { Database } from './database';

const db = new Database();

// Inicializar
await db.init();

// Checklist
const items = await db.getChecklistItems();

// Gastos
const gastos = await db.getGastosBySemana('2024-01-01');
await db.addGasto({ descricao: 'Almoço', valor: 25.50, ... });

// Metas
const metas = await db.getMetas();
await db.addMeta({ titulo: 'Viagem', valor_objetivo: 5000, ... });
```

## 🔌 API Endpoints

### Checklist

```typescript
// GET /api/checklist
interface ChecklistResponse {
  success: boolean;
  data: ChecklistItem[];
  message: string;
}

interface ChecklistItem {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'revisao' | 'planejamento';
  ordem: number;
  ativo: boolean;
}
```

### Gastos

```typescript
// GET /api/gastos/semana/:semana
// GET /api/gastos/categoria/:categoria
// POST /api/gastos

interface GastoRequest {
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  semana: string;
  observacoes?: string;
}

interface GastoResponse {
  success: boolean;
  data: {
    gastos: Gasto[];
    total: number;
    quantidade: number;
  };
  message: string;
}
```

### Metas

```typescript
// GET /api/metas
// POST /api/metas
// PUT /api/metas/:id/progresso

interface MetaRequest {
  titulo: string;
  valor_objetivo: number;
  tipo: 'reserva_emergencia' | 'viagem' | 'outro';
  data_objetivo?: string;
}

interface MetaResponse {
  success: boolean;
  data: Meta[];
  message: string;
}
```

## 🎨 Frontend

### Componentes

```typescript
// Exemplo de componente
import React from 'react';
import { useChecklist } from '../contexts/ChecklistContext';

interface ChecklistProps {
  title?: string;
}

export const Checklist: React.FC<ChecklistProps> = ({ title = 'Checklist' }) => {
  const { items, loading, error } = useChecklist();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      {items.map(item => (
        <div key={item.id} className="p-4 border rounded">
          <h3>{item.titulo}</h3>
          <p>{item.descricao}</p>
        </div>
      ))}
    </div>
  );
};
```

### Contextos

```typescript
// Exemplo de uso de contexto
import { useGastos } from '../contexts/GastosContext';

const GastosPage = () => {
  const { gastos, addGasto, loading } = useGastos();

  const handleSubmit = async (formData: GastoFormData) => {
    const success = await addGasto(formData);
    if (success) {
      // Mostrar mensagem de sucesso
    }
  };

  return (
    <div>
      {/* Formulário e lista de gastos */}
    </div>
  );
};
```

### Estilização

```typescript
// Tailwind CSS classes
const buttonClasses = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded',
  danger: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded'
};

// Componente com classes condicionais
<button 
  className={clsx(
    'font-medium transition-colors duration-200',
    buttonClasses.primary
  )}
>
  Salvar
</button>
```

## 🧪 Testes

### Estrutura de Testes

```bash
# Criar estrutura de testes
mkdir -p __tests__/{unit,integration,e2e}

# Testes unitários
npm test

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e
```

### Exemplo de Teste

```typescript
// __tests__/unit/Checklist.test.tsx
import { render, screen } from '@testing-library/react';
import { Checklist } from '../../src/components/Checklist';

describe('Checklist Component', () => {
  it('should render checklist items', () => {
    render(<Checklist />);
    
    expect(screen.getByText('Checklist Financeiro Semanal')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    // Mock loading state
    render(<Checklist />);
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});
```

## 🔄 Migrações

### Criar Nova Migração

```typescript
// scripts/migrate-db.js
const migrations = [
  // ... migrações existentes
  {
    version: 4,
    name: 'Add notifications table',
    sql: `
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        read BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
    `
  }
];
```

### Executar Migrações

```bash
# Verificar status
npm run db:migrate status

# Executar migrações pendentes
npm run db:migrate

# Ajuda
npm run db:migrate help
```

## 🐳 Docker

### Desenvolvimento com Docker

```bash
# Usar Docker Compose
npm run docker:compose

# Build manual
npm run docker:build

# Executar container
npm run docker:run
```

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar dependências
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Instalar dependências
RUN npm run install:all

# Copiar código
COPY . .

# Build da aplicação
RUN npm run build

# Expor porta
EXPOSE 3001

# Comando de inicialização
CMD ["npm", "start"]
```

## 📝 Padrões de Código

### TypeScript

```typescript
// Sempre use tipos explícitos
interface User {
  id: string;
  name: string;
  email: string;
}

// Use generics quando apropriado
function createRepository<T>(entity: T): Repository<T> {
  return new Repository(entity);
}

// Evite any, use unknown quando necessário
function processData(data: unknown): string {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
  throw new Error('Invalid data type');
}
```

### React

```typescript
// Use hooks personalizados para lógica reutilizável
const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};
```

### CSS/Tailwind

```typescript
// Use classes utilitárias do Tailwind
const cardVariants = {
  default: 'bg-white border border-gray-200 rounded-lg shadow-sm',
  elevated: 'bg-white border border-gray-200 rounded-lg shadow-lg',
  outlined: 'bg-transparent border-2 border-gray-300 rounded-lg'
};

// Componente com variantes
const Card: React.FC<{ variant?: keyof typeof cardVariants }> = ({ 
  variant = 'default', 
  children 
}) => (
  <div className={clsx('p-6', cardVariants[variant])}>
    {children}
  </div>
);
```

## 🔍 Debugging

### Backend

```typescript
// Logs estruturados
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Uso
logger.info('User logged in', { userId: '123', timestamp: new Date() });
logger.error('Database connection failed', { error: err.message });
```

### Frontend

```typescript
// React DevTools
import { useDebugValue } from 'react';

const useChecklist = () => {
  const [items, setItems] = useState([]);
  
  useDebugValue(`Checklist items: ${items.length}`);
  
  return { items, setItems };
};

// Console logs condicionais
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', { items, loading, error });
}
```

## 🚀 Deploy

### Build para Produção

```bash
# Build completo
npm run build

# Verificar arquivos gerados
ls -la dist/
ls -la server/dist/
ls -la client/dist/

# Testar build localmente
npm start
```

### Variáveis de Ambiente

```bash
# .env.local (não commitar)
NODE_ENV=development
PORT=3001
DATABASE_URL=sqlite:./data.db

# .env.production (não commitar)
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/db
```

## 🤝 Contribuição

### Fluxo de Trabalho

1. **Fork** o repositório
2. **Clone** seu fork
3. **Crie** uma branch para sua feature
4. **Desenvolva** e teste sua feature
5. **Commit** suas mudanças
6. **Push** para sua branch
7. **Abra** um Pull Request

### Commits

```bash
# Use conventional commits
git commit -m "feat: add user authentication"
git commit -m "fix: resolve database connection issue"
git commit -m "docs: update API documentation"
git commit -m "style: improve button styling"
git commit -m "refactor: simplify checklist logic"
git commit -m "test: add unit tests for gastos"
```

### Pull Request

- 📝 **Descrição clara** da mudança
- 🧪 **Testes** incluídos
- 📚 **Documentação** atualizada
- ✅ **Checklist** preenchido
- 🎯 **Issue** relacionada (se aplicável)

## 📚 Recursos Adicionais

### Documentação

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Express.js](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/docs.html)

### Ferramentas

- **Postman/Insomnia**: Testar APIs
- **SQLite Browser**: Visualizar banco
- **React DevTools**: Debug React
- **Redux DevTools**: Debug estado
- **Lighthouse**: Performance

---

**🎯 Dica**: Sempre teste suas mudanças localmente antes de fazer commit!

Para dúvidas ou problemas:
1. 📖 Consulte a documentação
2. 🔍 Procure em issues existentes
3. 💬 Abra uma nova issue
4. 🆘 Peça ajuda na comunidade
