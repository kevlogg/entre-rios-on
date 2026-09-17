'use client';

import React, { useState } from 'react';
import { ShieldCheck, Check, Sparkles, Zap, Star, ArrowRight } from 'lucide-react';
import { createSubscriptionPreferenceAction } from '@/server/actions/subscription';

interface SubscriptionPlansProps {
  commerceId: string;
  currentTier?: string;
}

export function SubscriptionPlans({ commerceId, currentTier = 'BRONCE' }: SubscriptionPlansProps) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSelectPlan = async (tier: 'BRONCE' | 'PLATA' | 'ORO') => {
    setLoadingTier(tier);
    try {
      const res = await createSubscriptionPreferenceAction(tier, commerceId);
      if (res.success && res.initPoint) {
        window.location.href = res.initPoint;
      } else {
        alert(res.message || 'Error al procesar el plan.');
      }
    } catch (err) {
      console.warn('Error iniciando checkout:', err);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#00ADB5] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MEMBRESÍAS COMERCIALES B2B</span>
          </span>
          <h3 className="text-2xl font-black text-[#0047BA] leading-tight mt-1">
            Suscripción
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Seleccioná el plan ideal para posicionar tu comercio en Santa Fe y Entre Ríos sin comisiones por venta.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-2xl text-xs font-black inline-flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Comisiones 0% en Todos los Planes</span>
        </div>
      </div>

      {/* 3 Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

        {/* PLAN 1: BRONCE */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all hover:border-slate-300">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Inicial</span>
              <h4 className="text-xl font-black text-slate-900">Plan Bronce</h4>
              <p className="text-xs text-slate-500 font-medium">Ideal para negocios que inician su digitalización.</p>
            </div>

            <div className="py-2 border-y border-slate-200/60">
              <span className="text-3xl font-black text-slate-900">$9.900</span>
              <span className="text-xs font-bold text-slate-400"> / mes</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 font-semibold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hasta 15 productos en catálogo</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Botón de WhatsApp directo sin comisión</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Presencia en el directorio de la ciudad</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('BRONCE')}
            disabled={loadingTier === 'BRONCE'}
            className="w-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 py-3 rounded-2xl font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-2xs"
          >
            {loadingTier === 'BRONCE' ? 'Cargando...' : 'Elegir Plan Bronce'}
          </button>
        </div>

        {/* PLAN 2: PLATA (RECOMENDADO) */}
        <div className="relative bg-gradient-to-b from-[#002878]/5 via-white to-[#00ADB5]/5 border-2 border-[#0047BA] rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl scale-[1.03] z-10">
          
          {/* Badge Recomendado */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#0047BA] via-[#002878] to-[#00ADB5] text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Recomendado</span>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1">
              <span className="text-xs font-black text-[#00ADB5] uppercase tracking-wider block">Más Popular</span>
              <h4 className="text-xl font-black text-[#0047BA]">Plan Plata</h4>
              <p className="text-xs text-slate-600 font-semibold">Máxima visibilidad comercial y catálogo ilimitado.</p>
            </div>

            <div className="py-2 border-y border-slate-200">
              <span className="text-3xl font-black text-[#0047BA]">$18.900</span>
              <span className="text-xs font-bold text-slate-500"> / mes</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-800 font-bold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00ADB5] shrink-0" />
                <span>Catálogo Ilimitado de productos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00ADB5] shrink-0" />
                <span>Insignia Gold Verificado en el portal</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00ADB5] shrink-0" />
                <span>Posicionamiento Prioritario en búsquedas</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#00ADB5] shrink-0" />
                <span>Reportes mensuales de clics y leads</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('PLATA')}
            disabled={loadingTier === 'PLATA'}
            className="w-full bg-gradient-to-r from-[#0047BA] via-[#002878] to-[#00ADB5] hover:from-[#0B66FF] hover:to-[#0047BA] text-white py-3.5 rounded-2xl font-black text-xs shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loadingTier === 'PLATA' ? 'Cargando MercadoPago...' : 'Elegir Plan Plata (Recomendado)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* PLAN 3: ORO */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all hover:border-slate-300">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-amber-500 uppercase tracking-wider block">Premium</span>
              <h4 className="text-xl font-black text-slate-900">Plan Oro</h4>
              <p className="text-xs text-slate-500 font-medium">Destacado provincial en la portada principal.</p>
            </div>

            <div className="py-2 border-y border-slate-200/60">
              <span className="text-3xl font-black text-slate-900">$29.900</span>
              <span className="text-xs font-bold text-slate-400"> / mes</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 font-semibold">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Todo lo del Plan Plata incluido</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Destacado en Banner Hero de la Portada</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Participación en Sorteos ON MÁS Mensual</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Asesor B2B asignado y soporte directo</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSelectPlan('ORO')}
            disabled={loadingTier === 'ORO'}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-md"
          >
            {loadingTier === 'ORO' ? 'Cargando...' : 'Elegir Plan Oro'}
          </button>
        </div>

      </div>

    </div>
  );
}
