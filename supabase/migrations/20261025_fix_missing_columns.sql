-- ========================================================
-- MIGRACIÓN: CORRECCIÓN DE COLUMNAS PENDIENTES EN SUPABASE
-- Proyecto: ON MÁS
-- ========================================================

-- 1. Tabla products: galería de imágenes y métricas de vistas
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS gallery_images TEXT[];

ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS views_count BIGINT DEFAULT 0;

-- 2. Tabla community_events: estado para moderación editorial en SuperAdmin
ALTER TABLE public.community_events 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'));

-- Actualizar filas existentes a APPROVED si están en NULL
UPDATE public.community_events SET status = 'APPROVED' WHERE status IS NULL;

-- 3. Tabla jobs: modalidad laboral (Presencial, Híbrido, Remoto)
ALTER TABLE public.jobs 
  ADD COLUMN IF NOT EXISTS work_modality TEXT DEFAULT 'Presencial' CHECK (work_modality IN ('Presencial', 'Híbrido', 'Remoto'));

-- Actualizar filas existentes a Presencial si están en NULL
UPDATE public.jobs SET work_modality = 'Presencial' WHERE work_modality IS NULL;

-- Recargar caché de esquema en Supabase PostgREST
NOTIFY pgrst, 'reload schema';
