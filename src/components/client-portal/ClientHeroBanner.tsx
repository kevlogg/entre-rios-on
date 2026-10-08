'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { getBannersByProvince, fetchBannersFromSupabase, DEFAULT_PROVINCE_BANNERS, BannerItem, normalizeImageUrl } from '@/lib/services/banner-store';
import { getProvinceById } from '@/lib/constants/locations';

import { useHeroBadgeStyle, hexToRgba } from '@/lib/services/hero-badge-store';

interface ClientHeroBannerProps {
  provinceId?: string;
}

export function ClientHeroBanner({ provinceId = 'santa-fe' }: ClientHeroBannerProps) {
  const badgeStyle = useHeroBadgeStyle();
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

  // Sizing helpers for the editable badge
  const isSm = badgeStyle.size === 'sm';
  const isLg = badgeStyle.size === 'lg';

  const badgePadding = isSm
    ? 'px-2.5 py-1 sm:px-4 sm:py-2'
    : isLg
    ? 'px-4 py-2 sm:px-10 sm:py-4'
    : 'px-3 py-1.5 sm:px-7 sm:py-3';

  const badgeTextSize = isSm
    ? 'text-[10px] sm:text-base md:text-lg font-extrabold'
    : isLg
    ? 'text-xs sm:text-2xl md:text-3xl font-black'
    : 'text-xs sm:text-xl md:text-2xl font-black';

  const badgeIconSize = isSm
    ? 'w-3 h-3 sm:w-5 sm:h-5'
    : isLg
    ? 'w-4 h-4 sm:w-8 sm:h-8'
    : 'w-3.5 h-3.5 sm:w-6 sm:h-6';

  const displayedName = badgeStyle.uppercase ? provinceName.toUpperCase() : provinceName;

  return (
    <section 
      aria-label="Carrusel Destacado Regional"
      className="w-full relative py-2 sm:py-3"
    >
      <div className="max-w-7xl lg:max-w-none mx-auto px-4 sm:px-6 lg:px-3">
        <div className="relative w-full h-[220px] sm:h-[300px] md:h-[360px] lg:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-2xl border border-white/20 bg-slate-950">
          {/* Background Images with Fade Transition */}
          {effectiveBanners.map((slide: BannerItem, idx: number) => {
            const imgSrc = normalizeImageUrl(slide.imageUrl);
            const isCurrent = idx === safeCurrentIndex;

            return (
              <Link
                key={slide.id || `slide-${idx}`}
                href={slide.ctaHref || '#'}
                className="absolute inset-0 block w-full h-full overflow-hidden bg-slate-950"
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
                {/* Imagen principal limpia del Banner sin imágenes fantasmas de fondo */}
                <img
                  src={imgSrc}
                  alt={slide.titleLine1 || 'Banner Publicitario'}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallbackTried) {
                      target.dataset.fallbackTried = 'true';
                    }
                  }}
                  className="w-full h-full object-cover object-center"
                />
              </Link>
            );
          })}

          {/* Selected Province Mention (Bottom-left corner, customizable via SuperAdmin) */}
          <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 z-30 pointer-events-none">
            <div 
              className={`backdrop-blur-md shadow-2xl flex items-center gap-1.5 sm:gap-3 text-center whitespace-nowrap rounded-2xl sm:rounded-3xl ${badgePadding}`}
              style={{
                backgroundColor: hexToRgba(badgeStyle.backgroundColor, badgeStyle.backgroundOpacity),
                borderColor: badgeStyle.borderColor,
                borderWidth: `${badgeStyle.borderWidth}px`,
                borderStyle: badgeStyle.borderWidth > 0 ? 'solid' : 'none',
              }}
            >
              {badgeStyle.showIcon && (
                <MapPin 
                  className={`${badgeIconSize} shrink-0 animate-pulse`} 
                  style={{ color: badgeStyle.iconColor }}
                />
              )}
              <span 
                className={`${badgeTextSize} tracking-wider sm:tracking-[0.18em] drop-shadow-md`}
                style={{ color: badgeStyle.textColor }}
              >
                {displayedName}
              </span>
            </div>
          </div>

          {/* Floating controls at bottom right */}
          {totalSlides > 1 && (
            <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 z-30 flex items-center gap-1.5 sm:gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-full border border-white/20 shadow-2xl">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  prevSlide();
                }}
                className="text-white/80 hover:text-white p-0.5 sm:p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {totalSlides > 6 ? (
                <span className="text-white text-[10px] sm:text-xs font-black px-1.5 sm:px-2 select-none tracking-wider">
                  <span className="text-cyan-400">{safeCurrentIndex + 1}</span> / {totalSlides}
                </span>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2 px-1">
                  {effectiveBanners.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === safeCurrentIndex ? 'w-5 sm:w-7 bg-cyan-400' : 'w-2 sm:w-2.5 bg-white/50 hover:bg-white/90'
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
                className="text-white/80 hover:text-white p-0.5 sm:p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Slide siguiente"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
