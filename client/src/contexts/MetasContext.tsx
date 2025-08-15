import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Meta {
  id: string;
  titulo: string;
  valor_objetivo: number;
  valor_atual: number;
  tipo: 'reserva_emergencia' | 'viagem' | 'outro';
  data_criacao: string;
  data_objetivo?: string;
}

interface MetasContextType {
  metas: Meta[];
  loading: boolean;
  error: string | null;
  fetchMetas: () => Promise<void>;
  addMeta: (meta: Omit<Meta, 'id' | 'valor_atual' | 'data_criacao'>) => Promise<boolean>;
  updateMetaProgress: (id: string, valor_atual: number) => Promise<boolean>;
  getProgressoMeta: (meta: Meta) => number;
}

const MetasContext = createContext<MetasContextType | undefined>(undefined);

export const useMetas = () => {
  const context = useContext(MetasContext);
  if (context === undefined) {
    throw new Error('useMetas must be used within a MetasProvider');
  }
  return context;
};

interface MetasProviderProps {
  children: ReactNode;
}

export const MetasProvider: React.FC<MetasProviderProps> = ({ children }) => {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/metas');
      const data = await response.json();
      
      if (data.success) {
        setMetas(data.data);
      } else {
        setError(data.message || 'Erro ao carregar metas');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao buscar metas:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMeta = async (meta: Omit<Meta, 'id' | 'valor_atual' | 'data_criacao'>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const novaMeta = {
        ...meta,
        valor_atual: 0,
        data_criacao: new Date().toISOString().split('T')[0],
      };
      
      const response = await fetch('/api/metas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaMeta),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchMetas();
        return true;
      } else {
        setError(data.message || 'Erro ao criar meta');
        return false;
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao criar meta:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateMetaProgress = async (id: string, valor_atual: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/metas/${id}/progresso`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ valor_atual }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchMetas();
        return true;
      } else {
        setError(data.message || 'Erro ao atualizar meta');
        return false;
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao atualizar meta:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getProgressoMeta = (meta: Meta): number => {
    return Math.min((meta.valor_atual / meta.valor_objetivo) * 100, 100);
  };

  useEffect(() => {
    fetchMetas();
  }, []);

  const value: MetasContextType = {
    metas,
    loading,
    error,
    fetchMetas,
    addMeta,
    updateMetaProgress,
    getProgressoMeta,
  };

  return (
    <MetasContext.Provider value={value}>
      {children}
    </MetasContext.Provider>
  );
};
