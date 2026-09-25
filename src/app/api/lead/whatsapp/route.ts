import { NextResponse, type NextRequest } from 'next/server';
import { createClient as createSupabaseJSClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { WhatsAppLeadSchema } from '@/lib/security/validation';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;

  if (url && key) {
    return createSupabaseJSClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return null;
}

export async function GET(request: NextRequest) {
  // 1. Verificación de Rate Limit (Máximo 60 clics por minuto por IP)
  const clientIp = getClientIp(request.headers);
  const rateCheck = checkRateLimit(`wa_lead:${clientIp}`, { limit: 60, windowMs: 60 * 1000 });

  if (!rateCheck.success) {
    return NextResponse.json(
      { error: 'Demasiadas peticiones. Por favor intente más tarde.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rateCheck.resetInMs / 1000)) } }
    );
  }

  // 2. Validación de parámetros
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

  try {
    const adminSupabase = getAdminClient();

    if (adminSupabase && commerceId) {
      const userAgent = request.headers.get('user-agent') || 'Unknown';

      // 1. Buscar comercio por ID, Slug u Owner ID
      const { data: comms } = await adminSupabase
        .from('commerces')
        .select('id, whatsapp_clicks_count')
        .or(`id.eq.${commerceId},slug.eq.${commerceId},owner_id.eq.${commerceId}`)
        .limit(1);

      if (comms && comms.length > 0) {
        const comm = comms[0];
        const nextClicks = Number(comm.whatsapp_clicks_count || 0) + 1;

        // 2. Incrementar acumulativo en la fila del comercio
        const { error: updateErr } = await adminSupabase
          .from('commerces')
          .update({ whatsapp_clicks_count: nextClicks })
          .eq('id', comm.id);

        if (updateErr) {
          console.warn('Error incrementando whatsapp_clicks_count:', updateErr.message);
        }

        // 3. Registrar el evento individual en la tabla whatsapp_clicks
        const { error: insertErr } = await adminSupabase.from('whatsapp_clicks').insert({
          commerce_id: comm.id,
          product_id: productId || null,
          city_id: cityId || null,
          user_agent: userAgent,
        });

        if (insertErr) {
          console.warn('Note on whatsapp_clicks insert:', insertErr.message);
        }
      } else {
        // Fallback insert si no encontró coincidencia directa
        await adminSupabase.from('whatsapp_clicks').insert({
          commerce_id: commerceId,
          product_id: productId || null,
          city_id: cityId || null,
          user_agent: userAgent,
        });
      }
    }
  } catch (err) {
    console.warn('Error registrando lead de WhatsApp en API:', err);
  }

  // Generar enlace de WhatsApp y redirigir 302
  const encodedText = encodeURIComponent(message || '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return NextResponse.redirect(waUrl, 302);
}
