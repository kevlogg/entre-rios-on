'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, X, Share, PlusSquare, Sparkles, Smartphone, Check, HelpCircle } from 'lucide-react';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Registrar Service Worker para PWA
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Error registrando Service Worker PWA:', err);
      });
    }

    // 2. Verificar si ya está instalada la PWA
    // A) Modo standalone / fullscreen / minimal-ui
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://') ||
      (window as any).__pwaIsInstalled === true;

    // B) Registro previo de instalación en localStorage
    const isStoredInstalled = localStorage.getItem('onmas_pwa_installed') === 'true';

    if (isStandaloneMode || isStoredInstalled) {
      setIsInstalled(true);
      return;
    }

    // C) Detección de Apps relacionadas instaladas (Chrome / Edge / Android)
    if ('getInstalledRelatedApps' in navigator) {
      (navigator as any).getInstalledRelatedApps().then((relatedApps: any[]) => {
        if (Array.isArray(relatedApps) && relatedApps.length > 0) {
          setIsInstalled(true);
          setShowPrompt(false);
          try {
            localStorage.setItem('onmas_pwa_installed', 'true');
          } catch (e) {}
        }
      }).catch(() => {});
    }

    // 3. Verificar si el usuario cerró el cartel recientemente
    const dismissedUntil = localStorage.getItem('onmas_pwa_dismissed_until');
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
      return;
    }

    const isSessionDismissed = sessionStorage.getItem('onmas_pwa_session_dismissed') === 'true';
    if (isSessionDismissed) {
      return;
    }

    // 4. Detectar dispositivo iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 5. Escuchar eventos de prompt nativo
    if ((window as any).__pwaInstallPrompt) {
      setDeferredPrompt((window as any).__pwaInstallPrompt);
      setShowPrompt(true);
    }

    const handlePwaPromptReady = () => {
      if ((window as any).__pwaInstallPrompt) {
        setDeferredPrompt((window as any).__pwaInstallPrompt);
        setShowPrompt(true);
      }
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      (window as any).__pwaInstallPrompt = e;
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    // 6. Detectar cuando se completa la instalación para nunca más mostrar el cartel
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      try {
        localStorage.setItem('onmas_pwa_installed', 'true');
      } catch (e) {}
      (window as any).__pwaIsInstalled = true;
      (window as any).__pwaInstallPrompt = null;
    };

    window.addEventListener('pwa-prompt-ready', handlePwaPromptReady);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('pwa-app-installed', handleAppInstalled);

    // 7. Mostrar el cartel tras 1.5s si no está instalada
    const timer = setTimeout(() => {
      const alreadyInstalled = localStorage.getItem('onmas_pwa_installed') === 'true';
      if (!alreadyInstalled) {
        setShowPrompt(true);
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('pwa-prompt-ready', handlePwaPromptReady);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('pwa-app-installed', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const prompt = deferredPrompt || (typeof window !== 'undefined' ? (window as any).__pwaInstallPrompt : null);
    if (prompt && typeof prompt.prompt === 'function') {
      try {
        await prompt.prompt();
        const choiceResult = await prompt.userChoice;
        if (choiceResult?.outcome === 'accepted') {
          setIsInstalled(true);
          setShowPrompt(false);
          try {
            localStorage.setItem('onmas_pwa_installed', 'true');
          } catch (e) {}
        }
        setDeferredPrompt(null);
        if (typeof window !== 'undefined') (window as any).__pwaInstallPrompt = null;
      } catch (e) {
        setShowManualGuide(true);
      }
    } else {
      setShowManualGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowManualGuide(false);
    try {
      sessionStorage.setItem('onmas_pwa_session_dismissed', 'true');
      // Cooldown de 7 días si el usuario lo cierra voluntariamente
      localStorage.setItem('onmas_pwa_dismissed_until', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
    } catch (e) {}
  };

  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <aside
      aria-label="Descargar aplicación PWA"
      className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300 shadow-2xl"
    >
      <div className="bg-slate-950/95 backdrop-blur-2xl border-2 border-cyan-400/70 p-4 sm:p-5 text-white shadow-2xl space-y-3 relative overflow-hidden rounded-2xl sm:rounded-3xl">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-11 bg-white p-1 rounded-xl shadow-md shrink-0 flex items-center justify-center border border-cyan-400/40">
              <Image
                src="/logo1.png"
                alt="ON MÁS App"
                width={52}
                height={30}
                className="object-contain"
              />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
                <span>APP OFICIAL ON MÁS</span>
              </span>
              <h4 className="text-sm sm:text-base font-black text-white leading-tight">
                Instalá ON MÁS en tu celular
              </h4>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1.5 transition-colors cursor-pointer rounded-lg hover:bg-white/10 shrink-0"
            aria-label="Cerrar cartel de instalación"
            title="Cerrar cartel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guía interactiva o descripción */}
        {showManualGuide || isIos ? (
          <div className="space-y-2 text-xs text-slate-200 font-medium bg-white/10 p-3 rounded-xl border border-white/15">
            <p className="leading-relaxed font-bold text-slate-100 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-300 shrink-0" />
              <span>Cómo instalar en tu dispositivo:</span>
            </p>
            {isIos ? (
              <ol className="space-y-1.5 text-[11px] text-slate-300 pt-1">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-cyan-400/30 text-cyan-300 rounded-full flex items-center justify-center font-black text-[9px] shrink-0">1</span>
                  <span>Tocá el botón <strong>Compartir</strong> <Share className="w-3.5 h-3.5 inline text-cyan-300 mx-0.5" /> en Safari.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-cyan-400/30 text-cyan-300 rounded-full flex items-center justify-center font-black text-[9px] shrink-0">2</span>
                  <span>Seleccioná <strong>Agregar a pantalla de inicio</strong> <PlusSquare className="w-3.5 h-3.5 inline text-cyan-300 mx-0.5" />.</span>
                </li>
              </ol>
            ) : (
              <ol className="space-y-1.5 text-[11px] text-slate-300 pt-1">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-cyan-400/30 text-cyan-300 rounded-full flex items-center justify-center font-black text-[9px] shrink-0">1</span>
                  <span>Tocá los <strong>tres puntos (⋮)</strong> en la esquina del navegador.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-cyan-400/30 text-cyan-300 rounded-full flex items-center justify-center font-black text-[9px] shrink-0">2</span>
                  <span>Elegí <strong>Instalar aplicación</strong> o <strong>Agregar a la pantalla principal</strong>.</span>
                </li>
              </ol>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            Descargá la App oficial para acceder más rápido, navegar sin gastar datos adicionales y tener todo el catálogo regional a un toque.
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-gradient-to-r from-cyan-400 to-[#00ADB5] hover:from-cyan-300 hover:to-[#00969d] text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>{(deferredPrompt || (typeof window !== 'undefined' && (window as any).__pwaInstallPrompt)) ? 'Instalar App Ahora' : 'Cómo Instalar'}</span>
          </button>

          <button
            onClick={handleDismiss}
            className="px-3.5 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </aside>
  );
}
