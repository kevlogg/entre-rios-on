import React, { Suspense } from 'react';
import { 
  getHeroSlides, 
  getCities, 
  getFeaturedProducts, 
  getUpcomingEvents,
  getBentoHighlights
} from '@/lib/dal/portal';
import { HomeClientView } from '@/components/home/HomeClientView';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const revalidate = 60;

async function EditorialContent() {
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

export default function EditorialPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5]">
      <Header />
      <div className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-slate-500 font-bold">Cargando Versión Editorial...</div>}>
          <EditorialContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
