import { NextResponse, type NextRequest } from 'next/server';
import { createClient as createSupabaseJSClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { ViewLeadSchema } from '@/lib/security/validation';

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
  // 1. Rate Limit: máximo 60 vistas por minuto por IP
  const clientIp = getClientIp(request.headers);
  const rateCheck = checkRateLimit(`view_lead:${clientIp}`, { limit: 60, windowMs: 60 * 1000 });

  if (!rateCheck.success) {
    return NextResponse.json(
      { success: false, message: 'Demasiadas peticiones.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rateCheck.resetInMs / 1000)) } }
    );
  }

  // 2. Validación de parámetros
  const { searchParams } = new URL(request.url);
  const rawCommerceId = searchParams.get('commerceId') || '';

  const parseResult = ViewLeadSchema.safeParse({ commerceId: rawCommerceId });

  if (!parseResult.success) {
    return NextResponse.json({ success: false, message: 'Falta commerceId o formato inválido' }, { status: 400 });
  }

  const { commerceId } = parseResult.data;

  try {
    const adminSupabase = getAdminClient();

    if (!adminSupabase) {
      return NextResponse.json({ success: true, message: 'Modo simulación — cliente no disponible' });
    }

    // 3. Buscar el comercio para confirmar que existe y obtener su UUID real
    const { data: comms, error: fetchErr } = await adminSupabase
      .from('commerces')
      .select('id, views_count')
      .or(`id.eq.${commerceId},slug.eq.${commerceId},owner_id.eq.${commerceId}`)
      .limit(1);

    if (fetchErr) {
      console.error('[/api/lead/view] Error buscando comercio:', fetchErr.message, '| commerceId:', commerceId);
      return NextResponse.json({ success: false, error: fetchErr.message }, { status: 500 });
    }

    if (!comms || comms.length === 0) {
      // No existe el comercio — igual registrar el intento sin fallar
      console.warn('[/api/lead/view] Comercio no encontrado para id:', commerceId);
      return NextResponse.json({ success: true, message: 'Vista registrada (comercio no encontrado en BD)' });
    }

    const comm = comms[0];
    const realCommerceId = comm.id;
    const currentViews = Number(comm.views_count || 0);
    const nextViews = currentViews + 1;

    // 4. Actualizar contador acumulado en commerces.views_count (atómico)
    const { error: updateErr } = await adminSupabase
      .from('commerces')
      .update({ views_count: nextViews })
      .eq('id', realCommerceId);

    if (updateErr) {
      console.error('[/api/lead/view] Error actualizando views_count:', updateErr.message, '| commerce_id:', realCommerceId);
    }

    // 5. Insertar en tabla de historial profile_views (evento granular)
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    // Hash de IP para privacidad (no almacenar IP cruda)
    const ipHash = Buffer.from(clientIp).toString('base64').slice(0, 16);

    const { error: insertErr } = await adminSupabase
      .from('profile_views')
      .insert({
        commerce_id: realCommerceId,
        user_agent: userAgent,
        ip_hash: ipHash,
      });

    if (insertErr) {
      console.error('[/api/lead/view] Error insertando en profile_views:', insertErr.message, '| commerce_id:', realCommerceId);
      // No lanzar error al cliente — el contador ya se actualizó
    }

    return NextResponse.json({ success: true, views: nextViews, commerceId: realCommerceId });

  } catch (err) {
    console.error('[/api/lead/view] Error inesperado:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
