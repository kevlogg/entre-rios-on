'use client';

import React, { useState } from 'react';
import { City } from '@/types';
import { MapPin, Sparkles, Building2 } from 'lucide-react';
import { trackCitySelect } from '@/lib/analytics/events';
import { PROVINCES } from '@/lib/constants/locations';

interface CityFilterBarProps {
  cities: City[];
  selectedCity: string;
  onSelectCity: (cityId: string) => void;
  selectedProvince?: string;
  onSelectProvince?: (provId: string) => void;
}

export function CityFilterBar({ 
  cities, 
  selectedCity, 
  onSelectCity,
  selectedProvince = 'santa-fe',
  onSelectProvince
}: CityFilterBarProps) {
  const [activeProv, setActiveProv] = useState<string>(selectedProvince);

  const handleProvClick = (provId: string) => {
    setActiveProv(provId);
    if (onSelectProvince) {
      onSelectProvince(provId);
    }
    onSelectCity('all');
  };

  const handleSelect = (cityId: string, cityName: string) => {
    onSelectCity(cityId);
    trackCitySelect(cityId, cityName);
  };

  const filteredCities = activeProv === 'all'
    ? cities
    : cities.filter((c) => c.provinceId === activeProv || (!c.provinceId && activeProv === 'entre-rios'));

  return (
    <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-4">
      {/* Header & Province Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <h2 className="text-sm font-extrabold text-[#0047BA] uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#00ADB5]" />
          <span>Filtrar por Provincia y Ciudad</span>
        </h2>

        {/* Province Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {PROVINCES.map((prov) => (
            <button
              key={prov.id}
              onClick={() => handleProvClick(prov.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeProv === prov.id
                  ? 'bg-gradient-to-r from-[#00ADB5] to-[#0047BA] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {prov.name}
            </button>
          ))}
        </div>
      </div>

      {/* Cities Pills Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => handleSelect('all', 'Todas las ciudades')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCity === 'all'
              ? 'bg-[#0047BA] text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Todas las ciudades</span>
        </button>

        {filteredCities.map((city) => {
          const isSelected = selectedCity.toLowerCase() === city.id.toLowerCase();
          return (
            <button
              key={city.id}
              onClick={() => handleSelect(city.id, city.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#00ADB5] text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 opacity-70" />
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

