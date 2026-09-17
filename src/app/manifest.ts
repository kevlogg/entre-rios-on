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
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
