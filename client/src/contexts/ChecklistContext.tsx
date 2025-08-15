import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ChecklistItem {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'revisao' | 'planejamento';
  ordem: number;
  ativo: boolean;
}

interface ChecklistContextType {
  items: ChecklistItem[];
  loading: boolean;
  error: string | null;
  fetchChecklist: () => Promise<void>;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export const useChecklist = () => {
  const context = useContext(ChecklistContext);
  if (context === undefined) {
    throw new Error('useChecklist must be used within a ChecklistProvider');
  }
  return context;
};

interface ChecklistProviderProps {
  children: ReactNode;
}

export const ChecklistProvider: React.FC<ChecklistProviderProps> = ({ children }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/checklist');
      const data = await response.json();
      
      if (data.success) {
        setItems(data.data);
      } else {
        setError(data.message || 'Erro ao carregar checklist');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao buscar checklist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, []);

  const value: ChecklistContextType = {
    items,
    loading,
    error,
    fetchChecklist,
  };

  return (
    <ChecklistContext.Provider value={value}>
      {children}
    </ChecklistContext.Provider>
  );
};
