'use server';

import { createAdminClient } from '@/lib/supabase/admin';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function uploadImageServerAction(
  base64DataUrl: string,
  fileName: string,
  bucketName: string = 'commerces'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabaseAdmin = createAdminClient();

    // Check if it's already a standard HTTP URL
    if (base64DataUrl.startsWith('http://') || base64DataUrl.startsWith('https://')) {
      return { success: true, url: base64DataUrl };
    }

    // Parse Base64 string to Buffer
    const matches = base64DataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return { success: false, error: 'Formato de imagen inválido.' };
    }

    const mimeType = matches[1].toLowerCase();
    const base64Data = matches[2];

    // Validar tipo de archivo (MIME Type)
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return { success: false, error: 'Tipo de archivo no permitido. Solo se aceptan imágenes (JPG, PNG, WEBP, GIF, AVIF).' };
    }

    const buffer = Buffer.from(base64Data, 'base64');

    // Validar tamaño máximo (5MB)
    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      return { success: false, error: 'La imagen supera el tamaño máximo permitido de 5MB.' };
    }

    const fileExt = fileName.split('.').pop() || mimeType.split('/')[1] || 'jpg';
    const cleanFileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const { data, error } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(cleanFileName, buffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (error || !data) {
      console.error('Error uploading image to Supabase Storage Admin:', error);
      return { success: false, error: error?.message || 'Error en carga de storage' };
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(cleanFileName);

    if (publicUrlData?.publicUrl) {
      return { success: true, url: publicUrlData.publicUrl };
    }

    return { success: false, error: 'No se pudo obtener la URL pública de la imagen.' };
  } catch (err) {
    console.error('uploadImageServerAction exception:', err);
    return { success: false, error: (err as Error).message };
  }
}
