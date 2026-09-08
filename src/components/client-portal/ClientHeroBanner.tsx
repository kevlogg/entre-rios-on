'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, MapPin } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'parana',
    titleLine1: 'ENTRE RÍOS,',
    titleLine2: 'SIEMPRE ON',
    subtitle: 'Comprá. Vendé. Publicá. Conectá.',
    caption: 'Toda la provincia en un solo lugar.',
    handwriting: '“Nuestra gente, nuestros lugares, más oportunidades”',
    image: '/images/hero-parana.jpg',
    location: 'Costanera & Barrancas de Paraná',
    ctaText: 'Explorá Ofertas de Paraná',
    ctaHref: '#ofertas-destacadas',
  },
  {
    id: 'colon',
    titleLine1: 'COLÓN &',
    titleLine2: 'EL PALMAR',
    subtitle: 'Fiesta Nacional de la Artesanía & Playas de Arena Blanca',
    caption: 'Descubrí talleres de cerámica, orfebrería y gastronomía costera.',
    handwriting: '“Cultura viva a orillas del Uruguay”',
    image: '/images/hero-artesania.jpg',
    location: 'Colón, Entre Ríos',
    ctaText: 'Ver Productos de Colón',
    ctaHref: '/ciudad/colon',
  },
  {
    id: 'concordia',
    titleLine1: 'CORAZÓN',
    titleLine2: 'CITRÍCOLA',
    subtitle: 'Citrus, Arándanos & Aguas Termales de Concordia',
    caption: 'Productores litoraleños comercializando directo con WhatsApp.',
    handwriting: '“Sabores autóctonos con sello regional”',
    image: '/images/city-concordia.jpg',
    location: 'Concordia & Salto Grande',
    ctaText: 'Ver Productores de Concordia',
    ctaHref: '/ciudad/concordia',
  },
  {
    id: 'gualeguaychu',
    titleLine1: 'VIÑEDOS Y',
    titleLine2: 'CARNAVAL',
    subtitle: 'Bodegas Boutique & Enoturismo en Gualeguaychú',
    caption: 'Recorré la ruta del vino entrerriano y propuestas de diseño.',
    handwriting: '“La magia y alegría de nuestro Litoral”',
    image: '/images/city-gualeguaychu.jpg',
    location: 'Gualeguaychú, Entre Ríos',
    ctaText: 'Descubrir Gualeguaychú',
    ctaHref: '/ciudad/gualeguaychu',
  },
];

export function ClientHeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  const activeSlide = HERO_SLIDES[currentIndex];

  return (
    <section 
      aria-label="Carrusel Destacado de Entre Ríos"
      className="relative w-full overflow-hidden bg-slate-950 min-h-[420px] sm:min-h-[480px] flex items-center shadow-lg group"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background Images with Fade Transition */}
      {HERO_SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? 'opacity-90 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.titleLine1 + ' ' + slide.titleLine2}
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
            <div className="inline-flex items-center gap-1.5 bg-[#00a859] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              <MapPin className="w-3.5 h-3.5" />
              <span>{activeSlide.location}</span>
            </div>

            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md">
                {activeSlide.titleLine1}
              </h1>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md flex items-center gap-3">
                {activeSlide.titleLine2.includes('ON') ? (
                  <>SIEMPRE <span className="text-[#00a859] drop-shadow-lg">ON</span></>
                ) : (
                  <span className="text-[#009fe3] drop-shadow-lg">{activeSlide.titleLine2}</span>
                )}
              </h2>
            </div>

            <div className="space-y-1 text-slate-100 font-bold text-lg sm:text-2xl drop-shadow-sm">
              <p>{activeSlide.subtitle}</p>
              <p className="text-slate-200 font-medium text-base sm:text-xl">
                {activeSlide.caption}
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                href={activeSlide.ctaHref}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00a859] to-[#008746] hover:from-[#008746] hover:to-[#004b87] text-white px-7 py-3.5 rounded-2xl font-extrabold text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>{activeSlide.ctaText}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              {/* Controls */}
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20">
                <button
                  onClick={prevSlide}
                  className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Slide anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5 px-2">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex ? 'w-7 bg-[#00a859]' : 'w-2.5 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Ir a slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Slide siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="ml-1 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition-colors"
                  aria-label={isPlaying ? 'Pausar carrusel' : 'Iniciar carrusel'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:flex justify-end">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-right max-w-xs rotate-1 shadow-2xl transition-all duration-500">
              <p className="font-handwritten text-3xl sm:text-4xl text-white font-bold leading-snug drop-shadow-md">
                {activeSlide.handwriting}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
