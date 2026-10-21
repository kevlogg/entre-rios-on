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
  isExternal?: boolean;
}

export const DEFAULT_SIDE_BANNERS: SideBannerItem[] = [
  {
    id: 'side-left-1',
    title: 'Sorteo del Mes ON+',
    imageUrl: 'https://oetagnusdhbqrznugwuo.supabase.co/storage/v1/object/public/commerces/uploads/1791856726958-kdk1p8.jpg',
    href: '/sorteos',
    position: 'left',
    idealSize: '160 × 600 px (Rascacielos / Vertical HD)',
  },
  {
    id: 'side-left-2',
    title: 'Cápsulas 4 en 1',
    imageUrl: 'https://oetagnusdhbqrznugwuo.supabase.co/storage/v1/object/public/commerces/uploads/1791853804014-udq9am.jpg',
    href: '/producto/c-psulas-4-en-1',
    position: 'left',
    idealSize: '160 × 240 px',
  },
  {
    id: 'side-right-1',
    title: 'Sitio Automotor',
    imageUrl: 'https://oetagnusdhbqrznugwuo.supabase.co/storage/v1/object/public/commerces/uploads/1792455289554-lqote6.jpg',
    href: 'https://www.sitioautomotor.com.ar/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAacLuWEvk1eCt9RcwGK9kf9Lt4SiJDVbCQNIIqgAGFP3X9dLJ-rMsDQEppCqkQ_aem_3Ib8qVKPZD1Szj_eW1j_Yw#inicio',
    position: 'right',
    idealSize: '160 × 600 px (Rascacielos / Vertical HD)',
    isExternal: true,
  },
  {
    id: 'side-right-2',
    title: 'Re-Vest Das Almas',
    imageUrl: 'https://oetagnusdhbqrznugwuo.supabase.co/storage/v1/object/public/commerces/uploads/1792455246638-5fvkq0.png',
    href: '/comercio/re-vest-das-almas',
    position: 'right',
    idealSize: '160 × 240 px',
  },
];

const SIDE_BANNERS_STORAGE_KEY = 'onmas_side_banners_v3';
let memoryStoreSideBanners: SideBannerItem[] | null = null;

function normalizeSideBanners(stored: SideBannerItem[]): SideBannerItem[] {
  if (!Array.isArray(stored) || stored.length === 0) return DEFAULT_SIDE_BANNERS;

  return stored.map((item, idx) => {
    const fallback = DEFAULT_SIDE_BANNERS[idx % DEFAULT_SIDE_BANNERS.length];
    const isLegacyStockImage = !item.imageUrl ||
      item.imageUrl.includes('side-descubri') ||
      item.imageUrl.includes('side-costa') ||
      item.imageUrl.includes('side-comercio') ||
      item.imageUrl === '/banners/side-sorteo-del-mes.jpg';

    return {
      id: item.id || `side-banner-${idx}-${Date.now()}`,
      title: item.title || fallback.title,
      imageUrl: !isLegacyStockImage ? item.imageUrl : fallback.imageUrl,
      href: item.href || fallback.href,
      position: item.position || fallback.position,
      idealSize: item.idealSize || fallback.idealSize,
      isExternal: Boolean(item.isExternal || item.href?.startsWith('http')),
    };
  });
}

export function getSideBanners(): SideBannerItem[] {
  if (memoryStoreSideBanners && Array.isArray(memoryStoreSideBanners) && memoryStoreSideBanners.length > 0) {
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

export async function saveSideBanners(banners: SideBannerItem[]): Promise<boolean> {
  memoryStoreSideBanners = banners;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SIDE_BANNERS_STORAGE_KEY, JSON.stringify(banners));
      window.dispatchEvent(new Event('onmas_side_banners_updated'));
    } catch (e) {
      console.error('Error guardando banners laterales en localStorage:', e);
    }
  }

  try {
    const res = await saveSideBannersAction(banners);
    return res.success;
  } catch (err) {
    console.warn('Error guardando banners laterales en Supabase:', err);
    return false;
  }
}

export function useSideBanners(): SideBannerItem[] {
  const [banners, setBanners] = useState<SideBannerItem[]>(() => getSideBanners());

  useEffect(() => {
    let isMounted = true;
    const sync = () => {
      if (isMounted) {
        setBanners(getSideBanners());
      }
    };

    fetchSideBannersFromSupabase().then((remoteBanners) => {
      if (isMounted && Array.isArray(remoteBanners) && remoteBanners.length > 0) {
        setBanners(remoteBanners);
      }
    });

    window.addEventListener('onmas_side_banners_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      isMounted = false;
      window.removeEventListener('onmas_side_banners_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return banners;
}
