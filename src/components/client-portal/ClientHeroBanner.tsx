'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { getBannersByProvince, fetchBannersFromSupabase, DEFAULT_PROVINCE_BANNERS, BannerItem, normalizeImageUrl } from '@/lib/services/banner-store';
import { getProvinceById } from '@/lib/constants/locations';

interface ClientHeroBannerProps {
  provinceId?: string;
}

export function ClientHeroBanner({ provinceId = 'santa-fe' }: ClientHeroBannerProps) {
  const provinceObj = getProvinceById(provinceId);
  const provinceName = provinceObj ? provinceObj.name : (provinceId === 'santa-fe' ? 'Santa Fe' : 'Entre Ríos');

  const [banners, setBanners] = useState<BannerItem[]>(() => {
    return getBannersByProvince(provinceId);
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadBanners = useCallback(() => {
    const activeBanners = getBannersByProvince(provinceId);
    setBanners(activeBanners);
  }, [provinceId]);

  // Load banners on mount or province change, fetch from Supabase DB, and listen for live updates
  useEffect(() => {
    loadBanners();
    setCurrentIndex(0);

    // Fetch latest banners asynchronously from Supabase Database
    fetchBannersFromSupabase(provinceId).then((dbBanners) => {
      setBanners(dbBanners);
    }).catch(() => {});

    const handleUpdate = () => {
      loadBanners();
    };

    window.addEventListener('onmas_banners_updated', handleUpdate);
    return () => {
      window.removeEventListener('onmas_banners_updated', handleUpdate);
    };
  }, [provinceId, loadBanners]);

  const effectiveBanners = banners;


  const totalSlides = effectiveBanners.length;

  const safeCurrentIndex = (typeof currentIndex === 'number' && !isNaN(currentIndex) && currentIndex >= 0 && currentIndex < totalSlides)
    ? currentIndex 
    : 0;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-play timer for smooth infinite rotation across slides every 4 seconds
  useEffect(() => {
    if (totalSlides <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  if (totalSlides === 0) return null;

  return (
    <section 
      aria-label="Carrusel Destacado Regional"
      className="w-full relative py-2 sm:py-3"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full h-[220px] sm:h-[300px] md:h-[360px] lg:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-2xl border border-white/20 bg-slate-950">
          {/* Base Fallback Background Image (Guarantees zero empty space during load or transition) */}
          <img
            src="/images/hero-rosario.jpg"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-90 z-0"
          />

          {/* Background Images with Fade Transition */}
          {effectiveBanners.map((slide: BannerItem, idx: number) => {
            const imgSrc = normalizeImageUrl(slide.imageUrl);
            const isCurrent = idx === safeCurrentIndex;

            return (
              <Link
                key={slide.id || `slide-${idx}`}
                href={slide.ctaHref || '#'}
                className="absolute inset-0 block w-full h-full"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  opacity: isCurrent ? 1 : 0,
                  zIndex: isCurrent ? 10 : 0,
                  pointerEvents: isCurrent ? 'auto' : 'none',
                  transition: 'opacity 700ms ease-in-out',
                  display: 'block',
                }}
              >
                <img
                  src={imgSrc}
                  alt={slide.titleLine1 || 'Banner Publicitario'}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallbackTried) {
                      target.dataset.fallbackTried = 'true';
                      target.src = '/images/hero-rosario.jpg';
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />
              </Link>
            );
          })}

          {/* Selected Province Mention (Centered at bottom inside hero image) */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <div className="bg-slate-950/85 backdrop-blur-md px-4 sm:px-6 py-1.5 sm:py-2 border border-cyan-400/50 shadow-2xl flex items-center gap-2 text-center whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0 animate-pulse" />
              <span className="text-cyan-400 text-xs sm:text-sm font-black uppercase tracking-widest">
                {provinceName}
              </span>
            </div>
          </div>

          {/* Floating controls at bottom right */}
          {totalSlides > 1 && (
            <div className="absolute bottom-5 right-6 z-30 flex items-center gap-2 bg-slate-900/70 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/20 shadow-2xl">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevSlide();
                }}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {totalSlides > 6 ? (
                <span className="text-white text-xs font-black px-2 select-none tracking-wider">
                  <span className="text-cyan-400">{safeCurrentIndex + 1}</span> / {totalSlides}
                </span>
              ) : (
                <div className="flex items-center gap-2 px-1">
                  {effectiveBanners.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === safeCurrentIndex ? 'w-7 bg-cyan-400' : 'w-2.5 bg-white/50 hover:bg-white/90'
                      }`}
                      aria-label={`Ir a slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  nextSlide();
                }}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Slide siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
