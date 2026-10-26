'use server';

import { headers } from 'next/headers';
import { createPlanSubscriptionPreference, getMercadoPagoSettings } from '@/lib/services/mercadopago';
import { getSubscriptionPlansAction } from '@/server/actions/superadmin';

export async function createSubscriptionPreferenceAction(
  planTier: 'BRONCE' | 'PLATA' | 'ORO',
  commerceId: string
): Promise<{ success: boolean; initPoint?: string; message: string; notConnected?: boolean }> {
  try {
    // 1. Verificar si la cuenta de Mercado Pago está conectada
    const mpSettings = await getMercadoPagoSettings();
    if (!mpSettings.connected || !mpSettings.seller_access_token) {
      return {
        success: false,
        notConnected: true,
        message: 'La cuenta oficial de cobros de Mercado Pago aún no ha sido conectada por el administrador en el panel SuperAdmin.',
      };
    }

    // 2. Obtener precios dinámicos configurados
    let price = planTier === 'ORO' ? 95000 : planTier === 'PLATA' ? 55000 : 35000;
    let planName = planTier === 'ORO' ? 'Plan Oro' : planTier === 'PLATA' ? 'Plan Plata' : 'Plan Bronce';

    try {
      const plansRes = await getSubscriptionPlansAction();
      if (plansRes.success && Array.isArray(plansRes.plans)) {
        const found = plansRes.plans.find((p) => p.id.toUpperCase() === planTier.toUpperCase());
        if (found) {
          price = found.price;
          planName = found.name;
        }
      }
    } catch (e) {
      console.warn('Error leyendo precios dinámicos para checkout:', e);
    }

    // 3. Determinar baseUrl de la solicitud
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onmasportal.com.ar';
    try {
      const headerList = await headers();
      const proto = headerList.get('x-forwarded-proto') || 'https';
      const host = headerList.get('x-forwarded-host') || headerList.get('host');
      if (host) {
        baseUrl = `${proto}://${host}`;
      }
    } catch {}

    // 4. Crear preferencia con 3% Marketplace Fee
    const result = await createPlanSubscriptionPreference({
      planTier,
      planName,
      price,
      commerceId: commerceId || 'general',
      baseUrl,
    });

    return {
      success: true,
      initPoint: result.init_point,
      message: `Checkout de Mercado Pago generado con éxito para el ${planName}.`,
    };
  } catch (err: unknown) {
    console.error('Error generando preferencia de Mercado Pago:', err);
    return {
      success: false,
      message: (err as Error).message || 'Error al conectar con la pasarela de Mercado Pago.',

    };
  }
}
