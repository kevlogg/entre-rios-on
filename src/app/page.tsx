import React from 'react';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientHomeContainer } from '@/components/client-portal/ClientHomeContainer';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { ComingSoonView } from '@/components/common/ComingSoonView';
import { getFeaturedProducts } from '@/lib/dal/portal';

export const revalidate = 60;

// FLAG MODO PRÓXIMAMENTE (true = Muestra pantalla de lanzamiento / false = Muestra sitio completo)
const SHOW_COMING_SOON = false;

interface ClientHomePageProps {
  searchParams?: Promise<{ preview?: string; view?: string }>;
}

export default async function ClientHomePage({ searchParams }: ClientHomePageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const isPreviewMode = resolvedParams.preview === 'true' || resolvedParams.view === 'live';

  if (SHOW_COMING_SOON && !isPreviewMode) {
    return <ComingSoonView />;
  }

  const products = await getFeaturedProducts();

  return (
    <div className="min-h-screen flex flex-col bg-[#e9ecef]">
      {/* Contenedor principal */}
      <main className="w-full flex-1 bg-[#e9ecef]">
        <ClientHomeContainer initialProducts={products} />
      </main>

      {/* Footer oficial */}
      <ClientFooter />
    </div>
  );
}


