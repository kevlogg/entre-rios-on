'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
import { Product } from '@/types';

interface ClientHomeContainerProps {
  provinceId?: string;
  initialProducts?: Product[];
}

export function ClientHomeContainer({ provinceId, initialProducts = [] }: ClientHomeContainerProps) {
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProvince, setActiveProvince] = useState<string>(provinceId || 'santa-fe');

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

      {/* 2. Main Content Container (3 Columnas en Desktop: Banner Izquierdo, Contenido Central, Banner Derecho) */}
      <div className="w-full max-w-[1480px] mx-auto px-2 min-[360px]:px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex-1">
        
        {/* Mobile Promotional Banners Carousel (Below Hero on mobile, in-flow side columns on desktop) */}
        <div className="lg:hidden w-full mb-3">
          <ClientHeroBanner provinceId={activeProvince} />

          {/* Mobile Ads: Clean 2x2 grid or horizontal scroll */}
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <Link
              href="/sorteos"
              className="block rounded-xl overflow-hidden border border-slate-200/90 relative aspect-[4/5] bg-blue-600"
            >
              <Image
                src="/banners/side-sorteo-del-mes.jpg"
                alt="Sorteo del Mes"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </Link>

            <Link
              href="/planes"
              className="block rounded-xl overflow-hidden border border-slate-200/90 relative aspect-[4/5] bg-blue-700"
            >
              <Image
                src="/banners/side-comercio-onmas.jpg"
                alt="Tu Comercio en ON MÁS"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </Link>

            <Link
              href="/turismo"
              className="block rounded-xl overflow-hidden border border-slate-200/90 relative aspect-[16/9] bg-sky-600"
            >
              <Image
                src="/banners/side-descubri-santa-fe.jpg"
                alt="Descubrí Santa Fe"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </Link>

            <Link
              href="/turismo"
              className="block rounded-xl overflow-hidden border border-slate-200/90 relative aspect-[16/9] bg-orange-500"
            >
              <Image
                src="/banners/side-costa-santafesina.jpg"
                alt="Viví la Costa Santafesina"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </Link>
          </div>
        </div>

        {/* Desktop 3-Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-[180px_1fr_180px] xl:grid-cols-[200px_1fr_200px] 2xl:grid-cols-[220px_1fr_220px] gap-3.5 xl:gap-4.5 items-start">
          
          {/* COLUMNA IZQUIERDA: Banners Publicitarios (100% clickeables, sin sombra, sin etiquetas, sin botones) */}
          <aside className="w-full space-y-3 shrink-0 flex flex-col">
            {/* Banner 1 Superior Izquierdo: Sorteo del Mes */}
            <Link
              href="/sorteos"
              className="block w-full rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400 transition-colors relative aspect-[156/404] bg-blue-600 group cursor-pointer"
              title="Sorteo del Mes ON+"
            >
              <Image
                src="/banners/side-sorteo-del-mes.jpg"
                alt="Sorteo del Mes ON+"
                fill
                sizes="(max-width: 1440px) 200px, 220px"
                className="object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </Link>

            {/* Banner 2 Inferior Izquierdo: Descubrí Santa Fe */}
            <Link
              href="/turismo"
              className="block w-full rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400 transition-colors relative aspect-[156/198] bg-sky-600 group cursor-pointer"
              title="Descubrí Santa Fe - Turismo Todo el Año"
            >
              <Image
                src="/banners/side-descubri-santa-fe.jpg"
                alt="Descubrí Santa Fe"
                fill
                sizes="(max-width: 1440px) 200px, 220px"
                className="object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </Link>
          </aside>

          {/* COLUMNA CENTRAL: Todo el Flujo Principal */}
          <main className="w-full min-w-0 space-y-2 sm:space-y-3">
            {/* 1. Banner Principal de Santa Fe */}
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

            {/* 5. Descubrí todo lo que podés hacer en ON+ (6 Secciones Destacadas) */}
            <FeaturedSectionsGrid />

            {/* 6. Quiénes Somos (Card Blanco con Tipografía Azul Oscuro y Turquesa) */}
            <AboutUsHomeSection />
          </main>

          {/* COLUMNA DERECHA: Banners Publicitarios (100% clickeables, sin sombra, sin etiquetas, sin botones) */}
          <aside className="w-full space-y-3 shrink-0 flex flex-col">
            {/* Banner 1 Superior Derecho: Tu Comercio en ON MÁS */}
            <Link
              href="/planes"
              className="block w-full rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400 transition-colors relative aspect-[156/404] bg-blue-700 group cursor-pointer"
              title="Tu Comercio en ON MÁS"
            >
              <Image
                src="/banners/side-comercio-onmas.jpg"
                alt="Tu Comercio en ON MÁS"
                fill
                sizes="(max-width: 1440px) 200px, 220px"
                className="object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </Link>

            {/* Banner 2 Inferior Derecho: Viví la Costa Santafesina */}
            <Link
              href="/turismo"
              className="block w-full rounded-2xl overflow-hidden border border-slate-200/80 hover:border-blue-400 transition-colors relative aspect-[156/198] bg-orange-600 group cursor-pointer"
              title="Viví la Costa Santafesina"
            >
              <Image
                src="/banners/side-costa-santafesina.jpg"
                alt="Viví la Costa Santafesina"
                fill
                sizes="(max-width: 1440px) 200px, 220px"
                className="object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </Link>
          </aside>

        </div>

        {/* Mobile Remaining Flow */}
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

          {/* Secciones Destacadas */}
          <FeaturedSectionsGrid />

          {/* Quiénes Somos */}
          <AboutUsHomeSection />
        </div>

      </div>
    </div>
  );
}
