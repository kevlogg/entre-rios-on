import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { getProvinceBySlug, getCityBySlug, VALID_SECTION_SLUGS, ALL_CITIES } from '@/lib/constants/locations';
import ComerciosPage from '@/app/comercios/page';
import CatalogoPage from '@/app/catalogo/page';
import SorteosPage from '@/app/sorteos/page';
import EmpleosPage from '@/app/empleos/page';
import ComunidadPage from '@/app/comunidad/page';
import TurismoPage from '@/app/turismo/page';

export const revalidate = 60;

interface GeoSectionPageProps {
  params: Promise<{ provincia: string; ciudad: string; seccion: string }>;
}

export async function generateStaticParams() {
  const sections = Object.keys(VALID_SECTION_SLUGS);
  const paramsList: { provincia: string; ciudad: string; seccion: string }[] = [];

  ALL_CITIES.forEach((c) => {
    sections.forEach((sec) => {
      paramsList.push({
        provincia: c.provinceId || 'entre-rios',
        ciudad: c.slug,
        seccion: sec,
      });
    });
  });

  return paramsList;
}

export async function generateMetadata({ params }: GeoSectionPageProps): Promise<Metadata> {
  const { provincia, ciudad, seccion } = await params;
  const prov = getProvinceBySlug(provincia);
  const city = getCityBySlug(ciudad);
  const sectionMeta = VALID_SECTION_SLUGS[seccion];

  if (!city || !sectionMeta) {
    return {
      title: 'Entre Ríos ON MÁS Portal',
    };
  }

  const provName = prov?.name || city.provinceName || 'Entre Ríos';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://entreriosonmas.gob.ar';
  const title = `${sectionMeta.name} en ${city.name}, ${provName} | ON MÁS`;
  const description = `${sectionMeta.description} Accedé a la guía completa de ${sectionMeta.name.toLowerCase()} en ${city.name} (${provName}) con contacto directo a WhatsApp.`;
  const canonicalUrl = `${baseUrl}/${prov?.slug || 'entre-rios'}/${city.slug}/${seccion}`;

  return {
    title,
    description,
    keywords: [sectionMeta.name, city.name, provName, `${sectionMeta.name} en ${city.name}`, 'ON MÁS'],
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
          alt: `Entre Ríos ON MÁS - ${sectionMeta.name} en ${city.name}`,
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

export default async function GeoSectionPage({ params }: GeoSectionPageProps) {
  const { ciudad, seccion } = await params;
  const city = getCityBySlug(ciudad);
  const sectionMeta = VALID_SECTION_SLUGS[seccion];

  if (!city || !sectionMeta) {
    notFound();
  }

  // Render Section Component based on seccion slug
  switch (seccion) {
    case 'comercios':
      return <ComerciosPage />;
    case 'catalogo':
      return <CatalogoPage />;
    case 'sorteos':
      return <SorteosPage />;
    case 'empleos':
    case 'clasificados':
      return <EmpleosPage />;
    case 'comunidad':
      return <ComunidadPage />;
    case 'turismo':
      return <TurismoPage />;
    default:
      notFound();
  }
}
