import { Suspense } from 'react';
import { auth } from '@/auth';
import { db } from '@/lib/db';

async function getUserSettings() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      isTwoFactorEnabled: true,
    },
  });

  return user;
}

export default async function SettingsPage() {
  const user = await getUserSettings();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your account and notification preferences
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white shadow-sm rounded-lg">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <div className="mt-1 text-gray-900">{user.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 text-gray-900">{user.email}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Security</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      user.isTwoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alert Notifications</label>
                    <p className="text-sm text-gray-500">
                      Configure how you want to receive alert notifications
                    </p>
                    {/* Add notification preferences form here */}
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
