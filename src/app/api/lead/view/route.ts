import { NextResponse, type NextRequest } from 'next/server';
import { createPublicClient } from '@/lib/supabase/public';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const commerceId = searchParams.get('commerceId');

  if (!commerceId) {
    return NextResponse.json({ success: false, message: 'Falta commerceId' }, { status: 400 });
  }

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
