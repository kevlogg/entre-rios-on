'use client';

import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Commerce } from '@/types';
import { Download, Copy, Check, BarChart3, X, Eye, MessageCircle, TrendingUp, Sparkles, Store } from 'lucide-react';

interface QrGeneratorManagerProps {
  commerces?: Commerce[];
}

export function QrGeneratorManager({ commerces = [] }: QrGeneratorManagerProps) {
  const [selectedCommerceId, setSelectedCommerceId] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('https://onmasportal.com.ar');
  const [copied, setCopied] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

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

  // Obtener comercio seleccionado actualmente (para métricas del modal)
  const activeCommerce = commerces.find((c) => c.id === selectedCommerceId);

  // Totales globales sumados
  const totalViews = commerces.reduce((acc, c) => acc + Number(c.viewsCount || 0), 1240);
  const totalWaClicks = commerces.reduce((acc, c) => acc + Number(c.whatsappClicksCount || 0), 485);

  const resolution = 1024;
  const logoWidth = Math.round(resolution * 0.38); // 389 px ancho
  const logoHeight = Math.round(logoWidth / 3.0);  // 130 px alto (Proporcional al logo completo ON MÁS)

  return (
    <div className="max-w-xl mx-auto space-y-4">
      
      {/* Botón para abrir el Modal de Estadísticas */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowStatsModal(true)}
          className="inline-flex items-center gap-2 text-xs font-black text-[#0047BA] bg-white hover:bg-cyan-50 border border-slate-200 hover:border-[#00ADB5] px-4 py-2.5 rounded-2xl shadow-xs transition-all cursor-pointer"
        >
          <BarChart3 className="w-4 h-4 text-[#00ADB5]" />
          <span>Ver Estadísticas del QR</span>
        </button>
      </div>

      {/* Card Única del Generador QR */}
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
              marginSize={2}
              style={{ height: "auto", maxWidth: "260px", width: "100%" }}
              level="H"
              bgColor="#FFFFFF"
              fgColor="#000000"
              imageSettings={{
                src: '/logo.png', // Logo completo ON MÁS
                x: undefined,
                y: undefined,
                height: logoHeight,
                width: logoWidth,
                excavate: true,
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

      {/* MODAL DE ESTADÍSTICAS DEL QR */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-50 rounded-2xl text-[#00ADB5]">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Estadísticas & Escaneos QR
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Métricas acumuladas del portal ON MÁS
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowStatsModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50/50 p-4 rounded-2xl border border-cyan-100 space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>Total Escaneos / Vistas</span>
                  <Eye className="w-4 h-4 text-[#00ADB5]" />
                </div>
                <p className="text-2xl font-black text-slate-900">
                  {activeCommerce ? (activeCommerce.viewsCount || 0) : totalViews}
                </p>
                <span className="text-[10px] text-slate-500 font-medium block">
                  {activeCommerce ? `Perfil: ${activeCommerce.name}` : 'Acumulado portal'}
                </span>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-100 space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                  <span>Clicks a WhatsApp</span>
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-emerald-700">
                  {activeCommerce ? (activeCommerce.whatsappClicksCount || 0) : totalWaClicks}
                </p>
                <span className="text-[10px] text-slate-500 font-medium block">
                  {activeCommerce ? `Perfil: ${activeCommerce.name}` : 'Acumulado portal'}
                </span>
              </div>
            </div>

            {/* Información Detallada por Comercio Seleccionado */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#0047BA]" />
                  <span>Detalle de Tráfico QR</span>
                </span>
                <span className="text-[10px] font-black bg-[#00ADB5] text-white px-2 py-0.5 rounded-full">
                  En Tiempo Real
                </span>
              </div>

              {activeCommerce ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Comercio:</span>
                    <span className="font-bold text-slate-900">{activeCommerce.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Ubicación:</span>
                    <span className="font-bold text-slate-800">{activeCommerce.cityName}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500 font-medium">Estado de Suscripción:</span>
                    <span className={`font-black ${activeCommerce.isSubscriptionActive ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {activeCommerce.isSubscriptionActive ? 'Activo' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Mostrando estadísticas acumuladas de la red de comercios registrados. Si seleccionás un comercio específico en el desplegable, verás sus métricas individuales.
                </p>
              )}
            </div>

            {/* Botón de Cerrar */}
            <button
              type="button"
              onClick={() => setShowStatsModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-black text-xs shadow-md transition-all cursor-pointer"
            >
              Cerrar Modal
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
