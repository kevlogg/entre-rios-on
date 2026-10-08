export interface PlanConfigItem {
  id: string;
  name: string;
  price: number;
  period: string;
  badge: string;
  catalogLimitText: string;
  description: string;
  targetAudience: string;
  features: string[];
}

export const DEFAULT_SUBSCRIPTION_PLANS: PlanConfigItem[] = [
  {
    id: 'bronce',
    name: 'Plan Bronce',
    price: 29000,
    period: 'mes',
    badge: 'Presencia Básica',
    catalogLimitText: 'Catálogo de hasta 5 productos / servicios',
    description: 'Presencia inicial en el portal regional para comercios y turismo.',
    targetAudience: 'Comercios y Turismo que inician su presencia digital',
    features: [
      'Presencia local en directorio ON MÁS',
      'Botón directo a WhatsApp (sin comisiones)',
      'Catálogo de hasta 5 productos / servicios',
    ],
  },
  {
    id: 'plata',
    name: 'Plan Plata',
    price: 49000,
    period: 'mes',
    badge: 'Mayor Visibilidad',
    catalogLimitText: 'Catálogo de hasta 20 productos / servicios',
    description: 'Para comercios y emprendimientos turísticos en crecimiento activo.',
    targetAudience: 'Comercios y Prestadores Turísticos destacados',
    features: [
      'Presencia local en directorio ON MÁS',
      'Botón directo a WhatsApp (sin comisiones)',
      'Catálogo de hasta 20 productos / servicios',
      'Posicionamiento destacado en guía local y categoría',
      'Métricas en tiempo real (visitas y clics a WhatsApp)',
      'Insignia Comercio Verificado Plata',
    ],
  },
  {
    id: 'oro',
    name: 'Plan Oro',
    price: 99000,
    period: 'mes',
    badge: 'MÁXIMO ALCANCE • VIP',
    catalogLimitText: 'Catálogo ILIMITADO de productos y servicios',
    description: 'Liderazgo y máxima cobertura provincial en el portal y redes sociales.',
    targetAudience: 'Grandes comercios, cadenas y complejos turísticos VIP',
    features: [
      'Presencia local en directorio ON MÁS',
      'Botón directo a WhatsApp (sin comisiones)',
      'Catálogo ILIMITADO de productos y servicios',
      'Posicionamiento destacado en guía local y categoría',
      'Métricas en tiempo real (visitas y clics a WhatsApp)',
      'Insignia Comercio Verificado Plata',
      'Destacado TOP en portada provincial',
      'Cobertura especial y notas de prensa / editoriales',
      'Insignia Gold / Comercio Verificado Oro',
      'Soporte prioritario 24/7 y asesoramiento comercial',
      'Publicidad y visibilidad exclusiva dentro del sitio web y en redes sociales',
    ],
  },
];
