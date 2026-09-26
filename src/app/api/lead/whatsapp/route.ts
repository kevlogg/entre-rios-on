import { NextResponse, type NextRequest } from 'next/server';
import { createClient as createSupabaseJSClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { WhatsAppLeadSchema } from '@/lib/security/validation';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  // Preferir siempre la service key para bypasear RLS
  const key = serviceKey || anonKey;

  if (url && key) {
    return createSupabaseJSClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return null;
}

export async function GET(request: NextRequest) {
  // 1. Rate Limit: máximo 60 clics por minuto por IP
  const clientIp = getClientIp(request.headers);
  const rateCheck = checkRateLimit(`wa_lead:${clientIp}`, { limit: 60, windowMs: 60 * 1000 });

  if (!rateCheck.success) {
    return NextResponse.json(
      { error: 'Demasiadas peticiones. Por favor intente más tarde.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rateCheck.resetInMs / 1000)) } }
    );
  }

  // 2. Validación y parseo de parámetros
  const { searchParams } = new URL(request.url);
  const rawPhone = searchParams.get('phone') || undefined;
  const rawMsg = searchParams.get('message') || undefined;
  const rawCommerceId = searchParams.get('commerceId') || undefined;
  const rawProductId = searchParams.get('productId') || undefined;
  const rawCityId = searchParams.get('cityId') || undefined;

  const parseResult = WhatsAppLeadSchema.safeParse({
    phone: rawPhone,
    message: rawMsg,
    commerceId: rawCommerceId,
    productId: rawProductId,
    cityId: rawCityId,
  });

  const { phone, message, commerceId, productId, cityId } = parseResult.success
    ? parseResult.data
    : {
        phone: rawPhone,
        message: rawMsg,
        commerceId: rawCommerceId,
        productId: rawProductId,
        cityId: rawCityId,
      };

  // Normalizar número telefónico
  const cleanPhone = (phone || '5493434001122').replace(/\D/g, '');

  // 3. Registrar métricas en Supabase (sin bloquear el redirect)
  try {
    const adminSupabase = getAdminClient();

    if (adminSupabase && commerceId) {
      const userAgent = request.headers.get('user-agent') || 'Unknown';

      // 3a. Buscar el comercio por ID, Slug u Owner ID para obtener UUID real
      const { data: comms, error: fetchErr } = await adminSupabase
        .from('commerces')
        .select('id, whatsapp_clicks_count')
        .or(`id.eq.${commerceId},slug.eq.${commerceId},owner_id.eq.${commerceId}`)
        .limit(1);

      if (fetchErr) {
        console.error('[/api/lead/whatsapp] Error buscando comercio:', fetchErr.message, '| commerceId:', commerceId);
      }

      let realCommerceId = commerceId;

      if (comms && comms.length > 0) {
        const comm = comms[0];
        realCommerceId = comm.id;
        const nextClicks = Number(comm.whatsapp_clicks_count || 0) + 1;

        // 3b. Incrementar contador acumulado en commerces.whatsapp_clicks_count (atómico)
        const { error: updateErr } = await adminSupabase
          .from('commerces')
          .update({ whatsapp_clicks_count: nextClicks })
          .eq('id', comm.id);

        if (updateErr) {
          console.error('[/api/lead/whatsapp] Error actualizando whatsapp_clicks_count:', updateErr.message, '| commerce_id:', comm.id);
        }
      } else {
        console.warn('[/api/lead/whatsapp] Comercio no encontrado para id:', commerceId, '— insertando click sin commerce_id resuelto');
      }

      // 3c. Insertar evento individual en whatsapp_clicks (historial granular autrizable)
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(realCommerceId || '');
      const isValidProductUuid = productId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);

      const { error: insertErr } = await adminSupabase.from('whatsapp_clicks').insert({
        commerce_id: isValidUuid ? realCommerceId : null,
        product_id: isValidProductUuid ? productId : null,
        city_id: cityId || null,
        user_agent: userAgent,
      });

      if (insertErr) {
        console.error('[/api/lead/whatsapp] Error insertando en whatsapp_clicks:', insertErr.message);
      }
    } else if (!commerceId) {
      console.warn('[/api/lead/whatsapp] No se recibió commerceId — click no registrado en métricas');
    }
  } catch (err) {
    console.error('[/api/lead/whatsapp] Error inesperado registrando métrica:', err);
    // No interrumpir el flujo — el redirect SIEMPRE debe ejecutarse
  }

  // 4. Redirigir al WhatsApp (302 redirect — siempre, independientemente de errores de tracking)
  const encodedText = encodeURIComponent(message || '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return NextResponse.redirect(waUrl, 302);
}
