'use client';

import { useState, useEffect } from 'react';
import { getProvincesConfigAction, saveProvincesConfigAction } from '@/server/actions/superadmin';

export interface ProvinceCityItem {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  imageUrl?: string;
}

export interface ProvinceItem {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  badge?: string;
  badgeColor?: string;
  cities?: ProvinceCityItem[];
}

export function normalizeProvinceBadge(p: ProvinceItem): ProvinceItem {
  return {
    ...p,
    badge: p.isActive ? 'Activa' : 'Próximamente',
  };
}

export const DEFAULT_PROVINCES_CONFIG: ProvinceItem[] = [
  { id: 'santa-fe', name: 'Santa Fe', slug: 'santa-fe', isActive: true, badge: 'Activa', badgeColor: '#0047BA' },
  { id: 'entre-rios', name: 'Entre Ríos', slug: 'entre-rios', isActive: true, badge: 'Activa', badgeColor: '#00A859' },
  { id: 'caba', name: 'CABA', slug: 'caba', isActive: true, badge: 'Activa', badgeColor: '#EAB308' },
  { id: 'cordoba', name: 'Córdoba', slug: 'cordoba', isActive: true, badge: 'Activa', badgeColor: '#8B4513' },
  { id: 'buenos-aires', name: 'Buenos Aires', slug: 'buenos-aires', isActive: false, badge: 'Próximamente', badgeColor: '#00529B' },
];

const PROVINCE_STORAGE_KEY = 'onmas_province_config_v1';

let memoryStoreProvinces: ProvinceItem[] | null = null;

export function getProvincesConfig(): ProvinceItem[] {
  if (memoryStoreProvinces && memoryStoreProvinces.length > 0) {
    return memoryStoreProvinces.map(normalizeProvinceBadge);
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(PROVINCE_STORAGE_KEY);
      if (raw) {
        const parsed: ProvinceItem[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(normalizeProvinceBadge);
          memoryStoreProvinces = normalized;
          return normalized;
        }
      }
    } catch (e) {
      console.error('Error al leer configuración de provincias de localStorage:', e);
    }
  }

  return DEFAULT_PROVINCES_CONFIG.map(normalizeProvinceBadge);
}

export async function fetchProvincesFromSupabase(): Promise<ProvinceItem[]> {
  try {
    const res = await getProvincesConfigAction();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      const normalized = res.data.map(normalizeProvinceBadge);
      memoryStoreProvinces = normalized;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(PROVINCE_STORAGE_KEY, JSON.stringify(normalized));
          window.dispatchEvent(new Event('onmas_provinces_updated'));
        } catch (e) {}
      }
      return normalized;
    }
  } catch (e) {
    console.warn('Nota leyendo provincias de Supabase:', e);
  }
  return getProvincesConfig();
}

export function getActiveProvinces(): ProvinceItem[] {
  // El criterio unificado exige que aparezcan en la lista todas las provincias:
  // Si está activa con badge "Activa", si no está activa con badge "Próximamente".
  const all = getProvincesConfig();
  return all.map(normalizeProvinceBadge);
}

export function saveProvincesConfig(provinces: ProvinceItem[]): void {
  const normalized = provinces.map(normalizeProvinceBadge);
  memoryStoreProvinces = normalized;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PROVINCE_STORAGE_KEY, JSON.stringify(normalized));
      window.dispatchEvent(new Event('onmas_provinces_updated'));
    } catch (e) {
      console.error('Error al guardar configuración de provincias:', e);
    }
  }

  // Persistir en Supabase Cloud
  saveProvincesConfigAction(normalized).catch((err) => {
    console.warn('Error guardando provincias en Supabase:', err);
  });
}

export function useActiveProvinces(): ProvinceItem[] {
  const [activeProvinces, setActiveProvinces] = useState<ProvinceItem[]>(() => {
    return getActiveProvinces();
  });

  useEffect(() => {
    const syncProvinces = () => {
      setActiveProvinces(getActiveProvinces());
    };

    // 1. Sincronizar desde memoria / localStorage
    syncProvinces();

    // 2. Fetch desde Supabase Cloud
    fetchProvincesFromSupabase().then(() => {
      syncProvinces();
    });

    window.addEventListener('onmas_provinces_updated', syncProvinces);
    window.addEventListener('storage', syncProvinces);
    return () => {
      window.removeEventListener('onmas_provinces_updated', syncProvinces);
      window.removeEventListener('storage', syncProvinces);
    };
  }, []);

  return activeProvinces;
}

const SELECTED_PROVINCE_KEY = 'onmas_selected_province';
const PROVINCE_COOKIE_NAME = 'onmas_province';

export function getPersistedProvince(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const fromLocal = localStorage.getItem(SELECTED_PROVINCE_KEY);
    if (fromLocal && fromLocal !== 'all' && fromLocal.trim()) {
      return fromLocal.trim();
    }
    const match = document.cookie.match(new RegExp('(^| )' + PROVINCE_COOKIE_NAME + '=([^;]+)'));
    if (match && match[2] && match[2] !== 'all') {
      return decodeURIComponent(match[2].trim());
    }
  } catch (e) {
    console.warn('Error al leer provincia persistente:', e);
  }
  return null;
}

export function setPersistedProvince(provinceId: string, persistToUser = true): void {
  if (typeof window === 'undefined') return;
  try {
    if (!provinceId || provinceId === 'all') {
      localStorage.removeItem(SELECTED_PROVINCE_KEY);
      document.cookie = `${PROVINCE_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    } else {
      localStorage.setItem(SELECTED_PROVINCE_KEY, provinceId);
      document.cookie = `${PROVINCE_COOKIE_NAME}=${encodeURIComponent(provinceId)}; path=/; max-age=31536000; SameSite=Lax`;
    }

    window.dispatchEvent(new CustomEvent('onmas:province_changed', { detail: { provinceId } }));

    if (persistToUser && provinceId) {
      import('@/lib/supabase/client').then(({ createClient }) => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            supabase.auth.updateUser({
              data: {
                preferred_province_id: provinceId,
              },
            }).catch(() => {});
          }
        }).catch(() => {});
      }).catch(() => {});
    }
  } catch (e) {
    console.warn('Error al guardar provincia persistente:', e);
  }
}


