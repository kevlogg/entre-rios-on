'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  MessageCircle, 
  MapPin, 
  Store, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Heart,
  Globe,
  Lock,
  ExternalLink
} from 'lucide-react';

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

export function ComingSoonView() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0047BA] to-[#002878] text-white flex flex-col justify-between items-center p-4 sm:p-8 relative overflow-hidden selection:bg-[#00E5E8] selection:text-slate-950">
      
      {/* Glow Ambient Circles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00E5E8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#00ADB5]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0047BA]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Badge */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between relative z-10 pt-2">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-[#00E5E8] font-extrabold text-xs">
          <MapPin className="w-3.5 h-3.5 text-[#00E5E8]" />
          <span>onmasportal.com.ar</span>
        </div>

        <Link
          href="/link"
          className="text-xs font-extrabold text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-[#00E5E8]" />
          <span>Ver Linktree</span>
        </Link>
      </header>

      {/* Center Main Card */}
      <main className="w-full max-w-xl mx-auto relative z-10 text-center space-y-6 my-auto py-8">
        
        {/* Logo Box */}
        <div className="inline-block bg-white/95 backdrop-blur-md px-8 py-4 rounded-3xl shadow-2xl border border-white/60 transform hover:scale-105 transition-transform duration-300">
          <div className="relative w-52 h-14 sm:w-64 sm:h-16 mx-auto">
            <Image
              src="/logo.png"
              alt="ON MÁS Portal"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Status Pill */}
        <div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-400/40 px-4 py-1.5 rounded-full text-xs font-black text-amber-300 shadow-sm animate-pulse">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>PRÓXIMAMENTE • LANZAMIENTO PROVINCIAL</span>
          </div>
        </div>

        {/* Heading & Paragraph */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
            Estamos preparando algo grande para la región
          </h1>
          <p className="text-sm sm:text-base text-slate-200 font-medium max-w-lg mx-auto leading-relaxed">
            Muy pronto vas a poder explorar el portal multisectorial que conecta comercios, catálogos directos a WhatsApp, turismo y oportunidades de empleo en Entre Ríos y Santa Fe.
          </p>
        </div>

        {/* Email Subscription Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl max-w-md mx-auto space-y-4">
          <p className="text-xs font-bold text-slate-200">
            Dejanos tu correo para recibir una notificación exclusiva cuando lancemos:
          </p>

          {subscribed ? (
            <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-4 text-emerald-200 text-xs font-extrabold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>¡Gracias! Te avisaremos apenas el portal esté online.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/90 border border-white/40 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-500 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#00E5E8]"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#00E5E8] to-[#00ADB5] hover:from-[#00ADB5] hover:to-[#007C8A] text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer shrink-0"
              >
                Notificarme
              </button>
            </form>
          )}
        </div>

        {/* Quick Contact & Social Cards */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          
          {/* WhatsApp Directo */}
          <a
            href="https://wa.me/5493434567890?text=Hola%20ON%20M%C3%81S!%20Quisiera%20sumar%20mi%20comercio%20antes%20del%20lanzamiento."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-3 rounded-2xl text-xs font-extrabold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Pre-registrar mi Comercio</span>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/onmasportal"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 text-white px-5 py-3 rounded-2xl text-xs font-extrabold shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Seguinos en Instagram</span>
          </a>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto text-center pt-4 pb-2 relative z-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-2">
        <p className="flex items-center gap-1 font-medium">
          <span>Desarrollado para potenciar la región con</span>
          <Heart className="w-3.5 h-3.5 text-cyan-400 fill-current" />
        </p>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>© {new Date().getFullYear()} ON MÁS Portal</span>
          <span>•</span>
          <Link href="/superadmin/login" className="hover:text-amber-300 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Acceso Admin</span>
          </Link>
        </div>
      </footer>

    </div>
  );
}
