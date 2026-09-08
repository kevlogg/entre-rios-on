'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SlidersHorizontal, LayoutGrid, Newspaper } from 'lucide-react';

export function DesignSwitcherBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isEditorial = pathname === '/editorial';

  const navigateTo = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (path === pathname) return;
    router.push(path);
    // Hard fallback to guarantee full navigation if client state is stuck
    setTimeout(() => {
      if (window.location.pathname !== path) {
        window.location.href = path;
      }
    }, 100);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-[#0f172a] text-white text-xs py-2 px-4 shadow-2xl border-b border-slate-700 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#00a859] animate-pulse" />
        <span className="font-extrabold tracking-wider uppercase flex items-center gap-1.5 text-slate-200">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#00a859]" />
          <span>Comparador de Versiones</span>
        </span>
        <span className="hidden lg:inline-block text-slate-400 text-[11px]">
          • Alterná entre opciones en tiempo real:
        </span>
      </div>

      {/* Switcher Buttons */}
      <div className="flex items-center gap-2">
        <a
          href="/"
          onClick={(e) => navigateTo('/', e)}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
            !isEditorial
              ? 'bg-[#00a859] text-white shadow-md ring-2 ring-emerald-400/50 pointer-events-none'
              : 'bg-slate-800 text-slate-200 hover:bg-[#00a859] hover:text-white'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Opción A: Portal E-Commerce (Cliente)</span>
          {!isEditorial && <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-md uppercase">Activa</span>}
        </a>

        <a
          href="/editorial"
          onClick={(e) => navigateTo('/editorial', e)}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
            isEditorial
              ? 'bg-[#1d5b79] text-white shadow-md ring-2 ring-sky-400/50 pointer-events-none'
              : 'bg-slate-800 text-slate-200 hover:bg-[#1d5b79] hover:text-white'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5 text-sky-400" />
          <span>Opción B: Editorial Modern Bento</span>
          {isEditorial && <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-md uppercase">Activa</span>}
        </a>
      </div>
    </div>
  );
}
