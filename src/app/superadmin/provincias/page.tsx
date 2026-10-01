import { redirect } from 'next/navigation';

export default function SuperAdminProvinciasRedirectPage() {
  redirect('/superadmin?tab=provincias');
}
