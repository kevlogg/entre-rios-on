'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES_LIST } from '@/lib/constants/categories';
import { ArrowRight, ChevronLeft, ChevronRight, LayoutGrid, Sparkles } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState<number>(0);

  const selectedCat = externalSelectedCat !== undefined ? externalSelectedCat : internalSelectedCat;

  const ITEMS_PER_PAGE = 8; // 2 rows x 4 columns = 8 items per page
  const totalPages = Math.ceil(CATEGORIES_LIST.length / ITEMS_PER_PAGE);

  const visibleCategories = CATEGORIES_LIST.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

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

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
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

          {/* Arrow Carousel Navigation */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
            <button
              onClick={handlePrevPage}
              aria-label="Ver 8 categorías anteriores"
              title="Página anterior (8 categorías)"
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-[#00ADB5] hover:text-white text-slate-700 border border-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            <span className="text-xs font-black text-slate-800 px-2 select-none">
              {currentPage + 1} / {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              aria-label="Ver siguientes 8 categorías"
              title="Siguientes 8 categorías"
              className="w-8 h-8 rounded-xl bg-[#0047BA] hover:bg-[#00ADB5] text-white shadow-xs flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Cards Grid - Large Vertical Format */}
      <div className="relative group/carousel">
        
        {/* Mobile: 2-Row Touch Horizontal Carousel for all categories */}
        <div className="grid sm:hidden grid-rows-2 grid-flow-col auto-cols-[180px] gap-3.5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2">
          {CATEGORIES_LIST.map((cat) => {
            const isSelected = selectedCat === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`snap-start group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 text-left cursor-pointer shadow-md bg-white ${
                  isSelected
                    ? 'border-[#0047BA] ring-4 ring-[#00ADB5]/30 shadow-xl scale-[1.02]'
                    : 'border-slate-200 hover:border-[#00ADB5] hover:shadow-xl'
                }`}
              >
                {/* Top Image: Large & Covers Aspect Ratio */}
                <div className="relative w-full h-28 bg-slate-950 overflow-hidden shrink-0">
                  <img
                    src={cat.imageUrl}
                    alt={cat.label}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />
                </div>

                {/* Bottom Footer: Category Label */}
                <div className="p-3 w-full bg-white flex items-center justify-center text-center">
                  <span className={`font-black text-xs leading-tight line-clamp-2 ${
                    isSelected ? 'text-[#0047BA]' : 'text-slate-900 group-hover:text-[#0047BA]'
                  }`}>
                    {cat.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Desktop & Tablet: Large 8-Item Vertical Grid (2 Rows x 4 Columns) */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 transition-all duration-300">
          {visibleCategories.map((cat) => {
            const isSelected = selectedCat === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`group flex flex-col rounded-2xl sm:rounded-3xl border overflow-hidden transition-all duration-300 text-left cursor-pointer shadow-md bg-white hover:-translate-y-1 ${
                  isSelected
                    ? 'border-[#0047BA] ring-4 ring-[#00ADB5]/40 shadow-2xl scale-[1.02]'
                    : 'border-slate-200/90 hover:border-[#00ADB5] hover:shadow-2xl'
                }`}
              >
                {/* Top Image Box: Large Banner Display */}
                <div className="relative w-full h-36 sm:h-44 md:h-48 bg-slate-950 overflow-hidden shrink-0">
                  <img
                    src={cat.imageUrl}
                    alt={cat.label}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                </div>

                {/* Bottom Footer Box: Centered Bold Label */}
                <div className="p-3.5 sm:p-4 w-full bg-white flex items-center justify-center text-center min-h-[56px]">
                  <span className={`font-black text-xs sm:text-sm leading-snug line-clamp-2 ${
                    isSelected ? 'text-[#0047BA]' : 'text-slate-900 group-hover:text-[#0047BA]'
                  }`}>
                    {cat.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Floating Side Arrows for Next / Prev */}
        <button
          onClick={handleNextPage}
          title="Pasar a las próximas 8 categorías"
          className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-[#0047BA] border border-slate-200 shadow-2xl items-center justify-center hover:bg-[#00ADB5] hover:text-white hover:border-[#00ADB5] transition-all cursor-pointer active:scale-95"
        >
          <ChevronRight className="w-6 h-6 stroke-[3]" />
        </button>

        {currentPage > 0 && (
          <button
            onClick={handlePrevPage}
            title="Volver a las 8 categorías anteriores"
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-[#0047BA] border border-slate-200 shadow-2xl items-center justify-center hover:bg-[#00ADB5] hover:text-white hover:border-[#00ADB5] transition-all cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 stroke-[3]" />
          </button>
        )}

      </div>

      {/* Carousel Pagination Dots */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx)}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              currentPage === idx ? 'w-8 bg-[#0047BA]' : 'w-2.5 bg-slate-300 hover:bg-slate-500'
            }`}
            aria-label={`Ir a la página ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
