'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export function AppSplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Si la app ya fue cargada en la sesión actual, desvanecer inmediatamente
    const hasSeenSplash = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('onmas_splash_shown');
    const displayTime = hasSeenSplash ? 250 : 650;

    const timer = setTimeout(() => {
      setIsFading(true);
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('onmas_splash_shown', 'true');
      }
    }, displayTime);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, displayTime + 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="app-splash-screen"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-300">
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
          {/* Dual Ring Spinner Branded */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center">
            {/* Anillo de fondo translúcido */}
            <div className="absolute inset-0 rounded-full border-[3px] border-slate-100" />
            {/* Anillo giratorio con gradiente de marca */}
            <div 
              className="w-full h-full rounded-full border-[3px] border-transparent border-t-[#0047BA] border-r-[#00ADB5] animate-spin"
              style={{ animationDuration: '0.85s' }}
            />
            {/* Punto de luz central en turquesa con pulso suave */}
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#0047BA] to-[#00ADB5] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
