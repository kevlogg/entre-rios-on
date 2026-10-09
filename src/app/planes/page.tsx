import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { SubscriptionPlans } from '@/components/admin/SubscriptionPlans';
import { Sparkles, ArrowLeft, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Planes & Precios para Comercios | ON MÁS Portal',
  description: 'Conocé los planes oficiales de suscripción para comercios y servicios. Elegí el plan que mejor se adapte a tu negocio y publicá tu catálogo.',
};

export default function PlanesPublicPage() {
  const heroContent = (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl w-fit flex items-center gap-2 text-xs font-extrabold text-white shadow-xs">
        <Link href="/" className="hover:text-cyan-300 text-slate-100 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Inicio</span>
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-cyan-300 font-black">Planes & Precios</span>
      </div>

      {/* Hero Section */}
      <div className="bg-slate-950/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full">
            <Rocket className="w-4 h-4 text-[#00E5E8]" />
            <span>Propuesta Comercial • Planes ON MÁS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Planes para Comercios & Servicios
          </h1>

          <p className="text-sm text-slate-100 font-medium leading-relaxed">
            Elegí la mejor alternativa para promocionar tu negocio y escalá la visibilidad de tu marca con nuestros planes Bronce, Plata y Oro.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <DynamicLayoutWrapper heroContent={heroContent}>
      <div className="space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300/70 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-300/70 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0047BA]" />
              <span>Planes Disponibles</span>
            </h2>
            <span className="text-xs font-bold text-slate-500">Sin comisiones por venta</span>
          </div>

          <SubscriptionPlans userType="comercio" />
        </div>
      </div>
    </DynamicLayoutWrapper>
  );
}
