'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function ClientFooter() {
  return (
    <footer className="bg-black/30 backdrop-blur-xl border-t border-white/15 pt-10 pb-0 overflow-hidden relative text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">
          
          {/* Left Column: Brand Logo Card & Handwritten Slogan */}
          <div className="md:col-span-4 space-y-3">
            <div className="inline-flex flex-col items-start gap-1">
              <div className="relative w-48 h-14 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 p-2.5 rounded-2xl shadow-lg transition-all">
                <Image
                  src="/logo.png"
                  alt="ON MÁS Portal"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-200 pl-2 drop-shadow-xs">
                PORTAL
              </span>
            </div>
            <p className="font-handwritten text-2xl text-cyan-200 font-bold drop-shadow-sm">
              Lo nuestro también conecta
            </p>
          </div>

          {/* Center Column: Social Icons & Links */}
          <div className="md:col-span-4 flex flex-col items-center justify-center space-y-4 text-center">
            {/* Social icons */}
            <div className="flex items-center justify-center">
              {/* Instagram */}
              <a href="https://instagram.com/onmasportal" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/10 hover:bg-cyan-400 hover:text-slate-950 border border-white/20 text-white rounded-full transition-all flex items-center gap-2 px-5 py-2 shadow-lg group" title="Instagram @onmasportal">
                <svg className="w-4 h-4 fill-current text-white group-hover:text-slate-950 transition-colors" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-xs font-extrabold text-white group-hover:text-slate-950 transition-colors">@onmasportal</span>
              </a>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-200">
              <Link href="/quienes-somos" className="hover:text-cyan-300 text-white font-extrabold transition-colors">¿Quiénes somos?</Link>
              <span className="text-white/30">|</span>
              <Link href="/link" className="hover:text-cyan-200 font-extrabold text-cyan-300 transition-colors">Acceso / Linktree</Link>
              <span className="text-white/30">|</span>
              <Link href="/terminos" className="hover:text-cyan-300 transition-colors">Términos y condiciones</Link>
              <span className="text-white/30">|</span>
              <Link href="/privacidad" className="hover:text-cyan-300 transition-colors">Privacidad</Link>
              <span className="text-white/30">|</span>
              <Link href="/superadmin" className="hover:text-amber-300 text-amber-400/90 font-extrabold flex items-center gap-1 transition-colors" title="Acceso Panel SuperAdmin">
                <span>SuperAdmin</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Province Outline & Slogan */}
          <div className="md:col-span-4 flex items-center justify-end gap-3 text-right">
            <div className="w-16 h-20 relative">
              <svg viewBox="0 0 100 120" className="w-full h-full text-cyan-300 stroke-current fill-none stroke-[2.5]">
                <path d="M 30,10 C 50,5 75,15 70,35 C 80,50 85,70 75,95 C 60,110 35,115 20,95 C 15,70 10,40 30,10 Z" />
              </svg>
            </div>
            <div>
              <p className="font-handwritten text-2xl text-cyan-300 font-bold leading-tight drop-shadow-sm">
                Entre Ríos,<br />más cerca tuyo.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom River Wave Gradient Banner */}
      <div className="w-full h-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />
    </footer>
  );
}
