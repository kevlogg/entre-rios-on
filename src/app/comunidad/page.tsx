'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  ArrowLeft, 
  MapPin, 
  Sparkles, 
  Newspaper, 
  Users, 
  Plus, 
  Lock, 
  User, 
  Clock, 
  ShieldAlert, 
  Upload, 
  X, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { getUpcomingEvents } from '@/lib/dal/portal';
import { createCommunityArticleAction } from '@/server/actions/superadmin';
import { createClient } from '@/lib/supabase/client';
import { uploadImageToSupabase } from '@/lib/supabase/storage';
import { CommunityEvent } from '@/types';

const CITY_OPTIONS = [
  { id: 'parana', name: 'Paraná' },
  { id: 'concordia', name: 'Concordia' },
  { id: 'colon', name: 'Colón' },
  { id: 'gualeguaychu', name: 'Gualeguaychú' },
  { id: 'federacion', name: 'Federación' },
  { id: 'villaguay', name: 'Villaguay' },
  { id: 'victoria', name: 'Victoria' },
  { id: 'chajari', name: 'Chajarí' },
  { id: 'concepcion-del-uruguay', name: 'Concepción del Uruguay' },
  { id: 'santa-fe-capital', name: 'Santa Fe Capital' },
  { id: 'rosario', name: 'Rosario' },
];

const NOTICIAS_COMUNIDAD = [
  {
    id: 'n1',
    title: 'Se anunció la Fiesta Nacional de la Artesanía 2027 en Colón con grandes artistas',
    category: 'Cultura & Festivales',
    cityName: 'Colón',
    date: '15 de Septiembre, 2026',
    imageUrl: '/images/city-colon.jpg',
    excerpt: 'La fiesta icónica del departamento Colón contará con más de 200 artesanos calificados e importantes shows musicales nacionales.',
  },
  {
    id: 'n2',
    title: 'Concordia lanzó el Programa de Capacitación B2B para Comercios del Citrus',
    category: 'Economía Regional',
    cityName: 'Concordia',
    date: '12 de Septiembre, 2026',
    imageUrl: '/images/city-concordia.jpg',
    excerpt: 'Talleres gratuitos dirigidos a productores citrícolas y emprendedores gastronómicos de la costa del Uruguay.',
  },
  {
    id: 'n3',
    title: 'Maratón Nocturna del Río Paraná convocará a corredores de todo el Litoral',
    category: 'Deporte & Salud',
    cityName: 'Paraná',
    date: '10 de Septiembre, 2026',
    imageUrl: '/images/city-parana.jpg',
    excerpt: 'El circuito recorrerá las barrancas históricas y la costanera paranaense con categorías de 5k, 10k y 21k.',
  },
];

export default function ComunidadPage() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals & Auth State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showAuthAlertModal, setShowAuthAlertModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Cultura & Festivales');
  const [cityId, setCityId] = useState('parana');
  const [excerpt, setExcerpt] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Check auth user on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user || null);
        if (user?.email) {
          setAuthorName(user.user_metadata?.full_name || user.email.split('@')[0]);
        }
      } catch (e) {
        setCurrentUser(null);
      }
    }
    checkAuth();
  }, []);

  // Load events
  useEffect(() => {
    async function loadEvents() {
      try {
        const fetched = await getUpcomingEvents();
        if (fetched && fetched.length > 0) {
          setEvents(fetched);
        }
      } catch (e) {
        console.warn('Error cargando eventos:', e);
      }
    }
    loadEvents();
  }, []);

  const handleOpenNoteModal = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setShowAuthAlertModal(true);
        return;
      }
      setCurrentUser(user);
      if (user.email && !authorName) {
        setAuthorName(user.user_metadata?.full_name || user.email.split('@')[0]);
      }
    } catch (e) {
      setShowAuthAlertModal(true);
      return;
    }
    setShowNoteModal(true);
  };

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
      console.warn('Error subiendo imagen:', err);
      setErrorMsg('No se pudo subir la foto. Se usará una imagen predeterminada.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    setImagePreview(null);
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || isSubmitting) return;

    if (!currentUser) {
      setShowNoteModal(false);
      setShowAuthAlertModal(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const selectedCityObj = CITY_OPTIONS.find((c) => c.id === cityId);
    const cityName = selectedCityObj ? selectedCityObj.name : 'Entre Ríos';
    const finalImageUrl = imageUrl || imagePreview || '/images/commerce-bodega.jpg';

    try {
      const res = await createCommunityArticleAction({
        title: title.trim(),
        category,
        cityId,
        cityName,
        excerpt: excerpt.trim(),
        authorName: authorName.trim() || 'Vecino Registrado',
        imageUrl: finalImageUrl,
        status: 'PENDING',
        isSuperAdmin: false,
      });

      if (res.success) {
        setShowNoteModal(false);
        setTitle('');
        setExcerpt('');
        setImageUrl('');
        setImagePreview(null);
        setSuccessMsg(
          `¡Nota enviada a revisión! Tu propuesta "${title}" fue recibida exitosamente y se encuentra pendiente de validación por el equipo OnMás antes de ser publicada.`
        );
        setTimeout(() => setSuccessMsg(null), 8000);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      console.warn('Error creando nota:', err);
      setErrorMsg('Ocurrió un error al enviar la nota. Intentá nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter((e) => e.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const heroContent = (
    <div className="space-y-4">
      {/* Breadcrumb Glass Badge */}
      <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl w-fit flex items-center gap-2 text-xs font-extrabold text-white shadow-xs">
        <Link href="/" className="hover:text-cyan-300 text-slate-100 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Inicio</span>
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-cyan-300 font-black">Comunidad & Agenda Cultural</span>
      </div>

      {/* Hero Banner Card */}
      <div className="bg-slate-950/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 bg-white/20 text-[#00E5E8] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
            <Users className="w-3.5 h-3.5" />
            Agenda Provincial Unificada
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Comunidad, Eventos & Noticias ON
          </h1>
          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
            Enterate de los festivales, eventos culturales, convocatorias comunitarias y novedades del desarrollo regional de nuestra provincia.
          </p>
        </div>

        {/* CTA Botón Publicar Nota */}
        <div className="relative z-10 shrink-0">
          <button
            onClick={handleOpenNoteModal}
            className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#0047BA] font-black text-xs sm:text-sm px-6 py-4 rounded-2xl shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer border border-white/40"
          >
            <Plus className="w-5 h-5 text-[#00ADB5]" />
            <span>Sumar / Publicar Nota en Comunidad</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <DynamicLayoutWrapper heroContent={heroContent}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">

        {/* Mensaje de Éxito / Notificación de Nota Pendiente */}
        {successMsg && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 flex items-start gap-3.5 text-amber-950 text-xs font-bold animate-in fade-in duration-200 shadow-md">
            <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-sm font-black text-amber-900 block">Propuesta de Nota en Revisión</span>
              <p className="text-slate-700 leading-relaxed font-semibold">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
          <button 
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'all' 
                ? 'bg-[#0047BA] text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Todos los Eventos
          </button>
          <button 
            onClick={() => setSelectedCategory('cultura')}
            className={`px-4 py-2 rounded-xl shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'cultura' 
                ? 'bg-[#0047BA] text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Cultura & Festivales
          </button>
          <button 
            onClick={() => setSelectedCategory('deporte')}
            className={`px-4 py-2 rounded-xl shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'deporte' 
                ? 'bg-[#0047BA] text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Deportes & Maraton
          </button>
          <button 
            onClick={() => setSelectedCategory('economía')}
            className={`px-4 py-2 rounded-xl shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'economía' 
                ? 'bg-[#0047BA] text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Capacitaciones B2B
          </button>
          <button 
            onClick={() => setSelectedCategory('turismo')}
            className={`px-4 py-2 rounded-xl shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'turismo' 
                ? 'bg-[#0047BA] text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Turismo & Gastronomía
          </button>
        </div>

        {/* Featured Events Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-lg font-extrabold text-[#0047BA] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#00ADB5]" />
              <span>Agenda de Eventos Destacados</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Actualizado por la Comunidad & OnMás</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => (
              <div key={evt.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="relative h-48 w-full bg-slate-100">
                  <Image src={evt.imageUrl} alt={evt.title} fill className="object-cover" />
                  <span className="absolute top-3 left-3 bg-[#0047BA] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase shadow-xs">
                    {evt.category}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-extrabold px-3 py-1 rounded-xl flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00E5E8]" />
                    {evt.cityName}
                  </span>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#00ADB5] block">{evt.formattedDate || evt.date}</span>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">{evt.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{evt.excerpt || evt.fullStory}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">{evt.author?.name || 'Comunidad ON'}</span>
                    <Link
                      href={`/comunidad/${evt.id}`}
                      className="bg-cyan-50 hover:bg-cyan-100 text-[#0047BA] px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-colors"
                    >
                      Ver Detalle
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community News Feed */}
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-lg font-extrabold text-[#0047BA] flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#00ADB5]" />
              <span>Noticias de la Comunidad Regional</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {NOTICIAS_COMUNIDAD.map((noticia) => (
              <article key={noticia.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-100">
                    <Image src={noticia.imageUrl} alt={noticia.title} fill className="object-cover" />
                  </div>
                  <span className="text-[10px] font-extrabold text-[#00ADB5] uppercase tracking-wider block">{noticia.category} • {noticia.cityName}</span>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{noticia.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{noticia.excerpt}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold block">{noticia.date}</span>
              </article>
            ))}
          </div>
        </section>

        {/* MODAL DE ALERTA DE REGISTRO REQUERIDO (SI EL USUARIO NO ESTÁ REGISTRADO) */}
        {showAuthAlertModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 text-center">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Registro Requerido para Publicar</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Para sumar una nota a la Comunidad ON MÁS debés estar registrado e iniciar sesión en tu cuenta. Esto nos permite asegurar la veracidad de la información y moderar adecuadamente las publicaciones.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => setShowAuthAlertModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-3 rounded-xl cursor-pointer"
                >
                  Entendido / Cerrar
                </button>
                <Link
                  href="/login"
                  className="flex-1 bg-gradient-to-r from-[#0047BA] to-[#00ADB5] hover:from-[#002878] hover:to-[#007C8A] text-white font-black text-xs py-3 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <User className="w-4 h-4" />
                  <span>Iniciar Sesión / Registrarme</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE CREACIÓN DE NOTA (PARA USUARIOS REGISTRADOS) */}
        {showNoteModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#00ADB5]" />
                    Sumar Nota a la Comunidad
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Sujeta a validación previa del equipo OnMás.</p>
                </div>
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-300 rounded-2xl p-3 text-rose-800 text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCreateNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título de la Nota / Noticia *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Festival de Tradición y Cultura Regional 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Categoría *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    >
                      <option value="Cultura & Festivales">Cultura & Festivales</option>
                      <option value="Economía Regional">Economía Regional</option>
                      <option value="Deporte & Salud">Deporte & Salud</option>
                      <option value="Turismo & Gastronomía">Turismo & Gastronomía</option>
                      <option value="Emprendedores">Emprendedores</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad Destacada *</label>
                    <select
                      value={cityId}
                      onChange={(e) => setCityId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                    >
                      {CITY_OPTIONS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Resumen / Contenido de la Nota *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Escribí los detalles de la noticia o evento comunitario..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Firma / Autor de la Nota</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ej. Vecino de Paraná / Redacción Local"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs font-medium text-slate-800"
                  />
                </div>

                {/* Subida de Imagen de Portada */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Fotografía de Portada (Opcional)</span>
                    {isUploadingImage && (
                      <span className="text-[11px] text-[#00ADB5] font-extrabold flex items-center gap-1 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" /> Subiendo foto...
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
                          placeholder="https://..."
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Tu nota pasará a revisión previa por el equipo OnMás antes de publicarse en la web.</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowNoteModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || isUploadingImage}
                    className="bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white px-6 py-2.5 rounded-xl font-black text-xs shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Enviando a Revisión...' : 'Enviar Nota a Revisión OnMás'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </DynamicLayoutWrapper>
  );
}
