#!/usr/bin/env node

/**
 * Script para popular o banco de dados com dados iniciais
 * Execute: npm run db:seed
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '../data.db');

// Dados iniciais para o checklist
const checklistItems = [
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

// Dados iniciais para metas de exemplo
const metasExemplo = [
  {
    titulo: 'Reserva de Emergência',
    valor_objetivo: 10000,
    valor_atual: 2500,
    tipo: 'reserva_emergencia',
    data_criacao: new Date().toISOString().split('T')[0]
  },
  {
    titulo: 'Viagem para Europa',
    valor_objetivo: 15000,
    valor_atual: 3000,
    tipo: 'viagem',
    data_criacao: new Date().toISOString().split('T')[0],
    data_objetivo: '2024-12-31'
  },
  {
    titulo: 'Entrada do Apartamento',
    valor_objetivo: 50000,
    valor_atual: 8000,
    tipo: 'outro',
    data_criacao: new Date().toISOString().split('T')[0],
    data_objetivo: '2025-06-30'
  }
];

// Dados iniciais para gastos de exemplo (última semana)
const gastosExemplo = [
  {
    descricao: 'Supermercado',
    valor: 350.50,
    categoria: 'Mercado',
    data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    semana: 'Última Semana',
    observacoes: 'Compras da semana'
  },
  {
    descricao: 'Almoço no restaurante',
    valor: 45.00,
    categoria: 'Lazer/Restaurantes',
    data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    semana: 'Última Semana',
    observacoes: 'Almoço com amigos'
  },
  {
    descricao: 'Uber',
    valor: 25.00,
    categoria: 'Transporte',
    data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    semana: 'Última Semana',
    observacoes: 'Transporte para reunião'
  },
  {
    descricao: 'Netflix',
    valor: 39.90,
    categoria: 'Contas',
    data: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    semana: 'Última Semana',
    observacoes: 'Assinatura mensal'
  }
];

// Função para inserir dados do checklist
function seedChecklist(db) {
  return new Promise((resolve, reject) => {
    console.log('🌱 Inserindo dados do checklist...');
    
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO checklist_items (id, titulo, descricao, categoria, ordem, ativo) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    checklistItems.forEach((item, index) => {
      stmt.run([uuidv4(), item.titulo, item.descricao, item.categoria, item.ordem, item.ativo], (err) => {
        if (err) {
          console.error(`❌ Erro ao inserir item ${index + 1}:`, err);
        } else {
          console.log(`✅ Item ${index + 1} inserido: ${item.titulo}`);
        }
      });
    });
    
    stmt.finalize((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✅ Checklist populado com sucesso!\n');
        resolve();
      }
    });
  });
}

// Função para inserir metas de exemplo
function seedMetas(db) {
  return new Promise((resolve, reject) => {
    console.log('🎯 Inserindo metas de exemplo...');
    
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO metas (id, titulo, valor_objetivo, valor_atual, tipo, data_criacao, data_objetivo) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    metasExemplo.forEach((meta, index) => {
      stmt.run([uuidv4(), meta.titulo, meta.valor_objetivo, meta.valor_atual, meta.tipo, meta.data_criacao, meta.data_objetivo], (err) => {
        if (err) {
          console.error(`❌ Erro ao inserir meta ${index + 1}:`, err);
        } else {
          console.log(`✅ Meta ${index + 1} inserida: ${meta.titulo} - R$ ${meta.valor_objetivo.toFixed(2)}`);
        }
      });
    });
    
    stmt.finalize((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✅ Metas de exemplo inseridas com sucesso!\n');
        resolve();
      }
    });
  });
}

// Função para inserir gastos de exemplo
function seedGastos(db) {
  return new Promise((resolve, reject) => {
    console.log('💰 Inserindo gastos de exemplo...');
    
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO gastos (id, descricao, valor, categoria, data, semana, observacoes) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    gastosExemplo.forEach((gasto, index) => {
      stmt.run([uuidv4(), gasto.descricao, gasto.valor, gasto.categoria, gasto.data, gasto.semana, gasto.observacoes], (err) => {
        if (err) {
          console.error(`❌ Erro ao inserir gasto ${index + 1}:`, err);
        } else {
          console.log(`✅ Gasto ${index + 1} inserido: ${gasto.descricao} - R$ ${gasto.valor.toFixed(2)}`);
        }
      });
    });
    
    stmt.finalize((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('✅ Gastos de exemplo inseridos com sucesso!\n');
        resolve();
      }
    });
  });
}

// Função para limpar dados existentes
function clearDatabase(db) {
  return new Promise((resolve, reject) => {
    console.log('🧹 Limpando banco de dados...');
    
    const tables = ['gastos', 'metas', 'checklist_items'];
    let completed = 0;
    
    tables.forEach(table => {
      db.run(`DELETE FROM ${table}`, (err) => {
        if (err) {
          console.error(`❌ Erro ao limpar tabela ${table}:`, err);
        } else {
          console.log(`✅ Tabela ${table} limpa`);
        }
        completed++;
        
        if (completed === tables.length) {
          console.log('✅ Banco de dados limpo com sucesso!\n');
          resolve();
        }
      });
    });
  });
}

// Função para verificar se o banco existe
function checkDatabaseExists() {
  return new Promise((resolve) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.log('❌ Banco de dados não encontrado. Execute primeiro: npm run build');
        resolve(false);
      } else {
        db.close();
        resolve(true);
      }
    });
  });
}

// Função principal para popular o banco
async function seedDatabase() {
  const dbExists = await checkDatabaseExists();
  if (!dbExists) {
    return;
  }
  
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, async (err) => {
      if (err) {
        console.error('❌ Erro ao conectar com o banco:', err);
        reject(err);
        return;
      }
      
      try {
        console.log('🚀 Iniciando população do banco de dados...\n');
        
        // Verificar se deve limpar o banco
        const shouldClear = process.argv.includes('--clear');
        if (shouldClear) {
          await clearDatabase(db);
        }
        
        // Inserir dados
        await seedChecklist(db);
        await seedMetas(db);
        await seedGastos(db);
        
        console.log('🎉 Banco de dados populado com sucesso!');
        console.log('\n📊 Resumo:');
        console.log(`   • ${checklistItems.length} itens do checklist`);
        console.log(`   • ${metasExemplo.length} metas de exemplo`);
        console.log(`   • ${gastosExemplo.length} gastos de exemplo`);
        
        resolve();
        
      } catch (error) {
        console.error('❌ Erro durante a população:', error);
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
🌱 Script para Popular o Banco de Dados

Uso:
  npm run db:seed [opções]

Opções:
  --clear    Limpar dados existentes antes de inserir
  --help     Mostrar esta ajuda

Exemplos:
  npm run db:seed
  npm run db:seed --clear
  npm run db:seed --help

Dados que serão inseridos:
  • Checklist financeiro semanal (4 itens)
  • Metas de exemplo (3 metas)
  • Gastos de exemplo (4 gastos da última semana)

Comandos relacionados:
  npm run db:backup     - Fazer backup do banco
  npm run db:migrate    - Executar migrações
  npm run db:reset      - Backup + limpar + popular
  `);
}

// Função principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    showHelp();
    return;
  }
  
  try {
    await seedDatabase();
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
  seedDatabase,
  seedChecklist,
  seedMetas,
  seedGastos
};
