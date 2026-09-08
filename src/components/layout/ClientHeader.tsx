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
  Sparkles
} from 'lucide-react';
import { trackSearchQuery } from '@/lib/analytics/events';

export function ClientHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Inicio');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    trackSearchQuery(searchQuery);
    const catalogElem = document.getElementById('ofertas-destacadas');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Comercio Digital', href: '#comercio-digital' },
    { name: 'Ofertas', href: '#ofertas-destacadas' },
    { name: 'Comunidad', href: '#comunidad' },
    { name: 'Sorteos ON', href: '#sorteos-on' },
    { name: 'Clasificados', href: '#clasificados' },
    { name: 'Ciudades y Localidades', href: '#ciudades', hasDropdown: true },
    { name: 'Industria', href: '#industria' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-11 z-40 shadow-xs">
      {/* Top Header Main Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Oficial */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
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

          {/* Global Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl relative items-center"
          >
            <input
              type="text"
              placeholder="Buscá productos, servicios, comercios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-4 pr-12 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#00a859] focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 bg-[#00a859] hover:bg-[#008746] text-white px-3.5 rounded-lg flex items-center justify-center transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* User Actions: Ingresar, Carrito, Mobile Menu */}
          <div className="flex items-center gap-5 sm:gap-6">
            
            {/* Ingresar */}
            <Link 
              href="#ingresar" 
              className="flex flex-col items-center text-slate-700 hover:text-[#00a859] transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-[11px] font-semibold mt-0.5">Ingresar</span>
            </Link>

            {/* Carrito */}
            <Link 
              href="#carrito" 
              className="flex flex-col items-center text-slate-700 hover:text-[#00a859] transition-colors relative"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-2 bg-[#00a859] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  0
                </span>
              </div>
              <span className="text-[11px] font-semibold mt-0.5">Carrito</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-[#00a859] focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Secondary Horizontal Navigation Bar */}
      <nav className="hidden md:block border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-bold text-slate-700 scrollbar-none py-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.name;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setActiveTab(link.name)}
                    className={`px-3 py-2 rounded-lg flex items-center gap-1 transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#00a859] text-white shadow-xs'
                        : 'hover:bg-slate-100 hover:text-[#00a859]'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5 opacity-80" />}
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
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Buscá productos, servicios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-4 pr-10 py-2 text-sm"
            />
            <button type="submit" className="absolute right-2 top-2 bg-[#00a859] text-white p-1.5 rounded-lg">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-semibold py-2 px-3 rounded-lg hover:bg-slate-100 text-slate-700"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
