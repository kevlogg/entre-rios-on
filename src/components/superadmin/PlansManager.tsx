'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Save, 
  Sparkles, 
  Building2, 
  Zap, 
  Star, 
  CheckCircle2, 
  RefreshCw,
  Info,
  Layers,
  Award
} from 'lucide-react';
import { 
  getSubscriptionPlansAction, 
  updateSubscriptionPlansAction, 
  PlanConfigItem, 
  DEFAULT_SUBSCRIPTION_PLANS 
} from '@/server/actions/superadmin';

function getNextMonthEffectiveDateText(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return `1° de ${monthNames[nextMonth.getMonth()]} de ${nextMonth.getFullYear()}`;
}

export function PlansManager() {
  const [plans, setPlans] = useState<PlanConfigItem[]>(DEFAULT_SUBSCRIPTION_PLANS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const nextMonthText = getNextMonthEffectiveDateText();

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await getSubscriptionPlansAction();
      if (res && res.success && Array.isArray(res.plans) && res.plans.length > 0) {
        setPlans(res.plans);
      } else {
        setPlans(DEFAULT_SUBSCRIPTION_PLANS);
      }
    } catch (e) {
      console.warn('Error cargando planes:', e);
      setPlans(DEFAULT_SUBSCRIPTION_PLANS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePriceChange = (id: string, newPrice: number) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, price: Math.max(0, newPrice) } : p))
    );
  };

  const handleFieldChange = (id: string, field: keyof PlanConfigItem, value: any) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await updateSubscriptionPlansAction(plans);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `¡Valores de los planes guardados exitosamente! Los nuevos precios entrarán en vigencia a partir del ${nextMonthText}.`,
        });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Ocurrió un error al guardar los cambios.' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Error de red o comunicación al guardar los datos.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-3 min-h-[300px]">
        <div className="w-10 h-10 border-4 border-[#00ADB5] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500">Cargando valores de planes de Comercios y Turismo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-[#002878] to-[#0047BA] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-72 h-72 bg-[#00ADB5]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Gestión Comercial • Precios Oficiales</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Administrador de Valores de Planes
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
              Configurá los precios mensuales y límites de catálogo para Comercios y Turismo. Los nuevos valores modificados empezarán a regir a partir del <strong className="text-amber-300 font-extrabold">{nextMonthText}</strong>.
            </p>
          </div>

          <button
            onClick={fetchPlans}
            disabled={loading}
            className="self-start md:self-center bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border border-white/20 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Recargar Valores</span>
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-700">
        <Info className="w-5 h-5 text-[#0047BA] shrink-0 mt-0.5" />
        <div>
          <strong className="font-extrabold text-[#0047BA] block mb-0.5">Vigencia a Partir del 1° del Mes Siguiente:</strong>
          Los cambios en los precios de las suscripciones se guardan en el sistema y entrarán en vigencia a partir del <strong className="text-slate-900 font-extrabold">{nextMonthText}</strong>. Aplican para Comercios y prestadores de Turismo.
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-950 shadow-md'
              : 'bg-rose-50 border-2 border-rose-400 text-rose-950 shadow-md'
          }`}
        >
          <CheckCircle2 className={`w-5 h-5 shrink-0 ${feedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`} />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Plans Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {(plans || []).map((plan) => {
            const isOro = plan.id === 'oro';
            const isPlata = plan.id === 'plata';
            const isBronce = plan.id === 'bronce';

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl p-6 border-2 shadow-sm space-y-6 flex flex-col justify-between transition-all ${
                  isOro
                    ? 'border-amber-400 bg-gradient-to-b from-amber-50/30 to-white'
                    : isPlata
                    ? 'border-[#00ADB5] bg-gradient-to-b from-cyan-50/30 to-white'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                        isOro
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : isPlata
                          ? 'bg-cyan-100 text-[#0047BA] border-cyan-300'
                          : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      {plan.badge || (isOro ? 'VIP' : isPlata ? 'RECOMENDADO' : 'BÁSICO')}
                    </span>

                    {isOro ? (
                      <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
                    ) : isPlata ? (
                      <Zap className="w-6 h-6 text-[#00ADB5]" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-600" />
                    )}
                  </div>

                  {/* Plan Name */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Nombre del Plan
                    </label>
                    <input
                      type="text"
                      value={plan.name}
                      onChange={(e) => handleFieldChange(plan.id, 'name', e.target.value)}
                      className="w-full font-black text-xl text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-[#00ADB5] focus:outline-hidden"
                    />
                  </div>

                  {/* PRICE FIELD - Highlighted */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1.5 border border-slate-800">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-amber-300">
                      Precio Mensual ($ ARS)
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-amber-400">$</span>
                      <input
                        type="number"
                        step="1000"
                        min="0"
                        value={plan.price}
                        onChange={(e) => handlePriceChange(plan.id, parseFloat(e.target.value) || 0)}
                        className="w-full text-3xl font-black text-white bg-transparent border-b-2 border-amber-400 focus:outline-hidden px-1 py-0.5"
                      />
                      <span className="text-xs font-extrabold text-slate-400 shrink-0">/ mes</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-semibold pt-1">
                      Monto formateado: ${plan.price.toLocaleString('es-AR')} ARS
                    </span>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Descripción General
                    </label>
                    <textarea
                      rows={2}
                      value={plan.description}
                      onChange={(e) => handleFieldChange(plan.id, 'description', e.target.value)}
                      className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-[#00ADB5] focus:outline-hidden resize-none"
                    />
                  </div>

                  {/* Catalog Limit Text */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                      Texto Límite de Catálogo
                    </label>
                    <input
                      type="text"
                      value={plan.catalogLimitText}
                      onChange={(e) => handleFieldChange(plan.id, 'catalogLimitText', e.target.value)}
                      className="w-full text-xs font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#00ADB5] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Card Footer Summary */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-slate-500">
                  <span>Beneficios incluidos:</span>
                  <span className="text-[#0047BA]">{(plan.features || []).length} Funciones</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button Footer */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Sparkles className="w-4 h-4 text-[#00ADB5]" />
            <span>Al guardar, los nuevos precios se publicarán de forma instantánea.</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-gradient-to-r from-[#0047BA] to-[#00ADB5] hover:from-[#002878] hover:to-[#008f95] text-white px-8 py-3.5 rounded-2xl font-black text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando Cambios...' : 'Guardar Cambios de Planes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
