import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { Newspaper, Sparkles, ArrowLeft, Calendar, Tag, User, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Novedades & Noticias Destacadas | ON MÁS Portal',
  description: 'Descubrí las últimas novedades, anuncios y noticias de comercios, turismo y comunidad en el portal ON MÁS.',
};

export default function NovedadesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-page-gradient">
      <ClientHeader />

      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb Glass Badge */}
        <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl w-fit flex items-center gap-2 text-xs font-extrabold text-white shadow-xs">
          <Link href="/" className="hover:text-cyan-300 text-slate-100 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-cyan-300 font-black">Novedades</span>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full">
              <Newspaper className="w-4 h-4 text-[#00E5E8]" />
              <span>Novedades & Anuncios • ON MÁS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Novedades del Portal Regional
            </h1>

            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              Mantente informado con los lanzamientos, innovaciones comerciales, noticias de la comunidad y eventos destacados en Santa Fe y Entre Ríos.
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-[#e9ecef] rounded-3xl p-6 sm:p-8 border border-slate-300/70 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-300/70 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0047BA]" />
              <span>Últimas Novedades</span>
            </h2>
            <span className="text-xs font-bold text-slate-500">Sección en actualización constante</span>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xs text-center space-y-4 max-w-2xl mx-auto my-4">
            <div className="w-16 h-16 bg-cyan-50 text-[#00ADB5] rounded-3xl flex items-center justify-center mx-auto shadow-2xs">
              <Newspaper className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Sección Novedades</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
              Próximamente encontrarás aquí las noticias más relevantes, lanzamientos de comercios adheridos, agenda de festivales y novedades del desarrollo provincial.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0047BA] to-[#00ADB5] text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md hover:from-[#002878] hover:to-[#007C8A] transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver a la portada principal</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
}
