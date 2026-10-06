import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { Store, Sparkles, ArrowLeft, ShoppingBag, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Comercio Online & Tiendas Digitales | ON MÁS Portal',
  description: 'Vendé por internet con tu catálogo digital y recibí pedidos por WhatsApp sin pagar comisiones.',
};

export default function ComercioOnlinePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#e9ecef]">
      {/* Top Header + Hero Banner inside ON MÁS brand gradient */}
      <div className="relative bg-gradient-on-mas pb-6 sm:pb-8">
        <ClientHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          {/* Breadcrumb */}
          <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl w-fit flex items-center gap-2 text-xs font-extrabold text-white shadow-xs mb-4">
            <Link href="/" className="hover:text-cyan-300 text-slate-100 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-cyan-300 font-black">Comercio Online</span>
          </div>

          {/* Hero Section */}
          <div className="bg-slate-950/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-10 text-white shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-3 max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full">
                <Store className="w-4 h-4 text-[#00E5E8]" />
                <span>Venta Digital • Sin Comisiones</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                Plataforma de Comercio Online
              </h1>

              <p className="text-sm text-slate-100 font-medium leading-relaxed">
                Publicá tus productos y servicios en el catálogo regional ON MÁS. Recibí consultas y pedidos directos en tu celular.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container (Below Hero -> Gray Background #e9ecef) */}
      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-[#e9ecef] text-slate-900">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300/70 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-300/70 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0047BA]" />
              <span>¿Cómo funciona el Comercio Online en ON MÁS?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3 text-center">
              <div className="w-12 h-12 bg-cyan-50 text-[#00ADB5] rounded-2xl flex items-center justify-center mx-auto">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">1. Creá tu Perfil Gratis</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Registrate sin costo, cargá los datos de tu comercio y publicá tu primer producto gratis.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3 text-center">
              <div className="w-12 h-12 bg-blue-50 text-[#0047BA] rounded-2xl flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">2. Cargar tu Catálogo</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Mostrá tus fotos, precios, descripciones y ofertas para que miles de clientes locales te encuentren.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3 text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">3. Vender por WhatsApp</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Los usuarios hacen clic en comprar o consultar y se conectan directamente a tu WhatsApp oficial.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs text-center space-y-4 max-w-xl mx-auto">
            <h4 className="text-lg font-black text-slate-900">¿Querés empezar a vender online?</h4>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0047BA] to-[#00ADB5] text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md hover:from-[#002878] hover:to-[#007C8A] transition-all"
              >
                <span>Crear Cuenta de Comercio</span>
              </Link>
              <Link
                href="/planes"
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all"
              >
                <span>Ver Planes Comercial</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
}
