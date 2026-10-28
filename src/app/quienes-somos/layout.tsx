import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Quiénes Somos | ON MÁS Portal Regional',
  description: 'Conocé ON MÁS: el ecosistema digital que conecta el comercio, la industria, el turismo y la comunidad de Entre Ríos y Santa Fe sin intermediarios.',
  alternates: {
    canonical: 'https://onmasportal.com.ar/quienes-somos',
  },
  openGraph: {
    title: 'Quiénes Somos | ON MÁS Portal Regional',
    description: 'La plataforma que potencia el crecimiento y visibilidad de los comercios del Litoral.',
    url: 'https://onmasportal.com.ar/quienes-somos',
    siteName: 'ON MÁS Portal',
    locale: 'es_AR',
    type: 'website',
    images: [{ url: '/logo1.png', width: 1200, height: 630, alt: 'Quiénes Somos ON MÁS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quiénes Somos | ON MÁS',
    description: 'El portal de comercio, turismo y oportunidades de la región.',
    images: ['/logo1.png'],
  },
};

export default function QuienesSomosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
