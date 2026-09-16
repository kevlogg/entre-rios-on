'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { Commerce } from '@/types';

export async function updateCommerceProfileAction(
  commerceId: string,
  profileData: Partial<Commerce>
): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();

      const { error } = await supabase
        .from('commerces')
        .update({
          name: profileData.name,
          category: profileData.category,
          description: profileData.description,
          phone_whatsapp: profileData.phoneWhatsApp,
          address: profileData.address,
          instagram: profileData.instagram,
          website: profileData.website,
          updated_at: new Date().toISOString(),
        })
        .eq('id', commerceId);

      if (error) {
        return { success: false, message: `Error al actualizar perfil: ${error.message}` };
      }

      revalidatePath('/admin');
      revalidatePath('/comercio/[slug]', 'page');
      return { success: true, message: '¡Perfil comercial actualizado correctamente!' };
    }

    revalidatePath('/admin');
    return { success: true, message: '¡Perfil actualizado en modo demostración!' };
  } catch (err) {
    return { success: false, message: `Error inesperado: ${(err as Error).message}` };
  }
}
