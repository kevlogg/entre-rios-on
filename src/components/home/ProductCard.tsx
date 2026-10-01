'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, CheckCircle, MessageCircle, Store, Tag } from 'lucide-react';
import { Product } from '@/types';
import { trackWhatsAppClick } from '@/lib/analytics/events';
import { FavoriteButton } from '@/components/common/FavoriteButton';

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
    // 1. Dispatch analytics tracking
    trackWhatsAppClick(
      product.id,
      product.commerceId,
      product.title,
      product.commerceName
    );

    // 2. Generate tracking API URL
    const defaultMsg = product.whatsappMessageCustom 
      ? product.whatsappMessageCustom 
      : `Hola ${product.commerceName}, encontré su producto "${product.title}" en el portal Entre Ríos ON MÁS y me gustaría realizar una consulta.`;

    const trackingUrl = `/api/lead/whatsapp?phone=${encodeURIComponent(product.phoneWhatsApp)}&message=${encodeURIComponent(defaultMsg)}&commerceId=${encodeURIComponent(product.commerceId)}&productId=${encodeURIComponent(product.id)}&cityId=${encodeURIComponent(product.cityId)}`;

    // 3. Open target with tracking
    window.open(trackingUrl, '_blank', 'noopener,noreferrer');
  };

  const commerceSlug = product.commerceId === 'c1' ? 'alfareria-ceramica-delta'
    : product.commerceId === 'c2' ? 'comedor-costanera-el-dorado'
    : product.commerceId === 'c3' ? 'la-candelaria-vinedos'
    : 'citrus-dulces-del-uruguay';

  return (
    <article className="group bg-slate-900/70 hover:bg-slate-900/95 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 hover:border-cyan-300 shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-0.5 relative text-white">
      <div>
        {/* Product Image Container */}
        <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-slate-800">
          <Link href={`/producto/${product.slug}`} className="block w-full h-full">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* City & Category Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1 z-10">
            <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md border border-white/20">
              <MapPin className="w-2.5 h-2.5 text-cyan-300" />
              {product.cityName}
            </span>
          </div>

          <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
            {product.isFeatured && (
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-md flex items-center gap-0.5">
                <Tag className="w-2.5 h-2.5" />
                Destacado
              </span>
            )}
            <FavoriteButton itemId={product.id} itemType="auto" itemTitle={product.title} />
          </div>
        </div>

        {/* Content Details */}
        <div className="p-3.5 space-y-2">
          {/* Commerce Header Info */}
          <Link href={`/comercio/${commerceSlug}`} className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:text-cyan-200 hover:underline">
            <Store className="w-3 h-3 text-cyan-300 shrink-0" />
            <span className="truncate">{product.commerceName}</span>
            {product.commercePlan && product.commercePlan !== 'Bronce' && (
              <span title="Comercio Verificado (Plan Plata/Oro)">
                <CheckCircle className="w-3 h-3 text-cyan-300 shrink-0" />
              </span>
            )}
          </Link>

          {/* Title Link */}
          <Link href={`/producto/${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-extrabold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-[11px] text-slate-200 line-clamp-2 leading-tight font-medium">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer Price & WhatsApp CTA */}
      <div className="p-3.5 pt-0 space-y-2">
        <div className="flex items-baseline justify-between pt-2 border-t border-white/10">
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Precio</span>
          <span className="text-sm font-black text-emerald-300">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>

        {/* Key WhatsApp Direct CTA */}
        <button
          onClick={handleWhatsAppClick}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 active:from-emerald-600 text-white py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all transform active:scale-98 cursor-pointer"
          aria-label={`Pedir por WhatsApp ${product.title}`}
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>Pedir por WhatsApp</span>
        </button>
      </div>
    </article>
  );
}
