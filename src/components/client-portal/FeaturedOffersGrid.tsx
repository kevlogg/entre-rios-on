'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, MapPin, Store, MessageCircle, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { FavoriteButton } from '@/components/common/FavoriteButton';

interface FeaturedOffersGridProps {
  selectedCategory?: string;
  products?: Product[];
}

export function FeaturedOffersGrid({
  selectedCategory = 'all',
  products: initialProducts = [],
}: FeaturedOffersGridProps) {
  const router = useRouter();

  // Mostrar únicamente productos reales y válidos de comercios registrados
  const itemsToDisplay = useMemo(() => {
    const source = initialProducts && initialProducts.length > 0 
      ? initialProducts.map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug || p.id,
          cityName: p.cityName || 'Santa Fe',
          commerceName: p.commerceName || 'Comercio ON+',
          description: p.description || '',
          price: p.price || 0,
          priceSuffix: '',
          imageUrl: p.imageUrl || '/images/prod-cuchillo.jpg',
          categoryId: p.categoryId || '',
          phoneWhatsApp: p.phoneWhatsApp || '5493426514889',
        }))
      : [];

    if (selectedCategory !== 'all') {
      const filtered = source.filter(p => (p.categoryId || '').toLowerCase().includes(selectedCategory.toLowerCase()));
      return filtered.length > 0 ? filtered : source.slice(0, 6);
    }

    return source.slice(0, 6);
  }, [initialProducts, selectedCategory]);

  if (itemsToDisplay.length === 0) {
    return null;
  }

  const handleWhatsAppClick = (e: React.MouseEvent, item: typeof itemsToDisplay[0]) => {
    e.preventDefault();
    e.stopPropagation();
    const cleanPhone = (item.phoneWhatsApp || '5493426514889').replace(/[^\d]/g, '');
    const defaultMsg = `Hola ${item.commerceName}, encontré su producto "${item.title}" en el portal ON MÁS y me gustaría realizar una consulta.`;
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMsg)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="productos-destacados" className="w-full pt-1 pb-3">
      {/* Header: Catálogo y ofertas destacadas + Ver todo el catálogo */}
      <div className="flex items-center justify-between mb-2 sm:mb-2.5">
        <div className="flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-[#0047BA] sm:hidden" />
          <h2 className="text-sm sm:text-base lg:text-lg font-black text-slate-900">
            Catálogo y ofertas destacadas
          </h2>
        </div>

        <Link
          href="/catalogo"
          className="text-xs sm:text-sm font-bold text-[#0070F3] hover:text-[#005bb5] flex items-center gap-1 transition-colors shrink-0"
        >
          <span>Ver todo el catálogo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Cards: Uno abajo de otro en mobile (grid-cols-1 con foto izq y texto der), grilla en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {itemsToDisplay.map((item) => (
          <Link
            key={item.id}
            href={`/producto/${item.slug}`}
            prefetch={true}
            className="group relative flex flex-row sm:flex-col justify-between rounded-2xl overflow-hidden bg-white border border-slate-200/90 hover:border-[#0047BA]/50 hover:shadow-md transition-all shadow-xs p-2 min-[360px]:p-2.5 sm:p-2.5 lg:p-3 cursor-pointer"
          >
            {/* Image Container (Left on mobile, Top on desktop con bordes redondeados) */}
            <div className="relative w-28 min-[360px]:w-32 min-[400px]:w-36 h-28 min-[360px]:h-32 min-[400px]:h-36 sm:w-full sm:h-auto sm:aspect-4/3 shrink-0 rounded-xl overflow-hidden bg-slate-100">
              <div className="w-full h-full relative">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 140px, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                />
              </div>

              {/* Heart favorite icon on Desktop */}
              <div 
                className="absolute top-1.5 right-1.5 z-10 hidden sm:block"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <FavoriteButton
                  itemId={item.id}
                  itemType="producto"
                  itemTitle={item.title}
                  className="w-7 h-7 flex items-center justify-center p-0 rounded-full"
                />
              </div>

              {/* City badge on image for mobile */}
              <div className="absolute bottom-1.5 left-1.5 sm:hidden z-10">
                <span className="bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-xs">
                  <MapPin className="w-2.5 h-2.5 text-cyan-300" />
                  {item.cityName}
                </span>
              </div>
            </div>

            {/* Content & Details (Right on mobile, Bottom on desktop con márgenes interiores) */}
            <div className="flex-1 min-w-0 pl-2.5 min-[360px]:pl-3 sm:pl-0 sm:pt-2 sm:px-1 flex flex-col justify-between">
              <div>
                {/* Mobile Top Header: Commerce Name & Mobile Favorite Button */}
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <div className="flex items-center gap-1 text-[11px] font-black text-[#0047BA] truncate">
                    <Store className="w-3.5 h-3.5 text-[#00ADB5] shrink-0" />
                    <span className="truncate">{item.commerceName}</span>
                  </div>

                  <div 
                    className="sm:hidden shrink-0"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  >
                    <FavoriteButton
                      itemId={item.id}
                      itemType="producto"
                      itemTitle={item.title}
                      className="w-7 h-7 flex items-center justify-center p-0 rounded-full"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-xs min-[360px]:text-sm sm:text-xs font-black sm:font-bold text-slate-900 line-clamp-1 sm:line-clamp-2 leading-tight group-hover:text-[#0047BA] transition-colors">
                    {item.title}
                  </h3>
                </div>

                {/* Description (visible on mobile) */}
                <p className="text-[10px] min-[360px]:text-[11px] text-slate-500 line-clamp-1 sm:hidden font-medium mt-0.5">
                  {item.description || `Encontrá este y más productos en ${item.cityName}`}
                </p>

                {/* City name on desktop */}
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{item.cityName}</span>
                </div>
              </div>

              {/* Price & Action row */}
              <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between sm:block">
                <div>
                  <span className="text-[8px] min-[360px]:text-[9px] text-slate-400 font-black uppercase tracking-wider block leading-none sm:hidden">
                    PRECIO
                  </span>
                  <span className="text-xs min-[360px]:text-sm sm:text-sm font-black text-emerald-700 sm:text-slate-900 leading-tight block truncate">
                    ${item.price.toLocaleString('es-AR')}
                    {item.priceSuffix && (
                      <span className="text-[10px] font-normal text-slate-500">{item.priceSuffix}</span>
                    )}
                  </span>
                </div>

                {/* WhatsApp Button on mobile (reducido y más compacto) */}
                <button
                  type="button"
                  onClick={(e) => handleWhatsAppClick(e, item)}
                  className="sm:hidden h-6 min-[360px]:h-6.5 bg-[#25D366] hover:bg-emerald-600 active:bg-emerald-700 text-white px-2 rounded-lg font-black text-[10px] flex items-center justify-center gap-1 shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                  aria-label={`WhatsApp ${item.title}`}
                >
                  <MessageCircle className="w-3 h-3 fill-current shrink-0" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
