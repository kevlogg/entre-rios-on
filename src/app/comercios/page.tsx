import { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllCommerces } from '@/lib/dal/portal';
import { MapPin, Store, CheckCircle, ArrowLeft, MessageCircle } from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Directorio Comercial & Empresas Adheridas | ON MÁS Portal',
  description: 'Directorio unificado de comercios, marcas, talleres artesanales, gastronómicos y servicios verificados de Santa Fe, Entre Ríos y el Litoral. Venta directa por WhatsApp.',
  openGraph: {
    title: 'Directorio Comercial & Empresas | ON MÁS Portal',
    description: 'Conectá directamente con más de 500 comercios y productores del Litoral.',
  },
};

export default async function ComerciosPage() {
  const commerces = await getAllCommerces();

  const heroContent = (
    <div className="space-y-4">
      {/* Breadcrumb Glass Badge */}
      <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl w-fit flex items-center gap-2 text-xs font-extrabold text-white shadow-xs">
        <Link href="/" className="hover:text-cyan-300 text-slate-100 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Inicio</span>
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-cyan-300 font-black">Directorio Comercial B2B</span>
      </div>

      {/* Page Hero Banner */}
      <div className="bg-slate-950/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden space-y-4">
        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full backdrop-blur-md">
          <Store className="w-4 h-4 text-[#00E5E8]" />
          <span>Directorio Provincial de Socios B2B</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Comercios, Productores & Servicios en Entre Ríos y Santa Fe
        </h1>

        <p className="text-sm sm:text-base text-slate-100 font-medium max-w-2xl leading-relaxed">
          Conectá directamente con talleres artesanales, gastronómicos, bodegas, pymes y servicios verificados de la provincia. Venta e informes directos a WhatsApp sin comisiones.
        </p>
      </div>
    </div>
  );

  return (
    <DynamicLayoutWrapper heroContent={heroContent}>
      {/* Commerces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {commerces.map((comm) => (
          <div key={comm.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <Image
                    src={comm.logoUrl}
                    alt={comm.name}
                    fill
                    unoptimized={comm.logoUrl.startsWith('data:')}
                    className="object-cover"
                  />
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
                href={`/api/lead/whatsapp?phone=${encodeURIComponent((comm.phoneWhatsApp || '').replace(/\D/g, ''))}&message=${encodeURIComponent(`Hola ${comm.name}, vi su comercio en el directorio Entre Ríos ON.`)}&commerceId=${encodeURIComponent(comm.id)}`}
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
    </DynamicLayoutWrapper>
  );
}
