'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Palmtree, 
  Building2, 
  Percent, 
  Gift, 
  Briefcase, 
  Globe 
} from 'lucide-react';

export const FEATURED_SECTIONS = [
  {
    id: 'turismo-regional',
    title: 'Turismo Regional',
    href: '/turismo',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80',
    icon: Palmtree,
    color: 'from-[#0047BA] to-[#00ADB5]',
  },
  {
    id: 'comercio-industria',
    title: 'Comercio e Industria',
    href: '/comercios',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80',
    icon: Building2,
    color: 'from-[#002878] to-[#0047BA]',
  },
  {
    id: 'ofertas-descuentos',
    title: 'Ofertas y descuentos',
    href: '/oportunidades',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=500&q=80',
    icon: Percent,
    color: 'from-[#0070F3] to-[#00ADB5]',
  },
  {
    id: 'sorteos-onmas',
    title: 'Sorteos ON+',
    href: '/sorteos',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=500&q=80',
    icon: Gift,
    color: 'from-[#8B008B] to-[#E0008F]',
  },
  {
    id: 'empleos-avisos',
    title: 'Empleos y avisos',
    href: '/clasificados',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80',
    icon: Briefcase,
    color: 'from-[#0047BA] to-[#0070F3]',
  },
  {
    id: 'mi-sitio-web',
    title: 'Mi Sitio Web',
    href: '/mi-sitio-web',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
    icon: Globe,
    color: 'from-[#0047BA] to-[#00ADB5]',
  },
];

export function FeaturedSectionsGrid() {
  return (
    <section id="secciones-destacadas" className="w-full pt-1 pb-3">
      {/* Title matching mockup: Descubrí todo lo que podés hacer en ON+ */}
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-sm sm:text-base lg:text-lg font-black text-slate-900">
          Descubrí todo lo que podés hacer en ON+
        </h2>
      </div>

      {/* 6 Visual Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {FEATURED_SECTIONS.map((section) => {
          const IconComp = section.icon;

          return (
            <Link
              key={section.id}
              href={section.href}
              className="group relative flex flex-col justify-end h-32 sm:h-36 lg:h-40 rounded-xl overflow-hidden shadow-2xs hover:shadow-lg transition-all border border-slate-200 cursor-pointer"
            >
              {/* Background Photo */}
              <Image
                src={section.imageUrl}
                alt={section.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-108 transition-transform duration-700"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

              {/* Bottom Badge with Icon and Title */}
              <div className="relative z-10 p-2 sm:p-2.5 flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 text-white">
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] sm:text-xs font-black text-white leading-tight drop-shadow-md group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {section.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
