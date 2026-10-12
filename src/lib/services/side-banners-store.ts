'use client';

import { useState, useEffect } from 'react';
import { getSideBannersAction, saveSideBannersAction } from '@/server/actions/superadmin';

export interface SideBannerItem {
  id: string;
  title: string;
  imageUrl: string;
  href: string;
  position: 'left' | 'right' | 'both';
  idealSize: string;
}

export const DEFAULT_SIDE_BANNERS: SideBannerItem[] = [
  {
    id: 'side-left-1',
    title: 'Sorteo del Mes ON+',
    imageUrl: '/banners/side-sorteo-del-mes.jpg',
    href: '/sorteos',
    position: 'left',
    idealSize: '160 × 600 px (Rascacielos / Vertical HD)',
  },
  {
    id: 'side-left-2',
    title: 'Descubrí Santa Fe - Turismo Todo el Año',
    imageUrl: '/banners/side-descubri-santa-fe.jpg',
    href: '/turismo',
    position: 'left',
    idealSize: '160 × 240 px',
  },
  {
    id: 'side-right-1',
    title: 'Tu Comercio en ON MÁS',
    imageUrl: '/banners/side-comercio-onmas.jpg',
    href: '/planes',
    position: 'right',
    idealSize: '160 × 600 px (Rascacielos / Vertical HD)',
  },
  {
    id: 'side-right-2',
    title: 'Viví la Costa Santafesina',
    imageUrl: '/banners/side-costa-santafesina.jpg',
    href: '/turismo',
    position: 'right',
    idealSize: '160 × 240 px',
  },
];

const SIDE_BANNERS_STORAGE_KEY = 'onmas_side_banners_v1';
let memoryStoreSideBanners: SideBannerItem[] | null = null;

function normalizeSideBanners(stored: SideBannerItem[]): SideBannerItem[] {
  if (!Array.isArray(stored) || stored.length === 0) return DEFAULT_SIDE_BANNERS;
  return stored.map((item, idx) => ({
    id: item.id || `side-banner-${idx}-${Date.now()}`,
    title: item.title || 'Anuncio Publicitario',
    imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
    href: item.href || '/planes',
    position: item.position || (idx % 2 === 0 ? 'left' : 'right'),
    idealSize: item.idealSize || '160 × 600 px (Rascacielos / Vertical HD)',
  }));
}

export function getSideBanners(): SideBannerItem[] {
  if (memoryStoreSideBanners && Array.isArray(memoryStoreSideBanners)) {
    return memoryStoreSideBanners;
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(SIDE_BANNERS_STORAGE_KEY);
      if (raw) {
        const parsed: SideBannerItem[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = normalizeSideBanners(parsed);
          memoryStoreSideBanners = merged;
          return merged;
        }
      }
    } catch (e) {
      console.error('Error al leer banners laterales de localStorage:', e);
    }
  }

  return DEFAULT_SIDE_BANNERS;
}

export async function fetchSideBannersFromSupabase(): Promise<SideBannerItem[]> {
  try {
    const res = await getSideBannersAction();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      const merged = normalizeSideBanners(res.data);
      memoryStoreSideBanners = merged;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(SIDE_BANNERS_STORAGE_KEY, JSON.stringify(merged));
          window.dispatchEvent(new Event('onmas_side_banners_updated'));
        } catch (e) {}
      }
      return merged;
    }
  } catch (e) {
    console.warn('Nota leyendo side banners de Supabase:', e);
  }
  return getSideBanners();
}

export function saveSideBanners(banners: SideBannerItem[]): void {
  memoryStoreSideBanners = banners;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SIDE_BANNERS_STORAGE_KEY, JSON.stringify(banners));
      window.dispatchEvent(new Event('onmas_side_banners_updated'));
    } catch (e) {
      console.error('Error guardando banners laterales en localStorage:', e);
    }
  }

  saveSideBannersAction(banners).catch((err) => {
    console.warn('Error guardando banners laterales en Supabase:', err);
  });
}

export function useSideBanners(): SideBannerItem[] {
  const [banners, setBanners] = useState<SideBannerItem[]>(() => getSideBanners());

  useEffect(() => {
    const sync = () => {
      setBanners(getSideBanners());
    };

    sync();

    fetchSideBannersFromSupabase().then(() => {
      sync();
    });

    window.addEventListener('onmas_side_banners_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('onmas_side_banners_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return banners;
}
