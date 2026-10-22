'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export function AppSplashScreen() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'hidden'>('visible');

  useEffect(() => {
    let hasSeenSplash = false;
    try { hasSeenSplash = !!sessionStorage.getItem('onmas_splash_shown'); } catch {}

    const displayTime = hasSeenSplash ? 200 : 700;

    const fadeTimer = setTimeout(() => {
      setPhase('fading');
      try { sessionStorage.setItem('onmas_splash_shown', 'true'); } catch {}
    }, displayTime);

    const hideTimer = setTimeout(() => {
      setPhase('hidden');
    }, displayTime + 460);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div
      id="app-splash-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        transition: 'opacity 0.46s ease-out',
        opacity: phase === 'fading' ? 0 : 1,
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '1.5rem' }}>
        {/* Logo ON+ Oficial Grande y Centrado (Sin texto 'ON MÁS PORTAL') */}
        <div style={{ position: 'relative', width: '280px', height: '124px' }}>
          <Image
            src="/logo-icon.png"
            alt="ON MÁS"
            fill
            priority
            sizes="280px"
            style={{ objectFit: 'contain' }}
          />
        </div>

        {/* Spinner branded */}
        <div style={{ position: 'relative', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid #f1f5f9',
          }} />
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#0047BA',
            borderRightColor: '#00ADB5',
            animation: 'spin 0.85s linear infinite',
          }} />
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0047BA, #00ADB5)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
