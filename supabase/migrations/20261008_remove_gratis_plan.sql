-- Migration: Remove GRATIS plan. Existing GRATIS rows are migrated to BRONCE.
UPDATE public.commerces SET subscription_tier = 'BRONCE' WHERE subscription_tier = 'GRATIS';
UPDATE public.cash_payments SET plan_name = 'Bronce' WHERE plan_name = 'Gratis';
UPDATE public.tourism_services SET plan_tier = 'Bronce' WHERE plan_tier = 'Gratis';

ALTER TABLE IF EXISTS public.commerces DROP CONSTRAINT IF EXISTS commerces_subscription_tier_check;
ALTER TABLE IF EXISTS public.commerces ADD CONSTRAINT commerces_subscription_tier_check CHECK (subscription_tier IN ('BRONCE', 'PLATA', 'ORO'));

ALTER TABLE IF EXISTS public.cash_payments DROP CONSTRAINT IF EXISTS cash_payments_plan_name_check;
ALTER TABLE IF EXISTS public.cash_payments ADD CONSTRAINT cash_payments_plan_name_check CHECK (plan_name IN ('Bronce', 'Plata', 'Oro'));

ALTER TABLE IF EXISTS public.tourism_services DROP CONSTRAINT IF EXISTS tourism_services_plan_tier_check;
ALTER TABLE IF EXISTS public.tourism_services ADD CONSTRAINT tourism_services_plan_tier_check CHECK (plan_tier IN ('Bronce', 'Plata', 'Oro'));

DELETE FROM public.subscription_plans WHERE id = 'gratis';
