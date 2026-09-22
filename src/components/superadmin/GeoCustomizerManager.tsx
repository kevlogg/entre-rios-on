'use client';

import React, { useState } from 'react';
import { City } from '@/types';
import { PROVINCES } from '@/lib/constants/locations';
import { MapPin, Plus, Palette, Image as ImageIcon, CheckCircle, AlertCircle, Sparkles, Building2, Eye, ShieldAlert } from 'lucide-react';

interface GeoCustomizerManagerProps {
  initialCities: City[];
}

export function GeoCustomizerManager({ initialCities }: GeoCustomizerManagerProps) {
  const [selectedProvinceId, setSelectedProvinceId] = useState('entre-rios');
  const [citiesList, setCitiesList] = useState<City[]>(initialCities);
  const [newCityName, setNewCityName] = useState('');
  const [newCitySlug, setNewCitySlug] = useState('');
  const [bannerDesktop, setBannerDesktop] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80');
  const [bannerMobile, setBannerMobile] = useState('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80');
  
  // Custom province colors
  const [textColor, setTextColor] = useState('#0047BA');
  const [buttonBgColor, setButtonBgColor] = useState('#00ADB5');
  const [cardAccentColor, setCardAccentColor] = useState('#00E5E8');
  
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const currentProv = PROVINCES.find((p) => p.id === selectedProvinceId) || PROVINCES[0];

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
      imageUrl: bannerDesktop,
      isFeatured: true,
      commerceCount: 0,
      provinceId: selectedProvinceId,
      provinceName: currentProv.name,
      bannerUrl: bannerDesktop
    };

    setCitiesList([...citiesList, newCity]);
    setNewCityName('');
    setNewCitySlug('');
    setSuccessMsg(`¡Ciudad "${newCity.name}" agregada exitosamente a ${currentProv.name}!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSaveTheme = () => {
    setSuccessMsg(`¡Paleta de colores y banners guardados para la provincia de ${currentProv.name}!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Selector de Provincia Activa */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#00ADB5]" />
              Configuración Geográfica & Personalización
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Provincia Seleccionada: <span className="text-[#0047BA]">{currentProv.name}</span>
            </h2>
          </div>

          <div className="flex gap-2">
            {PROVINCES.map((prov) => (
              <button
                key={prov.id}
                onClick={() => setSelectedProvinceId(prov.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedProvinceId === prov.id
                    ? 'bg-[#0047BA] text-white shadow-md'
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Banners por Provincia con Indicación de Medidas */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#00ADB5]" />
              Banners Oficiales de {currentProv.name}
            </h3>
            <p className="text-xs text-slate-500">
              Configure las imágenes del cabezal principal manteniendo la resolución recomendada.
            </p>
          </div>

          {/* Banner Desktop Guidelines */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Banner Escritorio (Desktop)</span>
              <span className="text-[10px] bg-cyan-100 text-[#0047BA] px-2 py-0.5 rounded-full font-extrabold">
                Medidas: 1200 x 400 px (3:1)
              </span>
            </div>
            <input
              type="text"
              value={bannerDesktop}
              onChange={(e) => setBannerDesktop(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
              placeholder="URL de la imagen Desktop"
            />
            <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-300">
              <img src={bannerDesktop} alt="Preview Desktop" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Banner Mobile Guidelines */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Banner Celulares (Mobile)</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-extrabold">
                Medidas: 600 x 300 px (2:1)
              </span>
            </div>
            <input
              type="text"
              value={bannerMobile}
              onChange={(e) => setBannerMobile(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
              placeholder="URL de la imagen Mobile"
            />
            <div className="relative h-28 w-44 mx-auto rounded-xl overflow-hidden border border-slate-300">
              <img src={bannerMobile} alt="Preview Mobile" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>Formato recomendado: WEBP o PNG comprimido. Tamaño máximo: 500 KB por imagen.</span>
          </div>
        </div>

        {/* 2. Personalizador Visual por Provincia (Colores Característicos) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
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
