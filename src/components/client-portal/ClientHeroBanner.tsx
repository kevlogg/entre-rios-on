'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getBannersByProvince, DEFAULT_PROVINCE_BANNERS, BannerItem } from '@/lib/services/banner-store';

interface ClientHeroBannerProps {
  provinceId?: string;
}

export function ClientHeroBanner({ provinceId = 'santa-fe' }: ClientHeroBannerProps) {
  const [banners, setBanners] = useState<BannerItem[]>(() => {
    const initial = getBannersByProvince(provinceId);
    return initial && initial.length > 0 
      ? initial 
      : (DEFAULT_PROVINCE_BANNERS[provinceId] || DEFAULT_PROVINCE_BANNERS['santa-fe'] || []);
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadBanners = useCallback(() => {
    const activeBanners = getBannersByProvince(provinceId);
    if (activeBanners && activeBanners.length > 0) {
      setBanners(activeBanners);
    } else {
      setBanners(DEFAULT_PROVINCE_BANNERS[provinceId] || DEFAULT_PROVINCE_BANNERS['santa-fe'] || []);
    }
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

  const effectiveBanners = banners && banners.length > 0 
    ? banners 
    : (DEFAULT_PROVINCE_BANNERS[provinceId] || DEFAULT_PROVINCE_BANNERS['santa-fe'] || []);

  const nextSlide = useCallback(() => {
    if (effectiveBanners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % effectiveBanners.length);
  }, [effectiveBanners.length]);

  const prevSlide = useCallback(() => {
    if (effectiveBanners.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + effectiveBanners.length) % effectiveBanners.length);
  }, [effectiveBanners.length]);

  useEffect(() => {
    if (effectiveBanners.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, effectiveBanners.length]);

  if (effectiveBanners.length === 0) return null;

  return (
    <section 
      aria-label="Carrusel Destacado Regional"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2"
    >
      <div className="relative w-full h-[240px] sm:h-[340px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 group bg-slate-900/40 backdrop-blur-xs">
        {/* Background Images with Fade Transition (Pure image, no text overlay) */}
        {effectiveBanners.map((slide, idx) => (
          <Link
            key={slide.id || idx}
            href={slide.ctaHref || '#'}
            className={`absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.titleLine1 || 'Banner Publicitario'}
              fill
              priority={idx === 0}
              unoptimized
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-center w-full h-full"
            />
          </Link>
        ))}

        {/* Minimal controls at bottom right */}
        {effectiveBanners.length > 1 && (
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-xl">
            <button
              onClick={prevSlide}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-1">
              {effectiveBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex ? 'w-6 bg-cyan-400' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Ir a slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Slide siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
