'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Product } from '@/types';

export async function createProductAction(productData: Partial<Product>): Promise<{ success: boolean; message: string; data?: Product }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabaseUserClient = await createClient();
      const supabase = createAdminClient();

      const { data: { user } } = await supabaseUserClient.auth.getUser();

      let targetCommerceId = productData.commerceId;
      let targetCommerceName = productData.commerceName;
      let targetCityId = productData.cityId;
      let targetCityName = productData.cityName;
      let targetProvinceId = productData.provinceId;
      let targetPhone = productData.phoneWhatsApp;

      if (user) {
        const { data: userComm } = await supabase
          .from('commerces')
          .select('id, name, city_id, city_name, province_id, phone_whatsapp')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (userComm) {
          targetCommerceId = userComm.id;
          if (!targetCommerceName) targetCommerceName = userComm.name;
          if (!targetCityId) targetCityId = userComm.city_id;
          if (!targetCityName) targetCityName = userComm.city_name;
          if (!targetProvinceId) targetProvinceId = userComm.province_id;
          if (!targetPhone) targetPhone = userComm.phone_whatsapp;
        }
      }

      // Si aún no tenemos targetCommerceId de UUID válido, obtener el primer comercio disponible como fallback
      const isUuid = targetCommerceId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetCommerceId);
      if (!isUuid) {
        const { data: fallbackComm } = await supabase
          .from('commerces')
          .select('id, name, city_id, city_name, province_id, phone_whatsapp')
          .limit(1)
          .maybeSingle();

        if (fallbackComm) {
          targetCommerceId = fallbackComm.id;
          if (!targetCommerceName) targetCommerceName = fallbackComm.name;
          if (!targetCityId) targetCityId = fallbackComm.city_id;
          if (!targetCityName) targetCityName = fallbackComm.city_name;
          if (!targetProvinceId) targetProvinceId = fallbackComm.province_id;
          if (!targetPhone) targetPhone = fallbackComm.phone_whatsapp;
        }
      }

      const insertPayload: any = {
        title: productData.title,
        slug: productData.slug || productData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`,
        price: productData.price,
        currency: productData.currency || 'ARS',
        commerce_id: targetCommerceId,
        commerce_name: targetCommerceName || 'Comercio Registrado',
        province_id: targetProvinceId || 'santa-fe',
        city_id: targetCityId || 'rosario',
        city_name: targetCityName || 'Rosario',
        image_url: productData.imageUrl || '/images/city-rosario.jpg',
        category: productData.category || 'Generales',
        category_id: productData.categoryId || 'hogar',
        is_featured: productData.isFeatured ?? true,
        description: productData.description || '',
        phone_whatsapp: targetPhone || '5493415550199',
        whatsapp_message_custom: productData.whatsappMessageCustom,
      };

      const { data, error } = await supabase.from('products').insert(insertPayload).select().single();

      if (error) {
        console.error('Error al insertar producto en Supabase:', error.message);
        return { success: false, message: `Error al guardar producto: ${error.message}` };
      }

      try {
        revalidatePath('/admin');
        revalidatePath('/');
        revalidatePath('/ciudad/[slug]', 'page');
      } catch (revErr) {
        console.warn('revalidatePath note:', revErr);
      }

      return {
        success: true,
        message: '¡Producto publicado exitosamente!',
        data: {
          id: data.id,
          title: data.title,
          slug: data.slug,
          price: Number(data.price),
          currency: data.currency,
          commerceId: data.commerce_id,
          commerceName: data.commerce_name,
          cityId: data.city_id,
          cityName: data.city_name,
          provinceId: data.province_id,
          imageUrl: data.image_url,
          category: data.category,
          categoryId: data.category_id,
          isFeatured: data.is_featured,
          description: data.description,
          phoneWhatsApp: data.phone_whatsapp,
          whatsappMessageCustom: data.whatsapp_message_custom,
        }
      };
    }

    try {
      revalidatePath('/admin');
      revalidatePath('/');
    } catch {}

    return {
      success: true,
      message: '¡Producto publicado en modo demostración!',
    };
  } catch (err) {
    return { success: false, message: `Error inesperado: ${(err as Error).message}` };
  }
}

export async function deleteProductAction(productId: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = createAdminClient();
      const { error } = await supabase.from('products').delete().eq('id', productId);

      if (error) {
        return { success: false, message: `Error eliminando oferta: ${error.message}` };
      }

      try {
        revalidatePath('/admin');
        revalidatePath('/');
      } catch {}

      return { success: true, message: 'Producto eliminado correctamente.' };
    }

    try {
      revalidatePath('/admin');
    } catch {}

    return { success: true, message: 'Producto eliminado en modo demostración.' };
  } catch (err) {
    return { success: false, message: `Error inesperado: ${(err as Error).message}` };
  }
}
