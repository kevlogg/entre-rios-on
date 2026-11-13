import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // 1. Manejo de autenticación y sesión de Supabase
  const sessionResponse = await updateSession(request);

  // Si updateSession generó una redirección (ej. proteger /admin enviando a /login), respetarla
  if (
    sessionResponse.status === 307 ||
    sessionResponse.status === 308 ||
    sessionResponse.headers.get('location')
  ) {
    return sessionResponse;
  }

  const hostname = (request.headers.get('host') || request.nextUrl.hostname || '').toLowerCase();
  const pathname = request.nextUrl.pathname;

  // 2. Detección de Subdominio Comercial (tucompra.onmasportal.com.ar / tucompra.localhost)
  const isTuCompraSubdomain =
    hostname.startsWith('tucompra.') ||
    hostname.startsWith('comercial.') ||
    hostname.includes('tucompra') ||
    request.nextUrl.searchParams.get('subdomain') === 'tucompra';

  // CASO A: Estamos en el subdominio comercial (tucompra.onmasportal.com.ar)
  if (isTuCompraSubdomain) {
    // Si visita la raíz '/', reescribimos internamente a '/comercial'
    // La barra de direcciones del navegador se mantiene en 'https://tucompra.onmasportal.com.ar/'
    if (pathname === '/') {
      const url = new URL('/comercial', request.url);
      const rewriteResponse = NextResponse.rewrite(url);

      // Preservar cookies de sesión de Supabase
      sessionResponse.cookies.getAll().forEach((cookie) => {
        rewriteResponse.cookies.set(cookie.name, cookie.value);
      });

      rewriteResponse.headers.set('x-portal-mode', 'comercial');
      return rewriteResponse;
    }

    // Si escribe explícitamente '/comercial' dentro del subdominio, redirigir a '/' limpio
    if (pathname === '/comercial') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // CASO B: Estamos en el dominio principal (onmasportal.com.ar / localhost:3000)
  if (!isTuCompraSubdomain) {
    // En producción, si entra a '/comercial' desde onmasportal.com.ar, redirigir al subdominio oficial
    const isProduction =
      process.env.NODE_ENV === 'production' &&
      !hostname.includes('localhost') &&
      !hostname.includes('127.0.0.1');

    if (isProduction && pathname === '/comercial') {
      return NextResponse.redirect('https://tucompra.onmasportal.com.ar/');
    }
  }

  return sessionResponse;
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (icono de la pestaña)
     * - imágenes estáticas (/images/*)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|sw\\.js|manifest\\.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
