'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Smartphone, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  HelpCircle, 
  X, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';

export function AppDownloadCard() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    // Detect if already installed (standalone mode)
    const isStandaloneMode = 
      (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) || 
      (typeof navigator !== 'undefined' && (navigator as any).standalone === true) ||
      (typeof document !== 'undefined' && document.referrer.includes('android-app://'));

    setIsInstalled(isStandaloneMode);

    // Detect iOS
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIos(/iphone|ipad|ipod/.test(userAgent));
    }

    // Capture native install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult?.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <section className="w-full pb-4">
        <div className="bg-gradient-to-br from-slate-950 via-[#002878] to-[#0047BA] rounded-2xl sm:rounded-3xl border border-cyan-400/30 p-5 sm:p-7 shadow-xl text-white relative overflow-hidden">
          {/* Ambient Lighting Glows */}
          <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-64 h-64 bg-[#E5007D]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Left: App Logo Icon + Text Content */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 flex-1 min-w-0">
              {/* App Icon Container */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl p-2.5 shadow-2xl flex items-center justify-center border-2 border-cyan-400/50 group">
                  <Image
                    src="/logo1.png"
                    alt="ON MÁS App Oficial"
                    width={72}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 p-1 rounded-full shadow-md">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 bg-cyan-400/20 border border-cyan-300/40 text-cyan-300 text-[10px] sm:text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                  <span>APP OFICIAL ON MÁS • PWA</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight">
                  Descargá e instalá la App de ON MÁS en tu celular
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-2xl">
                  Accedé más rápido a comercios, ofertas, sorteos y novedades directamente desde la pantalla de inicio de tu teléfono (Android o iPhone). Sin ocupar espacio en tu memoria y sin pasar por Play Store o App Store.
                </p>

                {/* Badges / Highlights */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] font-bold text-slate-300">
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/15">
                    <Zap className="w-3 h-3 text-cyan-300" />
                    Ultra liviana & sin costo
                  </span>
                  <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/15">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Compatible Android & iOS
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto shrink-0 justify-center">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 via-[#00ADB5] to-[#0070F3] hover:from-cyan-300 hover:to-[#0055b8] text-slate-950 px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all transform active:scale-95 cursor-pointer text-center whitespace-nowrap"
              >
                <Download className="w-4 h-4 text-slate-950 font-black shrink-0" />
                <span>{isInstalled ? 'App ya instalada ✓' : 'Instalar App en mi Celular'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowGuideModal(true)}
                className="inline-flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer text-center"
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                <span>¿Cómo instalar en Android o iPhone?</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Modal Guía Rápida de Instalación */}
      {showGuideModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowGuideModal(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 text-slate-900 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0047BA]/10 text-[#0047BA] flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6 text-[#0047BA]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00ADB5]">Instalación Directa</span>
                <h4 className="text-lg font-black text-slate-900 leading-tight">
                  Cómo agregar ON MÁS a tu inicio
                </h4>
              </div>
            </div>

            {/* Tabs / Instructions for Android & iPhone */}
            <div className="space-y-4">
              {/* Android Chrome */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-xs text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>En Android (Google Chrome):</span>
                </div>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed font-medium">
                  Tocá los <strong>tres puntos verticales (⋮)</strong> arriba a la derecha en Chrome y seleccioná <strong>&ldquo;Instalar aplicación&rdquo;</strong> o <strong>&ldquo;Agregar a la pantalla principal&rdquo;</strong>.
                </p>
              </div>

              {/* iPhone iOS Safari */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-xs text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>En iPhone / iPad (Safari):</span>
                </div>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed font-medium flex items-center gap-1.5 flex-wrap">
                  <span>Tocá el botón</span>
                  <span className="inline-flex items-center gap-1 bg-white border border-slate-300 px-2 py-0.5 rounded-md font-bold text-slate-800 text-[11px]">
                    <Share className="w-3 h-3 text-blue-600" /> Compartir
                  </span>
                  <span>en la barra inferior y luego elegí</span>
                  <span className="inline-flex items-center gap-1 bg-white border border-slate-300 px-2 py-0.5 rounded-md font-bold text-slate-800 text-[11px]">
                    <PlusSquare className="w-3 h-3 text-slate-700" /> Agregar al inicio
                  </span>.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-full sm:w-auto bg-[#0047BA] hover:bg-[#002878] text-white px-6 py-2.5 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer"
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
