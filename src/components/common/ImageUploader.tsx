'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Check, X, Sparkles, Plus } from 'lucide-react';

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
}

export function MultiImageUploader({
  images,
  onChange,
  maxImages = 3,
  label = 'Imágenes del Producto / Oferta *',
}: MultiImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = maxImages - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    setIsUploading(true);

    try {
      const { uploadImageToSupabase } = await import('@/lib/supabase/storage');
      const uploadPromises = filesToProcess.map((file) =>
        uploadImageToSupabase(file, 'products')
      );
      const newUploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...newUploadedUrls].slice(0, maxImages));
    } catch (err) {
      console.warn('Error subiendo imágenes a Supabase Storage:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} (Hasta {maxImages} fotos)
        </label>
        <span className="text-[11px] font-extrabold text-[#00ADB5] bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
          {images.length} de {maxImages} seleccionadas
        </span>
      </div>

      {/* Grid de Imágenes de 3 Columnas */}
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative h-28 rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 group shadow-xs">
            <Image src={img} alt={`Imagen ${idx + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemoveImage(idx)}
              className="absolute top-1.5 right-1.5 p-1.5 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full transition-colors cursor-pointer z-20 shadow-md"
              title="Eliminar foto"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <span className="absolute bottom-1.5 left-1.5 bg-slate-900/75 backdrop-blur-xs text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md">
              {idx === 0 ? 'Portada' : `Foto ${idx + 1}`}
            </span>
          </div>
        ))}

        {/* Botón para Cargar Foto si no alcanzó el límite */}
        {images.length < maxImages && (
          <label className={`relative h-28 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center text-center p-2 cursor-pointer ${
            isUploading
              ? 'border-[#00ADB5] bg-cyan-50/50'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-[#00ADB5]'
          }`}>
            <input
              type="file"
              accept="image/*"
              multiple={maxImages > 1}
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <div className="p-2 rounded-full bg-white text-[#0047BA] shadow-2xs mb-1">
              <Upload className="w-4 h-4 text-[#00ADB5]" />
            </div>
            <span className="text-[11px] font-extrabold text-slate-700">
              {isUploading ? 'Cargando...' : '+ Subir Foto'}
            </span>
            <span className="text-[9px] text-slate-400 font-medium">PNG, JPG o WEBP</span>
          </label>
        )}
      </div>
    </div>
  );
}

// Mantener compatibilidad previa
export function ImageUploader({
  value,
  onChange,
  label = 'Imagen del Producto / Oferta',
  presetOptions,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  presetOptions?: { label: string; url: string }[];
}) {
  return (
    <MultiImageUploader
      images={value ? [value] : []}
      onChange={(imgs) => onChange(imgs[0] || '')}
      maxImages={1}
      label={label}
    />
  );
}
