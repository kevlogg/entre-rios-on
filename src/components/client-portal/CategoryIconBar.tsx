'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES_LIST, CategoryDef } from '@/lib/constants/categories';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryIconBarProps {
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export function CategoryIconBar({
  selectedCategory: externalSelectedCat,
  onSelectCategory,
}: CategoryIconBarProps) {
  const router = useRouter();
  const [internalSelectedCat, setInternalSelectedCat] = useState<string>('all');
  const [desktopPage, setDesktopPage] = useState<number>(0);
  const [mobilePage, setMobilePage] = useState<number>(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const selectedCat = externalSelectedCat !== undefined ? externalSelectedCat : internalSelectedCat;

  // Desktop: 8 items per page (2 rows x 4 columns)
  const DESKTOP_ITEMS_PER_PAGE = 8;
  const totalDesktopPages = Math.ceil(CATEGORIES_LIST.length / DESKTOP_ITEMS_PER_PAGE);
  const desktopVisibleCategories = CATEGORIES_LIST.slice(
    desktopPage * DESKTOP_ITEMS_PER_PAGE,
    (desktopPage + 1) * DESKTOP_ITEMS_PER_PAGE
  );

  // Mobile: 4 items per page (2 rows x 2 columns) so both rows change together
  const MOBILE_ITEMS_PER_PAGE = 4;
  const totalMobilePages = Math.ceil(CATEGORIES_LIST.length / MOBILE_ITEMS_PER_PAGE);

  const mobileChunks = useMemo(() => {
    const chunks: CategoryDef[][] = [];
    for (let i = 0; i < CATEGORIES_LIST.length; i += MOBILE_ITEMS_PER_PAGE) {
      chunks.push(CATEGORIES_LIST.slice(i, i + MOBILE_ITEMS_PER_PAGE));
    }
    return chunks;
  }, []);

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      setInternalSelectedCat(catId);
    }

    if (typeof window !== 'undefined') {
      if (!window.location.pathname.endsWith('/catalogo')) {
        router.push(`/catalogo?categoria=${catId}`);
      } else {
        const offersSection = document.getElementById('ofertas-destacadas') || document.getElementById('catalogo');
        if (offersSection) {
          offersSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  // Scroll sync for Mobile
  const handleMobileScroll = useCallback(() => {
    const container = mobileScrollRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const pageIndex = Math.round(scrollLeft / width);
      setMobilePage((prev) => {
        const clamped = Math.max(0, Math.min(pageIndex, totalMobilePages - 1));
        return prev !== clamped ? clamped : prev;
      });
    }
  }, [totalMobilePages]);

  const scrollMobileToPage = useCallback((targetPage: number) => {
    const container = mobileScrollRef.current;
    if (!container) return;
    const width = container.clientWidth;
    container.scrollTo({
      left: targetPage * width,
      behavior: 'smooth',
    });
    setMobilePage(targetPage);
  }, []);

  const handleMobileNext = () => {
    const next = (mobilePage + 1) % totalMobilePages;
    scrollMobileToPage(next);
  };

  const handleMobilePrev = () => {
    const prev = (mobilePage - 1 + totalMobilePages) % totalMobilePages;
    scrollMobileToPage(prev);
  };

  const handleDesktopNext = () => {
    setDesktopPage((prev) => (prev + 1) % totalDesktopPages);
  };

  const handleDesktopPrev = () => {
    setDesktopPage((prev) => (prev - 1 + totalDesktopPages) % totalDesktopPages);
  };

  const renderCard = (cat: CategoryDef) => {
    const isSelected = selectedCat === cat.id;

    return (
      <button
        key={cat.id}
        onClick={() => handleCategoryClick(cat.id)}
        className={`group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 text-center cursor-pointer shadow-sm bg-white w-full min-w-0 ${
          isSelected
            ? 'border-[#0047BA] ring-3 ring-[#00ADB5]/40 shadow-lg scale-[1.01]'
            : 'border-slate-200/90 hover:border-[#00ADB5] hover:shadow-md'
        }`}
      >
        {/* Top Image: Uniform Aspect Ratio */}
        <div className="relative w-full h-14 min-[360px]:h-16 sm:h-36 md:h-44 bg-slate-950 overflow-hidden shrink-0">
          <img
            src={cat.imageUrl}
            alt={cat.label}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
        </div>

        {/* Bottom Footer: Centered Title */}
        <div className="p-1.5 min-[360px]:p-2 sm:p-3.5 w-full bg-white flex items-center justify-center text-center min-h-[36px] min-[360px]:min-h-[40px] sm:min-h-[56px]">
          <span className={`font-black text-[10px] min-[360px]:text-[11px] sm:text-sm leading-tight line-clamp-2 block ${
            isSelected ? 'text-[#0047BA]' : 'text-slate-900 group-hover:text-[#0047BA]'
          }`}>
            {cat.label}
          </span>
        </div>
      </button>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-3 min-[360px]:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-5">
      {/* Header Row: Title on Left, Link & Arrows on Right */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Categorías para encontrar lo que buscás</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Explorá por rubro los mejores comercios, ofertas y servicios de la provincia.
          </p>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-auto">
          <Link 
            href="/catalogo" 
            className="text-xs sm:text-sm font-black text-[#0047BA] hover:text-[#002878] flex items-center gap-1 transition-colors group"
          >
            <span>Ver todas las categorías</span>
            <ArrowRight className="w-4 h-4 text-[#0047BA] group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Header Mobile Arrow Navigation */}
          <div className="flex md:hidden items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={handleMobilePrev}
              aria-label="Ver 4 categorías anteriores"
              title="Página anterior (4 categorías)"
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-[#00ADB5] hover:text-white text-slate-700 border border-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            <span className="text-xs font-black text-slate-800 px-2 select-none">
              {mobilePage + 1} / {totalMobilePages}
            </span>

            <button
              onClick={handleMobileNext}
              aria-label="Ver siguientes 4 categorías"
              title="Siguientes 4 categorías"
              className="w-8 h-8 rounded-xl bg-[#0047BA] hover:bg-[#00ADB5] text-white shadow-xs flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Header Desktop Arrow Navigation */}
          <div className="hidden md:flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={handleDesktopPrev}
              aria-label="Ver 8 categorías anteriores"
              title="Página anterior (8 categorías)"
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-[#00ADB5] hover:text-white text-slate-700 border border-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            <span className="text-xs font-black text-slate-800 px-2 select-none">
              {desktopPage + 1} / {totalDesktopPages}
            </span>

            <button
              onClick={handleDesktopNext}
              aria-label="Ver siguientes 8 categorías"
              title="Siguientes 8 categorías"
              className="w-8 h-8 rounded-xl bg-[#0047BA] hover:bg-[#00ADB5] text-white shadow-xs flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: 2 Filas exactas (4 cards por vista), scroll horizontal con snap que cambia las dos filas juntas a las siguientes 4 cards */}
      <div className="md:hidden relative">
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none w-full"
        >
          {mobileChunks.map((chunk, chunkIdx) => (
            <div
              key={chunkIdx}
              className="w-full shrink-0 snap-start grid grid-cols-2 gap-2.5 min-[360px]:gap-3"
            >
              {chunk.map(renderCard)}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: 2 Filas de 4 columnas (8 cards por página) */}
      <div className="hidden md:block relative">
        <div className="grid grid-cols-4 gap-[14px]">
          {desktopVisibleCategories.map(renderCard)}
        </div>
      </div>

      {/* Mobile Pagination Controls Centered Below Cards */}
      <div className="flex md:hidden items-center justify-center gap-3 pt-2">
        <button
          onClick={handleMobilePrev}
          disabled={mobilePage === 0}
          aria-label="Ver 4 categorías anteriores"
          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#0047BA] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalMobilePages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollMobileToPage(idx)}
              className={`h-2 min-[360px]:h-2.5 rounded-full transition-all cursor-pointer ${
                mobilePage === idx ? 'w-6 min-[360px]:w-8 bg-[#0047BA]' : 'w-2 min-[360px]:w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Ir a la página ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleMobileNext}
          disabled={mobilePage === totalMobilePages - 1}
          aria-label="Ver siguientes 4 categorías"
          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#0047BA] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Desktop Pagination Controls Centered Below Cards */}
      <div className="hidden md:flex items-center justify-center gap-3 pt-2">
        <button
          onClick={handleDesktopPrev}
          disabled={desktopPage === 0}
          aria-label="Ver 8 categorías anteriores"
          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#0047BA] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalDesktopPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setDesktopPage(idx)}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                desktopPage === idx ? 'w-8 bg-[#0047BA]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Ir a la página ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleDesktopNext}
          disabled={desktopPage === totalDesktopPages - 1}
          aria-label="Ver siguientes 8 categorías"
          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#0047BA] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </section>
  );
}
