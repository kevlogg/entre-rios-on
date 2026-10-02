'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  Calendar, 
  Award, 
  ArrowRight,
  MapPin,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { BannerSlide, Commerce, CommunityEvent } from '@/types';

interface HeroSliderProps {
  slides: BannerSlide[];
  featuredCommerce: Commerce;
  weekendEvent: CommunityEvent;
}

export function HeroSlider({ slides, featuredCommerce, weekendEvent }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const totalSlides = slides ? slides.length : 0;

  const safeCurrentIndex = (typeof currentIndex === 'number' && !isNaN(currentIndex) && currentIndex >= 0 && currentIndex < totalSlides)
    ? currentIndex 
    : 0;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPlaying && totalSlides > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, totalSlides]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  const activeSlide = slides[safeCurrentIndex] || slides[0];

  return (
    <section 
      aria-label="Destacados y Noticias Regionales"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left/Center: Editorial Hero Banner Slider (8 Cols) */}
        <div 
          className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-xl border border-white/20 flex flex-col justify-between group focus:outline-hidden"
          style={{ minHeight: '380px', height: '420px', position: 'relative' }}
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Slider de Novedades Regionales"
        >
          {/* Background Images with Fade (Pure image view, full edge-to-edge width) */}
          {slides.map((slide, idx) => {
            const isCurrent = idx === safeCurrentIndex;
            const imgSrc = slide.imageUrl || '/images/hero-rosario.jpg';

            return (
              <Link
                key={slide.id || `hs-${idx}`}
                href={slide.ctaUrl || '#'}
                className="absolute inset-0 block w-full h-full"
                aria-hidden={!isCurrent}
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
                  alt={slide.title || 'Banner Publicitario'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />
              </Link>
            );
          })}

          {/* Floating subtle navigation controls at bottom right */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3 bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-xl">
              <button
                onClick={prevSlide}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Diapositiva anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === safeCurrentIndex ? 'w-6 bg-cyan-400' : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Ir a la diapositiva ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Diapositiva siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Lateral Bento Grid (2 Clean White Cards - 4 Cols) */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-6">
          
          {/* Card 1: Comercio Destacado de la Semana */}
          <div className="flex-1 relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 bg-white group transition-shadow flex flex-col justify-between">
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <Image
                src={featuredCommerce.coverUrl}
                alt={featuredCommerce.name}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 bg-gradient-to-r from-[#00ADB5] to-[#007C8A] text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                <Award className="w-3.5 h-3.5" />
                Comercio de la Semana
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-xs text-cyan-300 font-semibold">{featuredCommerce.category}</span>
                <h3 className="text-base font-bold line-clamp-1">{featuredCommerce.name}</h3>
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-slate-600 line-clamp-2">
                {featuredCommerce.description}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-[#0047BA] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" />
                  {featuredCommerce.cityName}
                </span>
                <Link
                  href="#catalogo"
                  className="text-xs font-extrabold text-[#00ADB5] hover:underline flex items-center gap-1"
                >
                  <span>Ver Catálogo</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Agenda Cultural del Finde */}
          <div className="flex-1 relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 bg-white group transition-shadow flex flex-col justify-between">
            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
              <Image
                src={weekendEvent.imageUrl}
                alt={weekendEvent.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 bg-gradient-to-r from-[#0047BA] to-[#002878] text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                <Calendar className="w-3.5 h-3.5" />
                Agenda del Finde
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-xs text-sky-300 font-semibold">{weekendEvent.formattedDate}</span>
                <h3 className="text-base font-bold line-clamp-1">{weekendEvent.title}</h3>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-slate-600 line-clamp-2">
                {weekendEvent.excerpt}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500">
                  {weekendEvent.location}
                </span>
                <Link
                  href="#comunidad"
                  className="text-xs font-extrabold text-[#0047BA] hover:underline flex items-center gap-1"
                >
                  <span>Leer Noticia</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
