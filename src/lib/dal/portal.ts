import { City, Commerce, Product, CommunityEvent, BannerSlide } from '@/types';

// Mock Cities Data - Entre Ríos Principal Nodes
const CITIES_MOCK: City[] = [
  {
    id: 'parana',
    name: 'Paraná',
    slug: 'parana',
    department: 'Paraná',
    description: 'Capital provincial a orillas del majestuoso Río Paraná, destacada por sus barrancas, gastronomía fluvial y centro comercial.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000',
    isFeatured: true,
    commerceCount: 342,
  },
  {
    id: 'concordia',
    name: 'Concordia',
    slug: 'concordia',
    department: 'Concordia',
    description: 'Corazón citrícola y termal sobre el Uruguay, epicentro de la producción de arándanos, citrus y turismo de pesca.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
    isFeatured: true,
    commerceCount: 215,
  },
  {
    id: 'colon',
    name: 'Colón',
    slug: 'colon',
    department: 'Colón',
    description: 'Capital Nacional de la Artesanía, playas de arenas blancas, complejas termas y portal de entrada al Parque Nacional El Palmar.',
    imageUrl: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=1000',
    isFeatured: true,
    commerceCount: 189,
  },
  {
    id: 'gualeguaychu',
    name: 'Gualeguaychú',
    slug: 'gualeguaychu',
    department: 'Gualeguaychú',
    description: 'Capital del Carnaval del País, con intensos viñedos locales, balnearios sobre el río Gualeguaychú y rica industria textil y gráfica.',
    imageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=1000',
    isFeatured: true,
    commerceCount: 278,
  },
  {
    id: 'concepcion-del-uruguay',
    name: 'Concepción del Uruguay',
    slug: 'concepcion-del-uruguay',
    department: 'Uruguay',
    description: 'La Histórica de Entre Ríos, hogar del Palacio San José, polo universitario del litoral y activo puerto comercial.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000',
    isFeatured: true,
    commerceCount: 164,
  },
  {
    id: 'federacion',
    name: 'Federación',
    slug: 'federacion',
    department: 'Federación',
    description: 'Pionera termal a orillas del Embalse Salto Grande, caracterizada por sus parques acuáticos y serenidad turística.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1000',
    isFeatured: true,
    commerceCount: 120,
  }
];

// Hero Editorial Slides
const HERO_SLIDES_MOCK: BannerSlide[] = [
  {
    id: 'slide-1',
    title: 'XXXIX Fiesta Nacional de la Artesanía',
    subtitle: 'Vení a Colón a vivir 9 días de arte en vivo, música popular, orfebres del país y la mejor gastronomía costera.',
    badgeText: 'Fiesta Nacional • Colón',
    badgeType: 'event',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1400',
    ctaText: 'Ver Agenda & Entradas',
    ctaUrl: '#agenda',
    cityTag: 'Colón',
    publishedAt: '2026-09-05',
  },
  {
    id: 'slide-2',
    title: 'Semana de los Sabores del Río Paraná',
    subtitle: 'Más de 25 restaurantes y comedores de barranca ofrecen platos exclusivos con dorado, surubí y surubí ahumado.',
    badgeText: 'Gastronomía • Paraná',
    badgeType: 'tourism',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1400',
    ctaText: 'Descubrir Menús',
    ctaUrl: '#catalogo',
    cityTag: 'Paraná',
    publishedAt: '2026-09-06',
  },
  {
    id: 'slide-3',
    title: 'Ruta del Vino y Viñedos de Gualeguaychú',
    subtitle: 'Recorridos guiados por las bodegas boutique entrerrianas con catas al atardecer frente al río.',
    badgeText: 'Enoturismo • Gualeguaychú',
    badgeType: 'commerce',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1400',
    ctaText: 'Reservar Degustación',
    ctaUrl: '#catalogo',
    cityTag: 'Gualeguaychú',
    publishedAt: '2026-09-07',
  }
];

// Mock Commerces
const COMMERCES_MOCK: Record<string, Commerce> = {
  'c1': {
    id: 'c1',
    name: 'Alfarería & Cerámica Delta',
    slug: 'alfareria-ceramica-delta',
    category: 'Artesanías & Decoración',
    cityId: 'colon',
    cityName: 'Colón',
    description: 'Taller galardonado de cerámica modelada a mano utilizando arcillas nativas y diseños inspirados en la fauna del litoral.',
    rating: 4.9,
    reviewCount: 84,
    isVerified: true,
    isSubscriptionActive: true,
    logoUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=200',
    coverUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800',
    phoneWhatsApp: '5493447451234',
    address: '12 de Octubre 450, Colón',
    instagram: '@ceramica.delta.colon',
  },
  'c2': {
    id: 'c2',
    name: 'Comedor Costanera El Dorado',
    slug: 'comedor-costanera-el-dorado',
    category: 'Gastronomía de Río',
    cityId: 'parana',
    cityName: 'Paraná',
    description: 'Especialistas en pescado a la parrilla, empanadas de pescado de río y postres tradicionales de quinotos al almíbar.',
    rating: 4.8,
    reviewCount: 142,
    isVerified: true,
    isSubscriptionActive: true,
    logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=200',
    coverUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    phoneWhatsApp: '5493434229876',
    address: 'Av. Laurencena 1280, Puerto de Paraná',
    instagram: '@eldoradaparanacostanera',
  },
  'c3': {
    id: 'c3',
    name: 'La Candelaria Viñedos & Bodega',
    slug: 'la-candelaria-vinedos',
    category: 'Vinos & Delicatessen',
    cityId: 'gualeguaychu',
    cityName: 'Gualeguaychú',
    description: 'Bodega de autor con varietales de Tannat y Marselan adaptados al terruño entrerriano.',
    rating: 5.0,
    reviewCount: 67,
    isVerified: true,
    isSubscriptionActive: true,
    logoUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=200',
    coverUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
    phoneWhatsApp: '5493446584321',
    address: 'Ruta 14 Km 58, Gualeguaychú',
  },
  'c4': {
    id: 'c4',
    name: 'Citrus & Dulces del Uruguay',
    slug: 'citrus-dulces-del-uruguay',
    category: 'Productores Regionales',
    cityId: 'concordia',
    cityName: 'Concordia',
    description: 'Elaboración artesanal de mermeladas de arándanos, licores de naranja y cascos de mamón en almíbar.',
    rating: 4.7,
    reviewCount: 96,
    isVerified: true,
    isSubscriptionActive: true,
    logoUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=200',
    coverUrl: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800',
    phoneWhatsApp: '5493454112233',
    address: 'Entre Ríos 890, Concordia',
  }
};

// Mock Featured Products & Services
const PRODUCTS_MOCK: Product[] = [
  {
    id: 'p1',
    title: 'Juego de Mates de Cerámica Cincelada y Alpaca',
    slug: 'juego-mate-ceramica-alpaca',
    price: 34500,
    currency: 'ARS',
    commerceId: 'c1',
    commerceName: 'Alfarería & Cerámica Delta',
    cityId: 'colon',
    cityName: 'Colón',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
    category: 'Artesanías',
    isFeatured: true,
    description: 'Mate de cerámica artesanal horneada a 1200°C con virola grabada en alpaca con motivos de flora autóctona. Incluye bombilla de plata alemana.',
    phoneWhatsApp: '5493447451234',
    whatsappMessageCustom: 'Hola Alfarería Delta, vi en Entre Ríos ON el Juego de Mates de Cerámica Cincelada y quisiera consultar disponibilidad y envíos.',
  },
  {
    id: 'p2',
    title: 'Dorado a la Parrilla con Hierbas del Litoral para 2 Personas',
    slug: 'dorado-a-la-parrilla-para-dos',
    price: 28000,
    currency: 'ARS',
    commerceId: 'c2',
    commerceName: 'Comedor Costanera El Dorado',
    cityId: 'parana',
    cityName: 'Paraná',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    category: 'Gastronomía',
    isFeatured: true,
    description: 'Corte fresco de dorado deshuesado asado a las brasas con manteca de limón, romero y papas rústicas al horno de barro.',
    phoneWhatsApp: '5493434229876',
    whatsappMessageCustom: 'Hola Comedor El Dorado, quiero hacer una reserva / pedir el plato de Dorado a la Parrilla publicado en Entre Ríos ON.',
  },
  {
    id: 'p3',
    title: 'Caja Estuche Trilogía de Vinos Tannat Reserva',
    slug: 'estuche-trilogia-tannat-reserva',
    price: 42000,
    currency: 'ARS',
    commerceId: 'c3',
    commerceName: 'La Candelaria Viñedos & Bodega',
    cityId: 'gualeguaychu',
    cityName: 'Gualeguaychú',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
    category: 'Regalos & Vinos',
    isFeatured: true,
    description: 'Edición limitada de 3 botellas estacionadas durante 14 meses en barricas de roble francés. Presentación en caja de madera de pino regional.',
    phoneWhatsApp: '5493446584321',
    whatsappMessageCustom: 'Hola Bodega La Candelaria, estoy interesado en encargar la Caja Estuche Trilogía de Vinos Tannat vista en Entre Ríos ON.',
  },
  {
    id: 'p4',
    title: 'Pack Regalo Dulces Orgánicos & Miel de Azahar de Citrus',
    slug: 'pack-dulces-organicos-miel-azahar',
    price: 18900,
    currency: 'ARS',
    commerceId: 'c4',
    commerceName: 'Citrus & Dulces del Uruguay',
    cityId: 'concordia',
    cityName: 'Concordia',
    imageUrl: 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=800',
    category: 'Productores',
    isFeatured: true,
    description: 'Contiene 1 frasco de dulce de arándanos (450g), 1 frasco de cascos de quinoto y 1 frasco de miel natural pura de azahar de azahares del citrus.',
    phoneWhatsApp: '5493454112233',
    whatsappMessageCustom: 'Hola Citrus & Dulces, me gustaría encargar el Pack Regalo Dulces Orgánicos publicado en Entre Ríos ON.',
  },
  {
    id: 'p5',
    title: 'Paseo Guiado en Lancha por las Islas del Paraná (3 hs)',
    slug: 'paseo-guiado-lancha-islas-parana',
    price: 22000,
    currency: 'ARS',
    commerceId: 'c2',
    commerceName: 'Comedor Costanera El Dorado',
    cityId: 'parana',
    cityName: 'Paraná',
    imageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800',
    category: 'Turismo Aventura',
    isFeatured: true,
    description: 'Recorrido náutico por los riachos del Delta superior con avistaje de aves, parada en isla de arena y picada litoraleña incluida.',
    phoneWhatsApp: '5493434229876',
    whatsappMessageCustom: 'Hola, me interesa reservar el Paseo Guiado en Lancha por las Islas del Paraná que vi en Entre Ríos ON.',
  },
  {
    id: 'p6',
    title: 'Cuchillo Criollo de Acero de Disco con Cabo de Guampa',
    slug: 'cuchillo-criollo-disco-guampa',
    price: 39000,
    currency: 'ARS',
    commerceId: 'c1',
    commerceName: 'Alfarería & Cerámica Delta',
    cityId: 'colon',
    cityName: 'Colón',
    imageUrl: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&q=80&w=800',
    category: 'Artesanías',
    isFeatured: false,
    description: 'Forjado a mano por el maestro platero de Colón. Hoja de 18cm en acero de arado tratada térmicamente con vaina de cuero vacuno curtido.',
    phoneWhatsApp: '5493447451234',
    whatsappMessageCustom: 'Hola Alfarería Delta, consulto por el Cuchillo Criollo de Acero forjado publicado en el portal Entre Ríos ON.',
  }
];

// Mock Community News & Regional Agenda Events
const COMMUNITY_EVENTS_MOCK: CommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'El auge del Enoturismo: Bodegas Boutique que están transformando el paisaje de Gualeguaychú',
    category: 'Turismo',
    date: '2026-09-12',
    formattedDate: '12 de Septiembre, 2026',
    location: 'Gualeguaychú, Entre Ríos',
    cityId: 'gualeguaychu',
    cityName: 'Gualeguaychú',
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=900',
    readTimeMinutes: 5,
    excerpt: 'Una travesía por los viñedos redescubiertos de la provincia. Tannat, Merlot y Chardonnay con acento litoraleño ganan premios nacionales.',
    isFeatured: true,
    author: {
      name: 'Valeria Benítez',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    }
  },
  {
    id: 'evt-2',
    title: 'Paraná Gastronómica: La ruta del Pescado de Río y los nuevos chefs que reinterpretan la cocina tradicional',
    category: 'Gastronomía',
    date: '2026-09-18',
    formattedDate: '18 de Septiembre, 2026',
    location: 'Puerto Viejo, Paraná',
    cityId: 'parana',
    cityName: 'Paraná',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=900',
    readTimeMinutes: 4,
    excerpt: 'Desde la clásica pacú a las brasas hasta ceviches de boga con cítricos regionales: la renovación gastronómica en la capital provincial.',
    isFeatured: true,
    author: {
      name: 'Ignacio Roldán',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    }
  },
  {
    id: 'evt-3',
    title: 'Colón prepara la Edición 39ª de la Fiesta de la Artesanía con más de 300 maestros de todo el país',
    category: 'Festival',
    date: '2026-09-25',
    formattedDate: '25 de Septiembre, 2026',
    location: 'Parque Quirós, Colón',
    cityId: 'colon',
    cityName: 'Colón',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=900',
    readTimeMinutes: 6,
    excerpt: 'El evento artesanal más prestigioso de Sudamérica confirma su grilla de artistas nacionales e incentivos para talleres jóvenes.',
    isFeatured: true,
    author: {
      name: 'Sofía Casals',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    }
  },
  {
    id: 'evt-4',
    title: 'Circuito Termal de Primavera: Descuentos y actividades holísticas en Federación y Concordia',
    category: 'Turismo',
    date: '2026-10-02',
    formattedDate: '02 de Octubre, 2026',
    location: 'Federación & Concordia',
    cityId: 'federacion',
    cityName: 'Federación',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=900',
    readTimeMinutes: 3,
    excerpt: 'Las piletas con aguas curativas abren programas nocturnos con música instrumental, masajes al aire libre y spas relajantes.',
    isFeatured: false,
    author: {
      name: 'Lucía Maidana',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    }
  }
];

// Helper delay to mimic async DAL call in production
const simulateNetworkDelay = async (ms: number = 30): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function getCities(): Promise<City[]> {
  await simulateNetworkDelay();
  return CITIES_MOCK;
}

export async function getHeroSlides(): Promise<BannerSlide[]> {
  await simulateNetworkDelay();
  return HERO_SLIDES_MOCK;
}

export async function getFeaturedProducts(cityId?: string): Promise<Product[]> {
  await simulateNetworkDelay();
  if (!cityId || cityId === 'all') {
    return PRODUCTS_MOCK;
  }
  return PRODUCTS_MOCK.filter((product) => product.cityId.toLowerCase() === cityId.toLowerCase());
}

export async function getUpcomingEvents(cityId?: string): Promise<CommunityEvent[]> {
  await simulateNetworkDelay();
  if (!cityId || cityId === 'all') {
    return COMMUNITY_EVENTS_MOCK;
  }
  return COMMUNITY_EVENTS_MOCK.filter((event) => event.cityId.toLowerCase() === cityId.toLowerCase());
}

export async function getBentoHighlights(): Promise<{
  featuredCommerce: Commerce;
  weekendEvent: CommunityEvent;
}> {
  await simulateNetworkDelay();
  return {
    featuredCommerce: COMMERCES_MOCK['c1'],
    weekendEvent: COMMUNITY_EVENTS_MOCK[0],
  };
}
