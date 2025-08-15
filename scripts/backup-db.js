#!/usr/bin/env node

/**
 * Script para backup automático do banco de dados
 * Execute: npm run db:backup
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const BACKUP_DIR = path.join(__dirname, '../backups');
const DB_PATH = path.join(__dirname, '../data.db');

// Criar diretório de backup se não existir
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Função para criar backup
function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}.db`);
  
  // Verificar se o banco existe
  if (!fs.existsSync(DB_PATH)) {
    console.log('⚠️  Banco de dados não encontrado. Execute primeiro: npm run build');
    return;
  }
  
  // Copiar arquivo do banco
  fs.copyFileSync(DB_PATH, backupPath);
  
  console.log(`✅ Backup criado: ${backupPath}`);
  
  // Manter apenas os últimos 10 backups
  cleanupOldBackups();
}

// Função para limpar backups antigos
function cleanupOldBackups() {
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(file => file.endsWith('.db'))
    .map(file => ({
      name: file,
      path: path.join(BACKUP_DIR, file),
      time: fs.statSync(path.join(BACKUP_DIR, file)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time);
  
  // Manter apenas os últimos 10 backups
  if (files.length > 10) {
    const filesToDelete = files.slice(10);
    filesToDelete.forEach(file => {
      fs.unlinkSync(file.path);
      console.log(`🗑️  Backup removido: ${file.name}`);
    });
  }
}

// Função para restaurar backup
function restoreBackup(backupFile) {
  const backupPath = path.join(BACKUP_DIR, backupFile);
  
  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Backup não encontrado: ${backupFile}`);
    return;
  }
  
  // Fazer backup do banco atual antes de restaurar
  const currentBackup = path.join(BACKUP_DIR, `pre-restore-${Date.now()}.db`);
  if (fs.existsSync(DB_PATH)) {
    fs.copyFileSync(DB_PATH, currentBackup);
    console.log(`📁 Backup do banco atual salvo em: ${currentBackup}`);
  }
  
  // Restaurar backup
  fs.copyFileSync(backupPath, DB_PATH);
  
  console.log(`✅ Backup restaurado: ${backupFile}`);
}

// Função para listar backups disponíveis
function listBackups() {
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(file => file.endsWith('.db'))
    .map(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: (stats.size / 1024).toFixed(2) + ' KB',
        date: stats.mtime.toLocaleString('pt-BR')
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  console.log('\n📋 Backups disponíveis:');
  if (files.length === 0) {
    console.log('   Nenhum backup encontrado');
  } else {
    files.forEach((file, index) => {
      console.log(`${index + 1}. ${file.name} (${file.size}) - ${file.date}`);
    });
  }
}

// Função para criar backup com compressão (se disponível)
function createCompressedBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}.db.gz`);
  
  // Verificar se o gzip está disponível
  exec('gzip --version', (error) => {
    if (error) {
      console.log('⚠️  Gzip não disponível, criando backup sem compressão');
      createBackup();
      return;
    }
    
    // Criar backup comprimido
    exec(`gzip -c "${DB_PATH}" > "${backupPath}"`, (error) => {
      if (error) {
        console.error('❌ Erro ao criar backup comprimido:', error);
        createBackup(); // Fallback para backup normal
      } else {
        console.log(`✅ Backup comprimido criado: ${backupPath}`);
        cleanupOldBackups();
      }
    });
  });
}

// Função para restaurar backup comprimido
function restoreCompressedBackup(backupFile) {
  const backupPath = path.join(BACKUP_DIR, backupFile);
  
  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Backup não encontrado: ${backupFile}`);
    return;
  }
  
  if (backupFile.endsWith('.gz')) {
    // Restaurar backup comprimido
    exec(`gunzip -c "${backupPath}" > "${DB_PATH}"`, (error) => {
      if (error) {
        console.error('❌ Erro ao restaurar backup comprimido:', error);
      } else {
        console.log(`✅ Backup comprimido restaurado: ${backupFile}`);
      }
    });
  } else {
    restoreBackup(backupFile);
  }
}

// Função principal
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'create':
    case undefined:
      createBackup();
      break;
      
    case 'create:compressed':
      createCompressedBackup();
      break;
      
    case 'restore':
      const backupFile = process.argv[3];
      if (!backupFile) {
        console.error('❌ Especifique o arquivo de backup: npm run db:backup restore <arquivo>');
        process.exit(1);
      }
      restoreCompressedBackup(backupFile);
      break;
      
    case 'list':
      listBackups();
      break;
      
    case 'help':
      console.log(`
📚 Script de Backup do Banco de Dados

Uso:
  npm run db:backup [comando]

Comandos:
  create           Criar novo backup (padrão)
  create:compressed Criar backup comprimido (se gzip disponível)
  restore          Restaurar backup específico
  list             Listar backups disponíveis
  help             Mostrar esta ajuda

Exemplos:
  npm run db:backup
  npm run db:backup create
  npm run db:backup create:compressed
  npm run db:backup restore backup-2024-01-01T10-00-00-000Z.db
  npm run db:backup restore backup-2024-01-01T10-00-00-000Z.db.gz
  npm run db:backup list

Recursos:
  • Backups automáticos com timestamp
  • Limpeza automática (mantém últimos 10)
  • Suporte a compressão gzip
  • Backup de segurança antes de restaurar
      `);
      break;
      
    default:
      console.error(`❌ Comando desconhecido: ${command}`);
      console.log('Use "npm run db:backup help" para ver os comandos disponíveis');
      process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  createBackup,
  createCompressedBackup,
  restoreBackup,
  restoreCompressedBackup,
  listBackups
};
