'use client';

import React from 'react';
import { MessageCircle, Eye, ShoppingBag, ShieldCheck, ArrowUpRight } from 'lucide-react';

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
      value: `${whatsappClicksCount}`,
      change: whatsappClicksCount > 0 ? `+${whatsappClicksCount} este mes` : 'Sin consultas aún',
      isPositive: whatsappClicksCount > 0,
      icon: MessageCircle,
      iconBg: 'bg-cyan-100 text-[#00ADB5]',
      description: 'Clicks directos a tu chat comercial',
    },
    {
      title: 'Visualizaciones de Perfil',
      value: `${profileViewsCount}`,
      change: profileViewsCount > 0 ? `+${profileViewsCount} este mes` : 'Nuevo en el portal',
      isPositive: profileViewsCount > 0,
      icon: Eye,
      iconBg: 'bg-blue-100 text-[#0047BA]',
      description: 'Visitas a la ficha del negocio',
    },
    {
      title: 'Productos Exhibidos',
      value: `${productCount}`,
      change: 'Activos en catálogo',
      isPositive: true,
      icon: ShoppingBag,
      iconBg: 'bg-amber-100 text-amber-600',
      description: 'Catálogo con compra por WhatsApp',
    },
    {
      title: 'Estado de Cuenta',
      value: '100% Verificado',
      change: 'Sin Comisiones 0%',
      isPositive: true,
      icon: ShieldCheck,
      iconBg: 'bg-[#00ADB5] text-white',
      description: 'Plan Socio ON MÁS',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const IconComponent = kpi.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                {kpi.title}
              </span>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold ${kpi.iconBg}`}>
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
                {kpi.value}
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                {kpi.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
              <span className={`px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                kpi.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100'
              }`}>
                {kpi.isPositive && <ArrowUpRight className="w-3 h-3" />}
                {kpi.change}
              </span>
              <span className="text-slate-400 text-[10px]">En tiempo real</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
