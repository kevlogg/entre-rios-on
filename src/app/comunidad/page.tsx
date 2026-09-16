import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowLeft, MapPin, Sparkles, Newspaper, Users, Award, Tag } from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { getUpcomingEvents } from '@/lib/dal/portal';

export const revalidate = 60;

const NOTICIAS_COMUNIDAD = [
  {
    id: 'n1',
    title: 'Se anunció la Fiesta Nacional de la Artesanía 2027 en Colón con grandes artistas',
    category: 'Cultura & Festivales',
    cityName: 'Colón',
    date: '15 de Septiembre, 2026',
    imageUrl: '/images/city-colon.jpg',
    excerpt: 'La fiesta icónica del departamento Colón contará con más de 200 artesanos calificados e importantes shows musicales nacionales.',
  },
  {
    id: 'n2',
    title: 'Concordia lanzó el Programa de Capacitación B2B para Comercios del Citrus',
    category: 'Economía Regional',
    cityName: 'Concordia',
    date: '12 de Septiembre, 2026',
    imageUrl: '/images/city-concordia.jpg',
    excerpt: 'Talleres gratuitos dirigidos a productores citrícolas y emprendedores gastronómicos de la costa del Uruguay.',
  },
  {
    id: 'n3',
    title: 'Maratón Nocturna del Río Paraná convocará a corredores de todo el Litoral',
    category: 'Deporte & Salud',
    cityName: 'Paraná',
    date: '10 de Septiembre, 2026',
    imageUrl: '/images/city-parana.jpg',
    excerpt: 'El circuito recorrerá las barrancas históricas y la costanera paranaense con categorías de 5k, 10k y 21k.',
  },
];

export default async function ComunidadPage() {
  const events = await getUpcomingEvents();

  return (
    <DynamicLayoutWrapper>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-[#00ADB5] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <span className="text-[#0047BA]">Comunidad & Agenda Cultural</span>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#0047BA] via-[#007C8A] to-[#00ADB5] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-[#00E5E8] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
              <Users className="w-3.5 h-3.5" />
              Agenda Provincial Unificada
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Comunidad, Eventos & Noticias ON
            </h1>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              Enterate de los festivales, eventos culturales, convocatorias comunitarias y novedades del desarrollo regional de nuestra provincia.
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
          <button className="bg-[#0047BA] text-white px-4 py-2 rounded-xl shrink-0 shadow-xs">Todos los Eventos</button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0">Festivales Provinciales</button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0">Deportes & Maraton</button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0">Capacitaciones B2B</button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0">Cultura & Arte</button>
        </div>

        {/* Featured Events Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-lg font-extrabold text-[#0047BA] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00ADB5]" />
              <span>Agenda de Eventos Destacados</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Actualizado semanalmente</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div key={evt.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="relative h-48 w-full bg-slate-100">
                  <Image src={evt.imageUrl} alt={evt.title} fill className="object-cover" />
                  <span className="absolute top-3 left-3 bg-[#0047BA] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase shadow-xs">
                    {evt.category}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-extrabold px-3 py-1 rounded-xl flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00E5E8]" />
                    {evt.cityName}
                  </span>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#00ADB5] block">{evt.formattedDate || evt.date}</span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">{evt.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{evt.excerpt || evt.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">{evt.author?.name || 'Comunidad ON'}</span>
                    <Link
                      href={`/comunidad/${evt.id}`}
                      className="bg-cyan-50 hover:bg-cyan-100 text-[#0047BA] px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-colors"
                    >
                      Ver Detalle
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community News Feed */}
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-lg font-extrabold text-[#0047BA] flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#00ADB5]" />
              <span>Noticias de la Comunidad Regional</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NOTICIAS_COMUNIDAD.map((noticia) => (
              <article key={noticia.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-100">
                    <Image src={noticia.imageUrl} alt={noticia.title} fill className="object-cover" />
                  </div>
                  <span className="text-[10px] font-extrabold text-[#00ADB5] uppercase tracking-wider block">{noticia.category} • {noticia.cityName}</span>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{noticia.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{noticia.excerpt}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold block">{noticia.date}</span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </DynamicLayoutWrapper>
  );
}
