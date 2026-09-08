'use client';

import React, { useState } from 'react';
import { ClientHeroBanner } from '@/components/client-portal/ClientHeroBanner';
import { CategoryIconBar } from '@/components/client-portal/CategoryIconBar';
import { BentoRowOne } from '@/components/client-portal/BentoRowOne';
import { FeaturedOffersGrid } from '@/components/client-portal/FeaturedOffersGrid';
import { CityExploreBar } from '@/components/client-portal/CityExploreBar';
import { BentoRowTwo } from '@/components/client-portal/BentoRowTwo';

export function ClientHomeContainer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  return (
    <>
      {/* Hero panorámico "ENTRE RÍOS SIEMPRE ON" */}
      <ClientHeroBanner />

      {/* Barra de 12 categorías por íconos */}
      <CategoryIconBar
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
      />

      {/* Primer Bento: Comercio Digital, Comunidad ON, Sorteos ON */}
      <BentoRowOne />

      {/* Ofertas e ítems filtrados por categoría */}
      <FeaturedOffersGrid selectedCategory={selectedCategory} />

      {/* Explorá por ciudad (Carrusel de fotos) */}
      <CityExploreBar />

      {/* Segundo Bento: Industria, Turismo, Clasificados, Publicá tu Negocio */}
      <BentoRowTwo />
    </>
  );
}
