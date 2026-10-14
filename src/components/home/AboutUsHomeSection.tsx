'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
            El portal comercial<br className="hidden sm:inline" /> de la Región Centro
          </h2>
        </div>

        {/* Center Column: Description & Slogan */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-1.5">
          <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
            ON+ es el ecosistema comercial regional que conecta el comercio local, las pymes, el turismo y las comunidades de toda la Región Centro. Impulsamos el crecimiento de los negocios, acercamos oportunidades y fortalecemos la economía regional a través de la tecnología.
          </p>
          <p className="text-xs sm:text-[13px] font-black text-[#00ADB5]">
            Muchas oportunidades, una sola red.
          </p>
        </div>

        {/* Right Column: Logo & Pillars (Acceso secreto a SuperAdmin al tocar el logo o el punto final) */}
        <div className="lg:w-1/4 flex flex-col items-center lg:items-end justify-center text-center lg:text-right shrink-0">
          <Link
            href="/superadmin"
            className="relative w-[104px] h-[60px] sm:w-[121px] sm:h-[70px] mb-1.5 block cursor-pointer transition-transform active:scale-95 group"
            title="SuperAdmin"
          >
            <Image
              src="/logo1.png"
              alt="ON+ PORTAL COMERCIAL"
              fill
              className="object-contain group-hover:opacity-90 transition-opacity"
            />
          </Link>
          <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 leading-tight">
            Comercio. Industria.<br className="hidden lg:inline" /> Turismo. Comunidad.<br />
            <span className="text-[#0047BA] font-black">
              Siempre ON
              <Link href="/superadmin" className="cursor-default select-none hover:text-cyan-400">.</Link>
            </span>
          </p>
        </div>

      </div>
    </section>
  );
}
