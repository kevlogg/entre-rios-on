'use client';

import React, { useState } from 'react';
import { City } from '@/types';
import { PROVINCES } from '@/lib/constants/locations';
import { Image as ImageIcon, Plus, Trash2, CheckCircle, Upload, Monitor, Smartphone, RefreshCw } from 'lucide-react';

interface GeoCustomizerManagerProps {
  initialCities: City[];
}

export interface RealBannerItem {
  id: string;
  provinceId: string;
  imageUrl: string;
  device: 'desktop' | 'mobile' | 'all';
}

// Banners reales por provincia que se ven actualmente en la página de inicio (Inicio)
const INITIAL_REAL_BANNERS: RealBannerItem[] = [
  // Entre Ríos Banners Reales de Inicio
  {
    id: 'b-er-1',
    provinceId: 'entre-rios',
    imageUrl: '/images/hero-artesania.jpg',
    device: 'desktop',
  },
  {
    id: 'b-er-2',
    provinceId: 'entre-rios',
    imageUrl: '/images/prod-dorado.jpg',
    device: 'desktop',
  },
  {
    id: 'b-er-3',
    provinceId: 'entre-rios',
    imageUrl: '/images/commerce-bodega.jpg',
    device: 'mobile',
  },

  // Santa Fe Banners Reales de Inicio
  {
    id: 'b-sf-1',
    provinceId: 'santa-fe',
    imageUrl: '/images/hero-rosario.jpg',
    device: 'desktop',
  },
  {
    id: 'b-sf-2',
    provinceId: 'santa-fe',
    imageUrl: '/images/prod-dulces.jpg',
    device: 'desktop',
  },
  {
    id: 'b-sf-3',
    provinceId: 'santa-fe',
    imageUrl: '/images/city-santa-fe-capital.jpg',
    device: 'mobile',
  },
];

export function GeoCustomizerManager({ initialCities }: GeoCustomizerManagerProps) {
  const [selectedProvinceId, setSelectedProvinceId] = useState('entre-rios');
  const [banners, setBanners] = useState<RealBannerItem[]>(INITIAL_REAL_BANNERS);

  // Form para nuevo banner (solo dispositivo e imagen, sin nombre ni página destino)
  const [newBannerDevice, setNewBannerDevice] = useState<'desktop' | 'mobile' | 'all'>('desktop');
  const [newBannerImage, setNewBannerImage] = useState<string | null>(null);

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

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerImage) return;

    const banner: RealBannerItem = {
      id: `b-${Date.now()}`,
      provinceId: selectedProvinceId,
      imageUrl: newBannerImage,
      device: newBannerDevice,
    };

    setBanners([banner, ...banners]);
    setNewBannerImage(null);
    setSuccessMsg(`¡Nuevo banner cargado para la provincia de ${currentProv.name}!`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleChangeBannerImage = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(e, (base64) => {
      setBanners(banners.map((b) => (b.id === id ? { ...b, imageUrl: base64 } : b)));
      setSuccessMsg('Imagen del banner actualizada correctamente.');
      setTimeout(() => setSuccessMsg(null), 3000);
    });
  };

  const handleDeleteBanner = (id: string) => {
    setBanners(banners.filter((b) => b.id !== id));
    setSuccessMsg('Banner eliminado correctamente.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const currentProvinceBanners = banners.filter((b) => b.provinceId === selectedProvinceId);

  return (
    <div className="space-y-8">
      {/* Selector de Provincia */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#00ADB5]" />
              Gestión de Banners Publicitarios (Página de Inicio)
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Banners de Inicio: <span className="text-[#0047BA]">{currentProv.name}</span>
            </h2>
          </div>

          {/* Buttons de selección de provincia */}
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

      {/* Alerta de Éxito */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-150">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Subir Nuevo Banner para la Provincia Seleccionada */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#00ADB5]" />
              Cargar Nuevo Banner para {currentProv.name}
            </h3>
            <p className="text-xs text-slate-500">
              Suba una imagen directa para los banners que se mostrarán en la página principal de {currentProv.name}.
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
                <option value="desktop">💻 Escritorio (Desktop)</option>
                <option value="mobile">📱 Celular (Mobile)</option>
                <option value="all">🌐 Todos los dispositivos</option>
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

          {/* Preview del banner a subir */}
          {newBannerImage && (
            <div className="relative h-40 w-full rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-sm">
              <img src={newBannerImage} alt="Previsualización de Banner" className="w-full h-full object-cover" />
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
            <span>Subir Banner a {currentProv.name}</span>
          </button>
        </form>
      </div>

      {/* Galería de Banners Reales Actuales en la Provincia */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#0047BA]" />
              Banners Activos en {currentProv.name} ({currentProvinceBanners.length})
            </h3>
            <p className="text-xs text-slate-500">
              Estas son las imágenes reales que los usuarios ven al ingresar al portal de {currentProv.name}.
            </p>
          </div>
        </div>

        {currentProvinceBanners.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
            <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-500">No hay banners configurados para {currentProv.name}.</p>
            <p className="text-[11px] text-slate-400">Utilice el formulario de arriba para cargar imágenes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentProvinceBanners.map((banner, index) => (
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
                    {banner.device === 'all' && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-purple-100 text-purple-900 font-extrabold px-2.5 py-0.5 rounded-full">
                        🌐 General
                      </span>
                    )}
                  </div>
                </div>

                {/* Previsualización del Banner Real */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-300 shadow-xs bg-slate-900 group">
                  <img
                    src={banner.imageUrl}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-xs">
                      Imagen Real del Sitio
                    </span>
                  </div>
                </div>

                {/* Acciones: Cambiar imagen o Eliminar */}
                <div className="flex items-center gap-2 pt-1">
                  <label className="flex-1 bg-[#00ADB5] hover:bg-[#007C8A] text-white py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Cambiar Imagen</span>
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
