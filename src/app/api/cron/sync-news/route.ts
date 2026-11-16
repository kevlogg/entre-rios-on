import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { syncDailyRegionalNews } from '@/lib/services/news-aggregator';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60s for scraping 5 portals and calling Gemini

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // If CRON_SECRET is configured, enforce authorization for cron calls
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const url = new URL(request.url);
      const key = url.searchParams.get('key');
      if (key !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const result = await syncDailyRegionalNews();

    revalidatePath('/');
    revalidatePath('/novedades');
    revalidatePath('/superadmin');

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    console.error('Error running sync-news cron:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
