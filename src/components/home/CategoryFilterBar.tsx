'use client';

import React from 'react';
import Image from 'next/image';
import { CATEGORIES_LIST } from '@/lib/constants/categories';
import { Sparkles, ArrowRight, LayoutGrid } from 'lucide-react';

interface CategoryFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryFilterBar({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterBarProps) {
  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Categorías
          </h2>
          <span className="text-xs font-bold text-slate-400 hidden sm:inline">
            • Explorá por rubro comercial
          </span>
        </div>

        {selectedCategory !== 'all' ? (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-extrabold text-[#00ADB5] hover:text-[#0047BA] transition-colors flex items-center gap-1"
          >
            <span>Mostrar todas las categorías</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-extrabold text-[#0047BA] hover:text-[#00ADB5] transition-colors flex items-center gap-1"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid of Marketplace Category Cards (Imagen a la izquierda, Texto a la derecha) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* All Categories Option */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`group flex items-center rounded-2xl border transition-all text-left overflow-hidden h-20 sm:h-24 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#0047BA] text-white border-[#0047BA] shadow-md ring-2 ring-[#00ADB5]'
              : 'bg-white text-slate-800 border-slate-200 hover:border-[#00ADB5] hover:shadow-md'
          }`}
        >
          <div className={`w-1/3 h-full flex items-center justify-center border-r shrink-0 ${
            selectedCategory === 'all' ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-100 border-slate-200/80 text-[#0047BA]'
          }`}>
            <LayoutGrid className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div className="w-2/3 p-3.5">
            <span className={`font-black text-xs sm:text-sm leading-snug block ${
              selectedCategory === 'all' ? 'text-white' : 'text-slate-900 group-hover:text-[#0047BA]'
            }`}>
              Todas las categorías
            </span>
            <span className={`text-[10px] block mt-0.5 font-medium ${
              selectedCategory === 'all' ? 'text-slate-200' : 'text-slate-500'
            }`}>
              Ver catálogo completo
            </span>
          </div>
        </button>

        {/* Dynamic Category Cards */}
        {CATEGORIES_LIST.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
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
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Right Box: Bold Category Label */}
              <div className="w-2/3 p-3.5">
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
    </section>
  );
}
