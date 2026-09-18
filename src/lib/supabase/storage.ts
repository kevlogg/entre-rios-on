import { compressImage } from '@/lib/utils/imageCompressor';
import { uploadImageServerAction } from '@/server/actions/storage';

/**
 * Sube un archivo de imagen al Storage de Supabase a través de Server Action y devuelve la URL pública permanente.
 */
export async function uploadImageToSupabase(
  file: File,
  bucketName: string = 'commerces'
): Promise<string> {
  try {
    const compressedDataUrl = await compressImage(file, 1000, 1000, 0.82);
    const result = await uploadImageServerAction(compressedDataUrl, file.name, bucketName);

    if (result.success && result.url) {
      return result.url;
    }

    console.warn('Server storage upload note:', result.error);
    return compressedDataUrl;
  } catch (err) {
    console.warn('Image process error:', err);
    return await compressImage(file, 800, 800, 0.8);
  }
}
