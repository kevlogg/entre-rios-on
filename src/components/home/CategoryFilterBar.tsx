'use client';

import React from 'react';
import { CATEGORIES_LIST } from '@/lib/constants/categories';
import { LayoutGrid } from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryFilterBar({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterBarProps) {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#004b87] flex items-center gap-1.5">
          <LayoutGrid className="w-4 h-4 text-[#00a859]" />
          <span>Filtrar Catálogo por Rubro</span>
        </h3>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-bold text-[#00a859] hover:underline"
          >
            Limpiar filtro de categoría
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap border shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[#004b87] text-white border-[#004b87] shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          Todos los Rubros
        </button>

        {CATEGORIES_LIST.map((cat) => {
          const IconComponent = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                isSelected
                  ? 'bg-[#00a859] text-white border-[#00a859] shadow-xs scale-102'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-[#004b87]'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
