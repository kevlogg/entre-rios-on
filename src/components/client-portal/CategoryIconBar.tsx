'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

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
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80',
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

  return (
    <section id="categorias" className="w-full pt-1 pb-3">
      {/* Title matching mockup: Categorías principales */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm sm:text-base lg:text-lg font-black text-slate-900">
          Categorías principales
        </h2>
      </div>

      {/* 8 Compact Category Cards Grid with Real Photos */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5 lg:gap-3">
        {MAIN_CATEGORIES.map((cat) => {
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
              {/* Compact photo height */}
              <div className="relative h-12 sm:h-13 lg:h-15 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 25vw, 12vw"
                  className="object-cover group-hover:scale-106 transition-transform duration-500"
                />
              </div>

              <div className="p-1 sm:p-1.5 w-full bg-white text-center">
                <span className={`text-[10px] sm:text-[11px] font-bold line-clamp-1 transition-colors ${
                  isSelected ? 'text-[#0047BA]' : 'text-slate-800 group-hover:text-[#0047BA]'
                }`}>
                  {cat.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
