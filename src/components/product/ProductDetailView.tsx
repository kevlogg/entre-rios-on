'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  Share2, 
  MapPin, 
  CheckCircle2, 
  MessageCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Store,
  Navigation,
  FileText,
  ShoppingBag,
  Star,
  ShieldCheck,
  Info,
  Maximize2,
  X,
  CreditCard,
  Banknote,
  ArrowRightLeft
} from 'lucide-react';
import { Product, Commerce } from '@/types';
import { ProductRatingWidget } from '@/components/product/ProductRatingWidget';

interface ProductDetailViewProps {
  product: Product;
  commerce?: Commerce | null;
  relatedProducts?: Product[];
}

// Formateador estricto de números de WhatsApp en Argentina (+54 9 ...)
function formatWhatsAppArgentina(rawPhone?: string): string {
  if (!rawPhone) return '5493426514889';
  let digits = rawPhone.replace(/[^\d]/g, '');
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.startsWith('549')) return digits;
  if (digits.startsWith('54') && !digits.startsWith('549')) {
    return '549' + digits.slice(2);
  }
  if (digits.length === 10) {
    return '549' + digits;
  }
  if (digits.length === 11 && digits.startsWith('9')) {
    return '54' + digits;
  }
  return digits;
}

export function ProductDetailView({ product, commerce, relatedProducts = [] }: ProductDetailViewProps) {
  // Gallery setup
  const gallery = (product.galleryImages && product.galleryImages.length > 0) 
    ? product.galleryImages 
    : [product.imageUrl];

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showCopiedToast, setShowCopiedToast] = useState<boolean>(false);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  
  const [views, setViews] = useState<number>(Number((product as any).viewsCount || 0));

  useEffect(() => {
    async function trackProductVisit() {
      try {
        const targetId = product.slug || product.id;
        if (!targetId) return;
        const res = await fetch(`/api/lead/product-view?productId=${encodeURIComponent(targetId)}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.viewsCount !== undefined) {
            setViews(data.viewsCount);
          }
        }
      } catch (err) {
        console.warn('Error registrando visita de producto:', err);
      }
    }
    trackProductVisit();
  }, [product.id, product.slug]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const rawFavs = localStorage.getItem('onmas_fav_products');
        if (rawFavs) {
          const list = JSON.parse(rawFavs);
          if (Array.isArray(list) && list.includes(product.id)) {
            setIsFavorite(true);
          }
        }
      } catch (e) {}
    }
  }, [product.id]);

  const toggleFavorite = () => {
    setIsFavorite((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        try {
          const rawFavs = localStorage.getItem('onmas_fav_products');
          let list: string[] = rawFavs ? JSON.parse(rawFavs) : [];
          if (next) {
            if (!list.includes(product.id)) list.push(product.id);
          } else {
            list = list.filter((id) => id !== product.id);
          }
          localStorage.setItem('onmas_fav_products', JSON.stringify(list));
        } catch (e) {}
      }
      return next;
    });
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: product.title,
          text: `Mirá esta publicación en ON+ Portal Comercial: ${product.title}`,
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setShowCopiedToast(true);
        setTimeout(() => setShowCopiedToast(false), 3000);
      }
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  // Nombre comercial reconocido públicamente vs datos legales/titular
  const commerceDisplayName = commerce?.name || product.commerceName || 'Comercio ON+';
  const legalName = commerce?.legalName;

  // WhatsApp verificado del comercio
  const targetPhone = commerce?.phoneWhatsApp || product.phoneWhatsApp || '5493426514889';
  const cleanPhone = formatWhatsAppArgentina(targetPhone);
  
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://onmas.com.ar/producto/${product.slug || product.id}`;
  const customMessage = `Hola ${commerceDisplayName}, vi su publicación "${product.title}" en ON+ Portal Comercial y quisiera consultar disponibilidad y detalles. Enlace: ${currentUrl}`;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`;

  const price = product.price; 
  const hasExtendedDescription = product.description && product.description.length > 50;

  // Determinar si el comercio tiene dirección exacta física autorizada para recibir clientes
  const isExactAddress = Boolean(
    !commerce?.isDigitalOnly &&
    commerce?.address &&
    commerce.address.trim().length > 0 &&
    !commerce.address.toLowerCase().startsWith('atención online') &&
    !commerce.address.toLowerCase().startsWith('servicio a domicilio') &&
    (/\d+/.test(commerce.address) || /calle|av|avenida|bv|bulevar|ruta|pje|pasaje/i.test(commerce.address)) &&
    commerce.address.trim().toLowerCase() !== (commerce?.cityName || product.cityName || '').trim().toLowerCase() &&
    commerce.address.trim().toLowerCase() !== `${(commerce?.cityName || product.cityName || '').trim().toLowerCase()}, argentina`
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-16 px-0 sm:px-0">
      
      {showCopiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-cyan-400 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>¡Enlace copiado al portapapeles!</span>
        </div>
      )}

      {/* 2. ESTRUCTURA PRINCIPAL DE LA PUBLICACIÓN */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row lg:divide-x divide-slate-100">
        
        {/* A. GALERÍA DEL PRODUCTO (Izquierda - 44% para imagen amplia y balanceada) */}
        <div className="lg:w-[44%] flex flex-col md:flex-row p-4 sm:p-6 gap-3 sm:gap-5">
          
          {/* Miniaturas */}
          {gallery.length > 1 && (
            <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto scrollbar-none order-2 md:order-1 shrink-0">
              {gallery.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all bg-white cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#0047BA] shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Ver foto ${idx + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Imagen Principal Adaptable */}
          <div className="relative flex-1 aspect-square sm:aspect-[4/3] md:min-h-[440px] md:max-h-[540px] bg-slate-50/80 rounded-2xl overflow-hidden order-1 md:order-2 group border border-slate-100 flex items-center justify-center p-1 sm:p-2">
            <img
              src={gallery[activeImageIndex]}
              alt={product.title}
              className="w-full h-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.01]"
              onClick={() => setIsZoomOpen(true)}
            />
            
            {/* Botón de Zoom / Pantalla Completa */}
            <button
              onClick={() => setIsZoomOpen(true)}
              className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 hover:text-[#0047BA] transition-colors cursor-pointer opacity-80 group-hover:opacity-100"
              title="Ampliar imagen a pantalla completa"
              aria-label="Ampliar imagen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            
            {gallery.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#0047BA] transition-colors md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#0047BA] transition-colors md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Foto siguiente"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Indicadores */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-full">
                  {gallery.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-2 rounded-full transition-all ${activeImageIndex === idx ? 'w-5 bg-white' : 'w-2 bg-white/60'}`} 
                    />
                  ))}
                </div>
              </>
            )}

            {/* Favoritos y Compartir (Top Right) */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={handleShare}
                aria-label="Compartir publicación"
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-[#0047BA] transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFavorite}
                aria-label="Guardar en favoritos"
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-rose-500 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* B. INFORMACIÓN PRINCIPAL (Centro - 32%) */}
        <div className="lg:w-[32%] p-5 sm:p-6 flex flex-col justify-between border-t lg:border-t-0 border-slate-100">
          <div className="space-y-4 w-full">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#0047BA] bg-blue-50 px-2.5 py-1 rounded-lg">
                  {product.category || 'Catálogo Comercial'}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  • {product.cityName}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] leading-tight tracking-tight">
                {product.title}
              </h1>
              
              <a
                href="#calificaciones"
                className="inline-flex items-center gap-2 mt-2 group text-xs font-bold text-slate-500 hover:text-[#0047BA] transition-colors"
              >
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-black text-slate-800">4.9</span>
                <span className="text-slate-300 font-medium">|</span>
                <span className="underline decoration-slate-300 group-hover:decoration-[#0047BA] font-semibold text-slate-500">
                  Opiniones de usuarios
                </span>
              </a>
            </div>
            
            {/* Precio con unidad bien visible */}
            <div className="py-2.5 border-y border-slate-100 space-y-2">
              {price ? (
                <div className="flex flex-col gap-1.5">
                  <div className="text-2xl sm:text-3xl font-black text-[#002878] flex items-baseline flex-wrap gap-2 tracking-tight">
                    <span>${price.toLocaleString('es-AR')}</span>
                    <span className="text-sm sm:text-base font-bold text-slate-600">
                      ARS / {product.priceUnit || 'unidad'}
                    </span>
                  </div>
                  
                  {/* Precio por docena solo cuando se informe */}
                  {product.dozenPrice ? (
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#0047BA] px-3 py-1 rounded-xl text-xs sm:text-sm font-bold max-w-full flex-wrap shadow-2xs">
                      <span className="text-slate-600 font-medium">Precio por docena:</span>
                      <span className="font-black text-sm sm:text-base">${product.dozenPrice.toLocaleString('es-AR')} ARS</span>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="text-xl font-black text-slate-500 tracking-tight">
                  Consultar precio al comercio
                </div>
              )}

              {/* Aclaración de disponibilidad como consulta al vendedor */}
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full max-w-full flex-wrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span>Disponibilidad: <strong className="text-slate-900 font-bold">Consultar con el comercio</strong></span>
              </div>
            </div>

            {/* Bloque: Promociones y medios de pago */}
            {(() => {
              const paymentConfig = product.paymentConfig || {
                discountPercent: (product.originalPrice && product.price && product.originalPrice > product.price) 
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : undefined,
                installments: 'none',
                acceptsCash: true,
                acceptsTransfer: true,
                acceptsVisa: true,
                acceptsMastercard: true,
                acceptsMercadoPago: true,
              };

              const hasCards = paymentConfig.acceptsVisa || paymentConfig.acceptsMastercard || paymentConfig.acceptsMercadoPago;

              return (
                <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100/90 border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex items-center gap-1.5 text-slate-800">
                      <CreditCard className="w-4 h-4 text-[#0047BA]" />
                      <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                        Promociones y medios de pago
                      </span>
                    </div>
                    {paymentConfig.discountPercent && paymentConfig.discountPercent > 0 ? (
                      <span className="bg-emerald-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                        {paymentConfig.discountPercent}% OFF
                      </span>
                    ) : null}
                  </div>

                  {/* Opciones de cuotas */}
                  {paymentConfig.installments && paymentConfig.installments !== 'none' && (
                    <div className="w-full flex items-center gap-2 p-2.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-xs font-black text-emerald-800 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Hasta {paymentConfig.installments} cuotas sin interés</span>
                    </div>
                  )}

                  {/* Opciones directas: Efectivo y/o Transferencia */}
                  {(paymentConfig.acceptsCash || paymentConfig.acceptsTransfer) && (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {paymentConfig.acceptsCash && (
                        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 py-2 px-2.5 rounded-xl shadow-2xs">
                          <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Efectivo</span>
                        </div>
                      )}
                      {paymentConfig.acceptsTransfer && (
                        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 py-2 px-2.5 rounded-xl shadow-2xs">
                          <ArrowRightLeft className="w-3.5 h-3.5 text-[#0047BA] shrink-0" />
                          <span>Transferencia</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Logos de medios de pago habilitados */}
                  {hasCards && (
                    <div className="flex items-center gap-2 pt-0.5 w-full">
                      {paymentConfig.acceptsVisa && (
                        <div className="flex-1 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-1.5 shadow-2xs" title="Visa habilitada">
                          <svg className="h-3.5 w-auto" viewBox="0 0 48 16" fill="none">
                            <path d="M19.14 1.13L12.56 15H8.26L5.03 3.86C4.84 3.12 4.67 2.85 4.09 2.53C3.15 2.03 1.54 1.56 0 1.22L0.1 0.75H7.07C7.98 0.75 8.79 1.35 8.99 2.39L10.7 11.45L14.9 0.75H19.14V1.13ZM36.03 10.37C36.05 6.42 30.56 6.2 30.6 4.43C30.61 3.89 31.13 3.32 32.28 3.16C32.85 3.09 34.42 3.03 36.06 3.79L36.8 0.35C35.79 -0.02 34.49 -0.19 32.86 -0.19C28.84 -0.19 26.01 1.94 25.98 5.01C25.95 7.27 27.97 8.53 29.51 9.28C31.09 10.05 31.62 10.54 31.61 11.23C31.6 12.28 30.36 12.75 29.21 12.77C27.17 12.8 25.98 12.22 25.04 11.78L24.27 15.37C25.26 15.82 27.08 16.21 28.96 16.23C33.22 16.23 36.01 14.12 36.03 10.37ZM46.61 15H50.33L47.08 0.75H43.64C42.84 0.75 42.16 1.21 41.86 1.93L35.76 15H40.06L40.92 12.63H46.16L46.61 15ZM42.08 9.68L44.22 3.79L45.45 9.68H42.08ZM25.03 0.75L21.65 15H17.58L20.96 0.75H25.03Z" fill="#1434CB"/>
                            <path d="M5.03 3.86C4.84 3.12 4.67 2.85 4.09 2.53C3.15 2.03 1.54 1.56 0 1.22L0.1 0.75H7.07C7.98 0.75 8.79 1.35 8.99 2.39L10.7 11.45L5.03 3.86Z" fill="#F8A51D"/>
                          </svg>
                        </div>
                      )}
                      {paymentConfig.acceptsMastercard && (
                        <div className="flex-1 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-1.5 shadow-2xs" title="Mastercard habilitada">
                          <svg className="h-4.5 w-auto" viewBox="0 0 32 20" fill="none">
                            <circle cx="11" cy="10" r="7" fill="#EB001B"/>
                            <circle cx="21" cy="10" r="7" fill="#F79E1B" fillOpacity="0.95"/>
                            <path d="M16 4.9C17.65 6.25 18.7 8 18.7 10C18.7 12 17.65 13.75 16 15.1C14.35 13.75 13.3 12 13.3 10C13.3 8 14.35 6.25 16 4.9Z" fill="#FF5F00"/>
                          </svg>
                        </div>
                      )}
                      {paymentConfig.acceptsMercadoPago && (
                        <div className="flex-[1.4] h-8 bg-white border border-[#009EE3]/40 rounded-xl flex items-center justify-center gap-1.5 px-2.5 shadow-2xs" title="Mercado Pago oficial habilitado">
                          <svg className="w-5 h-5 text-[#009EE3] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.115 16.479a.93.927 0 0 1-.939-.886c-.002-.042-.006-.155-.103-.155-.04 0-.074.023-.113.059-.112.103-.254.206-.46.206a.816.814 0 0 1-.305-.066c-.535-.214-.542-.578-.521-.725.006-.038.007-.08-.02-.11l-.032-.03h-.034c-.027 0-.055.012-.093.039a.788.786 0 0 1-.454.16.7.699 0 0 1-.253-.05c-.708-.27-.65-.928-.617-1.126.005-.041-.005-.072-.03-.092l-.05-.04-.047.043a.728.726 0 0 1-.505.203.73.728 0 0 1-.732-.725c0-.4.328-.722.732-.722.364 0 .675.27.721.63l.026.195.11-.165c.01-.018.307-.46.852-.46.102 0 .21.016.316.05.434.13.508.52.519.68.008.094.075.1.09.1.037 0 .064-.024.083-.045a.746.744 0 0 1 .54-.225c.128 0 .263.03.402.09.69.293.379 1.158.374 1.167-.058.144-.061.207-.005.244l.027.013h.02c.03 0 .07-.014.134-.035.093-.032.235-.08.367-.08a.944.942 0 0 1 .94.93.936.934 0 0 1-.94.928zm7.302-4.171c-1.138-.98-3.768-3.24-4.481-3.77-.406-.302-.685-.462-.928-.533a1.559 1.554 0 0 0-.456-.07c-.182 0-.376.032-.58.095-.46.145-.918.505-1.362.854l-.023.018c-.414.324-.84.66-1.164.73a1.986 1.98 0 0 1-.43.049c-.362 0-.687-.104-.81-.258-.02-.025-.007-.066.04-.125l.008-.008 1-1.067c.783-.774 1.525-1.506 3.23-1.545h.085c1.062 0 2.12.469 2.24.524a7.03 7.03 0 0 0 3.056.724c1.076 0 2.188-.263 3.354-.795a9.135 9.11 0 0 0-.405-.317c-1.025.44-2.003.66-2.946.66-.962 0-1.925-.229-2.858-.68-.05-.022-1.22-.567-2.44-.57-.032 0-.065 0-.096.002-1.434.033-2.24.536-2.782.976-.528.013-.982.138-1.388.25-.361.1-.673.186-.979.185-.125 0-.35-.01-.37-.012-.35-.01-2.115-.437-3.518-.962-.143.1-.28.203-.415.31 1.466.593 3.25 1.053 3.812 1.089.157.01.323.027.491.027.372 0 .744-.103 1.104-.203.213-.059.446-.123.692-.17l-.196.194-1.017 1.087c-.08.08-.254.294-.14.557a.705.703 0 0 0 .268.292c.243.162.677.27 1.08.271.152 0 .297-.015.43-.044.427-.095.874-.448 1.349-.82.377-.296.913-.672 1.323-.782a1.494 1.49 0 0 1 .37-.05.611.61 0 0 1 .095.005c.27.034.533.125 1.003.472.835.62 4.531 3.815 4.566 3.846.002.002.238.203.22.537-.007.186-.11.352-.294.466a.902.9 0 0 1-.484.15.804.802 0 0 1-.428-.124c-.014-.01-1.28-1.157-1.746-1.543-.074-.06-.146-.115-.22-.115a.122.122 0 0 0-.096.045c-.073.09.01.212.105.294l1.48 1.47c.002 0 .184.17.204.395.012.244-.106.447-.35.606a.957.955 0 0 1-.526.171.766.764 0 0 1-.42-.127l-.214-.206a21.035 20.978 0 0 0-1.08-1.009c-.072-.058-.148-.112-.221-.112a.127.127 0 0 0-.094.038c-.033.037-.056.103.028.212a.698.696 0 0 0 .075.083l1.078 1.198c.01.01.222.26.024.511l-.038.048a1.18 1.178 0 0 1-.1.096c-.184.15-.43.164-.527.164a.8.798 0 0 1-.147-.012c-.106-.018-.178-.048-.212-.089l-.013-.013c-.06-.06-.602-.609-1.054-.98-.059-.05-.133-.11-.21-.11a.128.128 0 0 0-.096.042c-.09.096.044.24.1.293l.92 1.003a.204.204 0 0 1-.033.062c-.033.044-.144.155-.479.196a.91.907 0 0 1-.122.007c-.345 0-.712-.164-.902-.264a1.343 1.34 0 0 0 .13-.576 1.368 1.365 0 0 0-1.42-1.357c.024-.342-.025-.99-.697-1.274a1.455 1.452 0 0 0-.575-.125c-.146 0-.287.025-.42.075a1.153 1.15 0 0 0-.671-.564 1.52 1.515 0 0 0-.494-.085c-.28 0-.537.08-.767.242a1.168 1.165 0 0 0-.903-.43 1.173 1.17 0 0 0-.82.335c-.287-.217-1.425-.93-4.467-1.613a17.39 17.344 0 0 1-.692-.189 4.822 4.82 0 0 0-.077.494l.67.157c3.108.682 4.136 1.391 4.309 1.525a1.145 1.142 0 0 0-.09.442 1.16 1.158 0 0 0 1.378 1.132c.096.467.406.821.879 1.003a1.165 1.162 0 0 0 .415.08c.09 0 .179-.012.266-.034.086.22.282.493.722.668a1.233 1.23 0 0 0 .457.094c.122 0 .241-.022.355-.063a1.373 1.37 0 0 0 1.269.841c.37.002.726-.147.985-.41.221.121.688.341 1.163.341.06 0 .118-.002.175-.01.47-.059.689-.24.789-.382a.571.57 0 0 0 .048-.078c.11.032.234.058.373.058.255 0 .501-.086.75-.265.244-.174.418-.424.444-.637v-.01c.083.017.167.026.251.026.265 0 .527-.082.773-.242.48-.31.562-.715.554-.98a1.28 1.279 0 0 0 .978-.194 1.04 1.04 0 0 0 .502-.808 1.088 1.085 0 0 0-.16-.653c.804-.342 2.636-1.003 4.795-1.483a4.734 4.721 0 0 0-.067-.492 27.742 27.667 0 0 0-5.049 1.62zm5.123-.763c0 4.027-5.166 7.293-11.537 7.293-6.372 0-11.538-3.266-11.538-7.293 0-4.028 5.165-7.293 11.539-7.293 6.371 0 11.537 3.265 11.537 7.293zm.46.004c0-4.272-5.374-7.755-12-7.755S.002 7.277.002 11.55L0 12.004c0 4.533 4.695 8.203 11.999 8.203 7.347 0 12-3.67 12-8.204z"/>
                          </svg>
                          <span className="text-[11px] font-black text-[#009EE3] tracking-tight whitespace-nowrap">Mercado Pago</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Aclaración obligatoria */}
                  <p className="text-[11px] text-slate-500 font-medium leading-tight pt-2 border-t border-slate-200/80 italic w-full">
                    Opciones disponibles según cada comercio. Consultá antes de comprar.
                  </p>
                </div>
              );
            })()}

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Botón de WhatsApp y Nota Aclaratoria */}
          <div className="pt-5 space-y-2.5">
            <a
              href={waUrl}
              data-whatsapp-cta="true"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 px-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.99] text-center"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" />
              <span className="text-center leading-tight">CONSULTAR AL COMERCIO POR WHATSAPP</span>
            </a>

            {/* Nota aclaratoria concisa */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-2.5 text-slate-600 text-[11px] sm:text-xs font-medium leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-[#0047BA] shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-800 font-bold">ON+ conecta a compradores con comercios.</strong> Disponibilidad, pedidos, pagos y entrega se acuerdan directamente con el vendedor.
              </p>
            </div>
          </div>
        </div>

        {/* C. IDENTIDAD DEL COMERCIO Y SELLO DE VISITA (Derecha - 24%) */}
        <div className="lg:w-[24%] p-4 sm:p-5 flex flex-col justify-between bg-slate-50/50 border-t lg:border-t-0 border-slate-100">
          <div className="space-y-4">
            
            {/* Perfil del comercio */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 text-white flex items-center justify-center font-black text-base shadow-2xs shrink-0">
                  {commerce?.logoUrl ? (
                    <img src={commerce.logoUrl} alt={commerceDisplayName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{commerceDisplayName.substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-black text-[#1e293b] text-sm sm:text-base leading-tight uppercase tracking-tight truncate">
                    {commerceDisplayName}
                  </h3>
                  <div className="flex items-center gap-1 text-[#0047BA] mt-0.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs font-bold truncate">{product.cityName}</span>
                  </div>
                  {legalName && (
                    <span className="text-[10px] text-slate-400 font-medium block truncate mt-0.5">
                      Titular: {legalName}
                    </span>
                  )}
                </div>
              </div>

              <Link
                href={`/comercio/${commerce?.slug || 'perfil'}`}
                className="block w-full text-center border-2 border-[#0047BA] text-[#0047BA] hover:bg-blue-50 font-black text-xs uppercase tracking-wider py-2.5 rounded-xl transition-colors"
              >
                Ver comercio →
              </Link>
            </div>

            {/* Sello de verificación presencial destacado */}
            <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 text-emerald-950 shadow-2xs space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="text-xs font-black tracking-wider uppercase text-emerald-900 block leading-tight">
                    COMERCIO VERIFICADO POR ON+
                  </span>
                  <p className="text-xs font-medium text-emerald-800 leading-snug">
                    Verificamos el comercio y sus datos de contacto.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4 flex flex-col items-center justify-center text-center">
            <Link href="/" className="inline-block group" title="ON MÁS - Portal Comercial Regional">
              <div className="relative w-28 h-12 sm:w-32 sm:h-14 flex items-center justify-center">
                <Image
                  src="/logo1.png"
                  alt="ON+ Portal Comercial Regional"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>
            </Link>
          </div>
        </div>

      </div>

      {/* 5. BARRA DE ACCIONES (Guardar, Compartir, Visitas) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm grid grid-cols-3 py-3 px-1 sm:px-6 divide-x divide-slate-200 text-xs sm:text-sm">
        <button 
          onClick={toggleFavorite} 
          className="flex items-center justify-center gap-1 sm:gap-2 font-black text-[#002878] hover:text-[#0047BA] transition-colors px-1 sm:px-4 cursor-pointer"
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span className="truncate">{isFavorite ? 'Guardado' : 'Guardar'}</span>
        </button>
        <button 
          onClick={handleShare} 
          className="flex items-center justify-center gap-1 sm:gap-2 font-black text-[#002878] hover:text-[#0047BA] transition-colors px-1 sm:px-4 cursor-pointer"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="truncate">Compartir</span>
        </button>
        <div className="flex items-center justify-center gap-1 sm:gap-2 font-black text-slate-700 px-1 sm:px-4">
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-[#00ADB5] shrink-0" />
          <span className="truncate">{views} {views === 1 ? 'visita' : 'visitas'}</span>
        </div>
      </div>

      {/* Modal Zoom / Lightbox Pantalla Completa */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setIsZoomOpen(false)}
        >
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute -top-12 right-0 text-white/90 hover:text-white flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-white/15 hover:bg-white/25 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer border border-white/20"
            >
              <X className="w-4 h-4" />
              <span>Cerrar</span>
            </button>

            <img
              src={gallery[activeImageIndex]}
              alt={product.title}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl bg-white/5"
            />
          </div>
        </div>
      )}

      {/* 6. UBICACIÓN O ZONA COMERCIAL DEL COMERCIO */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 p-4 sm:p-5 border-b border-slate-100">
          <MapPin className="w-5 h-5 text-[#002878]" />
          <h3 className="text-base font-black text-[#002878] uppercase tracking-wide">
            {isExactAddress ? 'Ubicación del comercio' : 'Zona comercial & entregas'}
          </h3>
        </div>
        
        {isExactAddress ? (
          <div className="flex flex-col">
            <div className="w-full h-64 bg-slate-100 relative overflow-hidden">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${commerce!.address}, ${product.cityName}, Argentina`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                className="absolute inset-0"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa de ${commerceDisplayName}`}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 gap-4 bg-white">
              <div className="flex items-center gap-2 text-[#1e293b] font-black text-sm">
                <MapPin className="w-5 h-5 text-[#0047BA] shrink-0" />
                <span>{commerce!.address}, {product.cityName}</span>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${commerce!.address}, ${product.cityName}, Argentina`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border-2 border-[#0047BA] text-[#0047BA] hover:bg-blue-50 font-black text-xs uppercase tracking-wide px-5 py-2.5 rounded-xl transition-colors shrink-0"
              >
                CÓMO LLEGAR EN GOOGLE MAPS
              </a>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3 bg-blue-50/70 p-4 rounded-xl border border-blue-100 text-[#0047BA]">
              <Navigation className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-black text-sm sm:text-base text-slate-800">
                  Zona de atención: <span className="text-[#0047BA]">{product.cityName || commerce?.cityName || 'Santa Fe Capital'}</span>
                </p>
                <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                  Este comercio atiende pedidos online, coordina entregas en la zona o no cuenta con local de atención presencial al público.
                </p>
                <p className="text-xs font-bold text-slate-500 pt-1">
                  El punto de retiro o despacho se acuerda directamente con el vendedor por WhatsApp.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 7. DESCRIPCIÓN AMPLIADA */}
      {hasExtendedDescription && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 p-4 sm:p-5 border-b border-slate-100">
            <FileText className="w-5 h-5 text-[#002878]" />
            <h3 className="text-base font-black text-[#002878] uppercase tracking-wide">
              Detalles del producto
            </h3>
          </div>
          <div className="p-5 sm:p-6 text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>
      )}

      {/* 7b. CALIFICACIONES Y OPINIONES DEL PRODUCTO (1 A 5 ESTRELLAS) */}
      <ProductRatingWidget
        productId={product.id || product.slug}
        productTitle={product.title}
      />

      {/* 8. PRODUCTOS RELACIONADOS */}
      {relatedProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#002878]" />
              <h3 className="text-sm sm:text-base font-black text-[#002878] uppercase tracking-wide">
                Más publicaciones en la región
              </h3>
            </div>
            {product.categoryId && (
              <Link href={`/categoria/${product.categoryId}`} className="text-xs font-black text-[#0047BA] hover:underline flex items-center gap-1">
                Ver más →
              </Link>
            )}
          </div>
          
          <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <Link
                key={rel.id}
                href={`/producto/${rel.slug}`}
                className="group flex flex-col gap-2.5"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                  <img
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="flex flex-col flex-1">
                  <h4 className="text-[13px] font-bold text-[#0047BA] line-clamp-2 leading-tight mb-1 group-hover:underline">
                    {rel.title}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    {rel.commerceName} • {rel.cityName}
                  </span>
                  <div className="text-sm sm:text-base font-black text-[#1e293b] mt-auto">
                    {rel.price ? `$${rel.price.toLocaleString('es-AR')} ARS` : 'Consultar'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
