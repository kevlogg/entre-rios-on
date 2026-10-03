import { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { getFeaturedProducts } from '@/lib/dal/portal';
import { CatalogInteractiveView } from '@/components/catalog/CatalogInteractiveView';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Catálogo de Productos & Ofertas Regionales | ON MÁS Portal',
  description: 'Explorá miles de productos, ofertas, promociones y artículos regionales directos del productor en Santa Fe y Entre Ríos sin comisiones.',
  openGraph: {
    title: 'Catálogo de Productos & Ofertas Regionales | ON MÁS',
    description: 'Miles de productos y ofertas directas por WhatsApp sin comisiones.',
  },
};

export default async function CatalogoPage() {
  const products = await getFeaturedProducts();

  return (
    <DynamicLayoutWrapper>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Breadcrumb Glass Badge */}
        <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl w-fit flex items-center gap-2 text-xs font-extrabold text-white shadow-xs">
          <Link href="/" className="hover:text-cyan-300 text-slate-100 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-cyan-300 font-black">Catálogo & Ofertas</span>
        </div>

        {/* Vista interactiva de catálogo con búsqueda y filtro dinámico */}
        <CatalogInteractiveView initialProducts={products} />
      </main>
    </DynamicLayoutWrapper>
  );
}

