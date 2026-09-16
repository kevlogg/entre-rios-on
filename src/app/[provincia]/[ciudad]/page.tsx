import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientHomeContainer } from '@/components/client-portal/ClientHomeContainer';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { getProvinceBySlug, getCityBySlug, ALL_CITIES } from '@/lib/constants/locations';

export const revalidate = 60;

interface CityHubPageProps {
  params: Promise<{ provincia: string; ciudad: string }>;
}

export async function generateStaticParams() {
  return ALL_CITIES.map((c) => ({
    provincia: c.provinceId || 'entre-rios',
    ciudad: c.slug,
  }));
}

export async function generateMetadata({ params }: CityHubPageProps): Promise<Metadata> {
  const { provincia, ciudad } = await params;
  const prov = getProvinceBySlug(provincia);
  const city = getCityBySlug(ciudad);

  if (!city) {
    return {
      title: 'Entre Ríos ON MÁS Portal',
    };
  }

  const provName = prov?.name || city.provinceName || 'Entre Ríos';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://entreriosonmas.gob.ar';
  const title = `${city.name}, ${provName} | Comercios, Turismo y Ofertas ON MÁS`;
  const description = `Guía comercial y portal de ${city.name} en la Provincia de ${provName}. Encontrá comercios locales, catálogo con pedido directo a WhatsApp, servicios y eventos.`;
  const canonicalUrl = `${baseUrl}/${prov?.slug || 'entre-rios'}/${city.slug}`;

  return {
    title,
    description,
    keywords: [city.name, provName, `Comercios en ${city.name}`, `Turismo ${city.name}`, `Ofertas ${city.name}`, 'ON MÁS'],
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
          url: city.imageUrl || '/logo.png',
          width: 1200,
          height: 630,
          alt: `Entre Ríos ON MÁS Portal - ${city.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [city.imageUrl || '/logo.png'],
    },
  };
}

export default async function CityHubPage({ params }: CityHubPageProps) {
  const { provincia, ciudad } = await params;
  const city = getCityBySlug(ciudad);

  if (!city) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <ClientHeader />
      <ClientHomeContainer />
      <ClientFooter />
    </div>
  );
}
