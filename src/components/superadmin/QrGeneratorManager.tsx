'use client';

import React, { useState, useRef } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { Commerce } from '@/types';
import { QrCode, Download, Copy, Check, Sparkles, Printer, Store, ExternalLink, RefreshCw } from 'lucide-react';

interface QrGeneratorManagerProps {
  commerces?: Commerce[];
}

export function QrGeneratorManager({ commerces = [] }: QrGeneratorManagerProps) {
  const [selectedCommerceId, setSelectedCommerceId] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('https://onmasportal.com.ar');
  const [title, setTitle] = useState<string>('QR Oficial ON MÁS - Imprenta');
  
  // Customization State
  const [fgColor, setFgColor] = useState<string>('#0047BA');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [logoOption, setLogoOption] = useState<'icon' | 'logo'>('icon');
  const [resolution, setResolution] = useState<number>(1024); // Default 1024px for high quality print
  
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  // When a commerce is selected from dropdown
  const handleSelectCommerce = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const commId = e.target.value;
    setSelectedCommerceId(commId);

    if (commId === 'portal-home') {
      setTargetUrl('https://onmasportal.com.ar');
      setTitle('Portal Regional ON MÁS - General');
    } else if (commId === 'catalog') {
      setTargetUrl('https://onmasportal.com.ar/catalogo');
      setTitle('Catálogo General de Productos ON MÁS');
    } else {
      const comm = commerces.find((c) => c.id === commId);
      if (comm) {
        const fullUrl = typeof window !== 'undefined'
          ? `${window.location.origin}/comercio/${comm.slug}`
          : `https://onmasportal.com.ar/comercio/${comm.slug}`;
        setTargetUrl(fullUrl);
        setTitle(`QR Oficial Imprenta - ${comm.name}`);
      }
    }
  };

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
      alert('Ocurrió un error al procesar el archivo PNG.');
    } finally {
      setDownloading(false);
    }
  };

  // Download SVG Vector
  const handleDownloadSVG = () => {
    try {
      const svgElement = svgRef.current?.querySelector('svg');
      if (!svgElement) {
        alert('Error localizando el vector del QR.');
        return;
      }

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      const cleanFileName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'qr-onmas';
      link.href = svgUrl;
      link.download = `${cleanFileName}-vectorial.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(svgUrl);
    } catch (err) {
      console.error('Error al descargar SVG:', err);
      alert('Ocurrió un error al descargar el archivo SVG.');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const logoSrc = logoOption === 'icon' ? '/icon.png' : '/logo.png';

  return (
    <div className="space-y-6">
      
      {/* Header card */}
      <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            <QrCode className="w-3.5 h-3.5 text-amber-300" />
            <span>Herramienta Oficial • Alta Resolución para Imprenta</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black">
            Generador de QR con Logo ON MÁS
          </h2>
          <p className="text-xs sm:text-sm text-slate-100 font-medium max-w-2xl leading-relaxed">
            Creá códigos QR dinámicos en alta resolución (PNG hasta 2048px y SVG vectorial) con el logo de ON MÁS en el centro, listos para imprimir en folletos, afiches, tarjetas y carteles de mostrador.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-xs font-bold text-slate-100 shrink-0">
          <Printer className="w-5 h-5 text-amber-300" />
          <span>Formato 100% Imprenta HD</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-[#00ADB5]" />
              <span>1. Configurar Destino del QR</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Elegí un comercio registrado o ingresá una URL personalizada.
            </p>
          </div>

          {/* Quick Selection Dropdown */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-700">
              Seleccionar Comercio Registrado
            </label>
            <select
              value={selectedCommerceId}
              onChange={handleSelectCommerce}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white transition-all cursor-pointer"
            >
              <option value="">-- Ingreso manual de URL --</option>
              <option value="portal-home">🌐 Portal General ON MÁS (onmasportal.com.ar)</option>
              <option value="catalog">🛍️ Catálogo Completo de Productos</option>
              <optgroup label="Comercios Registrados en Plataforma">
                {commerces.map((c) => (
                  <option key={c.id} value={c.id}>
                    🏪 {c.name} ({c.cityName || 'Ciudad'})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Target URL Input */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-700">
              URL de Destino (Enlace donde redirigirá el QR al escanear) *
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
                placeholder="https://onmasportal.com.ar/comercio/mi-comercio"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-4 pr-10 py-3 text-xs font-mono font-medium text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={handleCopyUrl}
                className="absolute right-3 top-2.5 p-1.5 bg-slate-200 hover:bg-[#00ADB5] hover:text-white text-slate-600 rounded-xl transition-colors cursor-pointer"
                title="Copiar URL"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Title for printable PDF/Brochure */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-700">
              Título / Etiqueta del Archivo
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. QR Folleto Mostrador - Ferretería Centro"
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white transition-all"
            />
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0047BA]" />
              <span>2. Personalizar Diseño & Calidad para Imprenta</span>
            </h3>

            {/* Colors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700">
                  Color de Módulos (QR)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer shrink-0"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFgColor('#0047BA')}
                      className="px-2.5 py-1 text-[11px] font-black bg-[#0047BA] text-white rounded-lg cursor-pointer"
                    >
                      Cobalto
                    </button>
                    <button
                      type="button"
                      onClick={() => setFgColor('#00ADB5')}
                      className="px-2.5 py-1 text-[11px] font-black bg-[#00ADB5] text-white rounded-lg cursor-pointer"
                    >
                      Turquesa
                    </button>
                    <button
                      type="button"
                      onClick={() => setFgColor('#000000')}
                      className="px-2.5 py-1 text-[11px] font-black bg-slate-900 text-white rounded-lg cursor-pointer"
                    >
                      Negro
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-700">
                  Variante de Logo Central
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLogoOption('icon')}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      logoOption === 'icon'
                        ? 'bg-[#0047BA] text-white border-[#0047BA]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Emblema (+)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoOption('logo')}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      logoOption === 'logo'
                        ? 'bg-[#0047BA] text-white border-[#0047BA]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Logo Completo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Resolution Selector for Print */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-700">
                Resolución de Exportación PNG (Definición para Imprenta)
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setResolution(500)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    resolution === 500
                      ? 'bg-cyan-50 border-[#00ADB5] text-[#0047BA] font-black ring-2 ring-[#00ADB5]/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-xs font-extrabold">500 x 500 px</span>
                  <span className="text-[10px] text-slate-500">Digital / Redes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResolution(1024)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    resolution === 1024
                      ? 'bg-cyan-50 border-[#00ADB5] text-[#0047BA] font-black ring-2 ring-[#00ADB5]/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-xs font-extrabold">1024 x 1024 px</span>
                  <span className="text-[10px] text-slate-500 font-bold text-[#00ADB5]">Imprenta HD ★</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResolution(2048)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    resolution === 2048
                      ? 'bg-cyan-50 border-[#00ADB5] text-[#0047BA] font-black ring-2 ring-[#00ADB5]/30'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="block text-xs font-extrabold">2048 x 2048 px</span>
                  <span className="text-[10px] text-slate-500">Afiches / Banners</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Live QR Preview & Download Action Buttons */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 flex flex-col items-center justify-between text-center sticky top-24">
          
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#00ADB5] bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 inline-block">
              Vista Previa en Tiempo Real
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">
              {title}
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate max-w-xs mx-auto">
              {targetUrl}
            </p>
          </div>

          {/* Printable Frame Mockup Container */}
          <div className="w-full bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-3xl border-2 border-dashed border-slate-300 shadow-inner flex flex-col items-center justify-center space-y-4">
            
            {/* The Actual QR Code Rendered on Canvas for Export */}
            <div
              ref={canvasRef}
              className="p-4 bg-white rounded-2xl shadow-xl border border-slate-200 flex items-center justify-center transition-transform hover:scale-105"
            >
              <QRCodeCanvas
                value={targetUrl || 'https://onmasportal.com.ar'}
                size={resolution}
                style={{ height: "auto", maxWidth: "260px", width: "100%" }}
                level="H" // High error correction level (30%) so logo centers without error
                bgColor={bgColor}
                fgColor={fgColor}
                imageSettings={{
                  src: logoSrc,
                  x: undefined,
                  y: undefined,
                  height: logoOption === 'icon' ? 52 : 36,
                  width: logoOption === 'icon' ? 52 : 110,
                  excavate: true, // Clears QR matrix behind the logo for crystal clear visibility
                }}
              />
            </div>

            {/* Hidden SVG render container for Vector download */}
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
                  height: logoOption === 'icon' ? 52 : 36,
                  width: logoOption === 'icon' ? 52 : 110,
                  excavate: true,
                }}
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Logo de ON MÁS incrustado con nivel de corrección H (30%)</span>
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="w-full space-y-3">
            <button
              type="button"
              disabled={downloading}
              onClick={handleDownloadPNG}
              className="w-full bg-gradient-to-r from-[#0047BA] via-[#00ADB5] to-[#002878] hover:from-[#0B66FF] hover:to-[#0047BA] text-white py-4 rounded-2xl font-black text-xs shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Descargar QR PNG para Imprenta ({resolution}x{resolution}px)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSVG}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-2xl font-extrabold text-xs border border-slate-300 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#0047BA]" />
              <span>Descargar Vector SVG (Para Diseñadores e Imprenta)</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            💡 Sugerencia de imprenta: El archivo PNG ({resolution}px) es óptimo para imprimir en tamaños desde 3x3 cm hasta afiches de 1 metro.
          </div>

        </div>

      </div>

    </div>
  );
}
