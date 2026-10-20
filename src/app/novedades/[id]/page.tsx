import { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getEventById } from '@/lib/dal/portal';
import { Calendar, MapPin, Clock, ArrowLeft, Share2, Newspaper } from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { JsonLd } from '@/components/common/JsonLd';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getEventById(id);

  if (!article) {
    return { title: 'Novedad no encontrada | ON MÁS Portal' };
  }

  return {
    title: `${article.title} | ON MÁS Novedades`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.imageUrl }],
    },
  };
}

export default async function NovedadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const article = await getEventById(id);

  if (!article) {
    notFound();
  }

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: [article.imageUrl],
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ON MÁS Portal',
    },
  };

  return (
    <DynamicLayoutWrapper>
      <JsonLd data={jsonLdData} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-[#0047BA] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <Link href="/novedades" className="hover:text-[#0047BA]">Novedades</Link>
          <span>/</span>
          <span className="text-[#0047BA] truncate max-w-xs">{article.title}</span>
        </div>

        {/* Main Editorial Article Header */}
        <article className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#0047BA] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                {article.category}
              </span>
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" />
                {article.location}
              </span>
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTimeMinutes} min de lectura
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {article.title}
            </h1>

            {/* Author Bio Row */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                <Image src={article.author.avatarUrl} alt={article.author.name} fill className="object-cover" />
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-slate-800">{article.author.name}</p>
                <p className="text-slate-400 font-semibold">{article.formattedDate}</p>
              </div>
            </div>
          </div>

          {/* Article Main Featured Image */}
          <div className="relative h-64 sm:h-[380px] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Article Story Body */}
          <div className="prose max-w-none text-slate-700 space-y-4 leading-relaxed font-medium text-base sm:text-lg">
            <p className="font-bold text-slate-900 text-lg sm:text-xl leading-snug border-l-4 border-[#00ADB5] pl-4">
              {article.excerpt}
            </p>
            <p>
              Nuestra región continúa consolidando su matriz comercial y turística mediante el desarrollo de circuitos integrados que conectan la producción local, la gastronomía y los comercios adheridos.
            </p>
            <p>
              Productores, comercios, pymes y emprendedores coinciden en el impacto positivo del portal unificado ON MÁS, permitiendo a los usuarios consultar directamente por WhatsApp productos, promociones y servicios de cercanía sin pagar comisiones adicionales.
            </p>
            <p>
              Te invitamos a seguir informado con todas las novedades comerciales, actividades culturales y lanzamientos de toda la provincia.
            </p>
          </div>

          {/* Share CTA */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link href="/novedades" className="text-xs font-bold text-[#0047BA] hover:underline flex items-center gap-1">
              <Newspaper className="w-4 h-4 text-[#00ADB5]" />
              <span>Ver todas las novedades</span>
            </Link>
            <button className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer">
              <Share2 className="w-4 h-4" />
              <span>Compartir Novedad</span>
            </button>
          </div>
        </article>
      </main>
    </DynamicLayoutWrapper>
  );
}
