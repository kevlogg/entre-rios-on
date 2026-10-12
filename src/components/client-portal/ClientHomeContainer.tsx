'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientHeroBanner } from '@/components/client-portal/ClientHeroBanner';
import { CityExploreBar } from '@/components/client-portal/CityExploreBar';
import { CategoryIconBar } from '@/components/client-portal/CategoryIconBar';
import { FeaturedOffersGrid } from '@/components/client-portal/FeaturedOffersGrid';
import { FeaturedSectionsGrid } from '@/components/client-portal/FeaturedSectionsGrid';
import { AboutUsHomeSection } from '@/components/home/AboutUsHomeSection';
import { getProvinceBySlug } from '@/lib/constants/locations';
import { useSideBanners } from '@/lib/services/side-banners-store';
import { Product } from '@/types';

interface ClientHomeContainerProps {
  provinceId?: string;
  initialProducts?: Product[];
}

export function ClientHomeContainer({ provinceId, initialProducts = [] }: ClientHomeContainerProps) {
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProvince, setActiveProvince] = useState<string>(provinceId || 'santa-fe');

  // Dynamic Side Banners loaded from SuperAdmin / Supabase
  const sideBanners = useSideBanners();

  // Partition banners by position or fallbacks
  const leftBanners = sideBanners.filter((b) => b.position === 'left' || b.position === 'both');
  const rightBanners = sideBanners.filter((b) => b.position === 'right' || b.position === 'both');

  const leftTopBanner = leftBanners[0] || sideBanners[0];
  const leftBottomBanner = leftBanners[1] || sideBanners[1] || leftBanners[0];

  const rightTopBanner = rightBanners[0] || sideBanners[2] || sideBanners[0];
  const rightBottomBanner = rightBanners[1] || sideBanners[3] || rightBanners[0];

  const mobileBanners = sideBanners.slice(0, 4);

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
    setActiveProvince('santa-fe');
  }, [pathname, provinceId]);

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen flex flex-col">
      {/* 1. Header Oficial (Top Bar Blanca + Subnav Degradé ON+) */}
      <ClientHeader />

      {/* 2. Main Content Container */}
      <div className="w-full max-w-[1480px] mx-auto px-2 min-[360px]:px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex-1">
        
        {/* ========================================================================= */}
        {/* MOBILE VIEW (< lg): Hero Banner + Ads Dinámicos de SuperAdmin + Contenido */}
        {/* ========================================================================= */}
        <div className="lg:hidden w-full mb-3">
          <ClientHeroBanner provinceId={activeProvince} />

          {/* Banners publicitarios dinámicos desde SuperAdmin en celular */}
          {mobileBanners.length > 0 && (
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              {mobileBanners.map((banner) => (
                <Link
                  key={banner.id}
                  href={banner.href || '/planes'}
                  className="block rounded-xl overflow-hidden border border-slate-200/90 relative aspect-[16/10] bg-slate-900 group cursor-pointer"
                  title={banner.title}
                >
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP BLOQUE 1 (SUPERIOR):                                              */}
        {/* Desde el Hero Banner principal hasta "Productos y oportunidades"          */}
        {/* Los primeros banners laterales llegan EXACTAMENTE hasta Productos         */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-[180px_1fr_180px] xl:grid-cols-[200px_1fr_200px] 2xl:grid-cols-[220px_1fr_220px] gap-3.5 xl:gap-4.5 items-stretch">
          
          {/* COLUMNA IZQUIERDA SUPERIOR: Banner 1 (llega hasta la sección Productos) */}
          <aside className="w-full h-full flex flex-col">
            {leftTopBanner && (
              <Link
                href={leftTopBanner.href || '/sorteos'}
                className="block w-full h-full min-h-[520px] rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400 transition-colors relative bg-slate-900 group cursor-pointer"
                title={leftTopBanner.title}
              >
                <img
                  src={leftTopBanner.imageUrl}
                  alt={leftTopBanner.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </Link>
            )}
          </aside>

          {/* COLUMNA CENTRAL SUPERIOR: Hero + Ciudades + Categorías + Productos */}
          <main className="w-full min-w-0 space-y-2 sm:space-y-3">
            {/* 1. Banner Principal de Santa Fe (Cargado dinámicamente desde SuperAdmin) */}
            <ClientHeroBanner provinceId={activeProvince} />

            {/* 2. Explorá por Ciudad · Santa Fe (8 Ciudades) */}
            <CityExploreBar provinceId={activeProvince} />

            {/* 3. Categorías Principales (8 Categorías Compactas con Fotos Reales) */}
            <CategoryIconBar
              selectedCategory={selectedCategory}
              onSelectCategory={(catId) => setSelectedCategory(catId)}
            />

            {/* 4. Productos y Oportunidades Destacadas (6 Tarjetas con Precios y Favoritos) */}
            <FeaturedOffersGrid
              products={initialProducts}
              selectedCategory={selectedCategory}
            />
          </main>

          {/* COLUMNA DERECHA SUPERIOR: Banner 1 (llega hasta la sección Productos) */}
          <aside className="w-full h-full flex flex-col">
            {rightTopBanner && (
              <Link
                href={rightTopBanner.href || '/planes'}
                className="block w-full h-full min-h-[520px] rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400 transition-colors relative bg-slate-900 group cursor-pointer"
                title={rightTopBanner.title}
              >
                <img
                  src={rightTopBanner.imageUrl}
                  alt={rightTopBanner.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </Link>
            )}
          </aside>

        </div>

        {/* ========================================================================= */}
        {/* DESKTOP BLOQUE 2 (INFERIOR):                                              */}
        {/* Debajo de Productos: Cards de Secciones de SuperAdmin + Quiénes Somos      */}
        {/* Los segundos banners laterales se ubican abajo de cada lado               */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-[180px_1fr_180px] xl:grid-cols-[200px_1fr_200px] 2xl:grid-cols-[220px_1fr_220px] gap-3.5 xl:gap-4.5 items-stretch mt-3 sm:mt-4">
          
          {/* COLUMNA IZQUIERDA INFERIOR: Banner 2 (debajo del primer banner) */}
          <aside className="w-full h-full flex flex-col">
            {leftBottomBanner && (
              <Link
                href={leftBottomBanner.href || '/turismo'}
                className="block w-full h-full min-h-[220px] rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400 transition-colors relative bg-slate-900 group cursor-pointer"
                title={leftBottomBanner.title}
              >
                <img
                  src={leftBottomBanner.imageUrl}
                  alt={leftBottomBanner.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </Link>
            )}
          </aside>

          {/* COLUMNA CENTRAL INFERIOR: Secciones Destacadas + Quiénes Somos */}
          <div className="w-full min-w-0 space-y-2 sm:space-y-3">
            {/* 5. Descubrí todo lo que podés hacer en ON+ (Cards desde SuperAdmin) */}
            <FeaturedSectionsGrid />

            {/* 6. Quiénes Somos (Card Blanco con Tipografía Azul Oscuro y Turquesa) */}
            <AboutUsHomeSection />
          </div>

          {/* COLUMNA DERECHA INFERIOR: Banner 2 (debajo del primer banner) */}
          <aside className="w-full h-full flex flex-col">
            {rightBottomBanner && (
              <Link
                href={rightBottomBanner.href || '/turismo'}
                className="block w-full h-full min-h-[220px] rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400 transition-colors relative bg-slate-900 group cursor-pointer"
                title={rightBottomBanner.title}
              >
                <img
                  src={rightBottomBanner.imageUrl}
                  alt={rightBottomBanner.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                />
              </Link>
            )}
          </aside>

        </div>

        {/* ========================================================================= */}
        {/* MOBILE CONTINUACIÓN (< lg): Resto de secciones en flujo continuo          */}
        {/* ========================================================================= */}
        <div className="lg:hidden w-full space-y-2 mt-2">
          {/* Explorá por Ciudad */}
          <CityExploreBar provinceId={activeProvince} />

          {/* Categorías Principales */}
          <CategoryIconBar
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => setSelectedCategory(catId)}
          />

          {/* Productos y Oportunidades Destacadas */}
          <FeaturedOffersGrid
            products={initialProducts}
            selectedCategory={selectedCategory}
          />

          {/* Secciones Destacadas (desde SuperAdmin) */}
          <FeaturedSectionsGrid />

          {/* Quiénes Somos */}
          <AboutUsHomeSection />
        </div>

      </div>
    </div>
  );
}
