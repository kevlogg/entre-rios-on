'use client';

import React, { useState } from 'react';
import { CATEGORIES_LIST } from '@/lib/constants/categories';

interface CategoryIconBarProps {
  selectedCategory?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export function CategoryIconBar({
  selectedCategory: externalSelectedCat,
  onSelectCategory,
}: CategoryIconBarProps) {
  const [internalSelectedCat, setInternalSelectedCat] = useState<string>('all');
  const selectedCat = externalSelectedCat !== undefined ? externalSelectedCat : internalSelectedCat;

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      setInternalSelectedCat(catId);
    }

    // Scroll smoothly to catalog/offers section
    const offersSection = document.getElementById('ofertas-destacadas') || document.getElementById('catalogo');
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white border-b border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00a859]"></span>
            <span>Explorá por Categoría</span>
          </h2>
          {selectedCat !== 'all' && (
            <button
              onClick={() => handleCategoryClick('all')}
              className="text-xs font-bold text-[#00a859] hover:underline"
            >
              Mostrar todas las categorías
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 sm:gap-4">
          {CATEGORIES_LIST.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                title={cat.description}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 group text-center border cursor-pointer ${
                  isSelected
                    ? 'border-[#00a859] bg-[#00a859]/10 text-[#00a859] shadow-xs scale-105 font-bold'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-200 text-slate-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-colors ${
                  isSelected ? 'bg-[#00a859] text-white shadow-xs' : 'bg-white text-slate-600 group-hover:text-[#00a859] shadow-2xs'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-[11px] leading-tight line-clamp-2">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

