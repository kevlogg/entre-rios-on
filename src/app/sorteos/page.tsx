'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Gift,
  Sparkles,
  CheckCircle2,
  Ticket,
  ShieldCheck,
  Store,
  MessageCircle,
  Clock,
  Trophy,
  HelpCircle,
  Zap
} from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { registerRaffleParticipantAction } from '@/server/actions/public';
import { getRaffles } from '@/lib/dal/portal';
import { Raffle } from '@/types';

export default function SorteosPage() {
  const [activeRaffle, setActiveRaffle] = useState<Raffle | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', city: 'Paraná', email: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsAppUrl, setWhatsAppUrl] = useState('');

  useEffect(() => {
    async function loadRaffle() {
      try {
        const raffles = await getRaffles();
        if (raffles && raffles.length > 0) {
          const current = raffles.find((r) => r.status === 'ACTIVE') || raffles[0];
          setActiveRaffle(current);
        }
      } catch (err) {
        console.warn('Error cargando sorteos:', err);
      }
    }
    loadRaffle();
  }, []);

  const raffleTitle = activeRaffle?.title || 'Sorteo Mensual Gran Litoral • Octubre 2026';
  const mainPrize = activeRaffle?.prize || 'Estancia Termal 3D/2N en Federación para 2 Personas + Pases + Cena';
  const ticketPrice = activeRaffle?.ticketPrice || '$2.500 ARS';
  const drawDate = activeRaffle?.drawDate ? new Date(activeRaffle.drawDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }) : '31 de Octubre, 2026';
  const prizesList = activeRaffle?.prizesList || [
    '1º Premio: Estancia Termal 3D/2N en Federación para 2 personas + Pases Termales + Cena Litoraleña',
    '2º Premio: Canasta de Productos Regionales & Caja de Vinos Tannat Reserva',
    '3º Premio: Voucher por $50.000 ARS para compras en comercios del portal',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || isSubmitting) return;

    setIsSubmitting(true);

    const textMsg = `Hola ON MÁS, quiero comprar un ticket (${ticketPrice}) para participar en el "${raffleTitle}".\n\n📌 Datos de Participante:\n- Nombre: ${formData.name}\n- Localidad: ${formData.city}\n- WhatsApp: ${formData.phone}`;
    const generatedWspUrl = `https://wa.me/5493434001122?text=${encodeURIComponent(textMsg)}`;
    setWhatsAppUrl(generatedWspUrl);

    try {
      await registerRaffleParticipantAction({
        fullName: formData.name,
        phoneWhatsApp: formData.phone,
        cityName: formData.city,
        email: formData.email,
      });
    } catch (err) {
      console.warn('Raffle registration fallback:', err);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Redirect to WhatsApp after short delay
    window.open(generatedWspUrl, '_blank');
  };

  return (
    <DynamicLayoutWrapper>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-[#00ADB5] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <span className="text-[#0047BA]">Sorteos Mensuales ON MÁS</span>
        </div>

        {/* Hero Banner del Sorteo Mensual */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <Gift className="w-4 h-4" />
                Sorteo Mensual Oficial
              </span>
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                Sortea: {drawDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
              {raffleTitle}
            </h1>

            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              🏆 <strong>Premio Principal:</strong> {mainPrize}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
              <span className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
                <Store className="w-4 h-4" />
                Comercios Activos: Participan $0
              </span>
              <span className="bg-amber-300 text-slate-950 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm font-extrabold">
                <Ticket className="w-4 h-4" />
                Ticket Vecinos: {ticketPrice}
              </span>
            </div>
          </div>

          {activeRaffle?.imageUrl && (
            <div className="relative h-48 md:h-64 w-full md:w-80 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl shrink-0">
              <Image src={activeRaffle.imageUrl} alt={raffleTitle} fill className="object-cover" />
            </div>
          )}
        </div>

        {/* Reglas e Instrucciones para Comercios & Usuarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
          {/* Card Comercios */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-3xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-[#0047BA] font-extrabold text-sm">
              <Store className="w-5 h-5 text-[#00ADB5]" />
              <span>¿Tenés un Comercio o PyME con Plan Activo?</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Todos los comercios adheridos que cuenten con un plan mensual activo (**Bronce, Plata u Oro**) participan **AUTOMÁTICAMENTE** y sin costo adicional en el sorteo mensual. ¡Tu cuenta comercial ya está participando!
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Inclusión automática garantizada</span>
            </div>
          </div>

          {/* Card Usuarios Vecinos */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
              <Ticket className="w-5 h-5 text-amber-600" />
              <span>¿Sos Vecino o Usuario General?</span>
            </div>
            <p className="text-slate-800 leading-relaxed">
              Podés comprar tu ticket digital por tan solo **{ticketPrice}** directamente vía WhatsApp sin pasarela de pagos. Ingresá tus datos a continuación y serás redirigido al WhatsApp oficial de **ON MÁS** para completar la adquisición del número.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-black text-amber-900 bg-amber-200/80 px-3 py-1 rounded-xl">
              <MessageCircle className="w-4 h-4 text-amber-700 fill-current" />
              <span>Compra directa vía WhatsApp ON MÁS</span>
            </div>
          </div>
        </div>

        {/* Formulario y Premios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Formulario de Compra de Ticket vía WhatsApp (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-[#0047BA] flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#00ADB5]" />
                <span>Comprar Ticket Sorteo ($ {ticketPrice})</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Completá tus datos para generar tu solicitud de ticket por WhatsApp.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center space-y-4 animate-in fade-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">¡Solicitud de Ticket Generada!</h3>
                  <p className="text-xs text-slate-700 font-medium">
                    Registramos los datos de <strong>{formData.name}</strong> ({formData.city}) para el <strong>{raffleTitle}</strong>.
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 px-6 rounded-2xl font-black text-xs shadow-md inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Confirmar Compra Ticket ({ticketPrice}) por WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-bold text-slate-500 hover:text-[#0047BA] block mx-auto pt-2"
                  >
                    Comprar otro ticket
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Gabriel Benítez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 343 4567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad / Localidad *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold"
                  >
                    <optgroup label="— Entre Ríos —">
                      <option value="Paraná">Paraná</option>
                      <option value="Concordia">Concordia</option>
                      <option value="Colón">Colón</option>
                      <option value="Gualeguaychú">Gualeguaychú</option>
                      <option value="Federación">Federación</option>
                      <option value="Concepción del Uruguay">Concepción del Uruguay</option>
                      <option value="Victoria">Victoria</option>
                      <option value="Villa Elisa">Villa Elisa</option>
                    </optgroup>
                    <optgroup label="— Santa Fe —">
                      <option value="Rosario">Rosario</option>
                      <option value="Santa Fe Capital">Santa Fe Capital</option>
                      <option value="Rafaela">Rafaela</option>
                    </optgroup>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#25D366] text-white py-4 rounded-2xl font-black text-xs shadow-md transition-transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Comprar Ticket ({ticketPrice}) por WhatsApp</span>
                  </button>
                </div>
              </form>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-2 border-t border-slate-100">
              <ShieldCheck className="w-4 h-4 text-[#00ADB5]" />
              <span>Sorteo Transparente Auditado por ON MÁS Portal Regional</span>
            </div>
          </div>

          {/* Grilla de Premios del Mes (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#0047BA] flex items-center gap-2 border-b border-slate-100 pb-3">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Premios del Sorteo Mensual</span>
            </h3>

            <div className="space-y-3 text-xs">
              {prizesList.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border ${
                    idx === 0
                      ? 'bg-amber-50/70 border-amber-300 text-amber-950 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span
                    className={`font-black uppercase block mb-1 text-[11px] ${
                      idx === 0 ? 'text-amber-700' : 'text-[#0047BA]'
                    }`}
                  >
                    {idx === 0 ? '🏆 1º Premio Principal' : idx === 1 ? '🥇 2º Premio' : '🥈 3º Premio'}
                  </span>
                  <p className="leading-relaxed">{p}</p>
                </div>
              ))}
            </div>

            <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-2xl text-[11px] font-medium text-slate-700 space-y-1">
              <span className="font-extrabold text-[#0047BA] flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#00ADB5]" />
                ¿Cómo se entregan los premios?
              </span>
              <p>
                Una vez realizado el sorteo el día <strong>{drawDate}</strong>, los ganadores serán contactados vía WhatsApp para coordinar la entrega o voucher digital.
              </p>
            </div>
          </div>

        </div>
      </main>
    </DynamicLayoutWrapper>
  );
}
