import { create } from 'zustand';
import { StockData } from '@/lib/alpha-vantage';

interface StockStore {
  currentSymbol: string | null;
  stockData: StockData | null;
  isLoading: boolean;
  error: string | null;
  setCurrentSymbol: (symbol: string) => void;
  setStockData: (data: StockData | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStockStore = create<StockStore>((set) => ({
  currentSymbol: null,
  stockData: null,
  isLoading: false,
  error: null,
  setCurrentSymbol: (symbol) => set({ currentSymbol: symbol }),
  setStockData: (data) => set({ stockData: data }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
