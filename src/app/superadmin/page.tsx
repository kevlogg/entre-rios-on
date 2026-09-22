import React from 'react';
import { getAllCommerces, getUpcomingEvents, getCities } from '@/lib/dal/portal';
import { SuperAdminHeader } from '@/components/superadmin/SuperAdminHeader';
import { SuperAdminDashboardClient } from '@/components/superadmin/SuperAdminDashboardClient';

export const revalidate = 60;

export default async function SuperAdminPage() {
  const [commerces, events, cities] = await Promise.all([
    getAllCommerces(),
    getUpcomingEvents(),
    getCities(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Top Navbar */}
      <SuperAdminHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        <SuperAdminDashboardClient
          initialCommerces={commerces}
          initialEvents={events}
          initialCities={cities}
        />
      </main>
    </div>
  );
}
