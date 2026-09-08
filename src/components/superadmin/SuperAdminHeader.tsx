'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Crown, ShieldCheck, MapPin, ExternalLink, Bell, Sparkles, SlidersHorizontal } from 'lucide-react';

export function SuperAdminHeader() {
  return (
    <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-11 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & SuperAdmin Crown Badge */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-36 h-10">
                <Image
                  src="/logo.jpeg"
                  alt="Entre Ríos ON"
                  fill
                  className="object-contain object-left brightness-200"
                />
              </div>
            </Link>

            <span className="hidden md:inline-block h-6 w-px bg-slate-800" />

            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 px-3.5 py-1 rounded-xl text-xs font-black text-amber-300">
              <Crown className="w-4 h-4 text-amber-400 fill-current animate-pulse" />
              <span>SuperAdmin Provincial</span>
              <span className="text-slate-400 text-[10px] uppercase font-bold">• 17 Departamentos</span>
            </div>
          </div>

          {/* Quick Shortcuts & Live Portal Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="bg-[#00a859] hover:bg-[#008746] text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Ver Portal Opción A</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/editorial"
              target="_blank"
              className="bg-[#004b87] hover:bg-[#003663] text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs hidden sm:flex"
            >
              <span>Ver Portal Opción B</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
                SA
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-black leading-none text-slate-100">SuperAdmin General</p>
                <p className="text-[10px] text-amber-400 font-bold mt-0.5">Operador Principal</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
