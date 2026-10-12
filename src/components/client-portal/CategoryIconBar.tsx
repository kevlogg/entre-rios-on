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

      {/* Categories Cards Grid - Responsive Grid (2 columns on mobile, 1 col <350px, 4 cols on desktop) */}
      <div className="relative">
        <div className="grid grid-cols-1 min-[350px]:grid-cols-2 md:grid-cols-4 gap-[14px]">
          {visibleCategories.map((cat) => {
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
                {/* Top Image: Relación de aspecto uniforme */}
                <div className="relative w-full h-28 sm:h-36 md:h-44 bg-slate-950 overflow-hidden shrink-0">
                  <img
                    src={cat.imageUrl}
                    alt={cat.label}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                </div>

                {/* Bottom Footer: Título centrado con altura uniforme */}
                <div className="p-2.5 sm:p-3.5 w-full bg-white flex items-center justify-center text-center min-h-[50px] sm:min-h-[56px]">
                  <span className={`font-black text-[11px] min-[400px]:text-xs sm:text-sm leading-tight line-clamp-2 block ${
                    isSelected ? 'text-[#0047BA]' : 'text-slate-900 group-hover:text-[#0047BA]'
                  }`}>
                    {cat.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Carousel Pagination Controls Centered Below Cards */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          aria-label="Ver 8 categorías anteriores"
          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#0047BA] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${
                currentPage === idx ? 'w-6 sm:w-8 bg-[#0047BA]' : 'w-2 sm:w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Ir a la página ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          aria-label="Ver siguientes 8 categorías"
          className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-[#0047BA] hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs cursor-pointer"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </section>
  );
}
