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
  title: 'Entre Ríos ON Portal | Comercio. Comunidad. Oportunidades.',
  description: 'Portal regional híbrido de Entre Ríos: Directorio Comercial B2B, Catálogo directo a WhatsApp, Turismo, Gastronomía y Agenda de la Comunidad de Paraná, Concordia, Colón, Gualeguaychú y la provincia.',
  keywords: [
    'Entre Ríos',
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
  authors: [{ name: 'Entre Ríos ON Portal' }],
  openGraph: {
    title: 'Entre Ríos ON Portal | Toda la provincia en un solo lugar',
    description: 'Comprá. Vendé. Publicá. Conectá. Toda la provincia en un solo lugar.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'Entre Ríos ON Portal',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${caveat.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#fbf9f5] text-slate-800 antialiased selection:bg-[#00a859] selection:text-white pt-11">
        {/* Floating Design Comparison Switcher Bar */}
        <DesignSwitcherBar />

        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
