'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseJSClient } from '@supabase/supabase-js';
import { uploadImageServerAction } from '@/server/actions/storage';
import { PlanConfigItem, DEFAULT_SUBSCRIPTION_PLANS } from '@/lib/services/plans-config';

export async function toggleCommerceVerificationAction(
  commerceId: string,
  currentStatus: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { error } = await client
      .from('commerces')
      .update({ is_verified: !currentStatus })
      .eq('id', commerceId);

    if (error) {
      return { success: false, message: `Error cambiando estado: ${error.message}` };
    }

    revalidatePath('/superadmin');
    return { success: true, message: 'Estado de verificación actualizado en Supabase.' };
  } catch (err) {
    return { success: false, message: `Error inesperado: ${(err as Error).message}` };
  }
}

export async function toggleCommerceSubscriptionAction(
  commerceId: string,
  currentStatus: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());
    const newStatus = !currentStatus;

    const { error } = await client
      .from('commerces')
      .update({ is_subscription_active: newStatus })
      .eq('id', commerceId);

    if (error) {
      return { success: false, message: `Error cambiando suscripción: ${error.message}` };
    }

    revalidatePath('/comercios');
    revalidatePath('/catalogo');
    revalidatePath('/turismo');
    revalidatePath('/superadmin');
    return {
      success: true,
      message: newStatus
        ? 'Plan activado exitosamente. El comercio y sus productos ahora se muestran públicamente.'
        : 'Plan desactivado. El comercio y sus productos fueron ocultados.',
    };
  } catch (err) {
    return { success: false, message: `Error inesperado: ${(err as Error).message}` };
  }
}

export async function deleteCommerceAction(
  commerceId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    try {
      await client.from('products').delete().eq('commerce_id', commerceId);
    } catch (pErr) {
      console.warn('Nota eliminando productos:', pErr);
    }

    const { error } = await client
      .from('commerces')
      .delete()
      .eq('id', commerceId);

    if (error) {
      return { success: false, message: `Error eliminando comercio: ${error.message}` };
    }

    revalidatePath('/comercios');
    revalidatePath('/catalogo');
    revalidatePath('/turismo');
    revalidatePath('/superadmin');

    return { success: true, message: 'Comercio eliminado exitosamente.' };
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
    const modality = jobData.workModality || 'Presencial';

    // Intento 1: Con columna work_modality
    const { error: err1 } = await client.from('jobs').insert({
      title: jobData.title,
      company: jobData.company,
      city_name: jobData.cityName,
      province_id: jobData.provinceId || 'entre-rios',
      work_modality: modality,
      job_type: jobData.jobType || 'Tiempo Completo',
      salary: jobData.salary || 'A convenir',
      description: jobData.description,
      phone_whatsapp: jobData.phoneWhatsApp,
      status: initialStatus,
    });

    if (!err1) {
      revalidatePath('/empleos');
      revalidatePath('/superadmin');
      return {
        success: true,
        message: jobData.isSuperAdmin
          ? 'Búsqueda laboral publicada directamente en la web.'
          : 'Oferta laboral enviada a revisión. Quedará pendiente de aprobación por el equipo OnMás.',
      };
    }

    // Intento 2: Si Supabase reporta falta de columna work_modality en cache, reintentar integrándolo en job_type
    if (err1.message.includes('work_modality') || err1.message.includes('schema cache')) {
      const fallbackJobType = `${jobData.jobType || 'Tiempo Completo'} • ${modality}`;
      const { error: err2 } = await client.from('jobs').insert({
        title: jobData.title,
        company: jobData.company,
        city_name: jobData.cityName,
        province_id: jobData.provinceId || 'entre-rios',
        job_type: fallbackJobType,
        salary: jobData.salary || 'A convenir',
        description: jobData.description,
        phone_whatsapp: jobData.phoneWhatsApp,
        status: initialStatus,
      });

      if (!err2) {
        revalidatePath('/empleos');
        revalidatePath('/superadmin');
        return {
          success: true,
          message: jobData.isSuperAdmin
            ? 'Búsqueda laboral publicada directamente en la web.'
            : 'Oferta laboral enviada a revisión. Quedará pendiente de aprobación por el equipo OnMás.',
        };
      }

      return { success: false, message: `Error registrando en Supabase: ${err2.message}` };
    }

    return { success: false, message: `Error registrando en Supabase: ${err1.message}` };
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
      data: (data || []).map((j: any) => {
        let rawJobType = j.job_type || 'Tiempo Completo';
        let resolvedModality = j.work_modality || 'Presencial';
        if (rawJobType.includes(' • ')) {
          const parts = rawJobType.split(' • ');
          rawJobType = parts[0];
          resolvedModality = parts[1] || resolvedModality;
        }

        return {
          id: j.id,
          title: j.title,
          company: j.company,
          cityName: j.city_name || 'Paraná',
          provinceId: j.province_id || 'entre-rios',
          workModality: resolvedModality,
          jobType: rawJobType,
          salary: j.salary || 'A convenir',
          description: j.description || '',
          phoneWhatsApp: j.phone_whatsapp || '',
          status: j.status || 'APPROVED',
          createdAt: j.created_at,
        };
      }),
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

export async function getProvincesConfigAction(): Promise<{ success: boolean; data: any[] }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { data, error } = await client.storage.from('commerces').download('config/province_config.json');
    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { success: true, data: parsed };
      }
    }
  } catch (err) {
    console.warn('Error fetching provinces config from Supabase storage:', err);
  }
  return { success: false, data: [] };
}

export async function saveProvincesConfigAction(provinces: any[]): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const buffer = Buffer.from(JSON.stringify(provinces, null, 2));
    const { error } = await client.storage.from('commerces').upload('config/province_config.json', buffer, {
      contentType: 'application/json',
      upsert: true,
    });

    if (error) {
      return { success: false, message: `Error guardando provincias en Supabase: ${error.message}` };
    }

    revalidatePath('/');
    revalidatePath('/inicio');
    revalidatePath('/superadmin');
    return { success: true, message: 'Configuración global de provincias guardada en Supabase.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function saveBannerSlidesAction(
  provinceId: string,
  banners: Array<{
    id?: string;
    imageUrl?: string;
    image_url?: string;
    device?: string;
    ctaHref?: string;
    cta_url?: string;
    titleLine1?: string;
    title?: string;
    subtitle?: string;
    badgeText?: string;
    badge_text?: string;
    badgeType?: string;
    badge_type?: string;
    ctaText?: string;
    cta_text?: string;
    location?: string;
  }>
): Promise<{ success: boolean; message: string; banners?: any[] }> {
  try {
    const adminSupabase = getAdminClient();
    const supabase = adminSupabase || (await createClient());

    const isUuid = (str?: string) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    // 1. Process each banner slide: upload base64 images to Supabase Storage if needed
    const processedBanners = await Promise.all(
      banners.map(async (banner, idx) => {
        let imageUrl = banner.imageUrl || banner.image_url || '';

        // If it's a base64 Data URL, upload it via uploadImageServerAction to Supabase Storage bucket 'commerces'
        if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image/')) {
          const uploadRes = await uploadImageServerAction(imageUrl, `banner-${provinceId}-${Date.now()}-${idx}.jpg`, 'commerces');
          if (uploadRes.success && uploadRes.url) {
            imageUrl = uploadRes.url;
          }
        }

        const validId = isUuid(banner.id)
          ? banner.id!
          : typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
        const rawBadgeType = banner.badgeType || banner.badge_type || 'tourism';
        const validBadgeType = ['tourism', 'commerce', 'event', 'news', 'general'].includes(rawBadgeType) ? rawBadgeType : 'tourism';

        return {
          id: validId,
          province_id: provinceId,
          image_url: imageUrl,
          title: banner.titleLine1 || banner.title || 'ON MÁS Portal Regional',
          subtitle: banner.subtitle || 'Comprá. Vendé. Publicá. Conectá.',
          badge_text: banner.badgeText || banner.badge_text || 'PORTAL REGIONAL',
          badge_type: validBadgeType,
          city_tag: banner.location || provinceId,
          cta_text: banner.ctaText || banner.cta_text || 'Ver Más',
          cta_url: banner.ctaHref || banner.cta_url || `/${provinceId}`,
          published_at: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
        };
      })
    );

    // 2. Replace banner slides for this province in database
    if (supabase) {
      try {
        const delRes = await supabase.from('banner_slides').delete().eq('province_id', provinceId);
        if (delRes.error) {
          console.error('Error deleting old banner_slides:', delRes.error.message);
        }
        if (processedBanners.length > 0) {
          const { error } = await supabase.from('banner_slides').insert(processedBanners);
          if (error) {
            console.error('Error inserting banner_slides into Supabase:', error.message);
          } else {
            console.log(`Successfully saved ${processedBanners.length} banners for ${provinceId} in Supabase DB.`);
          }
        }
      } catch (dbErr) {
        console.error('Exception saving banner_slides to Supabase:', dbErr);
      }
    }

    // 3. Map back for frontend
    const finalBanners = processedBanners.map((p, idx) => ({
      id: p.id,
      provinceId: p.province_id,
      imageUrl: p.image_url,
      titleLine1: p.title,
      location: p.city_tag,
      ctaHref: p.cta_url,
      device: banners[idx]?.device || 'all',
    }));

    revalidatePath('/');
    revalidatePath('/inicio');
    revalidatePath(`/${provinceId}`);
    revalidatePath('/superadmin');

    return { success: true, message: 'Banners guardados exitosamente en la plataforma.', banners: finalBanners };
  } catch (err) {
    console.error('Error en saveBannerSlidesAction:', err);
    return { success: false, message: `Error guardando banners: ${(err as Error).message}` };
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
  status?: string;
  isSuperAdmin?: boolean;
}): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());
    const status = articleData.isSuperAdmin ? 'APPROVED' : (articleData.status || 'PENDING');

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
      author_name: articleData.authorName || 'Vecino / Redacción ON MÁS',
      author_avatar_url: '/images/avatar-author.jpg',
      status: status,
    });

    if (error) {
      console.warn('Note on Supabase community article creation:', error.message);
    }

    revalidatePath('/comunidad');
    revalidatePath('/superadmin');
    return {
      success: true,
      message: articleData.isSuperAdmin
        ? 'Publicación subida exitosamente a la sección Comunidad.'
        : 'Nota enviada exitosamente. Quedó en revisión por el equipo OnMás antes de su publicación.',
    };
  } catch (err) {
    return { success: false, message: `Error al publicar nota: ${(err as Error).message}` };
  }
}

export async function updateCommunityArticleAction(
  articleId: string,
  articleData: {
    title: string;
    category: string;
    cityId: string;
    cityName: string;
    excerpt: string;
    authorName?: string;
    imageUrl?: string;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const updatePayload: Record<string, any> = {
      title: articleData.title,
      category: articleData.category,
      city_id: articleData.cityId,
      city_name: articleData.cityName,
      location: articleData.cityName,
      excerpt: articleData.excerpt,
    };

    if (articleData.authorName) {
      updatePayload.author_name = articleData.authorName;
    }
    if (articleData.imageUrl) {
      updatePayload.image_url = articleData.imageUrl;
    }

    const { error } = await client
      .from('community_events')
      .update(updatePayload)
      .eq('id', articleId);

    if (error) {
      console.warn('Error actualizando nota de comunidad en Supabase:', error.message);
      return { success: false, message: `Error en Supabase: ${error.message}` };
    }

    revalidatePath('/comunidad');
    revalidatePath('/superadmin');
    return { success: true, message: 'Nota de comunidad actualizada exitosamente.' };
  } catch (err) {
    return { success: false, message: `Error al actualizar nota: ${(err as Error).message}` };
  }
}

export async function approveCommunityArticleAction(articleId: string): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { error } = await client.from('community_events').update({ status: 'APPROVED' }).eq('id', articleId);
    if (error) {
      console.warn('Error aprobando nota de comunidad en Supabase:', error.message);
    }

    revalidatePath('/comunidad');
    revalidatePath('/superadmin');
    return { success: true, message: 'Nota de comunidad aprobada y publicada en la web.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function rejectCommunityArticleAction(articleId: string): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { error } = await client.from('community_events').update({ status: 'REJECTED' }).eq('id', articleId);
    if (error) {
      console.warn('Error rechazando nota de comunidad en Supabase:', error.message);
    }

    revalidatePath('/comunidad');
    revalidatePath('/superadmin');
    return { success: true, message: 'Nota de comunidad rechazada.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function deleteCommunityArticleAction(articleId: string): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { error } = await client.from('community_events').delete().eq('id', articleId);
    if (error) {
      console.warn('Error eliminando nota de comunidad en Supabase:', error.message);
    }

    revalidatePath('/comunidad');
    revalidatePath('/superadmin');
    return { success: true, message: 'Nota de comunidad eliminada.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function getAllCommunityArticlesAction(statusFilter?: string): Promise<{ success: boolean; data: any[]; message?: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    let query = client.from('community_events').select('*').order('created_at', { ascending: false });
    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      return { success: false, data: [], message: error.message };
    }

    const mapped = (data || []).map((e: any) => ({
      id: e.id,
      title: e.title,
      category: e.category,
      date: e.date,
      formattedDate: e.formatted_date || e.date,
      location: e.location || e.city_name,
      cityId: e.city_id,
      cityName: e.city_name,
      imageUrl: e.image_url || '/images/commerce-bodega.jpg',
      readTimeMinutes: e.read_time_minutes || 4,
      excerpt: e.excerpt,
      isFeatured: e.is_featured ?? true,
      status: e.status || 'APPROVED',
      author: {
        name: e.author_name || 'Redacción ON MÁS',
        avatarUrl: e.author_avatar_url || '/images/avatar-author.jpg',
      },
    }));

    return { success: true, data: mapped };
  } catch (err) {
    return { success: false, data: [], message: (err as Error).message };
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
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { error } = await client.from('tourism_services').insert({
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
      console.warn('Error insertando servicio turístico:', error.message);
      return { success: false, message: `Error en Supabase: ${error.message}` };
    }

    revalidatePath('/turismo');
    revalidatePath('/superadmin');
    return { success: true, message: 'Servicio turístico registrado con éxito en Supabase.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function deleteTourismServiceAction(serviceId: string): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { error } = await client.from('tourism_services').delete().eq('id', serviceId);

    if (error) {
      return { success: false, message: `Error eliminando servicio: ${error.message}` };
    }

    revalidatePath('/turismo');
    revalidatePath('/superadmin');
    return { success: true, message: 'Servicio turístico eliminado.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}


function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oetagnusdhbqrznugwuo.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;

  if (url && key) {
    return createSupabaseJSClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    });
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
  paymentType?: 'INITIAL' | 'MONTHLY_RENEWAL';
  paymentMethod?: 'EFECTIVO' | 'TRANSFERENCIA' | 'MERCADOPAGO';
  referenceNote?: string;
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

    const insertPayload: Record<string, any> = {
      commerce_name: resolvedName,
      owner_name: resolvedOwner,
      phone_whatsapp: resolvedPhone,
      plan_name: cleanPlanName,
      amount: paymentData.amount || 29000,
      city_name: resolvedCity,
      status: 'PENDING',
    };

    // Agregar campos extendidos si la tabla los soporta o como notas
    if (paymentData.referenceNote) {
      insertPayload.notes = paymentData.referenceNote;
    }

    const { error } = await adminSupabase.from('cash_payments').insert(insertPayload);

    if (error) {
      console.warn('Error insertando pago en efectivo:', error.message);
      return { success: false, message: `Error registrando pago en Supabase: ${error.message}` };
    }

    revalidatePath('/superadmin');
    revalidatePath('/admin');
    return { success: true, message: 'Aviso de pago de cuota mensual registrado exitosamente.' };
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
    notes?: string;
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
        notes: pending.notes || '',
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
    return { success: true, message: 'Solicitud de pago cancelada correctamente.' };
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

    const nextExpiration = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    if (commerceId) {
      await adminSupabase
        .from('commerces')
        .update({ 
          is_subscription_active: true, 
          is_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', commerceId);
    } else if (commerceName) {
      await adminSupabase
        .from('commerces')
        .update({ 
          is_subscription_active: true, 
          is_verified: true,
          updated_at: new Date().toISOString()
        })
        .ilike('name', `%${commerceName}%`);
    }

    revalidatePath('/superadmin');
    revalidatePath('/admin');
    revalidatePath('/comercios');
    return { success: true, message: 'Pago de cuota mensual aprobado exitosamente. El comercio ha sido renovado en el portal.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function deleteCashPaymentAction(
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
      return { success: false, message: `Error eliminando aviso de pago: ${error.message}` };
    }

    revalidatePath('/superadmin');
    return { success: true, message: 'Aviso de pago eliminado exitosamente.' };
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
    notes?: string;
  }>;
}> {
  try {
    const adminSupabase = getAdminClient();
    if (!adminSupabase) {
      return { success: false, data: [] };
    }

    // Auto-eliminar prueba vieja kevin de Supabase si existe
    try {
      await adminSupabase
        .from('cash_payments')
        .delete()
        .or('owner_name.ilike.%kevin%,commerce_name.ilike.%kevin%');
    } catch (e) {
      console.warn('Note cleaning kevin test payment:', e);
    }

    const { data, error } = await adminSupabase
      .from('cash_payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching cash payments:', error.message);
      return { success: false, data: [] };
    }

    const filtered = (data || []).filter(
      (p: any) => !(p.owner_name || '').toLowerCase().includes('kevin') && !(p.commerce_name || '').toLowerCase().includes('kevin')
    );

    return {
      success: true,
      data: filtered.map((p: any) => ({
        id: p.id,
        commerceName: p.commerce_name || 'Comercio',
        ownerName: p.owner_name || 'Titular',
        phoneWhatsApp: p.phone_whatsapp || '',
        planName: p.plan_name || 'Plan ON MÁS',
        amount: Number(p.amount || 0),
        cityName: p.city_name || 'Entre Ríos',
        status: p.status || 'PENDING',
        createdAt: p.created_at,
        notes: p.notes || '',
      })),
    };
  } catch (err) {
    return { success: false, data: [] };
  }
}

export async function getCommercePaymentHistoryAction(
  commerceName?: string,
  commerceId?: string
): Promise<{
  success: boolean;
  data: Array<{
    id: string;
    planName: string;
    amount: number;
    status: string;
    createdAt: string;
    notes?: string;
    commerceName?: string;
  }>;
}> {
  try {
    const adminSupabase = getAdminClient();
    if (!adminSupabase) return { success: false, data: [] };

    let query = adminSupabase.from('cash_payments').select('*');

    if (commerceName) {
      query = query.ilike('commerce_name', `%${commerceName}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data) return { success: false, data: [] };

    return {
      success: true,
      data: data.map((p: any) => ({
        id: p.id,
        planName: p.plan_name || 'Bronce',
        amount: Number(p.amount || 0),
        status: p.status || 'PENDING',
        createdAt: p.created_at,
        notes: p.notes || '',
        commerceName: p.commerce_name || '',
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

    const { data: webReqs, error: webErr } = await adminSupabase
      .from('web_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (webErr) {
      console.warn('Error fetching web requests:', webErr.message);
    }

    let launchSubs: any[] = [];
    try {
      const { data: subs, error: subErr } = await adminSupabase
        .from('launch_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!subErr && subs) {
        launchSubs = subs;
      }
    } catch (e) {
      console.warn('launch_subscribers fetch note:', e);
    }

    const formattedWeb = (webReqs || []).map((r: any) => ({
      id: r.id,
      businessName: r.business_name || 'Comercio',
      contactName: r.contact_name || 'Contacto',
      phoneWhatsApp: r.phone_whatsapp || '',
      email: r.email || '',
      desiredDomain: r.desired_domain || '',
      notes: r.notes || '',
      status: r.status || 'PENDING',
      createdAt: r.created_at,
    }));

    const formattedLaunch = launchSubs.map((s: any) => ({
      id: s.id || `sub_${s.email}`,
      businessName: 'Suscriptor Lanzamiento ON MÁS',
      contactName: s.email ? s.email.split('@')[0] : 'Suscriptor',
      phoneWhatsApp: '',
      email: s.email || '',
      desiredDomain: 'onmasportal.com.ar',
      notes: 'Suscrito desde la pantalla de Próximamente',
      status: 'LAUNCH_SUBSCRIBER',
      createdAt: s.created_at || s.subscribed_at,
    }));

    const existingEmails = new Set(formattedWeb.map((w) => w.email.toLowerCase()).filter(Boolean));
    const uniqueLaunch = formattedLaunch.filter((l) => !existingEmails.has(l.email.toLowerCase()));

    return {
      success: true,
      data: [...formattedWeb, ...uniqueLaunch],
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

export async function deleteWebRequestAction(
  requestId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    if (!adminSupabase) {
      return { success: false, message: 'No se pudo conectar a Supabase.' };
    }

    const { error } = await adminSupabase
      .from('web_requests')
      .delete()
      .eq('id', requestId);

    if (error) {
      return { success: false, message: `Error eliminando solicitud web: ${error.message}` };
    }

    revalidatePath('/superadmin');
    return { success: true, message: 'Solicitud de sitio web eliminada exitosamente.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}



export async function getSubscriptionPlansAction(): Promise<{
  success: boolean;
  plans: PlanConfigItem[];
}> {
  try {
    const adminSupabase = getAdminClient();
    if (adminSupabase) {
      const { data, error } = await adminSupabase.from('subscription_plans').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map((p: any) => {
          let feats: string[] = [];
          if (Array.isArray(p.features)) {
            feats = p.features;
          } else if (typeof p.features === 'string') {
            try {
              feats = JSON.parse(p.features);
            } catch (e) {
              feats = [];
            }
          }

          return {
            id: String(p.id || ''),
            name: String(p.name || (p.id === 'oro' ? 'Plan Oro' : p.id === 'plata' ? 'Plan Plata' : 'Plan Bronce')),
            price: Number(p.price) || (p.id === 'oro' ? 99000 : p.id === 'plata' ? 49000 : 29000),
            period: String(p.period || 'mes'),
            badge: String(p.badge || (p.id === 'oro' ? 'MÁXIMO ALCANCE • VIP' : p.id === 'plata' ? 'Mayor Visibilidad' : 'Presencia Básica')),
            catalogLimitText: String(p.catalog_limit_text || (p.id === 'oro' ? 'Catálogo ILIMITADO de productos y servicios' : p.id === 'plata' ? 'Catálogo de hasta 20 productos / servicios' : 'Catálogo de hasta 5 productos / servicios')),
            description: String(p.description || ''),
            targetAudience: String(p.target_audience || 'Comercios y Turismo'),
            features: Array.isArray(feats) ? feats : [],
          };
        });

        const mapById = new Map(mapped.map((m) => [m.id, m]));
        const fullPlans = DEFAULT_SUBSCRIPTION_PLANS.map((d) => mapById.get(d.id) || d);
        return { success: true, plans: fullPlans };
      }
    }
    return { success: true, plans: DEFAULT_SUBSCRIPTION_PLANS };
  } catch (err) {
    console.warn('Error en getSubscriptionPlansAction:', err);
    return { success: true, plans: DEFAULT_SUBSCRIPTION_PLANS };
  }
}

export async function updateSubscriptionPlansAction(
  plans: PlanConfigItem[]
): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    if (adminSupabase) {
      for (const p of plans) {
        await adminSupabase.from('subscription_plans').upsert({
          id: p.id,
          name: p.name,
          price: p.price,
          period: p.period,
          badge: p.badge,
          catalog_limit_text: p.catalogLimitText,
          description: p.description,
          target_audience: p.targetAudience,
          features: p.features,
          updated_at: new Date().toISOString(),
        });
      }
    }

    revalidatePath('/admin');
    revalidatePath('/superadmin');
    revalidatePath('/comercios');
    revalidatePath('/turismo');
    return { success: true, message: '¡Valores y configuración de los planes actualizados con éxito!' };
  } catch (err) {
    return { success: false, message: `Error guardando planes: ${(err as Error).message}` };
  }
}

export async function deleteRaffleAction(
  raffleId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { error } = await client
      .from('raffles')
      .delete()
      .eq('id', raffleId);

    if (error) {
      console.warn('Error eliminando sorteo de Supabase:', error.message);
      return { success: false, message: `Error eliminando sorteo: ${error.message}` };
    }

    revalidatePath('/sorteos');
    revalidatePath('/superadmin');
    return { success: true, message: 'Sorteo eliminado exitosamente.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}

export async function getSectionCardsAction(): Promise<{ success: boolean; data: any[] }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const { data, error } = await client.storage.from('commerces').download('config/section_cards.json');
    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { success: true, data: parsed };
      }
    }
  } catch (err) {
    console.warn('Error fetching section cards config from Supabase storage:', err);
  }
  return { success: false, data: [] };
}

export async function saveSectionCardsAction(cards: any[]): Promise<{ success: boolean; message: string }> {
  try {
    const adminSupabase = getAdminClient();
    const client = adminSupabase || (await createClient());

    const buffer = Buffer.from(JSON.stringify(cards, null, 2));
    const { error } = await client.storage.from('commerces').upload('config/section_cards.json', buffer, {
      contentType: 'application/json',
      upsert: true,
    });

    if (error) {
      return { success: false, message: `Error guardando section cards en Supabase: ${error.message}` };
    }

    revalidatePath('/');
    revalidatePath('/inicio');
    revalidatePath('/superadmin');
    return { success: true, message: 'Imágenes de cards de secciones guardadas en Supabase.' };
  } catch (err) {
    return { success: false, message: `Error: ${(err as Error).message}` };
  }
}







