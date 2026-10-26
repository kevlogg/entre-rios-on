'use server';

import { 
  getMercadoPagoSettings, 
  disconnectMercadoPago, 
  getOAuthAuthorizationUrl,
  MP_MARKETPLACE_CONFIG
} from '@/lib/services/mercadopago';
import { revalidatePath } from 'next/cache';

export async function getMercadoPagoStatusAction(): Promise<{
  success: boolean;
  connected: boolean;
  sellerId?: string | number | null;
  connectedAt?: string | null;
  clientId: string;
}> {
  try {
    const settings = await getMercadoPagoSettings();
    return {
      success: true,
      connected: settings.connected,
      sellerId: settings.seller_id,
      connectedAt: settings.connected_at,
      clientId: MP_MARKETPLACE_CONFIG.clientId,
    };
  } catch {
    return {
      success: false,
      connected: false,
      clientId: MP_MARKETPLACE_CONFIG.clientId,
    };
  }
}


export async function disconnectMercadoPagoAction(): Promise<{ success: boolean; message: string }> {
  try {
    const ok = await disconnectMercadoPago();
    if (ok) {
      revalidatePath('/superadmin');
      return { success: true, message: 'Cuenta de Mercado Pago desconectada con éxito.' };
    }
    return { success: false, message: 'No se pudo desconectar la cuenta.' };
  } catch (err: unknown) {
    return { success: false, message: (err as Error).message || 'Error al desconectar.' };
  }
}

export async function getMercadoPagoAuthUrlAction(redirectUri: string): Promise<{ success: boolean; url: string }> {
  try {
    const url = getOAuthAuthorizationUrl(redirectUri);
    return { success: true, url };
  } catch {
    return { success: false, url: '' };
  }
}

export async function connectMercadoPagoManualAction(accessToken: string): Promise<{ success: boolean; message: string }> {
  try {
    const cleanToken = (accessToken || '').trim();
    if (!cleanToken.startsWith('APP_USR-') && !cleanToken.startsWith('TEST-')) {
      return { success: false, message: 'El Access Token debe comenzar con APP_USR- (o TEST-).' };
    }

    const res = await fetch('https://api.mercadopago.com/users/me', {
      headers: { Authorization: `Bearer ${cleanToken}` },
    });
    const userData = await res.json();
    if (!res.ok || !userData.id) {
      return { success: false, message: 'El Access Token ingresado no es válido o está revocado en Mercado Pago.' };
    }

    const { saveMercadoPagoSettings } = await import('@/lib/services/mercadopago');
    const ok = await saveMercadoPagoSettings({
      connected: true,
      seller_id: userData.id,
      seller_access_token: cleanToken,
      seller_public_key: null,
      connected_at: new Date().toISOString(),
    });

    if (ok) {
      revalidatePath('/superadmin');
      return { success: true, message: `¡Cuenta oficial de Mercado Pago conectada exitosamente! (ID: ${userData.id})` };
    }
    return { success: false, message: 'No se pudo guardar la configuración en la base de datos.' };
  } catch (err: unknown) {
    return { success: false, message: (err as Error).message || 'Error al conectar manualmente.' };
  }
}

import { headers } from 'next/headers';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function createTestPaymentPreferenceAction(userEmail: string): Promise<{
  success: boolean;
  initPoint?: string;
  message: string;
}> {
  try {
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    if (cleanEmail !== 'loggia.1996@gmail.com') {
      return {
        success: false,
        message: 'No autorizado. Esta acción es exclusiva para el desarrollador.',
      };
    }

    const settings = await getMercadoPagoSettings();
    if (!settings.connected || !settings.seller_access_token) {
      return {
        success: false,
        message: 'La cuenta de Mercado Pago aún no está conectada. Tu cliente debe conectar su cuenta primero.',
      };
    }

    const client = new MercadoPagoConfig({
      accessToken: settings.seller_access_token,
      options: { timeout: 10000 },
    });

    const preference = new Preference(client);

    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onmasportal.com.ar';
    try {
      const headerList = await headers();
      const proto = headerList.get('x-forwarded-proto') || 'https';
      const host = headerList.get('x-forwarded-host') || headerList.get('host');
      if (host) baseUrl = `${proto}://${host}`;
    } catch {}

    const amount = 10; // $10 ARS
    const fee = Number((amount * 0.03).toFixed(2)); // $0.30 ARS (3%)

    const preferencePayload: Parameters<typeof preference.create>[0]['body'] = {
      items: [
        {
          id: 'test-mp-10',
          title: 'Prueba de Cobro ON MÁS ($10 ARS)',
          quantity: 1,
          currency_id: 'ARS',
          unit_price: amount,
        },
      ],
      marketplace_fee: Math.max(0.01, fee),
      external_reference: `test_payment_loggia_${Date.now()}`,
      notification_url: `${baseUrl}/api/webhook/mercadopago`,
      back_urls: {
        success: `${baseUrl}/superadmin?tab=subscription-plans&test_mp=approved`,
        failure: `${baseUrl}/superadmin?tab=subscription-plans&test_mp=failure`,
        pending: `${baseUrl}/superadmin?tab=subscription-plans&test_mp=pending`,
      },
      auto_return: 'approved',
    };

    const res = await preference.create({ body: preferencePayload });

    if (!res.id || !res.init_point) {
      return { success: false, message: 'No se pudo generar la preferencia de prueba.' };
    }

    return {
      success: true,
      initPoint: res.init_point,
      message: 'Preferencia de prueba de $10 ARS generada correctamente.',
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: (err as Error).message || 'Error al generar preferencia de prueba.',
    };
  }
}


