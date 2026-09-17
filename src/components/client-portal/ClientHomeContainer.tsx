'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ClientHeroBanner } from '@/components/client-portal/ClientHeroBanner';
import { CategoryIconBar } from '@/components/client-portal/CategoryIconBar';
import { BentoRowOne } from '@/components/client-portal/BentoRowOne';
import { FeaturedOffersGrid } from '@/components/client-portal/FeaturedOffersGrid';
import { CityExploreBar } from '@/components/client-portal/CityExploreBar';
import { BentoRowTwo } from '@/components/client-portal/BentoRowTwo';
import { getProvinceBySlug } from '@/lib/constants/locations';

interface ClientHomeContainerProps {
  provinceId?: string;
}

export function ClientHomeContainer({ provinceId }: ClientHomeContainerProps) {
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProvince, setActiveProvince] = useState<string>(provinceId || 'santa-fe');

  // Detect province from URL if not passed explicitly as prop
  useEffect(() => {
    if (provinceId) {
      setActiveProvince(provinceId);
      return;
    }

    if (pathname) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        const provMatch = getProvinceBySlug(parts[0]);
        if (provMatch && provMatch.id !== 'all') {
          setActiveProvince(provMatch.id);
          return;
        }
      }
    }
    // Default to Santa Fe as the primary province
    setActiveProvince('santa-fe');
  }, [pathname, provinceId]);

  return (
    <>
      {/* Hero panorámico según provincia activa (Santa Fe por defecto) */}
      <ClientHeroBanner provinceId={activeProvince} />

      {/* Barra de 12 categorías por íconos */}
      <CategoryIconBar
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
      />

      {/* Primer Bento: Comercio Digital, Comunidad ON, Sorteos ON */}
      <BentoRowOne />

      {/* Ofertas e ítems filtrados por categoría */}
      <FeaturedOffersGrid selectedCategory={selectedCategory} />

      {/* Explorá por ciudad (Carrusel dinámico con ciudades de la provincia activa) */}
      <CityExploreBar provinceId={activeProvince} />

      {/* Segundo Bento: Industria, Turismo, Clasificados, Publicá tu Negocio */}
      <BentoRowTwo />
    </>
  );
}
