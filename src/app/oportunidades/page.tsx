import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { Tag, Sparkles, ArrowLeft, TrendingUp, Percent, Gift, Store } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Oportunidades & Promociones Especiales | ON MÁS Portal',
  description: 'Aprovechá las mejores oportunidades comerciales, descuentos exclusivos y beneficios en comercios de la región.',
};

export default function OportunidadesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-page-gradient">
      <ClientHeader />

      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-[#00ADB5] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <span className="text-[#0047BA]">Oportunidades</span>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full">
              <Tag className="w-4 h-4 text-[#00E5E8]" />
              <span>Oportunidades & Beneficios Exclusivos • ON MÁS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Oportunidades Comerciales Regionales
            </h1>

            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              Encontrá liquidaciones de temporada, ofertas relámpago, beneficios B2B y promociones directas por WhatsApp.
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-[#e9ecef] rounded-3xl p-6 sm:p-8 border border-slate-300/70 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-300/70 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0047BA]" />
              <span>Oportunidades Destacadas</span>
            </h2>
            <span className="text-xs font-bold text-slate-500 font-medium">Actualización en tiempo real</span>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs text-center space-y-4 max-w-2xl mx-auto my-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xs">
              <Percent className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Sección Oportunidades</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
              Próximamente encontrarás aquí las mejores ofertas relámpago, combos especiales y beneficios exclusivos de comercios adheridos de la provincia.
            </p>
            <div className="pt-2">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0047BA] to-[#00ADB5] text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md hover:from-[#002878] hover:to-[#007C8A] transition-all"
              >
                <Store className="w-4 h-4" />
                <span>Explorar ofertas en el catálogo</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
}
