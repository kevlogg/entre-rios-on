import React from 'react';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientHomeContainer } from '@/components/client-portal/ClientHomeContainer';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { getFeaturedProducts } from '@/lib/dal/portal';

export const revalidate = 60;

export default async function ClientHomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Header oficial del cliente */}
      <ClientHeader />

      {/* Contenedor principal con estado interactivo y productos reales de la base de datos */}
      <ClientHomeContainer initialProducts={products} />

      {/* Footer oficial con silueta del mapa de Entre Ríos */}
      <ClientFooter />
    </div>
  );
}


