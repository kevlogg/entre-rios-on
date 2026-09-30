'use client';

import React, { useState, useEffect } from 'react';
import { City } from '@/types';
import { Image as ImageIcon, Plus, Trash2, CheckCircle, Upload, Monitor, Smartphone, RefreshCw, ExternalLink, MapPin, ToggleLeft, ToggleRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { getBannersByProvince, saveBannersByProvince, BannerItem } from '@/lib/services/banner-store';
import { getProvincesConfig, saveProvincesConfig, ProvinceItem } from '@/lib/services/province-store';

interface GeoCustomizerManagerProps {
  initialCities?: City[];
}

export function GeoCustomizerManager({ initialCities }: GeoCustomizerManagerProps) {
  const [provinces, setProvinces] = useState<ProvinceItem[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState('santa-fe');
  const [banners, setBanners] = useState<BannerItem[]>([]);

  // Form para crear nueva provincia
  const [newProvinceName, setNewProvinceName] = useState('');
  const [newProvinceBadge, setNewProvinceBadge] = useState('Próximamente');
  const [newProvinceIsActive, setNewProvinceIsActive] = useState(false);
  const [showAddProvinceForm, setShowAddProvinceForm] = useState(false);

  // Form para nuevo banner
  const [newBannerDevice, setNewBannerDevice] = useState<'desktop' | 'mobile' | 'all'>('all');
  const [newBannerImage, setNewBannerImage] = useState<string | null>(null);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Cargar lista de provincias al montar
  useEffect(() => {
    const loadedProvinces = getProvincesConfig();
    setProvinces(loadedProvinces);
    if (loadedProvinces.length > 0 && !loadedProvinces.some((p) => p.id === selectedProvinceId)) {
      setSelectedProvinceId(loadedProvinces[0].id);
    }
  }, []);

  // Cargar banners al cambiar la provincia seleccionada
  useEffect(() => {
    if (selectedProvinceId) {
      const loadedBanners = getBannersByProvince(selectedProvinceId);
      setBanners(loadedBanners);
    }
  }, [selectedProvinceId]);

  const currentProv = provinces.find((p) => p.id === selectedProvinceId) || {
    id: selectedProvinceId,
    name: selectedProvinceId,
    slug: selectedProvinceId,
    isActive: true,
  };

  // Toggle Activa / Inactiva para una provincia
  const handleToggleProvinceActive = (provId: string) => {
    const updated = provinces.map((p) => (p.id === provId ? { ...p, isActive: !p.isActive } : p));
    setProvinces(updated);
    saveProvincesConfig(updated);

    const prov = updated.find((p) => p.id === provId);
    setSuccessMsg(`Provincia "${prov?.name}" ahora está ${prov?.isActive ? 'ACTIVA en la web principal' : 'INACTIVA (Próximamente)'}.`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // Crear nueva provincia
  const handleCreateProvince = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvinceName.trim()) return;

    const slug = newProvinceName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = slug;

    if (provinces.some((p) => p.id === id)) {
      alert('Ya existe una provincia con ese nombre o slug.');
      return;
    }

    const newProv: ProvinceItem = {
      id,
      name: newProvinceName.trim(),
      slug,
      isActive: newProvinceIsActive,
      badge: newProvinceBadge.trim() || 'Próximamente',
    };

    const updated = [...provinces, newProv];
    setProvinces(updated);
    saveProvincesConfig(updated);

    setSelectedProvinceId(id);
    setNewProvinceName('');
    setNewProvinceBadge('Próximamente');
    setNewProvinceIsActive(false);
    setShowAddProvinceForm(false);

    setSuccessMsg(`Provincia "${newProv.name}" creada exitosamente. Podés agregar sus banners ahora.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        callback(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerImage) return;

    const newBanner: BannerItem = {
      id: `b-${Date.now()}`,
      provinceId: selectedProvinceId,
      imageUrl: newBannerImage,
      device: newBannerDevice,
      location: `${currentProv.name} ON`,
      titleLine1: `${currentProv.name.toUpperCase()},`,
      titleLine2: 'SIEMPRE ON MÁS',
      subtitle: 'Comprá. Vendé. Publicá. Conectá.',
      ctaText: `Explorar ${currentProv.name}`,
      ctaHref: `/${selectedProvinceId}`,
    };

    const updated = [newBanner, ...banners];
    setBanners(updated);
    saveBannersByProvince(selectedProvinceId, updated);

    setNewBannerImage(null);
    setSuccessMsg(`¡Nuevo banner publicado para ${currentProv.name}!`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleChangeBannerImage = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, (base64) => {
      const updated = banners.map((b) => (b.id === id ? { ...b, imageUrl: base64 } : b));
      setBanners(updated);
      saveBannersByProvince(selectedProvinceId, updated);

      setSuccessMsg('Imagen del banner actualizada exitosamente.');
      setTimeout(() => setSuccessMsg(null), 3000);
    });
  };

  const handleDeleteBanner = (id: string) => {
    const updated = banners.filter((b) => b.id !== id);
    setBanners(updated);
    saveBannersByProvince(selectedProvinceId, updated);

    setSuccessMsg('Banner eliminado correctamente.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* Alerta de Mensajes */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-150 shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* BLOQUE 1: Gestión de Provincias (Activas / Próximas / Crear) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#00ADB5]" />
              Gestión de Provincias
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Provincias del Portal Regional ({provinces.length})
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Elegí qué provincias están activas en la web principal y prepará las provincias en desarrollo.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddProvinceForm(!showAddProvinceForm)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0047BA] to-[#00ADB5] hover:from-[#0B66FF] hover:to-[#0047BA] text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddProvinceForm ? 'Cancelar' : 'Crear Nueva Provincia'}</span>
          </button>
        </div>

        {/* Formulario para Crear Provincia */}
        {showAddProvinceForm && (
          <form onSubmit={handleCreateProvince} className="bg-cyan-50/60 border border-cyan-200 p-5 rounded-2xl space-y-4 animate-in fade-in duration-150">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#0047BA] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00ADB5]" />
              Nueva Provincia en Plataforma
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Provincia *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Córdoba, Corrientes..."
                  value={newProvinceName}
                  onChange={(e) => setNewProvinceName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Etiqueta / Insignia</label>
                <input
                  type="text"
                  placeholder="Ej. Próximamente / Lanzamiento"
                  value={newProvinceBadge}
                  onChange={(e) => setNewProvinceBadge(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Visibilidad Inicial</label>
                <select
                  value={newProvinceIsActive ? 'active' : 'inactive'}
                  onChange={(e) => setNewProvinceIsActive(e.target.value === 'active')}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                >
                  <option value="inactive">🔒 Inactiva (Próximamente / No visible en portada)</option>
                  <option value="active">✅ Activa en Web Principal</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#0047BA] hover:bg-[#002878] text-white px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Guardar Provincia</span>
            </button>
          </form>
        )}

        {/* Listado de Provincias con Toggle Activo/Inactivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {provinces.map((prov) => {
            const isSelected = selectedProvinceId === prov.id;
            return (
              <div
                key={prov.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-50/70 border-[#00ADB5] ring-2 ring-[#00ADB5]/30 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{prov.name}</h3>
                    <span
                      className={`inline-block text-[10px] font-extrabold px-2.5 py-0.5 rounded-full mt-1 ${
                        prov.isActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {prov.isActive ? '✅ Activa en Portada' : '🔒 Próximamente (Inactiva)'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleProvinceActive(prov.id)}
                    className="text-slate-600 hover:text-[#0047BA] transition-colors p-1"
                    title={prov.isActive ? 'Desactivar visibilidad en portada' : 'Activar visibilidad en portada'}
                  >
                    {prov.isActive ? (
                      <ToggleRight className="w-7 h-7 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-400" />
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedProvinceId(prov.id)}
                    className={`text-xs font-extrabold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0047BA] text-white shadow-xs'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    {isSelected ? 'Gestionando Banners ★' : 'Gestionar Banners'}
                  </button>

                  <a
                    href={`/${prov.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-[#0047BA] text-xs font-bold flex items-center gap-1"
                  >
                    <span>Ver</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BLOQUE 2: Banners Hero de la Provincia Seleccionada */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#00ADB5]" />
              Banners para Provincia: <span className="text-[#0047BA]">{currentProv.name}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Subí las imágenes que se mostrarán en el carrusel hero de {currentProv.name}.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddBanner} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Dispositivo de Destino
              </label>
              <select
                value={newBannerDevice}
                onChange={(e) => setNewBannerDevice(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
              >
                <option value="all">🌐 Todos los dispositivos</option>
                <option value="desktop">💻 Escritorio (Desktop)</option>
                <option value="mobile">📱 Celular (Mobile)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Seleccionar Archivo de Imagen *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, setNewBannerImage)}
                className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#00ADB5] file:text-white cursor-pointer"
              />
            </div>
          </div>

          {newBannerImage && (
            <div className="relative h-44 w-full rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-sm">
              <img src={newBannerImage} alt="Previsualización" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                Vista Previa de Carga
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!newBannerImage}
            className="w-full sm:w-auto bg-[#0047BA] hover:bg-[#002878] disabled:opacity-50 text-white px-6 py-3 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Banner en {currentProv.name}</span>
          </button>
        </form>
      </div>

      {/* BLOQUE 3: Galería de Banners Reales */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#0047BA]" />
              Banners Activos de {currentProv.name} ({banners.length})
            </h3>
          </div>
        </div>

        {banners.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-500">No hay banners configurados para {currentProv.name}.</p>
            <p className="text-[11px] text-slate-400">Podés agregar imágenes arriba para tener la provincia lista para su lanzamiento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">
                    Banner #{index + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {banner.device === 'desktop' && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-cyan-100 text-[#0047BA] font-extrabold px-2.5 py-0.5 rounded-full">
                        <Monitor className="w-3 h-3" /> Desktop
                      </span>
                    )}
                    {banner.device === 'mobile' && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full">
                        <Smartphone className="w-3 h-3" /> Mobile
                      </span>
                    )}
                    {(!banner.device || banner.device === 'all') && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-purple-100 text-purple-900 font-extrabold px-2.5 py-0.5 rounded-full">
                        🌐 Todos los dispositivos
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative h-48 w-full rounded-xl overflow-hidden border border-slate-300 shadow-xs bg-slate-900 group">
                  <img
                    src={banner.imageUrl}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <label className="flex-1 bg-[#00ADB5] hover:bg-[#007C8A] text-white py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Cambiar Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleChangeBannerImage(banner.id, e)}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="bg-rose-100 hover:bg-rose-200 text-rose-700 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
