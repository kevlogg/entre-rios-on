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

      const updatePayload: Record<string, any> = {
        name: profileData.name,
        category: profileData.category,
        description: profileData.description,
        phone_whatsapp: profileData.phoneWhatsApp,
        address: profileData.address,
        updated_at: new Date().toISOString(),
      };

      if (profileData.logoUrl) updatePayload.logo_url = profileData.logoUrl;
      if (profileData.coverUrl) updatePayload.cover_url = profileData.coverUrl;
      if (profileData.provinceId) updatePayload.province_id = profileData.provinceId;
      if (profileData.cityName) updatePayload.city_name = profileData.cityName;
      if (profileData.isDigitalOnly !== undefined) updatePayload.is_digital_only = profileData.isDigitalOnly;
      if (profileData.website) updatePayload.website = profileData.website;

      const { error } = await supabase
        .from('commerces')
        .update(updatePayload)
        .or(`id.eq.${commerceId},slug.eq.${commerceId}`);

      if (error) {
        console.warn('Error al actualizar perfil en Supabase:', error);
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
