import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Compass, ArrowLeft, MapPin, Sparkles, Sun, Waves, Hotel, ExternalLink, MessageCircle } from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';

export const revalidate = 60;

const DESTINOS_TURISMO = [
  {
    id: 't1',
    name: 'Complejo Termal & Spa Federación',
    city: 'Federación',
    province: 'Entre Ríos',
    category: 'Termas & Relax',
    rating: '4.9 ★★★★★',
    imageUrl: '/images/city-federacion.jpg',
    description: 'Parque termal pionero a orillas del Lago Salto Grande con piscinas cubiertas, parque acuático y zona de relajación.',
    phoneWhatsApp: '5493456411223',
  },
  {
    id: 't2',
    name: 'Playas de Arena Blanca & Ribera del Uruguay',
    city: 'Colón',
    province: 'Entre Ríos',
    category: 'Playas & Naútica',
    rating: '4.8 ★★★★★',
    imageUrl: '/images/city-colon.jpg',
    description: 'Kilómetros de islas, bancos de arena blanca y excursiones en catamarán sobre el río Uruguay.',
    phoneWhatsApp: '5493447451234',
  },
  {
    id: 't3',
    name: 'Bodega Boutique & Enoturismo Litoral',
    city: 'Gualeguaychú',
    province: 'Entre Ríos',
    category: 'Enoturismo & Sabores',
    rating: '4.9 ★★★★★',
    imageUrl: '/images/city-gualeguaychu.jpg',
    description: 'Visitas guiadas entre viñedos regionales, degustaciones de Tannat y Chardonnay, con almuerzos campestres.',
    phoneWhatsApp: '5493446584321',
  },
  {
    id: 't4',
    name: 'Barrancas del Paraná & Parque Urquiza',
    city: 'Paraná',
    province: 'Entre Ríos',
    category: 'Paseos Urbano-Culturales',
    rating: '4.7 ★★★★★',
    imageUrl: '/images/city-parana.jpg',
    description: 'Miradores panorámicos sobre el río Paraná, paseos gastronómicos en Puerto Sánchez y patrimonio histórico.',
    phoneWhatsApp: '5493434112233',
  },
];

export default function TurismoPage() {
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
          <span className="text-[#0047BA]">Turismo & Destinos ON</span>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-[#00E5E8] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
              <Compass className="w-3.5 h-3.5" />
              Guía Turística Oficial del Litoral
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Turismo & Posadas ON MÁS
            </h1>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              Descubrí complejos termales, playas de arena blanca, bodegas boutique, reservas naturales y alojamientos con reserva directa sin comisiones.
            </p>
          </div>
        </div>

        {/* Tourist Circuits Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
          <button className="bg-[#0047BA] text-white px-4 py-2 rounded-xl shrink-0 shadow-xs">Todos los Circuitos</button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0 flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-[#00ADB5]" />
            <span>Termas & Spa</span>
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Playas & Ríos</span>
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0 flex items-center gap-1.5">
            <Hotel className="w-4 h-4 text-[#00ADB5]" />
            <span>Posadas & Cabañas</span>
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0">Enoturismo & Vinos</button>
        </div>

        {/* Tourist Destinations Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-lg font-extrabold text-[#0047BA] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#00ADB5]" />
              <span>Experiencias Turísticas Destacadas</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Contacto directo con prestadores</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DESTINOS_TURISMO.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                <div className="relative h-48 sm:h-auto sm:w-52 bg-slate-100 shrink-0">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  <span className="absolute top-3 left-3 bg-[#0047BA] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase shadow-xs">
                    {item.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#00ADB5] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.city}, {item.province}
                      </span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        {item.rating}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">{item.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0047BA]">Reserva Directa</span>
                    <a
                      href={`https://wa.me/${item.phoneWhatsApp}?text=${encodeURIComponent(`Hola, vi en Turismo ON MÁS tu experiencia "${item.name}" y quiero consultar disponibilidad.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Consultar WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </DynamicLayoutWrapper>
  );
}
