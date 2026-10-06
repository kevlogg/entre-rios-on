'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, X, Share, PlusSquare, Sparkles, Smartphone, Check } from 'lucide-react';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker for PWA compliance
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Error registrando Service Worker PWA:', err);
      });
    }

    // 2. Check if already installed / running standalone
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) {
      return;
    }

    // 3. Check dismissal preference in localStorage
    const isDismissed = localStorage.getItem('onmas_pwa_dismissed') === 'true';
    if (isDismissed) {
      return;
    }

    // 4. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    if (isIosDevice) {
      // Show iOS instruction banner automatically if not installed
      setShowPrompt(true);
    }

    // 5. Listen for Android / Chrome / Edge install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('El usuario aceptó instalar la App PWA');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('onmas_pwa_dismissed', 'true');
  };

  if (!showPrompt || isStandalone) {
    return null;
  }

  return (
    <aside
      aria-label="Descargar aplicación PWA"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300 shadow-2xl"
    >
      <div className="bg-slate-950/95 backdrop-blur-2xl border-2 border-cyan-400/60 p-4 sm:p-5 text-white shadow-2xl space-y-3 relative overflow-hidden">
        {/* Glow ambient background detail */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white p-1 shadow-md shrink-0 flex items-center justify-center border border-cyan-400/40">
              <Image
                src="/logo.png"
                alt="ON MÁS App"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>APLICACIÓN PWA OFICIAL</span>
              </span>
              <h4 className="text-sm sm:text-base font-black text-white leading-tight">
                Instalá ON MÁS en tu celular
              </h4>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
            aria-label="Cerrar cartel de instalación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body depending on OS */}
        {isIos ? (
          <div className="space-y-2 text-xs text-slate-200 font-medium bg-white/10 p-3 border border-white/15">
            <p className="leading-relaxed font-semibold text-slate-100">
              Para instalar la app en tu <strong>iPhone / iPad</strong>:
            </p>
            <ol className="space-y-1.5 text-[11px] text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-black text-[10px] shrink-0">1</span>
                <span>Tocá el botón <strong>Compartir</strong> <Share className="w-3.5 h-3.5 inline text-cyan-300 mx-0.5" /> en el menú de Safari.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-black text-[10px] shrink-0">2</span>
                <span>Seleccioná <strong>Agregar a inicio</strong> <PlusSquare className="w-3.5 h-3.5 inline text-cyan-300 mx-0.5" />.</span>
              </li>
            </ol>
          </div>
        ) : (
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            Descargá la App oficial para acceder más rápido, navegar sin gastar datos adicionales y tener todo el catálogo regional a un toque.
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          {!isIos && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs py-2.5 px-4 shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Instalar PWA Ahora</span>
            </button>
          )}

          <button
            onClick={handleDismiss}
            className="px-3 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isIos ? 'Entendido' : 'Ahora no'}
          </button>
        </div>
      </div>
    </aside>
  );
}
