'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/home/ProductCard';
import { Search, ShoppingBag, Store, Sparkles, Filter, X } from 'lucide-react';
import Link from 'next/link';

interface CatalogInteractiveViewProps {
  initialProducts: Product[];
}

const CATEGORIES = [
  { id: 'all', label: 'Todos los Productos' },
  { id: 'gastronomia', label: 'Gastronomía & Sabores' },
  { id: 'artesanias', label: 'Artesanías & Regalos' },
  { id: 'indumentaria', label: 'Indumentaria & Calzado' },
  { id: 'hogar', label: 'Hogar & Decoración' },
  { id: 'construccion', label: 'Construcción & Ferretería' },
  { id: 'tecnologia', label: 'Tecnología' },
];

export function CatalogInteractiveView({ initialProducts }: CatalogInteractiveViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Filter by text search
      const queryLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !queryLower ||
        product.title.toLowerCase().includes(queryLower) ||
        product.description.toLowerCase().includes(queryLower) ||
        product.commerceName.toLowerCase().includes(queryLower) ||
        product.cityName.toLowerCase().includes(queryLower) ||
        product.category.toLowerCase().includes(queryLower);

      // Filter by category
      let matchesCategory = true;
      if (selectedCategory !== 'all') {
        const catIdLower = selectedCategory.toLowerCase();
        matchesCategory =
          (product.categoryId && product.categoryId.toLowerCase().includes(catIdLower)) ||
          product.category.toLowerCase().includes(catIdLower);
      }

      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 bg-white/15 text-[#00E5E8] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            Catálogo Regional Unificado
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Catálogo & Ofertas ON MÁS
          </h1>
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
            Explorá miles de productos de comercios, productores locales y emprendedores con pedido directo a WhatsApp sin intermediarios ni comisiones.
          </p>

          {/* Real-time Interactive Search Input */}
          <div className="pt-2 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos, artesanías, regalos, tecnología..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-800 text-xs font-semibold rounded-2xl pl-10 pr-10 py-3.5 shadow-md focus:outline-hidden focus:ring-2 focus:ring-[#00E5E8]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0047BA] text-white shadow-xs font-extrabold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-lg font-extrabold text-[#0047BA] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#00ADB5]" />
            <span>Productos Exhibidos ({filteredProducts.length})</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">Envíos y consulta directa por WhatsApp</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <Filter className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No se encontraron productos</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Probá cambiar el término de búsqueda o seleccionar otra categoría en el menú superior.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="bg-[#0047BA] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#002878] transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </section>

      {/* B2B Callout Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-[#00E5E8]" />
            <span>¿Tenés un comercio y querés sumar tu catálogo?</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Publicá tus productos gratis y conectá directo con clientes de toda la provincia por WhatsApp sin comisiones por venta.
          </p>
        </div>
        <Link
          href="/admin"
          className="bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white px-6 py-3 rounded-2xl font-extrabold text-xs shadow-md shrink-0 whitespace-nowrap"
        >
          Publicar mis Productos
        </Link>
      </div>
    </div>
  );
}
