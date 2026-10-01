import { redirect } from 'next/navigation';

export default async function SuperAdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  
  const tabMap: Record<string, string> = {
    'planes': 'planes',
    'subscription-plans': 'planes',
    'provincias': 'geo-customizer',
    'banners': 'geo-customizer',
    'geo-customizer': 'geo-customizer',
    'comercios': 'commerces',
    'commerces': 'commerces',
    'turismo': 'tourism',
    'tourism': 'tourism',
    'pagos': 'cash-payments',
    'efectivo': 'cash-payments',
    'cash-payments': 'cash-payments',
    'sorteos': 'raffles',
    'raffles': 'raffles',
    'empleos': 'jobs',
    'jobs': 'jobs',
    'noticias': 'news',
    'comunidad': 'news',
    'news': 'news',
    'web': 'web-requests',
    'mi-sitio-web': 'web-requests',
    'web-requests': 'web-requests',
    'qr': 'qr-generator',
    'qr-generator': 'qr-generator',
    'kevdev': 'plan-kevdev',
    'plan-kevdev': 'plan-kevdev',
  };

  const resolvedTab = tabMap[section.toLowerCase()] || section;
  redirect(`/superadmin?tab=${resolvedTab}`);
}
