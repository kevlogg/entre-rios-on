import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Entre Ríos ON MÁS Portal',
    short_name: 'EntreRíosON',
    description: 'Portal Oficial del Comercio, Turismo y Medios de la Provincia de Entre Ríos',
    start_url: '/',
    display: 'standalone',
    background_color: '#002878',
    theme_color: '#00ADB5',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
