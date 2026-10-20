import { NextResponse, type NextRequest } from 'next/server';
import { createClient as createSupabaseJSClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';

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

// In-memory cache for fast read/increment
let viewsCache: Record<string, number> | null = null;
let lastSyncTime = 0;
const SYNC_INTERVAL = 10000; // sync every 10 seconds

async function loadProductViewsFromStorage(client: any): Promise<Record<string, number>> {
  if (viewsCache && Date.now() - lastSyncTime < SYNC_INTERVAL) {
    return viewsCache;
  }
  try {
    const { data, error } = await client.storage.from('commerces').download('config/product_views.json');
    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') {
        viewsCache = parsed;
        lastSyncTime = Date.now();
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error loading product views from storage:', e);
  }
  if (!viewsCache) viewsCache = {};
  return viewsCache;
}

async function saveProductViewsToStorage(client: any, views: Record<string, number>) {
  try {
    const buffer = Buffer.from(JSON.stringify(views, null, 2));
    await client.storage.from('commerces').upload('config/product_views.json', buffer, {
      contentType: 'application/json',
      upsert: true,
    });
  } catch (e) {
    console.warn('Error saving product views to storage:', e);
  }
}

export async function GET(request: NextRequest) {
  const clientIp = getClientIp(request.headers);
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId') || searchParams.get('slug') || '';

  if (!productId) {
    return NextResponse.json({ success: false, message: 'Falta productId' }, { status: 400 });
  }

  // Rate limit: 30 visualizaciones por minuto por IP
  const rateCheck = checkRateLimit(`view_prod:${clientIp}:${productId}`, { limit: 10, windowMs: 60 * 1000 });
  
  const client = getAdminClient();
  if (!client) {
    return NextResponse.json({ success: true, viewsCount: 1 });
  }

  const allViews = await loadProductViewsFromStorage(client);
  const current = Number(allViews[productId] || 0);

  // If rate check allows, increment
  let nextCount = current;
  if (rateCheck.success) {
    nextCount = current + 1;
    allViews[productId] = nextCount;
    viewsCache = allViews;
    
    // Save asynchronously
    saveProductViewsToStorage(client, allViews);
  }

  return NextResponse.json({ success: true, viewsCount: nextCount });
}
