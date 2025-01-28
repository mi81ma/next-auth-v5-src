import { Suspense } from 'react';
import StockSearch from '@/components/stock/StockSearch';
import StockChart from '@/components/stock/StockChart';
import AlertSettings from '@/components/stock/AlertSettings';
import WatchList from '@/components/stock/WatchList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Stock Analysis Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Search for stocks, analyze trends, and set up price alerts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Watchlist</h2>
                  <Suspense fallback={<div>Loading watchlist...</div>}>
                    <WatchList />
                  </Suspense>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                  <div className="p-6">
                    <Suspense fallback={<div>Loading search...</div>}>
                      <StockSearch />
                    </Suspense>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                  <div className="p-6">
                    <Suspense fallback={<div>Loading chart...</div>}>
                      <StockChart />
                    </Suspense>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                  <div className="p-6">
                    <Suspense fallback={<div>Loading alert settings...</div>}>
                      <AlertSettings />
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
