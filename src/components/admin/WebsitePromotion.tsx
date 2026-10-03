'use client';

import React from 'react';
import { 
  Globe, 
  Sparkles, 
  Rocket, 
  ShoppingBag, 
  MessageCircle, 
  Search, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  ExternalLink,
  Crown,
  Laptop
} from 'lucide-react';
import { Commerce } from '@/types';

interface WebsitePromotionProps {
  commerce: Commerce;
}

export function WebsitePromotion({ commerce }: WebsitePromotionProps) {
  const whatsappSupportNumber = '5493434001122';
  const customMessage = encodeURIComponent(
    `Hola! Soy titular de "${commerce.name}" (${commerce.cityName}) en el portal ON MÁS y me gustaría recibir asesoramiento e información para crear mi propio Sitio Web Oficial.`
  );
  const whatsappUrl = `https://wa.me/${whatsappSupportNumber}?text=${customMessage}`;

  const benefits = [
    {
      icon: Globe,
      color: 'text-[#00ADB5]',
      bg: 'bg-cyan-50 border-cyan-200',
      title: 'Dominio Propio y Marca Exclusiva',
      description: 'Tené tu dirección web única (ej: tumarca.com.ar o tumarca.onmas.com.ar) para proyectar máxima solidez y confianza profesional.',
    },
    {
      icon: Smartphone,
      color: 'text-[#0047BA]',
      bg: 'bg-blue-50 border-blue-200',
      title: 'Diseño Ultra Rápido & Mobile First',
      description: 'Optimizada al 100% para teléfonos móviles. Carga en menos de 1 segundo sin demoras ni publicidad molesta de terceros.',
    },
    {
      icon: ShoppingBag,
      color: 'text-[#00ADB5]',
      bg: 'bg-emerald-50 border-emerald-200',
      title: 'Catálogo Sincronizado en Tiempo Real',
      description: 'Los productos y promociones que cargas en tu panel ON MÁS se reflejan automáticamente en tu sitio web privado sin doble trabajo.',
    },
    {
      icon: MessageCircle,
      color: 'text-[#0047BA]',
      bg: 'bg-cyan-50 border-cyan-200',
      title: 'Ventas a WhatsApp (0% Comisión)',
      description: 'Tus clientes arman el carrito en tu web y te envían el pedido estructurado directamente a tu WhatsApp. Sin comisiones por venta.',
    },
    {
      icon: Search,
      color: 'text-[#00ADB5]',
      bg: 'bg-purple-50 border-purple-200',
      title: 'Posicionamiento SEO en Google',
      description: 'Aparecé en las primeras posiciones de Google cuando usuarios busquen tus productos o servicios en tu ciudad y provincia.',
    },
    {
      icon: ShieldCheck,
      color: 'text-[#0047BA]',
      bg: 'bg-slate-50 border-slate-200',
      title: 'Hosting Cloud, SSL y Mantenimiento',
      description: 'Servidores cloud de alta velocidad, certificado de seguridad HTTPS y soporte continuo incluido. Te olvidás de problemas técnicos.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="absolute -right-12 -bottom-12 opacity-15 pointer-events-none">
          <Globe className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase">
            <Crown className="w-4 h-4 text-amber-300" />
            <span>SOLUCIÓN DIGITAL EXCLUSIVA ON MÁS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            Llevá tu comercio al siguiente nivel con tu <span className="text-[#00E5E8] underline decoration-[#00E5E8]/40">Propio Sitio Web</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
            Te desarrollamos una plataforma web propia e independiente para <strong>{commerce.name}</strong>, conectada con el ecosistema regional ON MÁS pero con tu marca, colores y dominio exclusivo.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-slate-100 text-[#0047BA] px-6 py-3.5 rounded-2xl font-black text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#00a859]" />
              <span>Solicitar Cotización a WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Grid de Beneficios Clave */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#00ADB5] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VENTAJAS COMPETITIVAS</span>
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">
              ¿Por qué tener tu propio sitio web con ON MÁS?
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-white border rounded-3xl p-6 space-y-3 shadow-xs hover:shadow-md transition-shadow ${item.bg}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0">
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h4 className="text-base font-black text-slate-900 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Mockup Preview Card */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#00E5E8] flex items-center gap-1">
              <Laptop className="w-3.5 h-3.5" />
              <span>VISTA PREVIA DE TU WEB INDEPENDIENTE</span>
            </span>
            <h4 className="text-lg font-black text-white">
              Así lucirá la presencia oficial de {commerce.name}
            </h4>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 flex items-center gap-2 text-xs text-slate-300 font-mono">
            <Globe className="w-3.5 h-3.5 text-[#00ADB5]" />
            <span>https://{commerce.slug || 'tumarca'}.com.ar</span>
          </div>
        </div>

        {/* Browser Mockup Window */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Browser Header Bar */}
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <div className="ml-4 flex-1 bg-slate-950 rounded-lg px-3 py-1 text-[11px] font-mono text-slate-400 border border-slate-800 flex items-center gap-2 truncate">
              <span className="text-emerald-400">🔒 https://</span>
              <span className="text-white font-bold">{commerce.slug || 'tumarca'}.com.ar</span>
            </div>
          </div>

          {/* Browser Body Mockup Content */}
          <div className="p-6 bg-slate-900 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#002878] to-[#0047BA] p-5 rounded-2xl text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 overflow-hidden shrink-0 flex items-center justify-center font-black text-xl text-[#00E5E8]">
                  {commerce.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-black text-base">{commerce.name}</h5>
                  <p className="text-xs text-cyan-200">{commerce.cityName} • Tienda Oficial</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-xl font-black text-xs">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Directo</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-800 border border-slate-700/60 rounded-xl p-3 space-y-2">
                  <div className="w-full h-20 bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-500 text-xs">
                    Producto {i}
                  </div>
                  <div className="h-3 bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-[#00ADB5]/40 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 border-2 border-[#00ADB5] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-xl font-black text-slate-900">
            ¿Querés cotizar el Sitio Web de {commerce.name}?
          </h4>
          <p className="text-xs text-slate-600 font-semibold">
            Te asesoramos sin compromiso. Planes accesibles con puesta en marcha en menos de 48 horas.
          </p>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#0047BA] hover:bg-[#002878] text-white px-6 py-3.5 rounded-2xl font-black text-xs shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-[#00E5E8]" />
          <span>Hablar con un Asesor por WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
