import { redirect } from 'next/navigation';

export default function SuperAdminPlanesRedirectPage() {
  redirect('/superadmin?tab=planes');
}
