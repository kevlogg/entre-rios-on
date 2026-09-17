import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { getFeaturedProducts } from '@/lib/dal/portal';
import { CatalogInteractiveView } from '@/components/catalog/CatalogInteractiveView';

export const revalidate = 60;

export default async function CatalogoPage() {
  const products = await getFeaturedProducts();

  return (
    <DynamicLayoutWrapper>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-[#00ADB5] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <span className="text-[#0047BA]">Catálogo & Ofertas</span>
        </div>

        {/* Vista interactiva de catálogo con búsqueda y filtro dinámico */}
        <CatalogInteractiveView initialProducts={products} />
      </main>
    </DynamicLayoutWrapper>
  );
}

