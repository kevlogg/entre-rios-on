'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Newspaper, ArrowRight, Clock, MapPin, TrendingUp, Globe2, Sparkles } from 'lucide-react';
import { CommunityEvent } from '@/types';
import { MarketWeatherWidget } from '@/components/common/MarketWeatherWidget';

interface FeaturedDailyNewsProps {
  articles: CommunityEvent[];
}

export function FeaturedDailyNews({ articles }: FeaturedDailyNewsProps) {
  if (!articles || articles.length === 0) return null;

  const [activeTab, setActiveTab] = useState<'all' | 'regional' | 'reuters'>('all');

  // Hasta 10 noticias principales
  const topTen = articles.slice(0, 10);

  const isReutersStory = (item: CommunityEvent) => {
    const loc = (item.cityName || item.location || '').toLowerCase();
    const full = (item.fullStory || '').toLowerCase();
    const author = (item.author?.name || '').toLowerCase();
    return loc.includes('reuters') || full.includes('portal:reuters') || author.includes('internacional');
  };

  const filteredArticles = topTen.filter((item) => {
    if (activeTab === 'all') return true;
    const isR = isReutersStory(item);
    if (activeTab === 'reuters') return isR;
    return !isR;
  });

  const mainArticle = filteredArticles[0] || topTen[0];
  const sideArticles = filteredArticles.slice(1, 5);
  const bottomArticles = filteredArticles.slice(5, 10);

  return (
    <section aria-label="Las 10 Noticias del Día" className="w-full space-y-4">
      {/* 1. Barra de Cotización del Dólar y Clima Actual en Santa Fe */}
      <MarketWeatherWidget variant="banner" />

      {/* 2. Header de la Sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-300/80 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200/80 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              Al Minuto • Santa Fe, Región & Reuters
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5 text-[#00ADB5]" />
              10 Informes Diarios
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#0047BA]" />
            <span>Las 10 Noticias de Hoy</span>
          </h2>
        </div>

        {/* Selector de Pestañas (Filtros Rápidos) */}
        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-[#0047BA] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({topTen.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('regional')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'regional'
                ? 'bg-white text-[#0047BA] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Santa Fe & Región
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reuters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'reuters'
                ? 'bg-white text-[#0047BA] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5 text-[#00ADB5]" />
            <span>Reuters</span>
          </button>
        </div>
      </div>

      {/* 3. Grilla Periodística: 1 Grande a la Izquierda + 4 en Lista a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
        
        {/* ============================================================== */}
        {/* NOTICIA PRINCIPAL (Columna Izquierda - 7 cols)                 */}
        {/* ============================================================== */}
        {mainArticle && (
          <article className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group">
            {/* Foto de Portada Grande con resolución HD garantizada */}
            <div className="relative w-full h-56 sm:h-72 lg:h-80 bg-slate-900 overflow-hidden shrink-0">
              <Image
                src={mainArticle.imageUrl || '/images/city-santa-fe.jpg'}
                alt={mainArticle.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 850px"
                quality={95}
                className="object-cover object-center group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
              
              {/* Badges superiores */}
              <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
                <span className="bg-[#0047BA] text-white text-[11px] font-black px-3 py-1 rounded-xl shadow-md uppercase tracking-wider">
                  {mainArticle.category}
                </span>
                <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 border border-white/20">
                  {isReutersStory(mainArticle) ? (
                    <>
                      <Globe2 className="w-3 h-3 text-[#00ADB5]" />
                      <span>Reuters Internacional</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3 h-3 text-[#00ADB5]" />
                      <span>{mainArticle.cityName || mainArticle.location}</span>
                    </>
                  )}
                </span>
              </div>

              {/* Fecha y tiempo de lectura sobre la imagen */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-white/90 font-medium">
                <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
                  {mainArticle.formattedDate || mainArticle.date}
                </span>
                <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-300" />
                  <span>{mainArticle.readTimeMinutes} min</span>
                </span>
              </div>
            </div>

            {/* Contenido Noticia Principal */}
            <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-[#0047BA] transition-colors leading-snug">
                  <Link href={`/novedades/${mainArticle.id}`}>
                    {mainArticle.title}
                  </Link>
                </h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-3">
                  {mainArticle.excerpt}
                </p>
              </div>

              {/* Botón Ver Nota Destacada */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  {mainArticle.author?.name || 'Redacción ON MÁS'}
                </span>
                <Link
                  href={`/novedades/${mainArticle.id}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0047BA] via-[#005FE3] to-[#00ADB5] hover:opacity-95 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 group/btn cursor-pointer"
                >
                  <span>Ver nota completa</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        )}

        {/* ============================================================== */}
        {/* 4 NOTICIAS EN LISTA (Columna Derecha - 5 cols)                  */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-3.5">
          {sideArticles.map((item, idx) => (
            <article
              key={item.id || idx}
              className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex gap-3.5 items-center group"
            >
              {/* Thumbnail Cuadrado */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                <Image
                  src={item.imageUrl || '/images/city-santa-fe.jpg'}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 160px, 200px"
                  quality={90}
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Contenido Noticia Lateral */}
              <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-1.5">
                <div className="space-y-1">
                  {/* Pills */}
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase">
                    <span className="text-[#0047BA] bg-blue-50 px-2 py-0.5 rounded-md truncate max-w-[110px]">
                      {item.category}
                    </span>
                    <span className="text-slate-500 font-semibold truncate max-w-[110px] flex items-center gap-1">
                      {isReutersStory(item) ? (
                        <>
                          <Globe2 className="w-2.5 h-2.5 text-[#00ADB5]" />
                          <span>Reuters</span>
                        </>
                      ) : (
                        item.cityName || item.location
                      )}
                    </span>
                  </div>

                  {/* Titular */}
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-[#0047BA] transition-colors leading-snug line-clamp-2">
                    <Link href={`/novedades/${item.id}`}>
                      {item.title}
                    </Link>
                  </h4>
                </div>

                {/* Footer de Tarjeta con Botón "Ver nota" */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                    {item.formattedDate || item.date}
                  </span>

                  <Link
                    href={`/novedades/${item.id}`}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black text-[#0047BA] hover:text-[#00ADB5] bg-blue-50/80 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer group/btn"
                    title={`Leer: ${item.title}`}
                  >
                    <span>Ver nota</span>
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* ============================================================== */}
      {/* 4. FILA DE 5 NOTICIAS ADICIONALES (Para completar las 10 notas)  */}
      {/* ============================================================== */}
      {bottomArticles.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#0047BA] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00ADB5]" />
              Más Informes Destacados del Día
            </span>
            <span className="text-xs text-slate-500 font-bold">
              {bottomArticles.length} noticias adicionales
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {bottomArticles.map((item, idx) => (
              <article
                key={item.id || idx}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70">
                    <Image
                      src={item.imageUrl || '/images/city-santa-fe.jpg'}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 20vw"
                      quality={90}
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="bg-[#0047BA] text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase shadow-xs">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                      {isReutersStory(item) ? (
                        <>
                          <Globe2 className="w-2.5 h-2.5 text-[#00ADB5]" />
                          <span>Reuters</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-2.5 h-2.5 text-[#00ADB5]" />
                          <span>{item.cityName || item.location}</span>
                        </>
                      )}
                    </span>
                    <h5 className="text-xs font-black text-slate-900 group-hover:text-[#0047BA] transition-colors leading-snug line-clamp-2">
                      <Link href={`/novedades/${item.id}`}>
                        {item.title}
                      </Link>
                    </h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed font-medium">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.formattedDate || item.date}
                  </span>
                  <Link
                    href={`/novedades/${item.id}`}
                    className="text-[11px] font-black text-[#0047BA] hover:text-[#00ADB5] flex items-center gap-0.5"
                  >
                    <span>Leer</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
