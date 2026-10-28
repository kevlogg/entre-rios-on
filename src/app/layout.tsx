import type { Metadata, Viewport } from 'next';
import { Inter, Caveat } from 'next/font/google';
import './globals.css';
import { DesignSwitcherBar } from '@/components/layout/DesignSwitcherBar';
import { FloatingWhatsAppButton } from '@/components/common/FloatingWhatsAppButton';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';
import { PageBackground } from '@/components/common/PageBackground';
import { PwaInstallPrompt } from '@/components/pwa/PwaInstallPrompt';
import { AuthRecoveryListener } from '@/components/auth/AuthRecoveryListener';
import { AppSplashScreen } from '@/components/common/AppSplashScreen';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0047BA' },
    { media: '(prefers-color-scheme: dark)', color: '#0047BA' },
  ],
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://onmasportal.com.ar'),
  title: {
    default: 'ON MÁS Portal | Directorio Comercial, Catálogo & Turismo del Litoral',
    template: '%s | ON MÁS Portal',
  },
  description: 'Portal regional de Entre Ríos y Santa Fe: Directorio de comercios e industrias, catálogo con compras directas a WhatsApp, turismo, bolsa de empleo y eventos de la comunidad sin comisiones.',
  keywords: [
    'ON MÁS',
    'ON+',
    'ONMAS Portal',
    'Directorio Comercial Entre Ríos',
    'Comercios Santa Fe',
    'Paraná',
    'Rosario',
    'Santa Fe Capital',
    'Concordia',
    'Colón',
    'Gualeguaychú',
    'Compras por WhatsApp',
    'Turismo Entre Ríos',
    'Turismo Santa Fe',
    'Catálogo sin comisiones',
    'Bolsa de Empleo Regional',
  ],
  authors: [{ name: 'ON MÁS Portal' }],
  creator: 'ON MÁS',
  publisher: 'ON MÁS Portal',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://onmasportal.com.ar',
  },
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
    description: 'Comprá, vendé y conectá con cientos de comercios verificados de Entre Ríos y Santa Fe sin comisiones.',
    url: 'https://onmasportal.com.ar',
    type: 'website',
    locale: 'es_AR',
    siteName: 'ON MÁS Portal',
    images: [
      {
        url: '/logo1.png',
        width: 1200,
        height: 630,
        alt: 'ON MÁS Logo Oficial',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ON MÁS Portal | Comercio, Turismo y Oportunidades',
    description: 'Directorio Comercial B2B, Catálogo directo a WhatsApp y Portal de Turismo y Empleos.',
    images: ['/logo1.png'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  other: {
    'geo.region': 'AR-E',
    'geo.placename': 'Entre Ríos, Santa Fe, Argentina',
    'geo.position': '-31.7333;-60.5333',
    'ICBM': '-31.7333, -60.5333',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ON MÁS Portal',
    url: 'https://onmasportal.com.ar',
    logo: 'https://onmasportal.com.ar/logo1.png',
    description: 'Portal regional comercial, catálogo directo a WhatsApp, turismo y oportunidades de Entre Ríos y Santa Fe.',
    sameAs: [
      'https://instagram.com/onmasportal',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+54-9-342-6514889',
      contactType: 'customer support',
      areaServed: ['AR-E', 'AR-S', 'AR'],
      availableLanguage: 'Spanish',
    },
  };

  const webSiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ON MÁS Portal',
    url: 'https://onmasportal.com.ar',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://onmasportal.com.ar/catalogo?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="es" className={`${inter.variable} ${caveat.variable}`} style={{ colorScheme: 'light' }}>
      <head>
        {/* Preconnect & DNS-Prefetch para optimizar Core Web Vitals */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="theme-color" content="#0047BA" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0047BA" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#0047BA" />
        <meta name="forced-colors" content="none" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, '\\u003c') }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd).replace(/</g, '\\u003c') }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                window.__pwaInstallPrompt = null;
                window.addEventListener('beforeinstallprompt', function(e) {
                  e.preventDefault();
                  window.__pwaInstallPrompt = e;
                  window.dispatchEvent(new CustomEvent('pwa-prompt-ready'));
                });
                window.addEventListener('appinstalled', function() {
                  window.__pwaInstallPrompt = null;
                  window.__pwaIsInstalled = true;
                  window.dispatchEvent(new CustomEvent('pwa-app-installed'));
                });
              } catch (err) {}
            `,
          }}
        />
      </head>
      <body 
        className="min-h-screen flex flex-col text-slate-900 bg-[#e2e8f0] antialiased selection:bg-[#00C7B7] selection:text-white app-compact-scale"
        style={{ colorScheme: 'light' }}
      >
        <AppSplashScreen />
        <main className="flex-1">
          {children}
        </main>
        <FloatingWhatsAppButton />
        <ScrollToTopButton />
        <PwaInstallPrompt />
        <AuthRecoveryListener />
      </body>
    </html>
  );
}

