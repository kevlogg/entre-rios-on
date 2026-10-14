'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { useSideBanners } from '@/lib/services/side-banners-store';

interface DynamicLayoutWrapperProps {
  children: React.ReactNode;
  heroContent?: React.ReactNode;
  selectedCityId?: string;
}

function DynamicLayoutContent({ children, heroContent }: DynamicLayoutWrapperProps) {
  const sideBanners = useSideBanners();

  // Particionar banners simétricos por posición
  const leftBanners = sideBanners.filter((b) => b.position === 'left' || b.position === 'both');
  const rightBanners = sideBanners.filter((b) => b.position === 'right' || b.position === 'both');

  const leftTopBanner = leftBanners[0] || sideBanners[0];
  const leftBottomBanner = leftBanners[1] || sideBanners[1] || leftBanners[0];

  const rightTopBanner = rightBanners[0] || sideBanners[2] || sideBanners[0];
  const rightBottomBanner = rightBanners[1] || sideBanners[3] || rightBanners[0];

  return (
    <div className="w-full bg-white text-slate-900 min-h-screen flex flex-col">
      {/* 1. Header Oficial (Top Bar Blanca + Subnav Degradé ON+) */}
      <ClientHeader />

      {/* 2. Main Content Container (Misma estructura y ancho que la Portada) */}
      <div className="w-full max-w-[1540px] mx-auto px-2 min-[360px]:px-3 sm:px-4 lg:px-6 py-2 sm:py-3 flex-1">
        
        {/* ========================================================================= */}
        {/* MOBILE VIEW (< lg): Card de información centrada arriba + resto contenido */}
        {/* ========================================================================= */}
        <div className="lg:hidden w-full space-y-3">
          {heroContent && (
            <div className="w-full rounded-2xl overflow-hidden bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#0070F3] p-4 sm:p-6 text-white shadow-2xs border border-slate-200/80">
              {heroContent}
            </div>
          )}
          <div className="w-full">
            {children}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP (>= lg): Grilla unificada de 3 columnas (idéntica a la Portada)   */}
        {/* Los 4 banners laterales tienen EXACTAMENTE la misma altura.               */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid lg:grid-cols-[165px_1fr_165px] xl:grid-cols-[185px_1fr_185px] 2xl:grid-cols-[205px_1fr_205px] gap-3.5 xl:gap-4.5 items-start">
          
          {/* COLUMNA IZQUIERDA: 2 Banners con proporción áurea fija (evita estiramiento en páginas largas) */}
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

          {/* COLUMNA CENTRAL: Card de información arriba + Contenido principal */}
          <main className="w-full min-w-0 space-y-4 flex flex-col">
            {heroContent && (
              <div className="w-full rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#0070F3] p-5 sm:p-7 text-white shadow-2xs border border-slate-200/80 relative">
                {heroContent}
              </div>
            )}
            <div className="w-full flex-1">
              {children}
            </div>
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
      </div>

      {/* 3. Footer Oficial */}
      <ClientFooter />
    </div>
  );
}

export function DynamicLayoutWrapper({ children, heroContent, selectedCityId }: DynamicLayoutWrapperProps) {
  return (
    <Suspense fallback={
      <div className="w-full bg-white text-slate-900 min-h-screen flex flex-col">
        <ClientHeader />
        <main className="flex-1 w-full max-w-[1540px] mx-auto px-4 py-8">{children}</main>
        <ClientFooter />
      </div>
    }>
      <DynamicLayoutContent heroContent={heroContent} selectedCityId={selectedCityId}>
        {children}
      </DynamicLayoutContent>
    </Suspense>
  );
}
