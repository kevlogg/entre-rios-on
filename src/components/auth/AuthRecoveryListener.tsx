'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function AuthRecoveryListener() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Detectar si la URL contiene el fragmento de recuperación (#access_token=...&type=recovery)
    const checkHashForRecovery = () => {
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        if (pathname !== '/login') {
          // Redirigir a /login?mode=reset preservando el hash para que Supabase establezca la sesión
          window.location.href = `/login?mode=reset${hash}`;
        }
      }
    };

    checkHashForRecovery();

    // 2. Escuchar evento PASSWORD_RECOVERY emitido por Supabase Auth
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        if (pathname !== '/login') {
          window.location.href = '/login?mode=reset';
        }
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [pathname]);

  return null;
}
