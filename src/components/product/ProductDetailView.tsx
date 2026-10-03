'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Heart, 
  Share2, 
  Star, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Store, 
  CheckCircle2, 
  MessageCircle, 
  ShoppingBag, 
  ShoppingCart, 
  CreditCard, 
  RotateCcw, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  HelpCircle,
  Check,
  Zap,
  Tag,
  Award,
  Clock,
  ThumbsUp,
  Building2,
  Minus,
  Plus
} from 'lucide-react';
import { Product, Commerce } from '@/types';
import { trackSearchQuery } from '@/lib/analytics/events';

interface ProductDetailViewProps {
  product: Product;
  commerce?: Commerce | null;
  relatedProducts?: Product[];
}

export function ProductDetailView({ product, commerce, relatedProducts = [] }: ProductDetailViewProps) {
  // Gallery setup (use product images or construct mock gallery if 1 image)
  const defaultGallery = [
    product.imageUrl,
    '/images/offer-2.jpg',
    '/images/bento-1.jpg',
    '/images/offer-3.jpg',
    '/images/prod-mate.jpg',
  ];
  const gallery = (product.galleryImages && product.galleryImages.length > 0) 
    ? product.galleryImages 
    : [product.imageUrl, ...defaultGallery.slice(1)];

  const [activeImage, setActiveImage] = useState<string>(gallery[0] || product.imageUrl);
  const [selectedVariant, setSelectedVariant] = useState<string>(product.variants?.[0]?.name || 'Gris Metalizado / Estándar');
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showCopiedToast, setShowCopiedToast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'descripcion' | 'caracteristicas' | 'preguntas'>('descripcion');

  // Interactive Questions List
  const [questions, setQuestions] = useState([
    {
      id: 'q1',
      question: '¿Tienen stock disponible para entrega inmediata en la sucursal?',
      answer: `¡Hola! Sí, tenemos stock disponible de ${product.title} en nuestro local de ${product.cityName}. Podés retirar hoy mismo o solicitar envío.`,
      date: 'Hace 2 días',
    },
    {
      id: 'q2',
      question: '¿Hacen envíos a otras localidades de la provincia?',
      answer: '¡Hola! Sí, realizamos envíos a todo el Litoral a través de transporte expreso o encomienda.',
      date: 'Hace 5 días',
    },
  ]);
  const [userQuestionText, setUserQuestionText] = useState('');

  // Check initial favorite status
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
          text: `Mirá este producto en ON MÁS: ${product.title}`,
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setShowCopiedToast(true);
        setTimeout(() => setShowCopiedToast(false), 3000);
      }
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuestionText.trim()) return;

    const newQ = {
      id: `q-${Date.now()}`,
      question: userQuestionText.trim(),
      answer: '¡Hola! Tu pregunta ha sido enviada al comercio. Responderán a la brevedad.',
      date: 'Recién',
    };
    setQuestions([newQ, ...questions]);
    setUserQuestionText('');
  };

  // WhatsApp Tracking URL
  const cleanPhone = product.phoneWhatsApp ? product.phoneWhatsApp.replace(/[^\d]/g, '') : '5493434229876';
  const customMessage = product.whatsappMessageCustom || 
    `Hola ${product.commerceName}, vi en el portal ON MÁS su producto "${product.title}" ($${product.price ? product.price.toLocaleString('es-AR') : 'Consultar'}) y quisiera adquirir ${quantity} unidad(es).`;
  
  const waUrl = `/api/lead/whatsapp?phone=${encodeURIComponent(cleanPhone)}&message=${encodeURIComponent(customMessage)}&commerceId=${encodeURIComponent(product.commerceId)}&productId=${encodeURIComponent(product.id)}&cityId=${encodeURIComponent(product.cityId)}`;

  const price = product.price || 38640;
  const originalPrice = product.originalPrice || Math.round(price * 1.2);
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
  const installmentPrice = Math.round(price / 6);

  // Specs array
  const defaultSpecs = [
    { name: 'Marca', value: product.commerceName },
    { name: 'Modelo', value: 'Edición Oficial 2026' },
    { name: 'Categoría', value: product.category },
    { name: 'Origen / Producción', value: `${product.cityName}, ${product.provinceName || 'Litoral'}` },
    { name: 'Garantía', value: '12 meses oficial del fabricante / comercio' },
    { name: 'Condición', value: product.condition || 'Nuevo' },
  ];
  const specs = product.specs && product.specs.length > 0 ? product.specs : defaultSpecs;

  // Highlights list
  const highlights = product.highlights || [
    `Unidades por pack: ${quantity}`,
    `Venta directa de ${product.commerceName} en ${product.cityName}`,
    `Garantía de calidad garantizada por el Portal ON MÁS`,
    `Entrega inmediata o retiro en sucursal comercial`,
    `Apto para envíos regionales en Entre Ríos y Santa Fe`,
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Toast Notificación Compartir */}
      {showCopiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-cyan-400 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>¡Enlace copiado al portapapeles!</span>
        </div>
      )}

      {/* Breadcrumb Trail */}
      <nav className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-500 bg-white/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <Link href="/" className="hover:text-[#0047BA] transition-colors">Inicio</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/${product.provinceId || 'santa-fe'}`} className="hover:text-[#0047BA] transition-colors">
            {product.provinceName || 'Provincia'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/${product.provinceId || 'santa-fe'}/${product.cityId}`} className="hover:text-[#0047BA] transition-colors">
            {product.cityName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/catalogo?categoria=${product.categoryId || 'todos'}`} className="hover:text-[#0047BA] transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-extrabold truncate max-w-[200px] sm:max-w-[300px]">{product.title}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-slate-600 hover:text-[#0047BA] transition-colors text-xs font-bold"
          >
            <Share2 className="w-4 h-4 text-[#00ADB5]" />
            <span>Compartir</span>
          </button>
        </div>
      </nav>

      {/* CONTENEDOR PRINCIPAL: Grilla estilo MercadoLibre */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA 1: Galería de Imágenes (Thumbnails a la izquierda + Visor Principal) */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row gap-4">
            
            {/* Tira de Miniaturas Vertical */}
            <div className="flex sm:flex-col gap-2.5 order-2 sm:order-1 overflow-x-auto sm:overflow-y-auto max-h-[460px] scrollbar-none shrink-0">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50 cursor-pointer ${
                    activeImage === imgUrl
                      ? 'border-[#0047BA] ring-2 ring-[#00ADB5]/30 scale-105 shadow-md'
                      : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.title} vista ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Visor Principal de Imagen */}
            <div className="flex-1 order-1 sm:order-2 relative h-80 sm:h-[460px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 group shadow-inner">
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Badges Flotantes sobre Imagen */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {product.isFeatured && (
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Destacado ON MÁS
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                    ↓ {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Botón Favoritos en la esquina de la foto */}
              <button
                onClick={toggleFavorite}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-600 hover:text-rose-500 transition-colors"
                title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

          </div>

          {/* COLUMNA 2: Información Central del Producto & Especificaciones Clave */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Subtítulo & Favoritos */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-extrabold">{product.condition || 'Nuevo'}</span>
                <span>•</span>
                <span className="text-cyan-700 font-extrabold">+{product.salesCount || 120} vendidos</span>
              </div>

              <div className="flex items-center gap-1 text-amber-500">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-black text-slate-800 ml-1">4.8</span>
                <span className="text-slate-400 font-normal">({product.reviewCount || 34})</span>
              </div>
            </div>

            {/* Título Principal */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                {product.title}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Categoría:</span>
                <span className="text-xs font-black text-[#0047BA] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Bloque de Precio MercadoLibre Style */}
            <div className="space-y-2 bg-gradient-to-br from-slate-50 to-blue-50/30 p-5 rounded-2xl border border-slate-200">
              
              {originalPrice > price && (
                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold line-through">
                  <span>${originalPrice.toLocaleString('es-AR')} ARS</span>
                </div>
              )}

              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  ${price.toLocaleString('es-AR')}
                </span>
                <span className="text-sm font-extrabold text-[#0047BA]">ARS</span>
                {discountPercent > 0 && (
                  <span className="text-xs font-black text-emerald-600 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                    ↓ {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Cuotas sin interés */}
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 pt-1">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Mismo precio en <strong>6 cuotas de ${installmentPrice.toLocaleString('es-AR')}</strong></span>
              </div>

              {/* Cupón / Descuento extra */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-1.5 bg-cyan-100/80 border border-cyan-300 text-[#0047BA] px-3 py-1 rounded-xl text-xs font-extrabold shadow-2xs">
                  <Tag className="w-3.5 h-3.5 text-[#00ADB5]" />
                  <span>5% OFF pagando por Transferencia Directa al Comercio</span>
                </div>
              </div>
            </div>

            {/* Variantes (Ej. Color / Presentación) */}
            <div className="space-y-2.5">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                Variante / Presentación: <span className="text-[#0047BA]">{selectedVariant}</span>
              </label>

              <div className="flex flex-wrap gap-2">
                {['Gris Metalizado / Estándar', 'Negro Mate', 'Edición Especial'].map((vName) => (
                  <button
                    key={vName}
                    onClick={() => setSelectedVariant(vName)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      selectedVariant === vName
                        ? 'border-[#0047BA] bg-blue-50 text-[#0047BA] ring-2 ring-[#00ADB5]/30'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {vName}
                  </button>
                ))}
              </div>
            </div>

            {/* Lo que tenés que saber de este producto (Bullet points estilo ML) */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#00ADB5]" />
                Lo que tenés que saber de este producto
              </h3>
              
              <ul className="space-y-2 text-xs font-bold text-slate-700">
                {highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#00ADB5] font-black">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  const el = document.getElementById('seccion-caracteristicas');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-extrabold text-[#0047BA] hover:text-[#002878] transition-colors underline pt-1 block"
              >
                Ver todas las características →
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* BLOQUE DE COMPRA & REPUTACIÓN DEL VENDEDOR (Buy Box & Seller Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: Buy Box (Caja de Compra y Botones) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-6">
          
          {/* Beneficios de Envío */}
          <div className="space-y-3 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-emerald-700 block">
                  Envío a domicilio disponible en {product.cityName} y región
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Coordinación directa con {product.commerceName} sin comisiones extras.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Store className="w-5 h-5 text-[#0047BA] shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  Retiralo gratis en el local de {product.commerceName}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Ubicación: {product.cityName}, {product.provinceName || 'Litoral'}
                </span>
              </div>
            </div>
          </div>

          {/* Stock y Selector de Cantidad */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-black text-slate-900 block">Stock disponible</span>
              <span className="text-[11px] text-slate-500 font-bold">
                Almacenado y provisto por {product.commerceName} (+{product.stock || 15} disponibles)
              </span>
            </div>

            {/* Selector + / - */}
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-black"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-black text-slate-900 px-2">{quantity} u.</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-black"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* BOTONES PRINCIPALES DE ACCIÓN */}
          <div className="space-y-3">
            
            {/* Botón Directo WhatsApp (CTA Principal ON MÁS) */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-95 cursor-pointer text-center"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Pedir / Comprar por WhatsApp</span>
            </a>

            {/* Botones Secundarios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#0047BA] hover:bg-[#002878] text-white py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all text-center cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Comprar Ahora</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  alert(`¡Producto "${product.title}" agregado al carrito de ${product.commerceName}!`);
                }}
                className="w-full bg-cyan-50 hover:bg-cyan-100 text-[#0047BA] border border-[#00ADB5] py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-[#00ADB5]" />
                <span>Agregar al Carrito</span>
              </button>
            </div>

          </div>

          {/* Garantías e Insignias de Confianza */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs font-bold text-slate-600">
            <div className="flex items-start gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#0047BA] shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-900 font-extrabold">Devolución gratis:</span>
                <span className="text-slate-500 font-medium ml-1">Tenés 30 días desde que lo recibís para cambios directos.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-900 font-extrabold">Compra Protegida ON MÁS:</span>
                <span className="text-slate-500 font-medium ml-1">Recibí el producto que esperabas o te devolvemos tu dinero.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-900 font-extrabold">Garantía oficial:</span>
                <span className="text-slate-500 font-medium ml-1">Respaldada por {product.commerceName}.</span>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: Ficha de Reputación del Comercio (MercadoLíder Style) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-5">
            
            {/* Header del Comercio */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-2xs">
                <img
                  src={commerce?.logoUrl || product.imageUrl}
                  alt={product.commerceName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="truncate flex-1">
                <Link
                  href={`/comercio/${commerce?.slug || 'alfareria-ceramica-delta'}`}
                  className="text-sm font-black text-slate-900 hover:text-[#0047BA] transition-colors block truncate"
                >
                  {product.commerceName}
                </Link>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" />
                  <span>{product.cityName}</span>
                  {commerce?.isVerified && (
                    <span className="inline-flex items-center gap-0.5 text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-extrabold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verificado
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Termómetro de Reputación (Barra de 5 Niveles estilo MercadoLíder) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-800">
                <span className="flex items-center gap-1 text-[#0047BA]">
                  <Award className="w-4 h-4 text-amber-500" />
                  Comercio Líder ON MÁS
                </span>
                <span className="text-[10px] text-emerald-700 font-black uppercase">Excelente reputación</span>
              </div>

              {/* Barra de 5 Niveles */}
              <div className="grid grid-cols-5 gap-1.5 h-2.5">
                <div className="bg-rose-200 rounded-l-full" />
                <div className="bg-orange-200" />
                <div className="bg-amber-200" />
                <div className="bg-emerald-300" />
                <div className="bg-emerald-600 rounded-r-full ring-2 ring-emerald-500/40" />
              </div>

              <p className="text-[11px] text-slate-500 font-bold text-center">
                ¡Uno de los mejores comercios adheridos del portal en {product.cityName}!
              </p>
            </div>

            {/* Métricas de Desempeño */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-sm font-black text-slate-900 block">+{commerce?.reviewCount ? commerce.reviewCount * 10 : 500}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Ventas realizadas</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <ThumbsUp className="w-4 h-4 text-emerald-600 mx-auto mb-0.5" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">Buena atención</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Clock className="w-4 h-4 text-[#00ADB5] mx-auto mb-0.5" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">Despacho a tiempo</span>
              </div>
            </div>

            {/* Botón Ver Perfil del Vendedor */}
            <Link
              href={`/comercio/${commerce?.slug || 'alfareria-ceramica-delta'}`}
              className="w-full bg-slate-100 hover:bg-slate-200 text-[#0047BA] py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors text-center block"
            >
              <span>Ir a la página del vendedor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

          </div>

          {/* Card de Medios de Pago */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#00ADB5]" />
              Medios de Pago Aceptados
            </h4>

            <div className="space-y-2 text-xs font-bold text-slate-700">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span>Mercado Pago & QR</span>
                <span className="text-emerald-600 font-extrabold">Aprobación Inmediata</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span>Tarjetas de Crédito / Débito</span>
                <span className="text-slate-500 font-medium">Hasta 6 cuotas</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span>Efectivo en local / Transferencia</span>
                <span className="text-[#0047BA] font-extrabold">5% OFF Extra</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* SECCIÓN INFERIOR 1: Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#00ADB5]" />
              <span>Productos relacionados</span>
            </h3>
            <Link
              href={`/catalogo?categoria=${product.categoryId || 'todos'}`}
              className="text-xs font-black text-[#0047BA] hover:underline flex items-center gap-1"
            >
              <span>Ver más en {product.category}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedProducts.slice(0, 5).map((rel) => (
              <Link
                key={rel.id}
                href={`/producto/${rel.slug}`}
                className="group bg-slate-50 hover:bg-white rounded-2xl p-3 border border-slate-200 hover:border-[#00ADB5] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative h-32 w-full bg-white rounded-xl overflow-hidden mb-2.5">
                  <img
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-[#0047BA] transition-colors leading-tight">
                    {rel.title}
                  </span>
                  
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      ${rel.price ? rel.price.toLocaleString('es-AR') : 'Consultar'}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">Envío disponible</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SECCIÓN INFERIOR 2: Descripción Detallada */}
      <section id="seccion-descripcion" className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Descripción del Producto
        </h3>
        
        <div className="text-sm font-medium text-slate-700 leading-relaxed space-y-3 whitespace-pre-line">
          <p>{product.description}</p>
          <p>
            Comercializado y provisto directamente por <strong>{product.commerceName}</strong> en la localidad de <strong>{product.cityName}</strong>. Todos los productos cuentan con respaldo de calidad y atención directa por WhatsApp sin intermediación de comisiones.
          </p>
        </div>
      </section>

      {/* SECCIÓN INFERIOR 3: Tabla de Características Técnicas */}
      <section id="seccion-caracteristicas" className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
          Características Técnicas del Producto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs font-bold divide-y md:divide-y-0">
          {specs.map((spec, idx) => (
            <div key={idx} className="flex justify-between py-2.5 border-b border-slate-100">
              <span className="text-slate-500 font-extrabold">{spec.name}</span>
              <span className="text-slate-900 font-black text-right">{spec.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN INFERIOR 4: Preguntas y Respuestas (Q&A Estilo MercadoLibre) */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#00ADB5]" />
          Preguntas y Respuestas
        </h3>

        {/* Formulario de Preguntas */}
        <form onSubmit={handleAddQuestion} className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            Preguntale a {product.commerceName}:
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Escribí tu pregunta sobre el producto, envíos o formas de pago..."
              value={userQuestionText}
              onChange={(e) => setUserQuestionText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
            />
            <button
              type="submit"
              disabled={!userQuestionText.trim()}
              className="bg-[#0047BA] hover:bg-[#002878] disabled:opacity-50 text-white font-black px-6 py-3 rounded-2xl text-xs shadow-md transition-all cursor-pointer shrink-0"
            >
              Preguntar
            </button>
          </div>
        </form>

        {/* Lista de Preguntas Respondidas */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Últimas preguntas realizadas:</h4>
          
          {questions.map((q) => (
            <div key={q.id} className="space-y-1.5 text-xs border-b border-slate-100 pb-3">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Q: {q.question}</span>
                <span className="text-[10px] text-slate-400 font-normal">{q.date}</span>
              </div>
              <div className="text-slate-600 font-medium pl-3 border-l-2 border-[#00ADB5] bg-cyan-50/50 p-2 rounded-r-xl">
                <span className="font-extrabold text-[#0047BA] block text-[11px]">{product.commerceName}:</span>
                <span>{q.answer}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MOBILE BARRA FIJA DE COMPRA (Sticky Bottom Bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block">Precio Oficial</span>
          <span className="text-base font-black text-slate-900">${price.toLocaleString('es-AR')} ARS</span>
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-4 rounded-xl font-black text-xs flex items-center gap-2 shadow-md cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Comprar por WhatsApp</span>
        </a>
      </div>

    </div>
  );
}
