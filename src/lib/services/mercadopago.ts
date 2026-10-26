import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createAdminClient } from '@/lib/supabase/admin';


export interface MercadoPagoSettings {
  connected: boolean;
  seller_id?: number | string | null;
  seller_access_token?: string | null;
  seller_public_key?: string | null;
  refresh_token?: string | null;
  token_type?: string | null;
  expires_in?: number | null;
  scope?: string | null;
  connected_at?: string | null;
  updated_at?: string | null;
}

export const MP_MARKETPLACE_CONFIG = {
  clientId: process.env.MP_MARKETPLACE_CLIENT_ID || '5679645126166390',
  clientSecret: process.env.MP_MARKETPLACE_CLIENT_SECRET || '6aLpgSVKIoX6DUfihemWduf6Mi9trINV',
  platformFeePercentage: 0.03, // 3% comisión de plataforma para el desarrollador
};

/**
 * Obtiene la configuración de Mercado Pago conectada desde Supabase
 */
export async function getMercadoPagoSettings(): Promise<MercadoPagoSettings> {
  try {
    const adminSupabase = createAdminClient();

    // Almacenamiento persistente en Supabase (tabla province_configs con id 'config_mercadopago')
    const { data, error } = await adminSupabase
      .from('province_configs')
      .select('*')
      .eq('id', 'config_mercadopago')
      .maybeSingle();

    if (error || !data || !data.banner_desktop) {
      return { connected: false };
    }

    const settings: MercadoPagoSettings = JSON.parse(data.banner_desktop);
    return {
      ...settings,
      connected: !!(settings.connected && settings.seller_access_token),
    };
  } catch (err) {
    console.warn('[MercadoPago] Error al consultar configuración:', err);
    return { connected: false };
  }
}

/**
 * Guarda o actualiza los datos de la cuenta de Mercado Pago conectada
 */
export async function saveMercadoPagoSettings(settings: Partial<MercadoPagoSettings>): Promise<boolean> {
  try {
    const adminSupabase = createAdminClient();

    if (!adminSupabase) return false;

    const current = await getMercadoPagoSettings();
    const updated: MercadoPagoSettings = {
      ...current,
      ...settings,
      updated_at: new Date().toISOString(),
    };

    const { error } = await adminSupabase
      .from('province_configs')
      .upsert({
        id: 'config_mercadopago',
        name: 'Configuración Oficial Mercado Pago ON MÁS',
        banner_desktop: JSON.stringify(updated),
        banner_mobile: 'mercadopago_oauth',
        text_color: '#0047BA',
        button_bg_color: '#009EE3',
        card_accent_color: '#00E5E8',
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('[MercadoPago] Error guardando configuración en Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[MercadoPago] Error al guardar configuración:', err);
    return false;
  }
}

/**
 * Desconecta la cuenta de Mercado Pago actual
 */
export async function disconnectMercadoPago(): Promise<boolean> {
  return saveMercadoPagoSettings({
    connected: false,
    seller_access_token: null,
    seller_public_key: null,
    refresh_token: null,
    seller_id: null,
  });
}

/**
 * Genera la URL de autorización OAuth para que el cliente conecte su cuenta
 */
export function getOAuthAuthorizationUrl(redirectUri: string): string {
  const clientId = MP_MARKETPLACE_CONFIG.clientId;
  return `https://auth.mercadopago.com/authorization?client_id=${clientId}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(redirectUri)}`;
}

/**
 * Intercambia el código devuelto por OAuth por los tokens del vendedor
 */
export async function exchangeCodeForTokens(code: string, redirectUri: string) {
  const res = await fetch('https://api.mercadopago.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: MP_MARKETPLACE_CONFIG.clientId,
      client_secret: MP_MARKETPLACE_CONFIG.clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.access_token) {
    throw new Error(data.message || data.error || 'Fallo el intercambio de código OAuth con Mercado Pago');
  }

  return data;
}

/**
 * Crea una preferencia de pago para la suscripción de un comercio aplicando el 3% de Marketplace Fee
 */
export async function createPlanSubscriptionPreference(params: {
  planTier: 'BRONCE' | 'PLATA' | 'ORO';
  planName: string;
  price: number;
  commerceId: string;
  baseUrl: string;
}): Promise<{ id: string; init_point: string }> {
  const settings = await getMercadoPagoSettings();

  if (!settings.connected || !settings.seller_access_token) {
    throw new Error('La cuenta de Mercado Pago de ON MÁS aún no ha sido conectada por el administrador.');
  }

  const client = new MercadoPagoConfig({
    accessToken: settings.seller_access_token,
    options: { timeout: 10000 },
  });

  const preference = new Preference(client);

  const priceNum = Math.max(1, Number(params.price));
  // Comisión del 3% a tu billetera Mercado Pago (precisión a 2 decimales)
  const calculatedFee = Number((priceNum * MP_MARKETPLACE_CONFIG.platformFeePercentage).toFixed(2));
  const marketplaceFee = Math.max(0.01, calculatedFee);

  const preferencePayload: Parameters<typeof preference.create>[0]['body'] = {
    items: [
      {
        id: `plan-${params.planTier.toLowerCase()}`,
        title: `Suscripción ON MÁS - ${params.planName}`,
        quantity: 1,
        currency_id: 'ARS',
        unit_price: priceNum,
      },
    ],
    marketplace_fee: marketplaceFee,
    external_reference: `sub_${params.commerceId}_${params.planTier}_${Date.now()}`,
    notification_url: `${params.baseUrl}/api/webhook/mercadopago`,
    back_urls: {
      success: `${params.baseUrl}/admin?tab=subscription&mp_status=approved`,
      failure: `${params.baseUrl}/admin?tab=subscription&mp_status=failure`,
      pending: `${params.baseUrl}/admin?tab=subscription&mp_status=pending`,
    },
    auto_return: 'approved',
  };

  const result = await preference.create({
    body: preferencePayload,
  });

  if (!result.id || !result.init_point) {
    throw new Error('No se pudo generar el checkout de Mercado Pago.');
  }

  return {
    id: result.id,
    init_point: result.init_point,
  };
}
