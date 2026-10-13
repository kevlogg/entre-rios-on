import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ON+ Portal Comercial',
    short_name: 'ON+ Portal',
    description: 'Portal Oficial del Comercio, Turismo y Medios de Santa Fe y Entre Ríos',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0047BA',
    orientation: 'portrait',
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
        purpose: 'maskable',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
