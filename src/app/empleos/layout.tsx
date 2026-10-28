import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Bolsa de Empleo & Oportunidades Laborales | ON MÁS Portal',
  description: 'Encontrá ofertas laborales vigentes y publicá búsquedas de empleo en Entre Ríos y Santa Fe. Conexión directa y postulaciones sin intermediarios.',
  alternates: {
    canonical: 'https://onmasportal.com.ar/empleos',
  },
  openGraph: {
    title: 'Bolsa de Empleo & Oportunidades Laborales | ON MÁS Portal',
    description: 'Búsquedas de trabajo y oportunidades laborales verificadas en Entre Ríos y Santa Fe.',
    url: 'https://onmasportal.com.ar/empleos',
    siteName: 'ON MÁS Portal',
    locale: 'es_AR',
    type: 'website',
    images: [{ url: '/logo1.png', width: 1200, height: 630, alt: 'Empleos ON MÁS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bolsa de Empleo & Oportunidades Laborales | ON MÁS',
    description: 'Ofertas laborales y búsquedas de personal en el Litoral.',
    images: ['/logo1.png'],
  },
};

export default function EmpleosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
