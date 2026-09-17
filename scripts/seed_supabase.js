const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Error: Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function seedData() {
  console.log('🚀 Iniciando sembrado de datos en Supabase...');

  const cities = [
    { id: 'rosario', name: 'Rosario', slug: 'rosario', province_id: 'santa-fe', province_name: 'Santa Fe', department: 'Rosario', description: 'Polo comercial, industrial y gastronómico a orillas del río Paraná.', image_url: '/images/city-rosario.jpg', is_featured: true, commerce_count: 450 },
    { id: 'santa-fe-capital', name: 'Santa Fe Capital', slug: 'santa-fe-capital', province_id: 'santa-fe', province_name: 'Santa Fe', department: 'La Capital', description: 'Capital provincial, centro administrativo, universitario y cultural.', image_url: '/images/city-santa-fe-capital.jpg', is_featured: true, commerce_count: 380 },
    { id: 'rafaela', name: 'Rafaela', slug: 'rafaela', province_id: 'santa-fe', province_name: 'Santa Fe', department: 'Castellanos', description: 'Corazón productivo e industrial del oeste santafesino.', image_url: '/images/city-rafaela.jpg', is_featured: true, commerce_count: 190 },
    { id: 'venado-tuerto', name: 'Venado Tuerto', slug: 'venado-tuerto', province_id: 'santa-fe', province_name: 'Santa Fe', department: 'General López', description: 'Centro agroindustrial y comercial del sur de Santa Fe.', image_url: '/images/city-rafaela.jpg', is_featured: false, commerce_count: 140 },
    { id: 'parana', name: 'Paraná', slug: 'parana', province_id: 'entre-rios', province_name: 'Entre Ríos', department: 'Paraná', description: 'Capital provincial de Entre Ríos con barrancas al río Paraná.', image_url: '/images/city-parana.jpg', is_featured: true, commerce_count: 310 },
    { id: 'concordia', name: 'Concordia', slug: 'concordia', province_id: 'entre-rios', province_name: 'Entre Ríos', department: 'Concordia', description: 'Capital nacional del citrus y termas a orillas del río Uruguay.', image_url: '/images/city-concordia.jpg', is_featured: true, commerce_count: 240 },
    { id: 'colon', name: 'Colón', slug: 'colon', province_id: 'entre-rios', province_name: 'Entre Ríos', department: 'Colón', description: 'Destino turístico con playas de arena blanca y termas.', image_url: '/images/city-colon.jpg', is_featured: true, commerce_count: 180 },
    { id: 'gualeguaychu', name: 'Gualeguaychú', slug: 'gualeguaychu', province_id: 'entre-rios', province_name: 'Entre Ríos', department: 'Gualeguaychú', description: 'Bodegas boutique, enoturismo y eventos culturales.', image_url: '/images/city-gualeguaychu.jpg', is_featured: true, commerce_count: 210 }
  ];

  const { error: cityErr } = await supabase.from('cities').upsert(cities, { onConflict: 'id' });
  if (cityErr) {
    console.error('❌ Error sembrando ciudades:', cityErr);
  } else {
    console.log('✅ Ciudades insertadas correctamente (Santa Fe & Entre Ríos)');
  }

  const commerces = [
    {
      name: 'La Bamba Rosario - Parador & Bar',
      slug: 'la-bamba-rosario',
      category: 'Gastronomía & Bares',
      province_id: 'santa-fe',
      city_id: 'rosario',
      city_name: 'Rosario',
      description: 'Gastronomía de río, tragos de autor y música en vivo frente al Monumento a la Bandera.',
      rating: 4.9,
      review_count: 128,
      is_verified: true,
      is_subscription_active: true,
      subscription_tier: 'ORO',
      logo_url: '/images/city-rosario.jpg',
      cover_url: '/images/city-rosario.jpg',
      phone_whatsapp: '3415550199',
      address: 'Av. Belgrano 600, Rosario',
      instagram: '@labambarosario'
    }
  ];

  const { error: commErr } = await supabase.from('commerces').upsert(commerces, { onConflict: 'slug' });
  if (commErr) {
    console.error('❌ Error sembrando comercios:', commErr);
  } else {
    console.log('✅ Comercios insertados correctamente');
  }

  console.log('🎉 Sembrado finalizado con éxito.');
}

seedData();
