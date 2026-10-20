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
  title: 'Comercios e Industria Adherida | ON MÁS Portal',
  description: 'Directorio unificado de comercios, marcas, industrias, talleres artesanales, gastronómicos y servicios verificados de Santa Fe, Entre Ríos y la Región Centro. Venta directa por WhatsApp.',
  openGraph: {
    title: 'Comercios e Industria | ON MÁS Portal',
    description: 'Conectá directamente con más de 500 comercios e industrias de la región.',
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
        <span className="text-cyan-300 font-black">Comercios e Industria</span>
      </div>

      {/* Page Hero Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full backdrop-blur-md">
          <Store className="w-4 h-4 text-[#00E5E8]" />
          <span>Directorio de Comercios e Industria</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
          Comercios e Industria de la Región
        </h1>

        <p className="text-xs sm:text-sm text-slate-100 font-medium max-w-2xl leading-relaxed">
          Conectá directamente con comercios verificados, industrias, tiendas online, pymes y servicios profesionales de toda la región.
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
