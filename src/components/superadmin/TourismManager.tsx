'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Compass,
  Plus,
  CheckCircle2,
  MapPin,
  Umbrella,
  ShieldCheck,
  Trash2,
  Upload,
  X,
  ImageIcon,
  Sparkles,
  Store,
  MessageCircle,
  Crown,
  Layers,
  Building2,
  ExternalLink,
  Tag
} from 'lucide-react';
import { getTourismServices } from '@/lib/dal/portal';
import {
  createTourismServiceAction,
  deleteTourismServiceAction,
  toggleCommerceVerificationAction
} from '@/server/actions/superadmin';
import { uploadImageToSupabase } from '@/lib/supabase/storage';
import { Commerce } from '@/types';

interface TourismService {
  id: string;
  name: string;
  category: string;
  city: string;
  price: string;
  plan: 'Bronce' | 'Plata' | 'Oro';
  imageUrl: string;
}

interface TourismManagerProps {
  commerces?: Commerce[];
}

const INDIVIDUAL_CATEGORIES = [
  'Alojamiento',
  'Termas & Relax',
  'Gastronomía de Río',
  'Excursiones & Náutica',
  'Enoturismo & Bodegas',
  'Aventura & Playas',
  'Cultura & Historia',
  'Otro',
];

export function TourismManager({ commerces: initialCommerces = [] }: TourismManagerProps) {
  const [services, setServices] = useState<TourismService[]>([]);
  const [commercesList, setCommercesList] = useState<Commerce[]>(initialCommerces);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Alojamiento');
  const [otherCategoryText, setOtherCategoryText] = useState('');
  const [city, setCity] = useState('Paraná');
  const [price, setPrice] = useState('');
  const [plan, setPlan] = useState<'Bronce' | 'Plata' | 'Oro'>('Plata');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Status & Loaders
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setCommercesList(initialCommerces);
  }, [initialCommerces]);

  useEffect(() => {
    async function loadServices() {
      try {
        const fetched = await getTourismServices();
        if (fetched) {
          setServices(
            fetched.map((t) => ({
              id: t.id,
              name: t.name,
              category: t.category,
              city: t.cityName,
              price: t.price,
              plan: (t.planTier as any) || 'Plata',
              imageUrl: t.imageUrl,
            }))
          );
        }
      } catch (e) {
        console.warn('Error cargando servicios turísticos:', e);
      }
    }
    loadServices();
  }, []);

  // Image Upload Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant local preview
    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setIsUploadingImage(true);
    setErrorMsg(null);

    try {
      const publicUrl = await uploadImageToSupabase(file, 'commerces');
      setImageUrl(publicUrl);
      setImagePreview(publicUrl);
    } catch (err) {
      console.warn('Error subiendo imagen a Supabase Storage:', err);
      setErrorMsg('No se pudo subir la imagen al storage de Supabase. Podés reintentar o ingresar una URL.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setImagePreview(null);
  };

  // Create Tourism Service Handler
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    const finalCategory = category === 'Otro' ? (otherCategoryText.trim() || 'Otro') : category;
    if (category === 'Otro' && !otherCategoryText.trim()) {
      setErrorMsg('Por favor completá la aclaración obligatoria de la categoría "Otro".');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const finalImageUrl = imageUrl || imagePreview || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80';

    const newService: TourismService = {
      id: `tour-${Date.now()}`,
      name: name.trim(),
      category: finalCategory,
      city,
      price: price.trim() || 'Consultar tarifa',
      plan,
      imageUrl: finalImageUrl,
    };

    try {
      const res = await createTourismServiceAction({
        name: name.trim(),
        category: finalCategory,
        cityName: city,
        price: price.trim() || 'Consultar tarifa',
        planTier: plan,
        imageUrl: finalImageUrl,
      });

      if (res.success) {
        setServices([newService, ...services]);
        setName('');
        setPrice('');
        setCategory('Alojamiento');
        setOtherCategoryText('');
        setImageUrl('');
        setImagePreview(null);
        setSuccessMsg(`¡Servicio de Turismo "${newService.name}" publicado exitosamente!`);
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(res.message || 'Error al guardar el servicio.');
      }
    } catch (e) {
      console.warn('Error creando servicio de turismo:', e);
      // Fallback local UI addition
      setServices([newService, ...services]);
      setSuccessMsg(`¡Servicio "${newService.name}" guardado localmente!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Service Handler
  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('¿Estás seguro de eliminar este servicio turístico promocionado?')) return;

    try {
      await deleteTourismServiceAction(serviceId);
    } catch (err) {
      console.warn('Error eliminando servicio:', err);
    }

    setServices((prev) => prev.filter((s) => s.id !== serviceId));
  };

  // Registered Tourism Users Toggle Actions
  const toggleVerification = async (id: string) => {
    const target = commercesList.find((c) => c.id === id);
    if (!target) return;

    try {
      await toggleCommerceVerificationAction(id, target.isVerified);
    } catch (err) {
      console.warn('Verification action error:', err);
    }

    setCommercesList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isVerified: !c.isVerified } : c))
    );
  };

  const toggleSubscription = (id: string) => {
    setCommercesList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isSubscriptionActive: !c.isSubscriptionActive } : c))
    );
  };

  // Filter Web Registered Tourism Commerces
  const registeredTourismCommerces = commercesList.filter((c) => {
    const catLower = (c.category || '').toLowerCase();
    return (
      catLower.includes('turismo') ||
      catLower.includes('alojamiento') ||
      catLower.includes('hotel') ||
      catLower.includes('termas') ||
      catLower.includes('posada') ||
      catLower.includes('cabaña') ||
      catLower.includes('excursión') ||
      catLower.includes('enoturismo') ||
      catLower.includes('bodega')
    );
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider border border-amber-400/30">
            <Compass className="w-3.5 h-3.5" />
            Módulo de Turismo & Alojamientos
          </span>
          <h2 className="text-2xl font-black">Gestión de Turismo Regional</h2>
          <p className="text-xs text-slate-100 font-medium">
            Creá atractivos libres de planes o supervisá prestadores registrados desde la web con sus respectivos planes de suscripción.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 text-center border border-white/20">
            <span className="text-[10px] font-bold text-amber-300 uppercase block">Promocionados Admin</span>
            <span className="text-xl font-black">{services.length}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 text-center border border-white/20">
            <span className="text-[10px] font-bold text-cyan-300 uppercase block">Registrados Web</span>
            <span className="text-xl font-black">{registeredTourismCommerces.length}</span>
          </div>
        </div>
      </div>

      {/* Formulario: Alta de Servicio Turístico */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#00ADB5]" />
            Alta Directa SuperAdmin
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-1">
            Crear Nuevo Servicio Turístico / Alojamiento
          </h3>
          <p className="text-xs text-slate-500">
            Los servicios publicados desde aquí no dependen de ningún plan de suscripción para mantenerse activos en el portal.
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-150">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-center gap-3 text-rose-800 text-xs font-bold animate-in fade-in duration-150">
            <X className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateService} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Nombre */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Nombre del Alojamiento o Paseo *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Cabañas Termales Sol del Paraná"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* Categoría Individual */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Categoría Turística *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold"
              >
                {INDIVIDUAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Aclaración Obligatoria si Categoría es "Otro" */}
            {category === 'Otro' && (
              <div className="space-y-1 sm:col-span-2 lg:col-span-1 animate-in fade-in duration-200">
                <label className="block text-xs font-bold text-amber-700 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  Aclaración de Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={otherCategoryText}
                  onChange={(e) => setOtherCategoryText(e.target.value)}
                  placeholder="Especificá el tipo de servicio (Ej. Complejo Ecuestre, Alquiler de Kayaks...)"
                  className="w-full bg-amber-50/60 border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 font-bold placeholder-amber-400"
                />
              </div>
            )}

            {/* Ciudad */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Ciudad o Destino *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold"
              >
                <option value="Paraná">Paraná</option>
                <option value="Colón">Colón</option>
                <option value="Concordia">Concordia</option>
                <option value="Gualeguaychú">Gualeguaychú</option>
                <option value="Federación">Federación</option>
                <option value="Victoria">Victoria</option>
                <option value="Santa Fe Capital">Santa Fe Capital</option>
                <option value="Rosario">Rosario</option>
              </select>
            </div>

            {/* Tarifa / Precio */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Tarifa / Precio Orientativo</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ej. $35.000 / noche o Consultar tarifa"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* Plan Selector */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Plan de Suscripción Representativo
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold"
              >
                <option value="Bronce">Plan Bronce (Publicación Ficha Básica)</option>
                <option value="Plata">Plan Plata (Incluye Badge Verificado + Prioridad)</option>
                <option value="Oro">Plan Oro (Verificado + Publicidad Exclusiva Oro)</option>
              </select>
            </div>
          </div>

          {/* Carga de Imagen a Supabase Storage */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Fotografía / Portada del Servicio * (Almacenada en Supabase Storage)</span>
              {isUploadingImage && (
                <span className="text-[11px] text-[#00ADB5] font-extrabold flex items-center gap-1 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> Subiendo a Supabase Storage...
                </span>
              )}
            </label>

            {imagePreview ? (
              <div className="relative h-44 w-full sm:w-80 rounded-2xl overflow-hidden border border-slate-300 group shadow-xs">
                <Image src={imagePreview} alt="Vista previa" fill className="object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-md"
                  >
                    <X className="w-4 h-4" /> Cambiar Fotografía
                  </button>
                </div>
                <span className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                  ✓ Imagen Subida a Storage
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* File input button */}
                <label className="border-2 border-dashed border-slate-300 hover:border-[#00ADB5] bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <div className="p-2.5 rounded-full bg-white text-[#0047BA] shadow-xs mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 text-[#00ADB5]" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">
                    Cargar desde mi dispositivo
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    JPG, PNG o WEBP (se optimiza y guarda en Supabase)
                  </span>
                </label>

                {/* Direct URL Fallback */}
                <div className="space-y-1 flex flex-col justify-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-600">O pegar URL de imagen externa:</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value || null);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="w-full bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white py-3.5 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publicando Servicio...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Publicar Servicio Turístico</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Grid 1: Servicios Turísticos Promocionados (SuperAdmin) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Umbrella className="w-5 h-5 text-[#00ADB5]" />
            Servicios Turísticos Promocionados en la Web ({services.length})
          </h3>
          <span className="text-xs text-slate-400 font-medium">Creados desde SuperAdmin</span>
        </div>

        {services.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs font-bold">
            No hay servicios promocionados activos. Usá el formulario superior para crear uno.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => {
              const isGold = s.plan === 'Oro';
              const isSilver = s.plan === 'Plata';
              return (
                <div
                  key={s.id}
                  className={`border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all bg-white flex flex-col justify-between ${
                    isGold ? 'border-amber-300 ring-1 ring-amber-400/50' : 'border-slate-200'
                  }`}
                >
                  <div className="relative h-40 w-full bg-slate-100">
                    <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                    
                    {/* Category Tag */}
                    <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                      {s.category}
                    </div>

                    {/* Verification Badge for Silver & Gold */}
                    {(isSilver || isGold) && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                        <ShieldCheck className="w-3 h-3" /> Verificado
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{s.name}</h4>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" />
                        <span>{s.city}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-black text-[#0047BA]">{s.price}</span>
                      
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black px-2.5 py-0.5 rounded-md border ${
                            isGold
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : isSilver
                              ? 'bg-slate-100 text-slate-800 border-slate-300'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          Plan {s.plan}
                        </span>

                        <button
                          onClick={() => handleDeleteService(s.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar servicio promocionado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid 2: Prestadores de Turismo Registrados desde la Web */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-black text-[#0047BA] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-500" />
            Prestadores Registrados desde la Web (Turismo & Alojamientos) ({registeredTourismCommerces.length})
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Cuentas registradas por usuarios en la plataforma dentro del rubro turístico. Se gestionan con planes de suscripción (Bronce, Plata, Oro).
          </p>
        </div>

        {registeredTourismCommerces.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs font-bold">
            No hay cuentas de turismo registradas por usuarios web actualmente.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider">
                  <th className="pb-3 px-3">Prestador / Comercio</th>
                  <th className="pb-3 px-3">Destino / Ciudad</th>
                  <th className="pb-3 px-3">Categoría & Plan ON MÁS</th>
                  <th className="pb-3 px-3 text-center">Insignia Verificado</th>
                  <th className="pb-3 px-3 text-center">Estado del Plan</th>
                  <th className="pb-3 px-3 text-right">Contacto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {registeredTourismCommerces.map((comm) => {
                  const isGoldOrSilver = comm.isVerified;
                  return (
                    <tr key={comm.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <Image src={comm.logoUrl} alt={comm.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">{comm.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium">
                              {comm.address || comm.email || 'Sin dirección registrada'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-[#0047BA]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" />
                          {comm.cityName}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase w-fit">
                            {comm.category}
                          </span>
                          <span className="text-[10px] font-bold text-[#0047BA]">
                            {isGoldOrSilver ? 'Plan Oro / Plata' : 'Plan Bronce'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => toggleVerification(comm.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition-colors ${
                            comm.isVerified
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          <ShieldCheck
                            className={`w-3.5 h-3.5 ${comm.isVerified ? 'text-amber-600' : 'text-slate-400'}`}
                          />
                          <span>{comm.isVerified ? 'Verificado' : 'Sin Verificar'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => toggleSubscription(comm.id)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black cursor-pointer transition-transform active:scale-95 ${
                            comm.isSubscriptionActive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          <span>{comm.isSubscriptionActive ? '✓ Plan Activo' : '⚠ Inactivo (Sin Plan)'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <a
                          href={`https://wa.me/${comm.phoneWhatsApp}?text=${encodeURIComponent(
                            `Hola ${comm.name}, nos comunicamos del equipo SuperAdmin de Entre Ríos ON MÁS sobre la gestión de tu cuenta turística.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-1.5 rounded-xl font-extrabold text-[11px]"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
