import { MetadataRoute } from 'next';
import { getAllCommerces, getUpcomingEvents } from '@/lib/dal/portal';
import { PROVINCES, ALL_CITIES, VALID_SECTION_SLUGS } from '@/lib/constants/locations';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://entreriosonmas.gob.ar';

  // Base Section Routes
  const sections = Object.keys(VALID_SECTION_SLUGS);
  const baseSectionRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    ...sections.map((sec) => ({
      url: `${baseUrl}/${sec}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    })),
  ];

  // Province Hub Routes
  const provinceRoutes: MetadataRoute.Sitemap = PROVINCES.filter(p => p.id !== 'all').map((p) => ({
    url: `${baseUrl}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // City Hub Routes
  const cityRoutes: MetadataRoute.Sitemap = ALL_CITIES.map((city) => ({
    url: `${baseUrl}/${city.provinceId}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Geo-Targeted Local Section Routes (e.g. /santa-fe/rosario/comercios)
  const geoSectionRoutes: MetadataRoute.Sitemap = [];
  ALL_CITIES.forEach((c) => {
    sections.forEach((sec) => {
      geoSectionRoutes.push({
        url: `${baseUrl}/${c.provinceId}/${c.slug}/${sec}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // Dynamic Commerce Routes
  const commerces = await getAllCommerces();
  const commerceRoutes: MetadataRoute.Sitemap = commerces.map((comm) => ({
    url: `${baseUrl}/comercio/${comm.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  // Dynamic Event Routes
  const events = await getUpcomingEvents();
  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/comunidad/${event.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...baseSectionRoutes,
    ...provinceRoutes,
    ...cityRoutes,
    ...geoSectionRoutes,
    ...commerceRoutes,
    ...eventRoutes,
  ];
}

