import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Novedades, Agenda & Eventos Culturales | ON MÁS Portal',
  description: 'Conocé la agenda de eventos, fiestas regionales, ferias, actividades culturales y noticias de la comunidad de Entre Ríos y Santa Fe.',
  alternates: {
    canonical: 'https://onmasportal.com.ar/novedades',
  },
  openGraph: {
    title: 'Novedades, Agenda & Eventos Culturales | ON MÁS Portal',
    description: 'Fiestas populares, ferias y actividades en Entre Ríos y Santa Fe.',
    url: 'https://onmasportal.com.ar/novedades',
    siteName: 'ON MÁS Portal',
    locale: 'es_AR',
    type: 'website',
    images: [{ url: '/logo1.png', width: 1200, height: 630, alt: 'Novedades ON MÁS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Novedades & Agenda del Litoral | ON MÁS',
    description: 'Enterate de las novedades y eventos más importantes de la región.',
    images: ['/logo1.png'],
  },
};

export default function NovedadesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
