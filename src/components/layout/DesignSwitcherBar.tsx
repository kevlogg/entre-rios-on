'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, LayoutGrid, Newspaper } from 'lucide-react';

function DesignSwitcherContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeTheme, setActiveTheme] = useState<'a' | 'b'>('a');

  useEffect(() => {
    const themeParam = searchParams.get('theme') || searchParams.get('version');
    if (themeParam === 'b' || pathname === '/editorial') {
      setActiveTheme('b');
      localStorage.setItem('entre_rios_on_theme', 'b');
    } else if (themeParam === 'a' || pathname === '/') {
      setActiveTheme('a');
      localStorage.setItem('entre_rios_on_theme', 'a');
    } else {
      const saved = localStorage.getItem('entre_rios_on_theme');
      if (saved === 'b') {
        setActiveTheme('b');
      } else {
        setActiveTheme('a');
      }
    }
  }, [pathname, searchParams]);

  const switchTheme = (targetTheme: 'a' | 'b') => {
    localStorage.setItem('entre_rios_on_theme', targetTheme);
    setActiveTheme(targetTheme);

    let targetPath = '/';
    if (targetTheme === 'b') {
      targetPath = pathname === '/' ? '/editorial' : `${pathname}?theme=b`;
    } else {
      targetPath = pathname === '/editorial' ? '/' : `${pathname}?theme=a`;
    }

    window.location.href = targetPath;
  };

  const isEditorial = activeTheme === 'b';

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-11 bg-[#0f172a] text-white text-xs px-4 shadow-2xl border-b border-slate-700 flex items-center justify-between gap-3 select-none">
      {/* Title */}
      <div className="flex items-center gap-2 truncate">
        <span className="w-2.5 h-2.5 rounded-full bg-[#00a859] animate-pulse shrink-0" />
        <span className="font-extrabold tracking-wider uppercase flex items-center gap-1.5 text-slate-200 truncate">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#00a859] shrink-0" />
          <span className="hidden sm:inline">Comparador de Versiones</span>
          <span className="sm:hidden">Versiones</span>
        </span>
        <span className="hidden xl:inline-block text-slate-400 text-[11px] truncate">
          • Alterná entre temas en tiempo real manteniendo la navegación:
        </span>
      </div>

      {/* Switcher Buttons */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => switchTheme('a')}
          className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
            !isEditorial
              ? 'bg-[#00a859] text-white shadow-md ring-2 ring-emerald-400/50'
              : 'bg-slate-800 text-slate-200 hover:bg-[#00a859] hover:text-white'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Opción A: Portal E-Commerce</span>
          <span className="sm:hidden">Opción A</span>
          {!isEditorial && <span className="hidden md:inline-block bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-md uppercase">Activa</span>}
        </button>

        <button
          onClick={() => switchTheme('b')}
          className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer ${
            isEditorial
              ? 'bg-[#1d5b79] text-white shadow-md ring-2 ring-sky-400/50'
              : 'bg-slate-800 text-slate-200 hover:bg-[#1d5b79] hover:text-white'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Opción B: Editorial Modern Bento</span>
          <span className="sm:hidden">Opción B</span>
          {isEditorial && <span className="hidden md:inline-block bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-md uppercase">Activa</span>}
        </button>
      </div>
    </div>
  );
}

export function DesignSwitcherBar() {
  return (
    <Suspense fallback={
      <div className="fixed top-0 left-0 right-0 z-[9999] h-11 bg-[#0f172a] text-white text-xs px-4 border-b border-slate-700 flex items-center justify-between">
        <span className="font-extrabold text-slate-200">Comparador de Versiones</span>
      </div>
    }>
      <DesignSwitcherContent />
    </Suspense>
  );
}


