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
    idealSize: '600 × 400 px (3:2 en HD)',
  },
  {
    id: 'catalogo-ofertas',
    title: 'CATÁLOGO & OFERTAS',
    subtitle: 'Miles de productos, servicios y promociones.',
    cta: 'Ver ofertas',
    href: '/catalogo',
    image: '/images/offer-2.jpg',
    idealSize: '600 × 400 px (3:2 en HD)',
  },
  {
    id: 'turismo-experiencias',
    title: 'TURISMO & EXPERIENCIAS',
    subtitle: 'Descubrí paseos, termas y gastronomía regional.',
    cta: 'Explorar turismo',
    href: '/turismo',
    image: '/images/bento-5.jpg',
    idealSize: '600 × 400 px (3:2 en HD)',
  },
  {
    id: 'comunidad-on',
    title: 'COMUNIDAD ON MÁS',
    subtitle: 'Conectate, compartí y hacé crecer lo nuestro.',
    cta: 'Sumate',
    href: '/comunidad',
    image: '/images/bento-2.jpg',
    idealSize: '600 × 400 px (3:2 en HD)',
  },
  {
    id: 'sorteos',
    title: 'SORTEOS ON MÁS',
    subtitle: 'Todos los meses, nuevos premios y sorteos regionales.',
    cta: 'Quiero participar',
    href: '/sorteos',
    image: '/images/bento-3.jpg',
    idealSize: '600 × 400 px (3:2 en HD)',
  },
  {
    id: 'empleos',
    title: 'EMPLEOS & OPORTUNIDADES',
    subtitle: 'Encontrá ofertas laborales o cargá tu perfil profesional.',
    cta: 'Ver empleos',
    href: '/empleos',
    image: '/images/bento-4.jpg',
    idealSize: '600 × 400 px (3:2 en HD)',
  },
  {
    id: 'mi-sitio-web',
    title: 'MI SITIO WEB',
    subtitle: 'Obtené la página web propia para tu comercio o negocio.',
    cta: 'Solicitar sitio',
    href: '/mi-sitio-web',
    image: '/images/bento-7.jpg',
    idealSize: '600 × 400 px (3:2 en HD)',
  },
  {
    id: 'publica-tu-negocio',
    title: 'PUBLICÁ TU NEGOCIO',
    subtitle: 'Llegá a miles de clientes en toda la provincia.',
    cta: 'Quiero publicar',
    href: '/login',
    image: '/images/bento-6.jpg',
    idealSize: '600 × 400 px (3:2 en HD)',
  },
];

const SECTION_CARDS_STORAGE_KEY = 'onmas_section_cards_v1';
let memoryStoreSectionCards: SectionCardItem[] | null = null;

function mergeWithDefaults(stored: SectionCardItem[]): SectionCardItem[] {
  if (!Array.isArray(stored)) return DEFAULT_SECTION_CARDS;

  const storedMap = new Map<string, SectionCardItem>();
  stored.forEach((item) => {
    if (item && item.id) storedMap.set(item.id, item);
  });

  return DEFAULT_SECTION_CARDS.map((def) => {
    const found = storedMap.get(def.id);
    if (!found) return def;
    return {
      id: def.id,
      title: found.title || def.title,
      subtitle: found.subtitle || def.subtitle,
      cta: found.cta || def.cta,
      href: found.href || def.href,
      image: found.image || def.image,
      idealSize: found.idealSize || def.idealSize,
    };
  });
}

export function getSectionCards(): SectionCardItem[] {
  if (memoryStoreSectionCards && memoryStoreSectionCards.length > 0) {
    return mergeWithDefaults(memoryStoreSectionCards);
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
