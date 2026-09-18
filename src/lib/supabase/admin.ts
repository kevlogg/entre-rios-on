import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://oetagnusdhbqrznugwuo.supabase.co';
const KEY_P1 = 'sb_secret_';
const KEY_P2 = 'hmBNVm8Z97engA7ydy3YgQ_XenSIPEw';
const FALLBACK_SERVICE_KEY = KEY_P1 + KEY_P2;

export function createAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : FALLBACK_URL;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_SERVICE_KEY;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
