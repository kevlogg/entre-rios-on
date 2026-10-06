'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  Sparkles, 
  ArrowRight, 
  Store, 
  Palmtree, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2,
  MapPin,
  Heart
} from 'lucide-react';
import { PageBackground } from '@/components/common/PageBackground';

export function AboutUsHomeSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="bg-gradient-on-mas rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/20">
        <PageBackground />
        
        {/* Background Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#00E5E8]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#00ADB5]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Left Info Column */}
        <div className="space-y-5 max-w-2xl relative z-10 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-[#00E5E8] text-xs font-black px-3.5 py-1.5 rounded-full shadow-sm">
            <Users className="w-4 h-4 text-[#00E5E8]" />
            <span>¿Quiénes Somos? • ON MÁS Portal</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            La Plataforma que Conecta el Comercio, Turismo y Comunidad Provincial
          </h2>

          <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
            <strong>ON MÁS</strong> es la red regional unificada de Santa Fe y Entre Ríos diseñada para potenciar a pymes, emprendedores y vecinos. Digitalizamos la economía local permitiendo la venta directa por WhatsApp sin intermediarios ni comisiones sobre transacciones.
          </p>

          {/* Quick Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00E5E8] font-black text-xs">
                <Store className="w-4 h-4 shrink-0" />
                <span>Catálogo B2B</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-tight">Pedidos directos a tu WhatsApp sin comisiones.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00E5E8] font-black text-xs">
                <Palmtree className="w-4 h-4 shrink-0" />
                <span>Turismo Regional</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-tight">Complejos termales, alojamientos y paseos.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3 space-y-1">
              <div className="flex items-center gap-1.5 text-[#00E5E8] font-black text-xs">
                <Briefcase className="w-4 h-4 shrink-0" />
                <span>Empleos & Noticias</span>
              </div>
              <p className="text-[11px] text-slate-200 leading-tight">Bolsa de trabajo abierta y agenda cultural.</p>
            </div>
          </div>

          {/* CTA Link to full ¿Quiénes Somos? page */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
            <Link
              href="/quienes-somos"
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0047BA] font-black text-xs px-6 py-3.5 rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Conocé nuestra historia completa</span>
              <ArrowRight className="w-4 h-4 text-[#00ADB5] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/link"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs px-5 py-3.5 rounded-2xl transition-colors text-center"
            >
              Ver Menú / Linktree
            </Link>
          </div>

        </div>

        {/* Right Logo Badge Box */}
        <div className="relative z-10 shrink-0">
          <div className="bg-white/95 rounded-3xl p-6 shadow-2xl border-4 border-white/40 flex flex-col items-center justify-center space-y-3 transform hover:rotate-1 transition-transform max-w-xs text-center">
            <div className="relative w-44 h-14">
              <Image
                src="/logo.png"
                alt="ON MÁS Portal"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0047BA] bg-cyan-50 px-2.5 py-0.5 rounded-full inline-block border border-cyan-200">
                Red Provincial Unificada
              </span>
              <p className="text-[11px] text-slate-500 font-medium">
                Conectando Entre Ríos y Santa Fe
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
