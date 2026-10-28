import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Sorteos Exclusivos & Premios Comerciales | ON MÁS Portal',
  description: 'Participá gratis en los sorteos organizados por comercios de Entre Ríos y Santa Fe. Premios, vouchers de compra y promociones directas por WhatsApp.',
  alternates: {
    canonical: 'https://onmasportal.com.ar/sorteos',
  },
  openGraph: {
    title: 'Sorteos Exclusivos & Premios Comerciales | ON MÁS Portal',
    description: 'Participá gratis en sorteos y ganá premios de comercios regionales.',
    url: 'https://onmasportal.com.ar/sorteos',
    siteName: 'ON MÁS Portal',
    locale: 'es_AR',
    type: 'website',
    images: [{ url: '/logo1.png', width: 1200, height: 630, alt: 'Sorteos ON MÁS' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sorteos & Premios Comerciales | ON MÁS',
    description: 'Participá gratis y ganá premios de los mejores comercios.',
    images: ['/logo1.png'],
  },
};

export default function SorteosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
