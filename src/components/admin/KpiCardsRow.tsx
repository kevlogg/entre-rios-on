'use client';

import React from 'react';
import { MessageCircle, Eye, ShoppingBag, ShieldCheck, TrendingUp, ArrowUpRight } from 'lucide-react';

interface KpiCardsRowProps {
  productCount: number;
}

export function KpiCardsRow({ productCount }: KpiCardsRowProps) {
  const kpis = [
    {
      title: 'Consultas a WhatsApp',
      value: '142',
      change: '+18% este mes',
      isPositive: true,
      icon: MessageCircle,
      iconBg: 'bg-emerald-100 text-[#00a859]',
      description: 'Clicks directos a tu chat comercial',
    },
    {
      title: 'Visualizaciones de Perfil',
      value: '1.280',
      change: '+24% este mes',
      isPositive: true,
      icon: Eye,
      iconBg: 'bg-blue-100 text-[#004b87]',
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
      iconBg: 'bg-emerald-500 text-white',
      description: 'Plan Pionero Entre Ríos ON',
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
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {kpi.change}
              </span>
              <span className="text-slate-400 text-[10px]">Actualizado hoy</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
