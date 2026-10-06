import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ClientHeader } from '@/components/layout/ClientHeader';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { HelpCircle, Sparkles, ArrowLeft, MessageCircle, ShieldCheck, Store, UserCheck, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Centro de Ayuda & Preguntas Frecuentes | ON MÁS Portal',
  description: 'Guías, tutoriales y soporte para comercios, prestadores turísticos y usuarios del portal regional ON MÁS.',
};

const FAQS = [
  {
    q: '¿Cómo puedo publicar mi comercio o negocio gratis?',
    a: 'Podés registrarte creando una cuenta en el portal con el Plan Gratis, que te permite crear tu perfil completo de comercio y publicar 1 producto o servicio sin costo.',
  },
  {
    q: '¿Cómo se realizan las ventas y contactos?',
    a: 'Las consultas y pedidos van directamente al número de WhatsApp oficial de tu comercio. ON MÁS no cobra comisiones por venta ni interviene en las transacciones.',
  },
  {
    q: '¿Qué beneficios tienen los planes abonados?',
    a: 'Los planes Bronce, Plata u Oro te permiten ampliar tu catálogo (hasta 5, 20 o ilimitados productos), obtener insignias de verificación, destacarte en la portada y acceder a métricas en tiempo real.',
  },
  {
    q: '¿Cómo funciona la PWA (App Instalable)?',
    a: 'Podés instalar ON MÁS en la pantalla de inicio de tu celular (Android o iPhone) directamente desde el navegador, sin necesidad de descargarla de una tienda de aplicaciones.',
  },
];

export default function AyudaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-page-gradient">
      <ClientHeader />

      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl w-fit flex items-center gap-2 text-xs font-extrabold text-white shadow-xs">
          <Link href="/" className="hover:text-cyan-300 text-slate-100 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-cyan-300 font-black">Ayuda</span>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full">
              <HelpCircle className="w-4 h-4 text-[#00E5E8]" />
              <span>Soporte & Preguntas Frecuentes • ON MÁS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Centro de Ayuda & Asistencia
            </h1>

            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              Encontrá respuestas rápidas a tus dudas sobre el funcionamiento del portal, creación de perfil, planes comerciales y la aplicación instalable PWA.
            </p>
          </div>
        </div>

        {/* FAQ Grid Container */}
        <div className="bg-[#e9ecef] rounded-3xl p-6 sm:p-8 border border-slate-300/70 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-300/70 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0047BA]" />
              <span>Preguntas Frecuentes</span>
            </h2>
            <span className="text-xs font-bold text-slate-500">Soporte oficial</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
                <h3 className="text-base font-black text-slate-900 flex items-start gap-2.5">
                  <FileText className="w-5 h-5 text-[#00ADB5] shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Support CTA */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-lg font-black text-slate-900">¿Tenés alguna otra duda o consulta comercial?</h4>
              <p className="text-xs text-slate-600 font-medium">Nuestro equipo de soporte comercial te asesora sin compromiso.</p>
            </div>
            <a
              href="https://wa.me/5493410000000?text=Hola!%20Tengo%20una%20consulta%20sobre%20el%20portal%20ON%20M%C3%81S"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contactar por WhatsApp</span>
            </a>
          </div>
        </div>
      </main>

      <ClientFooter />
    </div>
  );
}
