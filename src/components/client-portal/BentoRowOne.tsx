'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useSectionCards } from '@/lib/services/section-cards-store';

export function BentoRowOne() {
  const cards = useSectionCards();
  const half = Math.ceil(cards.length / 2);
  const rowOneCards = cards.slice(0, half > 0 ? half : 4);

  return (
    <section className="max-w-7xl mx-auto px-3 min-[360px]:px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
      {/* Vista Mobile: Scroll Horizontal con cards de 270px de alto, la siguiente asoma a la derecha */}
      <div className="flex sm:hidden overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none gap-3.5 pb-2">
        {cards.map((card) => (
          <div
            key={card.id}
            className="group relative rounded-2xl overflow-hidden shadow-md border border-slate-200 h-[270px] w-[82vw] max-w-[320px] shrink-0 snap-start flex flex-col justify-end p-5 bg-slate-900"
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="(max-width: 640px) 88vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            {/* Oscurecimiento suave detrás del texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5 [text-shadow:0_2px_8px_rgba(0,0,0,0.75)]">
                <span>{card.title}</span>
              </h3>
              <p className="text-xs text-white/90 font-medium line-clamp-2 [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
                {card.subtitle}
              </p>

              <div className="pt-2">
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#00ADB5] to-[#007C8A] hover:from-[#00E5E8] hover:to-[#00ADB5] backdrop-blur-md text-white text-xs font-black px-3.5 py-1.5 rounded-xl transition-all shadow-md active:scale-95"
                >
                  <span>{card.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Vista Desktop / Tablet: Grid de 4 columnas (Primera Fila) */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rowOneCards.map((card) => (
          <div
            key={card.id}
            className="group relative rounded-3xl overflow-hidden shadow-md border border-slate-200 min-h-[220px] flex flex-col justify-end p-6 bg-slate-900"
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />

            <div className="relative z-10 space-y-2">
              <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5 [text-shadow:0_2px_8px_rgba(0,0,0,0.75)]">
                <span>{card.title}</span>
              </h3>
              <p className="text-xs text-white font-semibold line-clamp-2 [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
                {card.subtitle}
              </p>

              <div className="pt-2">
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-gradient-to-r hover:from-[#00ADB5] hover:to-[#007C8A] backdrop-blur-md text-white text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition-all border border-white/30"
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
