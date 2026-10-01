import { redirect } from 'next/navigation';

export default async function SuperAdminSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  let resolvedTab = section;
  if (section === 'planes') {
    resolvedTab = 'planes';
  } else if (section === 'provincias' || section === 'banners') {
    resolvedTab = 'geo-customizer';
  } else if (section === 'pagos' || section === 'efectivo') {
    resolvedTab = 'cash-payments';
  }
  redirect(`/superadmin?tab=${resolvedTab}`);
}
