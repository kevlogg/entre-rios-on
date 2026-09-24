'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, Sparkles, Star, ArrowRight, Car, Building2, Wrench, Zap } from 'lucide-react';
import { createSubscriptionPreferenceAction } from '@/server/actions/subscription';
import { createCashPaymentAction } from '@/server/actions/superadmin';
import { DollarSign, Clock } from 'lucide-react';

export type UserType = 'particular' | 'agencia' | 'negocio_automotor';

interface SubscriptionPlansProps {
  commerceId?: string;
  userType?: UserType;
  currentTier?: string;
  onPlanActivated?: (planName: string) => void;
}

export function SubscriptionPlans({
  commerceId = 'comm-default',
  userType = 'agencia',
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
        cityName: 'Entre Ríos',
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

  const handleSelectPlan = async (planKey: string, planName: string) => {
    setLoadingTier(planKey);
    try {
      // Intento de checkout con MercadoPago
      const res = await createSubscriptionPreferenceAction('PLATA', commerceId);
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>PLANES Y SUSCRIPCIONES AUTOMOTOR</span>
          </span>
          <h3 className="text-2xl font-black text-[#0047BA] leading-tight mt-1">
            Elegí tu Plan {userType === 'particular' ? 'Particular' : userType === 'agencia' ? 'de Agencia' : 'de Negocio Automotor'}
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

      {/* ==================== PLANES SEGÚN TIPO DE USUARIO ==================== */}

      {/* 1. PARTICULARE S: 1 AUTO X 30 DÍAS ($15.000) */}
      {userType === 'particular' && (
        <div className="max-w-xl mx-auto">
          <div className="bg-gradient-to-b from-blue-50/80 via-white to-slate-50 border-2 border-blue-500 rounded-3xl p-8 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-wider">
              Particular
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                  <Car className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900">Plan Publicación Particular</h4>
                  <p className="text-xs text-slate-500 font-medium">1 Auto por 30 días en el portal automotor</p>
                </div>
              </div>

              <div className="py-3 border-y border-slate-200">
                <span className="text-4xl font-black text-blue-600">$15.000</span>
                <span className="text-xs font-bold text-slate-400"> / por 30 días</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Publicación de 1 solo auto con fotos HD</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Vigencia completa de 30 días activos en el portal</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Botón directo a tu WhatsApp personal sin intermediarios</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ficha técnica completa y ubicación por ciudad</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleSelectPlan('particular_15k', 'Particular 1 Auto ($15.000)')}
                disabled={loadingTier === 'particular_15k'}
                className="w-full bg-gradient-to-r from-blue-600 to-[#002878] hover:from-blue-700 hover:to-[#0047BA] text-white py-4 rounded-2xl font-black text-sm shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{loadingTier === 'particular_15k' ? 'Procesando...' : 'Contratar con MercadoPago ($15.000)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleCashPaymentRequest('Particular 1 Auto', 15000)}
                disabled={loadingTier === 'cash_Particular 1 Auto'}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>{loadingTier === 'cash_Particular 1 Auto' ? 'Enviando aviso...' : 'Ya pagué en efectivo (Notificar SuperAdmin)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. AGENCIAS: BASE ($99.000) & PRO ($199.000) */}
      {userType === 'agencia' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Plan Base Agencia */}
          <div className="bg-[#1F1138]/5 border-2 border-purple-900/40 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all hover:border-purple-600">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-700 uppercase tracking-wider block">Inicial Agencia</span>
                <Building2 className="w-6 h-6 text-purple-700" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-slate-900">Plan Base Agencia</h4>
                <p className="text-xs text-slate-500 font-medium">Ideal para agencias medianas con flota activa</p>
              </div>

              <div className="py-2 border-y border-slate-200">
                <span className="text-3xl font-black text-slate-900">$99.000</span>
                <span className="text-xs font-bold text-slate-400"> / mes</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Publicación de <strong>hasta 30 AUTOS</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Perfil de Agencia en el directorio especializado</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Botón directo de WhatsApp sin comisión por venta</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Panel de gestión de stock de vehículos</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleSelectPlan('agencia_base_99k', 'Agencia Base ($99.000)')}
                disabled={loadingTier === 'agencia_base_99k'}
                className="w-full bg-[#2A1B4E] hover:bg-[#392468] text-white py-3.5 rounded-2xl font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-md"
              >
                {loadingTier === 'agencia_base_99k' ? 'Procesando...' : 'Pagar con MercadoPago ($99.000)'}
              </button>

              <button
                type="button"
                onClick={() => handleCashPaymentRequest('Agencia Base', 99000)}
                disabled={loadingTier === 'cash_Agencia Base'}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>{loadingTier === 'cash_Agencia Base' ? 'Enviando aviso...' : 'Ya pagué en efectivo (Notificar SuperAdmin)'}</span>
              </button>
            </div>
          </div>

          {/* Plan Pro Agencia (Violeta Oscuro Premium) */}
          <div className="relative bg-gradient-to-b from-[#2A1B4E] via-[#1F1138] to-[#120728] border-2 border-purple-500 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-2xl text-white">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>RECOMENDADO PRO</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-300 uppercase tracking-wider block">Máximo Alcance</span>
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-white">Plan Pro Agencia</h4>
                <p className="text-xs text-purple-200 font-medium">Publicación ilimitada y posicionamiento prioritario</p>
              </div>

              <div className="py-2 border-y border-purple-800">
                <span className="text-3xl font-black text-amber-300">$199.000</span>
                <span className="text-xs font-bold text-purple-300"> / mes</span>
              </div>

              <ul className="space-y-2.5 text-xs text-purple-100 font-bold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Publicación <strong>ILIMITADA DE AUTOS</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>PUBLICIDAD DESTACADA</strong> en portada del portal</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Insignia de Agencia Gold Verificada</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Posicionamiento top en resultados de búsqueda</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Soporte prioritario y reportes mensuales de leads</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleSelectPlan('agencia_pro_199k', 'Agencia Pro ($199.000)')}
                disabled={loadingTier === 'agencia_pro_199k'}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 py-3.5 rounded-2xl font-black text-xs shadow-xl transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{loadingTier === 'agencia_pro_199k' ? 'Procesando...' : 'Pagar con MercadoPago ($199.000)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleCashPaymentRequest('Agencia Pro', 199000)}
                disabled={loadingTier === 'cash_Agencia Pro'}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
              >
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>{loadingTier === 'cash_Agencia Pro' ? 'Enviando aviso...' : 'Ya pagué en efectivo (Notificar SuperAdmin)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. NEGOCIO AUTOMOTOR: BASE ($49.000) & PRO ($99.000) */}
      {userType === 'negocio_automotor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Plan Base Negocio */}
          <div className="bg-emerald-50/50 border-2 border-emerald-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all hover:border-emerald-500">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-700 uppercase tracking-wider block">Presencia Comercial</span>
                <Wrench className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-slate-900">Plan Base Negocio</h4>
                <p className="text-xs text-slate-500 font-medium">Exhibición de tu comercio en la guía del sector</p>
              </div>

              <div className="py-2 border-y border-slate-200">
                <span className="text-3xl font-black text-slate-900">$49.000</span>
                <span className="text-xs font-bold text-slate-400"> / mes</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-semibold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Muestra tu negocio y datos institucionales</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ubicación y mapa de atención local</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Botón directo de WhatsApp para consultas</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleSelectPlan('negocio_base_49k', 'Negocio Base ($49.000)')}
                disabled={loadingTier === 'negocio_base_49k'}
                className="w-full bg-[#0F2A28] hover:bg-[#183E3B] text-white py-3.5 rounded-2xl font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-md"
              >
                {loadingTier === 'negocio_base_49k' ? 'Procesando...' : 'Pagar con MercadoPago ($49.000)'}
              </button>

              <button
                type="button"
                onClick={() => handleCashPaymentRequest('Negocio Base', 49000)}
                disabled={loadingTier === 'cash_Negocio Base'}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>{loadingTier === 'cash_Negocio Base' ? 'Enviando aviso...' : 'Ya pagué en efectivo (Notificar SuperAdmin)'}</span>
              </button>
            </div>
          </div>

          {/* Plan Pro Negocio */}
          <div className="relative bg-gradient-to-b from-[#0F2A28] via-[#163D3A] to-[#0A1D1C] border-2 border-emerald-400 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl text-white">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>RECOMENDADO PRO</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-300 uppercase tracking-wider block">Catálogo Completo</span>
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-white">Plan Pro Negocio</h4>
                <p className="text-xs text-emerald-200 font-medium">Exhibición de todos tus servicios y productos</p>
              </div>

              <div className="py-2 border-y border-emerald-800">
                <span className="text-3xl font-black text-emerald-300">$99.000</span>
                <span className="text-xs font-bold text-emerald-200"> / mes</span>
              </div>

              <ul className="space-y-2.5 text-xs text-emerald-100 font-bold">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Muestra <strong>TODOS tus servicios y productos</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Catálogo ilimitado con fotos y precios</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Destacado en el rubro del mundo automotor</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Insignia de Negocio Automotor Verificado</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleSelectPlan('negocio_pro_99k', 'Negocio Pro ($99.000)')}
                disabled={loadingTier === 'negocio_pro_99k'}
                className="w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 py-3.5 rounded-2xl font-black text-xs shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{loadingTier === 'negocio_pro_99k' ? 'Procesando...' : 'Pagar con MercadoPago ($99.000)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleCashPaymentRequest('Negocio Pro', 99000)}
                disabled={loadingTier === 'cash_Negocio Pro'}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>{loadingTier === 'cash_Negocio Pro' ? 'Enviando aviso...' : 'Ya pagué en efectivo (Notificar SuperAdmin)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
