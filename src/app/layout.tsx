import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Entre Ríos ON | Portal Regional, Comercio B2B & Medios',
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
  authors: [{ name: 'Entre Ríos ON' }],
  openGraph: {
    title: 'Entre Ríos ON | Conectando Comercio, Turismo y Comunidad',
    description: 'El portal enterprise definitivo para impulsar la economía y cultura litoraleña.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'Entre Ríos ON',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#fbf9f5] text-slate-800 antialiased selection:bg-[#1d5b79] selection:text-white">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
