-- Migration: Support GRATIS plan in commerces and cash_payments CHECK constraints
ALTER TABLE IF EXISTS public.commerces DROP CONSTRAINT IF EXISTS commerces_subscription_tier_check;
ALTER TABLE IF EXISTS public.commerces ADD CONSTRAINT commerces_subscription_tier_check CHECK (subscription_tier IN ('GRATIS', 'BRONCE', 'PLATA', 'ORO'));

ALTER TABLE IF EXISTS public.cash_payments DROP CONSTRAINT IF EXISTS cash_payments_plan_name_check;
ALTER TABLE IF EXISTS public.cash_payments ADD CONSTRAINT cash_payments_plan_name_check CHECK (plan_name IN ('Gratis', 'Bronce', 'Plata', 'Oro'));

ALTER TABLE IF EXISTS public.tourism_services DROP CONSTRAINT IF EXISTS tourism_services_plan_tier_check;
ALTER TABLE IF EXISTS public.tourism_services ADD CONSTRAINT tourism_services_plan_tier_check CHECK (plan_tier IN ('Gratis', 'Bronce', 'Plata', 'Oro'));
