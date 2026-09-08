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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, nextSlide]);

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

  const activeSlide = slides[currentIndex] || slides[0];

  return (
    <section 
      aria-label="Destacados y Noticias de Entre Ríos"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left/Center: Editorial Hero Banner Slider (8 Cols) */}
        <div 
          className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-md border border-slate-200 min-h-[400px] sm:min-h-[460px] flex flex-col justify-between group focus:outline-hidden focus:ring-4 focus:ring-[#004b87]"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Slider de Novedades Regionales"
        >
          {/* Background Images with Fade */}
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={idx !== currentIndex}
            >
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover object-center transform scale-102 group-hover:scale-100 transition-transform duration-1000"
              />
              {/* Clean Editorial Light/Dark Natural Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#004b87]/90 via-[#004b87]/40 to-transparent" />
            </div>
          ))}

          {/* Top Floating Badge & Autoplay Control */}
          <div className="relative z-20 p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#00a859] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-md uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                {activeSlide.badgeText}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-[#8cc63f]" />
                {activeSlide.cityTag}
              </span>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition-colors focus:outline-hidden"
              aria-label={isPlaying ? 'Pausar diapositivas' : 'Iniciar reproducción de diapositivas'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Editorial Content */}
          <div className="relative z-20 p-6 sm:p-8 space-y-4">
            <div className="space-y-2 max-w-2xl">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
                {activeSlide.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-100 line-clamp-2 drop-shadow-sm font-medium">
                {activeSlide.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Link
                href={activeSlide.ctaUrl}
                className="inline-flex items-center gap-2 bg-[#00a859] hover:bg-[#008746] text-white px-6 py-3 rounded-2xl font-extrabold text-sm shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                <span>{activeSlide.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Navigation Controls */}
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                <button
                  onClick={prevSlide}
                  className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Diapositiva anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex ? 'w-6 bg-[#00a859]' : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Ir a la diapositiva ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Diapositiva siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
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
              <div className="absolute top-3 left-3 bg-[#00a859] text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                <Award className="w-3.5 h-3.5" />
                Comercio de la Semana
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-xs text-emerald-300 font-semibold">{featuredCommerce.category}</span>
                <h3 className="text-base font-bold line-clamp-1">{featuredCommerce.name}</h3>
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-slate-600 line-clamp-2">
                {featuredCommerce.description}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-[#004b87] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00a859]" />
                  {featuredCommerce.cityName}
                </span>
                <Link
                  href="#catalogo"
                  className="text-xs font-extrabold text-[#00a859] hover:underline flex items-center gap-1"
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
              <div className="absolute top-3 left-3 bg-[#004b87] text-white text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
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
                  className="text-xs font-extrabold text-[#004b87] hover:underline flex items-center gap-1"
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
