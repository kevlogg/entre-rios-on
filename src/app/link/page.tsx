'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Globe, 
  MessageCircle, 
  Users, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  Store,
  ExternalLink,
  ChevronDown,
  CheckCircle2,
  Building2
} from 'lucide-react';

function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export default function LinkLandingPage() {
  const [showAboutDrawer, setShowAboutDrawer] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0047BA] to-[#002878] text-white flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#00E5E8] selection:text-slate-950">
      
      {/* Background Ambient Glow Circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00E5E8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#00ADB5]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0047BA]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <main className="w-full max-w-md mx-auto relative z-10 space-y-6 my-auto pt-6 pb-8">
        
        {/* Profile Card Header */}
        <div className="text-center space-y-4">
          <div className="inline-block bg-white/95 backdrop-blur-md px-6 py-3.5 rounded-2xl shadow-2xl border border-white/60 transform hover:scale-105 transition-transform duration-300">
            <div className="relative w-48 h-12 sm:w-56 sm:h-14 mx-auto">
              <Image
                src="/logo.png"
                alt="ON MÁS Portal"
                fill
                priority
                className="object-contain p-0.5"
              />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-xs mx-auto leading-relaxed">
            Directorio Comercial B2B, Catálogo directo a WhatsApp, Turismo y Medios de la Región.
          </p>
        </div>

        {/* Link Buttons Stack */}
        <div className="space-y-3.5">

          {/* 1. Ir al Sitio Web */}
          <Link
            href="/"
            className="group relative w-full bg-white/95 hover:bg-white text-slate-900 rounded-2xl p-4 shadow-xl border border-white/60 flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#0047BA] to-[#00ADB5]" />

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0047BA] to-[#002878] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5 text-[#00E5E8]" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-black text-slate-900 group-hover:text-[#0047BA] transition-colors flex items-center gap-1.5">
                  <span>Ir al Sitio Web</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Explorá el portal principal, comercios y productos
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#0047BA] text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

          {/* 2. WhatsApp Directo */}
          <a
            href="https://wa.me/5493434567890?text=Hola%20ON%20M%C3%81S!%20Quisiera%20recibir%20informaci%C3%B3n%20sobre%20el%20portal."
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full bg-white/95 hover:bg-white text-slate-900 rounded-2xl p-4 shadow-xl border border-white/60 flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#25D366]" />

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-black text-slate-900 group-hover:text-[#25D366] transition-colors">
                  WhatsApp Oficial
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Contacto directo con el equipo ON MÁS
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#25D366] text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>

          {/* 3. Instagram Oficial */}
          <a
            href="https://instagram.com/onmas.oficial"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full bg-white/95 hover:bg-white text-slate-900 rounded-2xl p-4 shadow-xl border border-white/60 flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-500 via-rose-500 to-purple-600" />

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                <InstagramIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                  Instagram @onmas.oficial
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Sorteos, novedades y eventos de la región
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-purple-600 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </div>
          </a>

          {/* 4. ¿Quiénes Somos? */}
          <Link
            href="/quienes-somos"
            className="group relative w-full bg-white/95 hover:bg-white text-slate-900 rounded-2xl p-4 shadow-xl border border-white/60 flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#00ADB5] to-[#00E5E8]" />

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00ADB5] to-[#007C8A] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-black text-slate-900 group-hover:text-[#00ADB5] transition-colors">
                  ¿Quiénes Somos?
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Conocé nuestra historia, propósito y red provincial
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#00ADB5] text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>

        </div>

        {/* Quick Quick-View Toggle Drawer for ¿Quiénes Somos? */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAboutDrawer(!showAboutDrawer)}
            className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white/90 text-xs font-bold py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-[#00E5E8]" />
            <span>{showAboutDrawer ? 'Ocultar Resumen Breve' : 'Ver Resumen Rápido sobre ON MÁS'}</span>
            <ChevronDown className={`w-4 h-4 text-[#00E5E8] transition-transform duration-200 ${showAboutDrawer ? 'rotate-180' : ''}`} />
          </button>

          {showAboutDrawer && (
            <div className="mt-3 bg-white/95 text-slate-800 rounded-2xl p-5 border border-white/40 shadow-xl space-y-3 animate-in fade-in duration-200">
              <h3 className="text-sm font-black text-[#0047BA] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#00ADB5]" />
                <span>La Red de Desarrollo Regional</span>
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                ON MÁS es la plataforma multisectorial unificada que conecta comercios B2B, pequeños emprendedores, alojamientos turísticos y vecinos de Santa Fe y Entre Ríos.
              </p>
              <ul className="text-[11px] text-slate-700 font-semibold space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sin intermediarios ni comisiones de venta.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Catálogo conectado directamente con tu WhatsApp.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Posicionamiento provincial y agenda de turismo.</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/quienes-somos"
                  className="w-full bg-[#0047BA] hover:bg-[#002878] text-white py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-sm transition-colors"
                >
                  <span>Ver Historia Completa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Adherir mi comercio CTA */}
        <div className="pt-2">
          <Link
            href="/login?mode=signup&type=comercio"
            className="w-full bg-gradient-to-r from-[#00E5E8] to-[#00ADB5] hover:from-[#00ADB5] hover:to-[#007C8A] text-slate-950 py-3.5 rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
          >
            <Store className="w-4 h-4" />
            <span>¿Tenés un Comercio? Adherite a ON MÁS</span>
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-md mx-auto text-center pt-4 pb-2 relative z-10">
        <p className="text-[11px] text-slate-300 font-medium flex items-center justify-center gap-1">
          <span>Desarrollado para potenciar la región con</span>
          <Heart className="w-3.5 h-3.5 text-cyan-400 fill-current" />
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          © {new Date().getFullYear()} ON MÁS Portal. Todos los derechos reservados.
        </p>
      </footer>

    </div>
  );
}
