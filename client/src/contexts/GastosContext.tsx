import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Gasto {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  semana: string;
  observacoes?: string;
}

interface GastosContextType {
  gastos: Gasto[];
  loading: boolean;
  error: string | null;
  fetchGastosBySemana: (semana: string) => Promise<void>;
  addGasto: (gasto: Omit<Gasto, 'id'>) => Promise<boolean>;
  getGastosByCategoria: (categoria: string) => Gasto[];
  getTotalGastos: () => number;
}

const GastosContext = createContext<GastosContextType | undefined>(undefined);

export const useGastos = () => {
  const context = useContext(GastosContext);
  if (context === undefined) {
    throw new Error('useGastos must be used within a GastosProvider');
  }
  return context;
};

interface GastosProviderProps {
  children: ReactNode;
}

export const GastosProvider: React.FC<GastosProviderProps> = ({ children }) => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGastosBySemana = async (semana: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/gastos/semana/${semana}`);
      const data = await response.json();
      
      if (data.success) {
        setGastos(data.data.gastos);
      } else {
        setError(data.message || 'Erro ao carregar gastos');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao buscar gastos:', err);
    } finally {
      setLoading(false);
    }
  };

  const addGasto = async (gasto: Omit<Gasto, 'id'>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/gastos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gasto),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Recarregar gastos da semana atual
        await fetchGastosBySemana(gasto.semana);
        return true;
      } else {
        setError(data.message || 'Erro ao adicionar gasto');
        return false;
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
      console.error('Erro ao adicionar gasto:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getGastosByCategoria = (categoria: string): Gasto[] => {
    return gastos.filter(gasto => gasto.categoria === categoria);
  };

  const getTotalGastos = (): number => {
    return gastos.reduce((total, gasto) => total + gasto.valor, 0);
  };

  const value: GastosContextType = {
    gastos,
    loading,
    error,
    fetchGastosBySemana,
    addGasto,
    getGastosByCategoria,
    getTotalGastos,
  };

  return (
    <GastosContext.Provider value={value}>
      {children}
    </GastosContext.Provider>
  );
};
