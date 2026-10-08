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

import { CommerceDirectoryClient } from '@/components/commerces/CommerceDirectoryClient';

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
        <span className="text-cyan-300 font-black">Directorio Comercial & Pymes</span>
      </div>

      {/* Page Hero Banner */}
      <div className="bg-slate-950/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden space-y-4">
        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full backdrop-blur-md">
          <Store className="w-4 h-4 text-[#00E5E8]" />
          <span>Directorio Provincial de Comercios, Pymes & Empresas</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Comercios, Pymes & Servicios en Entre Ríos y Santa Fe
        </h1>

        <p className="text-sm sm:text-base text-slate-100 font-medium max-w-2xl leading-relaxed">
          Conectá directamente con comercios verificados, tiendas online, pymes y servicios profesionales de toda la región.
        </p>
      </div>
    </div>
  );

  return (
    <DynamicLayoutWrapper heroContent={heroContent}>
      <CommerceDirectoryClient initialCommerces={commerces} />
    </DynamicLayoutWrapper>
  );
}
