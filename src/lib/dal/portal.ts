import { City, Commerce, Product, CommunityEvent, BannerSlide } from '@/types';
import { ALL_CITIES } from '@/lib/constants/locations';

// Mock Cities Data
const CITIES_MOCK: City[] = ALL_CITIES;

// Hero Editorial Slides — Entre Ríos
const HERO_SLIDES_MOCK: BannerSlide[] = [
  {
    id: 'slide-er-1',
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
    id: 'slide-er-2',
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
    id: 'slide-er-3',
    title: 'Ruta del Vino y Viñedos de Gualeguaychú',
    subtitle: 'Recorridos guiados por las bodegas boutique entrerrianas con catas al atardecer frente al río.',
    badgeText: 'Enoturismo • Gualeguaychú',
    badgeType: 'commerce',
    imageUrl: '/images/commerce-bodega.jpg',
    ctaText: 'Reservar Degustación',
    ctaUrl: '#catalogo',
    cityTag: 'Gualeguaychú',
    publishedAt: '2026-09-07',
  },
];

// Hero Editorial Slides — Santa Fe
const HERO_SLIDES_SANTA_FE_MOCK: BannerSlide[] = [
  {
    id: 'slide-sf-1',
    title: 'Rosario: la Ciudad del Río más Vibrante del Litoral',
    subtitle: 'Gastronomía de vanguardia, arte urbano, ferias de diseño y la costanera más activa del país te esperan en Rosario.',
    badgeText: 'Destino ON MÁS • Rosario',
    badgeType: 'tourism',
    imageUrl: '/images/hero-rosario.jpg',
    ctaText: 'Explorar Rosario',
    ctaUrl: '#catalogo',
    cityTag: 'Rosario',
    publishedAt: '2026-09-05',
  },
  {
    id: 'slide-sf-2',
    title: 'Cuenca Láctea de Rafaela: Quesos y Sabores del Oeste Santafesino',
    subtitle: 'Descubrí los productores artesanales de quesos, dulce de leche de campo y chacinados únicos de la región láctea más importante de Argentina.',
    badgeText: 'Gastronomía Artesanal • Rafaela',
    badgeType: 'commerce',
    imageUrl: '/images/prod-dulces.jpg',
    ctaText: 'Ver Productores',
    ctaUrl: '#catalogo',
    cityTag: 'Rafaela',
    publishedAt: '2026-09-06',
  },
  {
    id: 'slide-sf-3',
    title: 'Santa Fe Capital: Historia, Río y Gastronomía Litoraleña',
    subtitle: 'La capital provincial combina arquitectura colonial, Laguna Setúbal y una escena gastronómica rica en tradición litoraleña y cocina de fusión.',
    badgeText: 'Capital Provincial • Santa Fe',
    badgeType: 'event',
    imageUrl: '/images/city-santa-fe-capital.jpg',
    ctaText: 'Descubrir Santa Fe',
    ctaUrl: '#catalogo',
    cityTag: 'Santa Fe Capital',
    publishedAt: '2026-09-07',
  },
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
    provinceId: 'entre-rios',
    provinceName: 'Entre Ríos',
    description: 'Elaboración artesanal de mermeladas de arándanos, licores de naranja y cascos de mamón en almíbar.',
    rating: 4.7,
    reviewCount: 96,
    isVerified: true,
    isSubscriptionActive: true,
    logoUrl: '/images/commerce-citrus.jpg',
    coverUrl: '/images/commerce-citrus.jpg',
    phoneWhatsApp: '5493454112233',
    address: 'Entre Ríos 890, Concordia',
  },
  'c5': {
    id: 'c5',
    name: 'Cervecería & Bar Pichincha',
    slug: 'cerveceria-bar-pichincha',
    category: 'Gastronomía de Río',
    cityId: 'rosario',
    cityName: 'Rosario',
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
    description: 'Cervezas artesanales premiadas, picadas de fiambres regionales y hamburguesas gourmet en el histórico barrio Pichincha.',
    rating: 4.9,
    reviewCount: 210,
    isVerified: true,
    isSubscriptionActive: true,
    logoUrl: '/images/commerce-costanera.jpg',
    coverUrl: '/images/commerce-costanera.jpg',
    phoneWhatsApp: '5493414567890',
    address: 'Jujuy 2800, Rosario',
    instagram: '@pichincha.cerveza.rosario',
  },
  'c6': {
    id: 'c6',
    name: 'Muebles & Diseño Bulevar Santa Fe',
    slug: 'muebles-diseno-bulevar-santa-fe',
    category: 'Hogar y Deco',
    cityId: 'santa-fe-capital',
    cityName: 'Santa Fe Capital',
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
    description: 'Fabricación y venta de equipamiento nórdico, sillones a medida y carpintería en maderas macizas de primera calidad.',
    rating: 4.8,
    reviewCount: 115,
    isVerified: true,
    isSubscriptionActive: true,
    logoUrl: '/images/offer-3.jpg',
    coverUrl: '/images/offer-3.jpg',
    phoneWhatsApp: '5493424112244',
    address: 'Bulevar Gálvez 1450, Santa Fe Capital',
  },
  'c7': {
    id: 'c7',
    name: 'Lácteos & Sabores de Rafaela',
    slug: 'lacteos-sabores-rafaela',
    category: 'Productores Regionales',
    cityId: 'rafaela',
    cityName: 'Rafaela',
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
    description: 'Especialistas en quesos artesanales, dulce de leche de campo y fiambres seleccionados del corazón lácteo santafesino.',
    rating: 5.0,
    reviewCount: 88,
    isVerified: true,
    isSubscriptionActive: true,
    logoUrl: '/images/prod-dulces.jpg',
    coverUrl: '/images/prod-dulces.jpg',
    phoneWhatsApp: '5493492456789',
    address: 'Av. Brasil 600, Rafaela',
  }
};

// Mock Featured Products & Services
const PRODUCTS_MOCK: Product[] = [
  {
    id: 'p5',
    title: 'Pack 6X Cerveza Artesanal IPA & Golden Pichincha Rosario',
    slug: 'pack-cerveza-artesanal-pichincha-rosario',
    price: 16500,
    currency: 'ARS',
    commerceId: 'c5',
    commerceName: 'Cervecería & Bar Pichincha',
    cityId: 'rosario',
    cityName: 'Rosario',
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
    imageUrl: '/images/offer-2.jpg',
    category: 'Gastronomía',
    categoryId: 'gastronomia',
    isFeatured: true,
    description: 'Combo de 6 latas de 473ml con lúpulos patagónicos y perfil cítrico fresco. Producción local santafesina.',
    phoneWhatsApp: '5493414567890',
    whatsappMessageCustom: 'Hola Cervecería Pichincha, vi en el Portal ON MÁS el Pack de Cerveza Artesanal y quisiera hacer un pedido.',
  },
  {
    id: 'p6',
    title: 'Sillón Sofá Nórdico 3 Cuerpos Lino Premium Gray',
    slug: 'sillon-sofa-nordico-3-cuerpos-santa-fe',
    price: 495000,
    currency: 'ARS',
    commerceId: 'c6',
    commerceName: 'Muebles & Diseño Bulevar Santa Fe',
    cityId: 'santa-fe-capital',
    cityName: 'Santa Fe Capital',
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
    imageUrl: '/images/offer-3.jpg',
    category: 'Hogar',
    categoryId: 'hogar',
    isFeatured: true,
    description: 'Estructura en madera saligna maciza, placas de alta densidad de 28kg y tapizado en lino antidesgarro con proceso antimanchas.',
    phoneWhatsApp: '5493424112244',
    whatsappMessageCustom: 'Hola Muebles Bulevar, vi en el Portal ON MÁS el Sillón Nórdico de 3 Cuerpos y quisiera consultar opciones de envío.',
  },
  {
    id: 'p7',
    title: 'Tabla Gourmet de Quesos Sardo & Gouda Estacionado Rafaela',
    slug: 'tabla-quesos-sardo-gouda-rafaela',
    price: 24500,
    currency: 'ARS',
    commerceId: 'c7',
    commerceName: 'Lácteos & Sabores de Rafaela',
    cityId: 'rafaela',
    cityName: 'Rafaela',
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
    imageUrl: '/images/prod-dulces.jpg',
    category: 'Gastronomía',
    categoryId: 'gastronomia',
    isFeatured: true,
    description: 'Selección de quesos duros y semiduros estacionados en la cuenca láctea de Rafaela. Presentación en horma o fraccionado al vacío.',
    phoneWhatsApp: '5493492456789',
    whatsappMessageCustom: 'Hola Lácteos Rafaela, vi en el Portal ON MÁS la Tabla Gourmet de Quesos y quisiera realizar una consulta.',
  },
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
    provinceId: 'entre-rios',
    provinceName: 'Entre Ríos',
    imageUrl: '/images/prod-mate.jpg',
    category: 'Artesanías',
    categoryId: 'hogar',
    isFeatured: true,
    description: 'Mate de cerámica artesanal horneada a 1200°C con virola grabada en alpaca con motivos de flora autóctona. Incluye bombilla de plata alemana.',
    phoneWhatsApp: '5493447451234',
    whatsappMessageCustom: 'Hola Alfarería Delta, vi en el Portal ON MÁS el Juego de Mates de Cerámica Cincelada y quisiera consultar disponibilidad y envíos.',
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

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && url.startsWith('http') && !url.includes('your-supabase-project'));
}

export async function getCities(): Promise<City[]> {
  if (isSupabaseConfigured()) {
    try {
      const { createPublicClient } = await import('@/lib/supabase/public');
      const supabase = createPublicClient();
      const { data, error } = await supabase.from('cities').select('*');
      if (!error && data && data.length > 0) {
        return data.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          department: c.department,
          description: c.description,
          imageUrl: c.image_url,
          isFeatured: c.is_featured,
          commerceCount: c.commerce_count,
        }));
      }
    } catch (e) {
      console.warn('Fallback to mock cities data due to Supabase error:', e);
    }
  }
  await simulateNetworkDelay();
  return CITIES_MOCK;
}

export async function getCityBySlug(slug: string): Promise<City | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const { createPublicClient } = await import('@/lib/supabase/public');
      const supabase = createPublicClient();
      const { data, error } = await supabase.from('cities').select('*').or(`slug.eq.${slug},id.eq.${slug}`).single();
      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          slug: data.slug,
          department: data.department,
          description: data.description,
          imageUrl: data.image_url,
          isFeatured: data.is_featured,
          commerceCount: data.commerce_count,
        };
      }
    } catch (e) {
      console.warn('Fallback to mock city detail:', e);
    }
  }
  await simulateNetworkDelay();
  return CITIES_MOCK.find((c) => c.slug === slug || c.id === slug);
}

export async function getHeroSlides(provinceId?: string): Promise<BannerSlide[]> {
  if (isSupabaseConfigured()) {
    try {
      const { createPublicClient } = await import('@/lib/supabase/public');
      const supabase = createPublicClient();
      let query = supabase.from('banner_slides').select('*').order('created_at', { ascending: false });
      if (provinceId && provinceId !== 'all') {
        query = query.eq('province_id', provinceId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((slide) => ({
          id: slide.id,
          title: slide.title,
          subtitle: slide.subtitle,
          badgeText: slide.badge_text,
          badgeType: slide.badge_type,
          imageUrl: slide.image_url,
          ctaText: slide.cta_text,
          ctaUrl: slide.cta_url,
          cityTag: slide.city_tag,
          publishedAt: slide.published_at,
        }));
      }
    } catch (e) {
      console.warn('Fallback to mock hero slides:', e);
    }
  }
  await simulateNetworkDelay();
  // Return province-specific slides in mock mode
  if (provinceId === 'santa-fe') return HERO_SLIDES_SANTA_FE_MOCK;
  if (provinceId === 'entre-rios') return HERO_SLIDES_MOCK;
  return [...HERO_SLIDES_SANTA_FE_MOCK, ...HERO_SLIDES_MOCK];
}

export async function getFeaturedProducts(cityId?: string, categoryId?: string): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const { createPublicClient } = await import('@/lib/supabase/public');
      const supabase = createPublicClient();
      let query = supabase.from('products').select('*');
      if (cityId && cityId !== 'all') {
        query = query.eq('city_id', cityId);
      }
      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          price: p.price ? Number(p.price) : undefined,
          currency: p.currency || 'ARS',
          commerceId: p.commerce_id,
          commerceName: p.commerce_name,
          cityId: p.city_id,
          cityName: p.city_name,
          imageUrl: p.image_url,
          category: p.category,
          categoryId: p.category_id,
          isFeatured: p.is_featured,
          description: p.description,
          phoneWhatsApp: p.phone_whatsapp,
          whatsappMessageCustom: p.whatsapp_message_custom,
        }));
      }
    } catch (e) {
      console.warn('Fallback to mock products:', e);
    }
  }

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
  if (isSupabaseConfigured()) {
    try {
      const { createPublicClient } = await import('@/lib/supabase/public');
      const supabase = createPublicClient();
      const { data, error } = await supabase.from('products').select('*').or(`slug.eq.${slug},id.eq.${slug}`).single();
      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          slug: data.slug,
          price: data.price ? Number(data.price) : undefined,
          currency: data.currency || 'ARS',
          commerceId: data.commerce_id,
          commerceName: data.commerce_name,
          cityId: data.city_id,
          cityName: data.city_name,
          imageUrl: data.image_url,
          category: data.category,
          categoryId: data.category_id,
          isFeatured: data.is_featured,
          description: data.description,
          phoneWhatsApp: data.phone_whatsapp,
          whatsappMessageCustom: data.whatsapp_message_custom,
        };
      }
    } catch (e) {
      console.warn('Fallback to mock product detail:', e);
    }
  }

  await simulateNetworkDelay();
  return PRODUCTS_MOCK.find((p) => p.slug === slug || p.id === slug);
}

export async function getAllCommerces(): Promise<Commerce[]> {
  if (isSupabaseConfigured()) {
    try {
      const { createPublicClient } = await import('@/lib/supabase/public');
      const supabase = createPublicClient();
      const { data, error } = await supabase.from('commerces').select('*');
      if (!error && data && data.length > 0) {
        return data.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          category: c.category,
          cityId: c.city_id,
          cityName: c.city_name,
          description: c.description,
          rating: Number(c.rating),
          reviewCount: c.review_count,
          isVerified: c.is_verified,
          isSubscriptionActive: c.is_subscription_active,
          logoUrl: c.logo_url,
          coverUrl: c.cover_url,
          phoneWhatsApp: c.phone_whatsapp,
          address: c.address,
          instagram: c.instagram,
          website: c.website,
        }));
      }
    } catch (e) {
      console.warn('Fallback to mock commerces:', e);
    }
  }

  await simulateNetworkDelay();
  return Object.values(COMMERCES_MOCK);
}

export async function getCommerceBySlug(slug: string): Promise<Commerce | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const { createPublicClient } = await import('@/lib/supabase/public');
      const supabase = createPublicClient();

      // 1. Try querying by slug directly
      let { data, error } = await supabase
        .from('commerces')
        .select('*')
        .eq('slug', slug)
        .limit(1);

      // 2. If not found by slug, try querying by id or owner_id if slug matches UUID / comm- format
      if ((!data || data.length === 0) && slug) {
        const cleanId = slug.replace('comm-', '');
        const { data: idData } = await supabase
          .from('commerces')
          .select('*')
          .or(`id.eq.${slug},owner_id.eq.${cleanId}`)
          .limit(1);

        if (idData && idData.length > 0) {
          data = idData;
        }
      }

      if (data && data.length > 0) {
        const item = data[0];
        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          category: item.category || 'Comercio General',
          cityId: item.city_id || 'rosario',
          cityName: item.city_name || 'Rosario',
          provinceId: item.province_id || 'santa-fe',
          provinceName: item.province_name || 'Santa Fe',
          description: item.description || 'Comercio adherido al portal ON MÁS.',
          rating: Number(item.rating || 5.0),
          reviewCount: item.review_count || 1,
          isVerified: item.is_verified ?? true,
          isSubscriptionActive: item.is_subscription_active ?? true,
          logoUrl: item.logo_url || '/images/city-rosario.jpg',
          coverUrl: item.cover_url || '/images/city-rosario.jpg',
          phoneWhatsApp: item.phone_whatsapp || '',
          address: item.address || '',
          instagram: item.instagram || '',
          website: item.website || '',
          email: item.email || '',
        };
      }
    } catch (e) {
      console.warn('Fallback to mock commerce detail:', e);
    }
  }

  await simulateNetworkDelay();
  const found = Object.values(COMMERCES_MOCK).find((c) => c.slug === slug || c.id === slug);
  if (found) return found;

  // Partial slug match fallback in COMMERCES_MOCK
  const partial = Object.values(COMMERCES_MOCK).find((c) => slug.includes(c.slug) || c.slug.includes(slug));
  if (partial) return partial;

  // Dynamic fallback object to avoid 404 for admin merchants
  const cleanName = slug
    .replace(/^comm-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    id: `comm-${slug}`,
    name: cleanName || 'Comercio Adherido',
    slug: slug,
    category: 'Comercio General',
    cityId: 'rosario',
    cityName: 'Rosario',
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
    description: 'Perfil comercial activo en la plataforma ON MÁS.',
    rating: 5.0,
    reviewCount: 1,
    isVerified: true,
    isSubscriptionActive: true,
    logoUrl: '/images/city-rosario.jpg',
    coverUrl: '/images/city-rosario.jpg',
    phoneWhatsApp: '',
    address: '',
  };
}

export async function getProductsByCommerce(commerceId: string): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const { createPublicClient } = await import('@/lib/supabase/public');
      const supabase = createPublicClient();
      const { data, error } = await supabase.from('products').select('*').eq('commerce_id', commerceId);
      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          price: p.price ? Number(p.price) : undefined,
          currency: p.currency || 'ARS',
          commerceId: p.commerce_id,
          commerceName: p.commerce_name,
          cityId: p.city_id,
          cityName: p.city_name,
          imageUrl: p.image_url,
          category: p.category,
          categoryId: p.category_id,
          isFeatured: p.is_featured,
          description: p.description,
          phoneWhatsApp: p.phone_whatsapp,
          whatsappMessageCustom: p.whatsapp_message_custom,
        }));
      }
    } catch (e) {
      console.warn('Fallback to mock products by commerce:', e);
    }
  }

  await simulateNetworkDelay();
  return PRODUCTS_MOCK.filter((p) => p.commerceId === commerceId);
}

export async function getUpcomingEvents(cityId?: string): Promise<CommunityEvent[]> {
  if (isSupabaseConfigured()) {
    try {
      const { createPublicClient } = await import('@/lib/supabase/public');
      const supabase = createPublicClient();
      let query = supabase.from('community_events').select('*').order('date', { ascending: true });
      if (cityId && cityId !== 'all') {
        query = query.eq('city_id', cityId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((e) => ({
          id: e.id,
          title: e.title,
          category: e.category,
          date: e.date,
          formattedDate: e.formatted_date,
          location: e.location,
          cityId: e.city_id,
          cityName: e.city_name,
          imageUrl: e.image_url,
          readTimeMinutes: e.read_time_minutes,
          excerpt: e.excerpt,
          fullStory: e.full_story,
          isFeatured: e.is_featured,
          author: {
            name: e.author_name,
            avatarUrl: e.author_avatar_url,
          },
        }));
      }
    } catch (e) {
      console.warn('Fallback to mock events:', e);
    }
  }

  await simulateNetworkDelay();
  if (!cityId || cityId === 'all') {
    return COMMUNITY_EVENTS_MOCK;
  }
  return COMMUNITY_EVENTS_MOCK.filter((event) => event.cityId.toLowerCase() === cityId.toLowerCase());
}

export async function getEventById(id: string): Promise<CommunityEvent | undefined> {
  if (isSupabaseConfigured()) {
    try {
      const { createPublicClient } = await import('@/lib/supabase/public');
      const supabase = createPublicClient();
      const { data, error } = await supabase.from('community_events').select('*').eq('id', id).single();
      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          category: data.category,
          date: data.date,
          formattedDate: data.formatted_date,
          location: data.location,
          cityId: data.city_id,
          cityName: data.city_name,
          imageUrl: data.image_url,
          readTimeMinutes: data.read_time_minutes,
          excerpt: data.excerpt,
          fullStory: data.full_story,
          isFeatured: data.is_featured,
          author: {
            name: data.author_name,
            avatarUrl: data.author_avatar_url,
          },
        };
      }
    } catch (e) {
      console.warn('Fallback to mock event detail:', e);
    }
  }

  await simulateNetworkDelay();
  return COMMUNITY_EVENTS_MOCK.find((e) => e.id === id);
}

export async function getBentoHighlights(): Promise<{
  featuredCommerce: Commerce;
  weekendEvent: CommunityEvent;
}> {
  const commerces = await getAllCommerces();
  const events = await getUpcomingEvents();

  return {
    featuredCommerce: commerces[0] || COMMERCES_MOCK['c1'],
    weekendEvent: events[0] || COMMUNITY_EVENTS_MOCK[0],
  };
}

