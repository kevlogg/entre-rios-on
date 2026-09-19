import { NextResponse, type NextRequest } from 'next/server';
import { createPublicClient } from '@/lib/supabase/public';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';
import { WhatsAppLeadSchema } from '@/lib/security/validation';

export async function GET(request: NextRequest) {
  // 1. Verificación de Rate Limit (Máximo 20 clics por minuto por IP)
  const clientIp = getClientIp(request.headers);
  const rateCheck = checkRateLimit(`wa_lead:${clientIp}`, { limit: 20, windowMs: 60 * 1000 });

  if (!rateCheck.success) {
    return NextResponse.json(
      { error: 'Demasiadas peticiones. Por favor intente más tarde.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rateCheck.resetInMs / 1000)) } }
    );
  }

  // 2. Validación de parámetros con Zod
  const { searchParams } = new URL(request.url);
  const parseResult = WhatsAppLeadSchema.safeParse({
    phone: searchParams.get('phone') || undefined,
    message: searchParams.get('message') || undefined,
    commerceId: searchParams.get('commerceId') || undefined,
    productId: searchParams.get('productId') || undefined,
    cityId: searchParams.get('cityId') || undefined,
  });

  if (!parseResult.success) {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
  }

  const { phone, message, commerceId, productId, cityId } = parseResult.data;

  // Normalizar número telefónico
  const cleanPhone = (phone || '5493447451234').replace(/\D/g, '');

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = createPublicClient();
      const userAgent = request.headers.get('user-agent') || 'Unknown';

      // 1. Insertar el evento de lead en whatsapp_clicks
      await supabase.from('whatsapp_clicks').insert({
        commerce_id: commerceId || null,
        product_id: productId || null,
        city_id: cityId || null,
        user_agent: userAgent,
      });

      // 2. Si hay commerceId, incrementar whatsapp_clicks_count acumulativo en commerces
      if (commerceId) {
        const { data: comm } = await supabase
          .from('commerces')
          .select('id, whatsapp_clicks_count')
          .or(`id.eq.${commerceId},slug.eq.${commerceId}`)
          .maybeSingle();

        if (comm) {
          const nextClicks = Number(comm.whatsapp_clicks_count || 0) + 1;
          await supabase
            .from('commerces')
            .update({ whatsapp_clicks_count: nextClicks })
            .eq('id', comm.id);
        }
      }
    }
  } catch (err) {
    console.warn('Error registrando lead de WhatsApp en Supabase:', err);
  }

  // Generar enlace seguro de WhatsApp Web / App
  const encodedText = encodeURIComponent(message || '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return NextResponse.redirect(waUrl, 302);
}
