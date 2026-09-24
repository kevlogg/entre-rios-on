const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const adminSupabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const anonSupabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkAll() {
  console.log('=== CHECKING WEB_REQUESTS (ADMIN) ===');
  const { data: webAdmin, error: webAdminErr } = await adminSupabase.from('web_requests').select('*');
  console.log('web_requests error:', webAdminErr);
  console.log('web_requests count:', webAdmin ? webAdmin.length : 0);
  console.log('web_requests rows:', JSON.stringify(webAdmin, null, 2));

  console.log('=== CHECKING CASH_PAYMENTS (ADMIN) ===');
  const { data: cashAdmin, error: cashAdminErr } = await adminSupabase.from('cash_payments').select('*');
  console.log('cash_payments error:', cashAdminErr);
  console.log('cash_payments count:', cashAdmin ? cashAdmin.length : 0);
  console.log('cash_payments rows:', JSON.stringify(cashAdmin, null, 2));
}

checkAll();
