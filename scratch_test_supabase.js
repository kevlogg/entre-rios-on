const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const adminSupabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function cleanup() {
  const { data, error } = await adminSupabase.from('cash_payments').delete().eq('commerce_name', 'Test Comercio');
  console.log('Cleaned up test rows:', error ? error.message : 'OK');
}

cleanup();
