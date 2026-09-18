import { NextResponse, type NextRequest } from 'next/server';
import { createPublicClient } from '@/lib/supabase/public';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const rawPhone = searchParams.get('phone') || '5493447451234';
  const customMessage = searchParams.get('message') || 'Hola, vi su oferta en el portal Entre Ríos ON y me gustaría realizar una consulta.';
  const commerceId = searchParams.get('commerceId');
  const productId = searchParams.get('productId');
  const cityId = searchParams.get('cityId');

  // Normalizar número telefónico
  const cleanPhone = rawPhone.replace(/\D/g, '');

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
  const encodedText = encodeURIComponent(customMessage);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return NextResponse.redirect(waUrl, 302);
}
