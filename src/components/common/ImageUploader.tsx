'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Check, X, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  presetOptions?: { label: string; url: string }[];
}

export function ImageUploader({ value, onChange, label = 'Imagen del Producto / Oferta', presetOptions }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Convert File to base64 DataURL preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-slate-700">{label}</label>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-4 transition-all flex flex-col items-center justify-center text-center space-y-2 cursor-pointer ${
          dragActive
            ? 'border-[#00a859] bg-emerald-50/50'
            : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
        />

        {value ? (
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
            <Image src={value} alt="Previsualización" fill className="object-cover" />
            <div className="absolute top-2 right-2 bg-slate-900/70 text-white text-[10px] font-extrabold px-2 py-1 rounded-md backdrop-blur-xs flex items-center gap-1">
              <Check className="w-3 h-3 text-[#00a859]" />
              <span>Imagen Cargada</span>
            </div>
          </div>
        ) : (
          <>
            <div className="p-3 rounded-full bg-white text-[#004b87] shadow-sm">
              <Upload className="w-5 h-5 text-[#00a859]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {isUploading ? 'Procesando imagen...' : 'Hacé clic o arrastrá una foto aquí'}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">PNG, JPG, WEBP hasta 5MB</p>
            </div>
          </>
        )}
      </div>

      {/* Optional Preset Selector */}
      {presetOptions && presetOptions.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-500 block">O seleccionar un preset regional:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {presetOptions.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(opt.url)}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-left truncate transition-colors border cursor-pointer ${
                  value === opt.url
                    ? 'bg-[#004b87] text-white border-[#004b87]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
