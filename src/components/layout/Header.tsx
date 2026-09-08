'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, 
  Search, 
  Store, 
  Newspaper, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Compass
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
    
    // Dispatch a custom event or update URL params for page sync
    const url = new URL(window.location.href);
    if (cityId === 'all') {
      url.searchParams.delete('city');
    } else {
      url.searchParams.set('city', cityId);
    }
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new Event('popstate'));
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
    <header className="sticky top-11 z-40 glass-header border-b border-[#eae3d2] transition-all shadow-xs">
      {/* Top Banner Ribbon */}
      <div className="bg-[#0f3443] text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span> Portal Oficial del Comercio, Turismo y Medios de Entre Ríos </span>
        <span className="hidden sm:inline-block opacity-75">• Impulsando la economía del Litoral</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 group shrink-0 focus:outline-hidden focus:ring-2 focus:ring-[#1d5b79] rounded-lg p-1"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1d5b79] via-[#2b86c5] to-[#2d6a4f] p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0f3443] rounded-[10px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-[#52b788] group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#0f3443] flex items-center gap-1">
                ENTRE RÍOS <span className="bg-gradient-to-r from-[#1d5b79] to-[#2d6a4f] bg-clip-text text-transparent">ON</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2d6a4f] -mt-1">
                Directorio & Medios
              </span>
            </div>
          </Link>

          {/* Persistent City Dropdown Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-2 bg-[#f4efe6] hover:bg-[#eae3d2] text-[#0f3443] px-3.5 py-2 rounded-xl text-sm font-semibold border border-[#eae3d2] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#1d5b79]"
              aria-expanded={isCityDropdownOpen}
              aria-haspopup="true"
              aria-label="Seleccionar ciudad de Entre Ríos"
            >
              <MapPin className="w-4 h-4 text-[#1d5b79]" />
              <span>{selectedCityObj.name}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCityDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#eae3d2] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Ciudades de Entre Ríos
                </div>
                {CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city.id, city.name)}
                    className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between hover:bg-[#f4efe6] transition-colors ${
                      currentCity === city.id ? 'font-bold text-[#1d5b79] bg-[#f4efe6]/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{city.name}</span>
                    {currentCity === city.id && <span className="w-2 h-2 rounded-full bg-[#2d6a4f]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Global Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-md relative items-center"
          >
            <input
              type="text"
              placeholder="Buscar productos, comercios, artesanías o gastronomía..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/90 border border-[#eae3d2] rounded-xl pl-10 pr-10 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1d5b79] focus:border-transparent transition-all shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 text-xs bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </form>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="#comunidad"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-[#0f3443] hover:bg-[#f4efe6] transition-colors"
            >
              <Newspaper className="w-4 h-4 text-[#2d6a4f]" />
              <span>Comunidad</span>
            </Link>

            <Link
              href="#sumar-comercio"
              className="flex items-center gap-2 bg-gradient-to-r from-[#1d5b79] to-[#0f3443] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:from-[#0f3443] hover:to-[#1d5b79] transition-all transform active:scale-95"
            >
              <Store className="w-4 h-4 text-[#52b788]" />
              <span>Publicá tu Negocio</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 rounded-xl bg-[#f4efe6] text-[#0f3443] hover:bg-[#eae3d2] focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-[#eae3d2] px-4 pt-3 pb-6 space-y-4 animate-in fade-in duration-200">
          {/* Mobile City Selector */}
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
                      ? 'border-[#1d5b79] bg-[#f4efe6] font-bold text-[#1d5b79]' 
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Buscar comercios o productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f4efe6] border border-[#eae3d2] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Mobile Navigation Links */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="#catalogo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-800"
            >
              Catálogo de Comercios
            </Link>
            <Link
              href="#comunidad"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sm font-semibold text-slate-800"
            >
              Comunidad & Noticias
            </Link>
            <Link
              href="#sumar-comercio"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#1d5b79] text-white py-3 rounded-xl font-bold text-sm"
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
