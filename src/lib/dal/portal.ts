import { City, Commerce, Product, CommunityEvent, BannerSlide } from '@/types';

// Mock Cities Data - Entre Ríos Principal Nodes
const CITIES_MOCK: City[] = [
  {
    id: 'parana',
    name: 'Paraná',
    slug: 'parana',
    department: 'Paraná',
    description: 'Capital provincial a orillas del majestuoso Río Paraná, destacada por sus barrancas, gastronomía fluvial y centro comercial.',
    imageUrl: '/images/city-parana.jpg',
    isFeatured: true,
    commerceCount: 342,
  },
  {
    id: 'concordia',
    name: 'Concordia',
    slug: 'concordia',
    department: 'Concordia',
    description: 'Corazón citrícola y termal sobre el Uruguay, epicentro de la producción de arándanos, citrus y turismo de pesca.',
    imageUrl: '/images/city-concordia.jpg',
    isFeatured: true,
    commerceCount: 215,
  },
  {
    id: 'colon',
    name: 'Colón',
    slug: 'colon',
    department: 'Colón',
    description: 'Capital Nacional de la Artesanía, playas de arenas blancas, complejas termas y portal de entrada al Parque Nacional El Palmar.',
    imageUrl: '/images/city-colon.jpg',
    isFeatured: true,
    commerceCount: 189,
  },
  {
    id: 'gualeguaychu',
    name: 'Gualeguaychú',
    slug: 'gualeguaychu',
    department: 'Gualeguaychú',
    description: 'Capital del Carnaval del País, con intensos viñedos locales, balnearios sobre el río Gualeguaychú y rica industria textil y gráfica.',
    imageUrl: '/images/city-gualeguaychu.jpg',
    isFeatured: true,
    commerceCount: 278,
  },
  {
    id: 'concepcion-del-uruguay',
    name: 'Concepción del Uruguay',
    slug: 'concepcion-del-uruguay',
    department: 'Uruguay',
    description: 'La Histórica de Entre Ríos, hogar del Palacio San José, polo universitario del litoral y activo puerto comercial.',
    imageUrl: '/images/city-concepcion.jpg',
    isFeatured: true,
    commerceCount: 164,
  },
  {
    id: 'federacion',
    name: 'Federación',
    slug: 'federacion',
    department: 'Federación',
    description: 'Pionera termal a orillas del Embalse Salto Grande, caracterizada por sus parques acuáticos y serenidad turística.',
    imageUrl: '/images/city-federacion.jpg',
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
    imageUrl: '/images/hero-artesania.jpg',
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
    imageUrl: '/images/prod-dorado.jpg',
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
    imageUrl: '/images/commerce-bodega.jpg',
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
    logoUrl: '/images/commerce-alfareria.jpg',
    coverUrl: '/images/commerce-alfareria.jpg',
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
    logoUrl: '/images/commerce-costanera.jpg',
    coverUrl: '/images/commerce-costanera.jpg',
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
    logoUrl: '/images/commerce-bodega.jpg',
    coverUrl: '/images/commerce-bodega.jpg',
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
    logoUrl: '/images/commerce-citrus.jpg',
    coverUrl: '/images/commerce-citrus.jpg',
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
    imageUrl: '/images/prod-mate.jpg',
    category: 'Artesanías',
    categoryId: 'hogar',
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
    imageUrl: '/images/prod-dorado.jpg',
    category: 'Gastronomía',
    categoryId: 'gastronomia',
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
    imageUrl: '/images/prod-vino-tannat.jpg',
    category: 'Gastronomía',
    categoryId: 'gastronomia',
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
    imageUrl: '/images/prod-dulces.jpg',
    category: 'Productos',
    categoryId: 'productos',
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
    imageUrl: '/images/prod-lancha.jpg',
    category: 'Turismo',
    categoryId: 'turismo',
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
    imageUrl: '/images/prod-cuchillo.jpg',
    category: 'Hogar y Deco',
    categoryId: 'hogar',
    isFeatured: false,
    description: 'Forjado a mano por el maestro platero de Colón. Hoja de 18cm en acero de arado tratada térmicamente con vaina de cuero vacuno curtido.',
    phoneWhatsApp: '5493447451234',
    whatsappMessageCustom: 'Hola Alfarería Delta, consulto por el Cuchillo Criollo de Acero forjado publicado en el portal Entre Ríos ON.',
  },
  {
    id: 'p7',
    title: 'Zapatillas Urbanas de Cuero Vacuno Litoral',
    slug: 'zapatillas-urbanas-cuero-litoral',
    price: 59900,
    currency: 'ARS',
    commerceId: 'c1',
    commerceName: 'Indumentaria Litoral',
    cityId: 'parana',
    cityName: 'Paraná',
    imageUrl: '/images/offer-1.jpg',
    category: 'Indumentaria',
    categoryId: 'indumentaria',
    isFeatured: true,
    description: 'Zapatillas confeccionadas a mano con cuero vacuno seleccionado, suela antideslizante y diseño confort para uso urbano.',
    phoneWhatsApp: '5493434229876',
    whatsappMessageCustom: 'Hola, vi en Entre Ríos ON las Zapatillas Urbanas de Cuero y quisiera consultar talle y envío.',
  },
  {
    id: 'p8',
    title: 'Cafetera Espresso Digital Barista 15 Bar',
    slug: 'cafetera-espresso-digital-barista',
    price: 125000,
    currency: 'ARS',
    commerceId: 'c4',
    commerceName: 'Tecno Hogar Concordia',
    cityId: 'concordia',
    cityName: 'Concordia',
    imageUrl: '/images/offer-2.jpg',
    category: 'Tecnología',
    categoryId: 'tecnologia',
    isFeatured: true,
    description: 'Cafetera exprés automática con espumador de leche de acero inoxidable y molinillo cerámico incorporado.',
    phoneWhatsApp: '5493454112233',
    whatsappMessageCustom: 'Hola Tecno Hogar, vi la Cafetera Espresso Digital en Entre Ríos ON y me gustaría encargarla.',
  },
  {
    id: 'p9',
    title: 'Juego de Comedor Nórdico Mesa Madera & 6 Sillas',
    slug: 'juego-comedor-nordico-madera',
    price: 420000,
    currency: 'ARS',
    commerceId: 'c3',
    commerceName: 'Muebles & Deco Gualeguaychú',
    cityId: 'gualeguaychu',
    cityName: 'Gualeguaychú',
    imageUrl: '/images/offer-3.jpg',
    category: 'Hogar y Deco',
    categoryId: 'hogar',
    isFeatured: true,
    description: 'Mesa de petiribí macizo barnizado mate de 1.80m x 0.90m con 6 sillas tapizadas en pana anti-manchas.',
    phoneWhatsApp: '5493446584321',
    whatsappMessageCustom: 'Hola, consulto por el Juego de Comedor Nórdico visto en Entre Ríos ON.',
  },
  {
    id: 'p10',
    title: 'iPhone 15 128 GB Silicon Shield 5G',
    slug: 'iphone-15-128gb-silicon-shield',
    price: 1250000,
    currency: 'ARS',
    commerceId: 'c2',
    commerceName: 'Paraná Mobile Store',
    cityId: 'parana',
    cityName: 'Paraná',
    imageUrl: '/images/offer-4.jpg',
    category: 'Tecnología',
    categoryId: 'tecnologia',
    isFeatured: true,
    description: 'Equipo oficial sellado con garantía oficial de 1 año. Pantalla Super Retina XDR y chip A16 Bionic.',
    phoneWhatsApp: '5493434229876',
    whatsappMessageCustom: 'Hola Paraná Mobile, quiero comprar el iPhone 15 publicado en el portal Entre Ríos ON.',
  },
  {
    id: 'p11',
    title: 'Camioneta Ford Ranger 4x4 Doble Cabina 2.0 TDi',
    slug: 'ford-ranger-4x4-doble-cabina',
    price: 34500000,
    currency: 'ARS',
    commerceId: 'c3',
    commerceName: 'Automotores Gualeguaychú',
    cityId: 'gualeguaychu',
    cityName: 'Gualeguaychú',
    imageUrl: '/images/offer-5.jpg',
    category: 'Autos y Motos',
    categoryId: 'autos',
    isFeatured: true,
    description: 'Unidad 0km lista para patentar. Caja automática de 10 velocidades, tapizado de cuero y paquete de asistencia a la conducción.',
    phoneWhatsApp: '5493446584321',
    whatsappMessageCustom: 'Hola Automotores Gualeguaychú, quisiera más info sobre la Ford Ranger 4x4 en Clasificados ON.',
  },
  {
    id: 'p12',
    title: 'Compresor Industrial Trifásico 100 Litros 3HP',
    slug: 'compresor-industrial-trifasico-100l',
    price: 890000,
    currency: 'ARS',
    commerceId: 'c4',
    commerceName: 'Industrias Concordia',
    cityId: 'concordia',
    cityName: 'Concordia',
    imageUrl: '/images/offer-6.jpg',
    category: 'Industria',
    categoryId: 'industria',
    isFeatured: false,
    description: 'Equipamiento pesados para talleres y fábricas de la región del Uruguay. Cilindro en hierro fundido y válvula de seguridad homologada.',
    phoneWhatsApp: '5493454112233',
    whatsappMessageCustom: 'Hola Industrias Concordia, consulto disponibilidad del Compresor Industrial 100L.',
  },
  {
    id: 'p13',
    title: 'Juego de Grifería Monocomando para Baño Cromo',
    slug: 'griferia-monocomando-bano-cromo',
    price: 78500,
    currency: 'ARS',
    commerceId: 'c1',
    commerceName: 'Corralón & Materiales Colón',
    cityId: 'colon',
    cityName: 'Colón',
    imageUrl: '/images/prod-mate.jpg',
    category: 'Construcción',
    categoryId: 'construccion',
    isFeatured: false,
    description: 'Set completo lavatorio y bidet monocomando con aireador ecológico ahorrador de agua y terminación cromo brillante.',
    phoneWhatsApp: '5493447451234',
    whatsappMessageCustom: 'Hola Corralón Colón, consulto precio por el Juego de Grifería Monocomando.',
  },
  {
    id: 'p14',
    title: 'Pase Día Termal & Masaje Holístico Federación',
    slug: 'pase-dia-termal-masaje-federacion',
    price: 18500,
    currency: 'ARS',
    commerceId: 'c4',
    commerceName: 'Spa & Termas Federación',
    cityId: 'federacion',
    cityName: 'Federación',
    imageUrl: '/images/city-federacion.jpg',
    category: 'Salud y Bienestar',
    categoryId: 'salud',
    isFeatured: true,
    description: 'Acceso ilimitado al complejo de piletas termales relajantes + sesión de masajes descontracturantes de 45 minutos.',
    phoneWhatsApp: '5493454112233',
    whatsappMessageCustom: 'Hola Spa Termas Federación, me gustaría reservar un Pase Día Termal.',
  },
  {
    id: 'p15',
    title: 'Servicio de Asesoría B2B & Marketing Digital para Pymes',
    slug: 'asesoria-b2b-marketing-digital-pymes',
    price: 45000,
    currency: 'ARS',
    commerceId: 'c2',
    commerceName: 'Agencia Digital Paraná',
    cityId: 'parana',
    cityName: 'Paraná',
    imageUrl: '/images/city-parana.jpg',
    category: 'Comercios y Servicios',
    categoryId: 'comercios',
    isFeatured: true,
    description: 'Plan mensual para negocios que buscan digitalizar sus ventas, campañas publicitarias y posicionamiento en Entre Ríos ON.',
    phoneWhatsApp: '5493434229876',
    whatsappMessageCustom: 'Hola Agencia Digital Paraná, vi en Entre Ríos ON el servicio de Asesoría B2B.',
  },
  {
    id: 'p16',
    title: 'Bicicleta Eléctrica Urbana E-Bike Litoral 350W',
    slug: 'bicicleta-electrica-urbana-ebike-litoral',
    price: 890000,
    currency: 'ARS',
    commerceId: 'c1',
    commerceName: 'Movilidad Verde Colón',
    cityId: 'colon',
    cityName: 'Colón',
    imageUrl: '/images/prod-lancha.jpg',
    category: 'Más categorías',
    categoryId: 'mas',
    isFeatured: true,
    description: 'Bicicleta asistida con batería de litio removible, autonomía de 45 km y frenos a disco hidráulicos en ambas ruedas.',
    phoneWhatsApp: '5493447451234',
    whatsappMessageCustom: 'Hola Movilidad Verde, consulto por la Bicicleta Eléctrica Urbana publicada en Entre Ríos ON.',
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
    imageUrl: '/images/commerce-bodega.jpg',
    readTimeMinutes: 5,
    excerpt: 'Una travesía por los viñedos redescubiertos de la provincia. Tannat, Merlot y Chardonnay con acento litoraleño ganan premios nacionales.',
    isFeatured: true,
    author: {
      name: 'Valeria Benítez',
      avatarUrl: '/images/avatar-author.jpg',
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
    imageUrl: '/images/prod-dorado.jpg',
    readTimeMinutes: 4,
    excerpt: 'Desde la clásica pacú a las brasas hasta ceviches de boga con cítricos regionales: la renovación gastronómica en la capital provincial.',
    isFeatured: true,
    author: {
      name: 'Ignacio Roldán',
      avatarUrl: '/images/avatar-author.jpg',
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
    imageUrl: '/images/hero-artesania.jpg',
    readTimeMinutes: 6,
    excerpt: 'El evento artesanal más prestigioso de Sudamérica confirma su grilla de artistas nacionales e incentivos para talleres jóvenes.',
    isFeatured: true,
    author: {
      name: 'Sofía Casals',
      avatarUrl: '/images/avatar-author.jpg',
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
    imageUrl: '/images/city-federacion.jpg',
    readTimeMinutes: 3,
    excerpt: 'Las piletas con aguas curativas abren programas nocturnos con música instrumental, masajes al aire libre y spas relajantes.',
    isFeatured: false,
    author: {
      name: 'Lucía Maidana',
      avatarUrl: '/images/avatar-author.jpg',
    }
  }
];

const simulateNetworkDelay = async (ms: number = 30): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export async function getCities(): Promise<City[]> {
  await simulateNetworkDelay();
  return CITIES_MOCK;
}

export async function getCityBySlug(slug: string): Promise<City | undefined> {
  await simulateNetworkDelay();
  return CITIES_MOCK.find((c) => c.slug === slug || c.id === slug);
}

export async function getHeroSlides(): Promise<BannerSlide[]> {
  await simulateNetworkDelay();
  return HERO_SLIDES_MOCK;
}

export async function getFeaturedProducts(cityId?: string, categoryId?: string): Promise<Product[]> {
  await simulateNetworkDelay();
  let list = PRODUCTS_MOCK;
  if (cityId && cityId !== 'all') {
    list = list.filter((product) => product.cityId.toLowerCase() === cityId.toLowerCase());
  }
  if (categoryId && categoryId !== 'all') {
    list = list.filter(
      (product) => 
        (product.categoryId && product.categoryId.toLowerCase() === categoryId.toLowerCase()) ||
        product.category.toLowerCase().includes(categoryId.toLowerCase())
    );
  }
  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  await simulateNetworkDelay();
  return PRODUCTS_MOCK.find((p) => p.slug === slug || p.id === slug);
}

export async function getAllCommerces(): Promise<Commerce[]> {
  await simulateNetworkDelay();
  return Object.values(COMMERCES_MOCK);
}

export async function getCommerceBySlug(slug: string): Promise<Commerce | undefined> {
  await simulateNetworkDelay();
  return Object.values(COMMERCES_MOCK).find((c) => c.slug === slug || c.id === slug);
}

export async function getProductsByCommerce(commerceId: string): Promise<Product[]> {
  await simulateNetworkDelay();
  return PRODUCTS_MOCK.filter((p) => p.commerceId === commerceId);
}

export async function getUpcomingEvents(cityId?: string): Promise<CommunityEvent[]> {
  await simulateNetworkDelay();
  if (!cityId || cityId === 'all') {
    return COMMUNITY_EVENTS_MOCK;
  }
  return COMMUNITY_EVENTS_MOCK.filter((event) => event.cityId.toLowerCase() === cityId.toLowerCase());
}

export async function getEventById(id: string): Promise<CommunityEvent | undefined> {
  await simulateNetworkDelay();
  return COMMUNITY_EVENTS_MOCK.find((e) => e.id === id);
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
