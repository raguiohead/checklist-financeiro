import { Router } from 'express';
import { Database } from '../database';

const router = Router();
const db = new Database();

// GET /api/checklist - Obter todos os itens do checklist
router.get('/', async (req, res) => {
  try {
    const items = await db.getChecklistItems();
    res.json({
      success: true,
      data: items,
      message: 'Checklist carregado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao carregar checklist:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export { router as checklistRoutes };
