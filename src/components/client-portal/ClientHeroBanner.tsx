'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { getBannersByProvince, BannerItem } from '@/lib/services/banner-store';

interface ClientHeroBannerProps {
  provinceId?: string;
}

export function ClientHeroBanner({ provinceId = 'santa-fe' }: ClientHeroBannerProps) {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadBanners = useCallback(() => {
    const activeBanners = getBannersByProvince(provinceId);
    setBanners(activeBanners);
  }, [provinceId]);

  // Load banners on mount or province change, and listen for SuperAdmin live updates
  useEffect(() => {
    loadBanners();
    setCurrentIndex(0);

    const handleUpdate = () => {
      loadBanners();
    };

    window.addEventListener('onmas_banners_updated', handleUpdate);
    return () => {
      window.removeEventListener('onmas_banners_updated', handleUpdate);
    };
  }, [provinceId, loadBanners]);

  const nextSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    if (banners.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, banners.length]);

  if (banners.length === 0) return null;

  const activeBanner = banners[currentIndex] || banners[0];

  const locationText = activeBanner.location || (provinceId === 'entre-rios' ? 'Entre Ríos ON' : 'Santa Fe ON');
  const titleLine1 = activeBanner.titleLine1 || (provinceId === 'entre-rios' ? 'ENTRE RÍOS,' : 'SANTA FE,');
  const titleLine2 = activeBanner.titleLine2 || 'SIEMPRE ON MÁS';
  const subtitleText = activeBanner.subtitle || 'Comprá. Vendé. Publicá. Conectá.';
  const ctaText = activeBanner.ctaText || 'Explorar Portal';
  const ctaHref = activeBanner.ctaHref || (provinceId === 'entre-rios' ? '/entre-rios' : '/santa-fe');

  return (
    <section 
      aria-label="Carrusel Destacado Regional"
      className="relative w-full overflow-hidden bg-slate-950 min-h-[420px] sm:min-h-[480px] flex items-center shadow-lg group"
    >
      {/* Background Images with Fade Transition */}
      {banners.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-90 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.imageUrl}
            alt={titleLine1 + ' ' + titleLine2}
            fill
            priority={idx === 0}
            className="object-cover object-center transform scale-105 group-hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        </div>
      ))}

      {/* Main Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#00ADB5] to-[#007C8A] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              <MapPin className="w-3.5 h-3.5" />
              <span>{locationText}</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md">
                {titleLine1}
              </h1>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md flex items-center gap-3">
                {titleLine2.includes('ON') ? (
                  <>SIEMPRE <span className="text-[#00E5E8] drop-shadow-lg">ON</span> <span className="text-[#0B66FF] drop-shadow-lg">MÁS</span></>
                ) : (
                  <span className="text-[#00E5E8] drop-shadow-lg">{titleLine2}</span>
                )}
              </h2>
            </div>

            <div className="space-y-1 text-slate-100 font-bold text-lg sm:text-2xl drop-shadow-sm">
              <p>{subtitleText}</p>
              <p className="text-slate-200 font-medium text-base sm:text-xl">
                Toda la provincia en un solo lugar.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00ADB5] via-[#007C8A] to-[#0047BA] hover:from-[#00E5E8] hover:to-[#0B66FF] text-white px-7 py-3.5 rounded-2xl font-extrabold text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Clean Nav Controls */}
              {banners.length > 1 && (
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20">
                  <button
                    onClick={prevSlide}
                    className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                    aria-label="Slide anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1.5 px-2">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === currentIndex ? 'w-7 bg-[#00E5E8]' : 'w-2.5 bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Ir a slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                    aria-label="Slide siguiente"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:flex justify-end">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-right max-w-xs rotate-1 shadow-2xl transition-all duration-500">
              <p className="font-handwritten text-3xl sm:text-4xl text-white font-bold leading-snug drop-shadow-md">
                “Nuestra gente, nuestros lugares, más oportunidades”
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
