import { Suspense } from 'react';
import { 
  getHeroSlides, 
  getCities, 
  getFeaturedProducts, 
  getUpcomingEvents,
  getBentoHighlights
} from '@/lib/dal/portal';
import { HomeClientView } from '@/components/home/HomeClientView';

export const revalidate = 60; // Incremental Static Regeneration (ISR)

async function HomeContent() {
  // Fetch initial data in parallel from Data Access Layer
  const [
    slides, 
    cities, 
    initialProducts, 
    events, 
    { featuredCommerce, weekendEvent }
  ] = await Promise.all([
    getHeroSlides(),
    getCities(),
    getFeaturedProducts(),
    getUpcomingEvents(),
    getBentoHighlights(),
  ]);

  return (
    <HomeClientView
      slides={slides}
      cities={cities}
      initialProducts={initialProducts}
      events={events}
      featuredCommerce={featuredCommerce}
      weekendEvent={weekendEvent}
    />
  );
}

function HomeLoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-[450px] bg-slate-200 rounded-3xl w-full" />
      {/* City Bar Skeleton */}
      <div className="h-16 bg-slate-200 rounded-2xl w-full" />
      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-80 bg-slate-200 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}
