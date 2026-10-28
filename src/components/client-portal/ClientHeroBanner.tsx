'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProvinceBanners, normalizeImageUrl, DEFAULT_PROVINCE_BANNERS, BannerItem } from '@/lib/services/banner-store';

interface ClientHeroBannerProps {
  provinceId?: string;
}

export function ClientHeroBanner({ provinceId }: ClientHeroBannerProps) {
  const targetProvId = !provinceId || provinceId === 'todas' ? 'all' : provinceId;

  // Dynamic banners loaded from Supabase / SuperAdmin
  const dynamicBanners = useProvinceBanners(targetProvId);
  const banners = dynamicBanners && dynamicBanners.length > 0
    ? dynamicBanners
    : (DEFAULT_PROVINCE_BANNERS[targetProvId] || DEFAULT_PROVINCE_BANNERS['all'] || DEFAULT_PROVINCE_BANNERS['santa-fe'] || []);

  const [currentIndex, setCurrentIndex] = useState(0);
  // Flag crítico: evita hydration mismatch renderizando el carrusel interactivo solo en cliente
  const [mounted, setMounted] = useState(false);
  const totalSlides = banners.length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Reset index cuando cambia la provincia
  useEffect(() => {
    setCurrentIndex(0);
  }, [provinceId]);

  // Auto-play
  useEffect(() => {
    if (!mounted || totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [mounted, totalSlides]);

  if (totalSlides === 0) return null;

  // Helper para construir href seguro (nunca '/all' ni '/undefined')
  const buildHref = (slide: BannerItem): { href: string; isExternal: boolean } => {
    const raw = slide.ctaHref || (provinceId && provinceId !== 'all' ? `/${provinceId}` : '/');
    const isExternal = Boolean(
      slide.isExternal ||
      raw.startsWith('http://') ||
      raw.startsWith('https://')
    );
    return { href: raw, isExternal };
  };

  const wrapperClass = 'relative w-full aspect-[3/1] min-h-[120px] sm:min-h-[160px] lg:min-h-[200px] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/90 group shadow-xs';

  // ── SSR / primer frame: solo primer slide estático, sin botones interactivos ──
  // Esto evita el hydration mismatch porque el árbol del DOM siempre empieza igual.
  if (!mounted) {
    const firstSlide = banners[0];
    const { href, isExternal } = buildHref(firstSlide);
    const imgSrc = normalizeImageUrl(firstSlide.imageUrl);
    return (
      <section aria-label="Banner Principal" className="w-full relative">
        <div className={wrapperClass}>
          {isExternal ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block w-full h-full">
              <img
                src={imgSrc}
                alt={firstSlide.titleLine1 || 'Banner'}
                className="w-full h-full object-cover object-center"
              />
            </a>
          ) : (
            <Link href={href} className="absolute inset-0 block w-full h-full">
              <img
                src={imgSrc}
                alt={firstSlide.titleLine1 || 'Banner'}
                className="w-full h-full object-cover object-center"
              />
            </Link>
          )}
        </div>
      </section>
    );
  }

  // ── Cliente hidratado: carrusel completo ──
  return (
    <section aria-label="Banner Principal" className="w-full relative">
      <div className={wrapperClass}>

        {/* Slides */}
        {banners.map((slide: BannerItem, idx: number) => {
          const isCurrent = idx === currentIndex;
          const { href, isExternal } = buildHref(slide);
          const imgSrc = normalizeImageUrl(slide.imageUrl);

          const slideClass = `absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out cursor-pointer ${
            isCurrent ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
          }`;

          return isExternal ? (
            <a key={slide.id || `slide-${idx}`} href={href} target="_blank" rel="noopener noreferrer" className={slideClass}>
              <img
                src={imgSrc}
                alt={slide.titleLine1 || 'Banner Publicitario'}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding={idx === 0 ? 'sync' : 'async'}
                // @ts-ignore
                fetchpriority={idx === 0 ? 'high' : 'auto'}
                className="w-full h-full object-cover object-center"
              />
            </a>
          ) : (
            <Link key={slide.id || `slide-${idx}`} href={href} className={slideClass}>
              <img
                src={imgSrc}
                alt={slide.titleLine1 || 'Banner Publicitario'}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding={idx === 0 ? 'sync' : 'async'}
                // @ts-ignore
                fetchpriority={idx === 0 ? 'high' : 'auto'}
                className="w-full h-full object-cover object-center"
              />
            </Link>
          );
        })}

        {/* Botones Prev/Next y Dots — solo visibles si hay más de 1 slide */}
        {totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevSlide(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextSlide(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
              aria-label="Slide siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-full">
              {banners.map((_: BannerItem, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(idx); }}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex ? 'bg-[#0070F3] w-4' : 'bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Ir a slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

      </div>
    </section>
  );
}
