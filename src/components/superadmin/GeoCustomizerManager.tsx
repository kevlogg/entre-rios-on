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
import { useSectionCards, saveSectionCards, SectionCardItem } from '@/lib/services/section-cards-store';
import { useHeroBadgeStyle, saveHeroBadgeStyle, HeroBadgeStyle, hexToRgba } from '@/lib/services/hero-badge-store';
import { useSideBanners, saveSideBanners, SideBannerItem } from '@/lib/services/side-banners-store';

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

  // Section Cards state
  const sectionCards = useSectionCards();
  const [localSectionCards, setLocalSectionCards] = useState<SectionCardItem[]>([]);

  // Side Banners state
  const sideBanners = useSideBanners();
  const [localSideBanners, setLocalSideBanners] = useState<SideBannerItem[]>([]);

  // Hero Badge state
  const globalHeroBadgeStyle = useHeroBadgeStyle();
  const [localBadgeStyle, setLocalBadgeStyle] = useState<HeroBadgeStyle>(globalHeroBadgeStyle);

  useEffect(() => {
    if (globalHeroBadgeStyle) {
      setLocalBadgeStyle(globalHeroBadgeStyle);
    }
  }, [globalHeroBadgeStyle]);

  useEffect(() => {
    if (sectionCards && sectionCards.length > 0) {
      setLocalSectionCards(sectionCards);
    }
  }, [sectionCards]);

  useEffect(() => {
    if (sideBanners && sideBanners.length > 0) {
      setLocalSideBanners(sideBanners);
    }
  }, [sideBanners]);

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

  const handleChangeCityImage = (cityId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, (url) => {
      const updated = provinceCities.map((c) => (c.id === cityId ? { ...c, imageUrl: url } : c));
      setProvinceCities(updated);
      const updatedProvinces = provinces.map((p) =>
        p.id === selectedProvinceId ? { ...p, cities: updated } : p
      );
      setProvinces(updatedProvinces);
      saveProvincesConfig(updatedProvinces);
      setSuccessMsg(`Imagen de fondo actualizada para la card de ciudad.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    });
  };

  const handleChangeSectionCardImage = (cardId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, (url) => {
      const updated = localSectionCards.map((c) => (c.id === cardId ? { ...c, image: url } : c));
      setLocalSectionCards(updated);
      saveSectionCards(updated);
      setSuccessMsg(`Imagen de fondo actualizada para la card de sección.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    });
  };

  const handleChangeSideBannerImage = (bannerId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, (url) => {
      const updated = localSideBanners.map((b) => (b.id === bannerId ? { ...b, imageUrl: url } : b));
      setLocalSideBanners(updated);
      saveSideBanners(updated);
      setSuccessMsg(`Imagen de publicidad lateral actualizada.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    });
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

      {/* BLOQUE 2: Selector & Imágenes de Cards para Ciudades (Imagen 1) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0047BA]" />
              Ciudades & Cards de: <span className="text-[#0047BA]">{currentProv.name}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Personalizá la imagen de fondo para la card de cada ciudad que se muestra en el inicio y activá/desactivá su presencia en los selectores.
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-cyan-50 border border-cyan-300 text-cyan-900 px-3 py-1 rounded-xl text-[11px] font-black shadow-2xs">
              <span>📐 Tamaño Ideal para Card de Ciudad:</span>
              <span className="text-[#0047BA]">400 x 300 px (o proporción 4:3 en HD)</span>
            </div>
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

        {/* Grilla de Cards de Ciudades con vista previa e imagen de fondo (Matching Image 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {provinceCities.map((city) => (
            <div
              key={city.id}
              className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                city.isActive
                  ? 'bg-white border-cyan-300 shadow-2xs'
                  : 'bg-slate-100 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-black text-slate-900 truncate">
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

              {/* Live Preview Card matching Image 1 */}
              <div className="relative h-24 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group shadow-2xs">
                <img
                  src={city.imageUrl || '/images/city-parana.jpg'}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase">
                  Vista Previa Card
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-xs py-1 px-2 text-center border-t border-slate-100">
                  <span className="text-[11px] font-black text-slate-800 truncate block">{city.name}</span>
                </div>
              </div>

              {/* Botón Uploader para cambiar foto de la Card de Ciudad */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                  Elegir Foto de Fondo (400x300 px)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleChangeCityImage(city.id, e)}
                  className="w-full text-[10px] text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-[#00ADB5] file:text-white cursor-pointer"
                />
              </div>
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
              Subí las imágenes publicitarias y configurá la URL a la que redirigen al hacer clic.
            </p>
            <div className="mt-2 space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-cyan-50 border border-cyan-300 text-cyan-900 px-3.5 py-1.5 rounded-xl text-[11px] font-black shadow-2xs">
                <span>📐 Medidas Recomendadas para Hero Banners:</span>
                <span className="text-[#0047BA] font-extrabold">1920 × 600 px (3:1 Desktop) | 800 × 500 px (Mobile)</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                ✨ <em>El reproductor adapta automáticamente cada imagen al 100% de su tamaño (<span className="font-bold text-slate-700">sin recortes ni pérdidas de bordes o textos</span>) con un fondo ambiente difuminado.</em>
              </p>
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

      {/* BLOQUE 4.5: Personalización del Badge de Provincia sobre el Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#00ADB5]" />
              Margen Inferior Izquierdo del Hero
            </span>
            <h3 className="text-base font-black text-slate-900 mt-1">
              Diseño y Colores del Badge de Provincia
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Personalizá los colores, la opacidad del fondo, el borde, la fuente y el ícono del cartel de la provincia ubicada en la esquina inferior izquierda del banner.
            </p>
          </div>

          <button
            type="button"
            onClick={async () => {
              const res = await saveHeroBadgeStyle(localBadgeStyle);
              if (res.success) {
                setSuccessMsg('¡Estilo del badge del hero guardado exitosamente!');
              } else {
                setSuccessMsg('Estilo guardado en memoria local.');
              }
              setTimeout(() => setSuccessMsg(null), 3500);
            }}
            className="inline-flex items-center gap-2 bg-[#0047BA] hover:bg-[#002878] text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Diseño del Badge</span>
          </button>
        </div>

        {/* Vista Previa en Vivo sobre Banner Oscuro */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden shadow-inner">
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block">
            Vista Previa en Vivo (Esquina Inferior Izquierda del Banner)
          </span>
          <div className="pt-8 pb-4">
            <div 
              className="backdrop-blur-md inline-flex items-center gap-2 shadow-2xl transition-all rounded-2xl sm:rounded-3xl"
              style={{
                backgroundColor: hexToRgba(localBadgeStyle.backgroundColor, localBadgeStyle.backgroundOpacity),
                borderColor: localBadgeStyle.borderColor,
                borderWidth: `${localBadgeStyle.borderWidth}px`,
                borderStyle: localBadgeStyle.borderWidth > 0 ? 'solid' : 'none',
                padding: localBadgeStyle.size === 'sm' ? '6px 16px' : localBadgeStyle.size === 'lg' ? '14px 36px' : '10px 24px',
              }}
            >
              {localBadgeStyle.showIcon && (
                <MapPin 
                  className={`shrink-0 animate-pulse ${
                    localBadgeStyle.size === 'sm' ? 'w-4 h-4' : localBadgeStyle.size === 'lg' ? 'w-7 h-7' : 'w-5 h-5'
                  }`}
                  style={{ color: localBadgeStyle.iconColor }}
                />
              )}
              <span 
                className={`font-black tracking-wider ${
                  localBadgeStyle.size === 'sm' ? 'text-xs' : localBadgeStyle.size === 'lg' ? 'text-2xl' : 'text-lg'
                }`}
                style={{ color: localBadgeStyle.textColor }}
              >
                {localBadgeStyle.uppercase ? (currentProv.name || 'SANTA FE').toUpperCase() : (currentProv.name || 'Santa Fe')}
              </span>
            </div>
          </div>
        </div>

        {/* Formulario de Controles de Estilo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          
          {/* Color de Fondo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Color de Fondo</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={localBadgeStyle.backgroundColor}
                onChange={(e) => setLocalBadgeStyle({ ...localBadgeStyle, backgroundColor: e.target.value })}
                className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={localBadgeStyle.backgroundColor}
                onChange={(e) => setLocalBadgeStyle({ ...localBadgeStyle, backgroundColor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Opacidad del Fondo */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Opacidad Fondo: <span className="text-[#0047BA]">{localBadgeStyle.backgroundOpacity}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={localBadgeStyle.backgroundOpacity}
              onChange={(e) => setLocalBadgeStyle({ ...localBadgeStyle, backgroundOpacity: Number(e.target.value) })}
              className="w-full accent-[#00ADB5] cursor-pointer mt-2"
            />
          </div>

          {/* Color del Texto */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Color del Texto</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={localBadgeStyle.textColor}
                onChange={(e) => setLocalBadgeStyle({ ...localBadgeStyle, textColor: e.target.value })}
                className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={localBadgeStyle.textColor}
                onChange={(e) => setLocalBadgeStyle({ ...localBadgeStyle, textColor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Color del Borde */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Color del Borde</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={localBadgeStyle.borderColor}
                onChange={(e) => setLocalBadgeStyle({ ...localBadgeStyle, borderColor: e.target.value })}
                className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={localBadgeStyle.borderColor}
                onChange={(e) => setLocalBadgeStyle({ ...localBadgeStyle, borderColor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Grosor del Borde */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Grosor del Borde</label>
            <select
              value={localBadgeStyle.borderWidth}
              onChange={(e) => setLocalBadgeStyle({ ...localBadgeStyle, borderWidth: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
            >
              <option value={0}>Sin Borde (0px)</option>
              <option value={1}>Fino (1px)</option>
              <option value={2}>Mediano (2px)</option>
              <option value={3}>Grueso (3px)</option>
              <option value={4}>Muy Grueso (4px)</option>
            </select>
          </div>

          {/* Tamaño del Cartel */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tamaño del Cartel</label>
            <select
              value={localBadgeStyle.size}
              onChange={(e) => setLocalBadgeStyle({ ...localBadgeStyle, size: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
            >
              <option value="sm">Pequeño (Compacto)</option>
              <option value="md">Mediano (Estándar)</option>
              <option value="lg">Grande (Destacado)</option>
            </select>
          </div>

          {/* Color del Ícono Pin */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Color del Ícono Pin</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={localBadgeStyle.iconColor}
                onChange={(e) => setLocalBadgeStyle({ ...localBadgeStyle, iconColor: e.target.value })}
                className="w-9 h-9 rounded-xl border border-slate-300 cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={localBadgeStyle.iconColor}
                onChange={(e) => setLocalBadgeStyle({ ...localBadgeStyle, iconColor: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Opciones de Texto / Ícono */}
          <div className="flex flex-col gap-2 justify-end">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={localBadgeStyle.uppercase}
                onChange={(e) => setLocalBadgeStyle({ ...localBadgeStyle, uppercase: e.target.checked })}
                className="w-4 h-4 text-[#00ADB5] rounded focus:ring-[#00ADB5] cursor-pointer"
              />
              <span>MAYÚSCULAS</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700">
              <input
                type="checkbox"
                checked={localBadgeStyle.showIcon}
                onChange={(e) => setLocalBadgeStyle({ ...localBadgeStyle, showIcon: e.target.checked })}
                className="w-4 h-4 text-[#00ADB5] rounded focus:ring-[#00ADB5] cursor-pointer"
              />
              <span>Mostrar ícono Pin</span>
            </label>
          </div>

        </div>
      </div>

      {/* BLOQUE 5: Personalización de las 8 Cards de Secciones (Portada) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00ADB5]" />
              Imágenes y Contenido para Cards de Secciones (Bento Cards en Portada)
            </h3>
            <p className="text-xs text-slate-500">
              Personalizá, agregá o eliminá las cards principales que se muestran en el inicio. Podés cambiar la imagen subiendo un archivo, editar el título, la descripción, el botón y la URL a donde redirige al hacer clic.
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-cyan-50 border border-cyan-300 text-cyan-900 px-3 py-1 rounded-xl text-[11px] font-black shadow-2xs">
              <span>📐 Tamaño Recomendado de Imagen:</span>
              <span className="text-[#0047BA]">600 × 400 px (o proporción 3:2 en HD)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={() => {
                const newCard: SectionCardItem = {
                  id: `card-${Date.now()}`,
                  title: 'NUEVA SECCIÓN DESTACADA',
                  subtitle: 'Descripción breve de la nueva sección.',
                  cta: 'Ver más',
                  href: '/catalogo',
                  image: '/images/bento-1.jpg',
                  idealSize: '600 × 400 px (3:2 en HD)',
                };
                const updated = [...localSectionCards, newCard];
                setLocalSectionCards(updated);
                saveSectionCards(updated);
                setSuccessMsg('Se ha agregado una nueva card exitosamente.');
                setTimeout(() => setSuccessMsg(null), 3500);
              }}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-2xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Sumar Nueva Card</span>
            </button>

            <button
              type="button"
              onClick={() => {
                saveSectionCards(localSectionCards);
                setSuccessMsg(`Se guardaron ${localSectionCards.length} cards de secciones exitosamente.`);
                setTimeout(() => setSuccessMsg(null), 3500);
              }}
              className="inline-flex items-center gap-2 bg-[#0047BA] hover:bg-[#002878] text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Todo ({localSectionCards.length})</span>
            </button>
          </div>
        </div>

        {/* Grilla de las Cards de Secciones con Live Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {localSectionCards.map((card, index) => (
            <div key={card.id || index} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wide truncate max-w-[200px]">
                  Card #{index + 1}: {card.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-[#00ADB5] bg-cyan-100/80 border border-cyan-300 px-2 py-0.5 rounded-md hidden sm:inline">
                    {card.idealSize || '600 × 400 px'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Estás seguro de eliminar la Card #${index + 1} "${card.title}"?`)) {
                        const updated = localSectionCards.filter((_, idx) => idx !== index);
                        setLocalSectionCards(updated);
                        saveSectionCards(updated);
                        setSuccessMsg('Card eliminada exitosamente.');
                        setTimeout(() => setSuccessMsg(null), 3500);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    title="Eliminar esta Card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>

              {/* Vista Previa Fiel en Vivo de la Card */}
              <div className="group relative rounded-2xl overflow-hidden shadow-md border border-slate-200 min-h-[180px] flex flex-col justify-end p-5 bg-slate-900">
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                <div className="relative z-10 space-y-1.5">
                  <h5 className="text-sm font-black text-white tracking-tight">{card.title}</h5>
                  <p className="text-[11px] text-slate-200 font-medium line-clamp-2">{card.subtitle}</p>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 bg-white/20 text-white text-[10px] font-extrabold px-3 py-1 rounded-xl border border-white/30 backdrop-blur-md">
                      {card.cta} →
                    </span>
                  </div>
                </div>
              </div>

              {/* Campos Editables */}
              <div className="space-y-3 pt-1">
                
                {/* 1. Título */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Título de la Card:</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = localSectionCards.map((c) => (c.id === card.id ? { ...c, title: val } : c));
                      setLocalSectionCards(updated);
                      saveSectionCards(updated);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                  />
                </div>

                {/* 2. Subtítulo / Descripción */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Subtítulo / Descripción:</label>
                  <input
                    type="text"
                    value={card.subtitle}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = localSectionCards.map((c) => (c.id === card.id ? { ...c, subtitle: val } : c));
                      setLocalSectionCards(updated);
                      saveSectionCards(updated);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                  />
                </div>

                {/* 3. Texto del Botón CTA */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Texto del Botón CTA:</label>
                  <input
                    type="text"
                    value={card.cta}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = localSectionCards.map((c) => (c.id === card.id ? { ...c, cta: val } : c));
                      setLocalSectionCards(updated);
                      saveSectionCards(updated);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                  />
                </div>

                {/* 4. URL de Redirección (al hacer clic) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5 text-[#00ADB5]" />
                    <span>URL de Redirección (al hacer clic):</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. /comercios, /sorteos o https://..."
                    value={card.href}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = localSectionCards.map((c) => (c.id === card.id ? { ...c, href: val } : c));
                      setLocalSectionCards(updated);
                      saveSectionCards(updated);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                  />
                </div>

                {/* 5. Cargar Nueva Imagen (Upload) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Cargar Nueva Imagen (Ideal: 600×400 px):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChangeSectionCardImage(card.id, e)}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#00ADB5] file:text-white cursor-pointer"
                  />
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* BLOQUE 6: Banderas de Publicidad Lateral (Side Ads Sticky) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00ADB5]" />
              <span>Bloque 6: Publicidad Lateral Fija (Sticky Side Banners)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Gestioná las cards dinámicas de publicidad que se muestran en los márgenes laterales en computadoras de escritorio. Se desplazan junto al usuario mientras realiza scroll.
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-cyan-50 border border-cyan-300 text-cyan-900 px-3 py-1 rounded-xl text-[11px] font-black shadow-2xs">
              <span>📐 Tamaño Recomendado de Imagen:</span>
              <span className="text-[#0047BA]">160 × 600 px (Rascacielos / Vertical HD)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={() => {
                const newSideBanner: SideBannerItem = {
                  id: `side-${Date.now()}`,
                  title: 'NUEVA PUBLICIDAD LATERAL',
                  imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
                  href: '/planes',
                  position: 'both',
                  idealSize: '160 × 600 px (Rascacielos / Vertical HD)',
                };
                const updated = [...localSideBanners, newSideBanner];
                setLocalSideBanners(updated);
                saveSideBanners(updated);
                setSuccessMsg('Se ha agregado un nuevo banner lateral de publicidad.');
                setTimeout(() => setSuccessMsg(null), 3500);
              }}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-2xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Agregar Banner Lateral</span>
            </button>

            <button
              type="button"
              onClick={() => {
                saveSideBanners(localSideBanners);
                setSuccessMsg(`Se guardaron ${localSideBanners.length} banners laterales exitosamente.`);
                setTimeout(() => setSuccessMsg(null), 3500);
              }}
              className="inline-flex items-center gap-2 bg-[#0047BA] hover:bg-[#002878] text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Banners ({localSideBanners.length})</span>
            </button>
          </div>
        </div>

        {/* Grilla de Banners Laterales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localSideBanners.map((banner, index) => (
            <div key={banner.id || index} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wide truncate max-w-[170px]">
                  Banner #{index + 1}: {banner.title}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`¿Estás seguro de eliminar el banner "${banner.title}"?`)) {
                      const updated = localSideBanners.filter((_, idx) => idx !== index);
                      setLocalSideBanners(updated);
                      saveSideBanners(updated);
                      setSuccessMsg('Banner lateral eliminado.');
                      setTimeout(() => setSuccessMsg(null), 3500);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                  title="Eliminar este banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar</span>
                </button>
              </div>

              {/* Preview Vertical Fiel */}
              <div className="group relative rounded-xl overflow-hidden shadow-md border border-slate-300 h-48 bg-slate-950 flex flex-col justify-end p-3">
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="relative z-10 space-y-1">
                  <span className="text-[9px] font-black uppercase text-cyan-300 bg-black/60 px-2 py-0.5 rounded-md border border-cyan-400/30">
                    Posición: {banner.position === 'left' ? 'Izquierda' : banner.position === 'right' ? 'Derecha' : 'Ambos Lados'}
                  </span>
                  <h5 className="text-xs font-black text-white">{banner.title}</h5>
                </div>
              </div>

              {/* Campos Editables */}
              <div className="space-y-3 pt-1">
                
                {/* 1. Título */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Título del Anuncio:</label>
                  <input
                    type="text"
                    value={banner.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = localSideBanners.map((b) => (b.id === banner.id ? { ...b, title: val } : b));
                      setLocalSideBanners(updated);
                      saveSideBanners(updated);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                  />
                </div>

                {/* 2. Posición Lateral */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Ubicación en el Margen:</label>
                  <select
                    value={banner.position}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      const updated = localSideBanners.map((b) => (b.id === banner.id ? { ...b, position: val } : b));
                      setLocalSideBanners(updated);
                      saveSideBanners(updated);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                  >
                    <option value="left">Margen Izquierdo</option>
                    <option value="right">Margen Derecho</option>
                    <option value="both">Ambos Márgenes (Rotativo)</option>
                  </select>
                </div>

                {/* 3. URL de Redirección */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5 text-[#00ADB5]" />
                    <span>URL o Enlace WhatsApp:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. /planes, /sorteos o https://..."
                    value={banner.href}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updated = localSideBanners.map((b) => (b.id === banner.id ? { ...b, href: val } : b));
                      setLocalSideBanners(updated);
                      saveSideBanners(updated);
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800"
                  />
                </div>

                {/* 4. Cargar Imagen (Ideal: 160x600 px) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Cargar Imagen (Ideal: 160 × 600 px Vertical):
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChangeSideBannerImage(banner.id, e)}
                    className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#00ADB5] file:text-white cursor-pointer"
                  />
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
