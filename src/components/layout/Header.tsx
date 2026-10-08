'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Search, 
  Store, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Crown,
  Building2,
  User,
  LayoutGrid,
  ArrowRight
} from 'lucide-react';
import { trackCitySelect, trackSearchQuery } from '@/lib/analytics/events';
import { PROVINCES, getCitiesByProvince, getProvinceBySlug, getCityBySlug } from '@/lib/constants/locations';
import { useActiveProvinces } from '@/lib/services/province-store';
import { CATEGORIES_LIST } from '@/lib/constants/categories';

interface HeaderProps {
  selectedCityId?: string;
}

export function Header({ selectedCityId = 'all' }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [selectedProvince, setSelectedProvince] = useState<string>('santa-fe');
  const [currentCity, setCurrentCity] = useState(selectedCityId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);
  const categoriesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeProvinces = useActiveProvinces();

  // User & Commerce Auth State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userCommerce, setUserCommerce] = useState<{ name: string; logoUrl?: string; initial: string } | null>(null);

  useEffect(() => {
    async function checkAuthAndCommerce() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setCurrentUser(user);

          const { data: commerces } = await supabase
            .from('commerces')
            .select('name, logo_url')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          const commerceObj = commerces && commerces.length > 0 ? commerces[0] : null;

          const commerceName =
            commerceObj?.name ||
            user.user_metadata?.commerce_name ||
            user.user_metadata?.full_name ||
            user.email?.split('@')[0] ||
            'Mi Comercio';

          const rawLogo = commerceObj?.logo_url || user.user_metadata?.logo_url || '';
          const hasValidCustomLogo =
            rawLogo &&
            !rawLogo.includes('city-rosario.jpg') &&
            (rawLogo.startsWith('http') || rawLogo.startsWith('data:') || rawLogo.startsWith('/uploads'));

          const initialChar = commerceName.trim().charAt(0).toUpperCase() || 'M';

          setUserCommerce({
            name: commerceName,
            logoUrl: hasValidCustomLogo ? rawLogo : undefined,
            initial: initialChar,
          });
        } else {
          setCurrentUser(null);
          setUserCommerce(null);
        }
      } catch (err) {
        console.warn('Error verificando autenticación en Header:', err);
      }
    }

    checkAuthAndCommerce();

    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session?.user) {
          setCurrentUser(null);
          setUserCommerce(null);
        } else {
          checkAuthAndCommerce();
        }
      });
      return () => subscription.unsubscribe();
    }).catch(() => {});
  }, []);

  // Sync state from URL pathname
  useEffect(() => {
    if (!pathname) return;
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      const provMatch = getProvinceBySlug(parts[0]);
      if (provMatch) {
        setSelectedProvince(provMatch.id);
        if (parts.length > 1) {
          const cityMatch = getCityBySlug(parts[1]);
          if (cityMatch) {
            setCurrentCity(cityMatch.id);
          }
        }
      }
    }
  }, [pathname]);

  const availableCities = getCitiesByProvince(selectedProvince);
  const currentProvinceObj = activeProvinces.find((p) => p.id === selectedProvince || p.slug === selectedProvince) || activeProvinces[0] || { id: 'santa-fe', name: 'Santa Fe', slug: 'santa-fe' };
  const selectedCityObj = availableCities.find((c) => c.id === currentCity) || { id: 'all', name: 'Todas las ciudades', slug: '' };

  // Helper to build geo-targeted URL for a section
  const getGeoUrl = (sectionSlug: string) => {
    const provSlug = currentProvinceObj.slug || 'santa-fe';
    const citySlug = selectedCityObj.id !== 'all' ? (selectedCityObj.slug || selectedCityObj.id) : null;

    if (sectionSlug === '') {
      if (citySlug) return `/${provSlug}/${citySlug}`;
      if (provSlug !== 'todas') return `/${provSlug}`;
      return '/';
    }

    if (citySlug) {
      return `/${provSlug}/${citySlug}/${sectionSlug}`;
    }
    return `/${sectionSlug}`;
  };

  const handleProvinceSelect = (provId: string) => {
    setSelectedProvince(provId);
    setCurrentCity('all');
    setIsProvinceDropdownOpen(false);

    const targetProv = activeProvinces.find((p) => p.id === provId || p.slug === provId);
    if (targetProv && targetProv.slug) {
      router.push(`/${targetProv.slug}`);
    } else {
      router.push('/');
    }
  };

  const handleCitySelect = (cityId: string, cityName: string) => {
    setCurrentCity(cityId);
    setIsCityDropdownOpen(false);
    trackCitySelect(cityId, cityName);

    const targetCity = availableCities.find((c) => c.id === cityId);
    if (targetCity && cityId !== 'all') {
      router.push(`/${currentProvinceObj.slug}/${targetCity.slug}`);
    } else {
      router.push(`/${currentProvinceObj.slug}`);
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

  const handleCategoriesMouseEnter = () => {
    if (categoriesTimeoutRef.current) clearTimeout(categoriesTimeoutRef.current);
    setIsCategoriesHovered(true);
  };

  const handleCategoriesMouseLeave = () => {
    categoriesTimeoutRef.current = setTimeout(() => {
      setIsCategoriesHovered(false);
    }, 200);
  };

  const navLinks: { name: string; href: string; slug: string }[] = [
    { name: 'Inicio', href: getGeoUrl(''), slug: '' },
    { name: 'Categorías', href: getGeoUrl('catalogo'), slug: 'catalogo' },
    { name: 'Comercios Adheridos', href: getGeoUrl('comercios'), slug: 'comercios' },
    { name: 'Turismo', href: getGeoUrl('turismo'), slug: 'turismo' },
    { name: 'Comunidad', href: getGeoUrl('comunidad'), slug: 'comunidad' },
    { name: 'Novedades', href: '/novedades', slug: 'novedades' },
    { name: 'Oportunidades', href: '/oportunidades', slug: 'oportunidades' },
    { name: 'Empleos', href: '/empleos', slug: 'empleos' },
    { name: 'Sorteos ON MÁS', href: getGeoUrl('sorteos'), slug: 'sorteos' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-lg transition-all w-full">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] text-white text-[10px] sm:text-xs py-1.5 px-2 sm:px-4 text-center font-semibold flex items-center justify-center gap-1.5 sm:gap-2">
        <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse shrink-0" />
        <span className="truncate max-w-[85vw] sm:max-w-none"> Portal Oficial del Comercio, Turismo y Medios: ON MÁS </span>
        <span className="hidden sm:inline-block opacity-85 shrink-0">• Impulsando la economía del Litoral</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo Oficial */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="relative w-44 h-12 sm:w-64 sm:h-16">
              <Image
                src="/logo1.png"
                alt="ON MÁS Portal"
                fill
                priority
                className="object-contain object-left scale-110"
              />
            </div>
          </Link>

          {/* Persistent Dual Location Selectors: Provincia & Ciudad */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Province Selector */}
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
                    Provincias Activas
                  </div>
                  {activeProvinces.map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => handleProvinceSelect(prov.id)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        selectedProvince === prov.id || selectedProvince === prov.slug ? 'font-bold text-[#0047BA] bg-cyan-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{prov.name}</span>
                      {(selectedProvince === prov.id || selectedProvince === prov.slug) && <span className="w-1.5 h-1.5 rounded-full bg-[#00ADB5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City Selector */}
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
                <span className="truncate max-w-[130px]">{selectedCityObj.name}</span>
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
                      currentCity === 'all' ? 'font-bold text-[#0047BA] bg-cyan-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>Todas las ciudades</span>
                    {currentCity === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-[#00ADB5]" />}
                  </button>
                  {availableCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleCitySelect(city.id, city.name)}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        currentCity === city.id ? 'font-bold text-[#0047BA] bg-cyan-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{city.name}</span>
                      {currentCity === city.id && <span className="w-1.5 h-1.5 rounded-full bg-[#00ADB5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Global Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-sm relative items-center"
          >
            <input
              type="text"
              placeholder="Buscar productos, comercios, ofertas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#00ADB5] focus:bg-white transition-all shadow-md"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          </form>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {!currentUser ? (
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-[#0047BA] hover:bg-cyan-50 transition-colors flex items-center gap-1.5 border border-slate-200 hover:border-[#00ADB5]"
                title="Ingresar o Registrarse"
              >
                <User className="w-3.5 h-3.5 text-[#00ADB5]" />
                <span>Ingresar / Crear cuenta</span>
              </Link>
            ) : (
              <Link
                href="/admin"
                className="flex items-center gap-2.5 bg-slate-50 hover:bg-cyan-50/80 border border-slate-200 hover:border-[#00ADB5] p-1 pr-3 rounded-2xl transition-all shadow-2xs cursor-pointer group"
                title={`Panel de Administración: ${userCommerce?.name || 'Mi Negocio'}`}
              >
                {userCommerce?.logoUrl ? (
                  <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-slate-300 group-hover:border-[#00ADB5] bg-white shrink-0 shadow-2xs">
                    <Image
                      src={userCommerce.logoUrl}
                      alt={userCommerce.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0047BA] to-[#00ADB5] text-white flex items-center justify-center font-black text-sm shadow-2xs shrink-0">
                    {userCommerce?.initial || 'M'}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-black text-slate-900 group-hover:text-[#0047BA] leading-tight truncate max-w-[120px]">
                    {userCommerce?.name || 'Mi Comercio'}
                  </span>
                  <span className="text-[9px] font-extrabold text-[#00ADB5] uppercase tracking-wider">
                    Mi Negocio
                  </span>
                </div>
              </Link>
            )}

            <Link
              href="/login?mode=signup&type=negocio_automotor"
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#007C8A] hover:to-[#002878] text-white px-3.5 py-2 rounded-xl text-xs font-extrabold shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-white" />
              <span>Publicá tu Negocio</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 text-[#0047BA] hover:bg-slate-200 focus:outline-hidden shrink-0 ml-auto cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Secondary Horizontal Nav Bar */}
      <nav className="hidden md:block border-t border-white/10 bg-black/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-start gap-1 sm:gap-2 overflow-x-auto text-xs font-bold text-slate-700 scrollbar-none py-1.5">
            {navLinks.map((link) => {
              if (link.slug === 'catalogo') {
                return (
                  <li 
                    key={link.name}
                    className="relative"
                    onMouseEnter={handleCategoriesMouseEnter}
                    onMouseLeave={handleCategoriesMouseLeave}
                  >
                    <Link
                      href={link.href}
                      className="px-4 py-1.5 rounded-xl hover:bg-cyan-50/60 hover:text-[#00ADB5] text-slate-700 flex items-center gap-1.5 transition-all whitespace-nowrap"
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoriesHovered ? 'rotate-180 text-[#00ADB5]' : 'text-slate-400'}`} />
                    </Link>

                    {/* Desplegable de Categorías */}
                    {isCategoriesHovered && (
                      <div 
                        className="absolute top-full left-0 mt-1.5 w-[540px] bg-white border border-slate-200 rounded-3xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-2 gap-2 text-slate-800"
                        onMouseEnter={handleCategoriesMouseEnter}
                        onMouseLeave={handleCategoriesMouseLeave}
                      >
                        <div className="col-span-2 px-2 py-1 flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
                          <span className="text-[11px] font-black uppercase tracking-wider text-[#0047BA] flex items-center gap-1.5">
                            <LayoutGrid className="w-3.5 h-3.5 text-[#00ADB5]" />
                            Categorías del Catálogo ON MÁS
                          </span>
                          <Link
                            href="/catalogo"
                            onClick={() => setIsCategoriesHovered(false)}
                            className="text-[11px] font-bold text-[#00ADB5] hover:text-[#0047BA] flex items-center gap-1 transition-colors"
                          >
                            <span>Ver Todo</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>

                        {CATEGORIES_LIST.map((cat) => {
                          const IconComp = cat.icon;
                          return (
                            <Link
                              key={cat.id}
                              href={`/catalogo?categoria=${cat.id}`}
                              onClick={() => setIsCategoriesHovered(false)}
                              className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer"
                            >
                              <div className={`w-8 h-8 rounded-xl ${cat.iconBg} flex items-center justify-center shrink-0 border border-slate-100 shadow-2xs`}>
                                <IconComp className={`w-4 h-4 ${cat.iconColor}`} />
                              </div>
                              <div className="truncate">
                                <span className="text-xs font-bold text-slate-900 group-hover:text-[#0047BA] block truncate transition-colors">
                                  {cat.label}
                                </span>
                                <span className="text-[10px] text-slate-500 block truncate font-medium">
                                  {cat.description}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="px-4 py-1.5 rounded-xl hover:bg-cyan-50/60 hover:text-[#00ADB5] text-slate-700 flex items-center gap-1.5 transition-all whitespace-nowrap"
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
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in fade-in duration-200">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-600">Provincia</label>
            <div className="flex gap-2 flex-wrap">
              {activeProvinces.map((prov) => (
                <button
                  key={prov.id}
                  onClick={() => handleProvinceSelect(prov.id)}
                  className={`flex-1 text-xs py-2 px-3 rounded-xl border text-center font-bold ${
                    selectedProvince === prov.id || selectedProvince === prov.slug
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
              value={currentCity}
              onChange={(e) => setCurrentCity(e.target.value)}
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
              placeholder="Buscar comercios o productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50"
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


