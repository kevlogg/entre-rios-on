'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { Product } from '@/types';
import { FavoriteButton } from '@/components/common/FavoriteButton';

// Default mock items matching the exact owner mockup
const MOCKUP_FEATURED_PRODUCTS = [
  {
    id: 'mock-1',
    title: 'iPhone 13 128GB Excelente estado',
    slug: 'iphone-13-128gb',
    cityName: 'Rosario',
    price: 650000,
    priceSuffix: '',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
    categoryId: 'tecnologia',
  },
  {
    id: 'mock-2',
    title: 'Sillón 3 cuerpos Tela antimanchas',
    slug: 'sillon-3-cuerpos',
    cityName: 'Santa Fe Capital',
    price: 480000,
    priceSuffix: '',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=500&q=80',
    categoryId: 'hogar',
  },
  {
    id: 'mock-3',
    title: 'Lavarropas automático 9kg',
    slug: 'lavarropas-automatico-9kg',
    cityName: 'Rafaela',
    price: 320000,
    priceSuffix: '',
    imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=500&q=80',
    categoryId: 'electro',
  },
  {
    id: 'mock-4',
    title: 'Juego de comedor Mesa + 6 sillas',
    slug: 'juego-de-comedor',
    cityName: 'Esperanza',
    price: 450000,
    priceSuffix: '',
    imageUrl: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=500&q=80',
    categoryId: 'hogar',
  },
  {
    id: 'mock-5',
    title: 'Servicio mecánico integral Todas las marcas',
    slug: 'servicio-mecanico-integral',
    cityName: 'Santo Tomé',
    price: 25000,
    priceSuffix: '',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=500&q=80',
    categoryId: 'autos',
  },
  {
    id: 'mock-6',
    title: 'Oportunidad turística Cabaña frente al río',
    slug: 'oportunidad-turistica-cabana',
    cityName: 'Reconquista',
    price: 120000,
    priceSuffix: ' por noche',
    imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=500&q=80',
    categoryId: 'turismo',
  },
];

interface FeaturedOffersGridProps {
  selectedCategory?: string;
  products?: Product[];
}

export function FeaturedOffersGrid({
  selectedCategory = 'all',
  products: initialProducts = [],
}: FeaturedOffersGridProps) {
  // Merge live products with mockup items if live products are few
  const itemsToDisplay = useMemo(() => {
    let source = initialProducts && initialProducts.length > 0 
      ? initialProducts.map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug || p.id,
          cityName: p.cityName || 'Santa Fe',
          price: p.price || 0,
          priceSuffix: '',
          imageUrl: p.imageUrl || '/images/prod-cuchillo.jpg',
          categoryId: p.categoryId || '',
        }))
      : [];

    if (source.length < 6) {
      // Append mockup products not already in list
      source = [...source, ...MOCKUP_FEATURED_PRODUCTS.slice(0, 6 - source.length)];
    }

    if (selectedCategory !== 'all') {
      const filtered = source.filter(p => (p.categoryId || '').toLowerCase().includes(selectedCategory.toLowerCase()));
      return filtered.length > 0 ? filtered : source.slice(0, 6);
    }

    return source.slice(0, 6);
  }, [initialProducts, selectedCategory]);

  return (
    <section id="productos-destacados" className="w-full pt-1 pb-3">
      {/* Header: Productos y oportunidades destacadas + Ver más productos */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm sm:text-base lg:text-lg font-black text-slate-900">
          Productos y oportunidades destacadas
        </h2>

        <Link
          href="/catalogo"
          className="text-xs sm:text-sm font-bold text-[#0070F3] hover:text-[#005bb5] flex items-center gap-1 transition-colors"
        >
          <span>Ver más productos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 6 Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {itemsToDisplay.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between rounded-xl overflow-hidden bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all shadow-2xs"
          >
            {/* Image Container with Favorite Icon */}
            <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
              <Link href={`/producto/${item.slug}`} className="block w-full h-full">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Heart favorite icon */}
              <div className="absolute top-1.5 right-1.5 z-10">
                <FavoriteButton
                  itemId={item.id}
                  itemType="producto"
                  itemTitle={item.title}
                  className="w-7 h-7 flex items-center justify-center p-0 rounded-full"
                />
              </div>
            </div>

            {/* Info Container */}
            <div className="p-2 sm:p-2.5 flex flex-col justify-between flex-1">
              <div>
                <Link href={`/producto/${item.slug}`}>
                  <h3 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-[#0047BA] transition-colors leading-snug">
                    {item.title}
                  </h3>
                </Link>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{item.cityName}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mt-2 pt-1 border-t border-slate-100">
                <span className="text-xs sm:text-sm font-black text-slate-900 block truncate">
                  ${item.price.toLocaleString('es-AR')}
                  {item.priceSuffix && (
                    <span className="text-[10px] font-normal text-slate-500">{item.priceSuffix}</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
