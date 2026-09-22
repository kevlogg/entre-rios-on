'use client';

import React, { useState } from 'react';
import { City } from '@/types';
import { PROVINCES } from '@/lib/constants/locations';
import { MapPin, Plus, Palette, Image as ImageIcon, CheckCircle, AlertCircle, Sparkles, Building2, Eye, ShieldAlert } from 'lucide-react';

interface GeoCustomizerManagerProps {
  initialCities: City[];
}

interface BannerItem {
  id: string;
  title: string;
  targetPage: string; // 'Inicio' | 'Catálogo' | 'Turismo' | 'Sorteos'
  device: 'desktop' | 'mobile';
  imageUrl: string;
  isActive: boolean;
  provinceId: string;
}

export function GeoCustomizerManager({ initialCities }: GeoCustomizerManagerProps) {
  const [selectedProvinceId, setSelectedProvinceId] = useState('entre-rios');
  const [citiesList, setCitiesList] = useState<City[]>(initialCities);
  const [newCityName, setNewCityName] = useState('');
  const [newCitySlug, setNewCitySlug] = useState('');
  
  // Active desktop & mobile main banners per province
  const [desktopBannerMap, setDesktopBannerMap] = useState<Record<string, string>>({
    'entre-rios': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'santa-fe': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
  });

  const [mobileBannerMap, setMobileBannerMap] = useState<Record<string, string>>({
    'entre-rios': 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80',
    'santa-fe': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  });

  // Additional provincial Banners gallery
  const [banners, setBanners] = useState<BannerItem[]>([
    {
      id: 'b-1',
      title: 'Banner Oficial Fiesta de la Artesanía',
      targetPage: 'Inicio',
      device: 'desktop',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      isActive: true,
      provinceId: 'entre-rios'
    },
    {
      id: 'b-2',
      title: 'Promoción Termal Entre Ríos',
      targetPage: 'Turismo',
      device: 'desktop',
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      isActive: true,
      provinceId: 'entre-rios'
    }
  ]);

  // Form for new banner upload
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerPage, setNewBannerPage] = useState('Inicio');
  const [newBannerDevice, setNewBannerDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [newBannerImage, setNewBannerImage] = useState<string | null>(null);

  // Custom province colors
  const [textColor, setTextColor] = useState('#0047BA');
  const [buttonBgColor, setButtonBgColor] = useState('#00ADB5');
  const [cardAccentColor, setCardAccentColor] = useState('#00E5E8');
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const currentProv = PROVINCES.find((p) => p.id === selectedProvinceId) || PROVINCES[0];

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

  const handleMainDesktopUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, (base64) => {
      setDesktopBannerMap({ ...desktopBannerMap, [selectedProvinceId]: base64 });
      setSuccessMsg(`¡Banner Desktop de ${currentProv.name} actualizado exitosamente!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    });
  };

  const handleMainMobileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, (base64) => {
      setMobileBannerMap({ ...mobileBannerMap, [selectedProvinceId]: base64 });
      setSuccessMsg(`¡Banner Celular (Mobile) de ${currentProv.name} actualizado exitosamente!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    });
  };

  const removeMainDesktopBanner = () => {
    setDesktopBannerMap({ ...desktopBannerMap, [selectedProvinceId]: '' });
    setSuccessMsg(`Banner Desktop de ${currentProv.name} eliminado.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const removeMainMobileBanner = () => {
    setMobileBannerMap({ ...mobileBannerMap, [selectedProvinceId]: '' });
    setSuccessMsg(`Banner Celular de ${currentProv.name} eliminado.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerImage) return;

    const banner: BannerItem = {
      id: `b-${Date.now()}`,
      title: newBannerTitle,
      targetPage: newBannerPage,
      device: newBannerDevice,
      imageUrl: newBannerImage,
      isActive: true,
      provinceId: selectedProvinceId
    };

    setBanners([banner, ...banners]);
    setNewBannerTitle('');
    setNewBannerImage(null);
    setSuccessMsg(`¡Nuevo banner "${banner.title}" publicado para ${currentProv.name}!`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const toggleBannerStatus = (id: string) => {
    setBanners(banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const deleteBanner = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
  };

  const handleChangeBannerImage = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, (base64) => {
      setBanners(banners.map(b => b.id === id ? { ...b, imageUrl: base64 } : b));
      setSuccessMsg('Imagen del banner actualizada exitosamente.');
      setTimeout(() => setSuccessMsg(null), 3000);
    });
  };

  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    const slug = newCitySlug.trim().toLowerCase() || newCityName.trim().toLowerCase().replace(/\s+/g, '-');
    const newCity: City = {
      id: slug,
      name: newCityName.trim(),
      slug: slug,
      department: 'Central',
      description: `Localidad de ${currentProv.name} en la red ON MÁS.`,
      imageUrl: desktopBannerMap[selectedProvinceId] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true,
      commerceCount: 0,
      provinceId: selectedProvinceId,
      provinceName: currentProv.name,
      bannerUrl: desktopBannerMap[selectedProvinceId] || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    };

    setCitiesList([...citiesList, newCity]);
    setNewCityName('');
    setNewCitySlug('');
    setSuccessMsg(`¡Ciudad "${newCity.name}" agregada exitosamente a ${currentProv.name}!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSaveTheme = () => {
    setSuccessMsg(`¡Configuración visual y banners guardados para ${currentProv.name}!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const currentProvinceBanners = banners.filter(b => b.provinceId === selectedProvinceId);

  return (
    <div className="space-y-8">
      {/* Selector de Provincia Activa */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#00ADB5]" />
              Gestor de Provincias & Banners Publicitarios
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Provincia: <span className="text-[#0047BA]">{currentProv.name}</span>
            </h2>
          </div>

          <div className="flex gap-2">
            {PROVINCES.map((prov) => (
              <button
                key={prov.id}
                onClick={() => setSelectedProvinceId(prov.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedProvinceId === prov.id
                    ? 'bg-[#0047BA] text-white shadow-md scale-102'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {prov.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-150">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 1. Gestor de Banners concretos por provincia (Escritorio y Celular) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#00ADB5]" />
              Banners Principales de {currentProv.name}
            </h3>
            <p className="text-xs text-slate-500">
              Imágenes actuales en pantalla para dispositivos de Escritorio (Desktop) y Celulares (Mobile).
            </p>
          </div>

          {/* Banner Desktop Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5 font-black text-[#0047BA]">
                💻 Banner Escritorio (Desktop)
              </span>
              <span className="text-[10px] bg-cyan-100 text-[#0047BA] px-2.5 py-0.5 rounded-full font-extrabold">
                Medidas: 1200 x 400 px
              </span>
            </div>

            {desktopBannerMap[selectedProvinceId] ? (
              <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-300 shadow-xs">
                <img src={desktopBannerMap[selectedProvinceId]} alt="Banner Desktop" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-28 w-full rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 font-bold bg-white">
                Sin Banner Desktop Cargado
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <label className="flex-1 bg-[#00ADB5] hover:bg-[#007C8A] text-white py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                <Plus className="w-3.5 h-3.5" />
                <span>{desktopBannerMap[selectedProvinceId] ? 'Cambiar Imagen Desktop' : 'Subir Imagen Desktop'}</span>
                <input type="file" accept="image/*" onChange={handleMainDesktopUpload} className="hidden" />
              </label>

              {desktopBannerMap[selectedProvinceId] && (
                <button
                  onClick={removeMainDesktopBanner}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-700 py-2 px-3 rounded-xl text-xs font-extrabold transition-colors"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>

          {/* Banner Mobile Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5 font-black text-[#0047BA]">
                📱 Banner Celular (Mobile)
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-extrabold">
                Medidas: 600 x 300 px
              </span>
            </div>

            {mobileBannerMap[selectedProvinceId] ? (
              <div className="relative h-32 w-48 mx-auto rounded-xl overflow-hidden border border-slate-300 shadow-xs">
                <img src={mobileBannerMap[selectedProvinceId]} alt="Banner Mobile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-28 w-48 mx-auto rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 font-bold bg-white">
                Sin Banner Mobile Cargado
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <label className="flex-1 bg-[#00ADB5] hover:bg-[#007C8A] text-white py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                <Plus className="w-3.5 h-3.5" />
                <span>{mobileBannerMap[selectedProvinceId] ? 'Cambiar Imagen Mobile' : 'Subir Imagen Mobile'}</span>
                <input type="file" accept="image/*" onChange={handleMainMobileUpload} className="hidden" />
              </label>

              {mobileBannerMap[selectedProvinceId] && (
                <button
                  onClick={removeMainMobileBanner}
                  className="bg-rose-100 hover:bg-rose-200 text-rose-700 py-2 px-3 rounded-xl text-xs font-extrabold transition-colors"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>

          {/* Formulario Subir Banner Adicional */}
          <form onSubmit={handleAddBanner} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
            <span className="text-xs font-black text-[#0047BA] uppercase block">Agregar Banner Secundario / Promocional</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nombre del Banner</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Promoción Fiesta de la Artesanía"
                  value={newBannerTitle}
                  onChange={(e) => setNewBannerTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Página Destino</label>
                <select
                  value={newBannerPage}
                  onChange={(e) => setNewBannerPage(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
                >
                  <option value="Inicio">Página de Inicio</option>
                  <option value="Catálogo">Catálogo de Productos</option>
                  <option value="Turismo">Sección Turismo</option>
                  <option value="Sorteos">Sección Sorteos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Dispositivo Target</label>
                <select
                  value={newBannerDevice}
                  onChange={(e) => setNewBannerDevice(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
                >
                  <option value="desktop">Escritorio (Desktop)</option>
                  <option value="mobile">Celular (Mobile)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Seleccionar Archivo Imagen *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setNewBannerImage)}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#00ADB5] file:text-white cursor-pointer"
                />
              </div>
            </div>

            {newBannerImage && (
              <div className="relative h-28 w-full rounded-xl overflow-hidden border border-emerald-400">
                <img src={newBannerImage} alt="Preview Upload" className="w-full h-full object-cover" />
              </div>
            )}

            <button
              type="submit"
              disabled={!newBannerImage || !newBannerTitle}
              className="w-full bg-[#0047BA] hover:bg-[#002878] disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Banner en {currentProv.name}</span>
            </button>
          </form>

          {/* Galería de Banners Adicionales */}
          {currentProvinceBanners.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-500">
                Otros Banners en {currentProv.name} ({currentProvinceBanners.length})
              </h4>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {currentProvinceBanners.map((b) => (
                  <div key={b.id} className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">{b.title}</span>
                        <span className="text-[10px] bg-cyan-100 text-[#0047BA] px-2 py-0.5 rounded-full font-black">
                          {b.targetPage}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                          {b.device === 'desktop' ? 'Desktop' : 'Mobile'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-[#00ADB5] hover:underline cursor-pointer">
                          Cambiar
                          <input type="file" accept="image/*" onChange={(e) => handleChangeBannerImage(b.id, e)} className="hidden" />
                        </label>
                        <button
                          onClick={() => deleteBanner(b.id)}
                          className="text-rose-600 hover:text-rose-800 text-xs font-bold"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <div className="relative h-20 w-full rounded-xl overflow-hidden border border-slate-300">
                      <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Personalizador Visual por Provincia (Colores Característicos) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-600" />
              Personalización Visual de {currentProv.name}
            </h3>
            <p className="text-xs text-slate-500">
              Defina los tonos representativos sin modificar el logo institucional ni la marca ON MÁS.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Color de Texto & Títulos Principales</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-1"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono w-32"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Color de Botones de Acción (CTAs)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={buttonBgColor}
                  onChange={(e) => setButtonBgColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-1"
                />
                <input
                  type="text"
                  value={buttonBgColor}
                  onChange={(e) => setButtonBgColor(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono w-32"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Color Acento de Tarjetas & Badges</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={cardAccentColor}
                  onChange={(e) => setCardAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-1"
                />
                <input
                  type="text"
                  value={cardAccentColor}
                  onChange={(e) => setCardAccentColor(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono w-32"
                />
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Vista Previa de Componente</span>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                <h4 className="font-extrabold text-sm" style={{ color: textColor }}>
                  Comercio Destacado en {currentProv.name}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: cardAccentColor }}>
                    Comercio Pionero
                  </span>
                </div>
                <button
                  className="w-full py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: buttonBgColor }}
                >
                  Ver Catálogo de Productos
                </button>
              </div>
            </div>

            <button
              onClick={handleSaveTheme}
              className="w-full bg-gradient-to-r from-[#0047BA] to-[#00ADB5] hover:from-[#002878] hover:to-[#007C8A] text-white py-3 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              Guardar Cambios Visuales de {currentProv.name}
            </button>
          </div>
        </div>

      </div>

      {/* 3. Creación de Nuevas Ciudades */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0047BA]" />
              Ciudades de {currentProv.name}
            </h3>
            <p className="text-xs text-slate-500">
              Agregue nuevas ciudades y localidades para expandir la cobertura de ON MÁS.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddCity} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            required
            value={newCityName}
            onChange={(e) => setNewCityName(e.target.value)}
            placeholder="Nombre de la nueva ciudad (ej. Gualeguay)"
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800"
          />

          <input
            type="text"
            value={newCitySlug}
            onChange={(e) => setNewCitySlug(e.target.value)}
            placeholder="Slug URL (opcional, ej. gualeguay)"
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800"
          />

          <button
            type="submit"
            className="bg-[#0047BA] hover:bg-[#002878] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Ciudad a {currentProv.name}</span>
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {citiesList.map((city) => (
            <div key={city.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-xs font-bold text-slate-700">
              <span>{city.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
