import { NextResponse } from 'next/server';
import { exchangeCodeForTokens, saveMercadoPagoSettings } from '@/lib/services/mercadopago';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  const protocol = req.headers.get('x-forwarded-proto') || 'https';
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'onmasportal.com.ar';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
  const superAdminUrl = `${baseUrl}/superadmin?tab=subscription-plans`;

  if (error || !code) {
    console.warn('[MercadoPago OAuth] Error o código faltante:', error);
    return NextResponse.redirect(`${superAdminUrl}&mp_error=${encodeURIComponent(error || 'missing_code')}`);
  }

  try {
    const redirectUri = process.env.MP_REDIRECT_URI || `${baseUrl}/api/superadmin/mp/callback`;

    console.log('[MercadoPago OAuth] Intercambiando código con redirectUri:', redirectUri);
    const data = await exchangeCodeForTokens(code, redirectUri);

    await saveMercadoPagoSettings({
      connected: true,
      seller_id: data.user_id || null,
      seller_access_token: data.access_token,
      seller_public_key: data.public_key || null,
      refresh_token: data.refresh_token || null,
      token_type: data.token_type || 'bearer',
      expires_in: data.expires_in || null,
      scope: data.scope || null,
      connected_at: new Date().toISOString(),
    });

    console.log('[MercadoPago OAuth] Cuenta conectada exitosamente. Seller ID:', data.user_id);
    return NextResponse.redirect(`${superAdminUrl}&mp_connected=true`);
  } catch (err: any) {
    console.error('[MercadoPago OAuth] Error en callback:', err);
    return NextResponse.redirect(`${superAdminUrl}&mp_error=${encodeURIComponent(err.message || 'server_error')}`);
  }
}
