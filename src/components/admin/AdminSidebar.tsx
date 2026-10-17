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
  ChevronRight,
  Globe,
  User,
  Palmtree
} from 'lucide-react';

export type AdminTab = 'dashboard' | 'catalog' | 'profile' | 'subscription' | 'website';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  productCount: number;
  userType?: 'particular' | 'comercio' | 'turismo' | string;
}

export function AdminSidebar({ activeTab, onTabChange, productCount, userType = 'comercio' }: AdminSidebarProps) {
  const isParticular = userType === 'particular';
  const isTurismo = userType === 'turismo';

  const menuItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = isParticular
    ? [
        { id: 'dashboard', label: 'Mi Cuenta Vecino', icon: User },
        { id: 'catalog', label: 'Mi Catálogo', icon: ShoppingBag, badge: 'Requiere Plan' },
        { id: 'profile', label: 'Mis Datos', icon: Store },
        { id: 'website', label: 'Mi Sitio Web', icon: Globe, badge: 'Exclusivo' },
        { id: 'subscription', label: 'Planes de Negocio', icon: ShieldCheck, badge: '¡Activá tu Comercio!' },
      ]
    : isTurismo
    ? [
        { id: 'dashboard', label: 'Resumen & Consultas', icon: LayoutDashboard },
        { id: 'catalog', label: 'Servicios / Cabañas', icon: Palmtree, badge: `${productCount}` },
        { id: 'profile', label: 'Perfil del Complejo', icon: Store },
        { id: 'website', label: 'Mi Sitio Web', icon: Globe, badge: 'Exclusivo' },
        { id: 'subscription', label: 'Planes de Turismo', icon: ShieldCheck, badge: '3 Planes' },
      ]
    : [
        { id: 'dashboard', label: 'Resumen & Métricas', icon: LayoutDashboard },
        { id: 'catalog', label: 'Mi Catálogo', icon: ShoppingBag, badge: `${productCount}` },
        { id: 'profile', label: 'Perfil del Negocio', icon: Store },
        { id: 'website', label: 'Mi Sitio Web', icon: Globe, badge: 'Exclusivo' },
        { id: 'subscription', label: 'Suscripción', icon: ShieldCheck, badge: '3 Planes' },
      ];

  const panelTag = isParticular
    ? 'CUENTA VECINO'
    : isTurismo
    ? 'TURISMO & ALOJAMIENTOS'
    : 'PANEL COMERCIAL B2B';

  const panelTitle = isParticular
    ? 'Mi Espacio Vecino'
    : isTurismo
    ? 'Gestión Turística'
    : 'Gestión del Negocio';

  return (
    <aside className="w-full md:w-64 bg-white rounded-3xl border border-slate-200/80 p-4 space-y-6 shadow-xs h-fit shrink-0">
      <div className="px-3 pt-2 space-y-1 border-b border-slate-100 pb-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#00ADB5] flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>{panelTag}</span>
        </span>
        <h2 className="text-lg font-black text-[#0047BA] leading-tight">
          {panelTitle}
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
          {isParticular
            ? 'Participá en sorteos exclusivos de productos regionales, viajes y escapadas termales.'
            : isTurismo
            ? 'Postulá una estadía o voucher de relax para salir en el sorteo provincial y atraer viajeros.'
            : 'Postulá un producto o voucher para salir destacado en los Sorteos ON MÁS de la región.'}
        </p>
        <button
          onClick={() => onTabChange(isParticular ? 'subscription' : 'catalog')}
          className="text-xs font-black text-[#00ADB5] hover:text-[#007C8A] inline-flex items-center gap-1 pt-1 cursor-pointer transition-colors"
        >
          <span>{isParticular ? 'Ver Planes de Negocio' : 'Destacar Oferta'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
