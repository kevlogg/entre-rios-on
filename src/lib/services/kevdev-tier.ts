export interface KevDevTramo {
  id: number;
  name: string;
  maxCommerces: number;
  range: string;
  abono: string;
  recaudacionEstimada: string;
}

export const KEVDEV_TRAMOS: KevDevTramo[] = [
  {
    id: 1,
    name: 'Tramo 1: Semilla',
    maxCommerces: 15,
    range: 'Hasta 15 comercios',
    abono: '$49.000 ARS/mes',
    recaudacionEstimada: '$300.000 ARS/mes',
  },
  {
    id: 2,
    name: 'Tramo 2: Crecimiento',
    maxCommerces: 40,
    range: '16 a 40 comercios',
    abono: '$85.000 ARS/mes',
    recaudacionEstimada: '$800.000 ARS/mes',
  },
  {
    id: 3,
    name: 'Tramo 3: Expansión',
    maxCommerces: 80,
    range: '41 a 80 comercios',
    abono: '$140.000 ARS/mes (Tope Abono)',
    recaudacionEstimada: '$1.600.000 ARS/mes',
  },
  {
    id: 4,
    name: 'Tramo 4: Escala Regional',
    maxCommerces: 200,
    range: '81 a 200 comercios',
    abono: 'Exclusivo Licencia Perpetua',
    recaudacionEstimada: '$4.000.000 ARS/mes',
  },
  {
    id: 5,
    name: 'Tramo 5: Consolidación',
    maxCommerces: 500,
    range: '201 a 500 comercios',
    abono: 'Exclusivo Licencia Perpetua',
    recaudacionEstimada: '$10.000.000 ARS/mes',
  },
  {
    id: 6,
    name: 'Tramo 6: Macro Provincial',
    maxCommerces: 1000,
    range: '501 a 1.000 comercios',
    abono: 'Exclusivo Licencia Perpetua',
    recaudacionEstimada: '$20.000.000 ARS/mes',
  },
];

export interface KevDevTierConfig {
  currentTierId: number;
  isLockActive: boolean;
  customMaxCommerces?: number;
  supportWhatsApp: string;
  supportMessage: string;
  unlockedByDev?: boolean;
  unlockedNote?: string;
  updatedAt?: string;
}

export const DEFAULT_KEVDEV_TIER_CONFIG: KevDevTierConfig = {
  currentTierId: 1,
  isLockActive: true,
  supportWhatsApp: '5493426514889',
  supportMessage: 'Hola Kevin, te contacto desde la plataforma ON MÁS para coordinar la ampliación al siguiente tramo de comercios activos.',
  unlockedByDev: false,
  updatedAt: new Date().toISOString(),
};

export function getTramoById(tierId: number): KevDevTramo {
  return KEVDEV_TRAMOS.find((t) => t.id === tierId) || KEVDEV_TRAMOS[0];
}
