import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientHomeContainer } from '@/components/client-portal/ClientHomeContainer';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { getProvinceBySlug, PROVINCES } from '@/lib/constants/locations';
import { getFeaturedProducts } from '@/lib/dal/portal';

export const revalidate = 60;

interface ProvincePageProps {
  params: Promise<{ provincia: string }>;
}

export async function generateStaticParams() {
  return PROVINCES.map((p) => ({
    provincia: p.slug,
  }));
}

export async function generateMetadata({ params }: ProvincePageProps): Promise<Metadata> {
  const { provincia } = await params;
  const prov = getProvinceBySlug(provincia);

  if (!prov || prov.id === 'all') {
    return {
      title: 'Entre Ríos ON MÁS Portal | Comercio, Turismo y Medios',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://entreriosonmas.gob.ar';
  const title = `Provincia de ${prov.name} | Comercio, Turismo y Guía B2B ON MÁS`;
  const description = `Portal oficial de la provincia de ${prov.name}. Encontrá comercios adheridos, catálogo con pedido a WhatsApp, sorteos, clasificados y agenda de la comunidad en ${prov.name}.`;
  const canonicalUrl = `${baseUrl}/${prov.slug}`;

  return {
    title,
    description,
    keywords: [prov.name, `Comercio ${prov.name}`, `Turismo ${prov.name}`, `Comercios ${prov.name}`, 'ON MÁS'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Entre Ríos ON MÁS Portal',
      locale: 'es_AR',
      type: 'website',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: `Entre Ríos ON MÁS Portal - ${prov.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/logo.png'],
    },
  };
}

export default async function ProvincePage({ params }: ProvincePageProps) {
  const { provincia } = await params;
  const prov = getProvinceBySlug(provincia);

  if (!prov) {
    notFound();
  }

  const products = await getFeaturedProducts(undefined, undefined, prov.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <ClientHeader />
      <ClientHomeContainer provinceId={prov.id} initialProducts={products} />
      <ClientFooter />
    </div>
  );
}
