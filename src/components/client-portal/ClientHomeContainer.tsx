'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ClientHeader } from '@/components/layout/ClientHeader';
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

import { StickySideBanners } from '@/components/client-portal/StickySideBanners';

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
      {/* 1. Header con fondo degradé de marca ON MÁS */}
      <ClientHeader withBackground={true} />

      {/* 2. Hero Banner (Sin fondo degradé, directamente sobre la página) */}
      <div className="w-full py-2">
        <ClientHeroBanner provinceId={activeProvince} />
      </div>

      {/* 3. ÁREA RESTANTE CON FONDO GRIS SUAVE LISO (#e9ecef) - Arranca justo en Explorá por Ciudad */}
      <div className="bg-[#e9ecef] w-full py-2 sm:py-4 space-y-2 text-slate-900 relative">
        {/* Dynamic Skyscraper Side Banners (Márgenes laterales arranca en Explorá por Ciudad y frena antes del Footer) */}
        <StickySideBanners />
        
        {/* A. Debajo del Hero: Explorá por Ciudad (Sin fondo degradé) */}
        <CityExploreBar provinceId={activeProvince} />

        {/* B. Luego: Las 8 Cards Grandes (BentoRowOne + BentoRowTwo) */}
        <BentoRowOne />
        <BentoRowTwo />

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
