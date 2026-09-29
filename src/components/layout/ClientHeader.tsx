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
  Sparkles,
  Store,
  MapPin,
  Building2,
  ShoppingBag,
  Briefcase,
  Compass,
  Gift,
  Newspaper,
  Globe,
  Tag,
  ArrowRight
} from 'lucide-react';
import { trackSearchQuery, trackCitySelect } from '@/lib/analytics/events';
import { PROVINCES, getCitiesByProvince, getProvinceBySlug, getCityBySlug } from '@/lib/constants/locations';
import { CATEGORIES_LIST } from '@/lib/constants/categories';
import { getFeaturedProducts, getAllCommerces } from '@/lib/dal/portal';
import { Product, Commerce } from '@/types';

const SITE_PAGES = [
  { name: 'Catálogo & Ofertas', href: '/catalogo', category: 'Sección del Sitio', icon: ShoppingBag, description: 'Explorá todos los productos y ofertas regionales', keywords: ['catalogo', 'oferta', 'producto', 'descuento', 'compras', 'precio', 'articulo', 'tienda'] },
  { name: 'Comercios Adheridos', href: '/comercios', category: 'Sección del Sitio', icon: Store, description: 'Directorio unificado de locales y empresas', keywords: ['comercio', 'negocio', 'tienda', 'local', 'adherido', 'directorio', 'empresa'] },
  { name: 'Bolsa de Empleos', href: '/empleos', category: 'Sección del Sitio', icon: Briefcase, description: 'Ofertas laborales y perfiles de candidatos', keywords: ['empleo', 'trabajo', 'busqueda', 'laboral', 'puesto', 'candidato', 'cv', 'postularme', 'contratar'] },
  { name: 'Turismo, Termas & Spa', href: '/turismo', category: 'Sección del Sitio', icon: Compass, description: 'Termas, alojamientos y paseos turísticos', keywords: ['turismo', 'termas', 'hotel', 'posada', 'spa', 'paseo', 'viaje', 'vacaciones', 'gastronomia', 'alojamiento'] },
  { name: 'Sorteos ON MÁS', href: '/sorteos', category: 'Sección del Sitio', icon: Gift, description: 'Participá en sorteos mensuales gratuitos', keywords: ['sorteo', 'premio', 'ganador', 'participar', 'concurso', 'gratuitos'] },
  { name: 'Comunidad & Noticias', href: '/comunidad', category: 'Sección del Sitio', icon: Newspaper, description: 'Eventos comunitarios, agenda y noticias', keywords: ['comunidad', 'noticia', 'evento', 'festival', 'maraton', 'nota', 'agenda', 'cultura'] },
  { name: 'Mi Sitio Web Propio', href: '/mi-sitio-web', category: 'Sección del Sitio', icon: Globe, description: 'Solicitá tu sitio web para tu comercio', keywords: ['sitio web', 'pagina web', 'dominio', 'crear web', 'mi sitio', 'diseño web'] },
];

export function ClientHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [selectedProvince, setSelectedProvince] = useState<string>('santa-fe');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  // User & Commerce Auth State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userCommerce, setUserCommerce] = useState<{ name: string; logoUrl?: string; initial: string } | null>(null);

  // Search Data Index
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCommerces, setAllCommerces] = useState<Commerce[]>([]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

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
        if (parts.length > 1) {
          const cityMatch = getCityBySlug(parts[1]);
          if (cityMatch) {
            setSelectedCity(cityMatch.id);
          }
        }
      }
    }
  }, [pathname]);

  const availableCities = getCitiesByProvince(selectedProvince);
  const currentProvinceObj = PROVINCES.find((p) => p.id === selectedProvince) || PROVINCES[0];
  const currentCityObj = availableCities.find((c) => c.id === selectedCity) || { id: 'all', name: 'Todas las ciudades', slug: '' };

  const getGeoUrl = (sectionSlug: string) => {
    const provSlug = currentProvinceObj.slug || 'santa-fe';
    const citySlug = currentCityObj.id !== 'all' ? (currentCityObj.slug || currentCityObj.id) : null;

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
    setSelectedCity('all');
    setIsProvinceDropdownOpen(false);

    const targetProv = PROVINCES.find((p) => p.id === provId);
    if (targetProv && targetProv.id !== 'all') {
      router.push(`/${targetProv.slug}`);
    } else {
      router.push('/');
    }
  };

  const handleCitySelect = (cityId: string, cityName: string) => {
    setSelectedCity(cityId);
    setIsCityDropdownOpen(false);
    trackCitySelect(cityId, cityName);

    const targetCity = availableCities.find((c) => c.id === cityId);
    if (targetCity && cityId !== 'all') {
      router.push(`/${currentProvinceObj.slug}/${targetCity.slug}`);
    } else {
      router.push(`/${currentProvinceObj.slug}`);
    }
  };

  // Dynamic Live Search Results
  const liveSearchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return null;

    // 1. Pages/Sections match
    const pages = SITE_PAGES.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.keywords.some(k => k.includes(q) || q.includes(k))
    );

    // 2. Categories match
    const categories = CATEGORIES_LIST.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    ).slice(0, 3);

    // 3. Commerces match
    const commerces = allCommerces.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.cityName.toLowerCase().includes(q)
    ).slice(0, 4);

    // 4. Products match
    const products = allProducts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.commerceName.toLowerCase().includes(q) ||
      p.cityName.toLowerCase().includes(q)
    ).slice(0, 4);

    const totalCount = pages.length + categories.length + commerces.length + products.length;

    return { pages, categories, commerces, products, totalCount };
  }, [searchQuery, allCommerces, allProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;

    trackSearchQuery(q);
    setIsSearchFocused(false);

    // Direct page mapping check
    const qLower = q.toLowerCase();
    const pageMatch = SITE_PAGES.find(p => p.keywords.some(k => k === qLower));
    
    if (pageMatch) {
      router.push(pageMatch.href);
      return;
    }

    // Default: Redirect to Catalog page with q param
    router.push(`/catalogo?q=${encodeURIComponent(q)}`);
  };

  const navLinks: { name: string; href: string; slug: string }[] = [
    { name: 'Inicio', href: getGeoUrl(''), slug: '' },
    { name: 'Comercios Adheridos', href: getGeoUrl('comercios'), slug: 'comercios' },
    { name: 'Catálogo & Ofertas', href: getGeoUrl('catalogo'), slug: 'catalogo' },
    { name: 'Mi Sitio Web', href: '/mi-sitio-web', slug: 'mi-sitio-web' },
    { name: 'Sorteos ON MÁS', href: getGeoUrl('sorteos'), slug: 'sorteos' },
    { name: 'Empleos', href: '/empleos', slug: 'empleos' },
    { name: 'Comunidad', href: getGeoUrl('comunidad'), slug: 'comunidad' },
    { name: 'Turismo', href: getGeoUrl('turismo'), slug: 'turismo' },
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
                alt="ON MÁS - Portal Comercial & Regional"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Location Selectors */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-2xs">
            
            {/* Selector de Provincia */}
            <div className="relative">
              <button
                onClick={() => setIsProvinceDropdownOpen(!isProvinceDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-white transition-all cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" />
                <span className="truncate max-w-[100px]">{currentProvinceObj.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isProvinceDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in duration-100">
                  {PROVINCES.map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => handleProvinceSelect(prov.id)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
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

            <span className="text-slate-300 font-light">|</span>

            {/* Selector de Ciudad */}
            <div className="relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-white transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[#0047BA]" />
                <span className="truncate max-w-[130px]">{currentCityObj.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-52 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in duration-100 scrollbar-none">
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

          {/* Buscador Global Interactivo (Desktop) */}
          <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-md relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Buscá productos, comercios, categorías, secciones..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
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

            {/* Desplegable de Resultados de Búsqueda en Vivo */}
            {isSearchFocused && liveSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto animate-in fade-in duration-150">
                {liveSearchResults.totalCount === 0 ? (
                  <div className="p-6 text-center text-slate-500 space-y-2">
                    <Search className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">No encontramos coincidencias exactas</p>
                    <p className="text-[11px] text-slate-400">Presioná Enter para buscar &ldquo;{searchQuery}&rdquo; en el catálogo general.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    
                    {/* Secciones / Páginas */}
                    {liveSearchResults.pages.length > 0 && (
                      <div className="p-3 bg-slate-50/60">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#0047BA] block mb-2">
                          Secciones del Sitio
                        </span>
                        <div className="space-y-1">
                          {liveSearchResults.pages.map((p) => {
                            const IconComponent = p.icon;
                            return (
                              <Link
                                key={p.href}
                                href={p.href}
                                onClick={() => setIsSearchFocused(false)}
                                className="flex items-center justify-between p-2 rounded-xl hover:bg-white transition-colors group cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-cyan-100 text-[#0047BA] flex items-center justify-center shrink-0">
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-extrabold text-slate-900 group-hover:text-[#0047BA] block">
                                      {p.name}
                                    </span>
                                    <span className="text-[10px] text-slate-500">{p.description}</span>
                                  </div>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00ADB5] group-hover:translate-x-0.5 transition-all" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Comercios */}
                    {liveSearchResults.commerces.length > 0 && (
                      <div className="p-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#00ADB5] block mb-2">
                          Comercios & Locales ({liveSearchResults.commerces.length})
                        </span>
                        <div className="space-y-1">
                          {liveSearchResults.commerces.map((c) => (
                            <Link
                              key={c.id}
                              href={`/comercio/${c.slug}`}
                              onClick={() => setIsSearchFocused(false)}
                              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                  <img src={c.logoUrl} alt={c.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <span className="text-xs font-extrabold text-slate-900 group-hover:text-[#0047BA] block">
                                    {c.name}
                                  </span>
                                  <span className="text-[10px] text-slate-500">{c.category} • {c.cityName}</span>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-[#0047BA] bg-cyan-50 px-2 py-0.5 rounded-md">
                                Ver Perfil
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Productos */}
                    {liveSearchResults.products.length > 0 && (
                      <div className="p-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-2">
                          Productos & Ofertas ({liveSearchResults.products.length})
                        </span>
                        <div className="space-y-1">
                          {liveSearchResults.products.map((p) => (
                            <Link
                              key={p.id}
                              href={`/producto/${p.slug}`}
                              onClick={() => setIsSearchFocused(false)}
                              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="truncate max-w-[200px] sm:max-w-[260px]">
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#0047BA] block truncate">
                                    {p.title}
                                  </span>
                                  <span className="text-[10px] text-slate-500">{p.commerceName}</span>
                                </div>
                              </div>
                              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                                {p.price ? `$${p.price.toLocaleString('es-AR')}` : 'Consultar'}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Ver Todos en Catálogo */}
                    <Link
                      href={`/catalogo?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setIsSearchFocused(false)}
                      className="block p-3 text-center bg-cyan-50 hover:bg-cyan-100 text-[#0047BA] text-xs font-black transition-colors"
                    >
                      Ver todos los resultados para &ldquo;{searchQuery}&rdquo; en el Catálogo →
                    </Link>

                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {!currentUser ? (
              <Link 
                href="/login" 
                className="flex items-center gap-2 bg-slate-50 hover:bg-cyan-50/80 text-[#0047BA] hover:text-[#00ADB5] border border-slate-200 hover:border-[#00ADB5] px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all shadow-2xs cursor-pointer shrink-0"
                title="Ingresar o Registrarse"
              >
                <User className="w-4 h-4 text-[#00ADB5]" />
                <span>Ingresar / Crear cuenta</span>
              </Link>
            ) : (
              <Link 
                href="/admin" 
                className="flex items-center gap-2.5 bg-slate-50 hover:bg-cyan-50/80 border border-slate-200 hover:border-[#00ADB5] p-1 pr-3 rounded-2xl transition-all shadow-2xs cursor-pointer group shrink-0"
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
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[11px] font-black text-slate-900 group-hover:text-[#0047BA] leading-tight truncate max-w-[120px]">
                    {userCommerce?.name || 'Mi Comercio'}
                  </span>
                  <span className="text-[9px] font-extrabold text-[#00ADB5] uppercase tracking-wider">
                    Mi Negocio
                  </span>
                </div>
              </Link>
            )}

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

      {/* Secondary Horizontal Navigation Bar */}
      <nav className="hidden md:block border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-start gap-1 sm:gap-2 overflow-x-auto text-xs font-bold text-slate-700 scrollbar-none py-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.slug !== '' && pathname?.includes(`/${link.slug}`));
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
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
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-4 pb-6 space-y-4 animate-in fade-in duration-200">
          
          {/* User Account Mobile CTA */}
          {!currentUser ? (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-xs font-black text-[#0047BA] shadow-2xs"
            >
              <User className="w-4 h-4 text-[#00ADB5]" />
              <span>Ingresar / Crear cuenta</span>
            </Link>
          ) : (
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-cyan-50/60 border border-cyan-200 text-xs font-black text-slate-900 shadow-2xs"
            >
              {userCommerce?.logoUrl ? (
                <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-slate-300 bg-white shrink-0">
                  <Image src={userCommerce.logoUrl} alt={userCommerce.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0047BA] to-[#00ADB5] text-white flex items-center justify-center font-black text-sm shrink-0">
                  {userCommerce?.initial || 'M'}
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="font-black text-slate-900 text-xs">{userCommerce?.name}</span>
                <span className="text-[10px] text-[#00ADB5] font-bold">Ir a Mi Negocio (Panel)</span>
              </div>
            </Link>
          )}
          
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

          {/* Mobile Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Buscá productos, comercios, ofertas..."
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
