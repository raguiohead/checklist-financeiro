import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Database } from './database';
import { checklistRoutes } from './routes/checklist';
import { gastosRoutes } from './routes/gastos';
import { metasRoutes } from './routes/metas';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Inicializar banco de dados
const db = new Database();
db.init();

// Rotas
app.use('/api/checklist', checklistRoutes);
app.use('/api/gastos', gastosRoutes);
app.use('/api/metas', metasRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Checklist Financeiro API funcionando!' });
});

// Servir arquivos estáticos do frontend em produção
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/dist'));
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: '../client/dist' });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 API disponível em http://localhost:${PORT}/api`);
});
