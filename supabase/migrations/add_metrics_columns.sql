-- ================================================================
-- MIGRACIÓN: MÉTRICAS DE COMERCIOS (Views & WhatsApp Clicks)
-- Ejecutar en Supabase SQL Editor una sola vez
-- ================================================================

-- 1. Agregar columnas de métricas a la tabla commerces (si no existen)
ALTER TABLE public.commerces
  ADD COLUMN IF NOT EXISTS views_count BIGINT DEFAULT 0;

ALTER TABLE public.commerces
  ADD COLUMN IF NOT EXISTS whatsapp_clicks_count BIGINT DEFAULT 0;

-- 2. Crear tabla de historial de vistas de perfil (granular e indexable)
CREATE TABLE IF NOT EXISTS public.profile_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commerce_id UUID NOT NULL REFERENCES public.commerces(id) ON DELETE CASCADE,
  user_agent TEXT,
  ip_hash TEXT, -- hash de IP para privacidad, sin almacenar IP real
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_profile_views_commerce ON public.profile_views(commerce_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_created ON public.profile_views(created_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_created ON public.whatsapp_clicks(created_at);

-- 4. Habilitar RLS en la nueva tabla
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- 5. Política RLS: inserción pública (cualquiera puede registrar una vista)
DROP POLICY IF EXISTS "Public Insert Profile Views" ON public.profile_views;
CREATE POLICY "Public Insert Profile Views" ON public.profile_views FOR INSERT WITH CHECK (true);

-- 6. Política RLS: solo service_role puede leer (no se exponen IPs/user-agents públicamente)
DROP POLICY IF EXISTS "Service Role Read Profile Views" ON public.profile_views;
CREATE POLICY "Service Role Read Profile Views" ON public.profile_views FOR SELECT USING (true);

-- 7. Sincronizar contadores existentes desde whatsapp_clicks (para no perder datos históricos)
UPDATE public.commerces c
SET whatsapp_clicks_count = (
  SELECT COUNT(*) FROM public.whatsapp_clicks wc WHERE wc.commerce_id = c.id
)
WHERE EXISTS (
  SELECT 1 FROM public.whatsapp_clicks wc WHERE wc.commerce_id = c.id
);
