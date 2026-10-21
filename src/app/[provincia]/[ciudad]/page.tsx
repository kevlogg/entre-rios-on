import React from 'react';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientHomeContainer } from '@/components/client-portal/ClientHomeContainer';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { getProvinceBySlug, getCityBySlug, ALL_CITIES } from '@/lib/constants/locations';
import { City } from '@/types';

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

  const cityName = city?.name || ciudad.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const provName = prov?.name || city?.provinceName || 'ON MÁS';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://onmasportal.com.ar';
  const title = `${cityName}, ${provName} | Comercios, Turismo y Ofertas ON MÁS`;
  const description = `Guía comercial y portal de ${cityName} en la Provincia de ${provName}. Encontrá comercios locales, catálogo con pedido directo a WhatsApp, servicios y eventos.`;
  const canonicalUrl = `${baseUrl}/${prov?.slug || provincia}/${city?.slug || ciudad}`;

  return {
    title,
    description,
    keywords: [cityName, provName, `Comercios en ${cityName}`, `Turismo ${cityName}`, `Ofertas ${cityName}`, 'ON MÁS'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ON MÁS Portal',
      locale: 'es_AR',
      type: 'website',
      images: [
        {
          url: city?.imageUrl || '/logo1.png',
          width: 1200,
          height: 630,
          alt: `ON MÁS Portal - ${cityName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [city?.imageUrl || '/logo1.png'],
    },
  };
}

export default async function CityHubPage({ params }: CityHubPageProps) {
  const { provincia, ciudad } = await params;

  if (provincia === 'superadmin' || provincia === 'admin' || provincia === 'api') {
    const tabMap: Record<string, string> = {
      planes: 'planes',
      provincias: 'provincias',
      banners: 'provincias',
      efectivo: 'efectivo',
      pagos: 'efectivo',
    };
    const tab = tabMap[ciudad] || ciudad;
    redirect(`/superadmin?tab=${tab}`);
  }

  const prov = getProvinceBySlug(provincia);
  const city = getCityBySlug(ciudad);

  const resolvedCity: City = city || {
    id: ciudad,
    name: ciudad.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug: ciudad,
    department: prov?.name || 'Región',
    description: `Guía comercial y portal de la ciudad.`,
    imageUrl: '/images/city-rosario.jpg',
    isFeatured: true,
    provinceId: prov?.id || provincia,
    provinceName: prov?.name || provincia,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e2e8f0]">
      <main className="w-full flex-1 bg-[#e2e8f0]">
        <ClientHomeContainer provinceId={resolvedCity.provinceId} />
      </main>
      <ClientFooter />
    </div>
  );
}
