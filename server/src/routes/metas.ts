import { Router } from 'express';
import { Database } from '../database';

const router = Router();
const db = new Database();

// GET /api/metas - Obter todas as metas
router.get('/', async (req, res) => {
  try {
    const metas = await db.getMetas();
    res.json({
      success: true,
      data: metas,
      message: 'Metas carregadas com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao carregar metas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/metas - Criar nova meta
router.post('/', async (req, res) => {
  try {
    const { titulo, valor_objetivo, tipo, data_objetivo } = req.body;
    
    if (!titulo || !valor_objetivo || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Título, valor objetivo e tipo são obrigatórios'
      });
    }
    
    const id = await db.addMeta({
      titulo,
      valor_objetivo: parseFloat(valor_objetivo),
      valor_atual: 0,
      tipo,
      data_criacao: new Date().toISOString().split('T')[0],
      data_objetivo
    });
    
    res.status(201).json({
      success: true,
      data: { id },
      message: 'Meta criada com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// PUT /api/metas/:id/progresso - Atualizar progresso de uma meta
router.put('/:id/progresso', async (req, res) => {
  try {
    const { id } = req.params;
    const { valor_atual } = req.body;
    
    if (valor_atual === undefined || valor_atual === null) {
      return res.status(400).json({
        success: false,
        message: 'Valor atual é obrigatório'
      });
    }
    
    await db.updateMetaProgress(id, parseFloat(valor_atual));
    
    res.json({
      success: true,
      message: 'Progresso da meta atualizado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao atualizar progresso da meta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export { router as metasRoutes };
