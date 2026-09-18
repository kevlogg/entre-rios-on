'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Store, MapPin, MessageCircle, ShieldCheck, Save, CheckCircle, Camera, Globe, Building2, Laptop, Upload, Mail, AlertTriangle } from 'lucide-react';
import { Commerce } from '@/types';
import { updateCommerceProfileAction } from '@/server/actions/profile';
import { PROVINCES, getCitiesByProvince } from '@/lib/constants/locations';

interface ProfileEditorProps {
  commerce: Commerce;
  onUpdateCommerce?: (updated: Commerce) => void;
}

export function ProfileEditor({ commerce, onUpdateCommerce }: ProfileEditorProps) {
  const [logoUrl, setLogoUrl] = useState(commerce.logoUrl || '/images/city-rosario.jpg');
  const [coverUrl, setCoverUrl] = useState(commerce.coverUrl || '/images/city-rosario.jpg');
  const [userEmail, setUserEmail] = useState(commerce.email || '');

  const [formData, setFormData] = useState({
    name: commerce.name,
    category: commerce.category || 'Comercio General',
    provinceId: commerce.provinceId || 'santa-fe',
    cityName: commerce.cityName || 'Rosario',
    address: commerce.address || '',
    phoneWhatsApp: commerce.phoneWhatsApp || '',
    description: commerce.description || '',
    cuit: '',
    isDigitalOnly: commerce.isDigitalOnly || false,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setFormData({
      name: commerce.name,
      category: commerce.category || 'Comercio General',
      provinceId: commerce.provinceId || 'santa-fe',
      cityName: commerce.cityName || 'Rosario',
      address: commerce.address || '',
      phoneWhatsApp: commerce.phoneWhatsApp || '',
      description: commerce.description || '',
      cuit: '',
      isDigitalOnly: commerce.isDigitalOnly || false,
    });
    if (commerce.logoUrl) setLogoUrl(commerce.logoUrl);
    if (commerce.coverUrl) setCoverUrl(commerce.coverUrl);
    if (commerce.email) setUserEmail(commerce.email);

    async function loadUserEmail() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          setUserEmail(user.email);
        }
      } catch (err) {
        console.warn('Could not fetch user email for ProfileEditor:', err);
      }
    }

    if (!commerce.email) {
      loadUserEmail();
    }
  }, [commerce]);

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

    const updatedCommerce: Commerce = {
      ...commerce,
      name: formData.name,
      category: formData.category,
      provinceId: formData.provinceId,
      cityName: formData.cityName,
      address: formData.address,
      phoneWhatsApp: formData.phoneWhatsApp,
      description: formData.description,
      isDigitalOnly: formData.isDigitalOnly,
      logoUrl,
      coverUrl,
    };

    try {
      await updateCommerceProfileAction(commerce.id, updatedCommerce);

      // Sincronización cliente Supabase inmediata
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      await supabase
        .from('commerces')
        .update({
          name: formData.name,
          category: formData.category,
          province_id: formData.provinceId,
          city_name: formData.cityName,
          address: formData.address,
          phone_whatsapp: formData.phoneWhatsApp,
          description: formData.description,
          is_digital_only: formData.isDigitalOnly,
          logo_url: logoUrl,
          cover_url: coverUrl,
          updated_at: new Date().toISOString(),
        })
        .or(`id.eq.${commerce.id},slug.eq.${commerce.slug}`);
    } catch (err) {
      console.warn('Profile Server Action fallback:', err);
    }

    if (onUpdateCommerce) {
      onUpdateCommerce(updatedCommerce);
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

        {/* Read-Only Account Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
            <span>Correo Electrónico de la Cuenta (No modificable) *</span>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-bold border border-slate-200">
              Campo Bloqueado
            </span>
          </label>
          <div className="relative">
            <input
              type="email"
              readOnly
              disabled
              value={userEmail || commerce.email || ''}
              className="w-full bg-slate-100 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-600 font-bold cursor-not-allowed select-none opacity-90 shadow-2xs"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">
            El email de la cuenta está vinculado a tu acceso de usuario y no puede ser modificado desde este panel.
          </p>
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

        {/* Physical Address input & mandatory alert */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Dirección Física del Local / Atención Presencial {!formData.isDigitalOnly ? '*' : '(Opcional para Negocio Digital)'}
          </label>
          <input
            type="text"
            required={!formData.isDigitalOnly}
            disabled={formData.isDigitalOnly}
            placeholder={formData.isDigitalOnly ? 'Negocio 100% Online / Venta Digital sin local de atención presencial' : 'Ej: Av. Córdoba 1450, San Martín 230, etc.'}
            value={formData.isDigitalOnly ? '' : formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm ${
              formData.isDigitalOnly 
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed italic' 
                : formData.address.trim() === ''
                ? 'bg-amber-50/50 border-amber-300 text-slate-800 focus:ring-2 focus:ring-amber-500'
                : 'bg-slate-50 text-slate-800 border-slate-300 focus:ring-2 focus:ring-[#00ADB5]'
            }`}
          />

          {!formData.isDigitalOnly && formData.address.trim() === '' && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-amber-900 animate-in fade-in duration-200 shadow-2xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">
                  ¡Alerta: Dirección física obligatoria!
                </h5>
                <p className="text-xs font-medium text-amber-800 leading-relaxed">
                  Tu comercio no está marcado como 100% Digital. Por favor ingresá la dirección física de tu local o punto de atención para que tus clientes puedan ubicarte y para figurar en las búsquedas locales.
                </p>
              </div>
            </div>
          )}
        </div>

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
