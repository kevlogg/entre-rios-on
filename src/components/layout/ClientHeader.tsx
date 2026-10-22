'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Store, 
  MapPin, 
  ShoppingBag, 
  ArrowRight,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';
import { trackSearchQuery, trackCitySelect } from '@/lib/analytics/events';
import { PROVINCES, getCitiesByProvince, getProvinceBySlug, getCityBySlug } from '@/lib/constants/locations';
import { useActiveProvinces, getPersistedProvince, setPersistedProvince } from '@/lib/services/province-store';
import { CATEGORIES_LIST } from '@/lib/constants/categories';
import { getFeaturedProducts, getAllCommerces } from '@/lib/dal/portal';
import { Product, Commerce } from '@/types';

// Temas y colores característicos por provincia (Rojo Federal para Entre Ríos, Azul Invencible para Santa Fe, Turquesa para Nacional)
export const PROVINCE_THEMES: Record<string, {
  name: string;
  gradientClass: string;
  borderClass: string;
  shadowClass: string;
  accentHex: string;
  badgeBg: string;
  sublabel: string;
}> = {
  'entre-rios': {
    name: 'Entre Ríos',
    gradientClass: 'bg-gradient-to-r from-[#991b1b] via-[#b91c1c] to-[#dc2626]',
    borderClass: 'border-red-400/40 hover:border-red-300',
    shadowClass: 'shadow-md shadow-red-950/20',
    accentHex: '#b91c1c',
    badgeBg: 'bg-white/20 text-white',
    sublabel: 'PROVINCIA',
  },
  'santa-fe': {
    name: 'Santa Fe',
    gradientClass: 'bg-gradient-to-r from-[#002f87] via-[#0047BA] to-[#0260db]',
    borderClass: 'border-blue-400/40 hover:border-blue-300',
    shadowClass: 'shadow-md shadow-blue-950/20',
    accentHex: '#0047BA',
    badgeBg: 'bg-white/20 text-white',
    sublabel: 'PROVINCIA',
  },
  'all': {
    name: 'Todas las provincias',
    gradientClass: 'bg-gradient-to-r from-[#002878] via-[#004e92] to-[#00ADB5]',
    borderClass: 'border-cyan-400/40 hover:border-cyan-300',
    shadowClass: 'shadow-md shadow-cyan-950/20',
    accentHex: '#00ADB5',
    badgeBg: 'bg-white/20 text-white',
    sublabel: 'COBERTURA',
  },
  'cordoba': {
    name: 'Córdoba',
    gradientClass: 'bg-gradient-to-r from-[#00529b] via-[#b71c1c] to-[#0284c7]',
    borderClass: 'border-sky-400/40 hover:border-sky-300',
    shadowClass: 'shadow-md shadow-sky-950/20',
    accentHex: '#00529b',
    badgeBg: 'bg-white/20 text-white',
    sublabel: 'PROVINCIA',
  },
  'buenos-aires': {
    name: 'Buenos Aires',
    gradientClass: 'bg-gradient-to-r from-[#065f46] via-[#047857] to-[#0284c7]',
    borderClass: 'border-emerald-400/40 hover:border-emerald-300',
    shadowClass: 'shadow-md shadow-emerald-950/20',
    accentHex: '#047857',
    badgeBg: 'bg-white/20 text-white',
    sublabel: 'PROVINCIA',
  },
  'caba': {
    name: 'CABA',
    gradientClass: 'bg-gradient-to-r from-[#ca8a04] via-[#eab308] to-[#facc15]',
    borderClass: 'border-yellow-400/40 hover:border-yellow-300',
    shadowClass: 'shadow-md shadow-amber-950/20',
    accentHex: '#eab308',
    badgeBg: 'bg-white/20 text-white',
    sublabel: 'CIUDAD',
  },
};

interface ClientHeaderProps {
  withBackground?: boolean;
}

export function ClientHeader({ withBackground = false }: ClientHeaderProps = {}) {
  const pathname = usePathname();
  const router = useRouter();

  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);
  const categoriesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeProvinces = useActiveProvinces();

  // User & Commerce Auth State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userCommerce, setUserCommerce] = useState<{ name: string; logoUrl?: string; initial: string } | null>(null);

  // Search Data Index
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCommerces, setAllCommerces] = useState<Commerce[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const provinceContainerRef = useRef<HTMLDivElement>(null);
  const subnavScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkSubnavScroll = () => {
    if (!subnavScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = subnavScrollRef.current;
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkSubnavScroll();
    window.addEventListener('resize', checkSubnavScroll);
    return () => window.removeEventListener('resize', checkSubnavScroll);
  }, []);

  // Load search index on mount
  useEffect(() => {
    async function loadSearchIndex() {
      try {
        const [prods, comms] = await Promise.all([
          getFeaturedProducts(),
          getAllCommerces(false),
        ]);
        if (prods) setAllProducts(prods);
        if (comms) setAllCommerces(comms);
      } catch (e) {
        console.warn('Error cargando índice de búsqueda:', e);
      }
    }
    loadSearchIndex();
  }, []);

  // Close search dropdown and province dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (provinceContainerRef.current && !provinceContainerRef.current.contains(event.target as Node)) {
        setIsProvinceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    async function initAuth() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        async function checkUser() {
          if (!isMounted) return;
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!isMounted) return;

            if (user) {
              setCurrentUser(user);

              if (!getPersistedProvince()) {
                const userProv = user.user_metadata?.preferred_province_id || user.user_metadata?.province_id;
                if (userProv && userProv !== 'all') {
                  setPersistedProvince(userProv, false);
                  setSelectedProvince(userProv);
                }
              }

              const { data: commerces } = await supabase
                .from('commerces')
                .select('name, logo_url')
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1);

              if (!isMounted) return;
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

              setUserCommerce({
                name: commerceName,
                logoUrl: hasValidCustomLogo ? rawLogo : undefined,
                initial: commerceName.trim().charAt(0).toUpperCase() || 'M',
              });
            } else {
              setCurrentUser(null);
              setUserCommerce(null);
            }
          } catch (err) {
            console.warn('Error verificando autenticación en ClientHeader:', err);
          }
        }

        await checkUser();

        // Suscribir a cambios de auth — reutilizando el mismo cliente (sin nuevas instancias)
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!isMounted) return;
          if (!session?.user) {
            setCurrentUser(null);
            setUserCommerce(null);
          } else {
            checkUser();
          }
        });
        subscription = data.subscription;
      } catch (err) {
        console.warn('Error inicializando auth en ClientHeader:', err);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sync state from URL pathname or persistent storage
  useEffect(() => {
    if (!pathname) return;
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      const provMatch = getProvinceBySlug(parts[0]);
      if (provMatch && provMatch.id !== 'all') {
        setSelectedProvince(provMatch.id);
        setPersistedProvince(provMatch.id, false);
        return;
      }
    }
    if (pathname === '/') {
      setSelectedProvince('');
      return;
    }
    // Si estamos en una sección sin provincia en la URL (ej. /catalogo, /comercios),
    // mantener la provincia seleccionada previamente por el usuario si existe
    const savedProv = getPersistedProvince();
    if (savedProv && savedProv !== 'all') {
      setSelectedProvince(savedProv);
    } else {
      setSelectedProvince('');
    }
  }, [pathname]);

  // Escuchar cambios de provincia disparados por otros componentes en tiempo real
  useEffect(() => {
    const handleProvinceChange = (e: any) => {
      const newProvId = e.detail?.provinceId;
      if (newProvId) {
        setSelectedProvince(newProvId);
      }
    };
    window.addEventListener('onmas:province_changed', handleProvinceChange);
    return () => window.removeEventListener('onmas:province_changed', handleProvinceChange);
  }, []);

  const activeCitySlug = useMemo(() => {
    if (!pathname) return null;
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      const provMatch = getProvinceBySlug(parts[0]);
      if (provMatch) return parts[1];
    }
    return null;
  }, [pathname]);

  const activeCityObj = useMemo(() => {
    if (!activeCitySlug) return null;
    return getCityBySlug(activeCitySlug);
  }, [activeCitySlug]);

  const currentProvinceObj = selectedProvince
    ? activeProvinces.find((p) => p.id === selectedProvince || p.slug === selectedProvince) || null
    : null;
  const currentTheme = currentProvinceObj
    ? (PROVINCE_THEMES[currentProvinceObj.id] || PROVINCE_THEMES['santa-fe'])
    : PROVINCE_THEMES['santa-fe'];

  const handleProvinceSelect = (provId: string) => {
    setSelectedProvince(provId);
    setPersistedProvince(provId, true);
    setIsProvinceDropdownOpen(false);

    const targetProv = activeProvinces.find((p) => p.id === provId || p.slug === provId);
    if (targetProv && targetProv.slug) {
      router.push(`/${targetProv.slug}`);
    } else {
      router.push('/');
    }
  };

  // Dynamic Live Search Results
  const liveSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return null;

    const categories = CATEGORIES_LIST.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    ).slice(0, 3);

    const commerces = allCommerces.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.cityName.toLowerCase().includes(q)
    ).slice(0, 4);

    const products = allProducts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.commerceName.toLowerCase().includes(q) ||
      p.cityName.toLowerCase().includes(q)
    ).slice(0, 4);

    const totalCount = categories.length + commerces.length + products.length;

    return { categories, commerces, products, totalCount };
  }, [searchQuery, allCommerces, allProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    trackSearchQuery(q);
    setIsSearchFocused(false);
    router.push(`/catalogo?q=${encodeURIComponent(q)}`);
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

  // Enlaces de la barra superior: Inicio, Categorías, Comercios e Industria, Turismo, Vender ON+, Ayuda, Novedades, Oportunidades
  const subNavLinks = [
    { name: 'INICIO', href: '/', isCategory: false },
    { name: 'CATEGORÍAS', href: '/catalogo', isCategory: true },
    { name: 'COMERCIOS E INDUSTRIA', href: '/comercios', isCategory: false },
    { name: 'TURISMO', href: '/turismo', isCategory: false },
    { name: 'VENDER ON+', href: '/vender-on', isCategory: false },
    { name: 'AYUDA', href: '/ayuda', isCategory: false },
    { name: 'NOVEDADES', href: '/novedades', isCategory: false },
    { name: 'OPORTUNIDADES', href: '/oportunidades', isCategory: false },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-[#e2e8f0]">
      {/* 1. TOP BAR GRIS CLARO CON LOGO, SELECTOR DE PROVINCIA, BUSCADOR CENTRADO Y ACCESOS */}
      <div className="bg-[#e2e8f0] border-b border-slate-300">
        <div className="max-w-[1480px] mx-auto px-2 min-[360px]:px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Logo ON+ Portal Comercial + Province Selector */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1 sm:flex-initial">
            <Link href="/" className="flex items-center group shrink-0">
              <div className="relative w-[62px] h-9 sm:w-[96px] sm:h-14 lg:w-[116px] lg:h-[67px] flex items-center">
                <Image
                  src="/logo1.png"
                  alt="ON+ PORTAL COMERCIAL"
                  fill
                  priority
                  className="object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>

            {/* Selector de Provincia Prominente */}
            <div ref={provinceContainerRef} className="relative flex items-center min-w-0">
              <button
                type="button"
                onClick={() => setIsProvinceDropdownOpen(!isProvinceDropdownOpen)}
                style={currentProvinceObj?.badgeColor ? { backgroundColor: currentProvinceObj.badgeColor, borderColor: 'rgba(255, 255, 255, 0.35)' } : undefined}
                className={`relative flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-4 h-9 sm:h-14 lg:h-[62px] rounded-xl sm:rounded-2xl ${
                  currentProvinceObj?.badgeColor
                    ? 'text-white shadow-md'
                    : currentProvinceObj
                      ? `${currentTheme.gradientClass} ${currentTheme.borderClass} ${currentTheme.shadowClass}`
                      : 'bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] border-cyan-400/40 hover:border-cyan-300 shadow-md shadow-blue-950/20'
                } border transition-all duration-200 cursor-pointer group hover:scale-[1.02] active:scale-[0.98] min-w-0 max-w-[130px] min-[390px]:max-w-[160px] sm:max-w-none text-white select-none`}
                title="Cambiar Provincia o Región"
              >
                <div 
                  className="w-6 h-6 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 border border-white/20 bg-white/20 group-hover:bg-white/30 transition-colors shadow-2xs"
                >
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white drop-shadow-xs" />
                </div>
                <div className="flex flex-col text-left justify-center min-w-0 pr-0.5 sm:pr-1">
                  <span className="hidden sm:block text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-wider text-white/80 leading-none">
                    {activeCityObj ? currentProvinceObj?.name.toUpperCase() : (currentProvinceObj ? currentTheme.sublabel : 'UBICACIÓN')}
                  </span>
                  <span className="text-xs sm:text-sm lg:text-[15px] font-black text-white leading-tight truncate drop-shadow-xs">
                    {activeCityObj ? activeCityObj.name : (currentProvinceObj ? currentProvinceObj.name : (
                      selectedProvince === 'all' ? (
                        <>
                          <span className="sm:hidden">General</span>
                          <span className="hidden sm:inline">Portada General</span>
                        </>
                      ) : (
                        <>
                          <span className="sm:hidden">Provincia</span>
                          <span className="hidden sm:inline">Selecciona tu provincia</span>
                        </>
                      )
                    ))}
                  </span>
                </div>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-white/80 shrink-0 transition-transform duration-200 ${isProvinceDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProvinceDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in duration-100 divide-y divide-slate-100">
                  <div className="px-3.5 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Selecciona tu Provincia
                  </div>
                  <div className="py-1">
                    {/* Opción Portada General (Sin provincia específica) */}
                    <button
                      type="button"
                      onClick={() => handleProvinceSelect('all')}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 ${
                        !selectedProvince || selectedProvince === 'all'
                          ? 'text-slate-900 bg-slate-50 font-black'
                          : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs border border-white"
                          style={{ backgroundColor: '#00ADB5' }}
                        />
                        <span className="truncate">Portada General (Todas)</span>
                      </div>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white shadow-2xs ${
                          !selectedProvince || selectedProvince === 'all' ? 'ring-2 ring-white/60' : 'opacity-90'
                        }`}
                        style={{ backgroundColor: '#00ADB5' }}
                      >
                        Nacional
                      </span>
                    </button>

                    {activeProvinces.map((prov) => {
                      const theme = PROVINCE_THEMES[prov.id] || PROVINCE_THEMES['santa-fe'];
                      const isSelected = selectedProvince === prov.id || selectedProvince === prov.slug;
                      const color = prov.badgeColor || theme.accentHex;
                      return (
                        <button
                          key={prov.id}
                          type="button"
                          onClick={() => handleProvinceSelect(prov.id)}
                          className={`w-full text-left px-3.5 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                            isSelected
                              ? 'text-slate-900 bg-slate-50 font-black'
                              : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs border border-white"
                              style={{ backgroundColor: color }}
                            />
                            <span className="truncate">{prov.name}</span>
                          </div>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white shadow-2xs ${
                              isSelected ? 'ring-2 ring-white/60' : 'opacity-90'
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            {prov.isActive ? 'Activa' : 'Próximamente'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: Buscador Centrado */}
          <div ref={searchContainerRef} className="hidden lg:block flex-1 max-w-xl mx-auto relative z-30">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center h-10 w-full">
              <input
                type="text"
                placeholder="Buscá productos, comercios, categorías..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full h-full bg-white border border-slate-400/60 focus:border-[#0070F3] rounded-lg pl-3.5 pr-11 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-500 focus:outline-hidden transition-all shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-0.5 top-0.5 bottom-0.5 w-9 bg-[#0070F3] hover:bg-[#005bb5] text-white rounded-md flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Live Search Dropdown */}
            {isSearchFocused && liveSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[75vh] overflow-y-auto animate-in fade-in duration-150">
                {liveSearchResults.totalCount === 0 ? (
                  <div className="p-5 text-center text-slate-500 space-y-1">
                    <Search className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-slate-700">Sin coincidencias exactas</p>
                    <p className="text-[11px] text-slate-400">Presioná Enter para buscar &ldquo;{searchQuery}&rdquo; en el catálogo.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 text-slate-800">
                    {liveSearchResults.categories.length > 0 && (
                      <div className="p-2.5 bg-slate-50/60">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#0047BA] block mb-1 px-1">
                          Categorías
                        </span>
                        <div className="space-y-0.5">
                          {liveSearchResults.categories.map((c) => (
                            <Link
                              key={c.id}
                              href={`/catalogo?categoria=${c.id}`}
                              onClick={() => setIsSearchFocused(false)}
                              className="flex items-center justify-between p-1.5 rounded-lg hover:bg-blue-50 text-xs font-bold text-slate-700 transition-colors"
                            >
                              <span>{c.label}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {liveSearchResults.commerces.length > 0 && (
                      <div className="p-2.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1 px-1">
                          Comercios ({liveSearchResults.commerces.length})
                        </span>
                        <div className="space-y-1">
                          {liveSearchResults.commerces.map((c) => (
                            <Link
                              key={c.id}
                              href={`/comercio/${c.slug}`}
                              onClick={() => setIsSearchFocused(false)}
                              className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <div className="relative w-6 h-6 rounded-md overflow-hidden border border-slate-200 bg-white shrink-0">
                                  <img src={c.logoUrl} alt={c.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-xs font-bold text-slate-800">{c.name}</span>
                              </div>
                              <span className="text-[10px] text-slate-500">{c.cityName}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {liveSearchResults.products.length > 0 && (
                      <div className="p-2.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block mb-1 px-1">
                          Productos ({liveSearchResults.products.length})
                        </span>
                        <div className="space-y-1">
                          {liveSearchResults.products.map((p) => (
                            <Link
                              key={p.id}
                              href={`/producto/${p.slug}`}
                              onClick={() => setIsSearchFocused(false)}
                              className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <div className="relative w-6 h-6 rounded-md overflow-hidden border border-slate-200 bg-white shrink-0">
                                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-xs font-medium text-slate-800 truncate">{p.title}</span>
                              </div>
                              <span className="text-xs font-black text-emerald-600 shrink-0">
                                {p.price ? `$${p.price.toLocaleString('es-AR')}` : 'Consultar'}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Publicá tu negocio, Mi cuenta, Carrito / Mobile toggle */}
          <div className="flex items-center gap-1 min-[360px]:gap-2 sm:gap-4 shrink-0">
            {/* Mobile Search Icon */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-slate-700 hover:text-[#0070F3] transition-colors rounded-lg hover:bg-slate-200/80"
              aria-label="Buscar"
            >
              <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </button>

            {/* Publicá tu negocio (Visible a partir de md para no saturar mobile) */}
            <Link
              href="/planes"
              className="hidden md:flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900 bg-white/80 hover:bg-white border border-slate-300 hover:border-[#0047BA]/50 shadow-2xs hover:shadow-xs transition-all py-1.5 px-3 rounded-xl group cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#00ADB5] via-[#0047BA] to-[#7B2CBF] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-110 transition-transform">
                <Store className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="tracking-tight group-hover:text-[#0047BA] transition-colors">Publicá tu negocio</span>
            </Link>

            {/* Mi Cuenta / Iniciar sesión */}
            {!currentUser ? (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#0047BA] transition-colors p-1.5 sm:py-1.5 sm:px-2 rounded-lg hover:bg-slate-200/80"
                title="Mi Cuenta"
              >
                <User className="w-4 h-4 text-slate-700" />
                <span className="hidden sm:inline">Mi cuenta</span>
              </Link>
            ) : (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#0047BA] transition-colors p-1 sm:py-1 sm:px-2 rounded-lg hover:bg-slate-200/80"
                title="Mi Panel de Control"
              >
                {userCommerce?.logoUrl ? (
                  <div className="relative w-6 h-6 rounded-md overflow-hidden border border-slate-300 bg-white shrink-0">
                    <Image src={userCommerce.logoUrl} alt={userCommerce.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#00ADB5] to-[#0047BA] text-white flex items-center justify-center font-black text-xs shrink-0">
                    {userCommerce?.initial || 'M'}
                  </div>
                )}
                <span className="hidden sm:inline truncate max-w-[100px]">{userCommerce?.name || 'Mi Comercio'}</span>
              </Link>
            )}

            {/* Carrito / Bolsa */}
            <Link
              href="/catalogo"
              className="p-1.5 sm:p-2 text-slate-800 hover:text-[#0047BA] hover:bg-slate-200/80 rounded-lg transition-colors cursor-pointer"
              title="Catálogo & Pedidos"
            >
              <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-800" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-slate-800 hover:text-[#0047BA] hover:bg-slate-200/80 rounded-lg transition-colors"
              aria-label="Abrir Menú"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Search Expandable */}
      {isMobileSearchOpen && (
        <div className="lg:hidden px-4 py-2.5 bg-[#e2e8f0] border-b border-slate-300 animate-in slide-in-from-top-2 duration-150">
          <form 
            onSubmit={(e) => { 
              handleSearchSubmit(e); 
              setIsMobileSearchOpen(false); 
            }} 
            className="relative flex items-center h-10"
          >
            <input
              type="text"
              placeholder="Buscá productos, comercios, categorías..."
              value={searchQuery}
              autoFocus
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full bg-white border border-slate-300 rounded-lg pl-3 pr-10 text-xs font-medium text-slate-800 placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-[#0070F3]"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 w-8 bg-[#0070F3] text-white rounded-md flex items-center justify-center"
              aria-label="Buscar"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* 2. SUB-NAVBAR CON DEGRADÉ OFICIAL ON+ (Inicio, Categorías, Comercios & Pymes, Turismo, Vender ON+, Ayuda, Novedades, Oportunidades) */}
      <nav className="bg-gradient-to-r from-[#0047BA] via-[#6C1CD1] to-[#E5007D] text-white shadow-xs relative z-40 overflow-visible">
        <div className="max-w-[1480px] mx-auto px-2 sm:px-4 lg:px-8 relative overflow-visible">
          <div 
            ref={subnavScrollRef}
            onScroll={checkSubnavScroll}
            className="flex items-center justify-between overflow-x-auto lg:overflow-visible scrollbar-none h-10 sm:h-11 gap-1 sm:gap-2 pr-8 lg:pr-0"
          >
            {subNavLinks.map((item) => {
              const isActive = pathname === item.href;

              if (item.isCategory) {
                return (
                  <div
                    key={item.name}
                    className="relative shrink-0"
                    onMouseEnter={handleCategoriesMouseEnter}
                    onMouseLeave={handleCategoriesMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-black tracking-wider transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'text-white/90 hover:text-white hover:bg-white/15'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isCategoriesHovered ? 'rotate-180' : ''}`} />
                    </Link>

                    {/* Desplegable de Categorías */}
                    {isCategoriesHovered && (
                      <div
                        className="absolute top-full left-0 mt-1 w-[480px] bg-white border border-slate-200 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150 grid grid-cols-2 gap-1.5 text-slate-800 text-left"
                        onMouseEnter={handleCategoriesMouseEnter}
                        onMouseLeave={handleCategoriesMouseLeave}
                      >
                        <div className="col-span-2 px-2 py-1 flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#0047BA] flex items-center gap-1.5">
                            <LayoutGrid className="w-3.5 h-3.5" />
                            Categorías del Catálogo ON+
                          </span>
                          <Link
                            href="/catalogo"
                            onClick={() => setIsCategoriesHovered(false)}
                            className="text-[11px] font-bold text-[#0047BA] hover:underline flex items-center gap-1"
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
                              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                            >
                              <div className={`w-7 h-7 rounded-lg ${cat.iconBg} flex items-center justify-center shrink-0 border border-slate-200`}>
                                <IconComp className={`w-3.5 h-3.5 ${cat.iconColor}`} />
                              </div>
                              <div className="truncate">
                                <span className="text-xs font-bold text-slate-800 group-hover:text-[#0047BA] block truncate transition-colors">
                                  {cat.label}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-black tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'text-white/90 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Scroll Indicator (indicio visible de que hay más opciones al scrollear a la derecha) */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => {
                if (subnavScrollRef.current) {
                  subnavScrollRef.current.scrollBy({ left: 160, behavior: 'smooth' });
                }
              }}
              className="lg:hidden absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#E5007D] via-[#E5007D]/90 to-transparent flex items-center justify-end pr-1.5 z-20 pointer-events-auto cursor-pointer"
              aria-label="Ver más opciones"
            >
              <div className="flex items-center text-white/95 animate-pulse">
                <ChevronRight className="w-4 h-4 text-white drop-shadow-sm" />
              </div>
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#e2e8f0] border-b border-slate-300 px-4 pt-3 pb-5 space-y-3 animate-in fade-in duration-200 text-slate-800">
          <div className="flex flex-col gap-1.5 border-b border-slate-300/80 pb-3">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-600">Provincia</label>
            <div className="flex flex-wrap gap-2">
              {activeProvinces.map((prov) => {
                const theme = PROVINCE_THEMES[prov.id] || PROVINCE_THEMES['santa-fe'];
                const isSelected = selectedProvince === prov.id || selectedProvince === prov.slug;
                const color = prov.badgeColor || theme.accentHex;
                return (
                  <button
                    key={prov.id}
                    onClick={() => handleProvinceSelect(prov.id)}
                    style={isSelected && prov.badgeColor ? { backgroundColor: prov.badgeColor, borderColor: 'transparent' } : undefined}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? `${prov.badgeColor ? '' : theme.gradientClass} text-white border-transparent shadow-xs`
                        : 'border-slate-300 text-slate-700 bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/60"
                      style={{ backgroundColor: color }}
                    />
                    <span>{prov.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {subNavLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-200/80 hover:text-[#0047BA]"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-300/80 flex gap-2">
            <Link
              href="/planes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 bg-gradient-to-r from-[#0047BA] via-[#6C1CD1] to-[#E5007D] text-white text-xs font-black rounded-xl shadow-sm flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4 text-white" />
              <span>Publicá tu negocio</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
