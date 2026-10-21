'use client';

import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    __pwaInstallPrompt?: any;
    __pwaIsInstalled?: boolean;
  }
}

export function usePwaInstall() {
  const [canInstallNatively, setCanInstallNatively] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Detect if running in standalone mode (already installed)
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true ||
      document.referrer.includes('android-app://') ||
      window.__pwaIsInstalled === true;

    setIsInstalled(isStandaloneMode);

    // 2. Detect iOS device
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIos(isIosDevice);

    // 3. Register service worker if supported
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.debug('Service Worker registration note:', err);
      });
    }

    // 4. Check if prompt was already captured in global window
    if (window.__pwaInstallPrompt) {
      setCanInstallNatively(true);
    }

    const handlePromptReady = () => {
      setCanInstallNatively(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstallNatively(false);
      window.__pwaIsInstalled = true;
      window.__pwaInstallPrompt = null;
    };

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      window.__pwaInstallPrompt = e;
      setCanInstallNatively(true);
    };

    window.addEventListener('pwa-prompt-ready', handlePromptReady);
    window.addEventListener('pwa-app-installed', handleAppInstalled);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('pwa-prompt-ready', handlePromptReady);
      window.removeEventListener('pwa-app-installed', handleAppInstalled);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const triggerInstall = useCallback(async (): Promise<'accepted' | 'dismissed' | 'manual_guide'> => {
    if (typeof window === 'undefined') return 'manual_guide';

    const prompt = window.__pwaInstallPrompt;
    if (prompt && typeof prompt.prompt === 'function') {
      try {
        await prompt.prompt();
        const choice = await prompt.userChoice;
        window.__pwaInstallPrompt = null;
        setCanInstallNatively(false);
        if (choice?.outcome === 'accepted') {
          setIsInstalled(true);
          window.__pwaIsInstalled = true;
          return 'accepted';
        }
        return 'dismissed';
      } catch (err) {
        console.warn('Error launching native PWA install prompt:', err);
        return 'manual_guide';
      }
    }

    return 'manual_guide';
  }, []);

  return {
    canInstallNatively,
    isInstalled,
    isIos,
    triggerInstall,
  };
}
