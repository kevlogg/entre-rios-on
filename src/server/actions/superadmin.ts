'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function toggleCommerceVerificationAction(
  commerceId: string,
  currentStatus: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, message: 'No autorizado.' };
      }

      const { error } = await supabase
        .from('commerces')
        .update({ is_verified: !currentStatus })
        .eq('id', commerceId);

      if (error) {
        return { success: false, message: `Error cambiando estado: ${error.message}` };
      }

      revalidatePath('/superadmin');
      return { success: true, message: 'Estado de verificación actualizado en Supabase.' };
    }

    revalidatePath('/superadmin');
    return { success: true, message: 'Verificación actualizada.' };
  } catch (err) {
    return { success: false, message: `Error inesperado: ${(err as Error).message}` };
  }
}

export async function createJobAction(jobData: {
  title: string;
  company: string;
  cityName: string;
  provinceId?: string;
  jobType?: string;
  salary?: string;
  description: string;
  phoneWhatsApp: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();
      const { error } = await supabase.from('jobs').insert({
        title: jobData.title,
        company: jobData.company,
        city_name: jobData.cityName,
        province_id: jobData.provinceId || 'entre-rios',
        job_type: jobData.jobType || 'Tiempo Completo',
        salary: jobData.salary || 'A convenir',
        description: jobData.description,
        phone_whatsapp: jobData.phoneWhatsApp,
        status: 'APPROVED'
      });

      if (error) {
        return { success: false, message: `Error registrando en Supabase: ${error.message}` };
      }

      revalidatePath('/empleos');
      revalidatePath('/superadmin');
      return { success: true, message: 'Oferta laboral registrada exitosamente en Supabase.' };
    }

    revalidatePath('/empleos');
    return { success: true, message: 'Empleo publicado correctamente.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function createWebRequestAction(requestData: {
  businessName: string;
  contactName: string;
  phoneWhatsApp: string;
  email?: string;
  desiredDomain?: string;
  notes?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();
      const { error } = await supabase.from('web_requests').insert({
        business_name: requestData.businessName,
        contact_name: requestData.contactName,
        phone_whatsapp: requestData.phoneWhatsApp,
        email: requestData.email,
        desired_domain: requestData.desiredDomain,
        notes: requestData.notes,
        status: 'PENDING'
      });

      if (error) {
        return { success: false, message: `Error guardando en Supabase: ${error.message}` };
      }

      revalidatePath('/mi-sitio-web');
      revalidatePath('/superadmin');
      return { success: true, message: 'Solicitud enviada e ingresada en Supabase.' };
    }

    revalidatePath('/mi-sitio-web');
    return { success: true, message: 'Solicitud registrada correctamente.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function saveProvinceConfigAction(config: {
  provinceId: string;
  name: string;
  bannerDesktop: string;
  bannerMobile: string;
  textColor?: string;
  buttonBgColor?: string;
  cardAccentColor?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();
      const { error } = await supabase.from('province_configs').upsert({
        id: config.provinceId,
        name: config.name,
        banner_desktop: config.bannerDesktop,
        banner_mobile: config.bannerMobile,
        text_color: config.textColor || '#0047BA',
        button_bg_color: config.buttonBgColor || '#00ADB5',
        card_accent_color: config.cardAccentColor || '#00E5E8',
        updated_at: new Date().toISOString()
      });

      if (error) {
        return { success: false, message: `Error en Supabase: ${error.message}` };
      }

      revalidatePath('/superadmin');
      return { success: true, message: 'Configuración visual de provincia persistida en Supabase.' };
    }

    revalidatePath('/superadmin');
    return { success: true, message: 'Configuración guardada correctamente.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function drawRaffleWinnerAction(
  raffleId: string
): Promise<{ success: boolean; winnerName?: string; winnerPhone?: string; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, message: 'No autorizado.' };
      }

      const { data: participants, error } = await supabase
        .from('raffle_participants')
        .select('*')
        .eq('raffle_id', raffleId);

      if (error || !participants || participants.length === 0) {
        return { success: false, message: 'No se encontraron inscriptos para este sorteo.' };
      }

      const randomIndex = Math.floor(Math.random() * participants.length);
      const winner = participants[randomIndex];

      await supabase
        .from('raffles')
        .update({
          status: 'DRAWN',
          winner_name: winner.full_name,
          winner_phone: winner.phone_whatsapp,
        })
        .eq('id', raffleId);

      revalidatePath('/superadmin');
      revalidatePath('/sorteos');

      return {
        success: true,
        winnerName: winner.full_name,
        winnerPhone: winner.phone_whatsapp,
        message: `¡Ganador seleccionado con éxito: ${winner.full_name}!`,
      };
    }

    const mockWinners = [
      { name: 'Gabriel Benítez (Concordia)', phone: '5493454998877' },
      { name: 'María Elena Rossi (Paraná)', phone: '5493434223344' },
      { name: 'Rodrigo Casaux (Colón)', phone: '5493447411223' },
    ];
    const winner = mockWinners[Math.floor(Math.random() * mockWinners.length)];

    revalidatePath('/superadmin');
    return {
      success: true,
      winnerName: winner.name,
      winnerPhone: winner.phone,
      message: `¡Sorteo ejecutado! Ganador: ${winner.name}`,
    };
  } catch (err) {
    return { success: false, message: `Error en sorteador: ${(err as Error).message}` };
  }
}
