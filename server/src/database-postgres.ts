// Arquivo de exemplo para migração para PostgreSQL
// Para usar, instale: npm install pg @types/pg
// E substitua o arquivo database.ts por este

/*
import { Pool } from 'pg';

export class DatabasePostgres {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }

  async init(): Promise<void> {
    const client = await this.pool.connect();
    try {
      // Criar tabelas
      await client.query(`
        CREATE TABLE IF NOT EXISTS checklist_items (
          id UUID PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          descricao TEXT NOT NULL,
          categoria VARCHAR(50) NOT NULL,
          ordem INTEGER NOT NULL,
          ativo BOOLEAN DEFAULT true
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS gastos (
          id UUID PRIMARY KEY,
          descricao VARCHAR(255) NOT NULL,
          valor DECIMAL(10,2) NOT NULL,
          categoria VARCHAR(100) NOT NULL,
          data DATE NOT NULL,
          semana VARCHAR(50) NOT NULL,
          observacoes TEXT
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS metas (
          id UUID PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          valor_objetivo DECIMAL(10,2) NOT NULL,
          valor_atual DECIMAL(10,2) DEFAULT 0,
          tipo VARCHAR(50) NOT NULL,
          data_criacao DATE NOT NULL,
          data_objetivo DATE
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS semanas_financeiras (
          id UUID PRIMARY KEY,
          data_inicio DATE NOT NULL,
          data_fim DATE NOT NULL,
          limite_lazer DECIMAL(10,2) DEFAULT 0,
          limite_compras DECIMAL(10,2) DEFAULT 0,
          meta_economia DECIMAL(10,2) DEFAULT 0,
          status VARCHAR(20) DEFAULT 'ativa'
        )
      `);

      // Inserir dados iniciais
      await this.insertInitialChecklist(client);
    } finally {
      client.release();
    }
  }

  private async insertInitialChecklist(client: any): Promise<void> {
    const checklistItems = [
      {
        titulo: 'Revisar os Gastos da Semana',
        descricao: 'Abra o aplicativo do seu banco e a fatura do cartão de crédito. Role por todas as transações feitas desde a última segunda-feira.',
        categoria: 'revisao',
        ordem: 1,
        ativo: true
      },
      // ... outros itens
    ];

    for (const item of checklistItems) {
      await client.query(
        'INSERT INTO checklist_items (id, titulo, descricao, categoria, ordem, ativo) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [item.titulo, item.descricao, item.categoria, item.ordem, item.ativo]
      );
    }
  }

  // Implementar outros métodos similares...
}
*/
