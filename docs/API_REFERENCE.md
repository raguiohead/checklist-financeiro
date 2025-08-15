# 🔌 Referência da API

Documentação completa da API REST do **Checklist Financeiro Semanal**.

## 📋 Visão Geral

- **Base URL**: `https://seu-app.railway.app/api`
- **Versão**: v1.0.0
- **Formato**: JSON
- **Autenticação**: Não implementada na v1.0.0

## 🔐 Autenticação

> **Nota**: A autenticação será implementada na versão 1.1.0

## 📊 Respostas da API

### Formato Padrão

```json
{
  "success": true,
  "data": {},
  "message": "Operação realizada com sucesso"
}
```

### Resposta de Erro

```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Código do erro (opcional)"
}
```

### Códigos de Status HTTP

- `200` - Sucesso
- `201` - Criado
- `400` - Requisição inválida
- `404` - Não encontrado
- `500` - Erro interno do servidor

## 🎯 Checklist

### Obter Itens do Checklist

```http
GET /api/checklist
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "titulo": "Revisar os Gastos da Semana",
      "descricao": "Abra o aplicativo do seu banco e a fatura do cartão de crédito...",
      "categoria": "revisao",
      "ordem": 1,
      "ativo": true
    }
  ],
  "message": "Checklist carregado com sucesso!"
}
```

**Campos:**
- `id`: Identificador único (UUID)
- `titulo`: Título da tarefa
- `descricao`: Descrição detalhada
- `categoria`: "revisao" ou "planejamento"
- `ordem`: Ordem de execução
- `ativo`: Se o item está ativo

## 💰 Gastos

### Obter Gastos por Semana

```http
GET /api/gastos/semana/{semana}
```

**Parâmetros:**
- `semana`: Identificador da semana (ex: "2024-01-01")

**Resposta:**
```json
{
  "success": true,
  "data": {
    "gastos": [
      {
        "id": "uuid-123",
        "descricao": "Supermercado",
        "valor": 350.50,
        "categoria": "Mercado",
        "data": "2024-01-15",
        "semana": "2024-01-01",
        "observacoes": "Compras da semana"
      }
    ],
    "total": 350.50,
    "quantidade": 1
  },
  "message": "Gastos da semana 2024-01-01 carregados com sucesso!"
}
```

### Obter Gastos por Categoria

```http
GET /api/gastos/categoria/{categoria}
```

**Parâmetros:**
- `categoria`: Nome da categoria (ex: "Mercado", "Lazer/Restaurantes")

**Resposta:** Mesmo formato da rota por semana

### Adicionar Novo Gasto

```http
POST /api/gastos
```

**Corpo da Requisição:**
```json
{
  "descricao": "Almoço no restaurante",
  "valor": 45.00,
  "categoria": "Lazer/Restaurantes",
  "data": "2024-01-15",
  "semana": "2024-01-01",
  "observacoes": "Almoço com amigos"
}
```

**Campos Obrigatórios:**
- `descricao`: Descrição do gasto
- `valor`: Valor em reais (número)
- `categoria`: Categoria do gasto
- `data`: Data no formato YYYY-MM-DD
- `semana`: Identificador da semana

**Campos Opcionais:**
- `observacoes`: Observações adicionais

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-456"
  },
  "message": "Gasto adicionado com sucesso!"
}
```

## 🎯 Metas

### Obter Todas as Metas

```http
GET /api/metas
```

**Resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-789",
      "titulo": "Reserva de Emergência",
      "valor_objetivo": 10000,
      "valor_atual": 2500,
      "tipo": "reserva_emergencia",
      "data_criacao": "2024-01-01",
      "data_objetivo": "2024-12-31"
    }
  ],
  "message": "Metas carregadas com sucesso!"
}
```

**Campos:**
- `id`: Identificador único (UUID)
- `titulo`: Título da meta
- `valor_objetivo`: Valor objetivo em reais
- `valor_atual`: Valor atual em reais
- `tipo`: "reserva_emergencia", "viagem" ou "outro"
- `data_criacao`: Data de criação (YYYY-MM-DD)
- `data_objetivo`: Data objetivo (YYYY-MM-DD, opcional)

### Criar Nova Meta

```http
POST /api/metas
```

**Corpo da Requisição:**
```json
{
  "titulo": "Viagem para Europa",
  "valor_objetivo": 15000,
  "tipo": "viagem",
  "data_objetivo": "2024-12-31"
}
```

**Campos Obrigatórios:**
- `titulo`: Título da meta
- `valor_objetivo`: Valor objetivo em reais
- `tipo`: Tipo da meta

**Campos Opcionais:**
- `data_objetivo`: Data objetivo (YYYY-MM-DD)

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-abc"
  },
  "message": "Meta criada com sucesso!"
}
```

### Atualizar Progresso da Meta

```http
PUT /api/metas/{id}/progresso
```

**Parâmetros:**
- `id`: ID da meta (UUID)

**Corpo da Requisição:**
```json
{
  "valor_atual": 5000
}
```

**Campos Obrigatórios:**
- `valor_atual`: Novo valor atual em reais

**Resposta:**
```json
{
  "success": true,
  "message": "Progresso da meta atualizado com sucesso!"
}
```

## 📅 Semanas Financeiras

### Obter Semana Ativa

```http
GET /api/semanas/ativa
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-def",
    "data_inicio": "2024-01-15",
    "data_fim": "2024-01-21",
    "limite_lazer": 200,
    "limite_compras": 100,
    "meta_economia": 500,
    "status": "ativa"
  },
  "message": "Semana ativa carregada com sucesso!"
}
```

**Campos:**
- `id`: Identificador único (UUID)
- `data_inicio`: Data de início da semana
- `data_fim`: Data de fim da semana
- `limite_lazer`: Limite para gastos de lazer
- `limite_compras`: Limite para compras não essenciais
- `meta_economia`: Meta de economia para a semana
- `status`: "ativa" ou "concluida"

## 🔍 Filtros e Paginação

### Paginação (Futuro)

```http
GET /api/gastos?page=1&limit=10
```

**Parâmetros de Query:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20)

### Filtros por Data (Futuro)

```http
GET /api/gastos?data_inicio=2024-01-01&data_fim=2024-01-31
```

**Parâmetros de Query:**
- `data_inicio`: Data de início (YYYY-MM-DD)
- `data_fim`: Data de fim (YYYY-MM-DD)

## 📊 Estatísticas

### Resumo Geral (Futuro)

```http
GET /api/estatisticas/geral
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "total_gastos_mes": 2500.75,
    "total_metas": 3,
    "progresso_medio_metas": 65.5,
    "categoria_mais_cara": "Mercado",
    "economia_mes": 500.25
  },
  "message": "Estatísticas carregadas com sucesso!"
}
```

## 🚨 Tratamento de Erros

### Erro de Validação

```json
{
  "success": false,
  "message": "Todos os campos obrigatórios devem ser preenchidos",
  "error": "VALIDATION_ERROR"
}
```

### Erro de Recurso Não Encontrado

```json
{
  "success": false,
  "message": "Meta não encontrada",
  "error": "NOT_FOUND"
}
```

### Erro Interno do Servidor

```json
{
  "success": false,
  "message": "Erro interno do servidor",
  "error": "INTERNAL_ERROR"
}
```

## 🔧 Health Check

### Verificar Status da API

```http
GET /health
```

**Resposta:**
```json
{
  "status": "OK",
  "message": "Checklist Financeiro API funcionando!",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

## 📱 Exemplos de Uso

### JavaScript/Node.js

```javascript
// Obter checklist
const response = await fetch('/api/checklist');
const data = await response.json();

if (data.success) {
  console.log('Checklist:', data.data);
} else {
  console.error('Erro:', data.message);
}

// Adicionar gasto
const novoGasto = {
  descricao: 'Uber',
  valor: 25.00,
  categoria: 'Transporte',
  data: '2024-01-15',
  semana: '2024-01-01',
  observacoes: 'Transporte para reunião'
};

const response = await fetch('/api/gastos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(novoGasto)
});

const result = await response.json();
console.log('Gasto criado:', result.data.id);
```

### Python

```python
import requests

# Obter metas
response = requests.get('/api/metas')
data = response.json()

if data['success']:
    metas = data['data']
    for meta in metas:
        print(f"Meta: {meta['titulo']} - R$ {meta['valor_objetivo']}")
else:
    print(f"Erro: {data['message']}")

# Criar meta
nova_meta = {
    'titulo': 'Entrada do Apartamento',
    'valor_objetivo': 50000,
    'tipo': 'outro',
    'data_objetivo': '2025-06-30'
}

response = requests.post('/api/metas', json=nova_meta)
result = response.json()

if result['success']:
    print(f"Meta criada com ID: {result['data']['id']}")
```

### cURL

```bash
# Obter checklist
curl -X GET "https://seu-app.railway.app/api/checklist"

# Adicionar gasto
curl -X POST "https://seu-app.railway.app/api/gastos" \
  -H "Content-Type: application/json" \
  -d '{
    "descricao": "Netflix",
    "valor": 39.90,
    "categoria": "Contas",
    "data": "2024-01-15",
    "semana": "2024-01-01"
  }'

# Atualizar progresso da meta
curl -X PUT "https://seu-app.railway.app/api/metas/uuid-123/progresso" \
  -H "Content-Type: application/json" \
  -d '{"valor_atual": 3000}'
```

## 🔄 Rate Limiting

> **Nota**: Rate limiting será implementado na versão 1.2.0

## 📈 Monitoramento

### Logs da API

A API registra logs para:
- ✅ Requisições recebidas
- ✅ Respostas enviadas
- ✅ Erros ocorridos
- ✅ Performance das operações

### Métricas Disponíveis

- **Response Time**: Tempo de resposta médio
- **Request Count**: Número de requisições
- **Error Rate**: Taxa de erros
- **Active Connections**: Conexões ativas

## 🚀 Próximas Versões

### v1.1.0 - Autenticação
- 🔐 JWT tokens
- 👤 Sistema de usuários
- 🔒 Middleware de autenticação

### v1.2.0 - Funcionalidades Avançadas
- 📊 Relatórios e gráficos
- 📅 Lembretes e notificações
- 🔄 Rate limiting
- 📱 Webhooks

### v1.3.0 - Integrações
- 🏦 APIs bancárias
- 💳 Cartões de crédito
- 📱 App mobile
- 🔗 Integração com outros serviços

## 📞 Suporte

### Recursos de Ajuda

- 📚 **Documentação**: Este arquivo
- 🐛 **Issues**: [GitHub Issues](https://github.com/seu-usuario/checklist-financeiro/issues)
- 💬 **Discord**: [Comunidade](https://discord.gg/checklist-financeiro)
- 📧 **Email**: suporte@checklist-financeiro.com

### Status da API

- 🌐 **Status Page**: [status.checklist-financeiro.com](https://status.checklist-financeiro.com)
- 📊 **Uptime**: Monitoramento 24/7
- 🔔 **Alertas**: Notificações automáticas

---

**🎯 Dica**: Use o endpoint `/health` para verificar se a API está funcionando antes de fazer requisições importantes!
