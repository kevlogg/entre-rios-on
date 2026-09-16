-- ========================================================
-- ENTRE RÍOS ON: ESQUEMA DE BASE DE DATOS POSTGRESQL (SUPABASE)
-- ========================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE PERFILES DE USUARIO (Vinculada a auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'MERCHANT_ADMIN' CHECK (role IN ('SUPER_ADMIN', 'MERCHANT_ADMIN', 'PUBLIC_USER')),
  commerce_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABLA DE CIUDADES / DEPARTAMENTOS DE ENTRE RÍOS
CREATE TABLE IF NOT EXISTS public.cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  department TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT true,
  commerce_count INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA DE COMERCIOS & EMPRENDIMIENTOS
CREATE TABLE IF NOT EXISTS public.commerces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  description TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT true,
  is_subscription_active BOOLEAN DEFAULT true,
  subscription_tier TEXT DEFAULT 'BRONCE' CHECK (subscription_tier IN ('BRONCE', 'PLATA', 'ORO')),
  logo_url TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  phone_whatsapp TEXT NOT NULL,
  address TEXT NOT NULL,
  instagram TEXT,
  website TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agregar Clave Foránea de perfil a comercio
ALTER TABLE public.profiles 
  ADD CONSTRAINT fk_profile_commerce 
  FOREIGN KEY (commerce_id) REFERENCES public.commerces(id) ON DELETE SET NULL;

-- 4. TABLA DE PRODUCTOS Y SERVICIOS DEL CATÁLOGO B2B
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price NUMERIC(12,2),
  currency TEXT DEFAULT 'ARS',
  commerce_id UUID NOT NULL REFERENCES public.commerces(id) ON DELETE CASCADE,
  commerce_name TEXT NOT NULL,
  city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  category_id TEXT,
  is_featured BOOLEAN DEFAULT false,
  description TEXT NOT NULL,
  phone_whatsapp TEXT NOT NULL,
  whatsapp_message_custom TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. TABLA DE NOTICIAS Y AGENDA CULTURAL REGIONAL
CREATE TABLE IF NOT EXISTS public.community_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Festival', 'Gastronomía', 'Cultura', 'Deportes', 'Turismo', 'Emprendedores')),
  date DATE NOT NULL,
  formatted_date TEXT NOT NULL,
  location TEXT NOT NULL,
  city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  read_time_minutes INT DEFAULT 4,
  excerpt TEXT NOT NULL,
  full_story TEXT,
  is_featured BOOLEAN DEFAULT false,
  author_name TEXT NOT NULL,
  author_avatar_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABLA DE BANNERS EDITORIALES PORTADA (HERO SLIDES)
CREATE TABLE IF NOT EXISTS public.banner_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  badge_text TEXT NOT NULL,
  badge_type TEXT CHECK (badge_type IN ('event', 'commerce', 'news', 'tourism')),
  image_url TEXT NOT NULL,
  cta_text TEXT NOT NULL,
  cta_url TEXT NOT NULL,
  city_tag TEXT NOT NULL,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TABLA DE CLASIFICADOS ON (COMPRA / VENTA ENTRE PARTICULARES Y EMPRESAS)
CREATE TABLE IF NOT EXISTS public.classifieds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Vehículos', 'Inmuebles', 'Maquinaria', 'Servicios', 'Otros')),
  city_name TEXT NOT NULL,
  price TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  phone_whatsapp TEXT NOT NULL,
  status TEXT DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TABLA DE SORTEOS ON Y REGISTRO DE PARTICIPANTES
CREATE TABLE IF NOT EXISTS public.raffles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  prize TEXT NOT NULL,
  sponsor_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  draw_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DRAWN', 'CANCELLED')),
  winner_name TEXT,
  winner_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.raffle_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  raffle_id UUID NOT NULL REFERENCES public.raffles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_whatsapp TEXT NOT NULL,
  city_name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. TABLA DE REGISTRO DE LEADS Y CLICS A WHATSAPP
CREATE TABLE IF NOT EXISTS public.whatsapp_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commerce_id UUID REFERENCES public.commerces(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  city_id TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- ÍNDICES DE RENDIMIENTO DE CONSULTAS SQL
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_commerces_city ON public.commerces(city_id);
CREATE INDEX IF NOT EXISTS idx_commerces_slug ON public.commerces(slug);
CREATE INDEX IF NOT EXISTS idx_products_commerce ON public.products(commerce_id);
CREATE INDEX IF NOT EXISTS idx_products_city ON public.products(city_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_community_events_city ON public.community_events(city_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_commerce ON public.whatsapp_clicks(commerce_id);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commerces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classifieds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raffles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raffle_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_clicks ENABLE ROW LEVEL SECURITY;

-- Lectura pública para elementos del portal
CREATE POLICY "Public Read Cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public Read Commerces" ON public.commerces FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Events" ON public.community_events FOR SELECT USING (true);
CREATE POLICY "Public Read Banners" ON public.banner_slides FOR SELECT USING (true);
CREATE POLICY "Public Read Approved Classifieds" ON public.classifieds FOR SELECT USING (status = 'APPROVED');
CREATE POLICY "Public Read Active Raffles" ON public.raffles FOR SELECT USING (true);

-- Permisos de Inserción Pública para Participantes de Sorteos y Clics de WhatsApp
CREATE POLICY "Public Insert Raffle Participants" ON public.raffle_participants FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert WhatsApp Clicks" ON public.whatsapp_clicks FOR INSERT WITH CHECK (true);

-- ========================================================
-- DATOS SEMILLA (SEED DATA)
-- ========================================================
INSERT INTO public.cities (id, name, slug, department, description, image_url, is_featured, commerce_count)
VALUES 
  ('parana', 'Paraná', 'parana', 'Paraná', 'Capital provincial a orillas del majestuoso Río Paraná, destacada por sus barrancas, gastronomía fluvial y centro comercial.', '/images/city-parana.jpg', true, 342),
  ('concordia', 'Concordia', 'concordia', 'Concordia', 'Corazón citrícola y termal sobre el Uruguay, epicentro de la producción de arándanos, citrus y turismo de pesca.', '/images/city-concordia.jpg', true, 215),
  ('colon', 'Colón', 'colon', 'Colón', 'Capital Nacional de la Artesanía, playas de arenas blancas, complejas termas y portal de entrada al Parque Nacional El Palmar.', '/images/city-colon.jpg', true, 189),
  ('gualeguaychu', 'Gualeguaychú', 'gualeguaychu', 'Gualeguaychú', 'Capital del Carnaval del País, con intensos viñedos locales, balnearios sobre el río Gualeguaychú y rica industria textil y gráfica.', '/images/city-gualeguaychu.jpg', true, 278),
  ('concepcion-del-uruguay', 'Concepción del Uruguay', 'concepcion-del-uruguay', 'Uruguay', 'La Histórica de Entre Ríos, hogar del Palacio San José, polo universitario del litoral y activo puerto comercial.', '/images/city-concepcion.jpg', true, 164),
  ('federacion', 'Federación', 'federacion', 'Federación', 'Pionera termal a orillas del Embalse Salto Grande, caracterizada por sus parques acuáticos y serenidad turística.', '/images/city-federacion.jpg', true, 120)
ON CONFLICT (id) DO NOTHING;
