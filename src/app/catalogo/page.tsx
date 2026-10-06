import { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
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

  const heroContent = (
    <div className="space-y-4">
      {/* Breadcrumb Glass Badge */}
      <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl w-fit flex items-center gap-2 text-xs font-extrabold text-white shadow-xs">
        <Link href="/" className="hover:text-cyan-300 text-slate-100 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Inicio</span>
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-cyan-300 font-black">Catálogo & Ofertas</span>
      </div>

      {/* Hero Banner Card */}
      <div className="bg-slate-950/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden space-y-3">
        <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full backdrop-blur-md">
          <ShoppingBag className="w-4 h-4 text-[#00E5E8]" />
          <span>Catálogo Unificado & Ofertas • ON MÁS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Catálogo General de Productos y Ofertas
        </h1>

        <p className="text-sm sm:text-base text-slate-100 font-medium max-w-2xl leading-relaxed">
          Explorá promociones exclusivas, productos destacados y artículos regionales con compra y consulta directa a WhatsApp de cada comercio.
        </p>
      </div>
    </div>
  );

  return (
    <DynamicLayoutWrapper heroContent={heroContent}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Vista interactiva de catálogo con búsqueda y filtro dinámico */}
        <CatalogInteractiveView initialProducts={products} />
      </main>
    </DynamicLayoutWrapper>
  );
}

