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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/20 pb-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-300" />
            Portal Comunitario & Turístico
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Agenda de la Comunidad & Noticias de Medios
          </h2>
        </div>
        <p className="text-sm text-cyan-100/90 max-w-md font-medium">
          Historias de emprendedores, festivales provinciales y novedades de la cultura entrerriana.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((evt) => (
          <article
            key={evt.id}
            className="group bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                <Image
                  src={evt.imageUrl}
                  alt={evt.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category & Read Time Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                    {evt.category}
                  </span>
                  <span className="bg-slate-950/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                    <Clock className="w-3 h-3 text-amber-300" />
                    {evt.readTimeMinutes} min lectura
                  </span>
                </div>
              </div>

              {/* Event Body */}
              <div className="p-5 space-y-3">
                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1 font-bold text-cyan-300">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {evt.formattedDate}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-cyan-300" />
                    {evt.cityName}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-extrabold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
                  {evt.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed font-medium">
                  {evt.excerpt}
                </p>
              </div>
            </div>

            {/* Footer Author & CTA */}
            <div className="p-5 pt-0 border-t border-white/10 flex items-center justify-between mt-4">
              <div className="flex items-center gap-2.5">
                <Image
                  src={evt.author.avatarUrl}
                  alt={evt.author.name}
                  width={28}
                  height={28}
                  className="rounded-full object-cover border border-cyan-400/40"
                />
                <span className="text-xs font-bold text-slate-200">{evt.author.name}</span>
              </div>

              <Link
                href={`#noticia-${evt.id}`}
                className="text-xs font-black text-cyan-300 group-hover:text-cyan-200 inline-flex items-center gap-0.5 hover:underline"
              >
                <span>Leer nota</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-cyan-300" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
