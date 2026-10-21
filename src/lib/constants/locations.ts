import { Province, City } from '@/types';

export const PROVINCES: Province[] = [
  { id: 'santa-fe', name: 'Santa Fe', slug: 'santa-fe' },
  { id: 'entre-rios', name: 'Entre Ríos', slug: 'entre-rios' },
  { id: 'caba', name: 'CABA', slug: 'caba' },
  { id: 'cordoba', name: 'Córdoba', slug: 'cordoba' },
  { id: 'buenos-aires', name: 'Buenos Aires', slug: 'buenos-aires' },
  { id: 'all', name: 'Todas las provincias', slug: 'todas' },
];

export const CITIES_SANTA_FE: City[] = [
  {
    id: 'santa-fe-capital',
    name: 'Santa Fe Capital',
    slug: 'santa-fe-capital',
    department: 'La Capital',
    description: 'Capital provincial, centro administrativo, universitario y cultural.',
    imageUrl: '/images/city-santa-fe-capital.jpg',
    isFeatured: true,
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
  },
  {
    id: 'rosario',
    name: 'Rosario',
    slug: 'rosario',
    department: 'Rosario',
    description: 'Polo comercial, industrial y gastronómico a orillas del río Paraná.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
  },
  {
    id: 'rafaela',
    name: 'Rafaela',
    slug: 'rafaela',
    department: 'Castellanos',
    description: 'Corazón productivo e industrial del oeste santafesino.',
    imageUrl: '/images/city-rafaela.jpg',
    isFeatured: true,
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
  },
  {
    id: 'reconquista',
    name: 'Reconquista',
    slug: 'reconquista',
    department: 'General Obligado',
    description: 'Polo comercial y agroganadero del norte santafesino.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    isFeatured: false,
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
  },
  {
    id: 'santo-tome',
    name: 'Santo Tomé',
    slug: 'santo-tome',
    department: 'La Capital',
    description: 'Ciudad vecina conectada al área metropolitana santafesina.',
    imageUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?auto=format&fit=crop&w=400&q=80',
    isFeatured: false,
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
  },
  {
    id: 'esperanza',
    name: 'Esperanza',
    slug: 'esperanza',
    department: 'Las Colonias',
    description: 'Primera colonia agrícola organizada de la República Argentina.',
    imageUrl: 'https://images.unsplash.com/photo-1548625361-19597a76c8c4?auto=format&fit=crop&w=400&q=80',
    isFeatured: false,
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
  },
  {
    id: 'venado-tuerto',
    name: 'Venado Tuerto',
    slug: 'venado-tuerto',
    department: 'General López',
    description: 'Centro agroindustrial y comercial del sur de Santa Fe.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    isFeatured: false,
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
  },
  {
    id: 'sauce-viejo',
    name: 'Sauce Viejo',
    slug: 'sauce-viejo',
    department: 'La Capital',
    description: 'Turismo ribereño, pesca y parque industrial.',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
    isFeatured: false,
    provinceId: 'santa-fe',
    provinceName: 'Santa Fe',
  },
];

export const CITIES_ENTRE_RIOS: City[] = [
  {
    id: 'parana',
    name: 'Paraná',
    slug: 'parana',
    department: 'Paraná',
    description: 'Capital provincial de Entre Ríos con barrancas al río Paraná.',
    imageUrl: '/images/city-parana.jpg',
    isFeatured: true,
    provinceId: 'entre-rios',
    provinceName: 'Entre Ríos',
  },
  {
    id: 'concordia',
    name: 'Concordia',
    slug: 'concordia',
    department: 'Concordia',
    description: 'Capital nacional del citrus y termas a orillas del río Uruguay.',
    imageUrl: '/images/city-concordia.jpg',
    isFeatured: true,
    provinceId: 'entre-rios',
    provinceName: 'Entre Ríos',
  },
  {
    id: 'colon',
    name: 'Colón',
    slug: 'colon',
    department: 'Colón',
    description: 'Destino turístico con playas de arena blanca y termas.',
    imageUrl: '/images/city-colon.jpg',
    isFeatured: true,
    provinceId: 'entre-rios',
    provinceName: 'Entre Ríos',
  },
  {
    id: 'gualeguaychu',
    name: 'Gualeguaychú',
    slug: 'gualeguaychu',
    department: 'Gualeguaychú',
    description: 'Bodegas boutique, enoturismo y eventos culturales.',
    imageUrl: '/images/city-gualeguaychu.jpg',
    isFeatured: true,
    provinceId: 'entre-rios',
    provinceName: 'Entre Ríos',
  },
  {
    id: 'concepcion-del-uruguay',
    name: 'Concepción del Uruguay',
    slug: 'concepcion-del-uruguay',
    department: 'Uruguay',
    description: 'Ciudad histórica con puerto y polo universitario.',
    imageUrl: '/images/city-concepcion.jpg',
    isFeatured: false,
    provinceId: 'entre-rios',
    provinceName: 'Entre Ríos',
  },
  {
    id: 'federacion',
    name: 'Federación',
    slug: 'federacion',
    department: 'Federación',
    description: 'Ciudad termal pionera a orillas del lago Salto Grande.',
    imageUrl: '/images/city-federacion.jpg',
    isFeatured: false,
    provinceId: 'entre-rios',
    provinceName: 'Entre Ríos',
  },
  {
    id: 'villa-elisa',
    name: 'Villa Elisa',
    slug: 'villa-elisa',
    department: 'Colón',
    description: 'Jardín de Entre Ríos con complejo termal.',
    imageUrl: '/images/city-villaelisa.jpg',
    isFeatured: false,
    provinceId: 'entre-rios',
    provinceName: 'Entre Ríos',
  },
  {
    id: 'chajari',
    name: 'Chajarí',
    slug: 'chajari',
    department: 'Federación',
    description: 'Polo citrícola y termal del noreste entrerriano.',
    imageUrl: '/images/city-chajari.jpg',
    isFeatured: false,
    provinceId: 'entre-rios',
    provinceName: 'Entre Ríos',
  },
];

export const CITIES_CABA: City[] = [
  {
    id: 'palermo',
    name: 'Palermo',
    slug: 'palermo',
    department: 'Comuna 14',
    description: 'Polo gastronómico, comercial y de diseño de la Ciudad de Buenos Aires.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'caba',
    provinceName: 'CABA',
  },
  {
    id: 'recoleta',
    name: 'Recoleta',
    slug: 'recoleta',
    department: 'Comuna 2',
    description: 'Tradición, arquitectura histórica y paseos comerciales de primer nivel.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'caba',
    provinceName: 'CABA',
  },
  {
    id: 'belgrano',
    name: 'Belgrano',
    slug: 'belgrano',
    department: 'Comuna 13',
    description: 'Centro comercial, residencial y gastronómico de la zona norte porteña.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'caba',
    provinceName: 'CABA',
  },
  {
    id: 'caballito',
    name: 'Caballito',
    slug: 'caballito',
    department: 'Comuna 6',
    description: 'Centro geográfico porteño con gran actividad comercial y conectividad.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'caba',
    provinceName: 'CABA',
  },
  {
    id: 'puerto-madero',
    name: 'Puerto Madero',
    slug: 'puerto-madero',
    department: 'Comuna 1',
    description: 'Polo corporativo, gastronómico y residencial moderno frente al río.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'caba',
    provinceName: 'CABA',
  },
  {
    id: 'san-telmo',
    name: 'San Telmo',
    slug: 'san-telmo',
    department: 'Comuna 1',
    description: 'Casco histórico, antigüedades, tango y vida cultural bohemia.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: false,
    provinceId: 'caba',
    provinceName: 'CABA',
  },
  {
    id: 'flores',
    name: 'Flores',
    slug: 'flores',
    department: 'Comuna 7',
    description: 'Polo textil mayorista y comercial de la Ciudad de Buenos Aires.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: false,
    provinceId: 'caba',
    provinceName: 'CABA',
  },
  {
    id: 'villa-urquiza',
    name: 'Villa Urquiza',
    slug: 'villa-urquiza',
    department: 'Comuna 12',
    description: 'Barrio residencial y pujante centro gastronómico.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: false,
    provinceId: 'caba',
    provinceName: 'CABA',
  },
];

export const CITIES_CORDOBA: City[] = [
  {
    id: 'cordoba-capital',
    name: 'Córdoba Capital',
    slug: 'cordoba-capital',
    department: 'Capital',
    description: 'Capital provincial, polo universitario, industrial y cultural.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'cordoba',
    provinceName: 'Córdoba',
  },
  {
    id: 'villa-carlos-paz',
    name: 'Villa Carlos Paz',
    slug: 'villa-carlos-paz',
    department: 'Punilla',
    description: 'Principal destino turístico del valle de Punilla y del país.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'cordoba',
    provinceName: 'Córdoba',
  },
  {
    id: 'rio-cuarto',
    name: 'Río Cuarto',
    slug: 'rio-cuarto',
    department: 'Río Cuarto',
    description: 'Capital alterna y centro agroindustrial del sur cordobés.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'cordoba',
    provinceName: 'Córdoba',
  },
  {
    id: 'villa-maria',
    name: 'Villa María',
    slug: 'villa-maria',
    department: 'General San Martín',
    description: 'Importante cuenca láctea, polo universitario y centro neurálgico provincial.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'cordoba',
    provinceName: 'Córdoba',
  },
  {
    id: 'alta-gracia',
    name: 'Alta Gracia',
    slug: 'alta-gracia',
    department: 'Santa María',
    description: 'Ciudad histórica, legado jesuítico y turismo serrano.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: false,
    provinceId: 'cordoba',
    provinceName: 'Córdoba',
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    slug: 'san-francisco',
    department: 'San Justo',
    description: 'Polo productivo y metalmecánico del este cordobés.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: false,
    provinceId: 'cordoba',
    provinceName: 'Córdoba',
  },
  {
    id: 'villa-general-belgrano',
    name: 'Villa General Belgrano',
    slug: 'villa-general-belgrano',
    department: 'Calamuchita',
    description: 'Turismo centroeuropeo, gastronomía y cervecerías artesanales.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: false,
    provinceId: 'cordoba',
    provinceName: 'Córdoba',
  },
  {
    id: 'cosquin',
    name: 'Cosquín',
    slug: 'cosquin',
    department: 'Punilla',
    description: 'Capital nacional del folklore a orillas del río Cosquín.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: false,
    provinceId: 'cordoba',
    provinceName: 'Córdoba',
  },
];

export const CITIES_BUENOS_AIRES: City[] = [
  {
    id: 'la-plata',
    name: 'La Plata',
    slug: 'la-plata',
    department: 'La Plata',
    description: 'Capital provincial, ciudad planificada, polo administrativo y universitario.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'buenos-aires',
    provinceName: 'Buenos Aires',
  },
  {
    id: 'mar-del-plata',
    name: 'Mar del Plata',
    slug: 'mar-del-plata',
    department: 'General Pueyrredón',
    description: 'Principal polo turístico de la costa atlántica y puerto pesquero.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'buenos-aires',
    provinceName: 'Buenos Aires',
  },
  {
    id: 'bahia-blanca',
    name: 'Bahía Blanca',
    slug: 'bahia-blanca',
    department: 'Bahía Blanca',
    description: 'Polo petroquímico y puerto de aguas profundas del sur bonaerense.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'buenos-aires',
    provinceName: 'Buenos Aires',
  },
  {
    id: 'tandil',
    name: 'Tandil',
    slug: 'tandil',
    department: 'Tandil',
    description: 'Turismo serrano, industria quesera y polo tecnológico bonaerense.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: 'buenos-aires',
    provinceName: 'Buenos Aires',
  },
  {
    id: 'san-nicolas',
    name: 'San Nicolás',
    slug: 'san-nicolas',
    department: 'San Nicolás',
    description: 'Polo industrial siderúrgico y turismo religioso a orillas del Paraná.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: false,
    provinceId: 'buenos-aires',
    provinceName: 'Buenos Aires',
  },
  {
    id: 'pergamino',
    name: 'Pergamino',
    slug: 'pergamino',
    department: 'Pergamino',
    description: 'Capital nacional de la semilla y centro agroindustrial del norte bonaerense.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: false,
    provinceId: 'buenos-aires',
    provinceName: 'Buenos Aires',
  },
  {
    id: 'junin',
    name: 'Junín',
    slug: 'junin',
    department: 'Junín',
    description: 'Centro comercial, administrativo y turístico del noroeste bonaerense.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: false,
    provinceId: 'buenos-aires',
    provinceName: 'Buenos Aires',
  },
  {
    id: 'olavarria',
    name: 'Olavarría',
    slug: 'olavarria',
    department: 'Olavarría',
    description: 'Capital minera e industrial del centro bonaerense.',
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: false,
    provinceId: 'buenos-aires',
    provinceName: 'Buenos Aires',
  },
];

export const ALL_CITIES: City[] = [
  ...CITIES_SANTA_FE,
  ...CITIES_ENTRE_RIOS,
  ...CITIES_CABA,
  ...CITIES_CORDOBA,
  ...CITIES_BUENOS_AIRES,
];

export function getCitiesByProvince(provinceId: string): City[] {
  if (!provinceId || provinceId === 'all' || provinceId === 'todas') {
    return ALL_CITIES;
  }

  // Check if province has custom configured cities in province-store
  try {
    const { getProvincesConfig } = require('@/lib/services/province-store');
    const configs = getProvincesConfig();
    const targetProv = configs.find((p: any) => p.id === provinceId || p.slug === provinceId);
    if (targetProv && Array.isArray(targetProv.cities) && targetProv.cities.length > 0) {
      const activeCustomCities = targetProv.cities
        .filter((c: any) => c.isActive)
        .map((c: any) => {
          const matchDefault = ALL_CITIES.find((dc) => dc.id === c.id || dc.slug === c.slug);
          return {
            id: c.id,
            name: c.name,
            slug: c.slug || c.id,
            department: matchDefault?.department || targetProv.name,
            description: matchDefault?.description || `Ciudad de ${targetProv.name}`,
            imageUrl: matchDefault?.imageUrl || '/images/city-rosario.jpg',
            isFeatured: matchDefault?.isFeatured ?? true,
            provinceId: targetProv.id,
            provinceName: targetProv.name,
          };
        });

      if (activeCustomCities.length > 0) return activeCustomCities;
    }
  } catch (e) {
    // Fallback to static defaults
  }

  const staticMatches = ALL_CITIES.filter((city) => city.provinceId === provinceId);
  if (staticMatches.length > 0) {
    return staticMatches;
  }

  // Fallback garantizado para provincias agregadas dinámicamente: nunca devolver array vacío
  const provObj = getProvinceById(provinceId);
  const provName = provObj?.name || provinceId;
  return [
    {
      id: `${provinceId}-capital`,
      name: `${provName} Capital`,
      slug: `${provinceId}-capital`,
      department: provName,
      description: `Centro comercial y administrativo de ${provName}.`,
      imageUrl: '/images/city-rosario.jpg',
      isFeatured: true,
      provinceId: provinceId,
      provinceName: provName,
    },
  ];
}

export function getProvinceById(provinceId: string): Province | undefined {
  if (!provinceId) return undefined;
  const staticFound = PROVINCES.find((p) => p.id === provinceId || p.slug === provinceId);
  if (staticFound) return staticFound;

  try {
    const { getProvincesConfig } = require('@/lib/services/province-store');
    const configs = getProvincesConfig();
    const dynamicFound = configs.find((p: any) => p.id === provinceId || p.slug === provinceId);
    if (dynamicFound) {
      return {
        id: dynamicFound.id,
        name: dynamicFound.name,
        slug: dynamicFound.slug || dynamicFound.id,
      };
    }
  } catch (e) {}

  // Sintetizar objeto Province válido con formato limpio para que nunca falle con 404
  const name = provinceId
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return { id: provinceId, name, slug: provinceId };
}

export function getProvinceBySlug(slug: string): Province | undefined {
  if (!slug) return undefined;
  return getProvinceById(slug);
}

export function getCityBySlug(slug: string): City | undefined {
  if (!slug) return undefined;
  const staticCity = ALL_CITIES.find((c) => c.slug === slug || c.id === slug);
  if (staticCity) return staticCity;

  try {
    const { getProvincesConfig } = require('@/lib/services/province-store');
    const configs = getProvincesConfig();
    for (const prov of configs) {
      if (Array.isArray(prov.cities)) {
        const found = prov.cities.find((c: any) => c.slug === slug || c.id === slug);
        if (found) {
          return {
            id: found.id,
            name: found.name,
            slug: found.slug || found.id,
            department: prov.name,
            description: `Ciudad de ${prov.name}`,
            imageUrl: found.imageUrl || '/images/city-rosario.jpg',
            isFeatured: true,
            provinceId: prov.id,
            provinceName: prov.name,
          };
        }
      }
    }
  } catch (e) {}

  return undefined;
}

export const VALID_SECTION_SLUGS: Record<string, { name: string; description: string }> = {
  'comercios': {
    name: 'Comercios e Industria',
    description: 'Directorio B2B, industrias y comercios verificados con contacto directo a WhatsApp.',
  },
  'catalogo': {
    name: 'Catálogo & Ofertas',
    description: 'Catálogo de productos y ofertas con pedido directo a WhatsApp.',
  },
  'sorteos': {
    name: 'Sorteos ON MÁS',
    description: 'Premios, sorteos vigentes e inscripciones gratuitas.',
  },
  'empleos': {
    name: 'Empleos & Oportunidades',
    description: 'Búsquedas laborales, ofertas de trabajo y postulaciones directas.',
  },
  'clasificados': {
    name: 'Empleos & Oportunidades',
    description: 'Búsquedas laborales, ofertas de trabajo y postulaciones directas.',
  },
  'mi-sitio-web': {
    name: 'Mi Sitio Web Propio',
    description: 'Servicio de desarrollo de sitios web corporativos y tiendas online.',
  },
  'novedades': {
    name: 'Novedades & Agenda Regional',
    description: 'Eventos, agenda de novedades, festivales y noticias regionales.',
  },
  'comunidad': {
    name: 'Novedades & Agenda Regional',
    description: 'Eventos, agenda de novedades, festivales y noticias regionales.',
  },
  'turismo': {
    name: 'Turismo & Posadas',
    description: 'Guía de turismo, playas, termas, bodegas y alojamientos.',
  },
};

