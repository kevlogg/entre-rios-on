'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight, 
  Store, 
  Zap, 
  ShieldCheck, 
  Smartphone, 
  MousePointerClick,
  Send
} from 'lucide-react';
import { createWebRequestAction } from '@/server/actions/superadmin';

export default function MiSitioWebPage() {
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [desiredDomain, setDesiredDomain] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !contactName || !phone || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await createWebRequestAction({
        businessName,
        contactName,
        phoneWhatsApp: phone,
        email,
        desiredDomain: desiredDomain || `${businessName.toLowerCase().replace(/\s+/g, '')}.com.ar`,
        notes: notes || 'Solicitud de sitio web propio',
      });

      if (res && !res.success) {
        alert(`Atención: ${res.message}`);
      }
    } catch (e) {
      console.warn('Error guardando solicitud web:', e);
    } finally {
      setIsSubmitting(false);
    }

    setIsSubmitted(true);

    // Also open WhatsApp prefilled
    const waMsg = `Hola equipo ON MÁS! Solicito la creación de Mi Sitio Web Propio para mi comercio "${businessName}". Contacto: ${contactName} (${phone}). Dominio deseado: ${desiredDomain || 'A definir'}.`;
    window.open(`https://wa.me/5493434567890?text=${encodeURIComponent(waMsg)}`, '_blank');
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 w-full">
        {/* Hero Banner Section */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] text-white p-8 sm:p-14 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full">
              <Globe className="w-4 h-4 text-[#00E5E8]" />
              <span>Solución Digital B2B • ON MÁS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Creá Tu Propio Sitio Web Profesiónal
            </h1>

            <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
              Tené tu propia página web con tu nombre de dominio (.com o .com.ar), catálogo de productos integrado y recepción de pedidos directa a tu WhatsApp sin pagar comisiones.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#solicitar-sitio"
                className="bg-gradient-to-r from-[#00E5E8] to-[#00ADB5] hover:from-[#00ADB5] hover:to-[#007C8A] text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl transition-transform active:scale-95 inline-flex items-center gap-2"
              >
                <span>Solicitar Mi Sitio Web Ahora</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0047BA]">
              ¿Qué incluye tu Sitio Web Propio en ON MÁS?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Todo lo que tu comercio necesita para vender por internet con tu propia marca.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-[#00ADB5] flex items-center justify-center font-black">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Dominio Propio Exclusivo</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Tu marca tendrá su propia dirección web profesional (ej. <code>tumarca.com.ar</code>) registrada a tu nombre.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#25D366] flex items-center justify-center font-black">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Ventas Directas a WhatsApp</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Tus clientes seleccionan productos en tu catálogo y te envían el pedido listo a tu WhatsApp sin pagar comisión por venta.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Diseño Móvil Ultra Rápido</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Optimizado para teléfonos celulares y computadoras con excelente velocidad de carga y posicionamiento SEO.
              </p>
            </div>
          </div>
        </section>

        {/* Formulario de Solicitud de Sitio Web */}
        <section id="solicitar-sitio" className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl space-y-6">
          <div className="border-b border-slate-200 pb-4 space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00ADB5]" />
              Formulario de Solicitud
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Pedí el desarrollo de Mi Sitio Web Propio
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Completá los datos y nuestro equipo técnico se comunicará con vos para coordinar el diseño de tu página.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-8 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-emerald-900">¡Solicitud Enviada con Éxito!</h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto font-medium">
                Tu pedido fue registrado en el panel SuperAdmin de ON MÁS y se abrió la conversación oficial por WhatsApp para asistirte.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-[#0047BA] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md"
              >
                Enviar otra consulta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Nombre del Comercio o Marca *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Bodega La Candelaria"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Nombre del Titular / Contacto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carlos Gómez"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Teléfono WhatsApp de Contacto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 3434567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="ejemplo@comercio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700">Nombre de Dominio Deseado (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej. labodegacandelaria.com.ar"
                  value={desiredDomain}
                  onChange={(e) => setDesiredDomain(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700">Notas o Detalles del Proyecto</label>
                <textarea
                  rows={3}
                  placeholder="Contanos qué productos vendés o qué características querés que tenga tu página web..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00ADB5] via-[#0047BA] to-[#002878] hover:from-[#00E5E8] hover:to-[#0047BA] text-white py-4 rounded-2xl font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Solicitud de Mi Sitio Web Propio</span>
                </button>
              </div>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
