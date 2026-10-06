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
import { PageBackground } from '@/components/common/PageBackground';
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
    <div className="w-full">
      {/* 1. SECCIÓN HERO (Dentro del área con Degradé de Marca ON MÁS) */}
      <div className="relative bg-gradient-on-mas pb-6 sm:pb-8 shadow-md">
        <PageBackground />
        <div className="relative z-10">
          <ClientHeroBanner provinceId={activeProvince} />
        </div>
      </div>

      {/* 2. ÁREA RESTANTE CON FONDO GRIS SUAVE LISO (#e9ecef) */}
      <div className="bg-[#e9ecef] w-full py-2 sm:py-4 space-y-2 text-slate-900">
        
        {/* A. Abajo del Hero: Las 8 Cards Grandes Cuadradas (BentoRowOne + BentoRowTwo) */}
        <BentoRowOne />
        <BentoRowTwo />

        {/* B. Por debajo: Explorá por Ciudad */}
        <CityExploreBar provinceId={activeProvince} />

        {/* C. Abajo: Categorías (sobre el mismo gris de la página) */}
        <CategoryIconBar
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
        />

        {/* D. Debajo: Catálogo y Ofertas */}
        <FeaturedOffersGrid
          products={initialProducts}
          selectedCategory={selectedCategory}
        />

        {/* E. Luego: Card de Quiénes Somos */}
        <AboutUsHomeSection />
      </div>
    </div>
  );
}
