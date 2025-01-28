import { Suspense } from 'react';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { format } from 'date-fns';

async function getAlertHistory() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const alerts = await db.alert.findMany({
    where: {
      userId: session.user.id,
      lastTriggered: {
        not: null,
      },
    },
    orderBy: {
      lastTriggered: 'desc',
    },
  });

  return alerts;
}

export default async function HistoryPage() {
  const alerts = await getAlertHistory();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Alert History</h1>
            <p className="mt-2 text-sm text-gray-600">
              View your past alert notifications
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6">
              <Suspense fallback={<div>Loading history...</div>}>
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No alert history available</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Alerts will appear here when they are triggered
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="py-4 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {alert.symbol}
                          </div>
                          <div className="text-sm text-gray-500">
                            {alert.type} {alert.condition.toLowerCase()} {alert.value}
                          </div>
                          <div className="text-xs text-gray-400">
                            Triggered: {format(new Date(alert.lastTriggered!), 'PPpp')}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          alert.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {alert.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
