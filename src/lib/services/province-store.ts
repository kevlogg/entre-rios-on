'use client';

export interface ProvinceItem {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  badge?: string;
}

export const DEFAULT_PROVINCES_CONFIG: ProvinceItem[] = [
  { id: 'santa-fe', name: 'Santa Fe', slug: 'santa-fe', isActive: true, badge: 'Provincia Activa' },
  { id: 'entre-rios', name: 'Entre Ríos', slug: 'entre-rios', isActive: false, badge: 'Próximamente' },
];

const PROVINCE_STORAGE_KEY = 'onmas_province_config_v1';

export function getProvincesConfig(): ProvinceItem[] {
  if (typeof window === 'undefined') {
    return DEFAULT_PROVINCES_CONFIG;
  }
  try {
    const raw = localStorage.getItem(PROVINCE_STORAGE_KEY);
    if (raw) {
      const parsed: ProvinceItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error al leer configuración de provincias:', e);
  }
  return DEFAULT_PROVINCES_CONFIG;
}

export function saveProvincesConfig(provinces: ProvinceItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROVINCE_STORAGE_KEY, JSON.stringify(provinces));
    window.dispatchEvent(new Event('onmas_provinces_updated'));
  } catch (e) {
    console.error('Error al guardar configuración de provincias:', e);
  }
}
