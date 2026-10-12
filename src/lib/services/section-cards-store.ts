'use client';

import { useState, useEffect } from 'react';
import { getSectionCardsAction, saveSectionCardsAction } from '@/server/actions/superadmin';

export interface SectionCardItem {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  image: string;
  idealSize: string;
}

export const DEFAULT_SECTION_CARDS: SectionCardItem[] = [
  {
    id: 'turismo-regional',
    title: 'Turismo Regional',
    subtitle: 'Descubrí paseos, playas y destinos de la región.',
    cta: 'Explorar',
    href: '/turismo',
    image: '/images/section-turismo-regional.jpg',
    idealSize: '600 × 400 px (3:2 en HD)',
  },
  {
    id: 'comercio-industria',
    title: 'Comercio e Industria',
    subtitle: 'Directorio unificado de comercios, marcas y pymes regionales.',
    cta: 'Ver comercios',
    href: '/comercios',
    image: '/images/section-comercio-industria.jpg',
    idealSize: '600 × 400 px (3:2 en HD)',
  },
  {
    id: 'ofertas-descuentos',
    title: 'Ofertas y descuentos',
    subtitle: 'Miles de productos, promociones y beneficios comerciales.',
    cta: 'Ver ofertas',
    href: '/oportunidades',
    image: '/images/section-ofertas-descuentos.jpg',
    idealSize: '600 × 400 px (3:2 en HD)',
  },
  {
    id: 'sorteos',
    title: 'Sorteos ON+',
    subtitle: 'Todos los meses, nuevos premios y sorteos regionales.',
    cta: 'Participar',
    href: '/sorteos',
    image: '/images/section-sorteos-onmas.jpg',
    idealSize: '600 × 400 px (3:2 en HD)',
  },
  {
    id: 'empleos',
    title: 'Empleos y avisos',
    subtitle: 'Búsquedas laborales y avisos clasificados directos.',
    cta: 'Ver avisos',
    href: '/clasificados',
    image: '/images/section-empleos-avisos.jpg',
    idealSize: '600 × 400 px (3:2 en HD)',
  },
  {
    id: 'mi-sitio-web',
    title: 'Mi Sitio Web',
    subtitle: 'Obtené la página web y tienda online para tu comercio.',
    cta: 'Solicitar sitio',
    href: '/mi-sitio-web',
    image: '/images/section-mi-sitio-web.jpg',
    idealSize: '600 × 400 px (3:2 en HD)',
  },
];

const SECTION_CARDS_STORAGE_KEY = 'onmas_section_cards_v1';
let memoryStoreSectionCards: SectionCardItem[] | null = null;

function mergeWithDefaults(stored: SectionCardItem[]): SectionCardItem[] {
  if (!Array.isArray(stored) || stored.length === 0) return DEFAULT_SECTION_CARDS;
  return stored.map((item, idx) => ({
    id: item.id || `custom-card-${idx}-${Date.now()}`,
    title: item.title || 'NUEVA SECCIÓN',
    subtitle: item.subtitle || 'Descripción de la sección',
    cta: item.cta || 'Explorar',
    href: item.href || '/',
    image: item.image || '/images/bento-1.jpg',
    idealSize: item.idealSize || '600 × 400 px (3:2 en HD)',
  }));
}

export function getSectionCards(): SectionCardItem[] {
  if (memoryStoreSectionCards && Array.isArray(memoryStoreSectionCards)) {
    return memoryStoreSectionCards;
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(SECTION_CARDS_STORAGE_KEY);
      if (raw) {
        const parsed: SectionCardItem[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = mergeWithDefaults(parsed);
          memoryStoreSectionCards = merged;
          return merged;
        }
      }
    } catch (e) {
      console.error('Error al leer cards de secciones de localStorage:', e);
    }
  }

  return DEFAULT_SECTION_CARDS;
}

export async function fetchSectionCardsFromSupabase(): Promise<SectionCardItem[]> {
  try {
    const res = await getSectionCardsAction();
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      const merged = mergeWithDefaults(res.data);
      memoryStoreSectionCards = merged;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(SECTION_CARDS_STORAGE_KEY, JSON.stringify(merged));
          window.dispatchEvent(new Event('onmas_section_cards_updated'));
        } catch (e) {}
      }
      return merged;
    }
  } catch (e) {
    console.warn('Nota leyendo section cards de Supabase:', e);
  }
  return getSectionCards();
}

export function saveSectionCards(cards: SectionCardItem[]): void {
  memoryStoreSectionCards = cards;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SECTION_CARDS_STORAGE_KEY, JSON.stringify(cards));
      window.dispatchEvent(new Event('onmas_section_cards_updated'));
    } catch (e) {
      console.error('Error guardando cards de secciones en localStorage:', e);
    }
  }

  saveSectionCardsAction(cards).catch((err) => {
    console.warn('Error guardando cards de secciones en Supabase:', err);
  });
}

export function useSectionCards(): SectionCardItem[] {
  const [cards, setCards] = useState<SectionCardItem[]>(() => getSectionCards());

  useEffect(() => {
    const syncCards = () => {
      setCards(getSectionCards());
    };

    syncCards();

    fetchSectionCardsFromSupabase().then(() => {
      syncCards();
    });

    window.addEventListener('onmas_section_cards_updated', syncCards);
    window.addEventListener('storage', syncCards);
    return () => {
      window.removeEventListener('onmas_section_cards_updated', syncCards);
      window.removeEventListener('storage', syncCards);
    };
  }, []);

  return cards;
}
