'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  Search, 
  Store, 
  Newspaper, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { trackCitySelect, trackSearchQuery } from '@/lib/analytics/events';

interface HeaderProps {
  selectedCityId?: string;
}

const CITIES = [
  { id: 'all', name: 'Toda Entre Ríos' },
  { id: 'parana', name: 'Paraná' },
  { id: 'concordia', name: 'Concordia' },
  { id: 'colon', name: 'Colón' },
  { id: 'gualeguaychu', name: 'Gualeguaychú' },
  { id: 'concepcion-del-uruguay', name: 'Concepción del Uruguay' },
  { id: 'federacion', name: 'Federación' },
];

export function Header({ selectedCityId = 'all' }: HeaderProps) {
  const [currentCity, setCurrentCity] = useState(selectedCityId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const selectedCityObj = CITIES.find((c) => c.id === currentCity) || CITIES[0];

  const handleCitySelect = (cityId: string, cityName: string) => {
    setCurrentCity(cityId);
    setIsCityDropdownOpen(false);
    trackCitySelect(cityId, cityName);
    
    if (cityId === 'all') {
      window.location.href = '/editorial#catalogo';
    } else {
      window.location.href = `/ciudad/${cityId}`;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    trackSearchQuery(searchQuery);
    
    const catalogSection = document.getElementById('catalogo');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-11 z-40 bg-white border-b border-slate-200 transition-all shadow-xs">
      {/* Top Banner Ribbon */}
      <div className="bg-[#004b87] text-white text-xs py-1.5 px-4 text-center font-semibold flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span> Portal Oficial del Comercio, Turismo y Medios de Entre Ríos </span>
        <span className="hidden sm:inline-block opacity-85">• Impulsando la economía del Litoral</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo Oficial */}
          <Link href="/editorial" className="flex items-center gap-3 shrink-0">
            <div className="relative w-36 h-12 sm:w-44 sm:h-14">
              <Image
                src="/logo.jpeg"
                alt="Entre Ríos ON Portal"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Persistent City Dropdown Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#004b87] px-3.5 py-2 rounded-xl text-sm font-bold border border-slate-200 transition-colors"
              aria-expanded={isCityDropdownOpen}
              aria-haspopup="true"
              aria-label="Seleccionar ciudad de Entre Ríos"
            >
              <MapPin className="w-4 h-4 text-[#00a859]" />
              <span>{selectedCityObj.name}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCityDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Ciudades de Entre Ríos
                </div>
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city.id, city.name)}
                    className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      currentCity === city.id ? 'font-bold text-[#004b87] bg-slate-100' : 'text-slate-700'
                    }`}
                  >
                    <span>{city.name}</span>
                    {currentCity === city.id && <span className="w-2 h-2 rounded-full bg-[#00a859]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Global Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-sm relative items-center"
          >
            <input
              type="text"
              placeholder="Buscar productos, comercios, artesanías..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#00a859] focus:bg-white transition-all shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          </form>

          {/* Action CTAs & Subpage Shortcuts */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/comercios"
              className="px-3 py-2 rounded-xl text-xs font-extrabold text-[#004b87] hover:bg-slate-100 transition-colors"
            >
              Comercios
            </Link>

            <Link
              href="/clasificados"
              className="px-3 py-2 rounded-xl text-xs font-extrabold text-[#004b87] hover:bg-slate-100 transition-colors"
            >
              Clasificados
            </Link>

            <Link
              href="/sorteos"
              className="px-3 py-2 rounded-xl text-xs font-extrabold text-[#004b87] hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sorteos</span>
            </Link>

            <Link
              href="#sumar-comercio"
              className="flex items-center gap-1.5 bg-[#00a859] hover:bg-[#008746] text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-md transition-all active:scale-95"
            >
              <Store className="w-3.5 h-3.5 text-white" />
              <span>Publicá tu Negocio</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 rounded-xl bg-slate-100 text-[#004b87] hover:bg-slate-200 focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in fade-in duration-200">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Ciudad Seleccionada</label>
            <div className="grid grid-cols-2 gap-2">
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    handleCitySelect(city.id, city.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-xs p-2 rounded-lg text-left border ${
                    currentCity === city.id 
                      ? 'border-[#004b87] bg-slate-100 font-bold text-[#004b87]' 
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Buscar comercios o productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="#catalogo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sm font-bold text-slate-800"
            >
              Catálogo de Comercios
            </Link>
            <Link
              href="#comunidad"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sm font-bold text-slate-800"
            >
              Comunidad & Noticias
            </Link>
            <Link
              href="#sumar-comercio"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#00a859] text-white py-3 rounded-xl font-extrabold text-sm"
            >
              <Store className="w-4 h-4" />
              Publicá tu Negocio en Entre Ríos ON
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
