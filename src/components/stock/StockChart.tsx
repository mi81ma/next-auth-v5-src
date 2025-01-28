"use client";

import { useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useStockStore } from '@/store/use-stock-store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const calculateSMA = (data: number[], period: number) => {
  const sma = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const average = slice.reduce((sum, val) => sum + val, 0) / period;
    sma.push(average);
  }
  return sma;
};

const calculateRSI = (data: number[], period: number = 14) => {
  const changes = data.slice(1).map((price, i) => price - data[i]);
  const gains = changes.map(change => change > 0 ? change : 0);
  const losses = changes.map(change => change < 0 ? -change : 0);

  const rsi = [];
  let avgGain = gains.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((sum, val) => sum + val, 0) / period;

  for (let i = period; i < data.length; i++) {
    const rs = avgGain / avgLoss;
    rsi.push(100 - (100 / (1 + rs)));

    avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;
  }

  return rsi;
};

export default function StockChart() {
  const { stockData } = useStockStore();

  const chartData: ChartData<'line'> = useMemo(() => {
    if (!stockData) return { datasets: [], labels: [] };

    const prices = stockData.data.map(d => d.close);
    const dates = stockData.data.map(d => new Date(d.time).toLocaleString());
    const sma20 = calculateSMA(prices, 20);
    const sma50 = calculateSMA(prices, 50);
    const rsi = calculateRSI(prices);

    // Pad the beginning of SMA arrays with nulls
    const sma20Padded = Array(19).fill(null).concat(sma20);
    const sma50Padded = Array(49).fill(null).concat(sma50);
    const rsiPadded = Array(14).fill(null).concat(rsi);

    return {
      labels: dates,
      datasets: [
        {
          label: 'Price',
          data: prices,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'SMA 20',
          data: sma20Padded,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        },
        {
          label: 'SMA 50',
          data: sma50Padded,
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1,
        },
        {
          label: 'RSI',
          data: rsiPadded,
          borderColor: 'rgb(153, 102, 255)',
          tension: 0.1,
          yAxisID: 'rsi',
        },
      ],
    };
  }, [stockData]);

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      rsi: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (!stockData) {
    return <div className="flex items-center justify-center h-96">No data available</div>;
  }

  return (
    <div className="w-full h-96 p-4">
      <Line options={options} data={chartData} />
    </div>
  );
}
