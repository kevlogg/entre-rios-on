import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let publicClientInstance: ReturnType<typeof createSupabaseClient> | null = null;

export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '[createPublicClient] Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y/o NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  // En el browser usamos un singleton con persistSession: false para no interferir
  // con la sesión principal de auth ni duplicar instancias de GoTrueClient en el storage.
  if (typeof window !== 'undefined') {
    if (!publicClientInstance) {
      publicClientInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });
    }
    return publicClientInstance;
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
