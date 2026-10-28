import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Creá tu Sitio Web Comercial | ON MÁS Portal',
  description: 'Tené tu propio sitio web profesional con catálogo digital, dominio propio y ventas directas por WhatsApp con el respaldo de ON MÁS.',
  alternates: {
    canonical: 'https://onmasportal.com.ar/mi-sitio-web',
  },
  openGraph: {
    title: 'Creá tu Sitio Web Comercial | ON MÁS Portal',
    description: 'Tu sitio web profesional con catálogo y conexión directa a WhatsApp.',
    url: 'https://onmasportal.com.ar/mi-sitio-web',
    siteName: 'ON MÁS Portal',
    locale: 'es_AR',
    type: 'website',
    images: [{ url: '/logo1.png', width: 1200, height: 630, alt: 'Tu Sitio Web con ON MÁS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Creá tu Sitio Web Comercial | ON MÁS',
    description: 'Digitalizá tu comercio con un sitio web rápido y moderno.',
    images: ['/logo1.png'],
  },
};

export default function MiSitioWebLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
