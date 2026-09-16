import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Search, Filter, Store, Sparkles, MessageCircle } from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { ProductCard } from '@/components/home/ProductCard';
import { getFeaturedProducts } from '@/lib/dal/portal';

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

        {/* Hero Header Card */}
        <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-white/15 text-[#00E5E8] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              Catálogo Regional Unificado
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Catálogo & Ofertas ON MÁS
            </h1>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              Explorá miles de productos de comercios, productores locales y emprendedores con pedido directo a WhatsApp sin intermediarios ni comisiones.
            </p>

            {/* Quick Search */}
            <div className="pt-2 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos, artesanías, calzados..."
                  className="w-full bg-white text-slate-800 text-xs font-semibold rounded-2xl pl-10 pr-4 py-3.5 shadow-md focus:outline-hidden focus:ring-2 focus:ring-[#00E5E8]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
          <button className="bg-[#0047BA] text-white px-4 py-2 rounded-xl shrink-0 shadow-xs">Todos los Productos</button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0">Gastronomía & Sabores</button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0">Artesanías & Regalos</button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0">Indumentaria & Calzado</button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0">Hogar & Decoración</button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0">Construcción & Ferretería</button>
        </div>

        {/* Products Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-lg font-extrabold text-[#0047BA] flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#00ADB5]" />
              <span>Productos Exhibidos ({products.length})</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Envíos y consulta directa por WhatsApp</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* B2B Callout Banner */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-[#00E5E8]" />
              <span>¿Tenés un comercio y querés sumar tu catálogo?</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Publicá tus productos gratis y conectá directo con clientes de toda la provincia por WhatsApp sin comisiones por venta.
            </p>
          </div>
          <Link
            href="/admin"
            className="bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white px-6 py-3 rounded-2xl font-extrabold text-xs shadow-md shrink-0 whitespace-nowrap"
          >
            Publicar mis Productos
          </Link>
        </div>
      </main>
    </DynamicLayoutWrapper>
  );
}
