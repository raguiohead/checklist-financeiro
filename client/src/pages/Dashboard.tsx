import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useChecklist } from '../contexts/ChecklistContext';
import { useGastos } from '../contexts/GastosContext';
import { useMetas } from '../contexts/MetasContext';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, AlertCircle, TrendingUp, Target, Calendar, DollarSign, CheckSquare } from 'lucide-react';

const Dashboard = () => {
  const { items: checklistItems, loading: checklistLoading } = useChecklist();
  const { gastos, loading: gastosLoading, fetchGastosBySemana } = useGastos();
  const { metas, loading: metasLoading } = useMetas();
  
  const [semanaAtual, setSemanaAtual] = useState('');
  const [totalGastos, setTotalGastos] = useState(0);

  useEffect(() => {
    const hoje = new Date();
    const inicioSemana = startOfWeek(hoje, { weekStartsOn: 1 }); // Segunda-feira
    const fimSemana = endOfWeek(hoje, { weekStartsOn: 1 }); // Domingo
    
    const semana = `${format(inicioSemana, 'dd/MM', { locale: ptBR })} - ${format(fimSemana, 'dd/MM', { locale: ptBR })}`;
    setSemanaAtual(semana);
    
    fetchGastosBySemana(semana);
  }, [fetchGastosBySemana]);

  useEffect(() => {
    const total = gastos.reduce((sum, gasto) => sum + gasto.valor, 0);
    setTotalGastos(total);
  }, [gastos]);

  const getProgressoChecklist = () => {
    // Simular progresso baseado em localStorage ou estado
    const progresso = localStorage.getItem('checklist-progress') || '0';
    return parseInt(progresso);
  };

  const getProgressoMetas = () => {
    if (metas.length === 0) return 0;
    const progressoTotal = metas.reduce((sum, meta) => {
      return sum + (meta.valor_atual / meta.valor_objetivo) * 100;
    }, 0);
    return Math.round(progressoTotal / metas.length);
  };

  const categoriasGastos = gastos.reduce((acc, gasto) => {
    acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.valor;
    return acc;
  }, {} as Record<string, number>);

  if (checklistLoading || gastosLoading || metasLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header do Dashboard */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Seu Ritual de Domingo
        </h1>
        <p className="text-gray-600 text-lg">
          Acompanhe suas finanças semanais e mantenha o controle
        </p>
        <div className="mt-4 inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Semana: {semanaAtual}</span>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Checklist</p>
              <p className="text-2xl font-bold text-gray-900">{getProgressoChecklist()}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Gastos da Semana</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {totalGastos.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Metas</p>
              <p className="text-2xl font-bold text-gray-900">{getProgressoMetas()}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Economia</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {(totalGastos * 0.2).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seções Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checklist Rápido */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Checklist Semanal</h2>
            <Link to="/checklist" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Ver completo →
            </Link>
          </div>
          <div className="space-y-3">
            {checklistItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-start space-x-3">
                <div className="w-5 h-5 border-2 border-gray-300 rounded mt-0.5"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.titulo}</p>
                  <p className="text-xs text-gray-600">{item.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gastos por Categoria */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Gastos por Categoria</h2>
            <Link to="/gastos" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3">
            {Object.entries(categoriasGastos).slice(0, 4).map(([categoria, valor]) => (
              <div key={categoria} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{categoria}</span>
                <span className="text-sm font-medium text-gray-900">R$ {valor.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/gastos"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Adicionar Gasto</p>
              <p className="text-sm text-gray-600">Registre um novo gasto</p>
            </div>
          </Link>

          <Link
            to="/metas"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-success-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Criar Meta</p>
              <p className="text-sm text-gray-600">Defina uma nova meta financeira</p>
            </div>
          </Link>

          <Link
            to="/checklist"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-warning-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Revisar Checklist</p>
              <p className="text-sm text-gray-600">Complete suas tarefas semanais</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export default Dashboard;
