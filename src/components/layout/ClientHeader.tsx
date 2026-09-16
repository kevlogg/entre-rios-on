'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  User, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Store,
  Crown,
  MapPin,
  Building2
} from 'lucide-react';
import { trackSearchQuery, trackCitySelect } from '@/lib/analytics/events';
import { PROVINCES, getCitiesByProvince } from '@/lib/constants/locations';

export function ClientHeader() {
  const [selectedProvince, setSelectedProvince] = useState<string>('santa-fe');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Inicio');

  const availableCities = getCitiesByProvince(selectedProvince);
  const currentProvinceObj = PROVINCES.find((p) => p.id === selectedProvince) || PROVINCES[0];
  const currentCityObj = availableCities.find((c) => c.id === selectedCity) || { id: 'all', name: 'Todas las ciudades' };

  const handleProvinceSelect = (provId: string) => {
    setSelectedProvince(provId);
    setSelectedCity('all');
    setIsProvinceDropdownOpen(false);
  };

  const handleCitySelect = (cityId: string, cityName: string) => {
    setSelectedCity(cityId);
    setIsCityDropdownOpen(false);
    trackCitySelect(cityId, cityName);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    trackSearchQuery(searchQuery);
    const catalogElem = document.getElementById('catalogo') || document.getElementById('ofertas-destacadas');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigation links leading to dedicated URLs for every menu option
  const navLinks: { name: string; href: string }[] = [
    { name: 'Inicio', href: '/' },
    { name: 'Comercios Adheridos', href: '/comercios' },
    { name: 'Catálogo & Ofertas', href: '/catalogo' },
    { name: 'Sorteos ON MÁS', href: '/sorteos' },
    { name: 'Clasificados', href: '/clasificados' },
    { name: 'Comunidad', href: '/comunidad' },
    { name: 'Turismo', href: '/turismo' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Header Main Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Oficial */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="relative w-40 h-12 sm:w-48 sm:h-14">
              <Image
                src="/logo.png"
                alt="Entre Ríos ON MÁS Portal"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Dual Location Selectors: Provincia & Ciudad */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Province Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsProvinceDropdownOpen(!isProvinceDropdownOpen);
                  setIsCityDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-[#0047BA] px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" />
                <span className="truncate max-w-[110px]">{currentProvinceObj.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProvinceDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProvinceDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Provincia
                  </div>
                  {PROVINCES.map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => handleProvinceSelect(prov.id)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        selectedProvince === prov.id ? 'font-bold text-[#0047BA] bg-cyan-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{prov.name}</span>
                      {selectedProvince === prov.id && <span className="w-1.5 h-1.5 rounded-full bg-[#00ADB5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsCityDropdownOpen(!isCityDropdownOpen);
                  setIsProvinceDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-[#0047BA] px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
              >
                <Building2 className="w-3.5 h-3.5 text-[#00ADB5]" />
                <span className="truncate max-w-[130px]">{currentCityObj.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-64 overflow-y-auto">
                  <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Ciudades ({currentProvinceObj.name})
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCitySelect('all', 'Todas las ciudades')}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      selectedCity === 'all' ? 'font-bold text-[#0047BA] bg-cyan-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>Todas las ciudades</span>
                    {selectedCity === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-[#00ADB5]" />}
                  </button>
                  {availableCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleCitySelect(city.id, city.name)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        selectedCity === city.id ? 'font-bold text-[#0047BA] bg-cyan-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{city.name}</span>
                      {selectedCity === city.id && <span className="w-1.5 h-1.5 rounded-full bg-[#00ADB5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Global Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative items-center"
          >
            <input
              type="text"
              placeholder="Buscá productos, comercios, ofertas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-12 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#00ADB5] focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#007C8A] hover:to-[#002878] text-white px-3 rounded-lg flex items-center justify-center transition-all shadow-xs cursor-pointer"
              aria-label="Buscar"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* User Actions: Panel Comercio (Mi Negocio) & Carrito */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Panel B2B Comercio */}
            <Link 
              href="/admin" 
              className="flex flex-col items-center text-[#0047BA] hover:text-[#00ADB5] transition-colors"
              title="Panel de Administración del Comercio"
            >
              <Store className="w-5 h-5 text-[#00ADB5]" />
              <span className="text-[11px] font-extrabold mt-0.5">Mi Negocio</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-[#00ADB5] focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Secondary Horizontal Navigation Bar (Top 5 items only, NO cities) */}
      <nav className="hidden md:block border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-start gap-1 sm:gap-2 overflow-x-auto text-xs font-bold text-slate-700 scrollbar-none py-1.5">
            {navLinks.map((link) => {
              const isActive = activeTab === link.name;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setActiveTab(link.name)}
                    className={`px-4 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-[#00ADB5] to-[#0047BA] text-white shadow-xs font-extrabold'
                        : 'hover:bg-cyan-50/60 hover:text-[#00ADB5] text-slate-700 font-bold'
                    }`}
                  >
                    {link.name === 'Sorteos ON MÁS' && <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in fade-in duration-200">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600">Provincia</label>
            <div className="flex gap-2">
              {PROVINCES.map((prov) => (
                <button
                  key={prov.id}
                  onClick={() => handleProvinceSelect(prov.id)}
                  className={`flex-1 text-xs py-2 px-3 rounded-xl border text-center font-bold ${
                    selectedProvince === prov.id
                      ? 'border-[#0047BA] bg-cyan-50 text-[#0047BA]'
                      : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {prov.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600">Ciudad</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
            >
              <option value="all">Todas las ciudades ({currentProvinceObj.name})</option>
              {availableCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Buscá productos, servicios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-4 pr-10 py-2 text-xs"
            />
            <button type="submit" className="absolute right-2 top-2 bg-gradient-to-r from-[#00ADB5] to-[#007C8A] text-white p-1 rounded-lg">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="flex flex-col gap-1 pt-2 border-t border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-bold py-2 px-3 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2"
              >
                {link.name === 'Sorteos ON MÁS' && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

