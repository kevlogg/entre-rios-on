'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Users, Gift } from 'lucide-react';

export function BentoRowOne() {
  const cards = [
    {
      id: 'comercio-digital',
      title: 'COMERCIO DIGITAL',
      subtitle: 'Miles de productos y servicios en Entre Ríos.',
      cta: 'Comprar ahora',
      href: '#ofertas-destacadas',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=800',
      badgeIcon: ShoppingBag,
    },
    {
      id: 'comunidad-on',
      title: 'COMUNIDAD ON',
      titleHighlight: 'ON',
      subtitle: 'Conectate, compartí y hacé crecer lo nuestro.',
      cta: 'Sumate',
      href: '#comunidad',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
      badgeIcon: Users,
    },
    {
      id: 'sorteos-on',
      title: 'SORTEOS ON',
      titleHighlight: 'ON',
      subtitle: 'Todos los meses, nuevos premios.',
      cta: 'Quiero participar',
      href: '#sorteos',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800',
      badgeIcon: Gift,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="group relative rounded-3xl overflow-hidden shadow-md border border-slate-200 min-h-[220px] flex flex-col justify-end p-6 bg-slate-900"
          >
            {/* Background Image */}
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            {/* Content */}
            <div className="relative z-10 space-y-2">
              <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>{card.title}</span>
              </h3>
              <p className="text-xs text-slate-200 font-medium line-clamp-2">
                {card.subtitle}
              </p>

              <div className="pt-2">
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-[#00a859] backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl transition-all border border-white/30"
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
