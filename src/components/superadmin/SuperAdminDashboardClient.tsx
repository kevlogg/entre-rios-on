'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Commerce, CommunityEvent, City } from '@/types';
import { isSuperAdminAuthenticated, grantSuperAdminAccess, ALLOWED_SUPERADMIN_EMAILS } from '@/lib/security/superadmin-auth';
import { createClient } from '@/lib/supabase/client';
import { CommerceApprovalTable } from '@/components/superadmin/CommerceApprovalTable';
import { NewsManager } from '@/components/superadmin/NewsManager';
import { RafflesManager } from '@/components/superadmin/RafflesManager';
import { GeoCustomizerManager } from '@/components/superadmin/GeoCustomizerManager';
import { CashPaymentsManager } from '@/components/superadmin/CashPaymentsManager';
import { JobsManager } from '@/components/superadmin/JobsManager';
import { TourismManager } from '@/components/superadmin/TourismManager';
import { WebRequestsManager } from '@/components/superadmin/WebRequestsManager';
import { KevDevPlanManager } from '@/components/superadmin/KevDevPlanManager';
import { QrGeneratorManager } from '@/components/superadmin/QrGeneratorManager';
import { PlansManager } from '@/components/superadmin/PlansManager';
import { 
  Store, 
  MapPin, 
  Gift, 
  Briefcase, 
  Newspaper, 
  Compass, 
  Globe, 
  Crown,
  CreditCard,
  Sparkles,
  ShieldCheck,
  Code2,
  QrCode,
  DollarSign
} from 'lucide-react';

interface SuperAdminDashboardClientProps {
  initialCommerces: Commerce[];
  initialEvents: CommunityEvent[];
  initialCities: City[];
}

export function SuperAdminDashboardClient({
  initialCommerces,
  initialEvents,
  initialCities,
}: SuperAdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    'geo-customizer' | 'commerces' | 'tourism' | 'cash-payments' | 'subscription-plans' | 'raffles' | 'jobs' | 'news' | 'web-requests' | 'qr-generator' | 'plan-kevdev'
  >('geo-customizer');
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    async function verifySuperAdminAuth() {
      if (isSuperAdminAuthenticated()) {
        setIsAuthChecked(true);
        return;
      }

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email && ALLOWED_SUPERADMIN_EMAILS.includes(user.email.trim().toLowerCase())) {
          grantSuperAdminAccess(user.email.trim().toLowerCase());
          setIsAuthChecked(true);
          return;
        }
      } catch (e) {
        console.warn('SuperAdmin dashboard auth check error:', e);
      }

      router.push('/superadmin/login');
    }

    verifySuperAdminAuth();
  }, [router]);

  if (!isAuthChecked) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#00ADB5] border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-slate-500">Verificando sesión SuperAdmin...</p>
      </div>
    );
  }

  interface TabDef {
    id: 'geo-customizer' | 'commerces' | 'tourism' | 'cash-payments' | 'subscription-plans' | 'raffles' | 'jobs' | 'news' | 'web-requests' | 'qr-generator' | 'plan-kevdev';
    label: string;
    icon: React.ElementType;
    badge?: string;
  }

  const tabs: TabDef[] = [
    { id: 'geo-customizer', label: 'Provincias y banners', icon: MapPin },
    { id: 'commerces', label: 'Comercios', icon: Store, badge: `${initialCommerces.length}` },
    { id: 'tourism', label: 'Turismo', icon: Compass },
    { id: 'cash-payments', label: 'Pagos en efectivo', icon: CreditCard, badge: 'Nuevos' },
    { id: 'subscription-plans', label: 'Planes', icon: DollarSign, badge: 'Valores' },
    { id: 'raffles', label: 'Sorteos', icon: Gift },
    { id: 'jobs', label: 'Empleos', icon: Briefcase },
    { id: 'news', label: 'Comunidad', icon: Newspaper },
    { id: 'web-requests', label: 'Mi sitio web', icon: Globe, badge: 'Nuevos' },
    { id: 'qr-generator', label: 'Generador QR', icon: QrCode, badge: 'HD' },
    { id: 'plan-kevdev', label: 'Plan KevDev', icon: Code2, badge: 'Tramo 1' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner Header */}
      <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Crown className="w-4 h-4 text-amber-400 fill-current" />
            <span>Panel General SuperAdmin • ON MÁS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Administración del Portal Regional
          </h1>

          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
            Gestioná comercios reales, pagos en efectivo, valores de planes, imágenes por provincia, banners publicitarios, sorteos, ofertas laborales, noticias y sitios web solicitados.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-2 text-center shrink-0 min-w-[200px]">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
            Red Comercial Real
          </span>
          <p className="text-3xl font-black text-white">{initialCommerces.length}</p>
          <p className="text-xs text-slate-200 font-bold">Comercios Registrados</p>
        </div>
      </div>

      {/* Main Layout Grid: Sidebar Panel + Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sticky Vertical Sidebar Access Panel */}
        <aside className="lg:col-span-3 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3 sticky top-24">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Menú Principal
            </span>
            <span className="text-[10px] bg-cyan-100 text-[#0047BA] font-extrabold px-2 py-0.5 rounded-full">
              11 Módulos
            </span>
          </div>

          <nav className="space-y-1.5">
            {tabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-extrabold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0047BA] to-[#00ADB5] text-white shadow-md'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-[#0047BA]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-[#00ADB5]'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Tab Content Panel */}
        <main className="lg:col-span-9 space-y-6">
          {activeTab === 'commerces' && (
            <CommerceApprovalTable commerces={initialCommerces} />
          )}

          {activeTab === 'cash-payments' && (
            <CashPaymentsManager />
          )}

          {activeTab === 'subscription-plans' && (
            <PlansManager />
          )}

          {activeTab === 'qr-generator' && (
            <QrGeneratorManager commerces={initialCommerces} />
          )}

          {activeTab === 'geo-customizer' && (
            <GeoCustomizerManager initialCities={initialCities} />
          )}

          {activeTab === 'raffles' && (
            <RafflesManager />
          )}

          {activeTab === 'jobs' && (
            <JobsManager />
          )}

          {activeTab === 'news' && (
            <NewsManager events={initialEvents} />
          )}

          {activeTab === 'tourism' && (
            <TourismManager commerces={initialCommerces} />
          )}

          {activeTab === 'web-requests' && (
            <WebRequestsManager />
          )}

          {activeTab === 'plan-kevdev' && (
            <KevDevPlanManager />
          )}
        </main>

      </div>
    </div>
  );
}
