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
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <span>Explorá por ciudad</span>
          <span className="text-[#00ADB5] font-black">• {currentProvince.name}</span>
        </h2>
        <Link 
          href={`/${currentProvince.slug}`} 
          className="text-xs font-bold text-[#0047BA] hover:text-[#00ADB5] flex items-center gap-1"
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
            className="group flex flex-col items-center rounded-2xl overflow-hidden border border-slate-200 bg-white hover:border-[#00ADB5] hover:shadow-md transition-all text-center shadow-2xs"
          >
            <div className="relative h-20 sm:h-24 w-full bg-slate-100 overflow-hidden">
              <Image
                src={city.imageUrl || '/images/city-parana.jpg'}
                alt={city.name}
                fill
                sizes="150px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                {city.commerceCount} comercios
              </span>
            </div>

            <div className="p-2 w-full">
              <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#00ADB5] transition-colors">
                {city.name}
              </span>
            </div>
          </Link>
        ))}

        {/* Card final para Ver Todas */}
        <Link
          href={`/${currentProvince.slug}`}
          className="group flex flex-col items-center rounded-2xl overflow-hidden border border-cyan-200 bg-cyan-50/50 hover:bg-cyan-100/60 hover:border-[#00ADB5] transition-all text-center shadow-2xs"
        >
          <div className="h-20 sm:h-24 w-full flex items-center justify-center text-[#0047BA] group-hover:text-[#00ADB5] transition-colors">
            <MapPin className="w-8 h-8 text-[#00ADB5]" />
          </div>
          <div className="p-2 w-full">
            <span className="text-xs font-extrabold text-[#0047BA] line-clamp-1">
              Todas las...
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
