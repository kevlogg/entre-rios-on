'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useSectionCards } from '@/lib/services/section-cards-store';

export function BentoRowOne() {
  const cards = useSectionCards();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="group relative rounded-3xl overflow-hidden shadow-md border border-slate-200 min-h-[220px] flex flex-col justify-end p-6 bg-slate-900"
          >
            <Image
              src={card.image}
              alt={card.title}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative z-10 space-y-2">
              <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>{card.title}</span>
              </h3>
              <p className="text-xs text-slate-200 font-medium line-clamp-2">
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
