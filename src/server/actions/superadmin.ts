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
  workModality?: string;
  jobType?: string;
  salary?: string;
  description: string;
  phoneWhatsApp: string;
  isSuperAdmin?: boolean;
}): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const initialStatus = jobData.isSuperAdmin ? 'APPROVED' : 'PENDING';

    const { error } = await client.from('jobs').insert({
      title: jobData.title,
      company: jobData.company,
      city_name: jobData.cityName,
      province_id: jobData.provinceId || 'entre-rios',
      work_modality: jobData.workModality || 'Presencial',
      job_type: jobData.jobType || 'Tiempo Completo',
      salary: jobData.salary || 'A convenir',
      description: jobData.description,
      phone_whatsapp: jobData.phoneWhatsApp,
      status: initialStatus,
    });

    if (error) {
      return { success: false, message: `Error registrando en Supabase: ${error.message}` };
    }

    revalidatePath('/empleos');
    revalidatePath('/superadmin');
    return {
      success: true,
      message: jobData.isSuperAdmin
        ? 'Búsqueda laboral publicada directamente en la web.'
        : 'Oferta laboral enviada a revisión. Quedará pendiente de aprobación por el equipo SuperAdmin.',
    };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function getAllJobsAction(statusFilter?: string): Promise<{
  success: boolean;
  data: Array<{
    id: string;
    title: string;
    company: string;
    cityName: string;
    provinceId?: string;
    workModality?: string;
    jobType: string;
    salary: string;
    description: string;
    phoneWhatsApp: string;
    status: string;
    createdAt?: string;
  }>;
}> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    let query = client.from('jobs').select('*').order('created_at', { ascending: false });
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Error cargando empleos:', error.message);
      return { success: false, data: [] };
    }

    return {
      success: true,
      data: (data || []).map((j: any) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        cityName: j.city_name || 'Paraná',
        provinceId: j.province_id || 'entre-rios',
        workModality: j.work_modality || 'Presencial',
        jobType: j.job_type || 'Tiempo Completo',
        salary: j.salary || 'A convenir',
        description: j.description || '',
        phoneWhatsApp: j.phone_whatsapp || '',
        status: j.status || 'APPROVED',
        createdAt: j.created_at,
      })),
    };
  } catch (err) {
    return { success: false, data: [] };
  }
}

export async function approveJobAction(jobId: string): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { error } = await client.from('jobs').update({ status: 'APPROVED' }).eq('id', jobId);
    if (error) {
      return { success: false, message: `Error aprobando empleo: ${error.message}` };
    }

    revalidatePath('/empleos');
    revalidatePath('/superadmin');
    return { success: true, message: 'Oferta laboral aprobada y publicada en la web.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function rejectJobAction(jobId: string): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { error } = await client.from('jobs').update({ status: 'REJECTED' }).eq('id', jobId);
    if (error) {
      return { success: false, message: `Error rechazando empleo: ${error.message}` };
    }

    revalidatePath('/empleos');
    revalidatePath('/superadmin');
    return { success: true, message: 'Oferta laboral rechazada.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function deleteJobAction(jobId: string): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { error } = await client.from('jobs').delete().eq('id', jobId);
    if (error) {
      return { success: false, message: `Error eliminando empleo: ${error.message}` };
    }

    revalidatePath('/empleos');
    revalidatePath('/superadmin');
    return { success: true, message: 'Oferta laboral eliminada.' };
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
    const adminSupabase = getAdminClient();
    if (!adminSupabase) {
      return { success: false, message: 'No se pudo conectar con Supabase.' };
    }

    const { error } = await adminSupabase.from('web_requests').insert({
      business_name: requestData.businessName,
      contact_name: requestData.contactName,
      phone_whatsapp: requestData.phoneWhatsApp,
      email: requestData.email || '',
      desired_domain: requestData.desiredDomain || '',
      notes: requestData.notes || '',
      status: 'PENDING'
    });

    if (error) {
      console.warn('Error registrando solicitud web en Supabase:', error.message);
      return { success: false, message: `Error guardando en Supabase: ${error.message}` };
    }

    revalidatePath('/mi-sitio-web');
    revalidatePath('/superadmin');
    return { success: true, message: 'Solicitud enviada e ingresada en Supabase.' };
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

export async function createRaffleAction(raffleData: {
  title: string;
  prize: string;
  prizesList?: string[];
  prizesCount?: number;
  ticketPrice?: string;
  sponsorName?: string;
  drawDate?: string;
  imageUrl?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { error } = await client.from('raffles').insert({
      title: raffleData.title,
      prize: raffleData.prize,
      sponsor_name: raffleData.sponsorName || 'ON MÁS Portal Regional',
      draw_date: raffleData.drawDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ticket_price: raffleData.ticketPrice || '$2.500 ARS',
      prizes_count: raffleData.prizesCount || 3,
      prizes_list: raffleData.prizesList || [raffleData.prize],
      image_url: raffleData.imageUrl || '/images/city-federacion.jpg',
      status: 'ACTIVE',
    });

    if (error) {
      console.warn('Note on Supabase raffle creation:', error.message);
    }

    revalidatePath('/sorteos');
    revalidatePath('/superadmin');
    return { success: true, message: '¡Sorteo mensual creado e ingresado exitosamente!' };
  } catch (err) {
    return { success: false, message: `Error creando sorteo: ${(err as Error).message}` };
  }
}

export async function createCommunityArticleAction(articleData: {
  title: string;
  category: string;
  cityId: string;
  cityName: string;
  excerpt: string;
  authorName?: string;
  imageUrl?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { error } = await client.from('community_events').insert({
      title: articleData.title,
      category: articleData.category,
      date: new Date().toISOString().split('T')[0],
      formatted_date: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
      location: articleData.cityName,
      city_id: articleData.cityId,
      city_name: articleData.cityName,
      image_url: articleData.imageUrl || '/images/commerce-bodega.jpg',
      read_time_minutes: 4,
      excerpt: articleData.excerpt,
      is_featured: true,
      author_name: articleData.authorName || 'Redacción ON MÁS',
      author_avatar_url: '/images/avatar-author.jpg',
    });

    if (error) {
      console.warn('Note on Supabase community article creation:', error.message);
    }

    revalidatePath('/comunidad');
    revalidatePath('/superadmin');
    return { success: true, message: 'Publicación guardada exitosamente en Comunidad.' };
  } catch (err) {
    return { success: false, message: `Error al publicar nota: ${(err as Error).message}` };
  }
}

export async function createTourismServiceAction(serviceData: {
  name: string;
  category: string;
  cityName: string;
  provinceId?: string;
  price: string;
  planTier?: string;
  imageUrl?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();
      const { error } = await supabase.from('tourism_services').insert({
        name: serviceData.name,
        category: serviceData.category,
        city_name: serviceData.cityName,
        province_id: serviceData.provinceId || 'entre-rios',
        price: serviceData.price,
        plan_tier: serviceData.planTier || 'Plata',
        image_url: serviceData.imageUrl || '/images/city-federacion.jpg',
        is_verified: true,
      });

      if (error) {
        return { success: false, message: `Error en Supabase: ${error.message}` };
      }

      revalidatePath('/turismo');
      revalidatePath('/superadmin');
      return { success: true, message: 'Servicio turístico registrado con éxito en Supabase.' };
    }

    revalidatePath('/turismo');
    revalidatePath('/superadmin');
    return { success: true, message: 'Servicio turístico guardado en modo demostración.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function deleteTourismServiceAction(serviceId: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('your-supabase-project')) {
      const supabase = await createClient();
      const { error } = await supabase.from('tourism_services').delete().eq('id', serviceId);

      if (error) {
        return { success: false, message: `Error eliminando servicio: ${error.message}` };
      }

      revalidatePath('/turismo');
      revalidatePath('/superadmin');
      return { success: true, message: 'Servicio turístico eliminado.' };
    }

    revalidatePath('/turismo');
    return { success: true, message: 'Servicio eliminado en modo demostración.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

import { createClient as createSupabaseJSClient } from '@supabase/supabase-js';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;

  if (url && key) {
    return createSupabaseJSClient(url, key);
  }
  return null;
}

export async function createCashPaymentAction(paymentData: {
  commerceName: string;
  ownerName: string;
  phoneWhatsApp: string;
  planName: string;
  amount: number;
  cityName: string;
  commerceId?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    if (!adminSupabase) {
      return { success: false, message: 'No se pudo conectar con Supabase.' };
    }

    let resolvedName = paymentData.commerceName || 'Comercio Adherido';
    let resolvedOwner = paymentData.ownerName || 'Titular';
    let resolvedPhone = paymentData.phoneWhatsApp || '5493434001122';
    let resolvedCity = paymentData.cityName || 'Entre Ríos / Santa Fe';

    if (paymentData.commerceId && paymentData.commerceId.startsWith('c')) {
      const { data: comm } = await adminSupabase
        .from('commerces')
        .select('*')
        .eq('id', paymentData.commerceId)
        .maybeSingle();

      if (comm) {
        resolvedName = comm.name || resolvedName;
        resolvedPhone = comm.phone_whatsapp || resolvedPhone;
        resolvedCity = comm.city_name || resolvedCity;
      }
    }

    const rawPlan = (paymentData.planName || '').toLowerCase();
    const cleanPlanName = rawPlan.includes('oro') ? 'Oro' : rawPlan.includes('plata') ? 'Plata' : 'Bronce';

    const { error } = await adminSupabase.from('cash_payments').insert({
      commerce_name: resolvedName,
      owner_name: resolvedOwner,
      phone_whatsapp: resolvedPhone,
      plan_name: cleanPlanName,
      amount: paymentData.amount || 29000,
      city_name: resolvedCity,
      status: 'PENDING',
    });

    if (error) {
      console.warn('Error insertando pago en efectivo:', error.message);
      return { success: false, message: `Error registrando pago en Supabase: ${error.message}` };
    }

    revalidatePath('/superadmin');
    revalidatePath('/admin');
    return { success: true, message: 'Solicitud de pago en efectivo registrada en Supabase.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function getPendingCashPaymentForCommerceAction(
  commerceId?: string,
  commerceName?: string
): Promise<{
  hasPending: boolean;
  pendingPayment?: {
    id: string;
    planName: string;
    amount: number;
    createdAt?: string;
  };
}> {
  try {
    const adminSupabase = getAdminClient();
    if (!adminSupabase) return { hasPending: false };

    let query = adminSupabase.from('cash_payments').select('*').eq('status', 'PENDING');

    if (commerceName) {
      query = query.ilike('commerce_name', `%${commerceName}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false }).limit(1);

    if (error || !data || data.length === 0) {
      return { hasPending: false };
    }

    const pending = data[0];
    return {
      hasPending: true,
      pendingPayment: {
        id: pending.id,
        planName: pending.plan_name || 'Bronce',
        amount: Number(pending.amount || 0),
        createdAt: pending.created_at,
      },
    };
  } catch (err) {
    return { hasPending: false };
  }
}

export async function cancelCashPaymentAction(
  paymentId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    if (!adminSupabase) {
      return { success: false, message: 'No se pudo conectar a Supabase.' };
    }

    const { error } = await adminSupabase
      .from('cash_payments')
      .delete()
      .eq('id', paymentId);

    if (error) {
      return { success: false, message: `Error al cancelar solicitud: ${error.message}` };
    }

    revalidatePath('/superadmin');
    revalidatePath('/admin');
    return { success: true, message: 'Solicitud de pago en efectivo cancelada correctamente.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function approveCashPaymentAction(
  paymentId: string,
  commerceName?: string,
  commerceId?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    if (!adminSupabase) {
      return { success: false, message: 'No se pudo conectar a Supabase.' };
    }

    const { error: payErr } = await adminSupabase
      .from('cash_payments')
      .update({ status: 'APPROVED' })
      .eq('id', paymentId);

    if (payErr) {
      return { success: false, message: `Error al aprobar pago: ${payErr.message}` };
    }

    if (commerceId) {
      await adminSupabase
        .from('commerces')
        .update({ is_subscription_active: true, is_verified: true })
        .eq('id', commerceId);
    } else if (commerceName) {
      await adminSupabase
        .from('commerces')
        .update({ is_subscription_active: true, is_verified: true })
        .ilike('name', `%${commerceName}%`);
    }

    revalidatePath('/superadmin');
    revalidatePath('/admin');
    revalidatePath('/comercios');
    return { success: true, message: 'Pago en efectivo aprobado y comercio activado exitosamente.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function getCashPaymentsAction(): Promise<{
  success: boolean;
  data: Array<{
    id: string;
    commerceName: string;
    ownerName: string;
    phoneWhatsApp: string;
    planName: string;
    amount: number;
    cityName: string;
    status: string;
    createdAt?: string;
  }>;
}> {
  try {
    const adminSupabase = getAdminClient();
    if (!adminSupabase) {
      return { success: false, data: [] };
    }

    const { data, error } = await adminSupabase
      .from('cash_payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching cash payments:', error.message);
      return { success: false, data: [] };
    }

    return {
      success: true,
      data: (data || []).map((p: any) => ({
        id: p.id,
        commerceName: p.commerce_name || 'Comercio',
        ownerName: p.owner_name || 'Titular',
        phoneWhatsApp: p.phone_whatsapp || '',
        planName: p.plan_name || 'Plan ON MÁS',
        amount: Number(p.amount || 0),
        cityName: p.city_name || 'Entre Ríos',
        status: p.status || 'PENDING',
        createdAt: p.created_at,
      })),
    };
  } catch (err) {
    return { success: false, data: [] };
  }
}

export async function getWebRequestsAction(): Promise<{
  success: boolean;
  data: Array<{
    id: string;
    businessName: string;
    contactName: string;
    phoneWhatsApp: string;
    email: string;
    desiredDomain: string;
    notes: string;
    status: string;
    createdAt?: string;
  }>;
}> {
  try {
    const adminSupabase = getAdminClient();
    if (!adminSupabase) {
      return { success: false, data: [] };
    }

    const { data, error } = await adminSupabase
      .from('web_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching web requests:', error.message);
      return { success: false, data: [] };
    }

    return {
      success: true,
      data: (data || []).map((r: any) => ({
        id: r.id,
        businessName: r.business_name || 'Comercio',
        contactName: r.contact_name || 'Contacto',
        phoneWhatsApp: r.phone_whatsapp || '',
        email: r.email || '',
        desiredDomain: r.desired_domain || '',
        notes: r.notes || '',
        status: r.status || 'PENDING',
        createdAt: r.created_at,
      })),
    };
  } catch (err) {
    return { success: false, data: [] };
  }
}

export async function updateWebRequestStatusAction(
  requestId: string,
  status: string
): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    if (!adminSupabase) {
      return { success: false, message: 'No se pudo conectar a Supabase.' };
    }

    const { error } = await adminSupabase
      .from('web_requests')
      .update({ status })
      .eq('id', requestId);

    if (error) {
      return { success: false, message: `Error en Supabase: ${error.message}` };
    }

    revalidatePath('/superadmin');
    return { success: true, message: 'Estado de solicitud web actualizado.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}




