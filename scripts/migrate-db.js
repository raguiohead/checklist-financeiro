#!/usr/bin/env node

/**
 * Script para migrações do banco de dados
 * Execute: npm run db:migrate
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../data.db');

// Migrações disponíveis
const migrations = [
  {
    version: 1,
    name: 'Initial Schema',
    sql: `
      CREATE TABLE IF NOT EXISTS checklist_items (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        categoria TEXT NOT NULL,
        ordem INTEGER NOT NULL,
        ativo BOOLEAN DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS gastos (
        id TEXT PRIMARY KEY,
        descricao TEXT NOT NULL,
        valor REAL NOT NULL,
        categoria TEXT NOT NULL,
        data TEXT NOT NULL,
        semana TEXT NOT NULL,
        observacoes TEXT
      );

      CREATE TABLE IF NOT EXISTS metas (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        valor_objetivo REAL NOT NULL,
        valor_atual REAL DEFAULT 0,
        tipo TEXT NOT NULL,
        data_criacao TEXT NOT NULL,
        data_objetivo TEXT
      );

      CREATE TABLE IF NOT EXISTS semanas_financeiras (
        id TEXT PRIMARY KEY,
        data_inicio TEXT NOT NULL,
        data_fim TEXT NOT NULL,
        limite_lazer REAL DEFAULT 0,
        limite_compras REAL DEFAULT 0,
        meta_economia REAL DEFAULT 0,
        status TEXT DEFAULT 'ativa'
      );

      CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `
  },
  {
    version: 2,
    name: 'Add indexes for performance',
    sql: `
      CREATE INDEX IF NOT EXISTS idx_gastos_semana ON gastos(semana);
      CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria);
      CREATE INDEX IF NOT EXISTS idx_gastos_data ON gastos(data);
      CREATE INDEX IF NOT EXISTS idx_metas_tipo ON metas(tipo);
      CREATE INDEX IF NOT EXISTS idx_semanas_status ON semanas_financeiras(status);
    `
  },
  {
    version: 3,
    name: 'Add user preferences table',
    sql: `
      CREATE TABLE IF NOT EXISTS user_preferences (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      INSERT OR IGNORE INTO user_preferences (id, key, value) VALUES 
        ('pref-1', 'theme', 'light'),
        ('pref-2', 'currency', 'BRL'),
        ('pref-3', 'week_start', 'monday');
    `
  }
];

// Função para executar migração
function runMigration(db, migration) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Executando migração ${migration.version}: ${migration.name}`);
    
    db.serialize(() => {
      // Executar SQL da migração
      db.exec(migration.sql, (err) => {
        if (err) {
          console.error(`❌ Erro na migração ${migration.version}:`, err);
          reject(err);
          return;
        }
        
        // Registrar migração como aplicada
        db.run(
          'INSERT OR REPLACE INTO migrations (version, name) VALUES (?, ?)',
          [migration.version, migration.name],
          function(err) {
            if (err) {
              console.error(`❌ Erro ao registrar migração ${migration.version}:`, err);
              reject(err);
              return;
            }
            
            console.log(`✅ Migração ${migration.version} aplicada com sucesso`);
            resolve();
          }
        );
      });
    });
  });
}

// Função para verificar migrações aplicadas
function getAppliedMigrations(db) {
  return new Promise((resolve, reject) => {
    db.all('SELECT version FROM migrations ORDER BY version', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows.map(row => row.version));
    });
  });
}

// Função para executar todas as migrações pendentes
async function migrateDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, async (err) => {
      if (err) {
        console.error('❌ Erro ao conectar com o banco:', err);
        reject(err);
        return;
      }
      
      try {
        console.log('🚀 Iniciando migrações do banco de dados...\n');
        
        // Verificar migrações já aplicadas
        const appliedMigrations = await getAppliedMigrations(db);
        console.log(`📋 Migrações já aplicadas: ${appliedMigrations.join(', ') || 'Nenhuma'}\n`);
        
        // Filtrar migrações pendentes
        const pendingMigrations = migrations.filter(
          migration => !appliedMigrations.includes(migration.version)
        );
        
        if (pendingMigrations.length === 0) {
          console.log('✅ Banco de dados está atualizado! Nenhuma migração pendente.');
          resolve();
          return;
        }
        
        console.log(`🔄 Executando ${pendingMigrations.length} migração(ões) pendente(s)...\n`);
        
        // Executar migrações pendentes
        for (const migration of pendingMigrations) {
          await runMigration(db, migration);
          console.log('');
        }
        
        console.log('🎉 Todas as migrações foram aplicadas com sucesso!');
        resolve();
        
      } catch (error) {
        console.error('❌ Erro durante as migrações:', error);
        reject(error);
      } finally {
        db.close();
      }
    });
  });
}

// Função para listar status das migrações
function listMigrationStatus() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, async (err) => {
      if (err) {
        console.error('❌ Erro ao conectar com o banco:', err);
        reject(err);
        return;
      }
      
      try {
        const appliedMigrations = await getAppliedMigrations(db);
        
        console.log('📊 Status das Migrações:\n');
        
        migrations.forEach(migration => {
          const status = appliedMigrations.includes(migration.version) ? '✅' : '⏳';
          console.log(`${status} ${migration.version}: ${migration.name}`);
        });
        
        console.log(`\n📈 Progresso: ${appliedMigrations.length}/${migrations.length} migrações aplicadas`);
        
        resolve();
        
      } catch (error) {
        console.error('❌ Erro ao verificar status:', error);
        reject(error);
      } finally {
        db.close();
      }
    });
  });
}

// Função para mostrar ajuda
function showHelp() {
  console.log(`
📚 Script de Migrações do Banco de Dados

Uso:
  npm run db:migrate [comando]

Comandos:
  migrate   Executar migrações pendentes (padrão)
  status    Mostrar status das migrações
  help      Mostrar esta ajuda

Exemplos:
  npm run db:migrate
  npm run db:migrate migrate
  npm run db:migrate status

Comandos relacionados:
  npm run db:backup     - Fazer backup do banco
  npm run db:seed       - Popular com dados iniciais
  npm run db:reset      - Backup + limpar + popular

Migrações disponíveis:
  • v1: Schema inicial (tabelas principais)
  • v2: Índices para performance
  • v3: Preferências do usuário
  `);
}

// Função principal
async function main() {
  const command = process.argv[2];
  
  try {
    switch (command) {
      case 'status':
        await listMigrationStatus();
        break;
        
      case 'migrate':
      case undefined:
        await migrateDatabase();
        break;
        
      case 'help':
        showHelp();
        break;
        
      default:
        console.error(`❌ Comando desconhecido: ${command}`);
        console.log('Use "npm run db:migrate help" para ver os comandos disponíveis');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  migrateDatabase,
  listMigrationStatus
};
