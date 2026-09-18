import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://oetagnusdhbqrznugwuo.supabase.co';

export function createAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : FALLBACK_URL;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
