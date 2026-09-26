'use client';

import React from 'react';
import { MessageCircle, Eye, ShoppingBag, ShieldCheck } from 'lucide-react';

interface KpiCardsRowProps {
  productCount: number;
  whatsappClicksCount?: number;
  profileViewsCount?: number;
}

export function KpiCardsRow({
  productCount,
  whatsappClicksCount = 0,
  profileViewsCount = 0,
}: KpiCardsRowProps) {
  const kpis = [
    {
      title: 'Consultas a WhatsApp',
      value: whatsappClicksCount.toLocaleString('es-AR'),
      icon: MessageCircle,
      gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      borderColor: 'border-emerald-200/80 hover:border-emerald-400',
      iconContainerBg: 'bg-emerald-500 text-white shadow-emerald-500/30',
      accentBar: 'bg-emerald-500',
    },
    {
      title: 'Visualizaciones de Perfil',
      value: profileViewsCount.toLocaleString('es-AR'),
      icon: Eye,
      gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
      borderColor: 'border-cyan-200/80 hover:border-[#00ADB5]',
      iconContainerBg: 'bg-gradient-to-tr from-[#0047BA] to-[#00ADB5] text-white shadow-cyan-500/30',
      accentBar: 'bg-[#00ADB5]',
    },
    {
      title: 'Productos en Catálogo',
      value: productCount.toLocaleString('es-AR'),
      icon: ShoppingBag,
      gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
      borderColor: 'border-purple-200/80 hover:border-purple-400',
      iconContainerBg: 'bg-purple-600 text-white shadow-purple-500/30',
      accentBar: 'bg-purple-500',
    },
    {
      title: 'Estado del Perfil',
      value: 'Verificado',
      icon: ShieldCheck,
      gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
      borderColor: 'border-amber-200/80 hover:border-amber-400',
      iconContainerBg: 'bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-amber-500/30',
      accentBar: 'bg-amber-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {kpis.map((kpi, idx) => {
        const IconComponent = kpi.icon;
        return (
          <div
            key={idx}
            className={`relative group bg-white rounded-3xl p-5 sm:p-6 border ${kpi.borderColor} shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between overflow-hidden`}
          >
            {/* Top Accent Color Line */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${kpi.accentBar} opacity-80 group-hover:opacity-100 transition-opacity`} />

            {/* Background Soft Radial Glow */}
            <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br ${kpi.gradient} blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />

            <div className="relative z-10 space-y-4">
              {/* Header: Title & Icon Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 group-hover:text-slate-700 transition-colors">
                  {kpi.title}
                </span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 duration-200 ${kpi.iconContainerBg}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>

              {/* Main Metric Value */}
              <div className="pt-1 pb-1">
                <span className={`font-black tracking-tight leading-none block ${
                  kpi.value === 'Verificado' ? 'text-2xl sm:text-3xl text-[#0047BA]' : 'text-3xl sm:text-5xl text-slate-900'
                }`}>
                  {kpi.value}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


