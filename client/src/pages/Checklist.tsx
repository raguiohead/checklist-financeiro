import { useState, useEffect } from 'react';
import { useChecklist } from '../contexts/ChecklistContext';
import { CheckCircle, Clock, AlertCircle, BookOpen, TrendingUp } from 'lucide-react';

interface ChecklistProgress {
  [key: string]: boolean;
}

const Checklist = () => {
  const { items, loading, error } = useChecklist();
  const [progress, setProgress] = useState<ChecklistProgress>({});
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Carregar progresso salvo do localStorage
    const savedProgress = localStorage.getItem('checklist-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const handleItemToggle = (itemId: string) => {
    const newProgress = {
      ...progress,
      [itemId]: !progress[itemId]
    };
    setProgress(newProgress);
    
    // Salvar no localStorage
    localStorage.setItem('checklist-progress', JSON.stringify(newProgress));
    
    // Calcular progresso geral
    const completedItems = Object.values(newProgress).filter(Boolean).length;
    const totalItems = items.length;
    const progressPercentage = Math.round((completedItems / totalItems) * 100);
    
    localStorage.setItem('checklist-progress-percentage', progressPercentage.toString());
  };

  const getProgressPercentage = () => {
    if (items.length === 0) return 0;
    const completedItems = Object.values(progress).filter(Boolean).length;
    return Math.round((completedItems / items.length) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success-600 bg-success-100';
    if (percentage >= 60) return 'text-warning-600 bg-warning-100';
    return 'text-red-600 bg-red-100';
  };

  const getStepIcon = (categoria: string) => {
    switch (categoria) {
      case 'revisao':
        return <BookOpen className="w-5 h-5" />;
      case 'planejamento':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStepColor = (categoria: string) => {
    switch (categoria) {
      case 'revisao':
        return 'bg-blue-100 text-blue-600';
      case 'planejamento':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar checklist</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  const progressPercentage = getProgressPercentage();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Checklist Financeiro Semanal
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Seu ritual de domingo para organizar as finanças da semana
        </p>
        
        {/* Barra de Progresso */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
            <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                progressPercentage >= 80 ? 'bg-success-500' :
                progressPercentage >= 60 ? 'bg-warning-500' : 'bg-red-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className={`mt-3 inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${getProgressColor(progressPercentage)}`}>
            {progressPercentage >= 80 ? (
              <CheckCircle className="w-4 h-4" />
            ) : progressPercentage >= 60 ? (
              <Clock className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>
              {progressPercentage >= 80 ? 'Excelente! Você está no caminho certo!' :
               progressPercentage >= 60 ? 'Bom progresso! Continue assim!' :
               'Vamos começar! Cada passo conta!'}
            </span>
          </div>
        </div>
      </div>

      {/* Etapas do Checklist */}
      <div className="max-w-4xl mx-auto">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`card checklist-item mb-6 ${
              progress[item.id] ? 'border-success-200 bg-success-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Checkbox */}
              <button
                onClick={() => handleItemToggle(item.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  progress[item.id]
                    ? 'border-success-500 bg-success-500 text-white'
                    : 'border-gray-300 hover:border-primary-400'
                }`}
              >
                {progress[item.id] && <CheckCircle className="w-4 h-4" />}
              </button>

              {/* Conteúdo */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStepColor(item.categoria)}`}>
                    {getStepIcon(item.categoria)}
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold ${
                      progress[item.id] ? 'text-success-800' : 'text-gray-900'
                    }`}>
                      {index + 1}. {item.titulo}
                    </h3>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      item.categoria === 'revisao' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {item.categoria === 'revisao' ? 'Revisão' : 'Planejamento'}
                    </div>
                  </div>
                </div>
                
                <p className={`text-gray-600 mb-4 ${
                  progress[item.id] ? 'text-success-700' : ''
                }`}>
                  {item.descricao}
                </p>

                {/* Perguntas de Reflexão */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Perguntas para Reflexão:</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    {item.categoria === 'revisao' ? (
                      <>
                        <p>• "Reconheço todos estes gastos?"</p>
                        <p>• "Houve alguma compra por impulso?"</p>
                        <p>• "Onde eu poderia ter economizado?"</p>
                      </>
                    ) : (
                      <>
                        <p>• "Quanto posso gastar com lazer esta semana?"</p>
                        <p>• "Preciso fazer alguma compra não essencial?"</p>
                        <p>• "Qual será minha meta de economia para esta semana?"</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dicas Finais */}
      <div className="max-w-2xl mx-auto text-center">
        <div className="card bg-primary-50 border-primary-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            💡 Dica Importante
          </h3>
          <p className="text-primary-700">
            Celebre seu progresso, não importa o quão pequeno seja. 
            Cada item marcado é um passo em direção à sua saúde financeira!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checklist;
