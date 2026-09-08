'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SlidersHorizontal, LayoutGrid, Newspaper, Sparkles } from 'lucide-react';

export function DesignSwitcherBar() {
  const pathname = usePathname();
  const isEditorial = pathname === '/editorial';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a] text-white text-xs py-2 px-4 shadow-xl border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#00a859] animate-pulse" />
        <span className="font-extrabold tracking-wider uppercase flex items-center gap-1.5 text-slate-200">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#00a859]" />
          <span>Comparador de Versiones</span>
        </span>
        <span className="hidden md:inline-block text-slate-400 text-[11px]">
          • Cambiá entre propuestas de diseño con 1 clic:
        </span>
      </div>

      {/* Switcher Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
            !isEditorial
              ? 'bg-[#00a859] text-white shadow-md ring-2 ring-emerald-400/50'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Opción A: Portal E-Commerce (Cliente)</span>
          {!isEditorial && <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-md uppercase">Activa</span>}
        </Link>

        <Link
          href="/editorial"
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs ${
            isEditorial
              ? 'bg-[#1d5b79] text-white shadow-md ring-2 ring-sky-400/50'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5 text-sky-400" />
          <span>Opción B: Editorial Modern Bento</span>
          {isEditorial && <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-md uppercase">Activa</span>}
        </Link>
      </div>
    </div>
  );
}
