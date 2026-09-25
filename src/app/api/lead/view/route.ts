import { NextResponse, type NextRequest } from 'next/server';
import { createClient as createSupabaseJSClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { ViewLeadSchema } from '@/lib/security/validation';

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
  // 1. Verificación de Rate Limit (Máximo 60 vistas por minuto por IP)
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

  const parseResult = ViewLeadSchema.safeParse({
    commerceId: rawCommerceId,
  });

  if (!parseResult.success) {
    return NextResponse.json({ success: false, message: 'Falta commerceId o formato inválido' }, { status: 400 });
  }

  const { commerceId } = parseResult.data;

  try {
    const adminSupabase = getAdminClient();

    if (adminSupabase) {
      // Buscar comercio por ID, Slug u Owner ID
      const { data: comms, error: fetchErr } = await adminSupabase
        .from('commerces')
        .select('id, views_count, review_count')
        .or(`id.eq.${commerceId},slug.eq.${commerceId},owner_id.eq.${commerceId}`)
        .limit(1);

      if (fetchErr) {
        console.warn('Error buscando comercio para registrar vista:', fetchErr.message);
      }

      if (comms && comms.length > 0) {
        const comm = comms[0];
        const currentViews = Number(comm.views_count || comm.review_count || 0);
        const nextViews = currentViews + 1;

        const { error: updateErr } = await adminSupabase
          .from('commerces')
          .update({
            views_count: nextViews,
            review_count: nextViews,
          })
          .eq('id', comm.id);

        if (updateErr) {
          console.warn('Error actualizando vistas en Supabase:', updateErr.message);
        }

        return NextResponse.json({ success: true, views: nextViews, commerceId: comm.id });
      }
    }

    return NextResponse.json({ success: true, message: 'Vista procesada (Modo simulación o comercio no encontrado)' });
  } catch (err) {
    console.warn('Error registrando vista de perfil en API:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
