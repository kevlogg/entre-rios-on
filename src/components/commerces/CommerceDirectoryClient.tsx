'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Commerce } from '@/types';
import { 
  Search, 
  Store, 
  CheckCircle, 
  Globe, 
  Building2, 
  MapPin, 
  MessageCircle, 
  Filter, 
  X, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { CATEGORIES_LIST } from '@/lib/constants/categories';
import { PROVINCES } from '@/lib/constants/locations';

interface CommerceDirectoryClientProps {
  initialCommerces: Commerce[];
}

export function CommerceDirectoryClient({ initialCommerces }: CommerceDirectoryClientProps) {
  const router = useRouter();
  // Main Type Filter: 'all' | 'verified' | 'online' | 'pymes'
  const [typeFilter, setTypeFilter] = useState<'all' | 'verified' | 'online' | 'pymes'>('all');
  
  // Search query filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Province / City Filter
  const [selectedProvince, setSelectedProvince] = useState<string>('all');

  // Filtered commerces logic
  const filteredCommerces = useMemo(() => {
    return initialCommerces.filter((comm) => {
      // 1. Type Filter (Verified, Online Store, Pymes)
      if (typeFilter === 'verified' && !comm.isVerified) {
        return false;
      }
      if (typeFilter === 'online' && !comm.isDigitalOnly && !comm.website) {
        return false;
      }
      if (typeFilter === 'pymes' && comm.plan !== 'Oro' && comm.plan !== 'Plata') {
        return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = comm.name.toLowerCase().includes(q);
        const descMatch = comm.description?.toLowerCase().includes(q);
        const catMatch = comm.category?.toLowerCase().includes(q);
        const cityMatch = comm.cityName?.toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !catMatch && !cityMatch) {
          return false;
        }
      }

      // 3. Category Filter
      if (selectedCategory !== 'all') {
        if (comm.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // 4. Province Filter
      if (selectedProvince !== 'all') {
        if (comm.provinceId !== selectedProvince && comm.provinceName?.toLowerCase() !== selectedProvince.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [initialCommerces, typeFilter, searchQuery, selectedCategory, selectedProvince]);

  const hasActiveFilters = typeFilter !== 'all' || searchQuery !== '' || selectedCategory !== 'all' || selectedProvince !== 'all';

  const resetFilters = () => {
    setTypeFilter('all');
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedProvince('all');
  };

  return (
    <div className="space-y-8">
      
      {/* Search & Filter Control Panel */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-6 text-slate-800">
        
        {/* Header Title + Stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-[#0047BA] flex items-center justify-center shrink-0 shadow-xs">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#002878] tracking-tight">Filtros de Búsqueda Comercial</h2>
              <p className="text-xs text-slate-500 font-medium">Encontrá el comercio, servicio o pyme que buscás en toda la región.</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200/80 px-3.5 py-1.5 rounded-2xl text-xs font-black text-[#0047BA] shrink-0">
            {filteredCommerces.length} {filteredCommerces.length === 1 ? 'comercio encontrado' : 'comercios encontrados'}
          </div>
        </div>

        {/* 1. Main Type Filter Tabs (Verificados, Comercio Online, Pymes) */}
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-[#0047BA]">
            Tipo de Comercio / Empresa:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-gradient-to-r from-[#0047BA] to-[#00ADB5] text-white border-transparent shadow-md scale-[1.01]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <Store className={`w-4 h-4 shrink-0 ${typeFilter === 'all' ? 'text-white' : 'text-[#00ADB5]'}`} />
              <span>Todos ({initialCommerces.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setTypeFilter('verified')}
              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                typeFilter === 'verified'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-md scale-[1.01]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 shrink-0 ${typeFilter === 'verified' ? 'text-white' : 'text-emerald-600'}`} />
              <span>Comercios Verificados</span>
            </button>

            <button
              type="button"
              onClick={() => setTypeFilter('online')}
              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                typeFilter === 'online'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-transparent shadow-md scale-[1.01]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <Globe className={`w-4 h-4 shrink-0 ${typeFilter === 'online' ? 'text-white' : 'text-cyan-600'}`} />
              <span>Comercio Online</span>
            </button>

            <button
              type="button"
              onClick={() => setTypeFilter('pymes')}
              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                typeFilter === 'pymes'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-md scale-[1.01]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <Building2 className={`w-4 h-4 shrink-0 ${typeFilter === 'pymes' ? 'text-white' : 'text-amber-500'}`} />
              <span>Industria & Empresas</span>
            </button>
          </div>
        </div>

        {/* 2. Secondary Input & Dropdowns (Text Search, Category, Province) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          
          {/* Text Input Search */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Buscá por nombre, producto o palabra clave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#00ADB5] rounded-2xl pl-4 pr-10 py-3 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#00ADB5]/20 transition-all shadow-xs"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none" />
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#00ADB5] rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#00ADB5]/20 cursor-pointer transition-all shadow-xs"
            >
              <option value="all">Todas las categorías</option>
              {CATEGORIES_LIST.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Province Dropdown */}
          <div>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#00ADB5] rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#00ADB5]/20 cursor-pointer transition-all shadow-xs"
            >
              <option value="all">Todas las provincias</option>
              {PROVINCES.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Clear Filters CTA */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600">
              Filtros activos aplicados
            </span>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-black text-rose-600 hover:text-rose-700 flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar Filtros</span>
            </button>
          </div>
        )}

      </div>

      {/* Commerces Grid */}
      {filteredCommerces.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-md space-y-4">
          <Store className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-900">No encontramos comercios con estos filtros</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Probá cambiar los criterios de búsqueda o seleccionar &ldquo;Todos los Comercios&rdquo; para ver todo el directorio provincial.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 bg-[#0047BA] hover:bg-[#002878] text-white px-5 py-2.5 rounded-2xl text-xs font-black transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Restablecer Filtros</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommerces.map((comm) => (
            <div 
              key={comm.id} 
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('button, a')) return;
                router.push(`/comercio/${comm.slug}`);
              }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 space-y-4 group hover:-translate-y-1 cursor-pointer"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center">
                    {comm.logoUrl && !comm.logoUrl.includes('city-rosario.jpg') && comm.logoUrl !== '/logo.png' ? (
                      <Image
                        src={comm.logoUrl}
                        alt={comm.name}
                        fill
                        unoptimized={comm.logoUrl?.startsWith('data:')}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                        <Store className="w-7 h-7 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md uppercase">
                        {comm.category}
                      </span>
                      {comm.isVerified && (
                        <span className="text-[9px] font-black text-cyan-800 bg-cyan-100 border border-cyan-300 px-1.5 py-0.5 rounded-md uppercase flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5 text-[#00ADB5]" />
                          <span>Verificado</span>
                        </span>
                      )}
                      {(comm.isDigitalOnly || comm.website) && (
                        <span className="text-[9px] font-black text-blue-800 bg-blue-100 border border-blue-300 px-1.5 py-0.5 rounded-md uppercase flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5 text-blue-600" />
                          <span>Online</span>
                        </span>
                      )}
                    </div>
                    <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-1.5 leading-snug mt-1 group-hover:text-[#0047BA] transition-colors">
                      <span>{comm.name}</span>
                    </h2>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {comm.description}
                </p>

                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00ADB5] shrink-0" />
                  <span className="truncate">{comm.address || comm.cityName || 'Santa Fe'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <Link
                  href={`/comercio/${comm.slug}`}
                  className="bg-gradient-to-r from-[#0047BA] to-[#0060E6] hover:from-[#003688] hover:to-[#0047BA] text-white py-2.5 px-4 rounded-xl text-xs font-black text-center flex-1 shadow-md transition-all"
                >
                  Ver Perfil Completo
                </Link>
                {comm.phoneWhatsApp && (
                  <a
                    href={`/api/lead/whatsapp?phone=${encodeURIComponent((comm.phoneWhatsApp || '').replace(/\D/g, ''))}&message=${encodeURIComponent(`Hola ${comm.name}, vi su comercio en el directorio ON MÁS.`)}&commerceId=${encodeURIComponent(comm.id)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-2.5 rounded-xl shadow-md transition-transform active:scale-95"
                    aria-label="Contactar por WhatsApp"
                    title="Enviar WhatsApp al comercio"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
