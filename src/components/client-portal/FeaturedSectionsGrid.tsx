'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Palmtree, 
  Building2, 
  Percent, 
  Gift, 
  Briefcase, 
  Globe 
} from 'lucide-react';
import { useSectionCards } from '@/lib/services/section-cards-store';

function getCardIcon(id: string = '', title: string = '') {
  const lower = (id + ' ' + title).toLowerCase();
  if (lower.includes('turism')) return Palmtree;
  if (lower.includes('comerc') || lower.includes('industr')) return Building2;
  if (lower.includes('ofert') || lower.includes('descuent') || lower.includes('promoc')) return Percent;
  if (lower.includes('sorteo') || lower.includes('premio')) return Gift;
  if (lower.includes('empleo') || lower.includes('aviso') || lower.includes('laboral')) return Briefcase;
  return Globe;
}

export function FeaturedSectionsGrid() {
  const cards = useSectionCards();

  if (!cards || cards.length === 0) return null;

  return (
    <section id="secciones-destacadas" className="w-full pt-1 pb-3">
      {/* Title matching mockup: Descubrí todo lo que podés hacer en ON+ */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm sm:text-base lg:text-lg font-black text-slate-900">
          Descubrí todo lo que podés hacer en ON+
        </h2>
      </div>

      {/* Dynamic Visual Cards Grid loaded from SuperAdmin */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {cards.map((card, index) => {
          const IconComp = getCardIcon(card.id, card.title);

          return (
            <Link
              key={card.id || `section-card-${index}`}
              href={card.href || '/'}
              className="group relative flex flex-col justify-end h-32 sm:h-36 lg:h-40 rounded-xl overflow-hidden shadow-2xs hover:shadow-lg transition-all border border-slate-200 cursor-pointer bg-slate-900"
            >
              {/* Background Photo from SuperAdmin */}
              <img
                src={card.image || '/images/bento-1.jpg'}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              {/* Bottom Badge with Icon and Title */}
              <div className="relative z-10 p-2 sm:p-2.5 flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 text-white">
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] sm:text-xs font-black text-white leading-tight drop-shadow-md group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {card.title}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
