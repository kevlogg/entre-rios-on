'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';

export async function createProductAction(productData: Partial<Product>): Promise<{ success: boolean; message: string; data?: Product }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Si Supabase está configurado, insertar en base de datos real
    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();

      const { data, error } = await supabase.from('products').insert({
        title: productData.title,
        slug: productData.slug || productData.title?.toLowerCase().replace(/\s+/g, '-') || `prod-${Date.now()}`,
        price: productData.price,
        currency: productData.currency || 'ARS',
        commerce_id: productData.commerceId || 'c1',
        commerce_name: productData.commerceName || 'Comercio Registrado',
        city_id: productData.cityId || 'colon',
        city_name: productData.cityName || 'Colón',
        image_url: productData.imageUrl || '/images/prod-mate.jpg',
        category: productData.category || 'Generales',
        category_id: productData.categoryId || 'hogar',
        is_featured: productData.isFeatured || false,
        description: productData.description || '',
        phone_whatsapp: productData.phoneWhatsApp || '5493447451234',
        whatsapp_message_custom: productData.whatsappMessageCustom,
      }).select().single();

      if (error) {
        return { success: false, message: `Error al guardar producto: ${error.message}` };
      }

      revalidatePath('/admin');
      revalidatePath('/');
      revalidatePath('/ciudad/[slug]', 'page');

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

    // Fallback reactivo sin DB
    revalidatePath('/admin');
    revalidatePath('/');
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
      const supabase = await createClient();
      const { error } = await supabase.from('products').delete().eq('id', productId);

      if (error) {
        return { success: false, message: `Error eliminando oferta: ${error.message}` };
      }

      revalidatePath('/admin');
      revalidatePath('/');
      return { success: true, message: 'Producto eliminado correctamente.' };
    }

    revalidatePath('/admin');
    return { success: true, message: 'Producto eliminado en modo demostración.' };
  } catch (err) {
    return { success: false, message: `Error inesperado: ${(err as Error).message}` };
  }
}
