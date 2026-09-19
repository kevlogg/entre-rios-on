import { NextResponse, type NextRequest } from 'next/server';
import { createPublicClient } from '@/lib/supabase/public';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { ViewLeadSchema } from '@/lib/security/validation';

export async function GET(request: NextRequest) {
  // 1. Verificación de Rate Limit (Máximo 30 vistas por minuto por IP)
  const clientIp = getClientIp(request.headers);
  const rateCheck = checkRateLimit(`view_lead:${clientIp}`, { limit: 30, windowMs: 60 * 1000 });

  if (!rateCheck.success) {
    return NextResponse.json(
      { success: false, message: 'Demasiadas peticiones. Por favor intente más tarde.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rateCheck.resetInMs / 1000)) } }
    );
  }

  // 2. Validación de parámetros con Zod
  const { searchParams } = new URL(request.url);
  const parseResult = ViewLeadSchema.safeParse({
    commerceId: searchParams.get('commerceId') || '',
  });

  if (!parseResult.success) {
    return NextResponse.json({ success: false, message: 'Falta commerceId o formato inválido' }, { status: 400 });
  }

  const { commerceId } = parseResult.data;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = createPublicClient();

      // Buscar comercio por ID o Slug
      const { data: comm } = await supabase
        .from('commerces')
        .select('id, views_count, review_count')
        .or(`id.eq.${commerceId},slug.eq.${commerceId}`)
        .maybeSingle();

      if (comm) {
        const currentViews = Number(comm.views_count || comm.review_count || 0);
        const nextViews = currentViews + 1;

        await supabase
          .from('commerces')
          .update({
            views_count: nextViews,
            review_count: nextViews,
          })
          .eq('id', comm.id);

        return NextResponse.json({ success: true, views: nextViews });
      }
    }
    return NextResponse.json({ success: true, message: 'Modo demostración o sin BD' });
  } catch (err) {
    console.warn('Error registrando vista de perfil en API:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
