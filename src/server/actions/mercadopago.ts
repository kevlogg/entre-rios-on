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

