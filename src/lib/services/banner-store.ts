'use client';

export interface BannerItem {
  id: string;
  provinceId: string;
  imageUrl: string;
  device?: 'desktop' | 'mobile' | 'all';
  location?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

export function normalizeImageUrl(url?: string): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '/images/hero-rosario.jpg';
  }
  const trimmed = url.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  if (trimmed.startsWith('images/')) {
    return '/' + trimmed;
  }
  return '/images/' + trimmed;
}

export const DEFAULT_PROVINCE_BANNERS: Record<string, BannerItem[]> = {
  'entre-rios': [
    {
      id: 'er-1',
      provinceId: 'entre-rios',
      imageUrl: '/images/hero-parana.jpg',
      device: 'all',
      location: 'Costanera & Barrancas de Paraná',
      titleLine1: 'ENTRE RÍOS,',
      titleLine2: 'SIEMPRE ON MÁS',
      subtitle: 'Comprá. Vendé. Publicá. Conectá.',
      ctaText: 'Explorá Ofertas de Paraná',
      ctaHref: '/entre-rios/parana',
    },
    {
      id: 'er-2',
      provinceId: 'entre-rios',
      imageUrl: '/images/hero-artesania.jpg',
      device: 'all',
      location: 'Colón, Entre Ríos',
      titleLine1: 'COLÓN &',
      titleLine2: 'EL PALMAR',
      subtitle: 'Fiesta Nacional de la Artesanía & Playas de Arena Blanca',
      ctaText: 'Ver Productos de Colón',
      ctaHref: '/entre-rios/colon',
    },
    {
      id: 'er-3',
      provinceId: 'entre-rios',
      imageUrl: '/images/city-concordia.jpg',
      device: 'all',
      location: 'Concordia & Salto Grande',
      titleLine1: 'CORAZÓN',
      titleLine2: 'CITRÍCOLA',
      subtitle: 'Citrus, Arándanos & Aguas Termales de Concordia',
      ctaText: 'Ver Productores de Concordia',
      ctaHref: '/entre-rios/concordia',
    },
    {
      id: 'er-4',
      provinceId: 'entre-rios',
      imageUrl: '/images/city-gualeguaychu.jpg',
      device: 'all',
      location: 'Gualeguaychú, Entre Ríos',
      titleLine1: 'VIÑEDOS Y',
      titleLine2: 'CARNAVAL',
      subtitle: 'Bodegas Boutique & Enoturismo en Gualeguaychú',
      ctaText: 'Descubrir Gualeguaychú',
      ctaHref: '/entre-rios/gualeguaychu',
    },
  ],
  'santa-fe': [
    {
      id: 'sf-1',
      provinceId: 'santa-fe',
      imageUrl: '/images/hero-rosario.jpg',
      device: 'all',
      location: 'Rosario & Río Paraná, Santa Fe',
      titleLine1: 'SANTA FE,',
      titleLine2: 'SIEMPRE ON MÁS',
      subtitle: 'Comprá. Vendé. Publicá. Conectá.',
      ctaText: 'Explorá Comercios de Rosario',
      ctaHref: '/santa-fe/rosario',
    },
    {
      id: 'sf-2',
      provinceId: 'santa-fe',
      imageUrl: '/images/city-santa-fe-capital.jpg',
      device: 'all',
      location: 'Santa Fe Capital',
      titleLine1: 'SANTA FE CAPITAL',
      titleLine2: 'COSTANERA SETÚBAL',
      subtitle: 'Gastronomía, Historia & Polo Universitario',
      ctaText: 'Ver Productos de Santa Fe',
      ctaHref: '/santa-fe/santa-fe-capital',
    },
    {
      id: 'sf-3',
      provinceId: 'santa-fe',
      imageUrl: '/images/city-rafaela.jpg',
      device: 'all',
      location: 'Rafaela, Santa Fe',
      titleLine1: 'RAFAELA &',
      titleLine2: 'CUENCA LÁCTEA',
      subtitle: 'Potencia Agroindustrial & Diseño Regional',
      ctaText: 'Ver Productos de Rafaela',
      ctaHref: '/santa-fe/rafaela',
    },
    {
      id: 'sf-4',
      provinceId: 'santa-fe',
      imageUrl: '/images/city-rosario.jpg',
      device: 'all',
      location: 'Provincia de Santa Fe',
      titleLine1: 'SUR & NORTE',
      titleLine2: 'SANTAFESINO',
      subtitle: 'Venado Tuerto, Reconquista, Esperanza & Santo Tomé',
      ctaText: 'Explorar Ciudades de Santa Fe',
      ctaHref: '/santa-fe',
    },
  ],
};

const STORAGE_KEY = 'onmas_province_banners_v2';

// In-memory cache to ensure live updates across components without depending solely on localStorage quota
const memoryStore: Record<string, BannerItem[]> = { ...DEFAULT_PROVINCE_BANNERS };

export function getBannersByProvince(provinceId: string): BannerItem[] {
  const fallback = DEFAULT_PROVINCE_BANNERS[provinceId] || DEFAULT_PROVINCE_BANNERS['santa-fe'] || [];

  if (typeof window === 'undefined') {
    return memoryStore[provinceId] && memoryStore[provinceId].length > 0
      ? memoryStore[provinceId]
      : fallback;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: Record<string, BannerItem[]> = JSON.parse(raw);
      const targetList = parsed[provinceId] || (provinceId !== 'santa-fe' ? parsed['santa-fe'] : undefined);
      if (targetList && Array.isArray(targetList)) {
        const valid = targetList.filter((b) => b && typeof b.imageUrl === 'string' && b.imageUrl.trim().length > 0);
        if (valid.length > 0) {
          memoryStore[provinceId] = valid;
          return valid;
        }
      }
    }
  } catch (e) {
    console.error('Error reading province banners from localStorage:', e);
  }

  return memoryStore[provinceId] && memoryStore[provinceId].length > 0
    ? memoryStore[provinceId]
    : fallback;
}

export async function fetchBannersFromSupabase(provinceId: string): Promise<BannerItem[]> {
  try {
    const { createPublicClient } = await import('@/lib/supabase/public');
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from('banner_slides')
      .select('*')
      .eq('province_id', provinceId)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const mapped: BannerItem[] = data
        .filter((slide) => slide && (slide.image_url || slide.imageUrl))
        .map((slide, idx) => ({
          id: slide.id || `b-sp-${idx}`,
          provinceId: slide.province_id || provinceId,
          imageUrl: slide.image_url || slide.imageUrl,
          ctaHref: slide.cta_url || slide.ctaHref || `/${provinceId}`,
          location: slide.city_tag || slide.location || '',
          titleLine1: slide.title || '',
        }));

      if (mapped.length > 0) {
        memoryStore[provinceId] = mapped;
        if (typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const store: Record<string, BannerItem[]> = raw ? JSON.parse(raw) : { ...DEFAULT_PROVINCE_BANNERS };
            store[provinceId] = mapped;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
          } catch (e) {}
        }
        return mapped;
      }
    }
  } catch (e) {
    console.warn('Notice loading Supabase banners:', e);
  }

  return getBannersByProvince(provinceId);
}

export function saveBannersByProvince(provinceId: string, banners: BannerItem[]): void {
  // Always update in-memory cache first
  memoryStore[provinceId] = banners;

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const store: Record<string, BannerItem[]> = raw ? JSON.parse(raw) : { ...DEFAULT_PROVINCE_BANNERS };
      store[provinceId] = banners;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      console.warn('Warning saving province banners to localStorage (storage quota or access issue):', e);
    }

    // Always dispatch event to notify active UI components
    window.dispatchEvent(new Event('onmas_banners_updated'));
  }
}

