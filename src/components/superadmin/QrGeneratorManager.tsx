'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { Commerce } from '@/types';
import { QrCode, Download, Copy, Check, Sparkles, Printer, Store, Maximize2, Image as ImageIcon, Bookmark, Trash2, AlertCircle, PlusCircle, ExternalLink } from 'lucide-react';

interface QrGeneratorManagerProps {
  commerces?: Commerce[];
}

export type LogoScale = 'small' | 'medium' | 'large' | 'xlarge';

export interface SavedQr {
  id: string;
  title: string;
  targetUrl: string;
  logoOption: 'icon' | 'logo';
  logoScale: LogoScale;
  fgColor: string;
  resolution: number;
  createdAt: string;
}

const STORAGE_KEY = 'onmas_saved_qrs_v1';

export function QrGeneratorManager({ commerces = [] }: QrGeneratorManagerProps) {
  const [selectedCommerceId, setSelectedCommerceId] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('https://onmasportal.com.ar');
  const [title, setTitle] = useState<string>('QR Oficial ON MÁS');
  
  // Customization State
  const [fgColor, setFgColor] = useState<string>('#0047BA');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [logoOption, setLogoOption] = useState<'icon' | 'logo'>('icon');
  const [logoScale, setLogoScale] = useState<LogoScale>('large');
  const [resolution, setResolution] = useState<number>(1024);
  
  const [savedQrs, setSavedQrs] = useState<SavedQr[]>([]);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  // Load saved QRs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedQrs(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Error al cargar QRs guardados:', e);
    }
  }, []);

  // Save to localStorage when savedQrs state changes
  const saveToStorage = (qrs: SavedQr[]) => {
    setSavedQrs(qrs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(qrs));
    } catch (e) {
      console.warn('Error al guardar QRs:', e);
    }
  };

  // When a commerce is selected from dropdown
  const handleSelectCommerce = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const commId = e.target.value;
    setSelectedCommerceId(commId);

    if (commId === 'portal-home') {
      setTargetUrl('https://onmasportal.com.ar');
      setTitle('Portal Regional ON MÁS');
    } else if (commId === 'catalog') {
      setTargetUrl('https://onmasportal.com.ar/catalogo');
      setTitle('Catálogo de Productos');
    } else {
      const comm = commerces.find((c) => c.id === commId);
      if (comm) {
        const fullUrl = typeof window !== 'undefined'
          ? `${window.location.origin}/comercio/${comm.slug}`
          : `https://onmasportal.com.ar/comercio/${comm.slug}`;
        setTargetUrl(fullUrl);
        setTitle(`QR - ${comm.name}`);
      }
    }
  };

  // Proportional sizing based on QR resolution canvas
  const scaleMultiplier = {
    small: 0.18,
    medium: 0.24,
    large: 0.28,
    xlarge: 0.32,
  }[logoScale];

  let logoWidth: number;
  let logoHeight: number;

  if (logoOption === 'icon') {
    logoWidth = Math.round(resolution * scaleMultiplier);
    logoHeight = Math.round(resolution * scaleMultiplier);
  } else {
    logoWidth = Math.round(resolution * (scaleMultiplier * 1.35));
    logoHeight = Math.round(logoWidth / 3.2);
  }

  // Download Canvas as high resolution PNG
  const handleDownloadPNG = () => {
    setDownloading(true);
    try {
      const canvas = canvasRef.current?.querySelector('canvas') as HTMLCanvasElement | null;
      if (!canvas) {
        alert('Error localizando el lienzo del QR.');
        setDownloading(false);
        return;
      }

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      const cleanFileName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'qr-onmas';
      link.href = image;
      link.download = `${cleanFileName}-${resolution}px.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error al descargar PNG:', err);
    } finally {
      setDownloading(false);
    }
  };

  // Download SVG Vector
  const handleDownloadSVG = () => {
    try {
      const svgElement = svgRef.current?.querySelector('svg');
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      const cleanFileName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'qr-onmas';
      link.href = svgUrl;
      link.download = `${cleanFileName}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(svgUrl);
    } catch (err) {
      console.error('Error al descargar SVG:', err);
    }
  };

  // Save current QR (Max 3)
  const handleSaveQr = () => {
    if (savedQrs.length >= 3) return;

    const newQr: SavedQr = {
      id: Date.now().toString(),
      title: title.trim() || 'QR ON MÁS',
      targetUrl: targetUrl.trim(),
      logoOption,
      logoScale,
      fgColor,
      resolution,
      createdAt: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    };

    saveToStorage([newQr, ...savedQrs]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Load a saved QR into form
  const handleLoadSavedQr = (qr: SavedQr) => {
    setTitle(qr.title);
    setTargetUrl(qr.targetUrl);
    setLogoOption(qr.logoOption);
    setLogoScale(qr.logoScale);
    setFgColor(qr.fgColor);
    setResolution(qr.resolution);
  };

  // Delete a saved QR
  const handleDeleteSavedQr = (id: string) => {
    const updated = savedQrs.filter((q) => q.id !== id);
    saveToStorage(updated);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const logoSrc = logoOption === 'icon' ? '/icon.png' : '/logo.png';
  const isLimitReached = savedQrs.length >= 3;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
            <QrCode className="w-3.5 h-3.5 text-amber-300" />
            <span>Generador & Imprenta de Códigos QR</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black">
            Creador de QR Oficial ON MÁS
          </h2>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold text-slate-100 shrink-0 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-300" />
          <span>{savedQrs.length} / 3 QR Guardados</span>
        </div>
      </div>

      {/* Grid: Card 1 (Config), Card 2 (Preview), Card 3 (Saved QRs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* CARD 1: Configuración del QR */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Store className="w-4 h-4 text-[#00ADB5]" />
                <span>Configuración del QR</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-semibold">Paso 1 de 2</span>
            </div>

            {/* Dropdown de Enlaces con URLs en paréntesis */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700">
                Seleccionar Enlace Recomendado
              </label>
              <select
                value={selectedCommerceId}
                onChange={handleSelectCommerce}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white transition-all cursor-pointer"
              >
                <option value="">-- Ingresar URL Personalizada --</option>
                <option value="portal-home">🌐 Portal General (https://onmasportal.com.ar)</option>
                <option value="catalog">🛍️ Catálogo General (https://onmasportal.com.ar/catalogo)</option>
                {commerces.length > 0 && (
                  <optgroup label="Comercios Registrados en la Plataforma">
                    {commerces.map((c) => {
                      const commUrl = typeof window !== 'undefined' 
                        ? `${window.location.origin}/comercio/${c.slug}` 
                        : `https://onmasportal.com.ar/comercio/${c.slug}`;
                      return (
                        <option key={c.id} value={c.id}>
                          🏪 {c.name} ({commUrl})
                        </option>
                      );
                    })}
                  </optgroup>
                )}
              </select>
            </div>

            {/* URL Destino Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700">
                URL de Destino *
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={targetUrl}
                  onChange={(e) => {
                    setTargetUrl(e.target.value);
                    setSelectedCommerceId('');
                  }}
                  placeholder="https://onmasportal.com.ar/comercio/ejemplo"
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-3.5 pr-9 py-2.5 text-xs font-mono font-medium text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="absolute right-2.5 top-2 p-1 text-slate-400 hover:text-[#00ADB5] transition-colors cursor-pointer"
                  title="Copiar URL"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Nombre/Etiqueta */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-slate-700">
                Título del QR
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. QR Folleto Mostrador"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white transition-all"
              />
            </div>

            {/* Opciones visuales: Variante de Logo & Tamaño & Color */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              
              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-700">
                  Variante de Logo
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLogoOption('icon')}
                    className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer text-center ${
                      logoOption === 'icon'
                        ? 'bg-[#0047BA] text-white border-[#0047BA]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Emblema
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoOption('logo')}
                    className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer text-center ${
                      logoOption === 'logo'
                        ? 'bg-[#0047BA] text-white border-[#0047BA]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Completo
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-700">
                  Tamaño Logo
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['medium', 'large', 'xlarge'] as LogoScale[]).map((scale) => (
                    <button
                      key={scale}
                      type="button"
                      onClick={() => setLogoScale(scale)}
                      className={`py-2 px-1 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer text-center ${
                        logoScale === scale
                          ? 'bg-cyan-500 text-white border-cyan-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {scale === 'medium' ? 'Norm' : scale === 'large' ? 'Gr' : 'XGr'}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Color del QR & Resolución */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-700">Color QR</label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFgColor('#0047BA')}
                    className={`px-2.5 py-1.5 text-[11px] font-extrabold rounded-xl transition-all cursor-pointer flex-1 text-center ${
                      fgColor === '#0047BA' ? 'bg-[#0047BA] text-white' : 'bg-slate-100 text-[#0047BA]'
                    }`}
                  >
                    Cobalto
                  </button>
                  <button
                    type="button"
                    onClick={() => setFgColor('#000000')}
                    className={`px-2.5 py-1.5 text-[11px] font-extrabold rounded-xl transition-all cursor-pointer flex-1 text-center ${
                      fgColor === '#000000' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    Negro
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-700">Calidad PNG</label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setResolution(1024)}
                    className={`px-2.5 py-1.5 text-[11px] font-extrabold rounded-xl transition-all cursor-pointer flex-1 text-center ${
                      resolution === 1024 ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    1024px HD
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolution(2048)}
                    className={`px-2.5 py-1.5 text-[11px] font-extrabold rounded-xl transition-all cursor-pointer flex-1 text-center ${
                      resolution === 2048 ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    2048px Ultra
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CARD 2: Vista Previa & Botones Simplificados */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between text-center">
          
          <div className="space-y-3">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Vista Previa & Descarga</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">{resolution}x{resolution}px</span>
            </div>

            {/* Marco de Vista Previa */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
              <div
                ref={canvasRef}
                className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 inline-block"
              >
                <QRCodeCanvas
                  value={targetUrl || 'https://onmasportal.com.ar'}
                  size={resolution}
                  style={{ height: "auto", maxWidth: "220px", width: "100%" }}
                  level="H"
                  bgColor={bgColor}
                  fgColor={fgColor}
                  imageSettings={{
                    src: logoSrc,
                    x: undefined,
                    y: undefined,
                    height: logoHeight,
                    width: logoWidth,
                    excavate: true,
                  }}
                />
              </div>

              {/* Contenedor SVG oculto */}
              <div ref={svgRef} className="hidden">
                <QRCodeSVG
                  value={targetUrl || 'https://onmasportal.com.ar'}
                  size={resolution}
                  level="H"
                  bgColor={bgColor}
                  fgColor={fgColor}
                  imageSettings={{
                    src: logoSrc,
                    x: undefined,
                    y: undefined,
                    height: logoHeight,
                    width: logoWidth,
                    excavate: true,
                  }}
                />
              </div>

              <p className="text-[11px] font-extrabold text-slate-700 truncate max-w-xs">
                {title}
              </p>
            </div>
          </div>

          {/* Botones Simplificados debajo del QR */}
          <div className="space-y-2 pt-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={downloading}
                onClick={handleDownloadPNG}
                className="bg-gradient-to-r from-[#0047BA] to-[#00ADB5] hover:from-[#0B66FF] hover:to-[#0047BA] text-white py-3 rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Descargar PNG</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSVG}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-2xl font-extrabold text-xs border border-slate-300 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#0047BA]" />
                <span>Descargar SVG</span>
              </button>
            </div>

            {/* Botón de Guardar en la Lista (Máx 3) */}
            <button
              type="button"
              disabled={isLimitReached || savedSuccess}
              onClick={handleSaveQr}
              className={`w-full py-2.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                savedSuccess
                  ? 'bg-emerald-500 text-white border-emerald-600'
                  : isLimitReached
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>
                {savedSuccess
                  ? '¡Guardado con éxito!'
                  : isLimitReached
                  ? 'Límite de 3 QR alcanzado'
                  : `Guardar en Mis QR (${savedQrs.length}/3)`}
              </span>
            </button>

            {isLimitReached && (
              <p className="text-[10px] text-rose-600 font-bold">
                ⚠️ Máximo 3 QR creados. Elimina uno guardado para poder guardar otro nuevo.
              </p>
            )}
          </div>

        </div>

      </div>

      {/* CARD 3: Listado de Mis QR Guardados (Máximo 3) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#0047BA]" />
            <h3 className="text-sm font-black text-slate-900">
              Mis QR Creados ({savedQrs.length} de 3 máximo)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Guardá hasta 3 configuraciones de QR en tu panel
          </span>
        </div>

        {savedQrs.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 font-medium">
            No tenés códigos QR guardados todavía. Configurá uno arriba y hacé clic en <strong>"Guardar en Mis QR"</strong>.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {savedQrs.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative group hover:border-[#00ADB5] transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-black text-slate-900 truncate">
                      {item.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleDeleteSavedQr(item.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      title="Eliminar QR guardado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate font-mono">
                    {item.targetUrl}
                  </p>
                  <span className="inline-block text-[10px] text-slate-400 font-bold">
                    Creado: {item.createdAt}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadSavedQr(item)}
                    className="text-[11px] font-extrabold text-[#0047BA] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Cargar en Editor</span>
                  </button>

                  <a
                    href={item.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-slate-700 text-[11px]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
