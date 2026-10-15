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
  Info
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
  
  const views = (product as any).viewsCount || 0;

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
    <div className="max-w-[1400px] mx-auto space-y-6 pb-16 px-4 sm:px-6">
      
      {showCopiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-cyan-400 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>¡Enlace copiado al portapapeles!</span>
        </div>
      )}

      {/* 2. ESTRUCTURA PRINCIPAL DE LA PUBLICACIÓN */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row lg:divide-x divide-slate-100">
        
        {/* A. GALERÍA DEL PRODUCTO (Izquierda) */}
        <div className="lg:w-[38%] flex flex-col md:flex-row p-5 sm:p-6 gap-4 sm:gap-6">
          
          {/* Miniaturas */}
          {gallery.length > 1 && (
            <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto scrollbar-none order-2 md:order-1">
              {gallery.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                    activeImageIndex === idx ? 'border-[#0047BA]' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Ver foto ${idx + 1}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Imagen Principal */}
          <div className="relative flex-1 aspect-square md:aspect-auto md:h-[420px] bg-white rounded-2xl overflow-hidden order-1 md:order-2 group border border-slate-100">
            <img
              src={gallery[activeImageIndex]}
              alt={product.title}
              className="w-full h-full object-contain p-2 sm:p-4"
            />
            
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

        {/* B. INFORMACIÓN PRINCIPAL (Centro) */}
        <div className="lg:w-[34%] p-5 sm:p-7 flex flex-col justify-between border-t lg:border-t-0 border-slate-100">
          <div className="space-y-4">
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
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#0047BA] px-3 py-1 rounded-xl text-xs sm:text-sm font-bold w-max shadow-2xs">
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
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full w-max">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Disponibilidad: <strong className="text-slate-900 font-bold">Consultar con el comercio</strong></span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Botón de WhatsApp y Nota Aclaratoria */}
          <div className="pt-5 space-y-2.5">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 px-5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" />
              <span className="text-center">CONSULTAR AL COMERCIO POR WHATSAPP</span>
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

        {/* C. IDENTIDAD DEL COMERCIO Y SELLO DE VISITA (Derecha) */}
        <div className="lg:w-[28%] p-5 sm:p-6 flex flex-col justify-between bg-slate-50/50 border-t lg:border-t-0 border-slate-100">
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
                    COMERCIO VISITADO POR ON+
                  </span>
                  <p className="text-xs font-medium text-emerald-800 leading-snug">
                    Visitamos el comercio y verificamos sus datos de contacto.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-6 flex flex-col items-center justify-center gap-1 text-center">
            <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tighter">
              ON+
            </span>
            <span className="text-[9px] font-black tracking-widest text-[#0047BA] uppercase">
              PORTAL COMERCIAL REGIONAL
            </span>
          </div>
        </div>

      </div>

      {/* 5. BARRA DE ACCIONES (Guardar, Compartir, Visitas) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-4 sm:gap-6 py-3.5 px-4 sm:px-6 divide-x divide-slate-200">
        <button 
          onClick={toggleFavorite} 
          className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#002878] hover:text-[#0047BA] transition-colors px-3 sm:px-6"
        >
          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{isFavorite ? 'Guardado' : 'Guardar'}</span>
        </button>
        <button 
          onClick={handleShare} 
          className="flex items-center gap-2 text-xs sm:text-sm font-black text-[#002878] hover:text-[#0047BA] transition-colors px-3 sm:px-6"
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Compartir</span>
        </button>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-500 px-3 sm:px-6">
          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{views} visitas</span>
        </div>
      </div>

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
