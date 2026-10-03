'use client';

import React, { useState, useEffect } from 'react';
import { City } from '@/types';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Upload, 
  Monitor, 
  Smartphone, 
  RefreshCw, 
  ExternalLink, 
  MapPin, 
  ToggleLeft, 
  ToggleRight, 
  Eye, 
  EyeOff, 
  Sparkles,
  Building2,
  Link as LinkIcon,
  AlertTriangle,
  Check,
  Save
} from 'lucide-react';
import { getBannersByProvince, saveBannersByProvince, fetchBannersFromSupabase, BannerItem, normalizeImageUrl } from '@/lib/services/banner-store';
import { getProvincesConfig, saveProvincesConfig, fetchProvincesFromSupabase, ProvinceItem, ProvinceCityItem } from '@/lib/services/province-store';
import { saveBannerSlidesAction } from '@/server/actions/superadmin';
import { uploadImageToSupabase } from '@/lib/supabase/storage';
import { getCitiesByProvince } from '@/lib/constants/locations';

const MAX_PROVINCES = 5;

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
  const [newBannerCtaHref, setNewBannerCtaHref] = useState('');

  // Form para gestión de ciudades de la provincia elegida
  const [provinceCities, setProvinceCities] = useState<ProvinceCityItem[]>([]);
  const [newCityName, setNewCityName] = useState('');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Cargar lista de provincias al montar
  useEffect(() => {
    let isMounted = true;
    const loadedProvinces = getProvincesConfig();
    setProvinces(loadedProvinces);
    if (loadedProvinces.length > 0 && !loadedProvinces.some((p) => p.id === selectedProvinceId)) {
      setSelectedProvinceId(loadedProvinces[0].id);
    }

    fetchProvincesFromSupabase().then((provs) => {
      if (isMounted && provs && provs.length > 0) {
        setProvinces(provs);
      }
    });

    return () => { isMounted = false; };
  }, []);

  // Cargar banners y ciudades al cambiar la provincia seleccionada
  useEffect(() => {
    let isMounted = true;
    if (selectedProvinceId) {
      const loadedBanners = getBannersByProvince(selectedProvinceId);
      setBanners(loadedBanners);

      fetchBannersFromSupabase(selectedProvinceId).then((b) => {
        if (isMounted) setBanners(b);
      });

      // Cargar ciudades para la provincia seleccionada
      const currProv = provinces.find((p) => p.id === selectedProvinceId || p.slug === selectedProvinceId);
      if (currProv && Array.isArray(currProv.cities) && currProv.cities.length > 0) {
        setProvinceCities(currProv.cities);
      } else {
        const defaults = getCitiesByProvince(selectedProvinceId).map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug || c.id,
          isActive: true,
        }));
        setProvinceCities(defaults);
      }

      setNewBannerCtaHref(`/${selectedProvinceId}`);
    }
    return () => { isMounted = false; };
  }, [selectedProvinceId, provinces]);

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

  // Borrar Provincia con mensaje de confirmación
  const handleDeleteProvince = (provId: string) => {
    const prov = provinces.find((p) => p.id === provId);
    if (!prov) return;

    if (!window.confirm(`¿Estás seguro de que deseás eliminar permanentemente la provincia "${prov.name}"?\nEsta acción eliminará su configuración y sus banners.`)) {
      return;
    }

    const updated = provinces.filter((p) => p.id !== provId);
    setProvinces(updated);
    saveProvincesConfig(updated);

    if (selectedProvinceId === provId) {
      if (updated.length > 0) {
        setSelectedProvinceId(updated[0].id);
      }
    }

    setSuccessMsg(`Provincia "${prov.name}" eliminada correctamente.`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // Crear nueva provincia (con límite de 5 max)
  const handleCreateProvince = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvinceName.trim()) return;

    if (provinces.length >= MAX_PROVINCES) {
      alert(`🔒 Has alcanzado el límite del desarrollo (${MAX_PROVINCES} provincias máximas configuradas en la plataforma). Eliminá una provincia existente si querés agregar una nueva.`);
      return;
    }

    const slug = newProvinceName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = slug;

    if (provinces.some((p) => p.id === id)) {
      alert('Ya existe una provincia con ese nombre o slug.');
      return;
    }

    const defaultCitiesForNewProv = getCitiesByProvince(id).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug || c.id,
      isActive: true,
    }));

    const newProv: ProvinceItem = {
      id,
      name: newProvinceName.trim(),
      slug,
      isActive: newProvinceIsActive,
      badge: newProvinceBadge.trim() || 'Próximamente',
      cities: defaultCitiesForNewProv,
    };

    const updated = [...provinces, newProv];
    setProvinces(updated);
    saveProvincesConfig(updated);

    setSelectedProvinceId(id);
    setNewProvinceName('');
    setNewProvinceBadge('Próximamente');
    setNewProvinceIsActive(false);
    setShowAddProvinceForm(false);

    setSuccessMsg(`Provincia "${newProv.name}" creada exitosamente.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Guardar ciudades para la provincia actual
  const handleSaveProvinceCities = () => {
    const updatedProvinces = provinces.map((p) =>
      p.id === selectedProvinceId ? { ...p, cities: provinceCities } : p
    );
    setProvinces(updatedProvinces);
    saveProvincesConfig(updatedProvinces);

    setSuccessMsg(`Ciudades de ${currentProv.name} guardadas e ingresadas en los selectores del portal.`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleToggleCityActive = (cityId: string) => {
    setProvinceCities((prev) =>
      prev.map((c) => (c.id === cityId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleAddCityToProvince = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    const citySlug = newCityName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cityId = citySlug;

    if (provinceCities.some((c) => c.id === cityId)) {
      alert('Ya existe esa ciudad en la lista.');
      return;
    }

    const newCity: ProvinceCityItem = {
      id: cityId,
      name: newCityName.trim(),
      slug: citySlug,
      isActive: true,
    };

    const updatedCities = [...provinceCities, newCity];
    setProvinceCities(updatedCities);
    setNewCityName('');

    const updatedProvinces = provinces.map((p) =>
      p.id === selectedProvinceId ? { ...p, cities: updatedCities } : p
    );
    setProvinces(updatedProvinces);
    saveProvincesConfig(updatedProvinces);

    setSuccessMsg(`Ciudad "${newCity.name}" agregada a ${currentProv.name}.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDeleteCity = (cityId: string) => {
    const updatedCities = provinceCities.filter((c) => c.id !== cityId);
    setProvinceCities(updatedCities);

    const updatedProvinces = provinces.map((p) =>
      p.id === selectedProvinceId ? { ...p, cities: updatedCities } : p
    );
    setProvinces(updatedProvinces);
    saveProvincesConfig(updatedProvinces);
  };

  // File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadImageToSupabase(file, 'commerces');
      callback(publicUrl);
    } catch (err) {
      console.warn('Error uploading banner file to storage:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const syncToSupabase = async (provId: string, updatedBanners: BannerItem[]) => {
    setIsUploading(true);
    try {
      const res = await saveBannerSlidesAction(provId, updatedBanners);
      if (res.success) {
        const finalBanners = res.banners !== undefined ? res.banners : updatedBanners;
        setBanners(finalBanners);
        saveBannersByProvince(provId, finalBanners);
      } else {
        saveBannersByProvince(provId, updatedBanners);
      }
    } catch (e) {
      console.warn('Superadmin banner sync notice:', e);
      saveBannersByProvince(provId, updatedBanners);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerImage || isUploading) return;

    const resolvedCtaHref = newBannerCtaHref.trim() || `/${selectedProvinceId}`;

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
      ctaHref: resolvedCtaHref,
    };

    const updated = [newBanner, ...banners];
    setBanners(updated);
    setNewBannerImage(null);
    saveBannersByProvince(selectedProvinceId, updated);

    await syncToSupabase(selectedProvinceId, updated);

    setSuccessMsg(`¡Nuevo banner publicado para ${currentProv.name}!`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleChangeBannerImage = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, async (base64) => {
      const updated = banners.map((b) => (b.id === id ? { ...b, imageUrl: base64 } : b));
      setBanners(updated);
      saveBannersByProvince(selectedProvinceId, updated);
      await syncToSupabase(selectedProvinceId, updated);

      setSuccessMsg('Imagen del banner actualizada exitosamente.');
      setTimeout(() => setSuccessMsg(null), 3000);
    });
  };

  const handleUpdateBannerCtaHref = async (id: string, ctaHref: string) => {
    const updated = banners.map((b) => (b.id === id ? { ...b, ctaHref } : b));
    setBanners(updated);
    saveBannersByProvince(selectedProvinceId, updated);
    await syncToSupabase(selectedProvinceId, updated);

    setSuccessMsg('URL de redirección del banner actualizada.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleDeleteBanner = async (id: string) => {
    const updated = banners.filter((b) => b.id !== id);
    setBanners(updated);
    saveBannersByProvince(selectedProvinceId, updated);
    await syncToSupabase(selectedProvinceId, updated);

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

      {/* BLOQUE 1: Gestión de Provincias (Activas / Próximas / Crear / Borrar / Límite 5) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#00ADB5]" />
              Gestión de Provincias ({provinces.length} / {MAX_PROVINCES} Máximo)
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Provincias del Portal Regional
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Elegí qué provincias están activas en la web principal, eliminá las que no uses y administrá las provincias en desarrollo.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (provinces.length >= MAX_PROVINCES && !showAddProvinceForm) {
                alert(`🔒 Has alcanzado el límite máximo del desarrollo (${MAX_PROVINCES} provincias configuradas). Eliminá una provincia existente antes de crear una nueva.`);
                return;
              }
              setShowAddProvinceForm(!showAddProvinceForm);
            }}
            disabled={provinces.length >= MAX_PROVINCES && !showAddProvinceForm}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0047BA] to-[#00ADB5] hover:from-[#0B66FF] hover:to-[#0047BA] disabled:opacity-50 text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddProvinceForm ? 'Cancelar' : 'Crear Nueva Provincia'}</span>
          </button>
        </div>

        {/* Notificación de límite de 5 provincias */}
        {provinces.length >= MAX_PROVINCES && (
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl flex items-center gap-3 text-amber-900 text-xs font-bold shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Límite del desarrollo alcanzado:</strong> Hay {provinces.length} de {MAX_PROVINCES} provincias configuradas. Si deseás agregar una nueva provincia, debés borrar o desactivar una existente.
            </span>
          </div>
        )}

        {/* Formulario para Crear Provincia */}
        {showAddProvinceForm && provinces.length < MAX_PROVINCES && (
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

        {/* Listado de Provincias con Toggle Activo/Inactivo y Borrar con Confirmación */}
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

                  <div className="flex items-center gap-1">
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

                    {/* Botón Borrar Provincia */}
                    <button
                      type="button"
                      onClick={() => handleDeleteProvince(prov.id)}
                      className="text-rose-400 hover:text-rose-700 hover:bg-rose-100 p-1.5 rounded-xl transition-all"
                      title={`Borrar provincia ${prov.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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

      {/* BLOQUE 2: Selector de Ciudades para la Provincia Seleccionada */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0047BA]" />
              Ciudades para el Selector de: <span className="text-[#0047BA]">{currentProv.name}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Elegí qué ciudades se muestran en el menú selector superior y agregá nuevas ciudades para {currentProv.name}.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveProvinceCities}
            className="inline-flex items-center gap-2 bg-[#00ADB5] hover:bg-[#007C8A] text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Ciudades de {currentProv.name}</span>
          </button>
        </div>

        {/* Formulario para agregar ciudad a esta provincia */}
        <form onSubmit={handleAddCityToProvince} className="flex flex-col sm:flex-row gap-3 items-end bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1">Agregar Nueva Ciudad a {currentProv.name}</label>
            <input
              type="text"
              placeholder="Ej. Santo Tomé, San Lorenzo, Reconquista..."
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
            />
          </div>
          <button
            type="submit"
            disabled={!newCityName.trim()}
            className="bg-[#0047BA] hover:bg-[#002878] disabled:opacity-50 text-white px-4 py-2 text-xs font-black rounded-xl cursor-pointer inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Ciudad</span>
          </button>
        </form>

        {/* Grilla de Ciudades de la Provincia con checkbox Activa / Inactiva */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {provinceCities.map((city) => (
            <div
              key={city.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                city.isActive
                  ? 'bg-cyan-50/60 border-cyan-300 text-slate-900'
                  : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold flex-1 truncate">
                <input
                  type="checkbox"
                  checked={city.isActive}
                  onChange={() => handleToggleCityActive(city.id)}
                  className="w-4 h-4 text-[#00ADB5] rounded focus:ring-[#00ADB5] cursor-pointer"
                />
                <span className="truncate">{city.name}</span>
              </label>

              <button
                type="button"
                onClick={() => handleDeleteCity(city.id)}
                className="text-slate-400 hover:text-rose-600 p-1"
                title={`Eliminar ciudad ${city.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BLOQUE 3: Banners Hero de la Provincia Seleccionada */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#00ADB5]" />
              Banners para Provincia: <span className="text-[#0047BA]">{currentProv.name}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Subí las imágenes y configurá la URL de redirección al hacer clic.
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-cyan-50 border border-cyan-300 text-cyan-900 px-3 py-1 rounded-xl text-[11px] font-black shadow-2xs">
              <span>📐 Tamaño Recomendado de Imagen:</span>
              <span className="text-[#0047BA]">1920 x 500 px (o proporción 16:4 en HD)</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleAddBanner} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                URL de Destino al Hacer Clic
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Ej. /${selectedProvinceId}/rosario o https://...`}
                  value={newBannerCtaHref}
                  onChange={(e) => setNewBannerCtaHref(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]"
                />
                <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
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
            disabled={!newBannerImage || isUploading}
            className="w-full sm:w-auto bg-[#0047BA] hover:bg-[#002878] disabled:opacity-50 text-white px-6 py-3 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Subiendo a Servidor...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Publicar Banner en {currentProv.name}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* BLOQUE 4: Galería de Banners Reales */}
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
                    src={normalizeImageUrl(banner.imageUrl)}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* URL de Destino Editable */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5 text-[#00ADB5]" />
                    <span>URL de Redirección al hacer clic:</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={banner.ctaHref || `/${selectedProvinceId}`}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBanners((prev) =>
                          prev.map((b) => (b.id === banner.id ? { ...b, ctaHref: val } : b))
                        );
                      }}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateBannerCtaHref(banner.id, banner.ctaHref || `/${selectedProvinceId}`)}
                      className="bg-[#0047BA] hover:bg-[#002878] text-white px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors shrink-0 flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar URL</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
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
