'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ClientHeroBanner } from '@/components/client-portal/ClientHeroBanner';
import { CategoryIconBar } from '@/components/client-portal/CategoryIconBar';
import { BentoRowOne } from '@/components/client-portal/BentoRowOne';
import { FeaturedOffersGrid } from '@/components/client-portal/FeaturedOffersGrid';
import { CityExploreBar } from '@/components/client-portal/CityExploreBar';
import { BentoRowTwo } from '@/components/client-portal/BentoRowTwo';
import { AboutUsHomeSection } from '@/components/home/AboutUsHomeSection';
import { getProvinceBySlug } from '@/lib/constants/locations';
import { Product } from '@/types';

interface ClientHomeContainerProps {
  provinceId?: string;
  initialProducts?: Product[];
}

export function ClientHomeContainer({ provinceId, initialProducts = [] }: ClientHomeContainerProps) {
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

      {/* Barra de categorías en grid 2x4 */}
      <CategoryIconBar
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => setSelectedCategory(catId)}
      />

      {/* Transición difuminada superior: del fondo de marca al gris suave */}
      <div className="w-full h-16 bg-gradient-to-b from-transparent via-[#e9ecef]/60 to-[#e9ecef] -mb-1 relative z-10 pointer-events-none" />

      {/* Contenedor con fondo gris suave liso */}
      <div className="bg-[#e9ecef] w-full space-y-2">
        {/* Primer Bento: Comercio Digital, Comunidad ON, Sorteos ON */}
        <BentoRowOne />

        {/* Ofertas e ítems reales de la base de datos Supabase / DAL */}
        <FeaturedOffersGrid
          products={initialProducts}
          selectedCategory={selectedCategory}
        />

        {/* Explorá por ciudad (Carrusel dinámico con ciudades de la provincia activa) */}
        <CityExploreBar provinceId={activeProvince} />

        {/* Segundo Bento: Industria, Turismo, Clasificados, Publicá tu Negocio */}
        <BentoRowTwo />

        {/* Sección resumen de ¿Quiénes Somos? con acceso directo a la página */}
        <AboutUsHomeSection />
      </div>

      {/* Transición difuminada inferior: del gris suave hacia el footer */}
      <div className="w-full h-16 bg-gradient-to-b from-[#e9ecef] via-[#e9ecef]/40 to-transparent -mt-1 relative z-10 pointer-events-none" />
    </>
  );
}
