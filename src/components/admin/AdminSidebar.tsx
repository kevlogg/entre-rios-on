'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  MessageCircle, 
  ShieldCheck, 
  Gift, 
  TrendingUp,
  Settings
} from 'lucide-react';

export type AdminTab = 'dashboard' | 'catalog' | 'profile' | 'whatsapp' | 'subscription';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  productCount: number;
}

export function AdminSidebar({ activeTab, onTabChange, productCount }: AdminSidebarProps) {
  const menuItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Resumen & Métricas', icon: LayoutDashboard },
    { id: 'catalog', label: 'Mi Catálogo de Productos', icon: ShoppingBag, badge: `${productCount}` },
    { id: 'profile', label: 'Perfil del Negocio', icon: Store },
    { id: 'whatsapp', label: 'WhatsApp & Pedidos', icon: MessageCircle, badge: 'Directo' },
    { id: 'subscription', label: 'Suscripción & Plan B2B', icon: ShieldCheck, badge: 'Pionero' },
  ];

  return (
    <aside className="w-full md:w-64 bg-white rounded-3xl border border-slate-200 p-4 space-y-6 shadow-xs h-fit shrink-0">
      <div className="px-2 pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">
          Panel Comercial B2B
        </span>
        <h2 className="text-base font-black text-[#004b87] leading-tight mt-0.5">
          Gestión del Comercio
        </h2>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#004b87] text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-[#004b87]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#00a859]' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${
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
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
          <Gift className="w-4 h-4 text-[#00a859]" />
          <span>Sorteos ON Mensual</span>
        </div>
        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
          Postulá un producto o voucher para salir destacado en los Sorteos ON de la provincia.
        </p>
        <button
          onClick={() => onTabChange('catalog')}
          className="text-xs font-bold text-[#00a859] hover:underline block pt-1"
        >
          Destacar un Producto →
        </button>
      </div>
    </aside>
  );
}
