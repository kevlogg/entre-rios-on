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

      const { data: { user } } = await supabase.auth.getUser();

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
      if (profileData.cityId) updatePayload.city_id = profileData.cityId;
      if (profileData.cityName) updatePayload.city_name = profileData.cityName;
      if (profileData.website) updatePayload.website = profileData.website;
      if (profileData.slug) updatePayload.slug = profileData.slug;

      let targetId: string | null = null;

      if (user) {
        // Asegurar la presencia del perfil en public.profiles para cumplir con commerces_owner_id_fkey
        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || profileData.name || 'Comerciante',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
          updatePayload.owner_id = user.id;
        } catch (profErr) {
          console.warn('Note profile upsert:', profErr);
        }

        const { data: existingCommerce } = await supabase
          .from('commerces')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (existingCommerce) {
          targetId = existingCommerce.id;
        }
      }

      if (targetId) {
        const { error } = await supabase
          .from('commerces')
          .update(updatePayload)
          .eq('id', targetId);

        if (error) {
          console.warn('Error al actualizar perfil en Supabase:', error);
          return { success: false, message: `Error al actualizar perfil: ${error.message}` };
        }
      } else {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(commerceId);

        let updateQuery = supabase.from('commerces').update(updatePayload);
        if (isUuid) {
          updateQuery = updateQuery.eq('id', commerceId);
        } else {
          updateQuery = updateQuery.eq('slug', commerceId);
        }

        const { error: updateErr, data: updatedData } = await updateQuery.select();

        if (updateErr) {
          console.warn('Error al actualizar por ID/slug en Supabase:', updateErr);
          return { success: false, message: `Error al actualizar: ${updateErr.message}` };
        }

        if (user && (!updatedData || updatedData.length === 0)) {
          const cleanName = profileData.name || user.user_metadata?.commerce_name || 'Comercio Adherido';
          const generatedSlug =
            profileData.slug ||
            cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
            `comercio-${user.id.slice(0, 6)}`;

          const insertPayload = {
            name: cleanName,
            slug: generatedSlug,
            category: profileData.category || 'Comercio General',
            province_id: profileData.provinceId || 'santa-fe',
            city_id: profileData.cityId || 'rosario',
            city_name: profileData.cityName || 'Rosario',
            description: profileData.description || 'Comercio adherido al portal ON MÁS.',
            phone_whatsapp: profileData.phoneWhatsApp || '',
            address: profileData.address || '',
            logo_url: profileData.logoUrl || '/images/city-rosario.jpg',
            cover_url: profileData.coverUrl || '/images/city-rosario.jpg',
            website: profileData.website || '',
            is_verified: true,
            is_subscription_active: true,
            owner_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { error: insertErr } = await supabase.from('commerces').insert(insertPayload);
          if (insertErr) {
            console.warn('Error al insertar perfil en Supabase:', insertErr);
            return { success: false, message: `Error al crear registro de comercio: ${insertErr.message}` };
          }
        }
      }

      revalidatePath('/admin');
      revalidatePath('/comercios');
      if (profileData.slug) {
        revalidatePath(`/comercio/${profileData.slug}`);
      }
      revalidatePath('/comercio/[slug]', 'page');
      return { success: true, message: '¡Perfil comercial actualizado correctamente!' };
    }

    revalidatePath('/admin');
    return { success: true, message: '¡Perfil actualizado en modo demostración!' };
  } catch (err) {
    return { success: false, message: `Error inesperado: ${(err as Error).message}` };
  }
}

export async function registerCommerceOnSignUpAction(data: {
  userId: string;
  email: string;
  commerceName: string;
  phoneWhatsApp: string;
  provinceId: string;
  cityId: string;
  cityName: string;
  fullName?: string;
}): Promise<{ success: boolean; message: string; slug?: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();

      // 1. Asegurar la presencia del perfil en public.profiles para la FK commerces_owner_id_fkey
      try {
        await supabase.from('profiles').upsert({
          id: data.userId,
          email: data.email,
          full_name: data.fullName || data.commerceName,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
      } catch (profErr) {
        console.warn('Profile upsert note:', profErr);
      }

      // 2. Resolver slug único
      const cleanSlug = data.commerceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `comercio-${Date.now()}`;
      
      const { data: existingSlug } = await supabase
        .from('commerces')
        .select('id')
        .eq('slug', cleanSlug)
        .maybeSingle();

      const finalSlug = existingSlug ? `${cleanSlug}-${Date.now().toString().slice(-4)}` : cleanSlug;

      // 3. Insertar el comercio en Supabase
      const { error: insertErr } = await supabase.from('commerces').insert({
        name: data.commerceName,
        slug: finalSlug,
        category: 'Comercio General',
        province_id: data.provinceId,
        city_id: data.cityId,
        city_name: data.cityName,
        description: `Comercio adherido al portal ON MÁS en ${data.cityName}.`,
        phone_whatsapp: data.phoneWhatsApp || '',
        address: `${data.cityName}, Argentina`,
        logo_url: '/images/city-rosario.jpg',
        cover_url: '/images/city-rosario.jpg',
        is_verified: true,
        is_subscription_active: true,
        owner_id: data.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insertErr) {
        console.warn('Error registrando comercio en Supabase:', insertErr);
        return { success: false, message: insertErr.message };
      }

      revalidatePath('/admin');
      revalidatePath('/comercios');
      return { success: true, message: 'Comercio registrado con éxito', slug: finalSlug };
    }

    return { success: true, message: 'Comercio registrado en modo demostración' };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
}

