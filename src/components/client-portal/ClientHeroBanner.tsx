'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getBannersByProvince, fetchBannersFromSupabase, DEFAULT_PROVINCE_BANNERS, BannerItem, normalizeImageUrl } from '@/lib/services/banner-store';

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

  // Load banners on mount or province change, fetch from Supabase DB, and listen for live updates
  useEffect(() => {
    loadBanners();
    setCurrentIndex(0);

    // Fetch latest banners asynchronously from Supabase Database
    fetchBannersFromSupabase(provinceId).then((dbBanners) => {
      if (dbBanners && dbBanners.length > 0) {
        setBanners(dbBanners);
      }
    }).catch(() => {});

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
      className="w-full relative overflow-hidden bg-slate-950 shadow-lg"
    >
      <div className="relative w-full h-[280px] sm:h-[380px] md:h-[440px] lg:h-[480px] overflow-hidden group">
        {/* Base Fallback Background Image (Guarantees zero empty space during load or transition) */}
        <img
          src="/images/hero-rosario.jpg"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-90 z-0"
        />

        {/* Background Images with Fade Transition (Pure high-definition image, edge-to-edge full width) */}
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
    </section>
  );
}
