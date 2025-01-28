"use client";

import { useState } from 'react';
import { useStockStore } from '@/store/use-stock-store';

interface AlertForm {
  symbol: string;
  type: 'PRICE' | 'RSI' | 'MACD' | 'MOVING_AVERAGE';
  condition: 'ABOVE' | 'BELOW' | 'CROSSES_ABOVE' | 'CROSSES_BELOW';
  value: number;
}

export default function AlertSettings() {
  const { currentSymbol } = useStockStore();
  const [alertForm, setAlertForm] = useState<AlertForm>({
    symbol: currentSymbol || '',
    type: 'PRICE',
    condition: 'ABOVE',
    value: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertForm),
      });

      if (!response.ok) {
        throw new Error('Failed to create alert');
      }

      // Reset form or show success message
      alert('Alert created successfully');
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Failed to create alert');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Create Alert</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Alert Type</label>
          <select
            value={alertForm.type}
            onChange={(e) => setAlertForm({ ...alertForm, type: e.target.value as AlertForm['type'] })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="PRICE">Price</option>
            <option value="RSI">RSI</option>
            <option value="MACD">MACD</option>
            <option value="MOVING_AVERAGE">Moving Average</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Condition</label>
          <select
            value={alertForm.condition}
            onChange={(e) => setAlertForm({ ...alertForm, condition: e.target.value as AlertForm['condition'] })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="ABOVE">Above</option>
            <option value="BELOW">Below</option>
            <option value="CROSSES_ABOVE">Crosses Above</option>
            <option value="CROSSES_BELOW">Crosses Below</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Value</label>
          <input
            type="number"
            value={alertForm.value}
            onChange={(e) => setAlertForm({ ...alertForm, value: parseFloat(e.target.value) })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Alert
        </button>
      </form>
    </div>
  );
}
