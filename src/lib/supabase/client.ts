import { createBrowserClient } from '@supabase/ssr';

const FALLBACK_URL = 'https://oetagnusdhbqrznugwuo.supabase.co';
const FALLBACK_KEY = 'sb_publishable_5M-Ivho089HyL1LF-5V3oA_hpv6d54V';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')
    ? process.env.NEXT_PUBLIC_SUPABASE_URL
    : FALLBACK_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
