import React from 'react';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientHomeContainer } from '@/components/client-portal/ClientHomeContainer';
import { ClientFooter } from '@/components/layout/ClientFooter';

export const revalidate = 60;

export default function ClientHomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Header oficial del cliente */}
      <ClientHeader />

      {/* Contenedor principal con estado interactivo de categorías */}
      <ClientHomeContainer />

      {/* Footer oficial con silueta del mapa de Entre Ríos */}
      <ClientFooter />
    </div>
  );
}

