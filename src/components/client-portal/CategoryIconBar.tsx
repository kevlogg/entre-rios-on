'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ShoppingCart, 
  Utensils, 
  Home, 
  Shirt, 
  Laptop, 
  Car, 
  Factory, 
  HardHat, 
  HeartPulse, 
  Umbrella, 
  LayoutGrid 
} from 'lucide-react';

const CATEGORIES = [
  { id: 'comercios', label: 'Comercios y Servicios', icon: ShoppingBag },
  { id: 'productos', label: 'Productos', icon: ShoppingCart },
  { id: 'gastronomia', label: 'Gastronomía', icon: Utensils },
  { id: 'hogar', label: 'Hogar y Deco', icon: Home },
  { id: 'indumentaria', label: 'Indumentaria', icon: Shirt },
  { id: 'tecnologia', label: 'Tecnología', icon: Laptop },
  { id: 'autos', label: 'Autos y Motos', icon: Car },
  { id: 'industria', label: 'Industria', icon: Factory },
  { id: 'construccion', label: 'Construcción', icon: HardHat },
  { id: 'salud', label: 'Salud y Bienestar', icon: HeartPulse },
  { id: 'turismo', label: 'Turismo', icon: Umbrella },
  { id: 'mas', label: 'Más categorías', icon: LayoutGrid },
];

export function CategoryIconBar() {
  const [selectedCat, setSelectedCat] = useState<string>('comercios');

  return (
    <section className="bg-white border-b border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 group text-center border ${
                  isSelected
                    ? 'border-[#00a859] bg-[#00a859]/10 text-[#00a859] shadow-xs'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-200 text-slate-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-colors ${
                  isSelected ? 'bg-[#00a859] text-white' : 'bg-white text-slate-600 group-hover:text-[#00a859] shadow-2xs'
                }`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold leading-tight line-clamp-2">
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
