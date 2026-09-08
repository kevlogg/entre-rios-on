'use client';

import React from 'react';
import Image from 'next/image';
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

  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-[#eae3d2] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      <div>
        {/* Product Image Container */}
        <div className="relative h-52 w-full overflow-hidden bg-slate-100">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* City & Category Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <span className="bg-[#0f3443]/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <MapPin className="w-3 h-3 text-[#52b788]" />
              {product.cityName}
            </span>
            <span className="bg-white/90 backdrop-blur-md text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs">
              {product.category}
            </span>
          </div>

          {product.isFeatured && (
            <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Destacado
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-3">
          {/* Commerce Header Info */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1d5b79]">
            <Store className="w-3.5 h-3.5 text-[#2d6a4f]" />
            <span className="truncate">{product.commerceName}</span>
            <CheckCircle className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0" aria-label="Comercio Verificado en Entre Ríos ON" />
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#1d5b79] transition-colors">
            {product.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Footer Price & WhatsApp CTA */}
      <div className="p-5 pt-0 space-y-3">
        <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium">Precio estimado</span>
          <span className="text-lg font-extrabold text-[#0f3443]">
            {formatPrice(product.price, product.currency)}
          </span>
        </div>

        {/* Key WhatsApp Direct CTA */}
        <button
          onClick={handleWhatsAppClick}
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] active:bg-[#1ca650] text-white py-3 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all transform active:scale-98 focus:outline-hidden focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
          aria-label={`Pedir por WhatsApp ${product.title} de ${product.commerceName}`}
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Pedir por WhatsApp</span>
        </button>
      </div>
    </article>
  );
}
