/**
 * Utilidades para codificar y decodificar múltiples fotos de productos
 * en la base de datos Supabase, manteniendo compatibilidad total con la
 * columna image_url principal y evitando errores de esquema.
 */

export function parseProductGallery(
  rawDesc?: string,
  mainImageUrl?: string,
  existingGallery?: string[]
): { description: string; galleryImages: string[] } {
  const primary = mainImageUrl || '/images/city-rosario.jpg';

  if (existingGallery && Array.isArray(existingGallery) && existingGallery.length > 0) {
    return {
      description: (rawDesc || '').replace(/<!--gallery:\[[\s\S]*?\]-->/g, '').trim(),
      galleryImages: existingGallery.filter(Boolean),
    };
  }

  if (!rawDesc) {
    return { description: '', galleryImages: [primary] };
  }

  const match = rawDesc.match(/<!--gallery:(\[[\s\S]*?\])-->/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return {
          description: rawDesc.replace(/<!--gallery:\[[\s\S]*?\]-->/g, '').trim(),
          galleryImages: parsed.filter(Boolean),
        };
      }
    } catch (e) {
      console.warn('Error parsing gallery tag:', e);
    }
  }

  return { 
    description: rawDesc.replace(/<!--gallery:\[[\s\S]*?\]-->/g, '').trim(), 
    galleryImages: [primary] 
  };
}

export function encodeProductGallery(
  description?: string,
  galleryImages?: string[]
): string {
  const clean = (description || '').replace(/<!--gallery:\[[\s\S]*?\]-->/g, '').trim();
  const validImages = (galleryImages || []).filter(Boolean);

  if (validImages.length <= 1) {
    return clean;
  }

  return `${clean}\n\n<!--gallery:${JSON.stringify(validImages)}-->`;
}
