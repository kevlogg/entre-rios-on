-- ========================================================
-- ON MÁS: ESQUEMA DE BASE DE DATOS POSTGRESQL (SUPABASE)
-- ========================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA DE PERFILES DE USUARIO (Vinculada a auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'MERCHANT_ADMIN' CHECK (role IN ('SUPER_ADMIN', 'MERCHANT_ADMIN', 'PUBLIC_USER')),
  -- Tipo de usuario automotor: particular (vende/compra autos), agencia (concesionaria),
  -- negocio_automotor (talleres, repuestos, seguros, etc.)
  user_type TEXT DEFAULT 'particular' CHECK (user_type IN ('particular', 'agencia', 'negocio_automotor')),
  phone_whatsapp TEXT,
  province_id TEXT DEFAULT 'santa-fe',
  city_name TEXT,
  commerce_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migración para bases de datos existentes (ejecutar si la tabla ya existe)
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'particular' CHECK (user_type IN ('particular', 'agencia', 'negocio_automotor'));
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_whatsapp TEXT;
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS province_id TEXT DEFAULT 'santa-fe';
-- ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city_name TEXT;

-- 2. TABLA DE CIUDADES / DEPARTAMENTOS DE SANTA FE Y ENTRE RÍOS
CREATE TABLE IF NOT EXISTS public.cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  province_id TEXT NOT NULL DEFAULT 'santa-fe',
  province_name TEXT NOT NULL DEFAULT 'Santa Fe',
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
  province_id TEXT NOT NULL DEFAULT 'santa-fe',
  city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  description TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  views_count BIGINT DEFAULT 0,
  whatsapp_clicks_count BIGINT DEFAULT 0,
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

-- Migración: agregar columnas de métricas si la tabla ya existe (idempotente)
ALTER TABLE public.commerces ADD COLUMN IF NOT EXISTS views_count BIGINT DEFAULT 0;
ALTER TABLE public.commerces ADD COLUMN IF NOT EXISTS whatsapp_clicks_count BIGINT DEFAULT 0;


-- Agregar Clave Foránea de perfil a comercio
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS fk_profile_commerce;
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
  province_id TEXT NOT NULL DEFAULT 'santa-fe',
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
  province_id TEXT NOT NULL DEFAULT 'santa-fe',
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
  province_id TEXT NOT NULL DEFAULT 'santa-fe',
  city_tag TEXT NOT NULL,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. TABLA DE CLASIFICADOS ON (COMPRA / VENTA ENTRE PARTICULARES Y EMPRESAS)
CREATE TABLE IF NOT EXISTS public.classifieds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Vehículos', 'Inmuebles', 'Maquinaria', 'Servicios', 'Otros')),
  province_id TEXT NOT NULL DEFAULT 'santa-fe',
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
  province_id TEXT NOT NULL DEFAULT 'santa-fe',
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

-- 9b. TABLA DE HISTORIAL GRANULAR DE VISTAS DE PERFIL DE COMERCIO
CREATE TABLE IF NOT EXISTS public.profile_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commerce_id UUID NOT NULL REFERENCES public.commerces(id) ON DELETE CASCADE,
  user_agent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- ÍNDICES DE RENDIMIENTO DE CONSULTAS SQL
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_cities_province ON public.cities(province_id);
CREATE INDEX IF NOT EXISTS idx_commerces_city ON public.commerces(city_id);
CREATE INDEX IF NOT EXISTS idx_commerces_province ON public.commerces(province_id);
CREATE INDEX IF NOT EXISTS idx_commerces_slug ON public.commerces(slug);
CREATE INDEX IF NOT EXISTS idx_products_commerce ON public.products(commerce_id);
CREATE INDEX IF NOT EXISTS idx_products_city ON public.products(city_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_community_events_city ON public.community_events(city_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_commerce ON public.whatsapp_clicks(commerce_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_created ON public.whatsapp_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_profile_views_commerce ON public.profile_views(commerce_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_created ON public.profile_views(created_at);


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
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Lectura pública para elementos del portal
DROP POLICY IF EXISTS "Public Read Cities" ON public.cities;
CREATE POLICY "Public Read Cities" ON public.cities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Commerces" ON public.commerces;
CREATE POLICY "Public Read Commerces" ON public.commerces FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Events" ON public.community_events;
CREATE POLICY "Public Read Events" ON public.community_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Banners" ON public.banner_slides;
CREATE POLICY "Public Read Banners" ON public.banner_slides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Approved Classifieds" ON public.classifieds;
CREATE POLICY "Public Read Approved Classifieds" ON public.classifieds FOR SELECT USING (status = 'APPROVED');

DROP POLICY IF EXISTS "Public Read Active Raffles" ON public.raffles;
CREATE POLICY "Public Read Active Raffles" ON public.raffles FOR SELECT USING (true);

-- Permisos de Inserción Pública para Participantes de Sorteos y Clics de WhatsApp
DROP POLICY IF EXISTS "Public Insert Raffle Participants" ON public.raffle_participants;
CREATE POLICY "Public Insert Raffle Participants" ON public.raffle_participants FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Insert WhatsApp Clicks" ON public.whatsapp_clicks;
CREATE POLICY "Public Insert WhatsApp Clicks" ON public.whatsapp_clicks FOR INSERT WITH CHECK (true);

-- La lectura de whatsapp_clicks y profile_views se permite también para que el admin pueda contar desde cliente
DROP POLICY IF EXISTS "Public Read WhatsApp Clicks" ON public.whatsapp_clicks;
CREATE POLICY "Public Read WhatsApp Clicks" ON public.whatsapp_clicks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Profile Views" ON public.profile_views;
CREATE POLICY "Public Insert Profile Views" ON public.profile_views FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Profile Views" ON public.profile_views;
CREATE POLICY "Public Read Profile Views" ON public.profile_views FOR SELECT USING (true);


-- 10. TABLA DE EMPLEOS Y OPORTUNIDADES LABORALES
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  city_name TEXT NOT NULL,
  province_id TEXT DEFAULT 'entre-rios',
  work_modality TEXT DEFAULT 'Presencial' CHECK (work_modality IN ('Presencial', 'Híbrido', 'Remoto')),
  job_type TEXT DEFAULT 'Tiempo Completo',
  salary TEXT DEFAULT 'A convenir',
  description TEXT NOT NULL,
  phone_whatsapp TEXT NOT NULL,
  status TEXT DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migración de columna work_modality por si la tabla ya existe
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS work_modality TEXT DEFAULT 'Presencial';

-- 11. TABLA DE PAGOS EN EFECTIVO B2B
CREATE TABLE IF NOT EXISTS public.cash_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commerce_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone_whatsapp TEXT NOT NULL,
  plan_name TEXT NOT NULL CHECK (plan_name IN ('Bronce', 'Plata', 'Oro')),
  amount NUMERIC(12,2) NOT NULL,
  city_name TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. TABLA DE SOLICITUDES MI SITIO WEB
CREATE TABLE IF NOT EXISTS public.web_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone_whatsapp TEXT NOT NULL,
  email TEXT,
  desired_domain TEXT,
  notes TEXT,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONTACTED', 'IN_DEVELOPMENT')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. TABLA DE CONFIGURACIÓN VISUAL Y BANNERS POR PROVINCIA
CREATE TABLE IF NOT EXISTS public.province_configs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  banner_desktop TEXT NOT NULL,
  banner_mobile TEXT NOT NULL,
  text_color TEXT DEFAULT '#0047BA',
  button_bg_color TEXT DEFAULT '#00ADB5',
  card_accent_color TEXT DEFAULT '#00E5E8',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. TABLA DE SERVICIOS DE TURISMO
CREATE TABLE IF NOT EXISTS public.tourism_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  city_name TEXT NOT NULL,
  province_id TEXT DEFAULT 'entre-rios',
  price TEXT NOT NULL,
  plan_tier TEXT DEFAULT 'Plata' CHECK (plan_tier IN ('Bronce', 'Plata', 'Oro')),
  image_url TEXT NOT NULL,
  description TEXT,
  phone_whatsapp TEXT,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migración de columnas por si la tabla ya existe
ALTER TABLE public.tourism_services ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.tourism_services ADD COLUMN IF NOT EXISTS phone_whatsapp TEXT;

-- Habilitar RLS en perfiles y nuevas tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cash_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.province_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tourism_services ENABLE ROW LEVEL SECURITY;

-- Politicas de perfiles
DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users Update Own Profile" ON public.profiles;
CREATE POLICY "Users Update Own Profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Politicas de lectura pública
DROP POLICY IF EXISTS "Public Read Jobs" ON public.jobs;
CREATE POLICY "Public Read Jobs" ON public.jobs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Tourism Services" ON public.tourism_services;
CREATE POLICY "Public Read Tourism Services" ON public.tourism_services FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Province Configs" ON public.province_configs;
CREATE POLICY "Public Read Province Configs" ON public.province_configs FOR SELECT USING (true);

-- Permisos de Inserción Pública para Postulaciones y Solicitudes
DROP POLICY IF EXISTS "Public Insert Jobs" ON public.jobs;
CREATE POLICY "Public Insert Jobs" ON public.jobs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Insert Web Requests" ON public.web_requests;
CREATE POLICY "Public Insert Web Requests" ON public.web_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Web Requests" ON public.web_requests;
CREATE POLICY "Public Read Web Requests" ON public.web_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Update Web Requests" ON public.web_requests;
CREATE POLICY "Public Update Web Requests" ON public.web_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Insert Cash Payments" ON public.cash_payments;
CREATE POLICY "Public Insert Cash Payments" ON public.cash_payments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Cash Payments" ON public.cash_payments;
CREATE POLICY "Public Read Cash Payments" ON public.cash_payments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Update Cash Payments" ON public.cash_payments;
CREATE POLICY "Public Update Cash Payments" ON public.cash_payments FOR ALL USING (true);

-- ========================================================
-- 15. TRIGGER AUTOMÁTICO DE PERFILES EN SUPABASE AUTH (ROBUSTO & SEGURA)
-- ========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'commerce_name', 'Usuario ON MÁS'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'MERCHANT_ADMIN')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Evitar que errores secundarios de esquema impidan la creación del usuario en Auth
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================================
-- DATOS SEMILLA (SEED DATA)
-- ========================================================
INSERT INTO public.cities (id, name, slug, province_id, province_name, department, description, image_url, is_featured, commerce_count)
VALUES 
  -- Santa Fe
  ('rosario', 'Rosario', 'rosario', 'santa-fe', 'Santa Fe', 'Rosario', 'Polo comercial, industrial y gastronómico a orillas del río Paraná.', '/images/city-rosario.jpg', true, 450),
  ('santa-fe-capital', 'Santa Fe Capital', 'santa-fe-capital', 'santa-fe', 'Santa Fe', 'La Capital', 'Capital provincial, centro administrativo, universitario y cultural.', '/images/city-santa-fe-capital.jpg', true, 380),
  ('rafaela', 'Rafaela', 'rafaela', 'santa-fe', 'Santa Fe', 'Castellanos', 'Corazón productivo e industrial del oeste santafesino.', '/images/city-rafaela.jpg', true, 190),
  ('venado-tuerto', 'Venado Tuerto', 'venado-tuerto', 'santa-fe', 'Santa Fe', 'General López', 'Centro agroindustrial y comercial del sur de Santa Fe.', '/images/city-rafaela.jpg', false, 140),
  ('reconquista', 'Reconquista', 'reconquista', 'santa-fe', 'Santa Fe', 'General Obligado', 'Polo comercial y agroganadero del norte santafesino.', '/images/city-rosario.jpg', false, 110),
  ('santo-tome', 'Santo Tomé', 'santo-tome', 'santa-fe', 'Santa Fe', 'La Capital', 'Ciudad vecina conectada al área metropolitana santafesina.', '/images/city-santa-fe-capital.jpg', false, 85),
  ('esperanza', 'Esperanza', 'esperanza', 'santa-fe', 'Santa Fe', 'Las Colonias', 'Primera colonia agrícola organizada de la República Argentina.', '/images/city-rafaela.jpg', false, 95),
  -- Entre Ríos
  ('parana', 'Paraná', 'parana', 'entre-rios', 'Entre Ríos', 'Paraná', 'Capital provincial de Entre Ríos con barrancas al río Paraná.', '/images/city-parana.jpg', true, 310),
  ('concordia', 'Concordia', 'concordia', 'entre-rios', 'Entre Ríos', 'Concordia', 'Capital nacional del citrus y termas a orillas del río Uruguay.', '/images/city-concordia.jpg', true, 240),
  ('colon', 'Colón', 'colon', 'entre-rios', 'Entre Ríos', 'Colón', 'Destino turístico con playas de arena blanca y termas.', '/images/city-colon.jpg', true, 180),
  ('gualeguaychu', 'Gualeguaychú', 'gualeguaychu', 'entre-rios', 'Entre Ríos', 'Gualeguaychú', 'Bodegas boutique, enoturismo y eventos culturales.', '/images/city-gualeguaychu.jpg', true, 210),
  ('concepcion-del-uruguay', 'Concepción del Uruguay', 'concepcion-del-uruguay', 'entre-rios', 'Entre Ríos', 'Uruguay', 'Ciudad histórica con puerto y polo universitario.', '/images/city-concepcion.jpg', false, 160),
  ('federacion', 'Federación', 'federacion', 'entre-rios', 'Entre Ríos', 'Federación', 'Ciudad termal pionera a orillas del lago Salto Grande.', '/images/city-federacion.jpg', false, 120),
  ('villa-elisa', 'Villa Elisa', 'villa-elisa', 'entre-rios', 'Entre Ríos', 'Colón', 'Jardín de Entre Ríos con complejo termal.', '/images/city-villaelisa.jpg', false, 90),
  ('chajari', 'Chajarí', 'chajari', 'entre-rios', 'Entre Ríos', 'Federación', 'Polo citrícola y termal del noreste entrerriano.', '/images/city-chajari.jpg', false, 105)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  province_id = EXCLUDED.province_id,
  province_name = EXCLUDED.province_name,
  department = EXCLUDED.department,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  is_featured = EXCLUDED.is_featured,
  commerce_count = EXCLUDED.commerce_count;

-- Sorteo Inicial Semilla
INSERT INTO public.raffles (id, title, prize, sponsor_name, image_url, draw_date, status)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Sorteo Estancia Termal Federación 2026',
  '2 Noches para 2 personas + Pases Termales Libre + Cena Litoraleña',
  'Termas Federación & Posada Sol',
  '/images/city-federacion.jpg',
  NOW() + INTERVAL '30 days',
  'ACTIVE'
)
ON CONFLICT (id) DO NOTHING;

