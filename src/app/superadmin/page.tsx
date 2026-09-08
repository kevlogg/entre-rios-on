import React from 'react';
import { getAllCommerces, getUpcomingEvents, getCities } from '@/lib/dal/portal';
import { SuperAdminHeader } from '@/components/superadmin/SuperAdminHeader';
import { CommerceApprovalTable } from '@/components/superadmin/CommerceApprovalTable';
import { NewsManager } from '@/components/superadmin/NewsManager';
import { RafflesManager } from '@/components/superadmin/RafflesManager';
import { Crown, Store, MessageCircle, Users, MapPin, Eye, ShieldCheck, Newspaper, Gift, Sparkles } from 'lucide-react';

export const revalidate = 60;

export default async function SuperAdminPage() {
  const [commerces, events, cities] = await Promise.all([
    getAllCommerces(),
    getUpcomingEvents(),
    getCities(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Top Navbar */}
      <SuperAdminHeader />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        
        {/* Provincial Hero Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-[#004b87] to-[#00a859] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              <Crown className="w-4 h-4 text-amber-400 fill-current" />
              <span>Centro de Control Provincial • Cliente Directo</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Entre Ríos ON: Gestión Provincial General
            </h1>

            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              Administrá los comercios adheridos de los 17 departamentos, aprobá verificaciones B2B, publicá noticias regionales y ejecutá los Sorteos ON.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-2 text-center shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
              Red Comercial Activa
            </span>
            <p className="text-3xl font-black text-white">1.128</p>
            <p className="text-xs text-slate-200 font-bold">Comercios en Entre Ríos</p>
          </div>
        </div>

        {/* Global Provincial KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase flex items-center gap-1">
              <Store className="w-4 h-4 text-[#004b87]" />
              <span>Comercios Totales</span>
            </span>
            <p className="text-3xl font-black text-[#004b87]">{commerces.length + 1124}</p>
            <p className="text-xs text-slate-500 font-semibold">Paraná, Colón, Concordia, etc.</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-[#00a859]" />
              <span>Leads WhatsApp Provincia</span>
            </span>
            <p className="text-3xl font-black text-[#00a859]">14.890</p>
            <p className="text-xs text-emerald-700 font-bold">+32% este mes</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase flex items-center gap-1">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Tráfico Provincial</span>
            </span>
            <p className="text-3xl font-black text-slate-900">184.500</p>
            <p className="text-xs text-slate-500 font-semibold">Visitas mensuales en portal</p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase flex items-center gap-1">
              <Users className="w-4 h-4 text-amber-500" />
              <span>Sorteos Participantes</span>
            </span>
            <p className="text-3xl font-black text-amber-600">3.420</p>
            <p className="text-xs text-slate-500 font-semibold">Inscriptos en Sorteos ON</p>
          </div>
        </div>

        {/* Section 1: Merchant Approval Table */}
        <section className="space-y-4">
          <CommerceApprovalTable commerces={commerces} />
        </section>

        {/* Section 2: News & Editorial Manager */}
        <section className="space-y-4">
          <NewsManager events={events} />
        </section>

        {/* Section 3: Sorteos ON Winner Draw Tool */}
        <section className="space-y-4">
          <RafflesManager />
        </section>

      </main>
    </div>
  );
}
