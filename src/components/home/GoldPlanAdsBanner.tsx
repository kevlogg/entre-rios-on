'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Crown, Sparkles, ShieldCheck, ArrowRight, MessageCircle, Star } from 'lucide-react';

export function GoldPlanAdsBanner() {
  const goldAds = [
    {
      id: 'gold-ad-1',
      title: 'Bodega & Viñedos La Candelaria',
      subtitle: 'Estuche Trilogía de Vinos Tannat - Cosecha Especial Concordia',
      description: 'Vinos de autor galardonados con entrega a domicilio sin costo en toda la región.',
      city: 'Concordia, Entre Ríos',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
      badge: 'Publicidad Exclusiva Plan Oro',
      phone: '5493454891234',
    },
    {
      id: 'gold-ad-2',
      title: 'Citrus & Dulces Del Uruguay',
      subtitle: 'Pack Regalo Dulces Orgánicos & Miel Pura de Azahar',
      description: 'Productos artesanales 100% autóctonos directos del productor a tu mesa.',
      city: 'Concepción del Uruguay',
      image: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=600&q=80',
      badge: 'Sponsor Oficial Plan Oro',
      phone: '5493442567890',
    }
  ];

  return (
    <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#002878] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-amber-500/30 relative overflow-hidden">
      {/* Background Gold Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-amber-400/10 border border-amber-400/40 text-amber-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-current animate-pulse" />
              <span>Espacio Publicitario Exclusivo • Comercios Plan Oro</span>
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Anunciantes Destacados del Litoral
            </h3>
          </div>

          <Link
            href="/admin"
            className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sumar mi negocio con Plan Oro</span>
          </Link>
        </div>

        {/* Ads Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goldAds.map((ad) => (
            <div
              key={ad.id}
              className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center hover:border-amber-400 transition-all shadow-lg group"
            >
              <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden shrink-0 bg-slate-800">
                <Image
                  src={ad.image}
                  alt={ad.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                  <Star className="w-2.5 h-2.5 fill-current" /> Oro
                </span>
              </div>

              <div className="space-y-2 flex-1 text-left">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{ad.title}</span>
                </div>

                <h4 className="font-extrabold text-sm text-white leading-snug">
                  {ad.subtitle}
                </h4>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {ad.description}
                </p>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-bold">{ad.city}</span>
                  <a
                    href={`https://wa.me/${ad.phone}?text=${encodeURIComponent(`Hola! Vi su anuncio destacado del Plan Oro en ON MÁS y me gustaría consultar.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-md transition-transform active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>Contactar Anunciante</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
