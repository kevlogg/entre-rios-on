'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Store, MapPin, MessageCircle, ShieldCheck, Save, CheckCircle, Camera } from 'lucide-react';
import { Commerce } from '@/types';

interface ProfileEditorProps {
  commerce: Commerce;
}

export function ProfileEditor({ commerce }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    name: commerce.name,
    category: commerce.category,
    cityName: commerce.cityName,
    address: commerce.address,
    phoneWhatsApp: commerce.phoneWhatsApp,
    instagram: commerce.instagram || '@ceramica.delta.colon',
    description: commerce.description,
    cuit: '30-71892345-9',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#004b87] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#00a859]" />
            <span>Perfil Comercial & Datos del Negocio</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Mantené actualizada la información de tu comercio para generar confianza en tus clientes provinciales.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-[#00a859] px-3.5 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Comercio Verificado</span>
        </div>
      </div>

      {/* Visual Brand Assets Row (Logo & Cover Preview) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <div className="md:col-span-4 flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 border-slate-300 shadow-sm shrink-0">
            <Image src={commerce.logoUrl} alt={commerce.name} fill className="object-cover" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">Logo Oficial</span>
            <span className="text-[11px] text-slate-400 block">Recomendado 400x400 px</span>
            <button className="text-xs font-bold text-[#00a859] hover:underline mt-1">Cambiar Logo</button>
          </div>
        </div>

        <div className="md:col-span-8 flex items-center gap-4">
          <div className="relative h-20 w-full rounded-2xl overflow-hidden bg-slate-300 border border-slate-300 shadow-sm">
            <Image src={commerce.coverUrl} alt="Portada" fill className="object-cover" />
          </div>
          <button className="text-xs font-bold text-[#00a859] hover:underline shrink-0">Cambiar Portada</button>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Comercial del Negocio *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00a859]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">CUIT / Identificación Comercial</label>
            <input
              type="text"
              value={formData.cuit}
              onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00a859]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Rubro / Categoría Principal</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00a859]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad / Localidad *</label>
            <input
              type="text"
              value={formData.cityName}
              onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00a859]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dirección Física de Atención</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00a859]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono WhatsApp Comercial (Recepción de Pedidos) *</label>
            <div className="relative">
              <input
                type="tel"
                required
                value={formData.phoneWhatsApp}
                onChange={(e) => setFormData({ ...formData, phoneWhatsApp: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00a859]"
              />
              <MessageCircle className="w-4 h-4 text-[#25D366] absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Instagram (@usuario)</label>
            <div className="relative">
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00a859]"
              />
              <Camera className="w-4 h-4 text-pink-600 absolute left-3.5 top-3" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Descripción / Historia del Negocio</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00a859]"
          />
        </div>

        {isSaved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle className="w-4 h-4 text-[#00a859]" />
            <span>Los datos de tu comercio han sido actualizados con éxito.</span>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="bg-[#004b87] hover:bg-[#003663] text-white px-8 py-3 rounded-2xl font-extrabold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios del Perfil</span>
          </button>
        </div>
      </form>

    </div>
  );
}
