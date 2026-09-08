'use client';

import React from 'react';
import { City } from '@/types';
import { MapPin, Sparkles } from 'lucide-react';
import { trackCitySelect } from '@/lib/analytics/events';

interface CityFilterBarProps {
  cities: City[];
  selectedCity: string;
  onSelectCity: (cityId: string) => void;
}

export function CityFilterBar({ cities, selectedCity, onSelectCity }: CityFilterBarProps) {
  const handleSelect = (cityId: string, cityName: string) => {
    onSelectCity(cityId);
    trackCitySelect(cityId, cityName);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#eae3d2] space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-[#0f3443] uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#1d5b79]" />
          <span>Filtrar por Nodo Regional</span>
        </h2>
        <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
          Mostrando comercios y agenda local
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => handleSelect('all', 'Toda Entre Ríos')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCity === 'all'
              ? 'bg-[#0f3443] text-white shadow-md'
              : 'bg-[#f4efe6] text-slate-700 hover:bg-[#eae3d2]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Toda Entre Ríos</span>
        </button>

        {cities.map((city) => {
          const isSelected = selectedCity.toLowerCase() === city.id.toLowerCase();
          return (
            <button
              key={city.id}
              onClick={() => handleSelect(city.id, city.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#1d5b79] text-white shadow-md'
                  : 'bg-[#f4efe6] text-slate-700 hover:bg-[#eae3d2]'
              }`}
            >
              <span>{city.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                {city.commerceCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
