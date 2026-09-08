import React from 'react';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientHeroBanner } from '@/components/client-portal/ClientHeroBanner';
import { CategoryIconBar } from '@/components/client-portal/CategoryIconBar';
import { BentoRowOne } from '@/components/client-portal/BentoRowOne';
import { FeaturedOffersGrid } from '@/components/client-portal/FeaturedOffersGrid';
import { CityExploreBar } from '@/components/client-portal/CityExploreBar';
import { BentoRowTwo } from '@/components/client-portal/BentoRowTwo';
import { ClientFooter } from '@/components/layout/ClientFooter';

export const revalidate = 60;

export default function ClientHomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Header oficial del cliente */}
      <ClientHeader />

      {/* Hero panorámico "ENTRE RÍOS SIEMPRE ON" */}
      <ClientHeroBanner />

      {/* Barra de 12 categorías por íconos */}
      <CategoryIconBar />

      {/* Primer Bento: Comercio Digital, Comunidad ON, Sorteos ON */}
      <BentoRowOne />

      {/* Ofertas destacadas con pedido a WhatsApp */}
      <FeaturedOffersGrid />

      {/* Explorá por ciudad (Carrusel de fotos) */}
      <CityExploreBar />

      {/* Segundo Bento: Industria, Turismo, Clasificados, Publicá tu Negocio */}
      <BentoRowTwo />

      {/* Footer oficial con silueta del mapa de Entre Ríos */}
      <ClientFooter />
    </div>
  );
}
