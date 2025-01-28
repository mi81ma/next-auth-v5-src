"use client";

import { useState } from 'react';
import { searchSymbols, getStockData } from '@/lib/alpha-vantage';
import { useStockStore } from '@/store/use-stock-store';

export default function StockSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { setCurrentSymbol, setStockData, setIsLoading, setError } = useStockStore();

  const handleSearch = async () => {
    if (!searchTerm) return;

    setIsSearching(true);
    try {
      const results = await searchSymbols(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching symbols:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSymbolSelect = async (symbol: string, name: string) => {
    setCurrentSymbol(symbol);
    setIsLoading(true);
    setError(null);

    try {
      // Add to watchlist
      await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, name }),
      });

      // Get stock data
      const data = await getStockData(symbol);
      setStockData(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch stock data');
      setStockData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search for a stock symbol..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-4 border border-gray-200 rounded-md">
          {searchResults.map((result) => (
            <button
              key={result.symbol}
              onClick={() => handleSymbolSelect(result.symbol, result.name)}
              className="w-full p-4 text-left hover:bg-gray-50 flex justify-between items-center border-b last:border-b-0"
            >
              <div>
                <div className="font-medium">{result.symbol}</div>
                <div className="text-sm text-gray-500">{result.name}</div>
              </div>
              <div className="text-sm text-gray-400">{result.region}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
