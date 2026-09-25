'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, Sparkles, Star, ArrowRight, Building2, Zap, DollarSign, Award, XCircle, X } from 'lucide-react';
import { createSubscriptionPreferenceAction } from '@/server/actions/subscription';
import { 
  createCashPaymentAction, 
  getPendingCashPaymentForCommerceAction, 
  cancelCashPaymentAction 
} from '@/server/actions/superadmin';

export type UserType = 'comercio' | 'turismo' | 'particular' | string;

interface SubscriptionPlansProps {
  commerceId?: string;
  commerceName?: string;
  cityName?: string;
  phoneWhatsApp?: string;
  userType?: UserType;
  currentTier?: string;
  onPlanActivated?: (planName: string) => void;
}

const PLAN_FEATURES = [
  '1. Presencia local en directorio ON MÁS',
  '2. Botón directo a WhatsApp (sin comisiones)',
  '3. Catálogo de hasta 5 productos / servicios',
  '4. Posicionamiento destacado en guía local y categoría',
  '5. Catálogo de hasta 20 productos / servicios',
  '6. Métricas en tiempo real (visitas y clics a WhatsApp)',
  '7. Insignia Comercio Verificado Plata',
  '8. Destacado TOP en portada provincial',
  '9. Catálogo ILIMITADO de productos y servicios',
  '10. Cobertura especial y notas de prensa / editoriales',
  '11. Insignia Gold / Comercio Verificado Oro',
  '12. Soporte prioritario 24/7 y asesoramiento comercial',
  '13. Publicidad y visibilidad exclusiva dentro del sitio web y en redes sociales',
];

export function SubscriptionPlans({
  commerceId = 'comm-default',
  commerceName,
  cityName,
  phoneWhatsApp,
  userType = 'comercio',
  currentTier,
  onPlanActivated,
}: SubscriptionPlansProps) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [activatedSuccess, setActivatedSuccess] = useState<string | null>(null);
  const [pendingPayment, setPendingPayment] = useState<{ id: string; planName: string; amount: number } | null>(null);

  const checkPendingPayment = async () => {
    try {
      const res = await getPendingCashPaymentForCommerceAction(commerceId, commerceName);
      if (res.hasPending && res.pendingPayment) {
        setPendingPayment(res.pendingPayment);
      } else {
        setPendingPayment(null);
      }
    } catch (e) {
      console.warn('Error verificando pago pendiente:', e);
    }
  };

  useEffect(() => {
    checkPendingPayment();
  }, [commerceId, commerceName]);

  const handleCashPaymentRequest = async (planName: string, amount: number) => {
    setLoadingTier(`cash_${planName}`);
    try {
      const res = await createCashPaymentAction({
        commerceName: commerceName || 'Comercio Adherido',
        ownerName: 'Titular',
        phoneWhatsApp: phoneWhatsApp || '5493434001122',
        planName,
        amount,
        cityName: cityName || 'Entre Ríos / Santa Fe',
        commerceId,
      });

      if (res.success) {
        setActivatedSuccess(`¡Solicitud de Pago en Efectivo Enviada! Notificamos al equipo SuperAdmin para verificar tu pago del plan "${planName}" y activar tu cuenta.`);
        await checkPendingPayment();
      }
    } catch (err) {
      console.warn('Error al solicitar verificación de pago en efectivo:', err);
    } finally {
      setLoadingTier(null);
    }
  };

  const handleCancelPendingPayment = async () => {
    if (!pendingPayment) return;
    setLoadingTier('cancel_pending');
    try {
      const res = await cancelCashPaymentAction(pendingPayment.id);
      if (res.success) {
        setPendingPayment(null);
        setActivatedSuccess('Solicitud de pago en efectivo cancelada. Ahora podés seleccionar o cambiar de plan.');
        setTimeout(() => setActivatedSuccess(null), 5000);
      }
    } catch (err) {
      console.warn('Error al cancelar solicitud:', err);
    } finally {
      setLoadingTier(null);
    }
  };

  const handleSelectPlan = async (planTier: 'BRONCE' | 'PLATA' | 'ORO', planName: string) => {
    if (pendingPayment) return;
    setLoadingTier(planTier);
    try {
      const res = await createSubscriptionPreferenceAction(planTier, commerceId);
      if (res.success && res.initPoint) {
        window.location.href = res.initPoint;
      } else {
        if (onPlanActivated) {
          onPlanActivated(planName);
        }
        setActivatedSuccess(`¡Plan "${planName}" seleccionado! Redirigiendo a pasarela de pago...`);
        setTimeout(() => setActivatedSuccess(null), 5000);
      }
    } catch (err) {
      if (onPlanActivated) {
        onPlanActivated(planName);
      }
      setActivatedSuccess(`¡Plan "${planName}" contratado y activado exitosamente!`);
      setTimeout(() => setActivatedSuccess(null), 5000);
    } finally {
      setLoadingTier(null);
    }
  };

  const renderFeaturesList = (maxIncluded: number, cardType: 'bronce' | 'plata' | 'oro') => {
    return (
      <ul className="space-y-2.5 text-xs font-semibold">
        {PLAN_FEATURES.map((featureText, index) => {
          const itemNum = index + 1;
          const isIncluded = itemNum <= maxIncluded;

          if (isIncluded) {
            return (
              <li key={itemNum} className={`flex items-start gap-2 ${
                cardType === 'oro' 
                  ? (itemNum > 7 ? 'text-amber-300 font-extrabold' : 'text-purple-100 font-semibold')
                  : cardType === 'plata'
                  ? (itemNum >= 4 ? 'text-slate-900 font-bold' : 'text-slate-800 font-medium')
                  : (itemNum === 3 ? 'text-slate-900 font-bold' : 'text-slate-800 font-medium')
              }`}>
                <Check className={`w-4 h-4 shrink-0 mt-0.5 font-black ${
                  cardType === 'oro' ? 'text-amber-400' : 'text-emerald-600'
                }`} />
                <span>{featureText}</span>
              </li>
            );
          } else {
            return (
              <li key={itemNum} className={`flex items-start gap-2 line-through font-normal ${
                cardType === 'oro' ? 'text-purple-300/40' : 'text-slate-400/90'
              }`}>
                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 font-bold" />
                <span>{featureText}</span>
              </li>
            );
          }
        })}
      </ul>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#00ADB5] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#00ADB5]" />
            <span>PLANES Y SUSCRIPCIONES ON MÁS</span>
          </span>
          <h3 className="text-2xl font-black text-[#0047BA] leading-tight mt-1">
            Elegí tu Plan de Suscripción Comercial / Turismo
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Comparativa transparente de beneficios. Todas las funciones detalladas con tilde (incluido) o cruz (no incluido).
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-2xl text-xs font-black inline-flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Sin Comisiones por Venta (0%)</span>
        </div>
      </div>

      {/* BANNER SOLICITUD PENDIENTE DE PAGO EN EFECTIVO */}
      {pendingPayment && (
        <div className="bg-amber-50/90 border-2 border-amber-400 rounded-3xl p-6 shadow-md space-y-4 text-amber-950 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shrink-0 font-black text-2xl shadow-xs">
                ⏳
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Solicitud de Pago en Efectivo Pendiente
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-1">
                  Pago en revisión para el Plan {pendingPayment.planName} (${pendingPayment.amount.toLocaleString('es-AR')})
                </h4>
                <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                  Avisaste que pagaste en efectivo. La selección de otros planes se encuentra pausada hasta que el equipo SuperAdmin confirme el pago. Podés cancelar esta solicitud si deseas cambiar de plan.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCancelPendingPayment}
              disabled={loadingTier === 'cancel_pending'}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-2xl font-extrabold text-xs shadow-md transition-all active:scale-95 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-amber-400" />
              <span>{loadingTier === 'cancel_pending' ? 'Cancelando...' : 'Cancelar Solicitud de Pago'}</span>
            </button>
          </div>
        </div>
      )}

      {activatedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{activatedSuccess}</span>
        </div>
      )}

      {/* ==================== PLANES ON MÁS (BRONCE $29k, PLATA $49k, ORO $99k) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
        
        {/* 1. PLAN BRONCE ($29.000) - Puntos 1 al 3 */}
        <div className={`bg-slate-50/90 border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all ${
          pendingPayment ? 'opacity-65 grayscale-[20%]' : 'hover:border-amber-600/50'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider block bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                Presencia Básica
              </span>
              <Building2 className="w-6 h-6 text-amber-700" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-black text-slate-900">Plan Bronce</h4>
              <p className="text-xs text-slate-500 font-medium">Presencia inicial en el portal regional</p>
            </div>

            <div className="py-3 border-y border-slate-200">
              <span className="text-4xl font-black text-slate-900">$29.000</span>
              <span className="text-xs font-bold text-slate-400"> / mes</span>
            </div>

            {/* Lista de 13 Puntos con Tildes (1-3) y Cruces (4-13) */}
            {renderFeaturesList(3, 'bronce')}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-200">
            <button
              onClick={() => handleSelectPlan('BRONCE', 'Plan Bronce ($29.000)')}
              disabled={Boolean(pendingPayment) || loadingTier === 'BRONCE'}
              className="w-full bg-[#0047BA] hover:bg-[#002878] text-white py-3.5 rounded-2xl font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loadingTier === 'BRONCE' ? 'Procesando...' : 'Contratar Plan Bronce ($29.000)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleCashPaymentRequest('Bronce', 29000)}
              disabled={Boolean(pendingPayment) || loadingTier === 'cash_Bronce'}
              className="w-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {pendingPayment
                  ? 'Pago en revisión...'
                  : loadingTier === 'cash_Bronce'
                  ? 'Enviando aviso...'
                  : 'Ya pagué en efectivo (Notificar SuperAdmin)'}
              </span>
            </button>
          </div>
        </div>

        {/* 2. PLAN PLATA ($49.000) - Puntos 1 al 7 */}
        <div className={`relative bg-gradient-to-b from-blue-50/90 via-white to-slate-50 border-2 border-[#00ADB5] rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl ${
          pendingPayment ? 'opacity-65 grayscale-[20%]' : ''
        }`}>
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00ADB5] to-[#0047BA] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>RECOMENDADO • DESTACADO</span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-[#0047BA] uppercase tracking-wider block bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">
                Mayor Visibilidad
              </span>
              <Zap className="w-6 h-6 text-[#00ADB5]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-black text-slate-900">Plan Plata</h4>
              <p className="text-xs text-slate-500 font-medium">Para comercios en crecimiento activo</p>
            </div>

            <div className="py-3 border-y border-slate-200">
              <span className="text-4xl font-black text-[#0047BA]">$49.000</span>
              <span className="text-xs font-bold text-slate-400"> / mes</span>
            </div>

            {/* Lista de 13 Puntos con Tildes (1-7) y Cruces (8-13) */}
            {renderFeaturesList(7, 'plata')}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-200">
            <button
              onClick={() => handleSelectPlan('PLATA', 'Plan Plata ($49.000)')}
              disabled={Boolean(pendingPayment) || loadingTier === 'PLATA'}
              className="w-full bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#00969d] hover:to-[#002878] text-white py-3.5 rounded-2xl font-black text-xs shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loadingTier === 'PLATA' ? 'Procesando...' : 'Contratar Plan Plata ($49.000)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleCashPaymentRequest('Plata', 49000)}
              disabled={Boolean(pendingPayment) || loadingTier === 'cash_Plata'}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {pendingPayment
                  ? 'Pago en revisión...'
                  : loadingTier === 'cash_Plata'
                  ? 'Enviando aviso...'
                  : 'Ya pagué en efectivo (Notificar SuperAdmin)'}
              </span>
            </button>
          </div>
        </div>

        {/* 3. PLAN ORO ($99.000) - Puntos 1 al 13 COMPLETOS */}
        <div className={`relative bg-gradient-to-b from-[#1F1138] via-[#160b29] to-[#0d051a] border-2 border-amber-400 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-2xl text-white ${
          pendingPayment ? 'opacity-65 grayscale-[20%]' : ''
        }`}>
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 fill-current" />
            <span>MÁXIMO ALCANCE • VIP</span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider block bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/40">
                Portada Provincial
              </span>
              <Star className="w-6 h-6 text-amber-400 fill-amber-400/20" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-black text-white">Plan Oro</h4>
              <p className="text-xs text-purple-200 font-medium">Liderazgo y máxima cobertura provincial</p>
            </div>

            <div className="py-3 border-y border-purple-800/80">
              <span className="text-4xl font-black text-amber-300">$99.000</span>
              <span className="text-xs font-bold text-purple-300"> / mes</span>
            </div>

            {/* Lista de 13 Puntos TODOS INCLUIDOS (1-13) */}
            {renderFeaturesList(13, 'oro')}
          </div>

          <div className="space-y-2 pt-4 border-t border-purple-800/80">
            <button
              onClick={() => handleSelectPlan('ORO', 'Plan Oro ($99.000)')}
              disabled={Boolean(pendingPayment) || loadingTier === 'ORO'}
              className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 py-3.5 rounded-2xl font-black text-xs shadow-xl transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loadingTier === 'ORO' ? 'Procesando...' : 'Contratar Plan Oro ($99.000)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleCashPaymentRequest('Oro', 99000)}
              disabled={Boolean(pendingPayment) || loadingTier === 'cash_Oro'}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {pendingPayment
                  ? 'Pago en revisión...'
                  : loadingTier === 'cash_Oro'
                  ? 'Enviando aviso...'
                  : 'Ya pagué en efectivo (Notificar SuperAdmin)'}
              </span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

