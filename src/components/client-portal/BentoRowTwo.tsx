'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Factory, Compass, Car, Store } from 'lucide-react';

export function BentoRowTwo() {
  const cards = [
    {
      id: 'industria',
      title: 'INDUSTRIA Y NEGOCIOS',
      subtitle: 'Empresas, producción y desarrollo en Entre Ríos.',
      cta: 'Conocé más',
      href: '#industria',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'turismo',
      title: 'TURISMO',
      subtitle: 'Descubrí experiencias únicas en Entre Ríos.',
      cta: 'Explorá',
      href: '#turismo',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'clasificados',
      title: 'CLASIFICADOS ON',
      titleHighlight: 'ON',
      subtitle: 'Comprá o vendé de forma simple y segura.',
      cta: 'Ver clasificados',
      href: '#clasificados',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'publica',
      title: 'PUBLICÁ TU NEGOCIO',
      subtitle: 'Llegá a miles de clientes en toda la provincia.',
      cta: 'Quiero publicar',
      href: '#sumar-comercio',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            {/* Content */}
            <div className="relative z-10 space-y-2">
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                {card.title}
              </h3>
              <p className="text-xs text-slate-200 font-medium line-clamp-2">
                {card.subtitle}
              </p>

              <div className="pt-2">
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-[#00a859] backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all border border-white/30"
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
