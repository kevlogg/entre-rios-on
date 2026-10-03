'use client';

import { useState, useEffect } from 'react';
import { getProvincesConfigAction, saveProvincesConfigAction } from '@/server/actions/superadmin';

export interface ProvinceCityItem {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface ProvinceItem {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  badge?: string;
  cities?: ProvinceCityItem[];
}

export const DEFAULT_PROVINCES_CONFIG: ProvinceItem[] = [
  { id: 'santa-fe', name: 'Santa Fe', slug: 'santa-fe', isActive: true, badge: 'Provincia Activa' },
  { id: 'entre-rios', name: 'Entre Ríos', slug: 'entre-rios', isActive: false, badge: 'Próximamente' },
];

const PROVINCE_STORAGE_KEY = 'onmas_province_config_v1';

let memoryStoreProvinces: ProvinceItem[] | null = null;

export function getProvincesConfig(): ProvinceItem[] {
  if (memoryStoreProvinces && memoryStoreProvinces.length > 0) {
    return memoryStoreProvinces;
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(PROVINCE_STORAGE_KEY);
      if (raw) {
        const parsed: ProvinceItem[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryStoreProvinces = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error al leer configuración de provincias de localStorage:', e);
    }
  }

  return DEFAULT_PROVINCES_CONFIG;
}

export async function fetchProvincesFromSupabase(): Promise<ProvinceItem[]> {
  try {
    const res = await getProvincesConfigAction();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      memoryStoreProvinces = res.data;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(PROVINCE_STORAGE_KEY, JSON.stringify(res.data));
          window.dispatchEvent(new Event('onmas_provinces_updated'));
        } catch (e) {}
      }
      return res.data;
    }
  } catch (e) {
    console.warn('Nota leyendo provincias de Supabase:', e);
  }
  return getProvincesConfig();
}

export function getActiveProvinces(): ProvinceItem[] {
  const all = getProvincesConfig();
  const active = all.filter((p) => p.isActive);
  return active.length > 0 ? active : [DEFAULT_PROVINCES_CONFIG[0]];
}

export function saveProvincesConfig(provinces: ProvinceItem[]): void {
  memoryStoreProvinces = provinces;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PROVINCE_STORAGE_KEY, JSON.stringify(provinces));
      window.dispatchEvent(new Event('onmas_provinces_updated'));
    } catch (e) {
      console.error('Error al guardar configuración de provincias:', e);
    }
  }

  // Persistir en Supabase Cloud
  saveProvincesConfigAction(provinces).catch((err) => {
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


