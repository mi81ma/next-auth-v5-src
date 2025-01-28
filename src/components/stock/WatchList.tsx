"use client"

import { useEffect, useState } from 'react';
import { useStockStore } from '@/store/use-stock-store';

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  createdAt: string;
}

export default function WatchList() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setCurrentSymbol } = useStockStore();

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await fetch('/api/watchlist');
      if (!response.ok) throw new Error('Failed to fetch watchlist');
      const data = await response.json();
      setWatchlist(data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (symbol: string) => {
    try {
      const response = await fetch(`/api/watchlist?symbol=${symbol}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to remove from watchlist');
      
      // Update local state
      setWatchlist(current => current.filter(item => item.symbol !== symbol));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const handleSelectSymbol = (symbol: string) => {
    setCurrentSymbol(symbol);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-500">Loading watchlist...</div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Your watchlist is empty</p>
        <p className="text-sm text-gray-400 mt-2">
          Search for stocks and add them to your watchlist
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {watchlist.map((item) => (
        <div
          key={item.id}
          className="py-4 flex items-center justify-between hover:bg-gray-50 px-4"
        >
          <button
            onClick={() => handleSelectSymbol(item.symbol)}
            className="flex-1 flex items-center text-left"
          >
            <div>
              <div className="font-medium text-gray-900">{item.symbol}</div>
              <div className="text-sm text-gray-500">{item.name}</div>
            </div>
          </button>
          <button
            onClick={() => handleRemoveFromWatchlist(item.symbol)}
            className="ml-4 text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
