'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  MessageCircle, 
  ShieldCheck, 
  Gift, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export type AdminTab = 'dashboard' | 'catalog' | 'profile' | 'subscription';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  productCount: number;
}

export function AdminSidebar({ activeTab, onTabChange, productCount }: AdminSidebarProps) {
  const menuItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Resumen & Métricas', icon: LayoutDashboard },
    { id: 'catalog', label: 'Mi Catálogo', icon: ShoppingBag, badge: `${productCount}` },
    { id: 'profile', label: 'Perfil del Negocio', icon: Store },
    { id: 'subscription', label: 'Suscripción', icon: ShieldCheck, badge: '3 Planes' },
  ];

  return (
    <aside className="w-full md:w-64 bg-white rounded-3xl border border-slate-200/80 p-4 space-y-6 shadow-xs h-fit shrink-0">
      <div className="px-3 pt-2 space-y-1 border-b border-slate-100 pb-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#00ADB5] flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>PANEL COMERCIAL B2B</span>
        </span>
        <h2 className="text-lg font-black text-[#0047BA] leading-tight">
          Gestión del Negocio
        </h2>
      </div>

      <nav className="space-y-1.5">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-black transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] text-white shadow-md scale-[1.02]'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-[#0047BA]'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-4.5 h-4.5 ${isActive ? 'text-[#00E5E8]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sorteos & Beneficios Banner Card */}
      <div className="bg-gradient-to-br from-cyan-50/80 to-blue-50/80 border border-cyan-200/70 rounded-2xl p-4 space-y-2 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#0047BA]">
          <Gift className="w-4 h-4 text-[#00ADB5]" />
          <span>Sorteos ON MÁS Mensual</span>
        </div>
        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
          Postulá un producto o voucher para salir destacado en los Sorteos ON MÁS de la región.
        </p>
        <button
          onClick={() => onTabChange('catalog')}
          className="text-xs font-black text-[#00ADB5] hover:text-[#007C8A] inline-flex items-center gap-1 pt-1 cursor-pointer transition-colors"
        >
          <span>Destacar Oferta</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
