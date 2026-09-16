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
  title: 'Entre Ríos ON MÁS Portal | Comercio. Comunidad. Oportunidades.',
  description: 'Portal regional híbrido de Entre Ríos: Directorio Comercial B2B, Catálogo directo a WhatsApp, Turismo, Gastronomía y Agenda de la Comunidad de Paraná, Concordia, Colón, Gualeguaychú y la provincia.',
  keywords: [
    'Entre Ríos',
    'Santa Fe',
    'Paraná',
    'Concordia',
    'Colón',
    'Gualeguaychú',
    'Directorio Comercial Entre Ríos',
    'Compras por WhatsApp Entre Ríos',
    'Turismo Entre Ríos',
    'Gastronomía de Río',
    'Fiesta de la Artesanía',
  ],
  authors: [{ name: 'Entre Ríos ON MÁS Portal' }],
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/logo.png',
      },
    ],
  },
  openGraph: {
    title: 'Entre Ríos ON MÁS Portal | Toda la provincia en un solo lugar',
    description: 'Comprá. Vendé. Publicá. Conectá. Toda la provincia en un solo lugar.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'Entre Ríos ON MÁS Portal',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Entre Ríos ON MÁS Logo Oficial',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Entre Ríos ON MÁS Portal | Comercio, Turismo y Medios',
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
    name: 'Entre Ríos ON MÁS Portal',
    url: 'https://entreriosonmas.gob.ar',
    logo: 'https://entreriosonmas.gob.ar/logo.png',
    sameAs: [
      'https://facebook.com',
      'https://instagram.com',
    ],
  };

  return (
    <html lang="es" className={`${inter.variable} ${caveat.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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

