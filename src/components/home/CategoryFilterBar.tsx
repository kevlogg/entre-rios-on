'use client';

import React from 'react';
import { CATEGORIES_LIST } from '@/lib/constants/categories';
import { LayoutGrid, Sparkles } from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryFilterBar({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterBarProps) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 fill-current animate-pulse" />
          <span>Explorar por Rubros & Categorías Vibrantes</span>
        </h3>

        {selectedCategory !== 'all' && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-bold text-[#00ADB5] hover:underline"
          >
            Limpiar filtro de categoría
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {/* All Categories Button */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap border shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-[#0047BA] to-[#00ADB5] text-white border-[#0047BA] shadow-md scale-102'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
          }`}
        >
          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center font-black">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span>Todos los Rubros</span>
        </button>

        {/* Dynamic Category Cards */}
        {CATEGORIES_LIST.map((cat) => {
          const IconComponent = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap border shrink-0 cursor-pointer ${
                isSelected
                  ? `bg-gradient-to-r ${cat.activeBg} text-white border-transparent shadow-md scale-102`
                  : 'bg-slate-50 text-slate-800 border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Vibrant Icon Box with Solid Body & Color */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-transform ${
                  isSelected
                    ? 'bg-white/20 border-white/30 text-white'
                    : `${cat.iconBg} ${cat.iconColor}`
                }`}
              >
                <IconComponent className="w-4 h-4 stroke-[2.5]" />
              </div>

              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
