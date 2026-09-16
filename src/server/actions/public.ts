'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function registerRaffleParticipantAction(data: {
  raffleId?: string;
  fullName: string;
  phoneWhatsApp: string;
  cityName: string;
  email?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();

      // Si no se pasó raffleId específico, buscar el primer sorteo activo
      let targetRaffleId = data.raffleId;
      if (!targetRaffleId) {
        const { data: activeRaffle } = await supabase
          .from('raffles')
          .select('id')
          .eq('status', 'ACTIVE')
          .single();

        if (activeRaffle) {
          targetRaffleId = activeRaffle.id;
        }
      }

      if (!targetRaffleId) {
        return { success: false, message: 'No hay sorteos activos en este momento.' };
      }

      const { error } = await supabase.from('raffle_participants').insert({
        raffle_id: targetRaffleId,
        full_name: data.fullName,
        phone_whatsapp: data.phoneWhatsApp,
        city_name: data.cityName,
        email: data.email || null,
      });

      if (error) {
        return { success: false, message: `Error al inscribirse: ${error.message}` };
      }

      revalidatePath('/sorteos');
      revalidatePath('/superadmin');

      return {
        success: true,
        message: '¡Inscripción confirmada! Ya estás participando del Sorteo ON.',
      };
    }

    revalidatePath('/sorteos');
    return {
      success: true,
      message: '¡Inscripción registrada con éxito en modo demostración!',
    };
  } catch (err) {
    return { success: false, message: `Error inesperado: ${(err as Error).message}` };
  }
}

export async function createClassifiedAction(data: {
  title: string;
  category: string;
  cityName: string;
  price: string;
  imageUrl?: string;
  description: string;
  phoneWhatsApp: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    if (data.category.toLowerCase().includes('vehíc') || data.category.toLowerCase().includes('auto')) {
      return {
        success: false,
        message: 'No se permite la publicación de autos o vehículos en Clasificados ON. Te invitamos a hacerlo en nuestro socio comercial Sitio Automotor (https://sitio-automotor.vercel.app/).',
      };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();

      const { error } = await supabase.from('classifieds').insert({
        title: data.title,
        category: data.category,
        city_name: data.cityName,
        price: data.price,
        image_url: data.imageUrl || '/images/bento-6.jpg',
        description: data.description,
        phone_whatsapp: data.phoneWhatsApp,
        status: 'APPROVED',
      });

      if (error) {
        return { success: false, message: `Error al publicar anuncio: ${error.message}` };
      }

      revalidatePath('/clasificados');
      return {
        success: true,
        message: '¡Tu clasificado fue publicado exitosamente en Entre Ríos ON!',
      };
    }

    revalidatePath('/clasificados');
    return {
      success: true,
      message: '¡Aviso publicado con éxito en modo demostración!',
    };
  } catch (err) {
    return { success: false, message: `Error inesperado: ${(err as Error).message}` };
  }
}

