import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCommerceBySlug, getProductsByCommerce } from '@/lib/dal/portal';
import { MapPin, CheckCircle, MessageCircle, ArrowLeft, Store, ShieldCheck, Tag } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CommerceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const commerce = await getCommerceBySlug(slug);

  if (!commerce) {
    notFound();
  }

  const products = await getProductsByCommerce(commerce.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-[#00a859] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <Link href="/comercios" className="hover:text-[#00a859]">Comercios</Link>
          <span>/</span>
          <span className="text-[#004b87]">{commerce.name}</span>
        </div>

        {/* Commerce Profile Header Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          {/* Cover Photo */}
          <div className="relative h-48 sm:h-64 w-full bg-slate-800">
            <Image
              src={commerce.coverUrl}
              alt={commerce.name}
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
            <div className="absolute top-4 right-4 bg-[#00a859] text-white text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <ShieldCheck className="w-4 h-4" />
              <span>Socio Adherido Entre Ríos ON</span>
            </div>
          </div>

          {/* Profile Info Row */}
          <div className="p-6 sm:p-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-12 sm:-mt-16 mb-6">
              <div className="flex items-end gap-4">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white shrink-0">
                  <Image
                    src={commerce.logoUrl}
                    alt={commerce.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1 pb-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#004b87] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                      {commerce.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#00a859]" />
                      {commerce.cityName}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-[#004b87] flex items-center gap-2">
                    <span>{commerce.name}</span>
                    <CheckCircle className="w-6 h-6 text-[#00a859]" />
                  </h1>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <a
                href={`https://wa.me/${commerce.phoneWhatsApp}?text=${encodeURIComponent(`Hola ${commerce.name}, los encontré en el portal Entre Ríos ON y me gustaría consultar su catálogo.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-6 py-3 rounded-2xl font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Contactar por WhatsApp</span>
              </a>
            </div>

            {/* Description & Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div className="md:col-span-2 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sobre este Comercio</h3>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {commerce.description}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#004b87]">Datos de Contacto</h3>
                <div className="text-xs space-y-2 text-slate-600">
                  <p className="flex items-center gap-2 font-medium">
                    <MapPin className="w-4 h-4 text-[#00a859]" />
                    <span>{commerce.address}</span>
                  </p>
                  {commerce.instagram && (
                    <p className="flex items-center gap-2 font-medium text-slate-700">
                      <svg className="w-4 h-4 text-pink-600 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span>{commerce.instagram}</span>
                    </p>
                  )}
                  <p className="flex items-center gap-2 font-bold text-[#004b87]">
                    <Store className="w-4 h-4 text-[#00a859]" />
                    <span>Atención y Envíos en Entre Ríos</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Showcase Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#004b87] flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#00a859]" />
              <span>Catálogo de {commerce.name}</span>
            </h2>
            <span className="text-xs font-bold text-slate-500">
              {products.length} ofertas disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div key={prod.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between p-5 space-y-4">
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100">
                  <Image src={prod.imageUrl} alt={prod.title} fill className="object-cover" />
                </div>

                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-slate-800 text-base line-clamp-2">{prod.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{prod.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Precio</span>
                    <span className="text-base font-extrabold text-[#004b87]">
                      ${prod.price ? prod.price.toLocaleString('es-AR') : 'Consultar'} ARS
                    </span>
                  </div>

                  <Link
                    href={`/producto/${prod.slug}`}
                    className="bg-[#00a859] hover:bg-[#008746] text-white px-4 py-2 rounded-xl font-extrabold text-xs"
                  >
                    Ver Detalle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
