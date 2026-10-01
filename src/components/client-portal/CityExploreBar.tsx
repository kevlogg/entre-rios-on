'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { trackCitySelect } from '@/lib/analytics/events';
import { getCitiesByProvince, getProvinceById, PROVINCES } from '@/lib/constants/locations';
import { City } from '@/types';

interface CityExploreBarProps {
  provinceId?: string;
}

export function CityExploreBar({ provinceId = 'santa-fe' }: CityExploreBarProps) {
  // Get province object and cities for the selected province
  const currentProvince = getProvinceById(provinceId) || PROVINCES[0]; // Default to Santa Fe
  const cities: City[] = getCitiesByProvince(currentProvince.id);

  const handleSelect = (cityId: string, cityName: string) => {
    trackCitySelect(cityId, cityName);
  };

  return (
    <section id="ciudades" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-white/20 pb-3">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <span>Explorá por ciudad</span>
          <span className="text-[#00E5FF] font-black">• {currentProvince.name}</span>
        </h2>
        <Link 
          href={`/${currentProvince.slug}`} 
          className="text-xs font-bold text-[#00E5FF] hover:text-white flex items-center gap-1"
        >
          <span>Ver todas las ciudades de {currentProvince.name}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
        {cities.map((city) => (
          <Link
            key={city.id}
            href={`/${currentProvince.slug}/${city.slug || city.id}`}
            onClick={() => handleSelect(city.id, city.name)}
            className="group flex flex-col items-center rounded-2xl overflow-hidden border border-white/20 bg-slate-900/70 hover:bg-slate-900/90 hover:border-cyan-300 hover:shadow-xl transition-all text-center shadow-lg"
          >
            <div className="relative h-20 sm:h-24 w-full bg-slate-800 overflow-hidden">
              <Image
                src={city.imageUrl || '/images/city-parana.jpg'}
                alt={city.name}
                fill
                sizes="150px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-2 w-full">
              <span className="text-xs font-extrabold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                {city.name}
              </span>
            </div>
          </Link>
        ))}

        {/* Card final para Ver Todas */}
        <Link
          href={`/${currentProvince.slug}`}
          className="group flex flex-col items-center rounded-2xl overflow-hidden border border-white/30 bg-white/15 hover:bg-white/30 transition-all text-center shadow-lg backdrop-blur-md"
        >
          <div className="h-20 sm:h-24 w-full flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
            <MapPin className="w-8 h-8 text-cyan-300" />
          </div>
          <div className="p-2 w-full">
            <span className="text-xs font-black text-cyan-200 line-clamp-1">
              Todas las...
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
