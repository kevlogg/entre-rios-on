import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const pathname = request.nextUrl.pathname;

  // 1. Rutas de SuperAdmin: No requieren sesión de Supabase del sitio comercial (tienen su propia autenticación exclusiva)
  if (pathname.startsWith('/superadmin')) {
    return supabaseResponse;
  }

  // Las rutas públicas (incluida la start_url '/' de la PWA instalada) NO dependen de la sesión:
  // evitamos una llamada de red a Supabase que, si falla o tarda, deja la app trabada en el splash.
  const needsSession = pathname.startsWith('/admin') || pathname.startsWith('/login');
  if (!needsSession) {
    return supabaseResponse;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[updateSession] Faltan variables de entorno de Supabase.');
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresca la sesión si ha expirado (si Supabase falla, nunca bloquea la carga de la página)
  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'] = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch (err) {
    console.error('[updateSession] Error consultando sesión de Supabase:', err);
  }

  // 2. Protege las rutas de /admin
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

