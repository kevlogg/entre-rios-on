'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, MessageCircle, ArrowRight } from 'lucide-react';
import { trackWhatsAppClick } from '@/lib/analytics/events';

interface OfferItem {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  phoneWhatsApp: string;
}

const CLIENT_OFFERS: OfferItem[] = [
  {
    id: 'off-1',
    title: 'Zapatillas Urbanas',
    location: 'Paraná',
    price: 59900,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
    phoneWhatsApp: '5493434229876',
  },
  {
    id: 'off-2',
    title: 'Cafetera Espresso',
    location: 'Concordia',
    price: 125000,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebe02f2a6ee?auto=format&fit=crop&q=80&w=800',
    phoneWhatsApp: '5493454112233',
  },
  {
    id: 'off-3',
    title: 'Juego de Comedor',
    location: 'Gualeguaychú',
    price: 420000,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800',
    phoneWhatsApp: '5493446584321',
  },
  {
    id: 'off-4',
    title: 'iPhone 15 128 GB',
    location: 'Paraná',
    price: 1250000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800',
    phoneWhatsApp: '5493434229876',
  },
  {
    id: 'off-5',
    title: 'Silla Nórdica',
    location: 'Concepción del Uruguay',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800',
    phoneWhatsApp: '5493442445566',
  },
  {
    id: 'off-6',
    title: 'Vino Malbec Reserva - Bodega Entrerriana',
    location: 'Bodega Entrerriana',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
    phoneWhatsApp: '5493446584321',
  },
];

export function FeaturedOffersGrid() {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleWhatsApp = (item: OfferItem) => {
    trackWhatsAppClick(item.id, 'commerce-client', item.title, item.location);
    const cleanPhone = item.phoneWhatsApp.replace(/[^\d]/g, '');
    const msg = encodeURIComponent(`Hola, vi en el Portal Entre Ríos ON el producto "${item.title}" por ${formatPrice(item.price)} y me gustaría comprarlo.`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="ofertas-destacadas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Section Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
          <span>Ofertas</span>
          <span className="text-[#00a859]">destacadas</span>
        </h2>
        <a href="#ofertas" className="text-xs font-bold text-[#005691] hover:text-[#00a859] flex items-center gap-1">
          <span>Ver todas las ofertas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
        {CLIENT_OFFERS.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image & Heart button */}
              <div className="relative h-44 w-full bg-slate-50 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 16vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-md text-slate-400 hover:text-red-500 transition-colors shadow-xs"
                  aria-label="Agregar a favoritos"
                >
                  <Heart className={`w-4 h-4 ${favorites[item.id] ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              {/* Text info */}
              <div className="p-3 space-y-1">
                <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#00a859] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] font-medium text-slate-400">
                  {item.location}
                </p>
              </div>
            </div>

            {/* Price & Green Cart CTA Button */}
            <div className="p-3 pt-0 flex items-center justify-between mt-2">
              <span className="text-sm font-extrabold text-slate-900">
                {formatPrice(item.price)}
              </span>

              <button
                onClick={() => handleWhatsApp(item)}
                className="bg-[#00a859] hover:bg-[#008746] text-white p-2 rounded-xl transition-all active:scale-95 shadow-xs"
                title="Pedir por WhatsApp"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
