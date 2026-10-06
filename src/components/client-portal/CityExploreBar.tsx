'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { trackCitySelect } from '@/lib/analytics/events';
import { getCitiesByProvince, getProvinceById, PROVINCES } from '@/lib/constants/locations';
import { useActiveProvinces } from '@/lib/services/province-store';
import { City } from '@/types';

interface CityExploreBarProps {
  provinceId?: string;
}

export function CityExploreBar({ provinceId = 'santa-fe' }: CityExploreBarProps) {
  const activeProvinces = useActiveProvinces();
  const currentProvinceConfig = activeProvinces.find((p) => p.id === provinceId || p.slug === provinceId);
  const currentProvince = getProvinceById(provinceId) || PROVINCES[0];
  const staticCities: City[] = getCitiesByProvince(currentProvince.id);

  // Merge static cities with dynamic province config (which includes custom imageUrl per city)
  const cities: City[] = staticCities.map((c) => {
    const customCity = currentProvinceConfig?.cities?.find((cc) => cc.id === c.id || cc.slug === c.slug);
    return {
      ...c,
      imageUrl: customCity?.imageUrl || c.imageUrl || '/images/city-parana.jpg',
    };
  });

  const handleSelect = (cityId: string, cityName: string) => {
    trackCitySelect(cityId, cityName);
  };

  return (
    <section id="ciudades" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-300/70 pb-3">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <span>Explorá por ciudad</span>
          <span className="text-[#0047BA] font-black">• {currentProvince.name}</span>
        </h2>
        <Link 
          href={`/${currentProvince.slug}`} 
          className="text-xs font-black text-[#0047BA] hover:text-[#002878] flex items-center gap-1 transition-colors"
        >
          <span>Ver todas las ciudades de {currentProvince.name}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#00ADB5]" />
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
        {cities.map((city) => (
          <Link
            key={city.id}
            href={`/${currentProvince.slug}/${city.slug || city.id}`}
            onClick={() => handleSelect(city.id, city.name)}
            className="group flex flex-col items-center rounded-2xl overflow-hidden border border-slate-200/80 bg-white hover:border-[#00ADB5] hover:shadow-md transition-all text-center shadow-2xs"
          >
            <div className="relative h-20 sm:h-24 w-full bg-slate-100 overflow-hidden">
              <Image
                src={city.imageUrl || '/images/city-parana.jpg'}
                alt={city.name}
                fill
                sizes="150px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-2.5 w-full bg-white">
              <span className="text-xs font-extrabold text-slate-800 line-clamp-1 group-hover:text-[#0047BA] transition-colors">
                {city.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
