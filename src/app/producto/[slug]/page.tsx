import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getCommerceBySlug } from '@/lib/dal/portal';
import { MapPin, CheckCircle, MessageCircle, ArrowLeft, ShieldCheck, Tag, Share2, Store } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const commerce = await getCommerceBySlug(product.commerceId);

  const cleanPhone = product.phoneWhatsApp.replace(/[^\d]/g, '');
  const waMsg = product.whatsappMessageCustom 
    ? product.whatsappMessageCustom 
    : `Hola ${product.commerceName}, vi en el portal Entre Ríos ON su producto "${product.title}" y me gustaría comprarlo / realizar una consulta.`;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;

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
          <Link href="/ciudad/parana" className="hover:text-[#00a859]">{product.cityName}</Link>
          <span>/</span>
          <span className="text-[#004b87]">{product.title}</span>
        </div>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Product Image */}
            <div className="lg:col-span-6 relative h-80 sm:h-[420px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-[#004b87] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                  {product.category}
                </span>
                {product.isFeatured && (
                  <span className="bg-amber-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Destacado
                  </span>
                )}
              </div>
            </div>

            {/* Right: Product Details & WhatsApp Action */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Commerce Header Link */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <Link 
                  href={`/comercio/${commerce?.slug || 'alfareria-ceramica-delta'}`} 
                  className="flex items-center gap-2 text-sm font-bold text-[#004b87] hover:underline"
                >
                  <Store className="w-4 h-4 text-[#00a859]" />
                  <span>{product.commerceName}</span>
                  <CheckCircle className="w-4 h-4 text-[#00a859]" />
                </Link>

                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00a859]" />
                  {product.cityName}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {product.title}
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Price & Guarantee Badge */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Precio Oficial de Comercialización</span>
                <div className="text-3xl font-black text-[#004b87]">
                  ${product.price ? product.price.toLocaleString('es-AR') : 'Consultar'} <span className="text-sm font-bold text-slate-500">ARS</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold pt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sin comisiones intermedias • Venta directa con el productor/comercio</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 shadow-lg transition-transform active:scale-95 text-center"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Pedir / Encargar por WhatsApp</span>
                </a>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 font-medium">
                  <span>Entre Ríos ON Portal Regional</span>
                  <button className="flex items-center gap-1 hover:text-[#004b87] font-bold">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Compartir oferta</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
