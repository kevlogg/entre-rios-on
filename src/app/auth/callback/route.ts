import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  let next = requestUrl.searchParams.get('next') ?? '/admin';
  const type = requestUrl.searchParams.get('type');
  const mode = requestUrl.searchParams.get('mode');

  // Si es recuperación de contraseña o 'mode=reset', dirigir al formulario de nueva contraseña
  if (type === 'recovery' || mode === 'reset') {
    next = '/login?mode=reset';
  } else if (mode && !next.includes('mode=')) {
    next += (next.includes('?') ? '&' : '?') + `mode=${encodeURIComponent(mode)}`;
  }

  // Detectar el origen real del host respetando proxies y balanceadores de carga (ej. Vercel)
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
  const isLocalEnv = process.env.NODE_ENV === 'development';

  const origin = (!isLocalEnv && forwardedHost)
    ? `${forwardedProto}://${forwardedHost}`
    : requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error('Error al intercambiar código por sesión en callback:', error);
  }

  // Redirigir a login con parámetro de error amigable en caso de fallo
  return NextResponse.redirect(`${origin}/login?error=auth-failed`);
}
