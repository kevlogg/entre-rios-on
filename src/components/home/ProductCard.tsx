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
  const formatPrice = (price?: number | null, _currency: string = 'ARS') => {
    if (!price || isNaN(price) || price <= 0) return 'Consultar precio';
    return `$${new Intl.NumberFormat('es-AR').format(price)}`;
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
    <article className="group bg-white hover:bg-white backdrop-blur-md rounded-2xl overflow-hidden border border-slate-200/90 hover:border-cyan-400 shadow-sm sm:shadow-lg hover:shadow-xl transition-all duration-300 flex flex-row sm:flex-col justify-between hover:-translate-y-0.5 relative text-slate-900 p-2 min-[360px]:p-2.5 sm:p-0">
      {/* Product Image Container (Left on mobile, Top on desktop) */}
      <div className="relative w-24 min-[360px]:w-28 min-[400px]:w-32 h-24 min-[360px]:h-28 sm:h-44 sm:w-full shrink-0 overflow-hidden rounded-xl sm:rounded-none bg-slate-100">
        <Link href={`/producto/${product.slug}`} className="block w-full h-full">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 130px, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-xl sm:rounded-none"
          />
        </Link>

        {/* City & Category Badges */}
        <div className="absolute bottom-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-wrap items-center gap-1 z-10">
          <span className="bg-slate-900/85 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 rounded-md sm:rounded-full flex items-center gap-0.5 shadow-md border border-white/20">
            <MapPin className="w-2.5 h-2.5 text-cyan-300" />
            {product.cityName}
          </span>
        </div>

        {/* Desktop Favorite & Featured Badges */}
        <div className="absolute top-2 right-2 z-20 hidden sm:flex items-center gap-1.5">
          {product.isFeatured && (
            <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-md flex items-center gap-0.5">
              <Tag className="w-2.5 h-2.5" />
              Destacado
            </span>
          )}
          <FavoriteButton itemId={product.id} itemType="auto" itemTitle={product.title} />
        </div>
      </div>

      {/* Content & Details (Right on mobile, Bottom on desktop) */}
      <div className="flex-1 min-w-0 pl-2 min-[360px]:pl-2.5 sm:pl-0 flex flex-col justify-between sm:justify-start h-auto">
        {/* Content Details */}
        <div className="sm:p-3.5 space-y-1 sm:space-y-2">
          {/* Commerce Header Info + Mobile Favorite Button */}
          <div className="flex items-center justify-between gap-1">
            <Link href={`/comercio/${commerceSlug}`} className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-[#0047BA] hover:text-[#00ADB5] truncate">
              <Store className="w-3.5 h-3.5 text-[#00ADB5] shrink-0" />
              <span className="truncate">{product.commerceName}</span>
              {product.commercePlan && product.commercePlan !== 'Bronce' && (
                <CheckCircle className="w-3 h-3 text-[#00ADB5] shrink-0" />
              )}
            </Link>

            {/* Mobile Favorite Button */}
            <div className="sm:hidden shrink-0">
              <FavoriteButton itemId={product.id} itemType="auto" itemTitle={product.title} />
            </div>
          </div>

          {/* Title Link */}
          <Link href={`/producto/${product.slug}`} className="block">
            <h3 className="text-xs min-[360px]:text-sm font-black text-slate-900 line-clamp-1 sm:line-clamp-2 leading-tight group-hover:text-[#0047BA] transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-[10px] min-[360px]:text-[11px] text-slate-500 line-clamp-1 sm:line-clamp-2 leading-tight font-medium">
            {product.description}
          </p>
        </div>

        {/* Footer Price & WhatsApp CTA */}
        <div className="pt-1.5 sm:p-3.5 sm:pt-0 space-y-2">
          <div className="flex items-center justify-between sm:pt-2 sm:border-t sm:border-slate-100 gap-1.5 min-[360px]:gap-2">
            <div className="flex flex-col justify-center min-w-0 shrink sm:flex-row sm:items-baseline sm:justify-between sm:w-full">
              <span className="text-[8px] min-[360px]:text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                PRECIO
              </span>
              <span className="text-xs min-[360px]:text-sm sm:text-base font-black text-emerald-700 leading-tight truncate">
                {formatPrice(product.price, product.currency)}
              </span>
            </div>

            {/* Mobile WhatsApp Button (Single Row on Right - perfectly fitted) */}
            <button
              onClick={handleWhatsAppClick}
              data-whatsapp-cta="true"
              className="sm:hidden h-8 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white px-2 min-[360px]:px-2.5 rounded-lg font-black text-[10px] min-[360px]:text-[11px] flex items-center justify-center gap-1 shadow-xs transition-all transform active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              aria-label={`Pedir por WhatsApp ${product.title}`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
              <span>Pedir por WhatsApp</span>
            </button>
          </div>

          {/* Desktop WhatsApp Direct CTA Button */}
          <button
            onClick={handleWhatsAppClick}
            data-whatsapp-cta="true"
            className="hidden sm:flex w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:from-emerald-700 text-white px-3 rounded-xl font-black text-[15px] sm:text-base items-center justify-center gap-2 shadow-md transition-all transform active:scale-98 cursor-pointer whitespace-nowrap"
            aria-label={`Pedir por WhatsApp ${product.title}`}
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" />
            <span className="truncate">Pedir por WhatsApp</span>
          </button>
        </div>
      </div>
    </article>
  );
}
