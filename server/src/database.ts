import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export interface ChecklistItem {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'revisao' | 'planejamento';
  ordem: number;
  ativo: boolean;
}

export interface Gasto {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  semana: string;
  observacoes?: string;
}

export interface Meta {
  id: string;
  titulo: string;
  valor_objetivo: number;
  valor_atual: number;
  tipo: 'reserva_emergencia' | 'viagem' | 'outro';
  data_criacao: string;
  data_objetivo?: string;
}

export interface SemanaFinanceira {
  id: string;
  data_inicio: string;
  data_fim: string;
  limite_lazer: number;
  limite_compras: number;
  meta_economia: number;
  status: 'ativa' | 'concluida';
}

export class Database {
  private db: sqlite3.Database;

  constructor() {
    // Em produção, usar arquivo; em desenvolvimento, usar memória
    const isProduction = process.env.NODE_ENV === 'production';
    const dbPath = isProduction 
      ? path.join(process.cwd(), 'data.db')
      : ':memory:';
    
    this.db = new sqlite3.Database(dbPath);
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Tabela de itens do checklist
        this.db.run(`
          CREATE TABLE IF NOT EXISTS checklist_items (
            id TEXT PRIMARY KEY,
            titulo TEXT NOT NULL,
            descricao TEXT NOT NULL,
            categoria TEXT NOT NULL,
            ordem INTEGER NOT NULL,
            ativo BOOLEAN DEFAULT 1
          )
        `);

        // Tabela de gastos
        this.db.run(`
          CREATE TABLE IF NOT EXISTS gastos (
            id TEXT PRIMARY KEY,
            descricao TEXT NOT NULL,
            valor REAL NOT NULL,
            categoria TEXT NOT NULL,
            data TEXT NOT NULL,
            semana TEXT NOT NULL,
            observacoes TEXT
          )
        `);

        // Tabela de metas
        this.db.run(`
          CREATE TABLE IF NOT EXISTS metas (
            id TEXT PRIMARY KEY,
            titulo TEXT NOT NULL,
            valor_objetivo REAL NOT NULL,
            valor_atual REAL DEFAULT 0,
            tipo TEXT NOT NULL,
            data_criacao TEXT NOT NULL,
            data_objetivo TEXT
          )
        `);

        // Tabela de semanas financeiras
        this.db.run(`
          CREATE TABLE IF NOT EXISTS semanas_financeiras (
            id TEXT PRIMARY KEY,
            data_inicio TEXT NOT NULL,
            data_fim TEXT NOT NULL,
            limite_lazer REAL DEFAULT 0,
            limite_compras REAL DEFAULT 0,
            meta_economia REAL DEFAULT 0,
            status TEXT DEFAULT 'ativa'
          )
        `);

        // Inserir dados iniciais do checklist
        this.insertInitialChecklist();
        
        resolve();
      });
    });
  }

  private insertInitialChecklist(): void {
    const checklistItems: Omit<ChecklistItem, 'id'>[] = [
      {
        titulo: 'Revisar os Gastos da Semana',
        descricao: 'Abra o aplicativo do seu banco e a fatura do cartão de crédito. Role por todas as transações feitas desde a última segunda-feira.',
        categoria: 'revisao',
        ordem: 1,
        ativo: true
      },
      {
        titulo: 'Atualizar a Planilha ou App de Controle',
        descricao: 'Lance todos os gastos revisados na sua ferramenta de controle financeiro.',
        categoria: 'revisao',
        ordem: 2,
        ativo: true
      },
      {
        titulo: 'Definir Limites para a Semana Seguinte',
        descricao: 'Defina um teto de gastos para as categorias mais flexíveis.',
        categoria: 'planejamento',
        ordem: 3,
        ativo: true
      },
      {
        titulo: 'Verificar o Progresso das Metas',
        descricao: 'Olhe o saldo da sua conta de investimentos ou poupança.',
        categoria: 'planejamento',
        ordem: 4,
        ativo: true
      }
    ];

    checklistItems.forEach(item => {
      this.db.run(
        'INSERT OR IGNORE INTO checklist_items (id, titulo, descricao, categoria, ordem, ativo) VALUES (?, ?, ?, ?, ?, ?)',
        [uuidv4(), item.titulo, item.descricao, item.categoria, item.ordem, item.ativo]
      );
    });
  }

  // Métodos para Checklist
  async getChecklistItems(): Promise<ChecklistItem[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM checklist_items WHERE ativo = 1 ORDER BY ordem',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as ChecklistItem[]);
        }
      );
    });
  }

  // Métodos para Gastos
  async addGasto(gasto: Omit<Gasto, 'id'>): Promise<string> {
    const id = uuidv4();
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO gastos (id, descricao, valor, categoria, data, semana, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, gasto.descricao, gasto.valor, gasto.categoria, gasto.data, gasto.semana, gasto.observacoes],
        function(err) {
          if (err) reject(err);
          else resolve(id);
        }
      );
    });
  }

  async getGastosBySemana(semana: string): Promise<Gasto[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM gastos WHERE semana = ? ORDER BY data DESC',
        [semana],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as Gasto[]);
        }
      );
    });
  }

  async getGastosByCategoria(categoria: string): Promise<Gasto[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT * FROM gastos WHERE categoria = ? ORDER BY data DESC',
        [categoria],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as Gasto[]);
        }
      );
    });
  }

  // Métodos para Metas
  async addMeta(meta: Omit<Meta, 'id'>): Promise<string> {
    const id = uuidv4();
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO metas (id, titulo, valor_objetivo, valor_atual, tipo, data_criacao, data_objetivo) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, meta.titulo, meta.valor_objetivo, meta.valor_atual, meta.tipo, meta.data_criacao, meta.data_objetivo],
        function(err) {
          if (err) reject(err);
          else resolve(id);
        }
      );
    });
  }

  async getMetas(): Promise<Meta[]> {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM metas ORDER BY data_criacao DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Meta[]);
      });
    });
  }

  async updateMetaProgress(id: string, valor_atual: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        'UPDATE metas SET valor_atual = ? WHERE id = ?',
        [valor_atual, id],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Métodos para Semanas Financeiras
  async addSemanaFinanceira(semana: Omit<SemanaFinanceira, 'id'>): Promise<string> {
    const id = uuidv4();
    return new Promise((resolve, reject) => {
      this.db.run(
        'INSERT INTO semanas_financeiras (id, data_inicio, data_fim, limite_lazer, limite_compras, meta_economia, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, semana.data_inicio, semana.data_fim, semana.limite_lazer, semana.limite_compras, semana.meta_economia, semana.status],
        function(err) {
          if (err) reject(err);
          else resolve(id);
        }
      );
    });
  }

  async getSemanaAtiva(): Promise<SemanaFinanceira | null> {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT * FROM semanas_financeiras WHERE status = "ativa" ORDER BY data_inicio DESC LIMIT 1',
        (err, row) => {
          if (err) reject(err);
          else resolve(row as SemanaFinanceira || null);
        }
      );
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
