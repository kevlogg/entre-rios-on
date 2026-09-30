'use client';

import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Commerce } from '@/types';
import { Download, Copy, Check, QrCode } from 'lucide-react';

interface QrGeneratorManagerProps {
  commerces?: Commerce[];
}

export function QrGeneratorManager({ commerces = [] }: QrGeneratorManagerProps) {
  const [selectedCommerceId, setSelectedCommerceId] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('https://onmasportal.com.ar');
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Seleccionar enlace desde el menú desplegable
  const handleSelectCommerce = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const commId = e.target.value;
    setSelectedCommerceId(commId);

    if (commId === 'portal-home') {
      setTargetUrl('https://onmasportal.com.ar');
    } else if (commId === 'catalog') {
      setTargetUrl('https://onmasportal.com.ar/catalogo');
    } else {
      const comm = commerces.find((c) => c.id === commId);
      if (comm) {
        const fullUrl = typeof window !== 'undefined'
          ? `${window.location.origin}/comercio/${comm.slug}`
          : `https://onmasportal.com.ar/comercio/${comm.slug}`;
        setTargetUrl(fullUrl);
      }
    }
  };

  // Descargar PNG HD (1024x1024 px)
  const handleDownloadPNG = () => {
    try {
      const canvas = canvasRef.current?.querySelector('canvas') as HTMLCanvasElement | null;
      if (!canvas) return;

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `qr-onmas-1024px.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error al descargar PNG:', err);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Parámetros fijos optimizados para lectura instantánea de cámara nativa e imprenta:
  // - Resolucion: 1024x1024 px
  // - Color: Negro (#000000)
  // - Quiet zone margin: 2 (Requerido por la cámara nativa de Android/iOS para aislar el QR)
  // - Emblema cuadrado de ON MÁS recortado con excavation limpia
  const resolution = 1024;
  const logoWidth = Math.round(resolution * 0.38); // 389 px ancho
  const logoHeight = Math.round(logoWidth / 3.0);  // 130 px alto (Proporcional al logo completo ON MÁS)

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* Header Banner Simplificado */}
      <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-6 text-white text-center shadow-md space-y-1">
        <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider">
          <QrCode className="w-3.5 h-3.5 text-amber-300" />
          <span>Generador Oficial para Imprenta (1024px)</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black">
          Generar Código QR
        </h2>
      </div>

      {/* Card Única Simplificada */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-center">
        
        {/* Selector de URL Destino */}
        <div className="space-y-2 text-left">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider">
            Enlace de Destino del QR
          </label>

          <select
            value={selectedCommerceId}
            onChange={handleSelectCommerce}
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white transition-all cursor-pointer"
          >
            <option value="">-- Ingresar URL Personalizada --</option>
            <option value="portal-home">🌐 Portal General (https://onmasportal.com.ar)</option>
            <option value="catalog">🛍️ Catálogo General (https://onmasportal.com.ar/catalogo)</option>
            {commerces.length > 0 && (
              <optgroup label="Comercios Registrados">
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
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-4 pr-10 py-3 text-xs font-mono font-medium text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={handleCopyUrl}
              className="absolute right-3 top-2.5 p-1.5 text-slate-400 hover:text-[#00ADB5] transition-colors cursor-pointer"
              title="Copiar URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* QR Rendered on Screen */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 inline-block space-y-3">
          <div
            ref={canvasRef}
            className="p-4 bg-white rounded-2xl shadow-md border border-slate-200 inline-block"
          >
            <QRCodeCanvas
              value={targetUrl || 'https://onmasportal.com.ar'}
              size={resolution}
              marginSize={2} // Margen blanco obligatorio para la detección de la cámara nativa
              style={{ height: "auto", maxWidth: "260px", width: "100%" }}
              level="H" // Corrección de errores del 30%
              bgColor="#FFFFFF"
              fgColor="#000000"
              imageSettings={{
                src: '/logo.png', // Logo completo de ON MÁS
                x: undefined,
                y: undefined,
                height: logoHeight,
                width: logoWidth,
                excavate: true, // Recorte de celdas por debajo del logo
              }}
            />
          </div>

          <p className="text-xs text-slate-500 font-medium truncate max-w-xs mx-auto">
            {targetUrl}
          </p>
        </div>

        {/* Botón de Descargar PNG */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDownloadPNG}
            className="w-full max-w-xs mx-auto bg-gradient-to-r from-[#0047BA] to-[#00ADB5] hover:from-[#0B66FF] hover:to-[#0047BA] text-white py-3.5 px-6 rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Descargar PNG</span>
          </button>
        </div>

      </div>

    </div>
  );
}
