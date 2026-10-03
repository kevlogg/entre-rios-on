'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { 
  Building2, 
  MapPin, 
  Store, 
  MessageCircle, 
  Palmtree, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  Heart,
  Globe,
  Award
} from 'lucide-react';

export default function QuienesSomosPage() {
  return (
    <DynamicLayoutWrapper>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 w-full">
        
        {/* Breadcrumb Glass Badge */}
        <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl w-fit flex items-center gap-2 text-xs font-extrabold text-white shadow-xs">
          <Link href="/" className="hover:text-cyan-300 text-slate-100 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-cyan-300 font-black">¿Quiénes somos?</span>
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#00E5E8] text-xs font-black px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#00E5E8]" />
              <span>Plataforma Multisectorial de la Región del Litoral</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Impulsando el Comercio, Turismo y Comunidad Provincial
            </h1>

            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              <strong>ON MÁS</strong> nace con el propósito de conectar a vecinos, turistas, pymes y emprendedores de Santa Fe y Entre Ríos en una red digital unificada, transparente y sin comisiones intermedias.
            </p>
          </div>

          <div className="relative w-44 h-44 sm:w-56 sm:h-56 bg-white/95 rounded-3xl p-4 shadow-2xl border-4 border-white/40 shrink-0 flex items-center justify-center transform hover:rotate-2 transition-transform">
            <div className="relative w-full h-full">
              <Image
                src="/logo.png"
                alt="ON MÁS Portal"
                fill
                priority
                className="object-contain p-2"
              />
            </div>
          </div>
        </section>

        {/* Pillars Grid */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-black text-white">Nuestros Pilares Fundamentales</h2>
            <p className="text-xs text-cyan-200 font-medium">
              Diseñados para brindar autonomía, visibilidad y tecnología accesible a todos los actores económicos locales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pilar 1 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-[#0047BA] flex items-center justify-center font-black">
                  <Store className="w-6 h-6 text-[#00ADB5]" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Directorio B2B & Catálogo Digital</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Permitimos que comercios, gastronomía y pymes publiquen sus productos y servicios con enlace directo a su WhatsApp personal. Sin intermediarios ni comisiones sobre ventas.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs font-bold text-[#0047BA] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Conexión Directa a WhatsApp</span>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
                  <Palmtree className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Turismo & Experiencias Litoraleñas</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Promocionamos complejos termales, posadas, paseos náuticos, gastronomía de barranca y cultura de cada ciudad para atraer visitantes provinciales y nacionales.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs font-bold text-[#0047BA] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Agenda Provincial Unificada</span>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-black">
                  <Briefcase className="w-6 h-6 text-[#0047BA]" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">Comunidad, Empleos & Clasificados</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Bolsa de trabajo abierta para la postulación de candidatos y la búsqueda de personal por parte de empresas regionales, junto con espacio comunitario.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs font-bold text-[#0047BA] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Oportunidades Abiertas</span>
              </div>
            </div>

          </div>
        </section>

        {/* Cities Covered */}
        <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#00ADB5]" />
                <span>Red de Nodos Provinciales Integrados</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Unimos las principales ciudades de Santa Fe y Entre Ríos en una sola red geográfica.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#0047BA] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full">
              <Globe className="w-4 h-4 text-[#00E5E8]" />
              <span>+15 Nodos Activos</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-bold text-slate-700">
            {['Rosario', 'Santa Fe Capital', 'Rafaela', 'Paraná', 'Concordia', 'Colón', 'Federación', 'Gualeguaychú', 'Villaguay', 'Victoria', 'Chajarí', 'Concepción del Uruguay'].map((city) => (
              <div key={city} className="bg-white border border-slate-200 rounded-2xl p-3 text-center shadow-2xs hover:border-[#00ADB5] transition-colors flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00ADB5] shrink-0" />
                <span>{city}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Adherir Comercio */}
        <section className="bg-gradient-to-r from-[#0047BA] to-[#00ADB5] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-black">¿Tenés un Comercio o Servicio en la Región?</h2>
            <p className="text-xs sm:text-sm text-slate-100 font-medium">
              Sumate a la red ON MÁS y publicá tu catálogo comercial para vender directo a WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/login?mode=signup&type=comercio"
              className="bg-white hover:bg-slate-100 text-[#0047BA] font-black text-xs px-6 py-3.5 rounded-2xl shadow-md transition-all text-center"
            >
              Crear Cuenta de Comercio
            </Link>
            <Link
              href="/link"
              className="bg-slate-900 hover:bg-slate-950 text-white font-black text-xs px-6 py-3.5 rounded-2xl shadow-md transition-all text-center flex items-center justify-center gap-1.5"
            >
              <Globe className="w-4 h-4 text-[#00E5E8]" />
              <span>Ver Menú / Linktree</span>
            </Link>
          </div>
        </section>

      </main>
    </DynamicLayoutWrapper>
  );
}
