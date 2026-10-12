'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

  const cities: City[] = staticCities.map((c) => {
    const customCity = currentProvinceConfig?.cities?.find((cc) => cc.id === c.id || cc.slug === c.slug);
    return {
      ...c,
      imageUrl: customCity?.imageUrl || c.imageUrl || '/images/city-rosario.jpg',
    };
  });

  const handleSelect = (cityId: string, cityName: string) => {
    trackCitySelect(cityId, cityName);
  };

  return (
    <section id="ciudades" className="w-full pt-1 pb-3">
      {/* Title matching mockup: Explorá por ciudad · Santa Fe */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 flex items-center gap-1.5">
          <span>Explorá por ciudad</span>
          <span className="text-[#0047BA] font-black">· {currentProvince.name}</span>
        </h2>
      </div>

      {/* 8 City Cards Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5 lg:gap-3">
        {cities.map((city) => (
          <Link
            key={city.id}
            href={`/${currentProvince.slug}/${city.slug || city.id}`}
            onClick={() => handleSelect(city.id, city.name)}
            className="group flex flex-col items-center rounded-xl lg:rounded-2xl overflow-hidden bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-[#0047BA]/50 transition-all shadow-2xs hover:shadow-md cursor-pointer text-center"
          >
            <div className="relative h-14 sm:h-16 lg:h-20 w-full bg-slate-100 overflow-hidden">
              <Image
                src={city.imageUrl || '/images/city-rosario.jpg'}
                alt={city.name}
                fill
                sizes="(max-width: 640px) 25vw, 12vw"
                className="object-cover group-hover:scale-106 transition-transform duration-500"
              />
            </div>

            <div className="p-1.5 sm:p-2 w-full bg-white text-center">
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#0047BA] transition-colors">
                {city.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
