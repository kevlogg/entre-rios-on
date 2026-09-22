import type { Metadata } from 'next';
import { Inter, Caveat } from 'next/font/google';
import './globals.css';
import { DesignSwitcherBar } from '@/components/layout/DesignSwitcherBar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
});

const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://onmas.gob.ar'),
  title: 'ON MÁS Portal | Comercio. Comunidad. Oportunidades.',
  description: 'Portal regional híbrido ON MÁS: Directorio Comercial B2B, Catálogo directo a WhatsApp, Turismo, Gastronomía y Agenda de la Comunidad de Entre Ríos, Santa Fe y la región.',
  keywords: [
    'ON MÁS',
    'ONMAS',
    'Entre Ríos',
    'Santa Fe',
    'Paraná',
    'Concordia',
    'Colón',
    'Gualeguaychú',
    'Directorio Comercial',
    'Compras por WhatsApp',
    'Turismo',
    'Gastronomía',
  ],
  authors: [{ name: 'ON MÁS Portal' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'ON MÁS Portal | Toda la región en un solo lugar',
    description: 'Comprá. Vendé. Publicá. Conectá. Toda la región en un solo lugar.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'ON MÁS Portal',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'ON MÁS Logo Oficial',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ON MÁS Portal | Comercio, Turismo y Medios',
    description: 'Directorio Comercial B2B, Catálogo directo a WhatsApp y Portal de Medios y Turismo.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ON MÁS Portal',
    url: 'https://onmas.gob.ar',
    logo: 'https://entreriosonmas.gob.ar/logo.png',
    sameAs: [
      'https://facebook.com',
      'https://instagram.com',
    ],
  };

  return (
    <html lang="es" className={`${inter.variable} ${caveat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fbf9f5] text-slate-800 antialiased selection:bg-[#00ADB5] selection:text-white">
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}

