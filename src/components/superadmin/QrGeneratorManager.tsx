'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Commerce } from '@/types';
import { Download, Copy, Check, BarChart3, X, QrCode, RefreshCw, Smartphone, Monitor, Clock, ExternalLink } from 'lucide-react';

interface QrGeneratorManagerProps {
  commerces?: Commerce[];
}

export function QrGeneratorManager({ commerces = [] }: QrGeneratorManagerProps) {
  const [selectedCommerceId, setSelectedCommerceId] = useState<string>('link');
  const [targetUrl, setTargetUrl] = useState<string>('https://onmasportal.com.ar/link');
  const [copied, setCopied] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Set origin on client mount if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTargetUrl(`${window.location.origin}/link`);
    }
  }, []);

  // Exact QR Physical Scan Stats State
  const [loadingStats, setLoadingStats] = useState(false);
  const [totalScans, setTotalScans] = useState<number>(0);
  const [lastScannedAt, setLastScannedAt] = useState<string | null>(null);
  const [deviceStats, setDeviceStats] = useState<{ android: number; ios: number }>({ android: 0, ios: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  // URL con endpoint de seguimiento del escaneo
  const qrTrackingValue = typeof window !== 'undefined'
    ? `${window.location.origin}/api/qr/scan?url=${encodeURIComponent(targetUrl)}`
    : `https://onmasportal.com.ar/api/qr/scan?url=${encodeURIComponent(targetUrl)}`;

  // Consultar conteo exacto de escaneos de ESTE QR al abrir el modal o cambiar URL
  const fetchQrStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch(`/api/qr/scan?action=stats&url=${encodeURIComponent(targetUrl)}`);
      if (res.ok) {
        const data = await res.json();
        setTotalScans(data.totalScans || 0);
        setLastScannedAt(data.lastScannedAt ? new Date(data.lastScannedAt).toLocaleString('es-AR') : null);
        setDeviceStats(data.devices || { android: 0, ios: 0 });
      }
    } catch (err) {
      console.warn('Error consultando estadísticas del QR:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (showStatsModal) {
      fetchQrStats();
    }
  }, [showStatsModal, targetUrl]);

  // Seleccionar enlace desde el menú desplegable
  const handleSelectCommerce = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const commId = e.target.value;
    setSelectedCommerceId(commId);

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://onmasportal.com.ar';

    if (commId === 'link') {
      setTargetUrl(`${origin}/link`);
    } else if (commId === 'portal-home') {
      setTargetUrl(origin);
    } else if (commId === 'catalog') {
      setTargetUrl(`${origin}/catalogo`);
    } else {
      const comm = commerces.find((c) => c.id === commId);
      if (comm) {
        setTargetUrl(`${origin}/comercio/${comm.slug}`);
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

  const resolution = 1024;
  const logoWidth = Math.round(resolution * 0.38); // 389 px ancho
  const logoHeight = Math.round(logoWidth / 3.0);  // 130 px alto (Proporcional al logo completo ON MÁS)

  return (
    <div className="max-w-xl mx-auto space-y-4">
      
      {/* Botón para abrir el Modal de Estadísticas del QR */}
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
            <option value="link">🔗 Página Bio / Linktree (/link)</option>
            <option value="portal-home">🌐 Portal General (https://onmasportal.com.ar)</option>
            <option value="catalog">🛍️ Catálogo General (https://onmasportal.com.ar/catalogo)</option>
            <option value="">-- Ingresar URL Personalizada --</option>
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
              value={qrTrackingValue}
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

      {/* MODAL DE ESTADÍSTICAS EXCLUSIVAS DEL QR IMPRESO */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-50 rounded-2xl text-[#00ADB5]">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Estadísticas del QR Impreso
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Conteo de escaneos del código QR actual
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchQrStats}
                  className="p-2 text-slate-400 hover:text-[#00ADB5] rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Actualizar métricas"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingStats ? 'animate-spin' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setShowStatsModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loadingStats ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 rounded-full border-3 border-[#00ADB5] border-t-transparent animate-spin" />
                <p className="text-xs font-bold text-slate-500">Contando escaneos del QR...</p>
              </div>
            ) : (
              <>
                {/* Conteo Principal de Escaneos */}
                <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] text-white p-6 rounded-3xl text-center shadow-lg space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                    Escaneos Físicos Totales de este QR
                  </span>
                  <p className="text-4xl sm:text-5xl font-black">
                    {totalScans}
                  </p>
                  <p className="text-xs text-slate-100 font-medium">
                    Veces que clientes leyeron este código QR desde celulares
                  </p>
                </div>

                {/* Desglose de Información */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <Clock className="w-4 h-4 text-[#00ADB5]" />
                      <span>Último Escaneo</span>
                    </div>
                    <p className="text-xs font-black text-slate-900">
                      {lastScannedAt || 'Sin escaneos aún'}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      <Smartphone className="w-4 h-4 text-[#0047BA]" />
                      <span>Sistemas Operativos</span>
                    </div>
                    <p className="text-xs font-extrabold text-slate-800">
                      Android: {deviceStats.android || 0} | iOS: {deviceStats.ios || 0}
                    </p>
                  </div>
                </div>

                {/* Detalle URL */}
                <div className="bg-cyan-50/60 border border-cyan-200 p-4 rounded-2xl text-xs space-y-1.5 text-left">
                  <span className="font-extrabold text-[#0047BA] uppercase tracking-wider block text-[10px]">
                    Destino Configurado:
                  </span>
                  <p className="font-mono text-slate-800 font-medium break-all">
                    {targetUrl}
                  </p>
                </div>
              </>
            )}

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
