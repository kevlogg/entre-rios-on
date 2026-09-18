/**
 * Comprime una imagen (File o Data URL) a dimensiones optimizadas (max 800px)
 * y calidad WEBP/JPEG para asegurar cargas ultrarrápidas y evitar límites de payload HTTP.
 */
export async function compressImage(
  input: File | string,
  maxWidth: number = 800,
  maxHeight: number = 800,
  quality: number = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new (window as any).Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(typeof input === 'string' ? input : '');
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convertir a Data URL optimizado
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = (err: any) => {
      console.warn('Canvas image compression note:', err);
      if (typeof input === 'string') {
        resolve(input);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(input);
      }
    };

    if (typeof input === 'string') {
      img.src = input;
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        img.src = reader.result as string;
      };
      reader.readAsDataURL(input);
    }
  });
}
