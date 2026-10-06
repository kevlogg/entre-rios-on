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
  ArrowRight,
  Clock,
  LayoutGrid
} from 'lucide-react';
import { trackSearchQuery, trackCitySelect } from '@/lib/analytics/events';
import { PROVINCES, getCitiesByProvince, getProvinceBySlug, getCityBySlug } from '@/lib/constants/locations';
import { useActiveProvinces } from '@/lib/services/province-store';
import { CATEGORIES_LIST } from '@/lib/constants/categories';
import { getFeaturedProducts, getAllCommerces } from '@/lib/dal/portal';
import { Product, Commerce } from '@/types';

const SITE_PAGES = [
  { name: 'Categorías del Catálogo', href: '/catalogo', category: 'Sección del Sitio', icon: ShoppingBag, description: 'Explorá todas las categorías y productos regionales', keywords: ['catalogo', 'categoria', 'oferta', 'producto', 'descuento', 'compras', 'precio', 'articulo', 'tienda'] },
  { name: 'Comercios Adheridos', href: '/comercios', category: 'Sección del Sitio', icon: Store, description: 'Directorio unificado de locales y empresas', keywords: ['comercio', 'negocio', 'tienda', 'local', 'adherido', 'directorio', 'empresa'] },
  { name: 'Supermercado', href: '/supermercado', category: 'Sección del Sitio', icon: ShoppingBag, description: 'Catálogo y ofertas de supermercados y alimentos', keywords: ['supermercado', 'super', 'alimentos', 'comida', 'mercado', 'ofertas'] },
  { name: 'Turismo, Termas & Spa', href: '/turismo', category: 'Sección del Sitio', icon: Compass, description: 'Termas, alojamientos y paseos turísticos', keywords: ['turismo', 'termas', 'hotel', 'posada', 'spa', 'paseo', 'viaje', 'vacaciones', 'gastronomia', 'alojamiento'] },
  { name: 'Comunidad & Noticias', href: '/comunidad', category: 'Sección del Sitio', icon: Newspaper, description: 'Eventos comunitarios, agenda y noticias', keywords: ['comunidad', 'noticia', 'evento', 'festival', 'maraton', 'nota', 'agenda', 'cultura'] },
  { name: 'Novedades', href: '/novedades', category: 'Sección del Sitio', icon: Newspaper, description: 'Últimas novedades y comunicados del portal', keywords: ['novedades', 'novedad', 'noticias', 'anuncios', 'comunicados'] },
  { name: 'Oportunidades', href: '/oportunidades', category: 'Sección del Sitio', icon: Tag, description: 'Oportunidades comerciales y beneficios', keywords: ['oportunidades', 'oportunidad', 'descuentos', 'beneficios', 'ofertas'] },
  { name: 'Comercio Online', href: '/comercio-online', category: 'Sección del Sitio', icon: Store, description: 'Plataforma e-commerce y tiendas digitales', keywords: ['comercio online', 'ecommerce', 'tienda online', 'vender', 'comprar'] },
  { name: 'Planes para Comercios', href: '/planes', category: 'Sección del Sitio', icon: Tag, description: 'Planes y membresías para publicar tu negocio', keywords: ['planes', 'precios', 'suscripcion', 'membresia', 'gratis', 'plan'] },
  { name: 'Ayuda & Soporte', href: '/ayuda', category: 'Sección del Sitio', icon: Compass, description: 'Preguntas frecuentes y asistencia técnica', keywords: ['ayuda', 'soporte', 'contacto', 'faq', 'preguntas'] },
  { name: 'Sorteos ON MÁS', href: '/sorteos', category: 'Sección del Sitio', icon: Gift, description: 'Participá en sorteos mensuales gratuitos', keywords: ['sorteo', 'premio', 'ganador', 'participar', 'concurso', 'gratuitos'] },
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
  const currentProvinceObj = activeProvinces.find((p) => p.id === selectedProvince || p.slug === selectedProvince) || activeProvinces[0] || { id: 'santa-fe', name: 'Santa Fe', slug: 'santa-fe' };
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

    const targetProv = activeProvinces.find((p) => p.id === provId || p.slug === provId);
    if (targetProv && targetProv.slug) {
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
    { name: 'Supermercado', href: getGeoUrl('supermercado'), slug: 'supermercado' },
    { name: 'Turismo', href: getGeoUrl('turismo'), slug: 'turismo' },
    { name: 'Comunidad', href: getGeoUrl('comunidad'), slug: 'comunidad' },
    { name: 'Novedades', href: '/novedades', slug: 'novedades' },
    { name: 'Oportunidades', href: '/oportunidades', slug: 'oportunidades' },
    { name: 'Comercio Online', href: '/comercio-online', slug: 'comercio-online' },
    { name: 'Planes', href: '/planes', slug: 'planes' },
    { name: 'Ayuda', href: '/ayuda', slug: 'ayuda' },
    { name: 'Sorteos ON MÁS', href: getGeoUrl('sorteos'), slug: 'sorteos' },
  ];

  return (
    <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 shadow-lg">
      {/* Top Header Main Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 relative z-30">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Oficial en Card de Fondo Blanco Brillante */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="flex flex-col items-center bg-white/95 hover:bg-white backdrop-blur-md border border-white/50 px-4 py-1.5 rounded-2xl shadow-xl transition-all group">
              <div className="relative w-36 h-9 sm:w-44 sm:h-10">
                <Image
                  src="/logo.png"
                  alt="ON MÁS - Portal Comercial & Regional"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#0047BA] group-hover:text-[#00ADB5] transition-colors -mt-0.5">
                PORTAL
              </span>
            </div>
          </Link>

          {/* Location Selectors - LARGER SIZE */}
          <div className="hidden lg:flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/35 rounded-2xl p-1.5 shadow-lg relative z-30">
            
            {/* Selector de Provincia */}
            <div className="relative">
              <button
                onClick={() => setIsProvinceDropdownOpen(!isProvinceDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black text-white hover:bg-white/25 transition-all cursor-pointer"
              >
                <MapPin className="w-4.5 h-4.5 text-cyan-300 shrink-0" />
                <span className="truncate max-w-[160px]">{currentProvinceObj.name}</span>
                <ChevronDown className="w-4 h-4 text-cyan-200" />
              </button>

              {isProvinceDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-60 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl py-2.5 z-50 animate-in fade-in duration-100 space-y-1">
                  <div className="px-4 py-1 text-[11px] font-black text-cyan-300 uppercase tracking-wider">
                    Provincias Activas
                  </div>
                  {activeProvinces.map((prov) => (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => handleProvinceSelect(prov.id)}
                      className={`w-full text-left px-4 py-2 text-xs font-bold flex items-center justify-between hover:bg-white/10 transition-colors ${
                        selectedProvince === prov.id || selectedProvince === prov.slug
                          ? 'text-cyan-300 bg-white/10 font-black'
                          : 'text-slate-200'
                      }`}
                    >
                      <span>{prov.name}</span>
                      {(selectedProvince === prov.id || selectedProvince === prov.slug) && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-white/40 font-light">|</span>

            {/* Selector de Ciudad */}
            <div className="relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black text-white hover:bg-white/25 transition-all cursor-pointer"
              >
                <Building2 className="w-4.5 h-4.5 text-cyan-300 shrink-0" />
                <span className="truncate max-w-[180px]">{currentCityObj.name}</span>
                <ChevronDown className="w-4 h-4 text-cyan-200" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-60 max-h-64 overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in duration-100 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => handleCitySelect('all', 'Todas las ciudades')}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-colors ${
                      selectedCity === 'all' ? 'font-black text-cyan-300 bg-white/10' : 'text-slate-200'
                    }`}
                  >
                    <span>Todas las ciudades</span>
                    {selectedCity === 'all' && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </button>
                  {availableCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      onClick={() => handleCitySelect(city.id, city.name)}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-white/10 transition-colors ${
                        selectedCity === city.id ? 'font-black text-cyan-300 bg-white/10' : 'text-slate-200'
                      }`}
                    >
                      <span>{city.name}</span>
                      {selectedCity === city.id && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Buscador Global Interactivo (Desktop) - LARGER SIZE */}
          <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-xl relative z-30">
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
                className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-14 py-2.5 sm:py-3 text-sm font-extrabold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#00ADB5] focus:bg-white transition-all shadow-lg"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white font-black px-4 rounded-lg flex items-center justify-center transition-all shadow-md cursor-pointer"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </form>

            {/* Desplegable de Resultados de Búsqueda en Vivo */}
            {isSearchFocused && liveSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[80vh] overflow-y-auto animate-in fade-in duration-150 text-white">
                {liveSearchResults.totalCount === 0 ? (
                  <div className="p-6 text-center text-slate-300 space-y-2">
                    <Search className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-100">No encontramos coincidencias exactas</p>
                    <p className="text-[11px] text-slate-400">Presioná Enter para buscar &ldquo;{searchQuery}&rdquo; en el catálogo general.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    
                    {/* Secciones / Páginas */}
                    {liveSearchResults.pages.length > 0 && (
                      <div className="p-3 bg-white/5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 block mb-2">
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
                                className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0">
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-extrabold text-white group-hover:text-cyan-300 block">
                                      {p.name}
                                    </span>
                                    <span className="text-[10px] text-slate-300">{p.description}</span>
                                  </div>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Comercios */}
                    {liveSearchResults.commerces.length > 0 && (
                      <div className="p-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 block mb-2">
                          Comercios & Locales ({liveSearchResults.commerces.length})
                        </span>
                        <div className="space-y-1">
                          {liveSearchResults.commerces.map((c) => (
                            <Link
                              key={c.id}
                              href={`/comercio/${c.slug}`}
                              onClick={() => setIsSearchFocused(false)}
                              className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-white shrink-0">
                                  <img src={c.logoUrl} alt={c.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <span className="text-xs font-extrabold text-white group-hover:text-cyan-300 block">
                                    {c.name}
                                  </span>
                                  <span className="text-[10px] text-slate-300">{c.category} • {c.cityName}</span>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-cyan-300 bg-white/10 px-2 py-0.5 rounded-md">
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
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-2">
                          Productos & Ofertas ({liveSearchResults.products.length})
                        </span>
                        <div className="space-y-1">
                          {liveSearchResults.products.map((p) => (
                            <Link
                              key={p.id}
                              href={`/producto/${p.slug}`}
                              onClick={() => setIsSearchFocused(false)}
                              className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-white shrink-0">
                                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="truncate max-w-[200px] sm:max-w-[260px]">
                                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 block truncate">
                                    {p.title}
                                  </span>
                                  <span className="text-[10px] text-slate-300">{p.commerceName}</span>
                                </div>
                              </div>
                              <span className="text-xs font-black text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md shrink-0 border border-emerald-500/30">
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
                      className="block p-3 text-center bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 text-xs font-black transition-colors"
                    >
                      Ver todos los resultados para &ldquo;{searchQuery}&rdquo; en el Catálogo →
                    </Link>

                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3 sm:gap-4 relative z-30">
            {!currentUser ? (
              <Link 
                href="/login" 
                className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white hover:text-cyan-200 border border-white/30 px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all shadow-md cursor-pointer shrink-0 backdrop-blur-md"
                title="Ingresar o Registrarse"
              >
                <User className="w-4 h-4 text-cyan-200" />
                <span>Ingresar / Crear cuenta</span>
              </Link>
            ) : (
              <Link 
                href="/admin" 
                className="flex items-center gap-2.5 bg-white/15 hover:bg-white/25 border border-white/30 p-1 pr-3 rounded-2xl transition-all shadow-md cursor-pointer group shrink-0 backdrop-blur-md"
                title={`Panel de Administración: ${userCommerce?.name || 'Mi Negocio'}`}
              >
                {userCommerce?.logoUrl ? (
                  <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-white/30 group-hover:border-cyan-300 bg-white shrink-0 shadow-2xs">
                    <Image
                      src={userCommerce.logoUrl}
                      alt={userCommerce.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-300 to-blue-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md shrink-0">
                    {userCommerce?.initial || 'M'}
                  </div>
                )}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[11px] font-black text-white group-hover:text-cyan-200 leading-tight truncate max-w-[120px]">
                    {userCommerce?.name || 'Mi Comercio'}
                  </span>
                  <span className="text-[9px] font-extrabold text-cyan-200 uppercase tracking-wider">
                    Mi Negocio
                  </span>
                </div>
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-cyan-200 focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Secondary Horizontal Navigation Bar - Floating Individual Badges */}
      <nav className="hidden md:block py-2.5 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-start gap-2 overflow-x-auto text-xs font-bold scrollbar-none py-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.slug !== '' && pathname?.includes(`/${link.slug}`));

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
                      className={`px-4 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-950 font-black shadow-lg border border-white/60 scale-[1.04]'
                          : 'bg-white/15 hover:bg-white/30 border border-white/25 text-white font-extrabold backdrop-blur-md shadow-xs hover:scale-[1.02] hover:shadow-md'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoriesHovered ? 'rotate-180 text-cyan-300' : 'text-white/70'}`} />
                    </Link>

                    {/* Desplegable de Categorías al pasar el mouse */}
                    {isCategoriesHovered && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-[540px] bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-2 gap-2 text-white"
                        onMouseEnter={handleCategoriesMouseEnter}
                        onMouseLeave={handleCategoriesMouseLeave}
                      >
                        <div className="col-span-2 px-2 py-1 flex items-center justify-between border-b border-white/10 pb-2 mb-1">
                          <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                            <LayoutGrid className="w-3.5 h-3.5 text-cyan-300" />
                            Categorías del Catálogo ON MÁS
                          </span>
                          <Link
                            href="/catalogo"
                            onClick={() => setIsCategoriesHovered(false)}
                            className="text-[11px] font-bold text-cyan-300 hover:text-white flex items-center gap-1 transition-colors"
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
                              className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                              <div className={`w-8 h-8 rounded-xl ${cat.iconBg} flex items-center justify-center shrink-0 border border-white/10 shadow-2xs`}>
                                <IconComp className={`w-4 h-4 ${cat.iconColor}`} />
                              </div>
                              <div className="truncate">
                                <span className="text-xs font-bold text-white group-hover:text-cyan-300 block truncate transition-colors">
                                  {cat.label}
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate font-medium">
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
                    className={`px-4 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-300 to-cyan-400 text-slate-950 font-black shadow-lg border border-white/60 scale-[1.04]'
                        : 'bg-white/15 hover:bg-white/30 border border-white/25 text-white font-extrabold backdrop-blur-md shadow-xs hover:scale-[1.02] hover:shadow-md'
                    }`}
                  >
                    {link.name === 'Sorteos ON MÁS' && <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-amber-300'}`} />}
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
        <div className="md:hidden bg-slate-900/95 backdrop-blur-2xl border-t border-white/10 px-4 pt-4 pb-6 space-y-4 animate-in fade-in duration-200 text-white">
          
          {/* User Account Mobile CTA */}
          {!currentUser ? (
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-white/10 border border-white/20 text-xs font-black text-cyan-300 shadow-md"
            >
              <User className="w-4 h-4 text-cyan-300" />
              <span>Ingresar / Crear cuenta</span>
            </Link>
          ) : (
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs font-black text-white shadow-md"
            >
              {userCommerce?.logoUrl ? (
                <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/20 bg-white shrink-0">
                  <Image src={userCommerce.logoUrl} alt={userCommerce.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-slate-950 flex items-center justify-center font-black text-sm shrink-0">
                  {userCommerce?.initial || 'M'}
                </div>
              )}
              <div className="flex flex-col text-left">
                <span className="font-black text-white text-xs">{userCommerce?.name}</span>
                <span className="text-[10px] text-cyan-300 font-bold">Ir a Mi Negocio (Panel)</span>
              </div>
            </Link>
          )}
          
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Provincia</label>
            <div className="flex flex-col gap-1.5">
              {activeProvinces.map((prov) => {
                const isSelected = selectedProvince === prov.id || selectedProvince === prov.slug;
                return (
                  <button
                    key={prov.id}
                    onClick={() => handleProvinceSelect(prov.id)}
                    className={`w-full text-xs py-2 px-3 rounded-xl border text-center font-bold flex items-center justify-between ${
                      isSelected
                        ? 'border-cyan-400 bg-white/15 text-cyan-300'
                        : 'border-white/15 text-slate-200'
                    }`}
                  >
                    <span>{prov.name}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Ciudad</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-800 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-medium"
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
              className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#00ADB5]"
            />
            <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-[#00ADB5] to-[#0047BA] text-white p-1.5 rounded-lg flex items-center justify-center">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="flex flex-col gap-1 pt-2 border-t border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xs font-bold py-2 px-3 rounded-lg hover:bg-white/10 text-slate-100 hover:text-cyan-300 flex items-center gap-2"
              >
                {link.name === 'Sorteos ON MÁS' && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
