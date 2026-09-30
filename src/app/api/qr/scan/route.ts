import { NextResponse, type NextRequest } from 'next/server';
import { createClient as createSupabaseJSClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;

  if (url && key) {
    return createSupabaseJSClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return null;
}

// In-memory fallback tracking map for local dev/preview
const localScanStore: Record<string, { count: number; lastScanned: string; devices: Record<string, number> }> = {};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const targetUrl = searchParams.get('url') || searchParams.get('target') || 'https://onmasportal.com.ar';

  // -------------------------------------------------------------
  // MODO 1: Consultar estadísticas de escaneos para una URL (API Stats)
  // -------------------------------------------------------------
  if (action === 'stats') {
    try {
      const adminSupabase = getAdminClient();
      let realCount = 0;
      let lastScannedAt: string | null = null;
      let androidCount = 0;
      let iosCount = 0;

      if (adminSupabase) {
        // Consultar conteo exacto en la tabla qr_scans de Supabase
        const { count, data } = await adminSupabase
          .from('qr_scans')
          .select('*', { count: 'exact' })
          .eq('target_url', targetUrl)
          .order('created_at', { ascending: false })
          .limit(10);

        if (count !== null && count > 0) {
          realCount = count;
          lastScannedAt = data?.[0]?.created_at || null;

          // Desglose básico de dispositivos
          data?.forEach((row: any) => {
            const ua = (row.user_agent || '').toLowerCase();
            if (ua.includes('android')) androidCount++;
            else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('macintosh')) iosCount++;
          });
        }
      }

      // Fallback a almacenamiento local si no hay datos en BD aún
      const localData = localScanStore[targetUrl] || { count: 0, lastScanned: '', devices: {} };
      const finalCount = Math.max(realCount, localData.count);

      return NextResponse.json({
        success: true,
        targetUrl,
        totalScans: finalCount,
        lastScannedAt: lastScannedAt || localData.lastScanned || null,
        devices: {
          android: androidCount || localData.devices['android'] || 0,
          ios: iosCount || localData.devices['ios'] || 0,
        },
      });
    } catch (err) {
      console.warn('[/api/qr/scan] Error obteniendo estadísticas:', err);
      return NextResponse.json({
        success: true,
        targetUrl,
        totalScans: localScanStore[targetUrl]?.count || 0,
        lastScannedAt: localScanStore[targetUrl]?.lastScanned || null,
      });
    }
  }

  // -------------------------------------------------------------
  // MODO 2: Escaneo físico del QR -> Registrar evento y redirigir
  // -------------------------------------------------------------
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const ipHash = Buffer.from(clientIp).toString('base64').slice(0, 16);
  const isAndroid = userAgent.toLowerCase().includes('android');
  const isIos = userAgent.toLowerCase().includes('iphone') || userAgent.toLowerCase().includes('ipad');

  // Registrar en memoria local
  if (!localScanStore[targetUrl]) {
    localScanStore[targetUrl] = { count: 0, lastScanned: '', devices: { android: 0, ios: 0 } };
  }
  localScanStore[targetUrl].count += 1;
  localScanStore[targetUrl].lastScanned = new Date().toISOString();
  if (isAndroid) localScanStore[targetUrl].devices['android'] = (localScanStore[targetUrl].devices['android'] || 0) + 1;
  if (isIos) localScanStore[targetUrl].devices['ios'] = (localScanStore[targetUrl].devices['ios'] || 0) + 1;

  // Registrar evento exacto en Supabase
  try {
    const adminSupabase = getAdminClient();
    if (adminSupabase) {
      adminSupabase.from('qr_scans').insert({
        target_url: targetUrl,
        user_agent: userAgent,
        ip_hash: ipHash,
        created_at: new Date().toISOString(),
      }).then(({ error }) => {
        if (error) console.warn('[/api/qr/scan] Supabase insert note:', error.message);
      });
    }
  } catch (e) {
    console.warn('[/api/qr/scan] Tracking async note:', e);
  }

  // Redireccionar al destino elegido sin demora (302 Redirect)
  const safeRedirectUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
  return NextResponse.redirect(safeRedirectUrl, 302);
}
