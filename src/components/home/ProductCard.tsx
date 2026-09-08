'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CheckCircle, MessageCircle, Store, Tag } from 'lucide-react';
import { Product } from '@/types';
import { trackWhatsAppClick } from '@/lib/analytics/events';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price?: number, currency: string = 'ARS') => {
    if (!price) return 'Consultar precio';
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    // 1. Dispatch analytics tracking in snake_case
    trackWhatsAppClick(
      product.id,
      product.commerceId,
      product.title,
      product.commerceName
    );

    // 2. Generate official WhatsApp wa.me URL
    const cleanPhone = product.phoneWhatsApp.replace(/[^\d]/g, '');
    const defaultMsg = product.whatsappMessageCustom 
      ? product.whatsappMessageCustom 
      : `Hola ${product.commerceName}, encontré su producto "${product.title}" en el portal Entre Ríos ON y me gustaría realizar una consulta.`;

    const encodedMsg = encodeURIComponent(defaultMsg);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

    // 3. Open WhatsApp target
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const commerceSlug = product.commerceId === 'c1' ? 'alfareria-ceramica-delta'
    : product.commerceId === 'c2' ? 'comedor-costanera-el-dorado'
    : product.commerceId === 'c3' ? 'la-candelaria-vinedos'
    : 'citrus-dulces-del-uruguay';

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5">
      <div>
        {/* Product Image Container */}
        <Link href={`/producto/${product.slug}`} className="block relative h-40 sm:h-44 w-full overflow-hidden bg-slate-100">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* City & Category Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1 z-10">
            <span className="bg-[#004b87]/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
              <MapPin className="w-2.5 h-2.5 text-[#00a859]" />
              {product.cityName}
            </span>
          </div>

          {product.isFeatured && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
              <Tag className="w-2.5 h-2.5" />
              Destacado
            </div>
          )}
        </Link>

        {/* Content Details */}
        <div className="p-3.5 space-y-2">
          {/* Commerce Header Info */}
          <Link href={`/comercio/${commerceSlug}`} className="flex items-center gap-1 text-[11px] font-bold text-[#004b87] hover:underline">
            <Store className="w-3 h-3 text-[#00a859] shrink-0" />
            <span className="truncate">{product.commerceName}</span>
            <CheckCircle className="w-3 h-3 text-[#00a859] shrink-0" />
          </Link>

          {/* Title Link */}
          <Link href={`/producto/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#00a859] transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer Price & WhatsApp CTA */}
      <div className="p-3.5 pt-0 space-y-2">
        <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Precio</span>
          <span className="text-sm font-black text-[#004b87]">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>

        {/* Key WhatsApp Direct CTA */}
        <button
          onClick={handleWhatsAppClick}
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1ca650] text-white py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all transform active:scale-98"
          aria-label={`Pedir por WhatsApp ${product.title}`}
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>Pedir por WhatsApp</span>
        </button>
      </div>
    </article>
  );
}
