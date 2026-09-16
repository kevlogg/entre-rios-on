import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const rawPhone = searchParams.get('phone') || '5493447451234';
  const customMessage = searchParams.get('message') || 'Hola, vi su oferta en el portal Entre Ríos ON y me gustaría realizar una consulta.';
  const commerceId = searchParams.get('commerceId');
  const productId = searchParams.get('productId');
  const cityId = searchParams.get('cityId');

  // Normalizar número telefónico (remover espacios, guiones y signos)
  const cleanPhone = rawPhone.replace(/\D/g, '');

  // Intentar registrar la métrica del lead en Supabase si está activo
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();
      const userAgent = request.headers.get('user-agent') || 'Unknown';

      await supabase.from('whatsapp_clicks').insert({
        commerce_id: commerceId || null,
        product_id: productId || null,
        city_id: cityId || null,
        user_agent: userAgent,
      });
    }
  } catch (err) {
    console.warn('Error registrando lead de WhatsApp en Supabase:', err);
  }

  // Generar enlace seguro de WhatsApp Web / App
  const encodedText = encodeURIComponent(customMessage);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return NextResponse.redirect(waUrl, 302);
}
