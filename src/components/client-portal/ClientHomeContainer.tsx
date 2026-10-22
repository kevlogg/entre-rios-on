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
import { AppDownloadCard } from '@/components/home/AppDownloadCard';
import { getProvinceBySlug } from '@/lib/constants/locations';
import { useSideBanners } from '@/lib/services/side-banners-store';
import { getPersistedProvince, setPersistedProvince } from '@/lib/services/province-store';
import { Product } from '@/types';

interface ClientHomeContainerProps {
  provinceId?: string;
  initialProducts?: Product[];
}

export function ClientHomeContainer({ provinceId, initialProducts = [] }: ClientHomeContainerProps) {
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProvince, setActiveProvince] = useState<string | null>(provinceId || null);

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
    if (provinceId && provinceId !== 'all') {
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

    // Si estamos en la portada raíz "/" o no hay provincia en la ruta, NO hay provincia seleccionada
    setActiveProvince(null);
  }, [pathname, provinceId]);

  // Escuchar cambios de provincia disparados desde el selector en tiempo real
  useEffect(() => {
    const handleProvinceChange = (e: any) => {
      const newProvId = e.detail?.provinceId;
      // Si es 'all', null o vacío → limpiar para ocultar CityExploreBar
      if (!newProvId || newProvId === 'all') {
        setActiveProvince(null);
      } else {
        setActiveProvince(newProvId);
      }
    };
    window.addEventListener('onmas:province_changed', handleProvinceChange);
    return () => window.removeEventListener('onmas:province_changed', handleProvinceChange);
  }, []);

  return (
    <div className="w-full bg-[#e2e8f0] text-slate-900 min-h-screen flex flex-col">
      {/* 1. Header Oficial (Top Bar Blanca + Subnav Degradé ON+) */}
      <ClientHeader />

      {/* 2. Main Content Container */}
      <div className="w-full max-w-[1540px] mx-auto px-2 min-[360px]:px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex-1">
        
        {/* ========================================================================= */}
        {/* MOBILE VIEW (< lg): Hero Banner Principal                                 */}
        {/* ========================================================================= */}
        <div className="lg:hidden w-full mb-2.5">
          <ClientHeroBanner provinceId={activeProvince || 'all'} />
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP (>= lg): Grilla unificada de 3 columnas                           */}
        {/* Los 4 banners laterales (2 a la izquierda y 2 a la derecha) tienen       */}
        {/* EXACTAMENTE la misma altura (50% de la columna cada uno).                */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-[165px_1fr_165px] xl:grid-cols-[185px_1fr_185px] 2xl:grid-cols-[205px_1fr_205px] gap-3.5 xl:gap-4.5 items-start">
          
          {/* COLUMNA IZQUIERDA: 2 Banners con proporción áurea fija (evita estiramiento) */}
          <aside className="w-full self-start sticky top-3 flex flex-col gap-3.5">
            <div className="w-full aspect-[1/2.7] max-h-[560px] rounded-2xl overflow-hidden flex flex-col">
              {leftTopBanner && (
                <Link
                  href={leftTopBanner.href || '/sorteos'}
                  className="block w-full h-full rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400 transition-colors relative bg-slate-900 group cursor-pointer shadow-2xs hover:shadow-md"
                  title={leftTopBanner.title}
                >
                  <img
                    src={leftTopBanner.imageUrl}
                    alt={leftTopBanner.title}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  />
                </Link>
              )}
            </div>

            <div className="w-full aspect-[1/2.7] max-h-[560px] rounded-2xl overflow-hidden flex flex-col">
              {leftBottomBanner && (
                <Link
                  href={leftBottomBanner.href || '/turismo'}
                  className="block w-full h-full rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400 transition-colors relative bg-slate-900 group cursor-pointer shadow-2xs hover:shadow-md"
                  title={leftBottomBanner.title}
                >
                  <img
                    src={leftBottomBanner.imageUrl}
                    alt={leftBottomBanner.title}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  />
                </Link>
              )}
            </div>
          </aside>

          {/* COLUMNA CENTRAL: Hero + Ciudades + Categorías + Productos + Secciones Destacadas + Quiénes Somos */}
          <main className="w-full min-w-0 space-y-3 sm:space-y-4">
            {/* 1. Banner Principal de Portada / Provincia (Cargado dinámicamente desde SuperAdmin) */}
            <ClientHeroBanner provinceId={activeProvince || 'all'} />

            {/* 2. Explorá por Ciudad (Sólo se muestra si hay provincia seleccionada) */}
            {activeProvince && activeProvince !== 'all' && <CityExploreBar provinceId={activeProvince} />}

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

            {/* 5. Descubrí todo lo que podés hacer en ON+ (Cards desde SuperAdmin) */}
            <FeaturedSectionsGrid />

            {/* 6. Quiénes Somos (Card Blanco con Tipografía Azul Oscuro y Turquesa) */}
            <AboutUsHomeSection />

            {/* 7. Card Fijo para Descargar App Oficial */}
            <AppDownloadCard />
          </main>

          {/* COLUMNA DERECHA: 2 Banners con proporción áurea fija */}
          <aside className="w-full self-start sticky top-3 flex flex-col gap-3.5">
            <div className="w-full aspect-[1/2.7] max-h-[560px] rounded-2xl overflow-hidden flex flex-col">
              {rightTopBanner && (
                <Link
                  href={rightTopBanner.href || '/planes'}
                  className="block w-full h-full rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400 transition-colors relative bg-slate-900 group cursor-pointer shadow-2xs hover:shadow-md"
                  title={rightTopBanner.title}
                >
                  <img
                    src={rightTopBanner.imageUrl}
                    alt={rightTopBanner.title}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  />
                </Link>
              )}
            </div>

            <div className="w-full aspect-[1/2.7] max-h-[560px] rounded-2xl overflow-hidden flex flex-col">
              {rightBottomBanner && (
                <Link
                  href={rightBottomBanner.href || '/turismo'}
                  className="block w-full h-full rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400 transition-colors relative bg-slate-900 group cursor-pointer shadow-2xs hover:shadow-md"
                  title={rightBottomBanner.title}
                >
                  <img
                    src={rightBottomBanner.imageUrl}
                    alt={rightBottomBanner.title}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  />
                </Link>
              )}
            </div>
          </aside>

        </div>

        {/* ========================================================================= */}
        {/* MOBILE CONTINUACIÓN (< lg): Resto de secciones en flujo continuo          */}
        {/* ========================================================================= */}
        <div className="lg:hidden w-full space-y-2 mt-2">
          {/* Explorá por Ciudad (Sólo se muestra si hay provincia seleccionada) */}
          {activeProvince && activeProvince !== 'all' && <CityExploreBar provinceId={activeProvince} />}

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

          {/* Card Fijo para Descargar App Oficial */}
          <AppDownloadCard />
        </div>

      </div>
    </div>
  );
}
