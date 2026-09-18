import { createClient } from '@/lib/supabase/client';

/**
 * Sube un archivo de imagen al Storage de Supabase y devuelve la URL pública.
 * Si el bucket de Storage aún no está creado o falla por permisos, realiza un fallback transparente a Data URL.
 */
export async function uploadImageToSupabase(
  file: File,
  bucketName: string = 'commerces'
): Promise<string> {
  try {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `uploads/${cleanFileName}`;

    // Intentar subir al bucket de Storage en Supabase
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (!error && data) {
      // Obtener URL pública permanente
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    } else {
      console.warn(`Supabase Storage note (${bucketName}):`, error?.message || 'Bucket not accessible, using Data URL fallback.');
    }
  } catch (err) {
    console.warn('Supabase Storage upload exception:', err);
  }

  // Fallback a Data URL de lectura directa
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Error al procesar archivo de imagen.'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
