import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Palmtree, 
  Gift, 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { FeaturedDailyNews } from '@/components/home/FeaturedDailyNews';
import { 
  getUpcomingEvents, 
  getTourismServices, 
  getRaffles, 
  getJobs,
  getCities 
} from '@/lib/dal/portal';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'ON+ Comunidad & Turismo | Agenda Cultural, Sorteos & Guía del Litoral',
  description: 'Portal regional ciudadano de Entre Ríos y Santa Fe: Novedades, agenda de festivales, circuitos turísticos, termas, sorteos mensuales y bolsa de trabajo.',
  alternates: {
    canonical: 'https://onmasportal.com.ar',
  },
  openGraph: {
    title: 'ON+ Comunidad & Turismo | Agenda Cultural & Destinos del Litoral',
    description: 'Descubrí eventos, escapadas, circuitos turísticos, sorteos vigentes y oportunidades laborales de la región.',
    url: 'https://onmasportal.com.ar',
    siteName: 'ON+ Comunidad & Turismo',
    locale: 'es_AR',
    type: 'website',
    images: [{ url: '/logo1.png', width: 1200, height: 630, alt: 'ON+ Comunidad & Turismo' }],
  },
};

export default async function CommunityHomePage() {
  const [events, tourismServices, raffles, jobs] = await Promise.all([
    getUpcomingEvents(),
    getTourismServices(),
    getRaffles(),
    getJobs(),
  ]);

  const activeRaffle = raffles.find((r) => r.status === 'ACTIVE') || raffles[0];
  const featuredTourism = tourismServices.slice(0, 4);
  const recentJobs = jobs.slice(0, 4);
  const commercialUrl = process.env.NEXT_PUBLIC_COMMERCIAL_URL 
    || (process.env.NODE_ENV === 'development' ? '/comercial' : 'https://tucompra.onmasportal.com.ar');

  return (
    <div className="min-h-screen flex flex-col bg-[#e2e8f0]">
      {/* Header oficial de Comunidad */}
      <ClientHeader portal="comunidad" />

      {/* Contenido Principal */}
      <main className="w-full flex-1 max-w-[1480px] mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-10">
        
        {/* Las 5 Noticias del Día (Santa Fe & Región - Opción B) */}
        <FeaturedDailyNews articles={events} />

        {/* Barra de Accesos Rápidos a Secciones Comunitarias */}
        <section aria-label="Secciones Comunitarias" className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/novedades"
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-2 group cursor-pointer hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0047BA] flex items-center justify-center group-hover:bg-[#0047BA] group-hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-800 group-hover:text-[#0047BA] leading-tight">
                Agenda & Eventos
              </span>
            </Link>

            <Link
              href="/turismo"
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-2 group cursor-pointer hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 rounded-xl bg-cyan-50 text-[#00ADB5] flex items-center justify-center group-hover:bg-[#00ADB5] group-hover:text-white transition-colors">
                <Palmtree className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-800 group-hover:text-[#00ADB5] leading-tight">
                Turismo & Termas
              </span>
            </Link>

            <Link
              href="/sorteos"
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-2 group cursor-pointer hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <Gift className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-800 group-hover:text-amber-600 leading-tight">
                Sorteos del Mes
              </span>
            </Link>

            <Link
              href="/empleos"
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-2 group cursor-pointer hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-800 group-hover:text-emerald-600 leading-tight">
                Bolsa de Empleo
              </span>
            </Link>

            <Link
              href="/clasificados"
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-2 group cursor-pointer hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-slate-800 group-hover:text-purple-600 leading-tight">
                Avisos de Vecinos
              </span>
            </Link>

            <a
              href={commercialUrl}
              target={commercialUrl.startsWith('http') ? '_blank' : undefined}
              rel={commercialUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="bg-gradient-to-tr from-[#002878] via-[#0047BA] to-[#00ADB5] text-white rounded-2xl p-4 border border-white/20 shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center space-y-2 group cursor-pointer hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="w-11 h-11 rounded-xl bg-white/20 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5 text-cyan-200" />
              </div>
              <span className="text-xs font-black text-white leading-tight flex items-center gap-1">
                ON+ Comercial <ExternalLink className="w-3 h-3 text-cyan-200 shrink-0" />
              </span>
            </a>
          </div>
        </section>

        {/* 3. Agenda Cultural y Novedades de la Comunidad */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-300 pb-3">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#0047BA] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#0047BA]" />
                Cultura & Sociedad Regional
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Novedades, Festivales & Agenda Comunitaria
              </h2>
            </div>
            <Link
              href="/novedades"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-black text-[#0047BA] hover:underline"
            >
              <span>Ver todas las notas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 6).map((evt) => (
              <article
                key={evt.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={evt.imageUrl}
                      alt={evt.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-[#0047BA] text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                        {evt.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-bold text-[#00ADB5]">
                        <Calendar className="w-3.5 h-3.5 text-[#00ADB5]" />
                        {evt.formattedDate}
                      </span>
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {evt.cityName}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-[#0047BA] transition-colors line-clamp-2">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {evt.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/novedades/${evt.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-[#0047BA] hover:text-white text-slate-800 text-xs font-black py-2.5 rounded-xl transition-colors"
                  >
                    <span>Leer nota completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Sorteo Activo del Mes */}
        {activeRaffle && (
          <section className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#7B2CBF] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-amber-400/30">
                <Gift className="w-3.5 h-3.5" />
                Sorteo Mensual Activo • Participación Gratuita
              </span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {activeRaffle.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-100 leading-relaxed">
                Premio: <strong className="text-amber-200 font-extrabold">{activeRaffle.prize}</strong>. Auspiciado por {activeRaffle.sponsorName}. Inscribite en segundos con tu WhatsApp.
              </p>
            </div>

            <Link
              href="/sorteos"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider px-8 py-4 rounded-2xl shadow-lg transition-transform hover:scale-105 shrink-0"
            >
              <span>¡Quiero Participar!</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        )}

        {/* 5. Guía de Turismo & Destinos del Litoral */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-300 pb-3">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#00ADB5] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#00ADB5]" />
                Escapadas & Paseos
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Turismo, Termas & Posadas del Litoral
              </h2>
            </div>
            <Link
              href="/turismo"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-black text-[#0047BA] hover:underline"
            >
              <span>Explorar todos los destinos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredTourism.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#00ADB5]" />
                      {item.cityName}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1 group-hover:text-[#0047BA] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.description || 'Disfrutá de las mejores experiencias del litoral.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href="/turismo"
                    className="w-full inline-flex items-center justify-between text-xs font-black text-[#0047BA] hover:text-[#00ADB5] transition-colors pt-2 border-t border-slate-100"
                  >
                    <span>{item.price}</span>
                    <span className="flex items-center gap-1">Ver más <ChevronRight className="w-3.5 h-3.5" /></span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Bolsa de Trabajo & Avisos Recientes */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-300 pb-3">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Oportunidades Laborales
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Bolsa de Empleo & Avisos Clasificados
              </h2>
            </div>
            <Link
              href="/empleos"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-black text-[#0047BA] hover:underline"
            >
              <span>Ver todas las ofertas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {job.workModality || 'Presencial'}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {job.cityName}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm line-clamp-2">
                    {job.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-1 font-medium">
                    Empresa: {job.company}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700">
                    {job.salary || 'A convenir'}
                  </span>
                  <Link
                    href="/empleos"
                    className="text-xs font-black text-[#0047BA] hover:underline flex items-center gap-1"
                  >
                    <span>Postularme</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Banner de Cruce con ON+ Comercial */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-black text-[#0047BA] uppercase tracking-wider">
              RED COMERCIAL B2B Y TIENDAS ONLINE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              ¿Buscás comercios locales o querés comprar y publicar tu negocio?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-medium leading-relaxed">
              Visitá <strong>ON+ Comercial / Tu Compra</strong>, nuestro portal transaccional con directorio de marcas, catálogo unificado con compra directa por WhatsApp y planes de visibilidad empresarial.
            </p>
          </div>

          <a
            href={commercialUrl}
            target={commercialUrl.startsWith('http') ? '_blank' : undefined}
            rel={commercialUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-2 bg-[#0047BA] hover:bg-[#002878] text-white font-black text-xs sm:text-sm px-6 py-4 rounded-2xl shadow-md transition-transform hover:scale-105 shrink-0"
          >
            <span>Ir a Tu Compra Comercial</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </section>

      </main>

      {/* Footer oficial */}
      <ClientFooter portal="comunidad" />
    </div>
  );
}
