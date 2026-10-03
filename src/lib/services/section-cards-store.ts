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
    id: 'comercio-digital',
    title: 'COMERCIOS ADHERIDOS',
    subtitle: 'Directorio unificado de locales, marcas y empresas.',
    cta: 'Explorar comercios',
    href: '/comercios',
    image: '/images/bento-1.jpg',
    idealSize: '600 x 400 px (3:2 en HD)',
  },
  {
    id: 'catalogo-ofertas',
    title: 'CATÁLOGO & OFERTAS',
    subtitle: 'Miles de productos, servicios y promociones.',
    cta: 'Ver ofertas',
    href: '/catalogo',
    image: '/images/offer-2.jpg',
    idealSize: '600 x 400 px (3:2 en HD)',
  },
  {
    id: 'turismo-experiencias',
    title: 'TURISMO & EXPERIENCIAS',
    subtitle: 'Descubrí paseos, termas y gastronomía regional.',
    cta: 'Explorar turismo',
    href: '/turismo',
    image: '/images/bento-5.jpg',
    idealSize: '600 x 400 px (3:2 en HD)',
  },
  {
    id: 'comunidad-on',
    title: 'COMUNIDAD ON MÁS',
    subtitle: 'Conectate, compartí y hacé crecer lo nuestro.',
    cta: 'Sumate',
    href: '/comunidad',
    image: '/images/bento-2.jpg',
    idealSize: '600 x 400 px (3:2 en HD)',
  },
];

const SECTION_CARDS_STORAGE_KEY = 'onmas_section_cards_v1';
let memoryStoreSectionCards: SectionCardItem[] | null = null;

export function getSectionCards(): SectionCardItem[] {
  if (memoryStoreSectionCards && memoryStoreSectionCards.length > 0) {
    return memoryStoreSectionCards;
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(SECTION_CARDS_STORAGE_KEY);
      if (raw) {
        const parsed: SectionCardItem[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryStoreSectionCards = parsed;
          return parsed;
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
      memoryStoreSectionCards = res.data;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(SECTION_CARDS_STORAGE_KEY, JSON.stringify(res.data));
          window.dispatchEvent(new Event('onmas_section_cards_updated'));
        } catch (e) {}
      }
      return res.data;
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
