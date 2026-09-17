const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Error: Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function seedFullDatabase() {
  console.log('🌱 Sembrando base de datos completa...');

  // 1. Banner Slides
  const bannerSlides = [
    {
      title: 'Monumento a la Bandera & Costanera Rosario',
      subtitle: 'Descubrí los mejores paradores, gastronomía de río y paseos en el Paraná.',
      badge_text: 'PROVINCIA DE SANTA FE',
      badge_type: 'tourism',
      image_url: '/images/hero-rosario.jpg',
      cta_text: 'Explorar Rosario',
      cta_url: '/santa-fe/rosario',
      province_id: 'santa-fe',
      city_tag: 'Rosario'
    },
    {
      title: 'Polo Industrial & Productivo Rafaela',
      subtitle: 'Conectá con empresas, metalmecánica y lácteos líderes del centro santafesino.',
      badge_text: 'INDUSTRIA & COMERCIO',
      badge_type: 'commerce',
      image_url: '/images/hero-rafaela.jpg',
      cta_text: 'Ver Comercios',
      cta_url: '/santa-fe/rafaela/comercios',
      province_id: 'santa-fe',
      city_tag: 'Rafaela'
    },
    {
      title: 'XXXIX Fiesta Nacional de la Artesanía',
      subtitle: 'Vení a Colón y disfrutá de los mejores artesanos del país y shows en vivo.',
      badge_text: 'FESTIVAL DESTACADO',
      badge_type: 'event',
      image_url: '/images/hero-colon.jpg',
      cta_text: 'Ver Cronograma',
      cta_url: '/entre-rios/colon/comunidad',
      province_id: 'entre-rios',
      city_tag: 'Colón'
    }
  ];

  const { error: bannerErr } = await supabase.from('banner_slides').upsert(bannerSlides);
  if (bannerErr) console.error('❌ Error banners:', bannerErr);
  else console.log('✅ Banners insertados');

  // 2. Products
  const { data: comms } = await supabase.from('commerces').select('id, name, city_id, city_name, province_id');
  
  if (comms && comms.length > 0) {
    const rosarioComm = comms.find(c => c.city_id === 'rosario') || comms[0];
    const santaFeComm = comms.find(c => c.city_id === 'santa-fe-capital') || comms[0];
    const paranaComm = comms.find(c => c.city_id === 'parana') || comms[0];

    const products = [
      {
        title: 'Tabla Gourmet de Pescados de Río & Cerveza Artesanal',
        slug: 'tabla-gourmet-la-bamba',
        price: 18500,
        currency: 'ARS',
        commerce_id: rosarioComm.id,
        commerce_name: rosarioComm.name,
        province_id: rosarioComm.province_id,
        city_id: rosarioComm.city_id,
        city_name: rosarioComm.city_name,
        image_url: '/images/city-rosario.jpg',
        category: 'Gastronomía',
        category_id: 'gastronomia',
        is_featured: true,
        description: 'Boga despinada a la parrilla con papas rústicas y dip de alioli casero.',
        phone_whatsapp: '3415550199'
      },
      {
        title: 'Tirantes de Eucaliptus Saligna 2x5 (Viga 4m)',
        slug: 'tirantes-eucaliptus-litoral',
        price: 12400,
        currency: 'ARS',
        commerce_id: santaFeComm.id,
        commerce_name: santaFeComm.name,
        province_id: santaFeComm.province_id,
        city_id: santaFeComm.city_id,
        city_name: santaFeComm.city_name,
        image_url: '/images/city-santa-fe-capital.jpg',
        category: 'Construcción',
        category_id: 'construccion',
        is_featured: true,
        description: 'Madera de primera calidad tratada para techos y pérgolas. Venta directa por mayor y menor.',
        phone_whatsapp: '3424550122'
      }
    ];

    const { error: prodErr } = await supabase.from('products').upsert(products, { onConflict: 'slug' });
    if (prodErr) console.error('❌ Error productos:', prodErr);
    else console.log('✅ Productos insertados');
  }

  // 3. Community Events
  const events = [
    {
      title: 'Festival Gastronómico del Río y Cerveza Artesanal',
      category: 'Gastronomía',
      date: '2026-10-15',
      formatted_date: '15 de Octubre, 18:00 hs',
      location: 'Parque España, Costanera Rosario',
      province_id: 'santa-fe',
      city_id: 'rosario',
      city_name: 'Rosario',
      image_url: '/images/hero-rosario.jpg',
      read_time_minutes: 3,
      excerpt: 'Más de 30 puestos gastronómicos, bandas locales en vivo y degustación de cervezas regionales.',
      full_story: 'El evento reunirá a los mejores chefs y cerveceros de la provincia de Santa Fe a orillas del río Paraná.',
      is_featured: true,
      author_name: 'Prensa Rosario ON',
      author_avatar_url: '/images/city-rosario.jpg'
    }
  ];

  const { error: evErr } = await supabase.from('community_events').upsert(events);
  if (evErr) console.error('❌ Error eventos:', evErr);
  else console.log('✅ Eventos de la comunidad insertados');

  console.log('✨ Base de datos completamente sembrada y lista.');
}

seedFullDatabase();
