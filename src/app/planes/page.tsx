import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { SubscriptionPlans } from '@/components/admin/SubscriptionPlans';
import { Tag, Sparkles, ArrowLeft, ShieldCheck, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Planes & Precios para Comercios | ON MÁS Portal',
  description: 'Conocé los planes oficiales de suscripción para comercios y servicios. Publicá gratis tu comercio con 1 producto o contratá nuestros planes con catálogo ampliado.',
};

export default function PlanesPublicPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-page-gradient">
      <ClientHeader />

      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
        <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full">
              <Rocket className="w-4 h-4 text-[#00E5E8]" />
              <span>Propuesta Comercial • Plan Gratis Incluido</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Planes para Comercios & Servicios
            </h1>

            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              Elegí la mejor alternativa para promocionar tu negocio. Comenzá sin costo con nuestro <strong>Plan Gratis</strong> (perfil + 1 producto) o escalá la visibilidad de tu marca con nuestros planes pagos.
            </p>
          </div>
        </div>

        {/* Interactive Subscription Plans Grid */}
        <div className="bg-[#e9ecef] rounded-3xl p-6 sm:p-8 border border-slate-300/70 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-300/70 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0047BA]" />
              <span>Planes Disponibles</span>
            </h2>
            <span className="text-xs font-bold text-slate-500">Sin comisiones por venta</span>
          </div>

          <SubscriptionPlans userType="comercio" />
        </div>
      </main>

      <ClientFooter />
    </div>
  );
}
