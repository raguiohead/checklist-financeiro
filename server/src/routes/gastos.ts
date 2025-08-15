import { Router } from 'express';
import { Database } from '../database';

const router = Router();
const db = new Database();

// GET /api/gastos/semana/:semana - Obter gastos de uma semana específica
router.get('/semana/:semana', async (req, res) => {
  try {
    const { semana } = req.params;
    const gastos = await db.getGastosBySemana(semana);
    
    const total = gastos.reduce((sum, gasto) => sum + gasto.valor, 0);
    
    res.json({
      success: true,
      data: {
        gastos,
        total,
        quantidade: gastos.length
      },
      message: `Gastos da semana ${semana} carregados com sucesso!`
    });
  } catch (error) {
    console.error('Erro ao carregar gastos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/gastos/categoria/:categoria - Obter gastos por categoria
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const { categoria } = req.params;
    const gastos = await db.getGastosByCategoria(categoria);
    
    const total = gastos.reduce((sum, gasto) => sum + gasto.valor, 0);
    
    res.json({
      success: true,
      data: {
        gastos,
        total,
        quantidade: gastos.length
      },
      message: `Gastos da categoria ${categoria} carregados com sucesso!`
    });
  } catch (error) {
    console.error('Erro ao carregar gastos por categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/gastos - Adicionar novo gasto
router.post('/', async (req, res) => {
  try {
    const { descricao, valor, categoria, data, semana, observacoes } = req.body;
    
    if (!descricao || !valor || !categoria || !data || !semana) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }
    
    const id = await db.addGasto({
      descricao,
      valor: parseFloat(valor),
      categoria,
      data,
      semana,
      observacoes
    });
    
    res.status(201).json({
      success: true,
      data: { id },
      message: 'Gasto adicionado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao adicionar gasto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export { router as gastosRoutes };
