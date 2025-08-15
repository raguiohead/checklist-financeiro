import { useState, useEffect } from 'react';
import { useGastos } from '../contexts/GastosContext';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Calendar, DollarSign, Tag, FileText, Trash2, Edit } from 'lucide-react';

interface FormData {
  descricao: string;
  valor: string;
  categoria: string;
  data: string;
  observacoes: string;
}

const Gastos = () => {
  const { gastos, loading, error, fetchGastosBySemana, addGasto } = useGastos();
  const [showForm, setShowForm] = useState(false);
  const [semanaAtual, setSemanaAtual] = useState('');
  const [formData, setFormData] = useState<FormData>({
    descricao: '',
    valor: '',
    categoria: '',
    data: '',
    observacoes: ''
  });

  const categorias = [
    'Mercado',
    'Lazer/Restaurantes',
    'Transporte',
    'Saúde',
    'Educação',
    'Vestuário',
    'Contas',
    'Outros'
  ];

  useEffect(() => {
    const hoje = new Date();
    const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 });
    const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 });
    
    const semana = `${format(inicioSemana, 'dd/MM', { locale: ptBR })} - ${format(fimSemana, 'dd/MM', { locale: ptBR })}`;
    setSemanaAtual(semana);
    
    fetchGastosBySemana(semana);
  }, [fetchGastosBySemana]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao || !formData.valor || !formData.categoria || !formData.data) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const success = await addGasto({
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      categoria: formData.categoria,
      data: formData.data,
      semana: semanaAtual,
      observacoes: formData.observacoes
    });

    if (success) {
      setFormData({
        descricao: '',
        valor: '',
        categoria: '',
        data: '',
        observacoes: ''
      });
      setShowForm(false);
    }
  };

  const getTotalGastos = () => {
    return gastos.reduce((total, gasto) => total + gasto.valor, 0);
  };

  const getGastosPorCategoria = () => {
    return gastos.reduce((acc, gasto) => {
      acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.valor;
      return acc;
    }, {} as Record<string, number>);
  };

  const formatarData = (data: string) => {
    return format(new Date(data), 'dd/MM/yyyy', { locale: ptBR });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Controle de Gastos</h1>
          <p className="text-gray-600">Acompanhe seus gastos semanais e mantenha o controle</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary mt-4 md:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Gasto
        </button>
      </div>

      {/* Semana Atual */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-primary-600" />
          <div>
            <h3 className="font-semibold text-primary-900">Semana Atual</h3>
            <p className="text-primary-700">{semanaAtual}</p>
          </div>
        </div>
      </div>

      {/* Formulário de Adicionar Gasto */}
      {showForm && (
        <div className="card border-2 border-primary-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Novo Gasto</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <input
                  type="text"
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Ex: Almoço no restaurante"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor *
                </label>
                <input
                  type="number"
                  name="valor"
                  value={formData.valor}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria *
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  name="data"
                  value={formData.data}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleInputChange}
                className="input-field"
                rows={3}
                placeholder="Observações adicionais..."
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Salvar Gasto
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resumo dos Gastos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-warning-50 border-warning-200">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-warning-600" />
            <div>
              <p className="text-sm font-medium text-warning-700">Total da Semana</p>
              <p className="text-2xl font-bold text-warning-900">
                R$ {getTotalGastos().toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center space-x-3">
            <Tag className="w-8 h-8 text-primary-600" />
            <div>
              <p className="text-sm font-medium text-primary-700">Categorias</p>
              <p className="text-2xl font-bold text-primary-900">
                {Object.keys(getGastosPorCategoria()).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-success-50 border-success-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-success-600" />
            <div>
              <p className="text-sm font-medium text-success-700">Registros</p>
              <p className="text-2xl font-bold text-success-900">
                {gastos.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Gastos */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Gastos da Semana</h2>
        
        {gastos.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum gasto registrado para esta semana</p>
            <p className="text-sm text-gray-500">Clique em "Adicionar Gasto" para começar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {gastos.map((gasto) => (
              <div key={gasto.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{gasto.descricao}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{gasto.categoria}</span>
                      <span>•</span>
                      <span>{formatarData(gasto.data)}</span>
                      {gasto.observacoes && (
                        <>
                          <span>•</span>
                          <span>{gasto.observacoes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-900">
                    R$ {gasto.valor.toFixed(2)}
                  </span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gráfico de Gastos por Categoria */}
      {gastos.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Gastos por Categoria</h2>
          <div className="space-y-3">
            {Object.entries(getGastosPorCategoria()).map(([categoria, valor]) => {
              const porcentagem = (valor / getTotalGastos()) * 100;
              return (
                <div key={categoria} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{categoria}</span>
                    <span className="text-gray-600">R$ {valor.toFixed(2)} ({porcentagem.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${porcentagem}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gastos;
