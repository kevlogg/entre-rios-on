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
  ShoppingBag
} from 'lucide-react';
import { Product, Commerce } from '@/types';

interface ProductDetailViewProps {
  product: Product;
  commerce?: Commerce | null;
  relatedProducts?: Product[];
}

export function ProductDetailView({ product, commerce, relatedProducts = [] }: ProductDetailViewProps) {
  // Gallery setup
  const gallery = (product.galleryImages && product.galleryImages.length > 0) 
    ? product.galleryImages 
    : [product.imageUrl];

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showCopiedToast, setShowCopiedToast] = useState<boolean>(false);
  
  // En producción, esto debería venir de product.viewsCount
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

  // WhatsApp Tracking URL
  const cleanPhone = product.phoneWhatsApp 
    ? product.phoneWhatsApp.replace(/[^\d]/g, '') 
    : (commerce?.phoneWhatsApp ? commerce.phoneWhatsApp.replace(/[^\d]/g, '') : '5493434229876');
  
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://onmas.com.ar/producto/${product.id}`;
  const customMessage = `Hola, vi tu publicación "${product.title}" de ${product.commerceName} en ON+ Portal Comercial. Quisiera recibir más información. Enlace: ${currentUrl}`;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`;

  const price = product.price; 
  const hasExtendedDescription = product.description && product.description.length > 50;

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
        <div className="lg:w-[45%] flex flex-col md:flex-row p-6 gap-6">
          
          {/* Miniaturas */}
          {gallery.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto scrollbar-none order-2 md:order-1">
              {gallery.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all bg-white ${
                    activeImageIndex === idx ? 'border-[#0047BA]' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Imagen Principal */}
          <div className="relative flex-1 aspect-square md:aspect-auto md:h-[400px] bg-white rounded-2xl overflow-hidden order-1 md:order-2 group">
            <img
              src={gallery[activeImageIndex]}
              alt={product.title}
              className="w-full h-full object-contain p-2"
            />
            
            {gallery.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-700 hover:text-[#0047BA] transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-700 hover:text-[#0047BA] transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Indicadores */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {gallery.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-2 rounded-full transition-all ${activeImageIndex === idx ? 'w-6 bg-[#0047BA]' : 'w-2 bg-slate-300'}`} 
                    />
                  ))}
                </div>
              </>
            )}

            {/* Favoritos y Compartir (Top Right) */}
            <div className="absolute top-4 right-4 flex gap-3">
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-[#0047BA] transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={toggleFavorite}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* B. INFORMACIÓN PRINCIPAL (Centro) */}
        <div className="lg:w-[35%] p-6 lg:p-10 flex flex-col justify-center border-t lg:border-t-0 border-slate-100">
          <div className="space-y-5">
            <h1 className="text-[28px] font-black text-[#1e293b] leading-tight tracking-tight">
              {product.title}
            </h1>
            
            {price ? (
              <div className="text-[32px] font-black text-[#002878] flex items-baseline gap-2 tracking-tight">
                ${price.toLocaleString('es-AR')}
                <span className="text-lg font-black uppercase">ARS</span>
              </div>
            ) : (
              <div className="text-2xl font-black text-slate-500 flex items-baseline gap-2 tracking-tight">
                Consultar precio
              </div>
            )}

            <p className="text-base text-slate-600 leading-relaxed font-medium">
              {product.description}
            </p>

            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-max inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 px-8 rounded-full font-black text-sm uppercase tracking-wider shadow-md transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>PEDIR POR WHATSAPP</span>
              </a>
            </div>
          </div>
        </div>

        {/* C. IDENTIDAD DEL SUSCRIPTOR (Derecha) */}
        <div className="lg:w-[20%] p-6 lg:p-8 flex flex-col justify-center bg-white border-t lg:border-t-0 border-slate-100">
          <div className="space-y-6">
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
                {commerce?.logoUrl ? (
                  <img src={commerce.logoUrl} alt={product.commerceName} className="w-full h-full object-cover" />
                ) : (
                  <span>{product.commerceName?.substring(0, 2).toUpperCase() || 'ON'}</span>
                )}
              </div>
              <div>
                <h3 className="font-black text-[#1e293b] text-base leading-tight uppercase tracking-wide">
                  {product.commerceName}
                </h3>
                <div className="flex items-center gap-1 text-[#0047BA] mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{product.cityName}</span>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                  Publicación comercial
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2 bg-[#e6f4ea] text-[#137333] border border-[#ceead6] px-4 py-2.5 rounded-xl">
                <CheckCircle2 className="w-5 h-5 fill-current text-white" />
                <span className="text-xs font-black tracking-wide uppercase">COMERCIO VERIFICADO</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest hidden">
                Identidad comercial validada por ON+.
              </p>
            </div>

            <Link
              href={`/comercio/${commerce?.slug || 'perfil'}`}
              className="block w-full text-center border border-[#0047BA] text-[#0047BA] font-black text-xs uppercase tracking-wider py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Ver comercio →
            </Link>

            <div className="pt-6 flex flex-col items-center justify-center gap-1 text-center">
               <span className="font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tighter">
                 ON+
               </span>
               <span className="text-[9px] font-black tracking-widest text-[#0047BA] uppercase">
                 ON+ PORTAL COMERCIAL
               </span>
            </div>
          </div>
        </div>

      </div>

      {/* 5. BARRA DE ACCIONES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-6 py-4 px-6 divide-x divide-slate-200">
        <button onClick={toggleFavorite} className="flex items-center gap-2 text-sm font-black text-[#002878] hover:text-[#0047BA] transition-colors px-6">
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#002878]' : ''}`} />
          <span>Guardar</span>
        </button>
        <button onClick={handleShare} className="flex items-center gap-2 text-sm font-black text-[#002878] hover:text-[#0047BA] transition-colors px-6">
          <Share2 className="w-5 h-5" />
          <span>Compartir</span>
        </button>
        <div className="flex items-center gap-2 text-sm font-black text-slate-500 px-6">
          <Eye className="w-5 h-5" />
          <span>{views} visitas</span>
        </div>
      </div>

      {/* 6. UBICACIÓN DEL COMERCIO */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 p-5 border-b border-slate-100">
          <MapPin className="w-5 h-5 text-[#002878]" />
          <h3 className="text-base font-black text-[#002878] uppercase tracking-wide">
            Ubicación del comercio
          </h3>
        </div>
        
        {commerce?.address ? (
          <div className="flex flex-col">
            <div className="w-full h-64 bg-slate-100 relative overflow-hidden">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${commerce.address}, ${product.cityName}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                className="absolute inset-0"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between p-5 gap-4">
              <div className="flex items-center gap-2 text-[#1e293b] font-black text-sm">
                <MapPin className="w-5 h-5 text-[#0047BA]" />
                <span>{commerce.address}, {product.cityName}</span>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${commerce.address}, ${product.cityName}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white border-2 border-[#0047BA] text-[#0047BA] hover:bg-blue-50 font-black text-xs uppercase tracking-wide px-5 py-2.5 rounded-xl transition-colors shrink-0"
              >
                CÓMO LLEGAR EN GOOGLE MAPS
              </a>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100 text-[#0047BA]">
              <Navigation className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-black text-sm">Servicio a domicilio / Atención online</p>
                <p className="text-xs font-bold opacity-80 mt-1">Este comercio gestiona envíos o servicios directamente en tu ubicación dentro de {product.cityName}.</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 7. DESCRIPCIÓN AMPLIADA */}
      {hasExtendedDescription && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 p-5 border-b border-slate-100">
            <FileText className="w-5 h-5 text-[#002878]" />
            <h3 className="text-base font-black text-[#002878] uppercase tracking-wide">
              Descripción
            </h3>
          </div>
          <div className="p-6 text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>
      )}

      {/* 8. PRODUCTOS RELACIONADOS */}
      {relatedProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#002878]" />
              <h3 className="text-base font-black text-[#002878] uppercase tracking-wide">
                Productos relacionados
              </h3>
            </div>
            <Link href={`/categoria/${product.categoryId}`} className="text-xs font-black text-[#0047BA] hover:underline flex items-center gap-1">
              Ver más en {product.category} →
            </Link>
          </div>
          
          <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <Link
                key={rel.id}
                href={`/producto/${rel.slug}`}
                className="group flex flex-col gap-3"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                  <img
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex flex-col flex-1">
                  <h4 className="text-[13px] font-bold text-[#0047BA] line-clamp-2 leading-tight mb-1">
                    {rel.title}
                  </h4>
                  <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Nuevo</span>
                  <div className="text-base font-black text-[#1e293b] mt-auto">
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
