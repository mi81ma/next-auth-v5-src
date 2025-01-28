import { Suspense } from 'react';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import StockSearch from '@/components/stock/StockSearch';
import WatchList from '@/components/stock/WatchList';
import StockChart from '@/components/stock/StockChart';

async function getWatchlistItems() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const items = await db.watchlistItem.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return items;
}

export default async function WatchlistPage() {
  const watchlistItems = await getWatchlistItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Watchlist</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track and analyze your favorite stocks
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Your Watchlist</h2>
                  <Suspense fallback={<div>Loading watchlist...</div>}>
                    <WatchList />
                  </Suspense>
                </div>
              </div>

              <div className="mt-6 bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Add New Stock</h2>
                  <Suspense fallback={<div>Loading search...</div>}>
                    <StockSearch />
                  </Suspense>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Stock Analysis</h2>
                  <Suspense fallback={<div>Loading chart...</div>}>
                    <StockChart />
                  </Suspense>
                </div>
              </div>

              {watchlistItems.length === 0 && (
                <div className="mt-6 bg-white overflow-hidden shadow-sm rounded-lg">
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Your watchlist is empty
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Search for stocks and add them to your watchlist to start tracking them
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
