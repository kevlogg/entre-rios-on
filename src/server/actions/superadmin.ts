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

      // Verificar sesión activa
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
      return { success: true, message: 'Estado de verificación actualizado.' };
    }

    revalidatePath('/superadmin');
    return { success: true, message: 'Verificación actualizada en modo demostración.' };
  } catch (err) {
    return { success: false, message: `Error inesperado: ${(err as Error).message}` };
  }
}

export async function drawRaffleWinnerAction(
  raffleId: string
): Promise<{ success: boolean; winnerName?: string; winnerPhone?: string; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();

      // Verificar sesión activa
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, message: 'No autorizado.' };
      }

      // Obtener todos los participantes del sorteo
      const { data: participants, error } = await supabase
        .from('raffle_participants')
        .select('*')
        .eq('raffle_id', raffleId);

      if (error || !participants || participants.length === 0) {
        return { success: false, message: 'No se encontraron inscriptos para este sorteo.' };
      }

      // Elegir ganador al azar
      const randomIndex = Math.floor(Math.random() * participants.length);
      const winner = participants[randomIndex];

      // Actualizar sorteo con datos del ganador
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

    // Fallback simulación
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
      message: `¡Sorteo ejecutado en modo demostración! Ganador: ${winner.name}`,
    };
  } catch (err) {
    return { success: false, message: `Error en sorteador: ${(err as Error).message}` };
  }
}
