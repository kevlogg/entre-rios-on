'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ExternalLink, X } from 'lucide-react';
import { useSideBanners, SideBannerItem } from '@/lib/services/side-banners-store';

export function StickySideBanners() {
  const allBanners = useSideBanners();

  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(0);
  
  const [isLeftDismissed, setIsLeftDismissed] = useState(false);
  const [isRightDismissed, setIsRightDismissed] = useState(false);

  const leftBanners = allBanners.filter((b) => b.position === 'left' || b.position === 'both');
  const rightBanners = allBanners.filter((b) => b.position === 'right' || b.position === 'both');

  // Auto-rotate left side banners
  useEffect(() => {
    if (leftBanners.length <= 1) return;
    const interval = setInterval(() => {
      setLeftIndex((prev) => (prev + 1) % leftBanners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [leftBanners.length]);

  // Auto-rotate right side banners
  useEffect(() => {
    if (rightBanners.length <= 1) return;
    const interval = setInterval(() => {
      setRightIndex((prev) => (prev + 1) % rightBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [rightBanners.length]);

  const activeLeft = leftBanners[leftIndex % (leftBanners.length || 1)] || leftBanners[0];
  const activeRight = rightBanners[rightIndex % (rightBanners.length || 1)] || rightBanners[0];

  return (
    <>
      {/* Left Sticky Advertising Banner (Centrado exacto en el margen lateral izquierdo con tamaño dinámico por pantalla) */}
      {!isLeftDismissed && activeLeft && (
        <aside 
          aria-label="Publicidad Lateral Izquierda"
          className="hidden xl:block absolute top-[84px] bottom-0 z-20 w-40 2xl:w-56 min-[1920px]:w-64 pointer-events-none transition-all duration-300"
          style={{
            left: 'max(12px, calc(25vw - 320px - 128px))'
          }}
        >
          <div className="sticky top-[165px] 2xl:top-[175px] pointer-events-auto transition-all duration-300 animate-in fade-in">
            <div className="group relative rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-slate-950 flex flex-col justify-between h-[380px] 2xl:h-[480px] min-[1920px]:h-[560px] transition-all duration-300">
              
              {/* Header Badge & Dismiss Button */}
              <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between">
                <span className="text-[9px] 2xl:text-xs font-black uppercase tracking-widest text-cyan-300 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-400/40 flex items-center gap-1 shadow-md">
                  <Sparkles className="w-2.5 h-2.5 2xl:w-3.5 2xl:h-3.5 text-cyan-400 animate-pulse" />
                  <span>PUBLICIDAD</span>
                </span>

                <button
                  type="button"
                  onClick={() => setIsLeftDismissed(true)}
                  className="w-6 h-6 2xl:w-7 2xl:h-7 rounded-full bg-slate-950/80 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
                  title="Cerrar anuncio"
                >
                  <X className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
                </button>
              </div>

              {/* Clickable Image Banner */}
              <Link 
                href={activeLeft.href || '/planes'} 
                target={activeLeft.href?.startsWith('http') ? '_blank' : '_self'}
                className="absolute inset-0 w-full h-full block group cursor-pointer"
              >
                <img
                  src={activeLeft.imageUrl}
                  alt={activeLeft.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Title & CTA at bottom of card */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5 2xl:p-4 space-y-1.5 z-10">
                  <h4 className="text-xs 2xl:text-sm min-[1920px]:text-base font-black text-white leading-tight drop-shadow-md group-hover:text-cyan-300 transition-colors">
                    {activeLeft.title}
                  </h4>
                  <div className="pt-0.5 flex items-center justify-between text-[10px] 2xl:text-xs font-extrabold text-cyan-300 bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/20">
                    <span>Ver anuncio</span>
                    <ExternalLink className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" />
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </aside>
      )}

      {/* Right Sticky Advertising Banner (Centrado exacto en el margen lateral derecho con tamaño dinámico por pantalla) */}
      {!isRightDismissed && activeRight && (
        <aside 
          aria-label="Publicidad Lateral Derecha"
          className="hidden xl:block absolute top-[84px] bottom-0 z-20 w-40 2xl:w-56 min-[1920px]:w-64 pointer-events-none transition-all duration-300"
          style={{
            right: 'max(12px, calc(25vw - 320px - 128px))'
          }}
        >
          <div className="sticky top-[165px] 2xl:top-[175px] pointer-events-auto transition-all duration-300 animate-in fade-in">
            <div className="group relative rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-slate-950 flex flex-col justify-between h-[380px] 2xl:h-[480px] min-[1920px]:h-[560px] transition-all duration-300">
              
              {/* Header Badge & Dismiss Button */}
              <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between">
                <span className="text-[9px] 2xl:text-xs font-black uppercase tracking-widest text-emerald-300 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-400/40 flex items-center gap-1 shadow-md">
                  <Sparkles className="w-2.5 h-2.5 2xl:w-3.5 2xl:h-3.5 text-emerald-400 animate-pulse" />
                  <span>DESTACADO</span>
                </span>

                <button
                  type="button"
                  onClick={() => setIsRightDismissed(true)}
                  className="w-6 h-6 2xl:w-7 2xl:h-7 rounded-full bg-slate-950/80 text-slate-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
                  title="Cerrar anuncio"
                >
                  <X className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
                </button>
              </div>

              {/* Clickable Image Banner */}
              <Link 
                href={activeRight.href || '/planes'} 
                target={activeRight.href?.startsWith('http') ? '_blank' : '_self'}
                className="absolute inset-0 w-full h-full block group cursor-pointer"
              >
                <img
                  src={activeRight.imageUrl}
                  alt={activeRight.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Title & CTA at bottom of card */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5 2xl:p-4 space-y-1.5 z-10">
                  <h4 className="text-xs 2xl:text-sm min-[1920px]:text-base font-black text-white leading-tight drop-shadow-md group-hover:text-emerald-300 transition-colors">
                    {activeRight.title}
                  </h4>
                  <div className="pt-0.5 flex items-center justify-between text-[10px] 2xl:text-xs font-extrabold text-emerald-300 bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/20">
                    <span>Ver anuncio</span>
                    <ExternalLink className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" />
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </aside>
      )}
    </>
  );
}
