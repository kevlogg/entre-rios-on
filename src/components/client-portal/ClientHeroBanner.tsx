'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProvinceBanners, normalizeImageUrl, DEFAULT_PROVINCE_BANNERS, BannerItem } from '@/lib/services/banner-store';

interface ClientHeroBannerProps {
  provinceId?: string;
}

export function ClientHeroBanner({ provinceId = 'santa-fe' }: ClientHeroBannerProps) {
  // Dynamic banners loaded from Supabase / SuperAdmin
  const dynamicBanners = useProvinceBanners(provinceId);
  const banners = dynamicBanners && dynamicBanners.length > 0 
    ? dynamicBanners 
    : (DEFAULT_PROVINCE_BANNERS[provinceId] || DEFAULT_PROVINCE_BANNERS['santa-fe'] || []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = banners.length;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Reset index if banners change
  useEffect(() => {
    setCurrentIndex(0);
  }, [provinceId, banners.length]);

  // Auto-play interval
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  if (totalSlides === 0) return null;

  return (
    <section 
      aria-label="Banner Principal de Santa Fe"
      className="w-full relative"
    >
      <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] md:aspect-[28/9] min-h-[140px] sm:min-h-[170px] lg:min-h-[195px] max-h-[260px] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/90 group">
        
        {/* Dynamic Slides */}
        {banners.map((slide: BannerItem, idx: number) => {
          const isCurrent = idx === currentIndex;
          const imgSrc = normalizeImageUrl(slide.imageUrl);

          return (
            <Link
              key={slide.id || `slide-${idx}`}
              href={slide.ctaHref || `/${provinceId}`}
              className={`absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out cursor-pointer ${
                isCurrent ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={imgSrc}
                alt={slide.titleLine1 || 'Banner Publicitario'}
                className="w-full h-full object-cover object-center"
              />
            </Link>
          );
        })}

        {/* Carousel Prev/Next Buttons */}
        {totalSlides > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
              aria-label="Slide siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots Indicators at Bottom */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-full">
              {banners.map((_, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
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
