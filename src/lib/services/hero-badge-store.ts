'use client';

import { useState, useEffect } from 'react';
import { getHeroBadgeAction, saveHeroBadgeAction } from '@/server/actions/superadmin';

export type HeroBadgeSize = 'sm' | 'md' | 'lg';

export interface HeroBadgeStyle {
  backgroundColor: string;
  /** 0 - 100 */
  backgroundOpacity: number;
  textColor: string;
  borderColor: string;
  /** px, 0 = sin borde */
  borderWidth: number;
  size: HeroBadgeSize;
  uppercase: boolean;
  showIcon: boolean;
  iconColor: string;
}

export const DEFAULT_HERO_BADGE_STYLE: HeroBadgeStyle = {
  backgroundColor: '#020617',
  backgroundOpacity: 85,
  textColor: '#22d3ee',
  borderColor: '#22d3ee',
  borderWidth: 2,
  size: 'md',
  uppercase: true,
  showIcon: true,
  iconColor: '#22d3ee',
};

const HERO_BADGE_STORAGE_KEY = 'onmas_hero_badge_v1';
let memoryStoreHeroBadge: HeroBadgeStyle | null = null;

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function sanitize(raw: Partial<HeroBadgeStyle> | null | undefined): HeroBadgeStyle {
  const d = DEFAULT_HERO_BADGE_STYLE;
  const r = raw || {};
  const color = (v: unknown, fallback: string) => (typeof v === 'string' && HEX_RE.test(v) ? v : fallback);
  const num = (v: unknown, min: number, max: number, fallback: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  };
  return {
    backgroundColor: color(r.backgroundColor, d.backgroundColor),
    backgroundOpacity: num(r.backgroundOpacity, 0, 100, d.backgroundOpacity),
    textColor: color(r.textColor, d.textColor),
    borderColor: color(r.borderColor, d.borderColor),
    borderWidth: num(r.borderWidth, 0, 6, d.borderWidth),
    size: r.size === 'sm' || r.size === 'md' || r.size === 'lg' ? r.size : d.size,
    uppercase: typeof r.uppercase === 'boolean' ? r.uppercase : d.uppercase,
    showIcon: typeof r.showIcon === 'boolean' ? r.showIcon : d.showIcon,
    iconColor: color(r.iconColor, d.iconColor),
  };
}

/** Convierte #rgb / #rrggbb + opacidad (0-100) a rgba(). */
export function hexToRgba(hex: string, opacityPercent: number): string {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.min(100, Math.max(0, opacityPercent)) / 100})`;
}

export function getHeroBadgeStyle(): HeroBadgeStyle {
  if (memoryStoreHeroBadge) return memoryStoreHeroBadge;

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(HERO_BADGE_STORAGE_KEY);
      if (raw) {
        const parsed = sanitize(JSON.parse(raw));
        memoryStoreHeroBadge = parsed;
        return parsed;
      }
    } catch (e) {
      console.error('Error al leer el badge del hero de localStorage:', e);
    }
  }

  return DEFAULT_HERO_BADGE_STYLE;
}

export async function fetchHeroBadgeFromSupabase(): Promise<HeroBadgeStyle> {
  try {
    const res = await getHeroBadgeAction();
    if (res.success && res.data) {
      const clean = sanitize(res.data);
      memoryStoreHeroBadge = clean;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(HERO_BADGE_STORAGE_KEY, JSON.stringify(clean));
          window.dispatchEvent(new Event('onmas_hero_badge_updated'));
        } catch (e) {}
      }
      return clean;
    }
  } catch (e) {
    console.warn('Nota leyendo badge del hero de Supabase:', e);
  }
  return getHeroBadgeStyle();
}

export async function saveHeroBadgeStyle(style: HeroBadgeStyle): Promise<{ success: boolean; message: string }> {
  const clean = sanitize(style);
  memoryStoreHeroBadge = clean;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(HERO_BADGE_STORAGE_KEY, JSON.stringify(clean));
      window.dispatchEvent(new Event('onmas_hero_badge_updated'));
    } catch (e) {
      console.error('Error guardando badge del hero en localStorage:', e);
    }
  }

  try {
    return await saveHeroBadgeAction(clean);
  } catch (err) {
    console.warn('Error guardando badge del hero en Supabase:', err);
    return { success: false, message: (err as Error).message };
  }
}

export function useHeroBadgeStyle(): HeroBadgeStyle {
  const [style, setStyle] = useState<HeroBadgeStyle>(() => getHeroBadgeStyle());

  useEffect(() => {
    const sync = () => setStyle(getHeroBadgeStyle());

    sync();
    fetchHeroBadgeFromSupabase().then(sync);

    window.addEventListener('onmas_hero_badge_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('onmas_hero_badge_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return style;
}
