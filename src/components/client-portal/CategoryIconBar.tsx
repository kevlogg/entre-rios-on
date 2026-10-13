'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export interface MainCategoryItem {
  id: string;
  name: string;
  imageUrl: string;
}

export const MAIN_CATEGORIES: MainCategoryItem[] = [
  {
    id: 'autos',
    name: 'Autos y motos',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'tecnologia',
    name: 'Celulares y tecnología',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'hogar',
    name: 'Hogar y muebles',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'indumentaria',
    name: 'Moda y accesorios',
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'salud',
    name: 'Belleza y cuidado personal',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'deportes',
    name: 'Deportes',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'industria',
    name: 'Herramientas e industria',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'alimentos',
    name: 'Alimentos y bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
  },
];

interface CategoryIconBarProps {
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export function CategoryIconBar({
  selectedCategory = 'all',
  onSelectCategory,
}: CategoryIconBarProps) {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    const offersSection = document.getElementById('productos-destacados') || document.getElementById('ofertas-destacadas');
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/catalogo?categoria=${catId}`);
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    if (clientWidth > 0) {
      const pageIndex = Math.round(scrollLeft / clientWidth);
      setActiveSlide(pageIndex);
    }
  };

  const scrollToSlide = (index: number) => {
    if (!scrollContainerRef.current) return;
    const clientWidth = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollTo({
      left: index * clientWidth,
      behavior: 'smooth',
    });
    setActiveSlide(index);
  };

  const renderCategoryCard = (cat: MainCategoryItem, isMobile: boolean = false) => {
    const isSelected = selectedCategory === cat.id;

    return (
      <button
        key={cat.id}
        type="button"
        onClick={() => handleCategoryClick(cat.id)}
        className={`group flex flex-col items-center rounded-xl overflow-hidden bg-white hover:bg-slate-50 border transition-all shadow-2xs hover:shadow-md cursor-pointer text-center ${
          isSelected
            ? 'border-[#0047BA] ring-2 ring-[#0047BA]/30'
            : 'border-slate-200/90 hover:border-[#0047BA]/50'
        }`}
      >
        <div className={`relative w-full bg-slate-100 overflow-hidden ${isMobile ? 'h-16 min-[380px]:h-20' : 'h-12 sm:h-13 lg:h-15'}`}>
          <Image
            src={cat.imageUrl}
            alt={cat.name}
            fill
            sizes="(max-width: 640px) 50vw, 12vw"
            className="object-cover group-hover:scale-106 transition-transform duration-500"
          />
        </div>

        <div className="p-1 sm:p-1.5 w-full bg-white text-center">
          <span className={`text-[11px] sm:text-[11px] font-bold line-clamp-1 transition-colors ${
            isSelected ? 'text-[#0047BA]' : 'text-slate-800 group-hover:text-[#0047BA]'
          }`}>
            {cat.name}
          </span>
        </div>
      </button>
    );
  };

  return (
    <section id="categorias" className="w-full pt-1 pb-3">
      {/* Title & Link */}
      <div className="flex items-center justify-between mb-2 sm:mb-2.5">
        <div>
          <h2 className="text-sm sm:text-base lg:text-lg font-black text-slate-900">
            Categorías para encontrar lo que buscás
          </h2>
          <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
            Explorá por rubro los mejores comercios, ofertas y servicios de la provincia.
          </p>
        </div>

        <Link
          href="/catalogo"
          className="text-xs font-bold text-[#0070F3] hover:text-[#005bb5] flex items-center gap-1 transition-colors shrink-0"
        >
          <span className="hidden min-[380px]:inline">Ver todas las categorías</span>
          <span className="min-[380px]:hidden">Ver todas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* MOBILE (< sm): 2 filas con 2 cards, con scroll horizontal (2 slides de 4 cards c/u = 8 total) */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="sm:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3 pb-1"
      >
        {/* Slide 1: Primeras 4 categorías (2 filas x 2 cards) */}
        <div className="w-full shrink-0 snap-start grid grid-cols-2 gap-2">
          {MAIN_CATEGORIES.slice(0, 4).map((cat) => renderCategoryCard(cat, true))}
        </div>

        {/* Slide 2: Siguientes 4 categorías (2 filas x 2 cards) */}
        <div className="w-full shrink-0 snap-start grid grid-cols-2 gap-2">
          {MAIN_CATEGORIES.slice(4, 8).map((cat) => renderCategoryCard(cat, true))}
        </div>
      </div>

      {/* Indicadores de paginación en Mobile (2 dots interactivos) */}
      <div className="sm:hidden flex items-center justify-center gap-1.5 mt-2">
        <button
          type="button"
          onClick={() => scrollToSlide(0)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${
            activeSlide === 0 ? 'w-5 bg-[#0047BA]' : 'w-1.5 bg-slate-300'
          }`}
          aria-label="Ver primeras 4 categorías"
        />
        <button
          type="button"
          onClick={() => scrollToSlide(1)}
          className={`h-1.5 rounded-full transition-all cursor-pointer ${
            activeSlide === 1 ? 'w-5 bg-[#0047BA]' : 'w-1.5 bg-slate-300'
          }`}
          aria-label="Ver siguientes 4 categorías"
        />
      </div>

      {/* DESKTOP (>= sm): 8 Cards en 1 sola fila */}
      <div className="hidden sm:grid sm:grid-cols-8 gap-2 sm:gap-2.5 lg:gap-3">
        {MAIN_CATEGORIES.map((cat) => renderCategoryCard(cat, false))}
      </div>
    </section>
  );
}
