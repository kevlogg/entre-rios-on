import { redirect } from 'next/navigation';

export default function SuperAdminComerciosRedirectPage() {
  redirect('/superadmin?tab=commerces');
}
