import { useState } from 'react';
import { useMetas } from '../contexts/MetasContext';
import { Plus, Target, TrendingUp, Calendar, DollarSign, Edit, Trash2 } from 'lucide-react';

interface FormData {
  titulo: string;
  valor_objetivo: string;
  tipo: string;
  data_objetivo: string;
}

const Metas = () => {
  const { metas, loading, error, addMeta, updateMetaProgress } = useMetas();
  const [showForm, setShowForm] = useState(false);
  const [editingMeta, setEditingMeta] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    valor_objetivo: '',
    tipo: '',
    data_objetivo: ''
  });

  const tiposMetas = [
    { value: 'reserva_emergencia', label: 'Reserva de Emergência', icon: '🛡️' },
    { value: 'viagem', label: 'Viagem', icon: '✈️' },
    { value: 'outro', label: 'Outro', icon: '🎯' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.valor_objetivo || !formData.tipo) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const success = await addMeta({
      titulo: formData.titulo,
      valor_objetivo: parseFloat(formData.valor_objetivo),
      tipo: formData.tipo as any,
      data_objetivo: formData.data_objetivo || undefined
    });

    if (success) {
      setFormData({
        titulo: '',
        valor_objetivo: '',
        tipo: '',
        data_objetivo: ''
      });
      setShowForm(false);
    }
  };

  const handleUpdateProgress = async (metaId: string, novoValor: string) => {
    const valor = parseFloat(novoValor);
    if (isNaN(valor) || valor < 0) return;
    
    await updateMetaProgress(metaId, valor);
  };

  const getTipoLabel = (tipo: string) => {
    return tiposMetas.find(t => t.value === tipo)?.label || tipo;
  };

  const getTipoIcon = (tipo: string) => {
    return tiposMetas.find(t => t.value === tipo)?.icon || '🎯';
  };

  const getProgressColor = (progresso: number) => {
    if (progresso >= 80) return 'text-success-600 bg-success-100';
    if (progresso >= 60) return 'text-warning-600 bg-warning-100';
    if (progresso >= 40) return 'text-blue-600 bg-blue-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressBarColor = (progresso: number) => {
    if (progresso >= 80) return 'bg-success-500';
    if (progresso >= 60) return 'bg-warning-500';
    if (progresso >= 40) return 'bg-blue-500';
    return 'bg-red-500';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Metas Financeiras</h1>
          <p className="text-gray-600">Defina e acompanhe suas metas de economia</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary mt-4 md:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Meta
        </button>
      </div>

      {/* Formulário de Nova Meta */}
      {showForm && (
        <div className="card border-2 border-primary-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Nova Meta Financeira</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título da Meta *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Ex: Reserva de emergência"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Objetivo *
                </label>
                <input
                  type="number"
                  name="valor_objetivo"
                  value={formData.valor_objetivo}
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
                  Tipo de Meta *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  {tiposMetas.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.icon} {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Objetivo (opcional)
                </label>
                <input
                  type="date"
                  name="data_objetivo"
                  value={formData.data_objetivo}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Criar Meta
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

      {/* Resumo das Metas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex items-center space-x-3">
            <Target className="w-8 h-8 text-primary-600" />
            <div>
              <p className="text-sm font-medium text-primary-700">Total de Metas</p>
              <p className="text-2xl font-bold text-primary-900">{metas.length}</p>
            </div>
          </div>
        </div>

        <div className="card bg-success-50 border-success-200">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-success-600" />
            <div>
              <p className="text-sm font-medium text-success-700">Progresso Médio</p>
              <p className="text-2xl font-bold text-success-900">
                {metas.length > 0 
                  ? Math.round(metas.reduce((sum, meta) => sum + (meta.valor_atual / meta.valor_objetivo) * 100, 0) / metas.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-warning-50 border-warning-200">
          <div className="flex items-center space-x-3">
            <DollarSign className="w-8 h-8 text-warning-600" />
            <div>
              <p className="text-sm font-medium text-warning-700">Valor Total</p>
              <p className="text-2xl font-bold text-warning-900">
                R$ {metas.reduce((sum, meta) => sum + meta.valor_objetivo, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Metas */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Suas Metas</h2>
        
        {metas.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma meta criada ainda</p>
            <p className="text-sm text-gray-500">Clique em "Nova Meta" para começar</p>
          </div>
        ) : (
          <div className="space-y-6">
            {metas.map((meta) => {
              const progresso = (meta.valor_atual / meta.valor_objetivo) * 100;
              const progressoColor = getProgressColor(progresso);
              const progressoBarColor = getProgressBarColor(progresso);
              
              return (
                <div key={meta.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getTipoIcon(meta.tipo)}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{meta.titulo}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${progressoColor}`}>
                            {getTipoLabel(meta.tipo)}
                          </span>
                          {meta.data_objetivo && (
                            <>
                              <span>•</span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(meta.data_objetivo).toLocaleDateString('pt-BR')}</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progresso */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progresso</span>
                      <span className="text-sm font-medium text-gray-700">{progresso.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${progressoBarColor}`}
                        style={{ width: `${Math.min(progresso, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Valores */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Valor Atual</p>
                      <p className="text-lg font-bold text-gray-900">
                        R$ {meta.valor_atual.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Valor Objetivo</p>
                      <p className="text-lg font-bold text-gray-900">
                        R$ {meta.valor_objetivo.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Faltam</p>
                      <p className="text-lg font-bold text-gray-900">
                        R$ {Math.max(0, meta.valor_objetivo - meta.valor_atual).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Atualizar Progresso */}
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-700">
                      Atualizar valor atual:
                    </label>
                    <input
                      type="number"
                      className="input-field max-w-32"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      defaultValue={meta.valor_atual}
                      onBlur={(e) => handleUpdateProgress(meta.id, e.target.value)}
                    />
                    <span className="text-sm text-gray-500">R$</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dicas */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Dicas para Suas Metas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <p className="font-medium mb-2">🎯 Defina metas realistas</p>
            <p>Comece com valores menores e aumente gradualmente conforme sua situação melhora.</p>
          </div>
          <div>
            <p className="font-medium mb-2">📅 Estabeleça prazos</p>
            <p>Metas com data definida têm maior chance de serem alcançadas.</p>
          </div>
          <div>
            <p className="font-medium mb-2">💰 Acompanhe regularmente</p>
            <p>Atualize seus valores pelo menos uma vez por semana para manter a motivação.</p>
          </div>
          <div>
            <p className="font-medium mb-2">🎉 Celebre as conquistas</p>
            <p>Cada meta alcançada é uma vitória! Reconheça seu esforço e continue.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Metas;
