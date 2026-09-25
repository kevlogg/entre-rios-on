'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CommunityEvent } from '@/types';
import {
  Newspaper,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Sparkles,
  X,
  User,
  Upload,
  CheckCircle2,
  Users
} from 'lucide-react';
import { createCommunityArticleAction } from '@/server/actions/superadmin';
import { uploadImageToSupabase } from '@/lib/supabase/storage';
import { getUpcomingEvents } from '@/lib/dal/portal';

interface NewsManagerProps {
  events: CommunityEvent[];
}

export function NewsManager({ events: initialEvents }: NewsManagerProps) {
  const [events, setEvents] = useState<CommunityEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Festival' | 'Gastronomía' | 'Cultura' | 'Deportes' | 'Turismo' | 'Emprendedores'>('Turismo');
  const [cityId, setCityId] = useState('gualeguaychu');
  const [excerpt, setExcerpt] = useState('');
  const [authorName, setAuthorName] = useState('Redacción ON MÁS');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Status Loaders
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const fetched = await getUpcomingEvents();
        if (fetched && fetched.length > 0) {
          setEvents(fetched);
        }
      } catch (err) {
        console.warn('Error cargando notas de comunidad:', err);
      }
    }
    loadEvents();
  }, []);

  // Image Upload Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setIsUploadingImage(true);
    setErrorMsg(null);

    try {
      const publicUrl = await uploadImageToSupabase(file, 'commerces');
      setImageUrl(publicUrl);
      setImagePreview(publicUrl);
    } catch (err) {
      console.warn('Error subiendo foto para artículo de Comunidad:', err);
      setErrorMsg('No se pudo subir la foto a Supabase Storage. Se usará la imagen por defecto.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setImagePreview(null);
  };

  const cityNameMap: Record<string, string> = {
    gualeguaychu: 'Gualeguaychú',
    parana: 'Paraná',
    colon: 'Colón',
    concordia: 'Concordia',
    federacion: 'Federación',
    'santa-fe-capital': 'Santa Fe Capital',
    rosario: 'Rosario',
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    const selectedCityName = cityNameMap[cityId] || 'Entre Ríos';
    const finalImageUrl = imageUrl || imagePreview || '/images/commerce-bodega.jpg';

    const newEvt: CommunityEvent = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      category,
      date: new Date().toISOString().split('T')[0],
      formattedDate: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
      location: selectedCityName,
      cityId,
      cityName: selectedCityName,
      imageUrl: finalImageUrl,
      readTimeMinutes: 4,
      excerpt: excerpt.trim(),
      isFeatured: true,
      author: {
        name: authorName.trim() || 'Redacción ON MÁS',
        avatarUrl: '/images/avatar-author.jpg',
      },
    };

    try {
      const res = await createCommunityArticleAction({
        title: title.trim(),
        category,
        cityId,
        cityName: selectedCityName,
        excerpt: excerpt.trim(),
        authorName: authorName.trim() || 'Redacción ON MÁS',
        imageUrl: finalImageUrl,
      });

      if (res.success) {
        setEvents([newEvt, ...events]);
        setIsModalOpen(false);
        setTitle('');
        setExcerpt('');
        setImageUrl('');
        setImagePreview(null);
        setSuccessMsg(`¡Publicación "${newEvt.title}" subida exitosamente a la sección Comunidad!`);
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      console.warn('Fallback local creación artículo:', err);
      setEvents([newEvt, ...events]);
      setIsModalOpen(false);
      setSuccessMsg(`¡Publicación "${newEvt.title}" guardada localmente!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta publicación de la sección Comunidad?')) return;
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-black text-[#0047BA] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00ADB5]" />
            <span>Gestión de Comunidad ON MÁS & Publicaciones Editoriales</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Redactá artículos, historias de emprendedores, noticias y comunicados oficiales que se visualizan en la sección /comunidad del portal.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-[#00ADB5] to-[#007C8A] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Publicación para Comunidad</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((evt) => (
          <div key={evt.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-200">
                <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-[#0047BA] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase shadow-xs">
                  {evt.category}
                </span>
                <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#00ADB5]" />
                  {evt.cityName}
                </span>
              </div>

              <h4 className="font-extrabold text-slate-900 text-base leading-snug">{evt.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{evt.excerpt}</p>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-700">{evt.author?.name || 'Redacción ON MÁS'}</span>
              </div>

              <button
                onClick={() => handleDelete(evt.id)}
                className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                title="Eliminar Publicación de Comunidad"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Redactar Publicación de Comunidad */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-[#0047BA] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00ADB5]" />
                <span>Publicar Nota en Comunidad ON MÁS</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-300 rounded-2xl p-3 text-rose-800 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título de la Publicación *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. El auge de las Bodegas Boutique y Enoturismo Litoral"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value="Turismo">Turismo</option>
                    <option value="Gastronomía">Gastronomía</option>
                    <option value="Festival">Festival</option>
                    <option value="Cultura">Cultura</option>
                    <option value="Deportes">Deportes</option>
                    <option value="Emprendedores">Emprendedores</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad Destacada</label>
                  <select
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value="gualeguaychu">Gualeguaychú</option>
                    <option value="parana">Paraná</option>
                    <option value="colon">Colón</option>
                    <option value="concordia">Concordia</option>
                    <option value="federacion">Federación</option>
                    <option value="santa-fe-capital">Santa Fe Capital</option>
                    <option value="rosario">Rosario</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Resumen / Copete de la Nota *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Escribí una síntesis relevante para los lectores de la Comunidad..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Firma / Autor de la Publicación</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Ej. Valeria Benítez / Redacción ON MÁS"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs font-medium text-slate-800"
                />
              </div>

              {/* Subida de Imagen a Supabase Storage */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Imagen de Portada * (Almacenada en Supabase Storage)</span>
                  {isUploadingImage && (
                    <span className="text-[11px] text-[#00ADB5] font-extrabold flex items-center gap-1 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" /> Subiendo imagen...
                    </span>
                  )}
                </label>

                {imagePreview ? (
                  <div className="relative h-36 w-full rounded-2xl overflow-hidden border border-slate-300 group shadow-xs">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-rose-600 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" /> Cambiar Fotografía
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="border-2 border-dashed border-slate-300 hover:border-[#00ADB5] bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <div className="p-2 rounded-full bg-white text-[#0047BA] shadow-xs mb-1 group-hover:scale-110 transition-transform">
                        <Upload className="w-4 h-4 text-[#00ADB5]" />
                      </div>
                      <span className="text-xs font-extrabold text-slate-800">Subir Fotografía</span>
                      <span className="text-[10px] text-slate-400">JPG, PNG o WEBP</span>
                    </label>

                    <div className="space-y-1 flex flex-col justify-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <label className="text-[11px] font-bold text-slate-600">O URL directa de imagen:</label>
                      <input
                        type="text"
                        value={imageUrl}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          setImagePreview(e.target.value || null);
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="bg-gradient-to-r from-[#00ADB5] to-[#007C8A] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Publicando...' : 'Publicar Nota en Comunidad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
