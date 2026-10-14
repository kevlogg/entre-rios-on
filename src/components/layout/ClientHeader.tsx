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
import { PROVINCES, getCitiesByProvince, getProvinceBySlug } from '@/lib/constants/locations';
import { useActiveProvinces } from '@/lib/services/province-store';
import { CATEGORIES_LIST } from '@/lib/constants/categories';
import { getFeaturedProducts, getAllCommerces } from '@/lib/dal/portal';
import { Product, Commerce } from '@/types';

interface ClientHeaderProps {
  withBackground?: boolean;
}

export function ClientHeader({ withBackground = false }: ClientHeaderProps = {}) {
  const pathname = usePathname();
  const router = useRouter();

  const [selectedProvince, setSelectedProvince] = useState<string>('santa-fe');
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

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        console.warn('Error verificando autenticación en ClientHeader:', err);
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
      }
    }
  }, [pathname]);

  const currentProvinceObj = activeProvinces.find((p) => p.id === selectedProvince || p.slug === selectedProvince) || activeProvinces[0] || { id: 'santa-fe', name: 'Santa Fe', slug: 'santa-fe' };

  const handleProvinceSelect = (provId: string) => {
    setSelectedProvince(provId);
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

  // Enlaces de la barra superior: Inicio, Categorías, Comercios & Pymes, Turismo, Vender ON+, Ayuda, Novedades, Oportunidades
  const subNavLinks = [
    { name: 'INICIO', href: '/', isCategory: false },
    { name: 'CATEGORÍAS', href: '/catalogo', isCategory: true },
    { name: 'COMERCIOS & PYMES', href: '/comercios', isCategory: false },
    { name: 'TURISMO', href: '/turismo', isCategory: false },
    { name: 'VENDER ON+', href: '/vender-on', isCategory: false },
    { name: 'AYUDA', href: '/ayuda', isCategory: false },
    { name: 'NOVEDADES', href: '/novedades', isCategory: false },
    { name: 'OPORTUNIDADES', href: '/oportunidades', isCategory: false },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white">
      {/* 1. TOP BAR BLANCA CON LOGO, SELECTOR DE PROVINCIA, BUSCADOR CENTRADO Y ACCESOS */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1480px] mx-auto px-3 min-[360px]:px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Left: Logo ON+ Portal Comercial + Province Selector */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="relative w-[76px] h-11 sm:w-[96px] sm:h-14 lg:w-[116px] lg:h-[67px] flex items-center">
                <Image
                  src="/logo1.png"
                  alt="ON+ PORTAL COMERCIAL"
                  fill
                  priority
                  className="object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>

            {/* Selector de Provincia */}
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={() => setIsProvinceDropdownOpen(!isProvinceDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                title="Cambiar Provincia"
              >
                <MapPin className="w-3.5 h-3.5 text-[#0047BA] shrink-0" />
                <span className="truncate max-w-[110px]">{currentProvinceObj.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isProvinceDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in duration-100">
                  <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Provincias Disponibles
                  </div>
                  {activeProvinces.map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => handleProvinceSelect(prov.id)}
                      className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        selectedProvince === prov.id || selectedProvince === prov.slug
                          ? 'text-[#0047BA] bg-blue-50/60 font-black'
                          : 'text-slate-700'
                      }`}
                    >
                      <span>{prov.name}</span>
                      {(selectedProvince === prov.id || selectedProvince === prov.slug) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0047BA]" />
                      )}
                    </button>
                  ))}
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
                className="w-full h-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#0070F3] rounded-lg pl-3.5 pr-11 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all shadow-2xs"
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
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Mobile Search Icon */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-[#0070F3] transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Publicá tu negocio */}
            <Link
              href="/planes"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0047BA] transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-100"
            >
              <Store className="w-4 h-4 text-slate-600" />
              <span>Publicá tu negocio</span>
            </Link>

            {/* Mi Cuenta / Iniciar sesión */}
            {!currentUser ? (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0047BA] transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-100"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">Mi cuenta</span>
              </Link>
            ) : (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#0047BA] transition-colors py-1 px-2 rounded-lg hover:bg-slate-100"
              >
                {userCommerce?.logoUrl ? (
                  <div className="relative w-6 h-6 rounded-md overflow-hidden border border-slate-200 bg-white shrink-0">
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
              className="p-2 text-slate-700 hover:text-[#0047BA] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Catálogo & Pedidos"
            >
              <ShoppingBag className="w-5 h-5 text-slate-700" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-[#0047BA] transition-colors"
              aria-label="Abrir Menú"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Search Expandable */}
      {isMobileSearchOpen && (
        <div className="lg:hidden px-4 py-2.5 bg-white border-b border-slate-200 animate-in slide-in-from-top-2 duration-150">
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
              className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#0070F3]"
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
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3 animate-in fade-in duration-200 text-slate-800">
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-3">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Provincia</label>
            <div className="flex gap-2">
              {activeProvinces.map((prov) => (
                <button
                  key={prov.id}
                  onClick={() => handleProvinceSelect(prov.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                    selectedProvince === prov.id ? 'border-[#0047BA] bg-blue-50 text-[#0047BA]' : 'border-slate-200 text-slate-700'
                  }`}
                >
                  {prov.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {subNavLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#0047BA]"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <Link
              href="/planes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 text-center py-2 bg-[#0047BA] text-white text-xs font-bold rounded-lg"
            >
              Publicá tu negocio
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
