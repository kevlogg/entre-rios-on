'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Unplug, 
  Check, 
  Copy,
  Info
} from 'lucide-react';
import { 
  getMercadoPagoStatusAction, 
  disconnectMercadoPagoAction, 
  getMercadoPagoAuthUrlAction,
  createTestPaymentPreferenceAction
} from '@/server/actions/mercadopago';
import { getSuperAdminSession } from '@/lib/security/superadmin-auth';
import { createClient } from '@/lib/supabase/client';

export function MercadoPagoConnectCard() {
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [sellerId, setSellerId] = useState<string | number | null>(null);
  const [connectedAt, setConnectedAt] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [authUrl, setAuthUrl] = useState<string>('');
  const [callbackUrl, setCallbackUrl] = useState<string>('');
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [testingPayment, setTestingPayment] = useState(false);


  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await getMercadoPagoStatusAction();
      if (res.success) {
        setConnected(res.connected);
        setSellerId(res.sellerId || null);
        setConnectedAt(res.connectedAt || null);
      }

      if (typeof window !== 'undefined') {
        const origin = window.location.origin;
        const cb = `${origin}/api/superadmin/mp/callback`;
        setCallbackUrl(cb);

        const urlRes = await getMercadoPagoAuthUrlAction(cb);
        if (urlRes.success && urlRes.url) {
          setAuthUrl(urlRes.url);
        }
      }
    } catch (e) {
      console.warn('Error cargando estado de Mercado Pago:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();

    // Comprobar si el usuario logueado es el desarrollador (loggia.1996@gmail.com)
    try {
      const session = getSuperAdminSession();
      if (session?.email?.toLowerCase() === 'loggia.1996@gmail.com') {
        setIsDeveloper(true);
      }
    } catch {}

    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email?.toLowerCase() === 'loggia.1996@gmail.com') {
          setIsDeveloper(true);
        }
      }).catch(() => {});
    } catch {}

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mp_connected') === 'true') {
        setStatusMessage({
          type: 'success',
          text: '¡Cuenta oficial de Mercado Pago vinculada exitosamente! Los cobros de planes ya están activos.',
        });
        window.history.replaceState({}, '', window.location.pathname + '?tab=subscription-plans');
      } else if (params.get('test_mp') === 'approved') {
        setStatusMessage({
          type: 'success',
          text: '¡Pago de prueba de $10 ARS aprobado y validado con éxito en Mercado Pago!',
        });
        window.history.replaceState({}, '', window.location.pathname + '?tab=subscription-plans');
      } else if (params.get('mp_error')) {
        setStatusMessage({
          type: 'error',
          text: `No se pudo conectar la cuenta: ${params.get('mp_error')}`,
        });
      }
    }
  }, []);

  const handleRunTestPayment = async () => {
    setTestingPayment(true);
    try {
      const res = await createTestPaymentPreferenceAction('loggia.1996@gmail.com');
      if (res.success && res.initPoint) {
        window.location.href = res.initPoint;
      } else {
        alert(res.message || 'No se pudo generar el checkout de prueba.');
      }
    } catch (err: unknown) {
      alert((err as Error).message || 'Error al conectar con Mercado Pago.');
    } finally {
      setTestingPayment(false);
    }
  };


  const handleDisconnect = async () => {
    if (!confirm('¿Estás seguro de que deseas desconectar la cuenta de Mercado Pago? El cobro automático de suscripciones quedará pausado.')) {
      return;
    }

    setDisconnecting(true);
    try {
      const res = await disconnectMercadoPagoAction();
      if (res.success) {
        setConnected(false);
        setSellerId(null);
        setConnectedAt(null);
        setStatusMessage({ type: 'info', text: 'Cuenta de Mercado Pago desvinculada.' });
      } else {
        alert(res.message);
      }
    } catch (e: unknown) {
      alert((e as Error).message || 'Error al desconectar');
    } finally {
      setDisconnecting(false);
    }
  };

  const copyCallbackToClipboard = () => {
    if (callbackUrl) {
      navigator.clipboard.writeText(callbackUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#002878] to-[#0047BA] text-white rounded-3xl p-6 sm:p-8 border-2 border-cyan-400/40 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#009EE3]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#0047BA]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-[#009EE3]/30 border border-[#009EE3]/50 text-[#00E5E8] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            <CreditCard className="w-3.5 h-3.5 text-[#00E5E8]" />
            <span>Pasarela Oficial de Cobros • Mercado Pago</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-1">
            <span>Cobros Automáticos de Suscripciones</span>
          </h3>
          <p className="text-xs text-slate-200 font-medium">
            Sincronizá la cuenta de Mercado Pago oficial para cobrar las cuotas mensuales de Comercios y Turismo de forma automática.
          </p>
        </div>

        {/* Status Badge */}
        <div className="shrink-0 flex items-center gap-2">
          {loading ? (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Verificando...</span>
            </div>
          ) : connected ? (
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/25 border border-emerald-400/60 text-emerald-300 px-3.5 py-1.5 rounded-2xl text-xs font-black shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CUENTA CONECTADA Y ACTIVA</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-amber-500/25 border border-amber-400/60 text-amber-300 px-3.5 py-1.5 rounded-2xl text-xs font-black shadow-md">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>SIN VINCULAR</span>
            </div>
          )}
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 animate-fadeIn ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/25 border-emerald-400/50 text-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-rose-500/25 border-rose-400/50 text-rose-200'
              : 'bg-blue-500/25 border-blue-400/50 text-blue-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {connected ? (
            <div className="bg-white/10 border border-white/15 rounded-2xl p-5 space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[10px] uppercase font-black text-slate-300 tracking-wider block">
                    Cuenta Oficial Conectada (ID de Vendedor)
                  </span>
                  <span className="text-lg font-black text-white font-mono">
                    {sellerId ? String(sellerId) : 'Activa'}
                  </span>
                </div>

                {connectedAt && (
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-black text-slate-300 tracking-wider block">
                      Fecha de Sincronización
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {new Date(connectedAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Informative block */}
              <div className="bg-black/25 border border-white/10 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-300 font-black text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Cobros Online Habilitados</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  Los comercios y prestadores turísticos pueden contratar y renovar sus planes (Bronce, Plata, Oro) abonando directamente con tarjeta de crédito, débito o dinero en cuenta. La acreditación es inmediata en esta cuenta.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={authUrl || '#'}
                  className="inline-flex items-center gap-2 bg-[#00ADB5] hover:bg-[#00969d] text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reconectar / Cambiar Cuenta</span>
                </a>

                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="inline-flex items-center gap-2 bg-rose-500/25 hover:bg-rose-500/40 text-rose-200 border border-rose-400/40 px-4 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Unplug className="w-3.5 h-3.5" />
                  <span>{disconnecting ? 'Desconectando...' : 'Desconectar Cuenta'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 border border-white/15 rounded-2xl p-5 space-y-4 backdrop-blur-md">
              <div className="space-y-2">
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Sincronizá la cuenta oficial para habilitar pagos</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  Al hacer clic en el botón a continuación, se abrirá el portal oficial de <strong>Mercado Pago</strong> para autorizar la vinculación en un solo paso. Todos los cobros de suscripciones mensuales ingresarán directamente a esta cuenta.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={authUrl || '#'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#00ADB5] to-[#009EE3] hover:from-[#00969d] hover:to-[#0082ba] text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 cursor-pointer border border-cyan-300/40"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Conectar Cuenta Oficial de Mercado Pago</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Integration details */}
        <div className="bg-black/35 border border-white/15 rounded-2xl p-5 space-y-3.5 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>URL de Retorno Autorizada</span>
            </span>
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
              Enlace de redirección configurado para el retorno seguro post-autorización:
            </p>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/15 text-[10px] font-mono break-all text-cyan-200 flex items-center justify-between gap-2">
              <span className="truncate">{callbackUrl || 'Cargando...'}</span>
              <button
                type="button"
                onClick={copyCallbackToClipboard}
                className="shrink-0 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                title="Copiar URL"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-white/15 text-[11px] text-slate-300 space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Pasarela:</span>
              <span className="font-bold text-white">Mercado Pago Checkout</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Acreditación:</span>
              <span className="font-bold text-emerald-400">Directa en cuenta oficial</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Activación de Plan:</span>
              <span className="font-bold text-[#00E5E8]">Inmediata al abonar</span>
            </div>
          </div>
        </div>
      </div>


      {/* SECCIÓN EXCLUSIVA DE TEST PARA loggia.1996@gmail.com */}

      {isDeveloper && (
        <div className="relative z-10 pt-5 border-t border-white/15">
          <div className="bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-blue-500/15 border-2 border-amber-400/50 rounded-2xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-amber-400/25 border border-amber-400/50 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <span>🧪 Modo Pruebas Desarrollador (Exclusivo loggia.1996@gmail.com)</span>
                </div>
                <h4 className="text-base font-black text-white">Prueba Real de Cobro y Split de Comisión ($10 ARS)</h4>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  Genera una orden real de $10 ARS para validar que el cobro entra a la cuenta conectada del cliente y los $0.30 (3%) se acreditan automáticamente en tu billetera de Mercado Pago.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunTestPayment}
                disabled={testingPayment || !connected}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {testingPayment ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Iniciando Checkout...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Ejecutar Pago de Prueba ($10 ARS)</span>
                  </>
                )}
              </button>
            </div>
            {!connected && (
              <p className="text-[11px] text-amber-300/80 font-semibold">
                ⚠️ Para realizar el pago de prueba, primero debe estar conectada la cuenta oficial de Mercado Pago arriba.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

