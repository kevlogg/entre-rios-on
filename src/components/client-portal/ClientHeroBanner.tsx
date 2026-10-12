'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BannerItem, normalizeImageUrl } from '@/lib/services/banner-store';

interface ClientHeroBannerProps {
  provinceId?: string;
}

const DEFAULT_SLIDES = [
  {
    id: 'slide-sf-bridge',
    imageUrl: '/images/hero-santa-fe-bridge.jpg',
    title: 'SANTA FE ESTÁ ON MÁS',
    subtitle: 'ON+ conectando la Región',
    ctaHref: '/santa-fe',
  },
  {
    id: 'slide-sf-rosario',
    imageUrl: '/images/hero-rosario.jpg',
    title: 'SANTA FE, SIEMPRE ON MÁS',
    subtitle: 'Comercio, Industria y Oportunidades',
    ctaHref: '/santa-fe/rosario',
  },
  {
    id: 'slide-sf-costanera',
    imageUrl: '/images/city-santa-fe-capital.jpg',
    title: 'SANTA FE CAPITAL & COSTANERA',
    subtitle: 'Toda la región en un solo lugar',
    ctaHref: '/santa-fe/santa-fe-capital',
  },
];

export function ClientHeroBanner({ provinceId = 'santa-fe' }: ClientHeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = DEFAULT_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const currentSlide = DEFAULT_SLIDES[currentIndex];

  return (
    <section 
      aria-label="Banner Principal de Santa Fe"
      className="w-full relative"
    >
      <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] md:aspect-[28/9] min-h-[140px] sm:min-h-[170px] lg:min-h-[195px] max-h-[260px] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/90 group">
        
        {/* Slides Images */}
        {DEFAULT_SLIDES.map((slide, idx) => {
          const isCurrent = idx === currentIndex;

          return (
            <Link
              key={slide.id}
              href={slide.ctaHref}
              className={`absolute inset-0 block w-full h-full transition-opacity duration-700 ease-in-out cursor-pointer ${
                isCurrent ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                priority={idx === 0}
                className="object-cover object-center"
              />

              {/* For slides that don't have text embedded in image, render overlay */}
              {idx > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent flex items-center p-4 sm:p-6 lg:p-8">
                  <div className="max-w-md text-white space-y-1">
                    <h2 className="text-lg sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight drop-shadow-md">
                      {slide.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-cyan-300 drop-shadow-sm">
                      {slide.subtitle}
                    </p>
                  </div>
                </div>
              )}
            </Link>
          );
        })}

        {/* Carousel Prev/Next Buttons */}
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
          {DEFAULT_SLIDES.map((_, idx) => (
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

      </div>
    </section>
  );
}
