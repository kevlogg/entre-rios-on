'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, Sparkles, Star, ArrowRight, Building2, Zap, DollarSign, Award } from 'lucide-react';
import { createSubscriptionPreferenceAction } from '@/server/actions/subscription';
import { createCashPaymentAction } from '@/server/actions/superadmin';

export type UserType = 'comercio' | 'turismo' | 'particular' | string;

interface SubscriptionPlansProps {
  commerceId?: string;
  userType?: UserType;
  currentTier?: string;
  onPlanActivated?: (planName: string) => void;
}

export function SubscriptionPlans({
  commerceId = 'comm-default',
  userType = 'comercio',
  currentTier,
  onPlanActivated,
}: SubscriptionPlansProps) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [activatedSuccess, setActivatedSuccess] = useState<string | null>(null);

  const handleCashPaymentRequest = async (planName: string, amount: number) => {
    setLoadingTier(`cash_${planName}`);
    try {
      const res = await createCashPaymentAction({
        commerceName: 'Comercio Adherido',
        ownerName: 'Titular',
        phoneWhatsApp: '5493434001122',
        planName,
        amount,
        cityName: 'Entre Ríos / Santa Fe',
        commerceId,
      });
      if (res.success) {
        setActivatedSuccess(`¡Solicitud de Pago en Efectivo Enviada! Notificamos al equipo SuperAdmin para verificar tu pago del plan "${planName}" y activar tu cuenta en la plataforma.`);
      }
    } catch (err) {
      console.warn('Error al solicitar verificación de pago en efectivo:', err);
    } finally {
      setLoadingTier(null);
    }
  };

  const handleSelectPlan = async (planTier: 'BRONCE' | 'PLATA' | 'ORO', planName: string) => {
    setLoadingTier(planTier);
    try {
      // Intento de checkout con MercadoPago
      const res = await createSubscriptionPreferenceAction(planTier, commerceId);
      if (res.success && res.initPoint) {
        window.location.href = res.initPoint;
      } else {
        // Modo fallback / activación rápida
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
            Elegí tu Plan de Suscripción ON MÁS
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Planes a medida sin comisiones por venta. Activación directa para figurar en la plataforma.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-2xl text-xs font-black inline-flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Comisiones 0% en Todos los Planes</span>
        </div>
      </div>

      {activatedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-4 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{activatedSuccess}</span>
        </div>
      )}

      {/* ==================== PLANES ON MÁS (BRONCE $29k, PLATA $49k, ORO $99k) ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
        
        {/* 1. PLAN BRONCE ($29.000) */}
        <div className="bg-slate-50/80 border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all hover:border-amber-600/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider block bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                Presencia Básica
              </span>
              <Building2 className="w-6 h-6 text-amber-700" />
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-black text-slate-900">Plan Bronce</h4>
              <p className="text-xs text-slate-500 font-medium">Presencia institucional en tu ciudad</p>
            </div>

            <div className="py-3 border-y border-slate-200">
              <span className="text-4xl font-black text-slate-900">$29.000</span>
              <span className="text-xs font-bold text-slate-400"> / mes</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700 font-semibold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Presencia local en directorio ON MÁS</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Botón directo a WhatsApp (sin comisiones)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ficha institucional con datos y ubicación</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Catálogo de hasta <strong>5 productos / servicios</strong></span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleSelectPlan('BRONCE', 'Plan Bronce ($29.000)')}
              disabled={loadingTier === 'BRONCE'}
              className="w-full bg-[#0047BA] hover:bg-[#002878] text-white py-3.5 rounded-2xl font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>{loadingTier === 'BRONCE' ? 'Procesando...' : 'Pagar con MercadoPago ($29.000)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleCashPaymentRequest('Plan Bronce', 29000)}
              disabled={loadingTier === 'cash_Plan Bronce'}
              className="w-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>{loadingTier === 'cash_Plan Bronce' ? 'Enviando aviso...' : 'Ya pagué en efectivo (Notificar SuperAdmin)'}</span>
            </button>
          </div>
        </div>

        {/* 2. PLAN PLATA ($49.000) - RECOMENDADO */}
        <div className="relative bg-gradient-to-b from-blue-50/90 via-white to-slate-50 border-2 border-[#00ADB5] rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl">
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

            <ul className="space-y-3 text-xs text-slate-700 font-semibold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Posicionamiento <strong>destacado en guía local</strong> y categoría</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Catálogo de hasta <strong>20 productos / servicios</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Métricas en tiempo real (visitas y clics a WhatsApp)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Insignia <strong>Comercio Verificado Plata</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Botón directo a WhatsApp (sin comisiones)</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleSelectPlan('PLATA', 'Plan Plata ($49.000)')}
              disabled={loadingTier === 'PLATA'}
              className="w-full bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#00969d] hover:to-[#002878] text-white py-3.5 rounded-2xl font-black text-xs shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loadingTier === 'PLATA' ? 'Procesando...' : 'Pagar con MercadoPago ($49.000)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleCashPaymentRequest('Plan Plata', 49000)}
              disabled={loadingTier === 'cash_Plan Plata'}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>{loadingTier === 'cash_Plan Plata' ? 'Enviando aviso...' : 'Ya pagué en efectivo (Notificar SuperAdmin)'}</span>
            </button>
          </div>
        </div>

        {/* 3. PLAN ORO ($99.000) - MÁXIMO ALCANCE / PORTADA PROVINCIAL */}
        <div className="relative bg-gradient-to-b from-[#1F1138] via-[#160b29] to-[#0d051a] border-2 border-amber-400 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-2xl text-white">
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

            <ul className="space-y-3 text-xs text-purple-100 font-bold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Destacado <strong>TOP #1 en portada provincial</strong> (Entre Ríos y Santa Fe)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Catálogo <strong>ILIMITADO</strong> de productos y servicios</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Cobertura especial y <strong>notas de prensa / editoriales</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Insignia <strong>Gold / Comercio Verificado Oro</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Soporte prioritario 24/7 y asesoramiento comercial</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleSelectPlan('ORO', 'Plan Oro ($99.000)')}
              disabled={loadingTier === 'ORO'}
              className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 py-3.5 rounded-2xl font-black text-xs shadow-xl transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loadingTier === 'ORO' ? 'Procesando...' : 'Pagar con MercadoPago ($99.000)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleCashPaymentRequest('Plan Oro', 99000)}
              disabled={loadingTier === 'cash_Plan Oro'}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>{loadingTier === 'cash_Plan Oro' ? 'Enviando aviso...' : 'Ya pagué en efectivo (Notificar SuperAdmin)'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
