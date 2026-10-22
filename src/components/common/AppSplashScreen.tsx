'use client';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import Image from 'next/image';

// Hook isomórfico: en el servidor (SSR) no existe useLayoutEffect; usamos useEffect como fallback seguro.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function AppSplashScreen() {
  // Inicializar como `true` siempre — el CSS crítico inline en layout.tsx
  // ya cubre la pantalla desde el primer frame, así que no hay flash.
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useIsomorphicLayoutEffect(() => {
    // Revisamos si el usuario ya vio el splash en esta sesión de navegación
    let hasSeenSplash = false;
    try {
      hasSeenSplash = !!sessionStorage.getItem('onmas_splash_shown');
    } catch {}

    // Primera visita: 700ms de logo visible; visitas subsiguientes: 200ms (casi invisible)
    const displayTime = hasSeenSplash ? 200 : 700;

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
      try { sessionStorage.setItem('onmas_splash_shown', 'true'); } catch {}
    }, displayTime);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      // Revelar el contenido que el CSS crítico había ocultado
      try {
        const el = document.getElementById('__splash_body_cover');
        if (el) el.remove();
      } catch {}
    }, displayTime + 480);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      id="app-splash-screen"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-opacity duration-480 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="flex flex-col items-center justify-center p-6 space-y-8">
        {/* Logo Oficial ON MÁS Agrandado y Centrado */}
        <div className="relative w-64 h-36 min-[380px]:w-72 min-[380px]:h-40 sm:w-88 sm:h-48 md:w-96 md:h-52 flex items-center justify-center">
          <Image
            src="/logo1.png"
            alt="ON MÁS"
            fill
            priority
            sizes="(max-width: 640px) 290px, 384px"
            className="object-contain drop-shadow-sm"
          />
        </div>

        {/* Indicador de carga animado consistente con el branding ON+ (Azul Rey y Turquesa) */}
        <div className="flex flex-col items-center justify-center space-y-3 pt-2">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
            {/* Anillo de fondo translúcido */}
            <div className="absolute inset-0 rounded-full border-[3px] border-slate-100" />
            {/* Anillo giratorio branded */}
            <div
              className="w-full h-full rounded-full border-[3px] border-transparent border-t-[#0047BA] border-r-[#00ADB5] animate-spin"
              style={{ animationDuration: '0.85s' }}
            />
            {/* Punto central con pulso */}
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#0047BA] to-[#00ADB5] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
