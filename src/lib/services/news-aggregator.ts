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

    $('article, .nota, .article, .card-noticia, .main-story, .story, .c-story').each((_, el) => {
      if (title) return;
      const heading = $(el).find('h1, h2, h3, .title, .titular').first();
      const a = heading.is('a') ? heading : heading.find('a').first().length ? heading.find('a').first() : $(el).find('a').first();
      const text = (heading.text() || '').trim().replace(/\s+/g, ' ');
      const href = a.attr('href');

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

    // Fallback: search h1 or h2 with anchor
    if (!title) {
      $('h1 a, h2 a').each((_, el) => {
        if (title) return;
        const text = $(el).text().trim().replace(/\s+/g, ' ');
        const href = $(el).attr('href');
        if (text.length >= 25 && href && !IGNORE_PATTERNS.some((p) => p.test(text))) {
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

  const models = ['gemini-3.5-flash', 'gemini-3.5-flash-lite'];

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

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
        } else if (res.status === 503 || res.status === 429) {
          // Model busy or rate-limited, wait and retry
          await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
        } else {
          break; // Try next model
        }
      } catch {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  return null;
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
        if (url) existingUrls.add(url.toLowerCase().trim());
        const isToday = r.date === today || (r.created_at && r.created_at.startsWith(today));
        if (portalId && isToday) {
          syncedPortalsToday.add(portalId);
        }
      }
    }
  });

  for (const portal of REGIONAL_PORTALS) {
    try {
      // If not forced and portal already synced today, skip to ensure 1 daily article per portal
      if (!force && syncedPortalsToday.has(portal.id)) {
        results.push({
          portal: portal.name,
          title: 'Ya sincronizado hoy',
          success: true,
          error: 'Portal ya cuenta con informe publicado para el día de hoy',
        });
        continue;
      }

      // 2. Scrape top story
      const scraped = await scrapePortalTopStory(portal);
      if (!scraped) {
        results.push({ portal: portal.name, title: 'No se pudo obtener noticia', success: false, error: 'Scraping falló' });
        continue;
      }

      // Check if original title, url, or image was already imported
      if (
        existingUrls.has(scraped.articleUrl.toLowerCase().trim()) ||
        (scraped.imageUrl && existingImages.has(scraped.imageUrl)) ||
        existingTitles.has(scraped.originalTitle.toLowerCase().trim())
      ) {
        results.push({ portal: portal.name, title: scraped.originalTitle, success: true, error: 'Ya procesada anteriormente' });
        continue;
      }

      // 3. Rewrite with Gemini
      const rewritten = await rewriteNewsWithGemini(scraped);
      if (!rewritten || !rewritten.title) {
        results.push({ portal: portal.name, title: scraped.originalTitle, success: false, error: 'IA no devolvió texto' });
        continue;
      }

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
        image_url: scraped.imageUrl || FALLBACK_IMAGES[portal.defaultCityId] || FALLBACK_IMAGES.default,
        read_time_minutes: rewritten.readTimeMinutes || 3,
        excerpt: rewritten.excerpt,
        full_story: storyWithTracking,
        is_featured: true,
        author_name: 'Redacción ON MÁS',
        author_avatar_url: '/images/avatar-author.jpg',
        status: 'APPROVED',
      });

      if (insertError) {
        results.push({ portal: portal.name, title: rewritten.title, success: false, error: insertError.message });
      } else {
        importedCount++;
        existingTitles.add(rewritten.title.toLowerCase().trim());
        if (scraped.imageUrl) existingImages.add(scraped.imageUrl);
        existingUrls.add(scraped.articleUrl.toLowerCase().trim());
        syncedPortalsToday.add(portal.id);
        results.push({ portal: portal.name, title: rewritten.title, success: true });
      }

      // Small delay between portals to stay well within Gemini API rate limits
      await new Promise((r) => setTimeout(r, 2500));
    } catch (err) {
      results.push({ portal: portal.name, title: '', success: false, error: (err as Error).message });
    }
  }

  return {
    success: importedCount > 0,
    importedCount,
    results,
  };
}
