import React from 'react';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientHomeContainer } from '@/components/client-portal/ClientHomeContainer';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { ComingSoonView } from '@/components/common/ComingSoonView';
import { getFeaturedProducts } from '@/lib/dal/portal';

export const revalidate = 60;

// FLAG MODO PRÓXIMAMENTE (true = Muestra pantalla de lanzamiento / false = Muestra sitio completo)
const SHOW_COMING_SOON = true;

export default async function ClientHomePage() {
  if (SHOW_COMING_SOON) {
    return <ComingSoonView />;
  }

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


