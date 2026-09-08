import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllCommerces } from '@/lib/dal/portal';
import { MapPin, Store, CheckCircle, ArrowLeft, MessageCircle } from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';

export const revalidate = 60;

export default async function ComerciosPage() {
  const commerces = await getAllCommerces();

  return (
    <DynamicLayoutWrapper>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-[#00a859] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <span className="text-[#004b87]">Directorio Comercial B2B</span>
        </div>

        {/* Page Header */}
        <div className="border-b border-slate-200 pb-4 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#00a859] flex items-center gap-1.5">
            <Store className="w-4 h-4" />
            Directorio Provincial de Socios B2B
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#004b87]">
            Comercios, Productores & Servicios en Entre Ríos
          </h1>
          <p className="text-sm text-slate-600 font-medium max-w-2xl">
            Conectá directamente con talleres artesanales, gastronómicos, bodegas y servicios verificados de la provincia.
          </p>
        </div>

        {/* Commerces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commerces.map((comm) => (
            <div key={comm.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image src={comm.logoUrl} alt={comm.name} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md uppercase">
                      {comm.category}
                    </span>
                    <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-1.5 leading-snug mt-0.5">
                      <span>{comm.name}</span>
                      <CheckCircle className="w-4 h-4 text-[#00a859] shrink-0" />
                    </h2>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {comm.description}
                </p>

                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00a859]" />
                  <span>{comm.address}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <Link
                  href={`/comercio/${comm.slug}`}
                  className="bg-[#004b87] hover:bg-[#003663] text-white py-2.5 px-4 rounded-xl text-xs font-extrabold text-center flex-1"
                >
                  Ver Perfil
                </Link>
                <a
                  href={`https://wa.me/${comm.phoneWhatsApp}?text=${encodeURIComponent(`Hola ${comm.name}, vi su comercio en el directorio Entre Ríos ON.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-2.5 rounded-xl"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </DynamicLayoutWrapper>
  );
}
