'use client';

import React from 'react';
import Image from 'next/image';

export function AboutUsHomeSection() {
  return (
    <section id="quienes-somos" className="w-full pt-1 pb-4">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6">
        
        {/* Left Column: Heading */}
        <div className="lg:w-1/4 text-center lg:text-left shrink-0">
          <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
            Quiénes somos
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#002878] leading-tight">
            El portal comercial<br className="hidden sm:inline" /> de Santa Fe
          </h2>
        </div>

        {/* Center Column: Description & Slogan */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-1.5">
          <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
            ON+ es el ecosistema comercial regional que conecta el comercio local, la industria, el turismo y las comunidades de toda la provincia de Santa Fe. Impulsamos el crecimiento de los negocios, acercamos oportunidades y fortalecemos la economía regional a través de la tecnología.
          </p>
          <p className="text-xs sm:text-[13px] font-black text-[#00ADB5]">
            Muchas oportunidades, una sola red.
          </p>
        </div>

        {/* Right Column: Logo & Pillars */}
        <div className="lg:w-1/4 flex flex-col items-center lg:items-end justify-center text-center lg:text-right shrink-0">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 mb-1.5">
            <Image
              src="/logo1.png"
              alt="ON+ PORTAL COMERCIAL"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 leading-tight">
            Comercio. Industria.<br className="hidden lg:inline" /> Turismo. Comunidad.<br />
            <span className="text-[#0047BA] font-black">Siempre ON.</span>
          </p>
        </div>

      </div>
    </section>
  );
}
