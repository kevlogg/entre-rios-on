'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, Check, Sparkles, Star, ArrowRight, Building2, Zap, DollarSign, Award, XCircle, X, Clock, Send, CheckCircle2, History, User, Store, Palmtree } from 'lucide-react';
import { createSubscriptionPreferenceAction } from '@/server/actions/subscription';
import { 
  createCashPaymentAction, 
  getPendingCashPaymentForCommerceAction, 
  cancelCashPaymentAction,
  getCommercePaymentHistoryAction,
  getSubscriptionPlansAction
} from '@/server/actions/superadmin';

export type UserType = 'comercio' | 'turismo' | 'particular' | string;

interface SubscriptionPlansProps {
  commerceId?: string;
  commerceName?: string;
  cityName?: string;
  phoneWhatsApp?: string;
  userType?: UserType;
  currentTier?: string;
  isAuthenticated?: boolean;
  showHistory?: boolean;
  onPlanActivated?: (planName: string) => void;
}

import { convertUserToMerchantAction } from '@/server/actions/profile';

const COMMERCE_FEATURES = [
  { id: 1, text: 'Presencia en Directorio Comercial ON MÁS' },
  { id: 2, text: 'Botón directo a WhatsApp para ventas (0% comisiones)' },
  { id: 3, catalog: true, text: '' },
  { id: 4, text: 'Posicionamiento destacado en categoría y guía comercial' },
  { id: 5, text: 'Métricas en tiempo real (visitas y clics de compradores)' },
  { id: 6, text: 'Insignia Comercio Verificado Plata' },
  { id: 7, text: 'Destacado TOP en portada provincial' },
  { id: 8, text: 'Cobertura especial y notas de prensa / editoriales' },
  { id: 9, text: 'Insignia Gold / Comercio Verificado Oro' },
  { id: 10, text: 'Soporte prioritario 24/7 y asesoramiento comercial' },
  { id: 11, text: 'Publicidad y visibilidad exclusiva en sitio web y redes sociales' },
];

const TURISM_FEATURES = [
  { id: 1, text: 'Presencia en Guía de Turismo & Alojamientos Regional' },
  { id: 2, text: 'Botón directo a WhatsApp para reservas directas (0% comisiones)' },
  { id: 3, catalog: true, text: '' },
  { id: 4, text: 'Posicionamiento preferencial en sección Turismo de la provincia' },
  { id: 5, text: 'Métricas en tiempo real (consultas de viajeros y reservas)' },
  { id: 6, text: 'Insignia Prestador Turístico Verificado Plata' },
  { id: 7, text: 'Destacado TOP en Portada Provincial y sección Turismo' },
  { id: 8, text: 'Cobertura especial de temporada, vacaciones y escapadas' },
  { id: 9, text: 'Insignia Gold / Prestador Turístico VIP Oro' },
  { id: 10, text: 'Soporte prioritario 24/7 y asesoramiento de visibilidad turística' },
  { id: 11, text: 'Campañas de difusión turística en redes sociales y portal' },
];

const getFeaturesForPlan = (cardType: 'bronce' | 'plata' | 'oro', track: 'comercio' | 'turismo' = 'comercio') => {
  const isTurismo = track === 'turismo';
  const catalogText = isTurismo
    ? (cardType === 'bronce'
        ? 'Hasta 5 servicios o tipos de alojamiento / cabañas'
        : cardType === 'plata'
        ? 'Hasta 20 servicios o tipos de alojamiento / paquetes'
        : 'Servicios y alojamientos ILIMITADOS')
    : (cardType === 'bronce'
        ? 'Catálogo de hasta 5 productos / servicios'
        : cardType === 'plata'
        ? 'Catálogo de hasta 20 productos / servicios'
        : 'Catálogo ILIMITADO de productos y servicios');

  const maxIncluded = cardType === 'bronce' ? 3 : cardType === 'plata' ? 6 : 11;
  const sourceFeatures = isTurismo ? TURISM_FEATURES : COMMERCE_FEATURES;

  return sourceFeatures.map((item, index) => {
    const itemNum = index + 1;
    const isIncluded = itemNum <= maxIncluded;
    const text = item.catalog ? catalogText : item.text;

    return { itemNum, isIncluded, text };
  });
};

export function SubscriptionPlans({
  commerceId = 'comm-default',
  commerceName,
  cityName,
  phoneWhatsApp,
  userType = 'comercio',
  currentTier,
  isAuthenticated,
  showHistory = false,
  onPlanActivated,
}: SubscriptionPlansProps) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(isAuthenticated ?? false);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [activatedSuccess, setActivatedSuccess] = useState<string | null>(null);
  const [pendingPayment, setPendingPayment] = useState<{ id: string; planName: string; amount: number; notes?: string } | null>(null);
  const [history, setHistory] = useState<Array<{ id: string; planName: string; amount: number; status: string; createdAt: string; notes?: string }>>([]);

  const isParticular = userType === 'particular';
  // If user is registered as turismo, track is strictly turismo. If comercio, strictly comercio.
  // If particular (vecino), allow toggling between Comercio and Turismo to choose what to create.
  const [selectedTrack, setSelectedTrack] = useState<'comercio' | 'turismo'>(
    userType === 'turismo' ? 'turismo' : 'comercio'
  );

  useEffect(() => {
    if (userType === 'turismo') {
      setSelectedTrack('turismo');
    } else if (userType === 'comercio') {
      setSelectedTrack('comercio');
    }
  }, [userType]);

  useEffect(() => {
    if (typeof isAuthenticated === 'boolean') {
      setIsUserLoggedIn(isAuthenticated);
      return;
    }
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        setIsUserLoggedIn(!!user);
      }).catch(() => {
        setIsUserLoggedIn(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsUserLoggedIn(!!session?.user);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } catch {
      setIsUserLoggedIn(false);
    }
  }, [isAuthenticated]);

  // State for dynamic plan pricing
  const [planPrices, setPlanPrices] = useState<{ bronce: number; plata: number; oro: number }>({
    bronce: 29000,
    plata: 49000,
    oro: 99000,
  });

  // State for "Ya pagué" report modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedPlanForReport, setSelectedPlanForReport] = useState<{ name: string; amount: number }>({ name: 'Bronce', amount: 29000 });
  const [reportPaymentMethod, setReportPaymentMethod] = useState<'TRANSFERENCIA' | 'EFECTIVO'>('TRANSFERENCIA');
  const [reportReference, setReportReference] = useState('');

  useEffect(() => {
    async function loadDynamicPrices() {
      try {
        const res = await getSubscriptionPlansAction();
        if (res.success && res.plans) {
          const prices = { bronce: 29000, plata: 49000, oro: 99000 };
          res.plans.forEach((p) => {
            if (p.id === 'bronce') prices.bronce = p.price;
            if (p.id === 'plata') prices.plata = p.price;
            if (p.id === 'oro') prices.oro = p.price;
          });
          setPlanPrices(prices);
        }
      } catch (e) {
        console.warn('Error cargando precios de planes:', e);
      }
    }
    loadDynamicPrices();
  }, []);

  const checkPendingPaymentAndHistory = async () => {
    // Si no está autenticado o no tiene un comercio real, no buscar información privada
    if (!isUserLoggedIn || !commerceId || commerceId === 'comm-default') {
      setPendingPayment(null);
      setHistory([]);
      return;
    }

    try {
      const res = await getPendingCashPaymentForCommerceAction(commerceId, commerceName);
      if (res.hasPending && res.pendingPayment) {
        setPendingPayment(res.pendingPayment);
      } else {
        setPendingPayment(null);
      }

      if (showHistory && commerceName) {
        const histRes = await getCommercePaymentHistoryAction(commerceName, commerceId);
        if (histRes.success && Array.isArray(histRes.data)) {
          setHistory(histRes.data);
        }
      }
    } catch (e) {
      console.warn('Error verificando pago pendiente e historial:', e);
    }
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      checkPendingPaymentAndHistory();
    } else {
      setPendingPayment(null);
      setHistory([]);
    }
  }, [commerceId, commerceName, isUserLoggedIn, showHistory]);

  const openReportModal = (planName: string, amount: number) => {
    setSelectedPlanForReport({ name: planName, amount });
    setIsReportModalOpen(true);
  };

  const handleSendPaymentReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingTier('send_report');

    try {
      const trackLabel = selectedTrack === 'turismo' ? 'TURISMO' : 'COMERCIO';
      const noteFull = `Rubro: ${trackLabel} • Método: ${reportPaymentMethod} • Ref: ${reportReference || 'Sin especificar'}`;
      const res = await createCashPaymentAction({
        commerceName: commerceName || (selectedTrack === 'turismo' ? 'Complejo Turístico' : 'Comercio Adherido'),
        ownerName: isParticular ? `Vecino Particular (${trackLabel})` : 'Titular',
        phoneWhatsApp: phoneWhatsApp || '5493434001122',
        planName: selectedPlanForReport.name,
        amount: selectedPlanForReport.amount,
        cityName: cityName || 'Entre Ríos / Santa Fe',
        commerceId,
        paymentType: 'MONTHLY_RENEWAL',
        paymentMethod: reportPaymentMethod,
        referenceNote: noteFull,
      });

      if (res.success) {
        setActivatedSuccess(`¡Aviso de pago para la cuota del "${selectedPlanForReport.name}" enviado exitosamente! Notificamos al SuperAdmin para verificar y activar tu cuenta.`);
        setIsReportModalOpen(false);
        setReportReference('');
        await checkPendingPaymentAndHistory();
      } else {
        alert(`Error enviando aviso: ${res.message || 'Intente nuevamente'}`);
      }
    } catch (err) {
      console.warn('Error enviando reporte de pago:', err);
      alert('Hubo un error inesperado al enviar el aviso. Por favor reintentá.');
    } finally {
      setLoadingTier(null);
    }
  };

  const handleCashPaymentRequest = async (planName: string, amount: number) => {
    setLoadingTier(`cash_${planName}`);
    try {
      const trackLabel = selectedTrack === 'turismo' ? 'TURISMO' : 'COMERCIO';
      const res = await createCashPaymentAction({
        commerceName: commerceName || (selectedTrack === 'turismo' ? 'Complejo Turístico' : 'Comercio Adherido'),
        ownerName: isParticular ? `Vecino Particular (${trackLabel})` : 'Titular',
        phoneWhatsApp: phoneWhatsApp || '5493434001122',
        planName,
        amount,
        cityName: cityName || 'Entre Ríos / Santa Fe',
        commerceId,
        referenceNote: `Rubro: ${trackLabel}`,
      });

      if (res.success) {
        setActivatedSuccess(`¡Solicitud de Pago Enviada! Notificamos al equipo SuperAdmin para verificar tu pago del "${planName}" y activar tu cuenta.`);
        await checkPendingPaymentAndHistory();
      } else {
        alert(`Error al enviar la solicitud: ${res.message || 'Intente nuevamente'}`);
      }
    } catch (err) {
      console.warn('Error al solicitar verificación de pago:', err);
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
        setActivatedSuccess('Solicitud de pago cancelada. Ahora podés seleccionar o cambiar de plan.');
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
      if (isParticular) {
        try {
          await convertUserToMerchantAction({
            businessTrack: selectedTrack,
            planTier,
            businessName: commerceName || (selectedTrack === 'turismo' ? 'Complejo Turístico' : 'Mi Comercio'),
            cityName: cityName,
            phoneWhatsApp: phoneWhatsApp,
          });
        } catch (convErr) {
          console.warn('Nota convirtiendo usuario a comerciante:', convErr);
        }
      }

      const res = await createSubscriptionPreferenceAction(planTier, commerceId);
      if (res.success && res.initPoint) {
        window.location.href = res.initPoint;
      } else {
        if (onPlanActivated) {
          onPlanActivated(planName);
        }
        setActivatedSuccess(`¡Plan "${planName}" contratado exitosamente! Tu cuenta comercial ha sido activada.`);
        setTimeout(() => setActivatedSuccess(null), 5000);
      }
    } catch (err) {
      if (onPlanActivated) {
        onPlanActivated(planName);
      }
      setActivatedSuccess(`¡Plan "${planName}" contratado exitosamente!`);
      setTimeout(() => setActivatedSuccess(null), 5000);
    } finally {
      setLoadingTier(null);
    }
  };

  const renderFeaturesList = (cardType: 'bronce' | 'plata' | 'oro') => {
    const features = getFeaturesForPlan(cardType, selectedTrack);
    return (
      <ul className="space-y-2.5 text-xs font-semibold">
        {features.map(({ itemNum, isIncluded, text }) => {
          if (isIncluded) {
            return (
              <li key={itemNum} className={`flex items-start gap-2 ${
                cardType === 'oro' 
                  ? (itemNum > 6 ? 'text-amber-300 font-extrabold' : 'text-purple-100 font-semibold')
                  : cardType === 'plata'
                  ? (itemNum >= 4 ? 'text-slate-900 font-bold' : 'text-slate-800 font-medium')
                  : (itemNum === 3 ? 'text-slate-900 font-bold' : 'text-slate-800 font-medium')
              }`}>
                <Check className={`w-4 h-4 shrink-0 mt-0.5 font-black ${
                  cardType === 'oro' ? 'text-amber-400' : 'text-emerald-600'
                }`} />
                <span>{text}</span>
              </li>
            );
          } else {
            return (
              <li key={itemNum} className={`flex items-start gap-2 font-normal ${
                cardType === 'oro' ? 'text-purple-300/50' : 'text-slate-400'
              }`}>
                <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 font-bold" />
                <span>{text}</span>
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
            <span>
              {selectedTrack === 'turismo'
                ? 'PLANES DE TURISMO & ALOJAMIENTOS ON MÁS'
                : 'PLANES COMERCIALES B2B ON MÁS'}
            </span>
          </span>
          <h3 className="text-2xl font-black text-[#0047BA] leading-tight mt-1">
            {selectedTrack === 'turismo'
              ? 'Elegí el Plan para tu Complejo Turístico / Cabañas'
              : 'Elegí tu Plan de Suscripción Comercial'}
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            {selectedTrack === 'turismo'
              ? 'Posicionamiento en la guía turística provincial, reservas directas a tu WhatsApp (0% comisiones) y difusión de temporada.'
              : 'Publicá tus productos, conectá directo por WhatsApp (0% comisiones) y posicioná tu comercio en toda la región.'}
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-2xl text-xs font-black inline-flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Sin Comisiones por Venta (0%)</span>
        </div>
      </div>

      {/* EXCLUSIVO PARA VECINOS: SELECTOR INTERACTIVO DE RUBRO COMERCIAL O TURÍSTICO */}
      {isParticular && (
        <div className="bg-gradient-to-r from-blue-50/90 via-cyan-50/80 to-blue-50/90 border-2 border-cyan-400/80 rounded-3xl p-6 shadow-sm space-y-4 text-slate-900 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 bg-[#0047BA] text-white rounded-2xl shrink-0 font-black text-xl shadow-xs">
                <User className="w-6 h-6 text-[#00E5E8]" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-[#0047BA]/10 border border-[#0047BA]/20 text-[#0047BA] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Cuenta Vecino / Usuario Particular
                </div>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  ¿Tenés un emprendimiento, comercio o complejo turístico y querés publicar?
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Actualmente estás registrado como vecino. Al contratar un plan, <strong>tu cuenta se convertirá automáticamente en Comercio o Turismo</strong>, habilitando tu catálogo y tu perfil público en ON MÁS.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-cyan-200/80">
            <span className="text-xs font-black text-slate-700 block mb-2 uppercase tracking-wider">
              Paso 1: Seleccioná qué tipo de negocio vas a dar de alta:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedTrack('comercio')}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedTrack === 'comercio'
                    ? 'border-[#0047BA] bg-white text-[#0047BA] shadow-md ring-2 ring-[#0047BA]/20'
                    : 'border-slate-200 bg-white/60 hover:bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${selectedTrack === 'comercio' ? 'bg-[#0047BA] text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-black text-sm text-slate-900">Comercio / Emprendimiento</h5>
                    <p className="text-[11px] text-slate-500 font-medium">Locales, productos, indumentaria, gastronomía, ferreterías, etc.</p>
                  </div>
                </div>
                {selectedTrack === 'comercio' && (
                  <CheckCircle2 className="w-5 h-5 text-[#0047BA] shrink-0" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedTrack('turismo')}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                  selectedTrack === 'turismo'
                    ? 'border-emerald-600 bg-white text-emerald-800 shadow-md ring-2 ring-emerald-600/20'
                    : 'border-slate-200 bg-white/60 hover:bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${selectedTrack === 'turismo' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Palmtree className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-black text-sm text-slate-900">Turismo & Alojamientos</h5>
                    <p className="text-[11px] text-slate-500 font-medium">Cabañas, posadas, hoteles, termas, excursiones y guías.</p>
                  </div>
                </div>
                {selectedTrack === 'turismo' && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BANNER SOLICITUD PENDIENTE DE PAGO EN EFECTIVO */}
      {isUserLoggedIn && pendingPayment && (
        <div className="bg-amber-50/90 border-2 border-amber-400 rounded-3xl p-6 shadow-md space-y-4 text-amber-950 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shrink-0 font-black text-2xl shadow-xs">
                ⏳
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Solicitud de Pago Pendiente
                </span>
                <h4 className="text-lg font-black text-slate-900 mt-1">
                  Pago en revisión para el Plan {pendingPayment.planName} (${pendingPayment.amount.toLocaleString('es-AR')})
                </h4>
                <p className="text-xs text-slate-700 font-medium mt-0.5 leading-relaxed">
                  Avisaste tu pago. La selección de otros planes se encuentra pausada hasta que el equipo SuperAdmin confirme el pago. Podés cancelar esta solicitud si deseas cambiar de plan.
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

      {/* BANNER INFORMATIVO PARA USUARIOS NO REGISTRADOS */}
      {!isUserLoggedIn && (
        <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/80 to-blue-50/90 border border-blue-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 bg-[#0047BA] text-white rounded-2xl shrink-0 font-black text-xl shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0047BA] bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200">
                Paso Previo Requerido
              </span>
              <h4 className="text-base font-black text-slate-900 mt-1">
                Registrá tu negocio para contratar un plan
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                Para vincular tu suscripción a tu catálogo y perfil público, primero creá tu cuenta o iniciá sesión.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Link
              href={`/login?mode=signup&type=${selectedTrack}`}
              className="flex-1 sm:flex-none text-center bg-[#0047BA] hover:bg-[#002878] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md transition-all active:scale-95"
            >
              Registrar {selectedTrack === 'turismo' ? 'turismo' : 'comercio'}
            </Link>
            <Link
              href="/login?mode=login&redirectTo=/planes"
              className="flex-1 sm:flex-none text-center bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      )}

      {/* ==================== PLANES ON MÁS (BRONCE $29k, PLATA $49k, ORO $99k) ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-7xl mx-auto">

        {/* 1. PLAN BRONCE ($29.000) */}
        <div className={`bg-slate-50/90 border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all ${
          pendingPayment ? 'opacity-65 grayscale-[20%]' : 'hover:border-amber-600/50'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider block bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
                {selectedTrack === 'turismo' ? 'Presencia Turística Básica' : 'Presencia Básica'}
              </span>
              {selectedTrack === 'turismo' ? (
                <Palmtree className="w-6 h-6 text-amber-700" />
              ) : (
                <Building2 className="w-6 h-6 text-amber-700" />
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-black text-slate-900">
                {selectedTrack === 'turismo' ? 'Plan Bronce Turismo' : 'Plan Bronce'}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {selectedTrack === 'turismo' 
                  ? 'Presencia inicial para cabañas y servicios turísticos' 
                  : 'Presencia inicial en el portal comercial regional'}
              </p>
            </div>

            <div className="py-3 border-y border-slate-200">
              <span className="text-4xl font-black text-slate-900">${planPrices.bronce.toLocaleString('es-AR')}</span>
              <span className="text-xs font-bold text-slate-400"> / mes</span>
            </div>

            {/* Lista de características del Plan Bronce */}
            {renderFeaturesList('bronce')}
          </div>

          {!isUserLoggedIn ? (
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <Link
                href={`/login?mode=signup&type=${selectedTrack}`}
                className="w-full bg-[#0047BA] hover:bg-[#002878] text-white py-3.5 rounded-2xl font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 text-center"
              >
                <span>Registrar mi {selectedTrack === 'turismo' ? 'servicio turístico' : 'comercio'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login?mode=login&redirectTo=/planes"
                className="w-full bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs text-center"
              >
                <span>Iniciar sesión para contratar</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleSelectPlan('BRONCE', `${selectedTrack === 'turismo' ? 'Plan Bronce Turismo' : 'Plan Bronce'} ($${planPrices.bronce.toLocaleString('es-AR')})`)}
                disabled={Boolean(pendingPayment) || loadingTier === 'BRONCE'}
                className="w-full bg-[#0047BA] hover:bg-[#002878] text-white py-3.5 rounded-2xl font-black text-xs transition-transform active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loadingTier === 'BRONCE' ? 'Procesando...' : `Pagar con MercadoPago ($${planPrices.bronce.toLocaleString('es-AR')})`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => openReportModal(selectedTrack === 'turismo' ? 'Bronce Turismo' : 'Bronce', planPrices.bronce)}
                disabled={Boolean(pendingPayment)}
                className="w-full bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 py-2.5 rounded-xl font-black text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
              >
                <DollarSign className="w-4 h-4 text-emerald-600 font-black" />
                <span>
                  {pendingPayment ? 'Pago en revisión...' : 'Ya pagué esta cuota (Efectivo / Transf.)'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* 2. PLAN PLATA ($49.000) */}
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
                {selectedTrack === 'turismo' ? 'Mayor Visibilidad Turística' : 'Mayor Visibilidad'}
              </span>
              <Zap className="w-6 h-6 text-[#00ADB5]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-black text-slate-900">
                {selectedTrack === 'turismo' ? 'Plan Plata Turismo' : 'Plan Plata'}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {selectedTrack === 'turismo' 
                  ? 'Para complejos, cabañas y actividades con alta rotación' 
                  : 'Para comercios en crecimiento activo'}
              </p>
            </div>

            <div className="py-3 border-y border-slate-200">
              <span className="text-4xl font-black text-[#0047BA]">${planPrices.plata.toLocaleString('es-AR')}</span>
              <span className="text-xs font-bold text-slate-400"> / mes</span>
            </div>

            {/* Lista de características del Plan Plata */}
            {renderFeaturesList('plata')}
          </div>

          {!isUserLoggedIn ? (
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <Link
                href={`/login?mode=signup&type=${selectedTrack}`}
                className="w-full bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#00969d] hover:to-[#002878] text-white py-3.5 rounded-2xl font-black text-xs shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <span>Registrar mi {selectedTrack === 'turismo' ? 'servicio turístico' : 'comercio'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login?mode=login&redirectTo=/planes"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs text-center"
              >
                <span>Iniciar sesión para contratar</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <button
                onClick={() => handleSelectPlan('PLATA', `${selectedTrack === 'turismo' ? 'Plan Plata Turismo' : 'Plan Plata'} ($${planPrices.plata.toLocaleString('es-AR')})`)}
                disabled={Boolean(pendingPayment) || loadingTier === 'PLATA'}
                className="w-full bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#00969d] hover:to-[#002878] text-white py-3.5 rounded-2xl font-black text-xs shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loadingTier === 'PLATA' ? 'Procesando...' : `Pagar con MercadoPago ($${planPrices.plata.toLocaleString('es-AR')})`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => openReportModal(selectedTrack === 'turismo' ? 'Plata Turismo' : 'Plata', planPrices.plata)}
                disabled={Boolean(pendingPayment)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 py-2.5 rounded-xl font-black text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
              >
                <DollarSign className="w-4 h-4 text-emerald-600 font-black" />
                <span>
                  {pendingPayment ? 'Pago en revisión...' : 'Ya pagué esta cuota (Efectivo / Transf.)'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* 3. PLAN ORO ($99.000) */}
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
                {selectedTrack === 'turismo' ? 'Portada Provincial • Destino VIP' : 'Portada Provincial'}
              </span>
              <Star className="w-6 h-6 text-amber-400 fill-amber-400/20" />
            </div>

            <div className="space-y-1">
              <h4 className="text-2xl font-black text-white">
                {selectedTrack === 'turismo' ? 'Plan Oro Turismo VIP' : 'Plan Oro'}
              </h4>
              <p className="text-xs text-purple-200 font-medium">
                {selectedTrack === 'turismo' 
                  ? 'Liderazgo provincial y máxima cobertura en escapadas' 
                  : 'Liderazgo y máxima cobertura provincial'}
              </p>
            </div>

            <div className="py-3 border-y border-purple-800/80">
              <span className="text-4xl font-black text-amber-300">${planPrices.oro.toLocaleString('es-AR')}</span>
              <span className="text-xs font-bold text-purple-300"> / mes</span>
            </div>

            {/* Lista de características del Plan Oro */}
            {renderFeaturesList('oro')}
          </div>

          {!isUserLoggedIn ? (
            <div className="space-y-2 pt-4 border-t border-purple-800/80">
              <Link
                href={`/login?mode=signup&type=${selectedTrack}`}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 py-3.5 rounded-2xl font-black text-xs shadow-xl transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-center"
              >
                <span>Registrar mi {selectedTrack === 'turismo' ? 'servicio turístico' : 'comercio'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/login?mode=login&redirectTo=/planes"
                className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-white/20 text-center"
              >
                <span>Iniciar sesión para contratar</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-2 pt-4 border-t border-purple-800/80">
              <button
                onClick={() => handleSelectPlan('ORO', `${selectedTrack === 'turismo' ? 'Plan Oro Turismo VIP' : 'Plan Oro'} ($${planPrices.oro.toLocaleString('es-AR')})`)}
                disabled={Boolean(pendingPayment) || loadingTier === 'ORO'}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 py-3.5 rounded-2xl font-black text-xs shadow-xl transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loadingTier === 'ORO' ? 'Procesando...' : `Pagar con MercadoPago ($${planPrices.oro.toLocaleString('es-AR')})`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => openReportModal(selectedTrack === 'turismo' ? 'Oro Turismo' : 'Oro', planPrices.oro)}
                disabled={Boolean(pendingPayment)}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
              >
                <DollarSign className="w-3.5 h-3.5 text-amber-400 font-black" />
                <span>
                  {pendingPayment ? 'Pago en revisión...' : 'Ya pagué esta cuota (Efectivo / Transf.)'}
                </span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* ==================== SECCIÓN DE HISTORIAL DE PAGOS Y CUOTAS ==================== */}
      {showHistory && (
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-black text-base">
              <History className="w-5 h-5 text-[#0047BA]" />
              <span>Historial de Cuotas Mensuales y Pagos</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Registros guardados en sistema</span>
          </div>

          {history.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 font-medium">
              Aún no registrás cuotas mensuales abonadas o en proceso en el historial.
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Plan / Concepto</th>
                    <th className="py-3 px-4">Monto</th>
                    <th className="py-3 px-4">Detalle / Comprobante</th>
                    <th className="py-3 px-4 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {history.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-500">
                        {h.createdAt ? new Date(h.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Reciente'}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        Plan {h.planName}
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-700">
                        ${h.amount.toLocaleString('es-AR')}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {h.notes || 'Pago de cuota mensual'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {h.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Aprobado & Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> En Validación SuperAdmin
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================== MODAL DE REPORTE "YA PAGUÉ MI CUOTA" ==================== */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative">
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00ADB5]">
                Notificar Pago al SuperAdmin
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Notificar Pago de Nueva Cuota Mensual
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Registrá tu pago de la cuota del Plan <strong className="text-slate-900">{selectedPlanForReport.name} (${selectedPlanForReport.amount.toLocaleString('es-AR')})</strong>.
              </p>
            </div>

            {/* Datos Bancarios Oficiales de Transferencia */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-2 text-xs text-slate-800">
              <div className="font-extrabold text-[#0047BA] flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#00ADB5]" />
                <span>Datos Oficiales para Transferencia / Depósito</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-white p-3 rounded-xl border border-blue-100">
                <div>
                  <span className="text-slate-400 block font-sans">Banco:</span>
                  <strong>Banco Entre Ríos / Santa Fe</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">Titular:</span>
                  <strong>ON MÁS Medios Digitales</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">Alias MP / CBU:</span>
                  <strong className="text-[#0047BA]">ONMAS.OFICIAL.MP</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">CVU / CBU:</span>
                  <strong>0000003100084592019482</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleSendPaymentReport} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700">Forma de Pago Realizada</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReportPaymentMethod('TRANSFERENCIA')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      reportPaymentMethod === 'TRANSFERENCIA'
                        ? 'border-[#0047BA] bg-cyan-50 text-[#0047BA]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Transferencia Bancaria
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportPaymentMethod('EFECTIVO')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      reportPaymentMethod === 'EFECTIVO'
                        ? 'border-[#0047BA] bg-cyan-50 text-[#0047BA]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Efectivo en Sucursal
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-slate-700">Nº de Comprobante / Referencia / Banco Emisor</label>
                <input
                  type="text"
                  placeholder="Ej: Transf. N° 984123 desde Banco Galicia"
                  value={reportReference}
                  onChange={(e) => setReportReference(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#00ADB5] focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loadingTier === 'send_report'}
                  className="bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#007C8A] hover:to-[#002878] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center gap-2 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loadingTier === 'send_report' ? 'Enviando aviso...' : 'Enviar Aviso de Pago'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


