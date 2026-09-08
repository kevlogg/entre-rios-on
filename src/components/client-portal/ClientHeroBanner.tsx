'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function ClientHeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-900 min-h-[380px] sm:min-h-[460px] flex items-center shadow-lg">
      {/* Background Image: Costanera de Paraná / Puente Urquiza */}
      <Image
        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1600"
        alt="Entre Ríos siempre ON - Costanera y Puente de Paraná"
        fill
        priority
        className="object-cover object-center opacity-85"
      />

      {/* Subtle overlay gradient to match the crisp light/dark editorial look */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md">
                ENTRE RÍOS,
              </h1>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-md flex items-center gap-3">
                SIEMPRE <span className="text-[#00a859] drop-shadow-lg">ON</span>
              </h2>
            </div>

            {/* Subhead */}
            <div className="space-y-1 text-slate-100 font-bold text-lg sm:text-2xl drop-shadow-sm">
              <p>Comprá. Vendé. Publicá. Conectá.</p>
              <p className="text-slate-200 font-medium text-base sm:text-xl">
                Toda la provincia en un solo lugar.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-3">
              <Link
                href="#ofertas-destacadas"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00a859] to-[#008746] hover:from-[#008746] hover:to-[#005691] text-white px-7 py-3.5 rounded-2xl font-extrabold text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Explorá Entre Ríos</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

          </div>

          {/* Right Column: Handwritten Accent Text */}
          <div className="lg:col-span-4 hidden lg:flex justify-end">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-right max-w-xs rotate-1 shadow-2xl">
              <p className="font-handwritten text-3xl sm:text-4xl text-white font-bold leading-snug drop-shadow-md">
                “Nuestra gente, nuestros lugares, más oportunidades”
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
