'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { trackCitySelect } from '@/lib/analytics/events';
import { getCitiesByProvince, getProvinceById, PROVINCES } from '@/lib/constants/locations';
import { useActiveProvinces } from '@/lib/services/province-store';
import { PageBackground } from '@/components/common/PageBackground';
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
    <section id="ciudades" className="relative w-full py-4 sm:py-6 my-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Header Row: Clean responsive ordering for mobile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-300 pb-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <span>Explorá por ciudad</span>
            <span className="text-[#0047BA] font-black">• {currentProvince.name}</span>
          </h2>
          <Link 
            href={`/${currentProvince.slug}`} 
            className="text-xs sm:text-sm font-extrabold text-[#0047BA] hover:text-[#002878] flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Ver todas las ciudades de {currentProvince.name}</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0047BA]" />
          </Link>
        </div>

        {/* 1-Row Horizontal Touch Scroll on Mobile / Standard Grid on Desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3 pb-2 sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 sm:gap-4 sm:pb-0">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={`/${currentProvince.slug}/${city.slug || city.id}`}
              onClick={() => handleSelect(city.id, city.name)}
              className="snap-start shrink-0 w-[125px] sm:w-auto group flex flex-col items-center rounded-2xl overflow-hidden border border-white/30 bg-white/95 hover:bg-white hover:border-cyan-400 hover:shadow-xl transition-all text-center shadow-md cursor-pointer"
            >
              <div className="relative h-20 sm:h-24 w-full bg-slate-900 overflow-hidden">
                <Image
                  src={city.imageUrl || '/images/city-parana.jpg'}
                  alt={city.name}
                  fill
                  sizes="150px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-2 sm:p-2.5 w-full bg-white text-center">
                <span className="text-xs font-black text-slate-900 line-clamp-1 group-hover:text-[#0047BA] transition-colors">
                  {city.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
