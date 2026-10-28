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

    // 1b. Verificar si es un alta nueva y si el tramo KevDev está bloqueado
    try {
      const lifecycleRes = await getCommerceSubscriptionLifecycleAction(commerceId);
      const isAlreadyActive = lifecycleRes.success && lifecycleRes.lifecycle?.isActive;
      if (!isAlreadyActive) {
        const { getKevDevTierStatusAction } = await import('@/server/actions/superadmin');
        const tierStatus = await getKevDevTierStatusAction();
        if (tierStatus.isRegistrationLocked) {
          return {
            success: false,
            message: 'El cupo de comercios activos para el tramo actual ha sido alcanzado. Por favor, hablá con Soporte para activar tu comercio.',
          };
        }
      }
    } catch (e) {
      console.warn('Note checking tier status for MP preference:', e);
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

import { createAdminClient } from '@/lib/supabase/admin';
import { calculateSubscriptionLifecycle, SubscriptionLifecycle } from '@/lib/services/subscription-lifecycle';

export async function getCommerceSubscriptionLifecycleAction(
  commerceId: string,
  commerceName?: string
): Promise<{
  success: boolean;
  lifecycle: SubscriptionLifecycle | null;
  message?: string;
}> {
  try {
    const adminSupabase = createAdminClient();
    if (!adminSupabase) {
      return { success: false, lifecycle: null, message: 'Sin conexión a base de datos' };
    }

    // 1. Obtener comercio
    const cleanId = (commerceId || '').replace(/^comm-/, '');
    const { data: comm } = await adminSupabase
      .from('commerces')
      .select('*')
      .or(`id.eq.${commerceId},slug.eq.${cleanId},slug.eq.${commerceId}`)
      .maybeSingle();

    if (!comm) {
      return { success: false, lifecycle: null, message: 'Comercio no encontrado' };
    }

    // 2. Obtener último pago aprobado en cash_payments
    let latestPayment: { created_at: string; amount?: number; plan_name?: string } | null = null;
    const nameToMatch = (comm.name || commerceName || '').trim();
    const phoneToMatch = (comm.phone_whatsapp || '').replace(/[^\d]/g, '');

    if (nameToMatch) {
      const { data: payments } = await adminSupabase
        .from('cash_payments')
        .select('*')
        .eq('status', 'APPROVED')
        .ilike('commerce_name', `%${nameToMatch}%`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (payments && payments.length > 0) {
        latestPayment = {
          created_at: payments[0].created_at,
          amount: Number(payments[0].amount || 0),
          plan_name: payments[0].plan_name,
        };
      }
    }

    if (!latestPayment && phoneToMatch && phoneToMatch.length >= 6) {
      const { data: paymentsByPhone } = await adminSupabase
        .from('cash_payments')
        .select('*')
        .eq('status', 'APPROVED')
        .ilike('phone_whatsapp', `%${phoneToMatch.slice(-8)}%`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (paymentsByPhone && paymentsByPhone.length > 0) {
        latestPayment = {
          created_at: paymentsByPhone[0].created_at,
          amount: Number(paymentsByPhone[0].amount || 0),
          plan_name: paymentsByPhone[0].plan_name,
        };
      }
    }

    // 3. Calcular lifecycle de 30 días
    const lifecycle = calculateSubscriptionLifecycle(comm, latestPayment);

    // 4. Si el ciclo venció (> 30 días) y figuraba activo en DB, pausarlo automáticamente
    if (lifecycle.isExpired && comm.is_subscription_active === true) {
      await adminSupabase
        .from('commerces')
        .update({
          is_subscription_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', comm.id);
      console.log(`[Subscription Lifecycle] Comercio ${comm.name} (${comm.id}) pausado automáticamente por vencimiento de ciclo de 30 días.`);
    }

    return {
      success: true,
      lifecycle,
    };
  } catch (err: unknown) {
    return {
      success: false,
      lifecycle: null,
      message: (err as Error).message || 'Error al verificar ciclo de suscripción',
    };
  }
}

