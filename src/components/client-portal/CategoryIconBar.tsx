'use client';

import React, { useState } from 'react';
import { CATEGORIES_LIST } from '@/lib/constants/categories';
import { ArrowRight, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

interface CategoryIconBarProps {
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export function CategoryIconBar({
  selectedCategory: externalSelectedCat,
  onSelectCategory,
}: CategoryIconBarProps) {
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

    const offersSection = document.getElementById('ofertas-destacadas') || document.getElementById('catalogo');
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="bg-white border-b border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Header Row with Arrows */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ADB5]"></span>
              <span>Categorías</span>
            </h2>
            <span className="text-xs font-bold text-slate-400 hidden md:inline">
              (Página {currentPage + 1} de {totalPages} • 8 categorías por vista)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Arrow Carousel Navigation */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={handlePrevPage}
                aria-label="Ver 8 categorías anteriores"
                title="Página anterior (8 categorías)"
                className="w-8 h-8 rounded-xl bg-white hover:bg-[#00ADB5] hover:text-white text-slate-700 border border-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              <span className="text-xs font-black text-slate-700 px-2">
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

            {selectedCat !== 'all' && (
              <button
                onClick={() => handleCategoryClick('all')}
                className="text-xs font-extrabold text-[#00ADB5] hover:text-[#0047BA] transition-colors hidden sm:flex items-center gap-1"
              >
                <span>Mostrar todas</span>
              </button>
            )}
          </div>
        </div>

        {/* 2 Rows x 4 Columns Marketplace Grid (8 Category Cards Per View) */}
        <div className="relative group/carousel">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 transition-all duration-300">
            {visibleCategories.map((cat) => {
              const isSelected = selectedCat === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`group flex items-center rounded-2xl border transition-all text-left overflow-hidden h-20 sm:h-24 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#00ADB5] to-[#007C8A] text-white border-[#00ADB5] shadow-md ring-2 ring-[#00ADB5]'
                      : 'bg-white text-slate-800 border-slate-200/90 hover:border-[#00ADB5] hover:shadow-md'
                  }`}
                >
                  {/* Left Box: Product Image Asset */}
                  <div className="w-1/3 h-full bg-[#f4f4f5] border-r border-slate-200/60 shrink-0 relative overflow-hidden flex items-center justify-center p-1.5">
                    <img
                      src={cat.imageUrl}
                      alt={cat.label}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-108 transition-transform duration-300"
                    />
                  </div>

                  {/* Right Box: Bold Category Label */}
                  <div className="w-2/3 p-3 sm:p-3.5">
                    <span className={`font-extrabold text-xs sm:text-sm leading-snug line-clamp-2 block ${
                      isSelected ? 'text-white' : 'text-slate-800 group-hover:text-[#0047BA]'
                    }`}>
                      {cat.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Floating Right Arrow Button for Next 8 */}
          <button
            onClick={handleNextPage}
            title="Pasar a las próximas 8 categorías"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-[#0047BA] border border-slate-300 shadow-xl flex items-center justify-center hover:bg-[#0047BA] hover:text-white hover:border-[#0047BA] transition-all cursor-pointer active:scale-95"
          >
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </button>

          {currentPage > 0 && (
            <button
              onClick={handlePrevPage}
              title="Volver a las 8 categorías anteriores"
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white text-[#0047BA] border border-slate-300 shadow-xl flex items-center justify-center hover:bg-[#0047BA] hover:text-white hover:border-[#0047BA] transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentPage === idx ? 'w-8 bg-[#0047BA]' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Ir a la página ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
