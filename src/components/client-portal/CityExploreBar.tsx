'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import { trackCitySelect } from '@/lib/analytics/events';

interface CityCard {
  id: string;
  name: string;
  image?: string;
  isAll?: boolean;
}

const CLIENT_CITIES: CityCard[] = [
  {
    id: 'parana',
    name: 'Paraná',
    image: '/images/city-parana.jpg',
  },
  {
    id: 'concordia',
    name: 'Concordia',
    image: '/images/city-concordia.jpg',
  },
  {
    id: 'gualeguaychu',
    name: 'Gualeguaychú',
    image: '/images/city-gualeguaychu.jpg',
  },
  {
    id: 'colon',
    name: 'Colón',
    image: '/images/city-colon.jpg',
  },
  {
    id: 'concepcion-del-uruguay',
    name: 'Concepción del Uruguay',
    image: '/images/city-concepcion.jpg',
  },
  {
    id: 'federacion',
    name: 'Federación',
    image: '/images/city-federacion.jpg',
  },
  {
    id: 'villa-elisa',
    name: 'Villa Elisa',
    image: '/images/city-villaelisa.jpg',
  },
  {
    id: 'chajari',
    name: 'Chajarí',
    image: '/images/city-chajari.jpg',
  },
  {
    id: 'all',
    name: 'Todas las ciudades',
    isAll: true,
  },
];

export function CityExploreBar() {
  const [selectedCity, setSelectedCity] = useState('all');

  const handleSelect = (city: CityCard) => {
    setSelectedCity(city.id);
    trackCitySelect(city.id, city.name);
    if (city.id !== 'all') {
      window.location.href = `/ciudad/${city.id}`;
    }
  };

  return (
    <section id="ciudades" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <span>Explorá</span>
          <span className="text-[#00a859]">por ciudad</span>
        </h2>
        <a href="#ciudades" className="text-xs font-bold text-[#004b87] hover:text-[#00a859] flex items-center gap-1">
          <span>Ver todas las ciudades</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4">
        {CLIENT_CITIES.map((city) => {
          const isSelected = selectedCity === city.id;
          return (
            <button
              key={city.id}
              onClick={() => handleSelect(city)}
              className={`group flex flex-col items-center rounded-2xl overflow-hidden border transition-all text-center ${
                isSelected
                  ? 'border-[#00a859] ring-2 ring-[#00a859]/30 bg-white shadow-md'
                  : 'border-slate-200 bg-white hover:border-[#00a859] shadow-2xs'
              }`}
            >
              {city.isAll ? (
                <div className="h-20 sm:h-24 w-full bg-slate-50 flex items-center justify-center text-[#004b87] group-hover:text-[#00a859] transition-colors">
                  <MapPin className="w-8 h-8 text-[#00a859]" />
                </div>
              ) : (
                <div className="relative h-20 sm:h-24 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={city.image || ''}
                    alt={city.name}
                    fill
                    sizes="150px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-2 w-full">
                <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#00a859] transition-colors">
                  {city.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
