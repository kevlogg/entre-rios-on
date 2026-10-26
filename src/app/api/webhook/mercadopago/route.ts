import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { getMercadoPagoSettings } from '@/lib/services/mercadopago';
import { createAdminClient } from '@/lib/supabase/admin';


export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { type, data, action } = body;
    const paymentId = (data && data.id) || searchParams.get('data.id') || searchParams.get('id');
    const eventType = type || searchParams.get('type') || action;

    if (!paymentId || (eventType !== 'payment' && !eventType?.startsWith('payment.'))) {
      return NextResponse.json({ message: 'Evento no relevante para pagos, ignorado.' });
    }

    const settings = await getMercadoPagoSettings();
    if (!settings.connected || !settings.seller_access_token) {
      console.warn('[MercadoPago Webhook] Cuenta no conectada en settings, no se puede verificar pago:', paymentId);
      return NextResponse.json({ message: 'Settings de MP no configuradas' }, { status: 200 });
    }

    const client = new MercadoPagoConfig({
      accessToken: settings.seller_access_token,
      options: { timeout: 10000 },
    });

    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: String(paymentId) });

    console.log(`[MercadoPago Webhook] Pago ${paymentId} status: ${paymentInfo.status}, external_reference: ${paymentInfo.external_reference}`);

    if (paymentInfo.status === 'approved' && paymentInfo.external_reference) {
      const extRef = paymentInfo.external_reference; // formato: sub_{commerceId}_{planTier}_{timestamp}
      const parts = extRef.split('_');

      if (parts[0] === 'sub' && parts.length >= 3) {
        const rawCommerceId = parts[1];
        const planTier = (parts[2] || 'BRONCE').toUpperCase(); // BRONCE, PLATA, ORO
        const cleanPlanName = planTier === 'ORO' ? 'Oro' : planTier === 'PLATA' ? 'Plata' : 'Bronce';

        const adminSupabase = createAdminClient();
        if (adminSupabase) {

          // 1. Obtener y actualizar el comercio en Supabase
          const cleanId = rawCommerceId.replace(/^comm-/, '');
          const { data: comm } = await adminSupabase
            .from('commerces')
            .select('*')
            .or(`id.eq.${rawCommerceId},id.eq.${cleanId},slug.eq.${cleanId},slug.eq.${rawCommerceId}`)
            .maybeSingle();

          if (comm) {
            await adminSupabase
              .from('commerces')
              .update({
                is_subscription_active: true,
                subscription_tier: planTier,
                updated_at: new Date().toISOString(),
              })
              .eq('id', comm.id);
            console.log(`[MercadoPago Webhook] Comercio ${comm.name} (${comm.id}) activado con Plan ${planTier}`);
          }

          // 2. Registrar en cash_payments como pago aprobado oficial
          await adminSupabase.from('cash_payments').insert({
            commerce_name: comm?.name || `Comercio ${rawCommerceId}`,
            owner_name: `Mercado Pago Checkout (Pago ID: ${paymentId})`,
            phone_whatsapp: comm?.phone_whatsapp || 'Sin teléfono',
            plan_name: cleanPlanName,
            amount: paymentInfo.transaction_amount || 0,
            city_name: comm?.city_name || 'Entre Ríos / Santa Fe',
            status: 'APPROVED',
            notes: `Procesado automáticamente vía Mercado Pago Checkout Pro. ID Transacción: ${paymentId}`,
          });


          console.log(`[MercadoPago Webhook] Registro de pago insertado en cash_payments con status APPROVED.`);
        }
      }
    }

    return NextResponse.json({ success: true, paymentId, status: paymentInfo.status });
  } catch (error: any) {
    console.error('[MercadoPago Webhook] Error procesando notificación:', error);
    // Devolvemos 200 para evitar que Mercado Pago reintente en bucle en caso de error interno
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}
