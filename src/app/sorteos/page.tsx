'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Gift, Sparkles, CheckCircle2, Ticket, ShieldCheck } from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';

export default function SorteosPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', city: 'Paraná' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitted(true);
  };

  return (
    <DynamicLayoutWrapper>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-[#00a859] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <span className="text-[#004b87]">Sorteos ON</span>
        </div>

        {/* Hero Sorteos Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#004b87] to-[#00a859] text-white p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit shadow-md">
              <Gift className="w-4 h-4" />
              Sorteo Mensual de Septiembre 2026
            </span>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight">
              ¡Ganate una Estancia Termal de Fin de Semana en Federación!
            </h1>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              Participá gratis completando tus datos. Incluye 2 noches para 2 personas, pases libres a las piletas termales y cena de bienvenida litoraleña.
            </p>
          </div>
        </div>

        {/* Form and Prizes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Form Card (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-extrabold text-[#004b87] flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#00a859]" />
                <span>Formulario de Inscripción Gratuita</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Válido para residentes y visitantes de toda la provincia de Entre Ríos.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in fade-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-[#00a859] mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">¡Ya estás participando!</h3>
                <p className="text-xs text-slate-600 font-medium">
                  Registramos a <strong>{formData.name}</strong> ({formData.city}) para el sorteo del 30 de Septiembre de 2026. Te contactaremos vía WhatsApp si sos el ganador.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-bold text-[#004b87] underline pt-2"
                >
                  Registrar otro participante
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Martín Benítez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#00a859]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 343 4567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#00a859]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad / Localidad</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#00a859]"
                  >
                    <option value="Paraná">Paraná</option>
                    <option value="Concordia">Concordia</option>
                    <option value="Colón">Colón</option>
                    <option value="Gualeguaychú">Gualeguaychú</option>
                    <option value="Concepción del Uruguay">Concepción del Uruguay</option>
                    <option value="Federación">Federación</option>
                    <option value="Villa Elisa">Villa Elisa</option>
                    <option value="Chajarí">Chajarí</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#00a859] hover:bg-[#008746] text-white py-3.5 rounded-2xl font-extrabold text-sm shadow-md transition-transform active:scale-98"
                >
                  Quiero Participar del Sorteo
                </button>
              </form>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-2">
              <ShieldCheck className="w-4 h-4 text-[#00a859]" />
              <span>Sorteo Auditado por Entre Ríos ON Portal</span>
            </div>
          </div>

          {/* Prize Details Card (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#004b87] flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Premios del Mes</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-extrabold text-[#00a859] block">1º Premio</span>
                <p className="font-bold text-slate-800">Estancia Termal 3D/2N en Federación para 2 Personas.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-extrabold text-[#004b87] block">2º Premio</span>
                <p className="font-bold text-slate-800">Caja Canasta de Sabores Litoraleños & Vinos Tannat.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-extrabold text-[#00a859] block">3º Premio</span>
                <p className="font-bold text-slate-800">Voucher de $100.000 ARS para compras en el catálogo.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </DynamicLayoutWrapper>
  );
}
