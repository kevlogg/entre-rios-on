'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, MapPin, ArrowUpRight, BookOpen } from 'lucide-react';
import { CommunityEvent } from '@/types';

interface CommunityEventsProps {
  events: CommunityEvent[];
}

export function CommunityEvents({ events }: CommunityEventsProps) {
  return (
    <section id="comunidad" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#eae3d2] pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d6a4f] flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#52b788]" />
            Portal Comunitario & Turístico
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f3443] tracking-tight mt-1">
            Agenda de la Comunidad & Noticias de Medios
          </h2>
        </div>
        <p className="text-sm text-slate-600 max-w-md">
          Historias de emprendedores, festivales provinciales y novedades de la cultura entrerriana.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => (
          <article
            key={evt.id}
            className="group bg-white rounded-3xl overflow-hidden border border-[#eae3d2] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src={evt.imageUrl}
                  alt={evt.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category & Read Time Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-[#1d5b79] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                    {evt.category}
                  </span>
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-300" />
                    {evt.readTimeMinutes} min lectura
                  </span>
                </div>
              </div>

              {/* Event Body */}
              <div className="p-5 space-y-3">
                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-[#2d6a4f]">
                    <Calendar className="w-3.5 h-3.5" />
                    {evt.formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {evt.cityName}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#1d5b79] transition-colors">
                  {evt.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {evt.excerpt}
                </p>
              </div>
            </div>

            {/* Footer Author & CTA */}
            <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
              <div className="flex items-center gap-2.5">
                <Image
                  src={evt.author.avatarUrl}
                  alt={evt.author.name}
                  width={28}
                  height={28}
                  className="rounded-full object-cover border border-[#eae3d2]"
                />
                <span className="text-xs font-semibold text-slate-700">{evt.author.name}</span>
              </div>

              <Link
                href={`#noticia-${evt.id}`}
                className="text-xs font-bold text-[#1d5b79] group-hover:text-[#2d6a4f] inline-flex items-center gap-0.5 hover:underline"
              >
                <span>Leer nota</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
