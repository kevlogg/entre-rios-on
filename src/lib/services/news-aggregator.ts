import * as cheerio from 'cheerio';
import { createAdminClient } from '@/lib/supabase/admin';

export interface RegionalPortalSource {
  id: string;
  name: string;
  url: string;
  defaultCityName: string;
  defaultCityId: string;
  provinceId: string;
}

export const REGIONAL_PORTALS: RegionalPortalSource[] = [
  {
    id: 'elonce',
    name: 'El Once',
    url: 'https://www.elonce.com/',
    defaultCityName: 'Paraná / Región',
    defaultCityId: 'parana',
    provinceId: 'entre-rios',
  },
  {
    id: 'ellitoral',
    name: 'El Litoral',
    url: 'https://www.ellitoral.com/',
    defaultCityName: 'Santa Fe Capital',
    defaultCityId: 'santa-fe-capital',
    provinceId: 'santa-fe',
  },
  {
    id: 'airedesantafe',
    name: 'Aire de Santa Fe',
    url: 'https://www.airedesantafe.com.ar/',
    defaultCityName: 'Santa Fe Capital',
    defaultCityId: 'santa-fe-capital',
    provinceId: 'santa-fe',
  },
  {
    id: 'rosario3',
    name: 'Rosario3',
    url: 'https://www.rosario3.com/',
    defaultCityName: 'Rosario',
    defaultCityId: 'rosario',
    provinceId: 'santa-fe',
  },
  {
    id: 'unosantafe',
    name: 'Uno Santa Fe',
    url: 'https://www.unosantafe.com.ar/',
    defaultCityName: 'Santa Fe Capital',
    defaultCityId: 'santa-fe-capital',
    provinceId: 'santa-fe',
  },
];

interface RawScrapedStory {
  portalId: string;
  portalName: string;
  originalTitle: string;
  articleUrl: string;
  imageUrl?: string;
  rawText: string;
  defaultCityName: string;
  defaultCityId: string;
  provinceId: string;
}

interface RewrittenStory {
  title: string;
  category: string;
  cityName: string;
  cityId: string;
  excerpt: string;
  content: string;
  readTimeMinutes: number;
}

const FALLBACK_IMAGES: Record<string, string> = {
  'santa-fe-capital': '/images/city-santa-fe.jpg',
  'rosario': '/images/city-rosario.jpg',
  'parana': '/images/city-parana.jpg',
  'concordia': '/images/city-concordia.jpg',
  'colon': '/images/city-colon.jpg',
  'gualeguaychu': '/images/city-gualeguaychu.jpg',
  'default': '/images/commerce-bodega.jpg',
};

/**
 * Scrapes the primary featured headline from a regional portal
 */
async function scrapePortalTopStory(portal: RegionalPortalSource): Promise<RawScrapedStory | null> {
  try {
    const res = await fetch(portal.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-AR,es;q=0.9',
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    let title = '';
    let link = '';
    let imageUrl = '';

    const IGNORE_PATTERNS = [
      /horóscopo/i, /pronóstico/i, /quiniela/i, /clima hoy/i, /efemérides/i, 
      /clasificados/i, /radio en vivo/i, /vivo/i, /sorteo/i
    ];

    $('article, .nota, .article, .card-noticia, .main-story, .story, .c-story, div[class*="nota"], div[class*="card"]').each((_, el) => {
      if (title) return;
      const heading = $(el).find('h1, h2, h3, .title, .titular').first();
      const text = (heading.text() || '').trim().replace(/\s+/g, ' ');

      // Find valid article link: not empty, not #, not author/tag/static pages
      let href = '';
      const headingA = heading.is('a') ? heading : heading.find('a[href]').first();
      const hA = headingA.attr('href');
      if (
        hA &&
        hA !== '#' &&
        !hA.startsWith('#') &&
        !hA.startsWith('javascript:') &&
        !hA.includes('/autor/') &&
        !hA.includes('/tag/') &&
        !hA.includes('/usuario/')
      ) {
        href = hA;
      }

      if (!href) {
        $(el).find('a[href]').each((_, aEl) => {
          if (href) return;
          const h = $(aEl).attr('href');
          if (
            h &&
            h !== '#' &&
            !h.startsWith('#') &&
            !h.startsWith('javascript:') &&
            !h.includes('/autor/') &&
            !h.includes('/tag/') &&
            !h.includes('/usuario/') &&
            (h.includes('/') || h.startsWith('http'))
          ) {
            href = h;
          }
        });
      }

      if (text.length >= 25 && href && !IGNORE_PATTERNS.some((p) => p.test(text))) {
        title = text;
        link = href.startsWith('http') ? href : new URL(href, portal.url).href;
        const img = $(el).find('img').first();
        const rawImg = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src') || img.attr('srcset') || '';
        imageUrl = rawImg ? rawImg.split(' ')[0].trim() : '';
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = new URL(imageUrl, portal.url).href;
        }
      }
    });

    // Fallback: search h1 a, h2 a, h3 a
    if (!title) {
      $('h1 a, h2 a, h3 a').each((_, el) => {
        if (title) return;
        const text = $(el).text().trim().replace(/\s+/g, ' ');
        const href = $(el).attr('href');
        if (
          href &&
          href !== '#' &&
          !href.startsWith('#') &&
          !href.includes('/autor/') &&
          !href.includes('/tag/') &&
          text.length >= 25 &&
          !IGNORE_PATTERNS.some((p) => p.test(text))
        ) {
          title = text;
          link = href.startsWith('http') ? href : new URL(href, portal.url).href;
        }
      });
    }

    if (!title || !link) return null;

    // Fetch the article details page to grab full paragraphs
    let rawText = '';
    try {
      const articleRes = await fetch(link, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
      });
      if (articleRes.ok) {
        const articleHtml = await articleRes.text();
        const $art = cheerio.load(articleHtml);
        
        // Grab og:image if missing
        if (!imageUrl) {
          const ogImg = $art('meta[property="og:image"]').attr('content') || $art('meta[name="twitter:image"]').attr('content');
          if (ogImg) imageUrl = ogImg.startsWith('http') ? ogImg : new URL(ogImg, portal.url).href;
        }

        const paragraphs: string[] = [];
        $art('article p, .article-body p, .cuerpo p, .entry-content p, .detail-body p, p').each((_, pel) => {
          const pText = $art(pel).text().trim().replace(/\s+/g, ' ');
          if (pText.length > 45 && !pText.toLowerCase().includes('suscribite') && !pText.toLowerCase().includes('derechos reservados')) {
            paragraphs.push(pText);
          }
        });
        rawText = paragraphs.slice(0, 6).join('\n\n');
      }
    } catch {
      rawText = title;
    }

    return {
      portalId: portal.id,
      portalName: portal.name,
      originalTitle: title,
      articleUrl: link,
      imageUrl: imageUrl || FALLBACK_IMAGES[portal.defaultCityId] || FALLBACK_IMAGES.default,
      rawText: rawText || title,
      defaultCityName: portal.defaultCityName,
      defaultCityId: portal.defaultCityId,
      provinceId: portal.provinceId,
    };
  } catch (err) {
    console.warn(`Error scraping ${portal.name}:`, (err as Error).message);
    return null;
  }
}

export type CommunityCategory = 'Festival' | 'Gastronomía' | 'Cultura' | 'Deportes' | 'Turismo' | 'Emprendedores';

function sanitizeCategory(rawCategory: string): CommunityCategory {
  const norm = (rawCategory || '').toLowerCase();
  if (norm.includes('deport') || norm.includes('futbol') || norm.includes('fútbol') || norm.includes('liga') || norm.includes('club') || norm.includes('madelon') || norm.includes('dt') || norm.includes('cancha')) return 'Deportes';
  if (norm.includes('gastro') || norm.includes('comida') || norm.includes('vino') || norm.includes('cerveza') || norm.includes('plato') || norm.includes('chef')) return 'Gastronomía';
  if (norm.includes('festiv') || norm.includes('fiesta') || norm.includes('recital') || norm.includes('show') || norm.includes('concierto')) return 'Festival';
  if (norm.includes('turis') || norm.includes('terma') || norm.includes('río') || norm.includes('rio') || norm.includes('clima') || norm.includes('inund') || norm.includes('crecida') || norm.includes('naturaleza') || norm.includes('viaje') || norm.includes('cascarudo') || norm.includes('fauna') || norm.includes('bichos')) return 'Turismo';
  if (norm.includes('emprend') || norm.includes('econ') || norm.includes('comerc') || norm.includes('agro') || norm.includes('soja') || norm.includes('dolar') || norm.includes('gobierno') || norm.includes('polit') || norm.includes('paritaria') || norm.includes('docente') || norm.includes('pyme') || norm.includes('trabajo') || norm.includes('laboral') || norm.includes('petroleo') || norm.includes('vaca muerta')) return 'Emprendedores';
  return 'Cultura';
}

/**
 * Rewrites news story using Gemini Flash API
 */
async function rewriteNewsWithGemini(story: RawScrapedStory): Promise<RewrittenStory | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const prompt = `Actuá como redactor periodístico profesional del portal regional ON MÁS (de Santa Fe y Entre Ríos).
Reescribí la siguiente noticia para nuestro portal con estilo informativo ágil, neutral, claro y atrapante.

REGLAS ESTRICTAS:
1. NO copies frases textuales idénticas ni plagio literal.
2. NO menciones el medio de origen bajo ninguna circunstancia (nunca menciones a ${story.portalName}, diarios, emisoras, etc.).
3. Generá un título nuevo propio, claro y de alto impacto.
4. Redactá un copete/resumen de 2 líneas informativas.
5. Redactá el cuerpo de la nota en 3 o 4 párrafos bien desarrollados y fluidos.
6. La categoría DEBE ser exactamente UNA de las siguientes 6: 'Cultura', 'Deportes', 'Emprendedores', 'Turismo', 'Gastronomía', 'Festival'.
7. Identificá la ciudad correspondiente (o usá "${story.defaultCityName}" si es general).

NOTICIA DE REFERENCIA:
Título: ${story.originalTitle}
Texto:
${story.rawText}

Respondé EXCLUSIVAMENTE en formato JSON válido con la siguiente estructura:
{
  "title": "string",
  "category": "Cultura",
  "cityName": "${story.defaultCityName}",
  "cityId": "${story.defaultCityId}",
  "excerpt": "string",
  "content": "string",
  "readTimeMinutes": 3
}`;

  const models = ['gemini-flash-lite-latest', 'gemini-3.1-flash-lite', 'gemini-3.5-flash-lite'];

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.status === 200) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text) as RewrittenStory;
          return parsed;
        }
      } else {
        console.warn(`[Gemini Rewrite] Model ${model} returned status ${res.status}. Falling back to next model...`);
      }
    } catch (err) {
      console.warn(`[Gemini Rewrite] Model ${model} failed:`, (err as Error).message);
    }
  }

  return null;
}

/**
 * Downloads full-resolution scraped image respecting anti-hotlinking headers,
 * and uploads it directly to Supabase Storage so that it serves at 100% crystal-clear quality.
 */
async function persistImageToSupabaseStorage(
  imageUrl: string,
  referer: string,
  portalId: string
): Promise<string> {
  if (!imageUrl || imageUrl.startsWith('/images/')) return imageUrl;

  // Strip hash fragments or cache-busters before fetching
  const cleanUrl = imageUrl.split('#')[0].trim();
  let targetUrl = cleanUrl;
  if (portalId === 'elonce') {
    targetUrl = cleanUrl.replace(/\/(xs_|s_|m_|l_)/, '/o_');
  }

  try {
    const supabase = createAdminClient();
    let res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': referer,
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    // Fallback if o_ fails on El Once: retry original cleanUrl
    if (!res.ok && targetUrl !== cleanUrl) {
      res = await fetch(cleanUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': referer,
        },
      });
    }

    if (!res.ok) return imageUrl;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) return imageUrl; // Too small or error response

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const ext = contentType.includes('webp') ? 'webp' : contentType.includes('png') ? 'png' : 'jpg';
    const storagePath = `news/${Date.now()}-${portalId}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('commerces')
      .upload(storagePath, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn('Storage upload error for news:', uploadError.message);
      return imageUrl;
    }

    const { data: pubData } = supabase.storage.from('commerces').getPublicUrl(storagePath);
    return pubData.publicUrl || imageUrl;
  } catch (err) {
    console.warn('Error persisting image to Supabase:', err);
    return imageUrl;
  }
}

/**
 * Main function: Syncs exactly 5 news articles daily (1 per portal),
 * rewrites them with Gemini and saves them to Supabase.
 */
export async function syncDailyRegionalNews(force = false): Promise<{
  success: boolean;
  importedCount: number;
  results: Array<{ portal: string; title: string; success: boolean; error?: string }>;
}> {
  const supabase = createAdminClient();
  const results: Array<{ portal: string; title: string; success: boolean; error?: string }> = [];
  let importedCount = 0;

  // 1. Get recent records from DB to avoid inserting exact duplicates or repeating portals today
  const today = new Date().toISOString().split('T')[0];
  const { data: existingRows } = await supabase
    .from('community_events')
    .select('title, image_url, full_story, date, created_at')
    .order('created_at', { ascending: false })
    .limit(60);

  const existingTitles = new Set(
    (existingRows || []).map((r: { title: string }) => r.title.toLowerCase().trim())
  );
  const existingImages = new Set(
    (existingRows || [])
      .map((r: { image_url: string }) => r.image_url)
      .filter((img: string) => img && !img.startsWith('/images/'))
  );
  const existingUrls = new Set<string>();
  const syncedPortalsToday = new Set<string>();

  (existingRows || []).forEach((r: any) => {
    if (r.full_story) {
      const match = r.full_story.match(/<!--\s*portal:([a-z0-9_-]+)\s+url:([^\s]+)\s*-->/);
      if (match) {
        const [, portalId, url] = match;
        const normUrl = (url || '').toLowerCase().trim();
        if (normUrl && !normUrl.endsWith('/#') && !normUrl.endsWith('#') && normUrl !== 'none') {
          existingUrls.add(normUrl);
        }
        const isToday = r.date === today || (r.created_at && r.created_at.startsWith(today));
        if (portalId && isToday) {
          syncedPortalsToday.add(portalId);
        }
      }
    }
  });

  const processPortal = async (portal: RegionalPortalSource, index: number) => {
    // Gentle stagger (350ms) to prevent exact microsecond concurrency spikes
    if (index > 0) {
      await new Promise((r) => setTimeout(r, index * 350));
    }

    try {
      // If not forced and portal already synced today, skip to ensure 1 daily article per portal
      if (!force && syncedPortalsToday.has(portal.id)) {
        return {
          portal: portal.name,
          title: 'Ya sincronizado hoy',
          success: true,
          error: 'Portal ya cuenta con informe publicado para el día de hoy',
        };
      }

      // 2. Scrape top story
      const scraped = await scrapePortalTopStory(portal);
      if (!scraped) {
        return { portal: portal.name, title: 'No se pudo obtener noticia', success: false, error: 'Scraping falló' };
      }

      // Check if original title, url, or image was already imported
      const cleanUrl = scraped.articleUrl.toLowerCase().trim();
      const isUrlDup = cleanUrl && !cleanUrl.endsWith('/#') && !cleanUrl.endsWith('#') && existingUrls.has(cleanUrl);
      const isImgDup = scraped.imageUrl && existingImages.has(scraped.imageUrl);
      const isTitleDup = existingTitles.has(scraped.originalTitle.toLowerCase().trim());

      if (isUrlDup || isImgDup || isTitleDup) {
        return { portal: portal.name, title: scraped.originalTitle, success: true, error: 'Ya procesada anteriormente' };
      }

      // 3. Rewrite with Gemini
      const rewritten = await rewriteNewsWithGemini(scraped);
      if (!rewritten || !rewritten.title) {
        return { portal: portal.name, title: scraped.originalTitle, success: false, error: 'IA no devolvió texto' };
      }

      // 3.5 Persist image directly into Supabase Storage to avoid hotlinking blocks & ensure HD quality
      const persistedImageUrl = await persistImageToSupabaseStorage(
        scraped.imageUrl || '',
        portal.url,
        portal.id
      );

      // 4. Insert into Supabase `community_events`
      const formattedDate = new Date().toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      const storyWithTracking = `${rewritten.content}\n\n<!-- portal:${portal.id} url:${scraped.articleUrl} -->`;

      const { error: insertError } = await supabase.from('community_events').insert({
        title: rewritten.title,
        category: sanitizeCategory(rewritten.category),
        date: today,
        formatted_date: formattedDate,
        location: rewritten.cityName || portal.defaultCityName,
        province_id: portal.provinceId,
        city_id: rewritten.cityId || portal.defaultCityId,
        city_name: rewritten.cityName || portal.defaultCityName,
        image_url: persistedImageUrl || FALLBACK_IMAGES[portal.defaultCityId] || FALLBACK_IMAGES.default,
        read_time_minutes: rewritten.readTimeMinutes || 3,
        excerpt: rewritten.excerpt,
        full_story: storyWithTracking,
        is_featured: true,
        author_name: 'Redacción ON MÁS',
        author_avatar_url: '/images/avatar-author.jpg',
        status: 'APPROVED',
      });

      if (insertError) {
        return { portal: portal.name, title: rewritten.title, success: false, error: insertError.message };
      }

      existingTitles.add(rewritten.title.toLowerCase().trim());
      if (scraped.imageUrl) existingImages.add(scraped.imageUrl);
      if (cleanUrl) existingUrls.add(cleanUrl);
      syncedPortalsToday.add(portal.id);

      return { portal: portal.name, title: rewritten.title, success: true };
    } catch (err) {
      return { portal: portal.name, title: '', success: false, error: (err as Error).message };
    }
  };

  // Process all portals concurrently with Promise.allSettled
  const settled = await Promise.allSettled(
    REGIONAL_PORTALS.map((portal, idx) => processPortal(portal, idx))
  );

  settled.forEach((res, i) => {
    if (res.status === 'fulfilled') {
      results.push(res.value);
      if (res.value.success && !res.value.error) {
        importedCount++;
      }
    } else {
      results.push({
        portal: REGIONAL_PORTALS[i].name,
        title: '',
        success: false,
        error: res.reason?.message || 'Error desconocido',
      });
    }
  });

  return {
    success: importedCount > 0,
    importedCount,
    results,
  };
}
