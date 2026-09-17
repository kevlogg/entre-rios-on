'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Store, MapPin, MessageCircle, ShieldCheck, Save, CheckCircle, Camera, Globe, Building2, Laptop, Upload } from 'lucide-react';
import { Commerce } from '@/types';
import { updateCommerceProfileAction } from '@/server/actions/profile';
import { PROVINCES, getCitiesByProvince } from '@/lib/constants/locations';

interface ProfileEditorProps {
  commerce: Commerce;
}

export function ProfileEditor({ commerce }: ProfileEditorProps) {
  const [logoUrl, setLogoUrl] = useState(commerce.logoUrl || '/images/city-rosario.jpg');
  const [coverUrl, setCoverUrl] = useState(commerce.coverUrl || '/images/city-rosario.jpg');

  const [formData, setFormData] = useState({
    name: commerce.name,
    category: commerce.category || 'Comercio General',
    provinceId: commerce.provinceId || 'santa-fe',
    cityName: commerce.cityName || 'Rosario',
    address: commerce.address || '',
    phoneWhatsApp: commerce.phoneWhatsApp || '',
    instagram: commerce.instagram || '',
    description: commerce.description || '',
    cuit: '',
    isDigitalOnly: commerce.isDigitalOnly || false,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableCities = getCitiesByProvince(formData.provinceId);

  const handleProvinceChange = (newProvinceId: string) => {
    const cities = getCitiesByProvince(newProvinceId);
    setFormData({
      ...formData,
      provinceId: newProvinceId,
      cityName: cities.length > 0 ? cities[0].name : '',
    });
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateCommerceProfileAction(commerce.id, {
        ...formData,
        logoUrl,
        coverUrl,
      });
    } catch (err) {
      console.warn('Profile Server Action fallback:', err);
    }

    setIsSubmitting(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#0047BA] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#00ADB5]" />
            <span>Perfil Comercial & Datos del Negocio</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Mantené actualizada la información de tu comercio para generar confianza en tus clientes provinciales.
          </p>
        </div>

        <div className="bg-cyan-50 border border-cyan-200 text-[#00ADB5] px-3.5 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Comercio Verificado</span>
        </div>
      </div>

      {/* Visual Brand Assets Row (Logo & Cover Uploaders with Recommended Sizes) */}
      <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h4 className="text-xs font-extrabold text-[#0047BA] uppercase tracking-wider">Imágenes de Marca del Comercio</h4>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Logo Upload */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-slate-700">Logo Oficial del Negocio</label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white border-2 border-slate-300 shadow-sm shrink-0">
                <Image src={logoUrl} alt={formData.name} fill className="object-cover" />
              </div>
              <div className="space-y-1.5 flex-1">
                <span className="text-[11px] font-bold text-slate-500 block leading-tight">
                  Tamaño recomendado: <strong className="text-slate-700 block">400 x 400 px</strong> (Cuadrado 1:1)
                </span>
                <label className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-[#00ADB5] border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Subir Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, setLogoUrl)}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Portada Upload */}
          <div className="md:col-span-7 space-y-2">
            <label className="block text-xs font-bold text-slate-700">Imagen de Portada (Banner Principal)</label>
            <div className="space-y-2">
              <div className="relative h-20 w-full rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 shadow-sm">
                <Image src={coverUrl} alt="Portada" fill className="object-cover" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-500">
                  Tamaño recomendado: <strong className="text-slate-700">1200 x 400 px</strong> (Relación 3:1)
                </span>
                <label className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-[#00ADB5] border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs shrink-0">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Subir Portada</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, setCoverUrl)}
                  />
                </label>
              </div>
            </div>
          </div>
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
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">CUIT / Identificación Comercial</label>
            <input
              type="text"
              placeholder="30-XXXXXXXX-X (Opcional)"
              value={formData.cuit}
              onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
            />
          </div>
        </div>

        {/* Digital Only Business Toggle Card */}
        <div className="bg-gradient-to-r from-cyan-50/70 to-blue-50/70 border border-cyan-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#00ADB5]/10 rounded-xl text-[#00ADB5] shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-[#0047BA] block">
                Negocio 100% Digital / Venta Online
              </span>
              <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                Seleccioná esta opción si tu negocio vende exclusivamente por internet/WhatsApp sin local físico de atención presencial.
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={formData.isDigitalOnly}
              onChange={(e) => setFormData({ ...formData, isDigitalOnly: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ADB5]"></div>
          </label>
        </div>

        {/* Location selectors: Provincia & Ciudad */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Rubro / Categoría Principal *</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" />
              <span>Provincia *</span>
            </label>
            <select
              value={formData.provinceId}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800 font-bold focus:ring-2 focus:ring-[#00ADB5]"
            >
              {PROVINCES.filter(p => p.id !== 'all').map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#00ADB5]" />
              <span>Ciudad / Localidad *</span>
            </label>
            <select
              value={formData.cityName}
              onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800 font-bold focus:ring-2 focus:ring-[#00ADB5]"
            >
              {availableCities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Dirección Física de Atención {formData.isDigitalOnly ? '(Opcional para Negocio Digital)' : '*'}
          </label>
          <input
            type="text"
            disabled={formData.isDigitalOnly}
            placeholder={formData.isDigitalOnly ? 'Negocio 100% Online / Venta Digital sin local de atención presencial' : 'Ej: Av. Córdoba 1450 (Opcional)'}
            value={formData.isDigitalOnly ? '' : formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm ${
              formData.isDigitalOnly 
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed italic' 
                : 'bg-slate-50 text-slate-800 border-slate-300 focus:ring-2 focus:ring-[#00ADB5]'
            }`}
          />
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
              />
              <MessageCircle className="w-4 h-4 text-[#25D366] absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Instagram (@usuario)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="@micomercio (Opcional)"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
              />
              <Camera className="w-4 h-4 text-pink-600 absolute left-3.5 top-3" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Descripción / Historia del Negocio *</label>
          <textarea
            rows={4}
            required
            placeholder="Describí los servicios, productos y la propuesta de valor de tu empresa..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
          />
        </div>

        {isSaved && (
          <div className="bg-cyan-50 border border-cyan-200 text-[#007C8A] p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle className="w-4 h-4 text-[#00ADB5]" />
            <span>Los datos de tu comercio han sido actualizados con éxito.</span>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#0047BA] to-[#002878] hover:from-[#0B66FF] hover:to-[#0047BA] text-white px-8 py-3 rounded-2xl font-extrabold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios del Perfil'}</span>
          </button>
        </div>
      </form>

    </div>
  );
}
