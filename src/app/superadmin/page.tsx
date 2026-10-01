import React from 'react';
import { getAllCommerces, getUpcomingEvents, getCities } from '@/lib/dal/portal';
import { SuperAdminHeader } from '@/components/superadmin/SuperAdminHeader';
import { SuperAdminDashboardClient } from '@/components/superadmin/SuperAdminDashboardClient';
import { ClientFooter } from '@/components/layout/ClientFooter';
import type { Commerce, CommunityEvent, City } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SuperAdminPage() {
  let commerces: Commerce[] = [];
  let events: CommunityEvent[] = [];
  let cities: City[] = [];

  try {
    const results = await Promise.allSettled([
      getAllCommerces(true),
      getUpcomingEvents(),
      getCities(),
    ]);
    if (results[0].status === 'fulfilled') commerces = results[0].value as Commerce[];
    if (results[1].status === 'fulfilled') events = results[1].value as CommunityEvent[];
    if (results[2].status === 'fulfilled') cities = results[2].value as City[];
  } catch (err) {
    console.error('[SuperAdmin] Error cargando datos iniciales:', err);
    // La página igual renderiza — el cliente maneja sus propios datos
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SuperAdminHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        <SuperAdminDashboardClient
          initialCommerces={commerces}
          initialEvents={events}
          initialCities={cities}
        />
      </main>
      <ClientFooter />
    </div>
  );
}
