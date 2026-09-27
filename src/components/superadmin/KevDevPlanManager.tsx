'use client';

import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Receipt, 
  Layers, 
  Sparkles,
  Cpu,
  RefreshCw,
  Award
} from 'lucide-react';

interface PaymentRecord {
  id: string;
  period: string;
  concept: string;
  amount: string;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'waived';
  invoiceRef: string;
}

export function KevDevPlanManager() {
  const [activeTab, setActiveTab] = useState<'status' | 'matrix' | 'payments' | 'tech'>('status');
  const [payments, setPayments] = useState<PaymentRecord[]>([
    {
      id: 'PAY-001',
      period: 'Mes 1 - Lanzamiento',
      concept: 'Setup Inicial Bonificado & Abono Mes 1 (Tramo 1: Semilla)',
      amount: '$49.000 ARS',
      dueDate: '01/09/2026',
      paidDate: '01/09/2026',
      status: 'waived',
      invoiceRef: 'SETUP-BONIF-01'
    },
    {
      id: 'PAY-002',
      period: 'Mes 2 - Septiembre 2026',
      concept: 'Abono Mensual Tramo 1 (Hasta 15 comercios)',
      amount: '$49.000 ARS',
      dueDate: '10/09/2026',
      paidDate: '05/09/2026',
      status: 'paid',
      invoiceRef: 'INV-2026-009'
    },
    {
      id: 'PAY-003',
      period: 'Mes 3 - Octubre 2026',
      concept: 'Abono Mensual Tramo 1 (Hasta 15 comercios)',
      amount: '$49.000 ARS',
      dueDate: '10/10/2026',
      status: 'pending',
      invoiceRef: 'INV-2026-010'
    }
  ]);
  const [isSynced, setIsSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('AL_DIA');

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/superadmin/billing/payments', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.payments && Array.isArray(data.payments)) {
          setPayments(data.payments);
          setIsSynced(Boolean(data.synced));
          if (data.estadoPago) setPaymentStatus(data.estadoPago);
        }
      }
    } catch (err) {
      console.warn('[KevDevPlanManager] Error cargando pagos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const tramos = [
    {
      id: 1,
      name: 'Tramo 1: Semilla',
      capacity: 'Hasta 15 comercios',
      recaudacion: '$300.000 ARS / mes',
      margen: '84%',
      abono: '$49.000 ARS / mes',
      setup: '$49.000 ARS (Bonificado)',
      licenciaPerpetua: '$420.000 ARS',
      renovacionAnual: '$120.000 ARS / año',
      isCurrent: true,
    },
    {
      id: 2,
      name: 'Tramo 2: Crecimiento',
      capacity: '16 a 40 comercios',
      recaudacion: '$800.000 ARS / mes',
      margen: '89%',
      abono: '$85.000 ARS / mes',
      licenciaPerpetua: '+$260.000 ARS (Acum. $680k)',
      renovacionAnual: '$190.000 ARS / año',
      isCurrent: false,
    },
    {
      id: 3,
      name: 'Tramo 3: Expansión',
      capacity: '41 a 80 comercios',
      recaudacion: '$1.600.000 ARS / mes',
      margen: '91%',
      abono: '$140.000 ARS / mes (Tope Abono)',
      licenciaPerpetua: '+$380.000 ARS (Acum. $1.060k)',
      renovacionAnual: '$280.000 ARS / año',
      isCurrent: false,
    },
    {
      id: 4,
      name: 'Tramo 4: Escala Regional',
      capacity: '81 a 200 comercios',
      recaudacion: '$4.000.000 ARS / mes',
      margen: 'Facturación Masiva',
      abono: 'Exclusivo Licencia Perpetua',
      licenciaPerpetua: '+$650.000 ARS (Acum. $1.710k)',
      renovacionAnual: '$450.000 ARS / año',
      isCurrent: false,
    },
    {
      id: 5,
      name: 'Tramo 5: Consolidación',
      capacity: '201 a 500 comercios',
      recaudacion: '$10.000.000 ARS / mes',
      margen: 'Líder Regional',
      abono: 'Exclusivo Licencia Perpetua',
      licenciaPerpetua: '+$1.250.000 ARS (Acum. $2.960k)',
      renovacionAnual: '$850.000 ARS / año',
      isCurrent: false,
    },
    {
      id: 6,
      name: 'Tramo 6: Macro Provincial',
      capacity: '501 a 1.000 comercios',
      recaudacion: '$20.000.000 ARS / mes',
      margen: 'Portal Referente',
      abono: 'Exclusivo Licencia Perpetua',
      licenciaPerpetua: '+$1.950.000 ARS (Acum. $4.910k)',
      renovacionAnual: '$1.600.000 ARS / año',
      isCurrent: false,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-[#002878] to-[#0047BA] rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-[#00ADB5]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-inner">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Desarrollador Oficial • KevDev</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Plan KevDev & Acuerdo Técnico
            </h2>

            <p className="text-slate-200 text-sm sm:text-base font-medium leading-relaxed">
              Gestión transparente del abono mensual, matriz de escalabilidad técnica por cantidad de comercios, soporte SLA y control de pagos sincronizado con Firebase KevDev.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 flex flex-col items-center justify-center text-center space-y-2 shrink-0 min-w-[220px]">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30">
              Plan Activo: Tramo 1
            </span>
            <div className="text-3xl font-black text-white">$49.000 <span className="text-xs font-normal text-slate-300">ARS/mes</span></div>
            <p className="text-xs text-cyan-200 font-extrabold">Modalidad 1: Abono Mensual</p>
          </div>
        </div>

        {/* Sub-Navigation Tabs inside component */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'status'
                ? 'bg-white text-[#002878] shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Estado & Plan Activo</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'bg-white text-[#002878] shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Matriz de Inversión & Tramos</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'payments'
                ? 'bg-white text-[#002878] shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Historial de Pagos</span>
          </button>

          <button
            onClick={() => setActiveTab('tech')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'tech'
                ? 'bg-white text-[#002878] shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Garantías & Infraestructura</span>
          </button>
        </div>
      </div>

      {/* TAB 1: STATUS & ACTIVE PLAN SUMMARY */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Active Tier */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#00ADB5] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-cyan-50 text-[#00ADB5]">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  ACTIVO
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tramo de Capacidad</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Tramo 1: Semilla</h3>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Suscripción actual para inicio ágil con hasta <strong className="text-slate-800">15 comercios</strong> activos.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold">
                <span className="text-slate-500">Capacidad Máxima:</span>
                <span className="text-[#0047BA]">15 Comercios</span>
              </div>
            </div>

            {/* Card 2: Current Fee */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-[#0047BA] transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-[#0047BA]">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-[#0047BA] px-3 py-1 rounded-full">
                  MENSUAL
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Abono Vigente</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">$49.000 ARS <span className="text-xs font-medium text-slate-400">/ mes</span></h3>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Setup inicial bonificado de <strong className="text-slate-800">$49.000 ARS</strong> (cubre mes 1 de operación).
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold">
                <span className="text-slate-500">Setup Inicial:</span>
                <span className="text-emerald-600 font-black">BONIFICADO ($0)</span>
              </div>
            </div>

            {/* Card 3: Next Tier Upgrade */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-500">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                  PRÓXIMO TRAMO
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Escala Futura</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Tramo 2: Crecimiento</h3>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Al superar los 15 comercios (16 a 40), el abono pasa automáticamente a <strong className="text-slate-800">$85.000 ARS/mes</strong>.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold">
                <span className="text-slate-500">Recaudación Estimada:</span>
                <span className="text-slate-800">$800.000 ARS / mes</span>
              </div>
            </div>
          </div>

          {/* Key Summary Terms */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900 text-amber-300">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Resumen Ejecutivo de la Suscripción</h3>
                <p className="text-xs text-slate-500 font-medium">Condiciones clave acordadas con KevDev para la fase actual</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Inicio Ágil sin Compromiso Inicial</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Ideal para validar el producto sin comprometer capital de inicio. El setup incluye soporte de configuración, mantenimiento continuo y despliegue del portal.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Migración Automática a Licencia Perpetua</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Al alcanzar los 80 comercios (Tramo 3), la plataforma migra a la modalidad de Licencia Perpetua, garantizando propiedad total del código sin cuotas mensuales.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVESTMENT MATRIX (TRAMOS 1-6) */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Matriz Maestra de Inversión & Escala Provincial</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Estructurada en Modalidad 1 (Abono Mensual hasta 80 comercios) y Modalidad 2 (Licencia Perpetua hasta 1.000 comercios)
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0047BA] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 shrink-0">
                <Cpu className="w-4 h-4" /> Escalabilidad Garantizada
              </span>
            </div>

            {/* Desktop Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wider font-black">
                    <th className="p-4 rounded-l-xl">Tramo / Capacidad</th>
                    <th className="p-4">Recaudación Estimada Cliente</th>
                    <th className="p-4">Modalidad 1: Abono Mensual</th>
                    <th className="p-4">Modalidad 2: Licencia Perpetua</th>
                    <th className="p-4 rounded-r-xl">Renovación Anual (Año 2+)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {tramos.map((tramo) => (
                    <tr 
                      key={tramo.id} 
                      className={`transition-colors ${
                        tramo.isCurrent ? 'bg-cyan-50/70 border-l-4 border-l-[#00ADB5]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-4 font-black text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{tramo.name}</span>
                          {tramo.isCurrent && (
                            <span className="text-[9px] bg-[#00ADB5] text-white font-black px-2 py-0.5 rounded-full">
                              ACTUAL
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-bold block mt-0.5">{tramo.capacity}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-extrabold text-slate-800">{tramo.recaudacion}</span>
                        <span className="text-[10px] text-emerald-600 font-black block mt-0.5">Margen: {tramo.margen}</span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-700">{tramo.abono}</span>
                        {tramo.setup && (
                          <span className="text-[10px] text-cyan-700 font-bold block mt-0.5">{tramo.setup}</span>
                        )}
                      </td>

                      <td className="p-4 font-bold text-slate-800">
                        {tramo.licenciaPerpetua}
                      </td>

                      <td className="p-4 font-extrabold text-slate-700">
                        {tramo.renovacionAnual}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3 mt-4">
              <Sparkles className="w-5 h-5 text-[#0047BA] shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong className="text-slate-800 font-bold">Lógica Financiera:</strong> Cada upgrade de capacidad representa menos del <strong className="text-[#0047BA]">10% de un solo mes</strong> de facturación del titular. La modalidad de pago único garantiza propiedad total del software de por vida sin comisiones ocultas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT HISTORY */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Historial de Pagos & Estado de Cuenta</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Sincronizado en tiempo real con la base de datos de KevDev
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchPayments}
                  disabled={isLoading}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-all cursor-pointer"
                  title="Actualizar pagos desde KevDev"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-600' : ''}`} />
                </button>

                {isSynced ? (
                  <div className="flex items-center gap-2 bg-emerald-900 text-emerald-300 text-xs font-extrabold px-3.5 py-1.5 rounded-full shrink-0 shadow-sm border border-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Conectado a Firebase KevDev</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-slate-900 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shrink-0">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sincronización KevDev Activa</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-[11px] uppercase tracking-wider font-black border-b border-slate-200">
                    <th className="p-3.5">Ref. / Periodo</th>
                    <th className="p-3.5">Concepto</th>
                    <th className="p-3.5">Monto</th>
                    <th className="p-3.5">Vencimiento</th>
                    <th className="p-3.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">
                        <span>{pay.period}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">{pay.invoiceRef}</span>
                      </td>

                      <td className="p-3.5 font-medium text-slate-700">
                        {pay.concept}
                      </td>

                      <td className="p-3.5 font-black text-slate-900">
                        {pay.amount}
                      </td>

                      <td className="p-3.5 text-slate-500 font-medium">
                        {pay.dueDate}
                      </td>

                      <td className="p-3.5">
                        {pay.status === 'paid' && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> AL DÍA / PAGADO
                          </span>
                        )}
                        {pay.status === 'waived' && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-cyan-100 text-cyan-800 font-black px-2.5 py-1 rounded-full">
                            <Sparkles className="w-3 h-3 text-cyan-600" /> BONIFICADO
                          </span>
                        )}
                        {pay.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 font-black px-2.5 py-1 rounded-full">
                            <Clock className="w-3 h-3 text-amber-600" /> PRÓXIMO VENCIMIENTO
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TECHNICAL SLA & ARCHITECTURE */}
      {activeTab === 'tech' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tech Specs */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#0047BA]">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-slate-900">Arquitectura de Alta Escalabilidad</h3>
              </div>

              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#00ADB5] shrink-0 mt-0.5" />
                  <span><strong>Next.js App Router + ISR:</strong> 95% de las visitas consumen páginas cacheadas estáticamente en la CDN global sin sobrecargar la BD.</span>
                </li>

                <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#00ADB5] shrink-0 mt-0.5" />
                  <span><strong>PostgreSQL Supabase Enterprise:</strong> Base de datos indexada con índices B-Tree para búsquedas e instantáneas por provincia y categoría.</span>
                </li>

                <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#00ADB5] shrink-0 mt-0.5" />
                  <span><strong>Storage WebP (S3 / R2):</strong> Compresión automática de imágenes a WebP optimizado al subir catálogos y banners.</span>
                </li>

                <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#00ADB5] shrink-0 mt-0.5" />
                  <span><strong>Tiempo de Respuesta:</strong> Optimizado para &lt; 100ms mediante CDN regional de alta velocidad.</span>
                </li>
              </ul>
            </div>

            {/* SLA & Warranties */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-slate-900">Garantías & Servicios Incluidos</h3>
              </div>

              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Despliegue de Alta Disponibilidad:</strong> SLA 99.9% uptime continuo en infraestructura cloud.</span>
                </li>

                <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Seguridad HTTPS & SSL:</strong> Certificados SSL activos con cabeceras de seguridad estrictas (CSP, HSTS).</span>
                </li>

                <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Backups Automatizados:</strong> Copias de seguridad diarias de base de datos e imágenes con retención periódica.</span>
                </li>

                <li className="flex items-start gap-2.5 text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Propiedad 100% de Datos:</strong> Todos los comercios, datos, catálogos y miembros pertenecen 100% al titular del proyecto.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
