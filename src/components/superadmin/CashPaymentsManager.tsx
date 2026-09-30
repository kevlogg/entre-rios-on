'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Store, 
  ShieldCheck, 
  AlertCircle, 
  MessageCircle, 
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  UserCheck,
  Trash2
} from 'lucide-react';
import { approveCashPaymentAction, getCashPaymentsAction, deleteCashPaymentAction } from '@/server/actions/superadmin';

interface CashPaymentRequest {
  id: string;
  commerceName: string;
  ownerName: string;
  phone: string;
  planName: string;
  amount: number;
  city: string;
  date?: string;
  status: string;
  notes?: string;
  paymentType?: 'INITIAL' | 'MONTHLY_RENEWAL';
}

const isPendingStatus = (status?: string): boolean => {
  if (!status) return true;
  const s = status.trim().toUpperCase();
  return s === 'PENDING' || s === 'PENDIENTE' || s === 'PENDING_APPROVAL';
};

export function CashPaymentsManager() {
  const [requests, setRequests] = useState<CashPaymentRequest[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'INITIAL' | 'MONTHLY_RENEWAL'>('all');

  const loadCashPayments = async () => {
    setLoading(true);
    try {
      const res = await getCashPaymentsAction();
      if (res.success && Array.isArray(res.data)) {
        const filtered = res.data.filter(
          (p) => !(p.ownerName || '').toLowerCase().includes('kevin') && !(p.commerceName || '').toLowerCase().includes('kevin')
        );

        setRequests(
          filtered.map((p) => {
            const notesLower = (p.notes || '').toLowerCase();
            const isRenewal = notesLower.includes('monthly_renewal') || notesLower.includes('cuota') || notesLower.includes('renovación') || notesLower.includes('nueva cuota');
            return {
              id: p.id,
              commerceName: p.commerceName,
              ownerName: p.ownerName,
              phone: p.phoneWhatsApp,
              planName: p.planName,
              amount: p.amount,
              city: p.cityName,
              status: p.status || 'PENDING',
              notes: p.notes,
              paymentType: isRenewal ? 'MONTHLY_RENEWAL' : 'INITIAL',
              date: p.createdAt ? new Date(p.createdAt).toLocaleString('es-AR') : undefined,
            };
          })
        );
      }
    } catch (e) {
      console.warn('Error cargando pagos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCashPayments();
  }, []);

  const handleDelete = async (reqId: string, commerceName: string) => {
    try {
      await deleteCashPaymentAction(reqId);
      setRequests((prev) => prev.filter((r) => r.id !== reqId));
      setNotification(`Aviso de pago de "${commerceName}" eliminado.`);
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.warn('Error eliminando pago:', err);
    }
  };

  const handleApprove = async (reqId: string, commerceName: string, planName: string, paymentType?: string) => {
    try {
      await approveCashPaymentAction(reqId, commerceName);
    } catch (err) {
      console.warn('Error en aprobación de pago:', err);
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'APPROVED' } : r))
    );

    const isRenewal = paymentType === 'MONTHLY_RENEWAL';
    setNotification(
      isRenewal
        ? `¡Renovación de cuota mensual del plan "${planName}" aprobada para "${commerceName}"! La cuenta se extendió 30 días y se guardó en el historial.`
        : `¡Alta inicial del plan "${planName}" aprobada para "${commerceName}"! El comercio fue activado exitosamente.`
    );
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredRequests = requests.filter((r) => {
    if (typeFilter === 'all') return true;
    return r.paymentType === typeFilter;
  });

  const pendingCount = requests.filter((r) => isPendingStatus(r.status)).length;
  const initialCount = requests.filter((r) => r.paymentType === 'INITIAL').length;
  const renewalCount = requests.filter((r) => r.paymentType === 'MONTHLY_RENEWAL').length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-[#00ADB5]" />
            Validación de Pagos B2B
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Gestión de Avisos de Pago & Renovaciones
          </h2>
          <p className="text-xs text-slate-500">
            Discriminá y aprobá los avisos de <strong className="text-slate-800">Altas Iniciales</strong> y <strong className="text-slate-800 font-bold">Renovaciones Mensuales</strong> reportados en efectivo y transferencia.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCashPayments}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer"
            title="Actualizar lista"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl text-xs font-bold text-amber-900 shadow-2xs">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{pendingCount} cuota{pendingCount === 1 ? '' : 's'} pendiente{pendingCount === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs (Discriminar Tipo de Pago) */}
      <div className="flex items-center gap-2 text-xs font-bold overflow-x-auto pb-1">
        <span className="text-slate-400 font-black text-[11px] uppercase mr-1">Filtrar Concepto:</span>
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            typeFilter === 'all' ? 'bg-[#0047BA] text-white shadow-xs font-extrabold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Todos los Pagos ({requests.length})
        </button>
        <button
          onClick={() => setTypeFilter('INITIAL')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            typeFilter === 'INITIAL' ? 'bg-amber-500 text-slate-950 shadow-xs font-black' : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <span>🆕 Altas Iniciales ({initialCount})</span>
        </button>
        <button
          onClick={() => setTypeFilter('MONTHLY_RENEWAL')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            typeFilter === 'MONTHLY_RENEWAL' ? 'bg-[#00ADB5] text-white shadow-xs font-black' : 'bg-cyan-50 text-[#0047BA] border border-cyan-200 hover:bg-cyan-100'
          }`}
        >
          <span>🔄 Renovaciones Mensuales ({renewalCount})</span>
        </button>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Table of Cash Payment Requests */}
      <div className="overflow-x-auto">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-bold space-y-2">
            <CreditCard className="w-8 h-8 mx-auto text-slate-300" />
            <p>No se registran avisos de pago para el filtro seleccionado.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-50">
                <th className="py-3 px-4 rounded-l-xl">Comercio / Usuario</th>
                <th className="py-3 px-4">Concepto de Pago</th>
                <th className="py-3 px-4">Plan / Cuota</th>
                <th className="py-3 px-4">Monto</th>
                <th className="py-3 px-4">Comprobante / Detalle</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Acción SuperAdmin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {filteredRequests.map((req) => {
                const pending = isPendingStatus(req.status);
                const isRenewal = req.paymentType === 'MONTHLY_RENEWAL';

                return (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900">{req.commerceName}</div>
                      <div className="text-[11px] text-slate-400">{req.ownerName} {req.phone ? `• ${req.phone}` : ''} • {req.city}</div>
                    </td>

                    {/* Discriminar Tipo de Pago Badge */}
                    <td className="py-3.5 px-4">
                      {isRenewal ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black bg-cyan-100 text-[#0047BA] border border-cyan-300 px-2.5 py-1 rounded-full">
                          🔄 Renovación Mensual
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-1 rounded-full">
                          🆕 Alta Inicial de Plan
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                        req.planName.toLowerCase().includes('oro') ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        req.planName.toLowerCase().includes('plata') ? 'bg-slate-200 text-slate-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {req.planName.startsWith('Plan') ? req.planName : `Plan ${req.planName}`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-emerald-700">
                      ${req.amount ? req.amount.toLocaleString('es-AR') : '0'}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs text-slate-600 truncate">
                      {req.notes || 'Pago reportado por el usuario'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">{req.date || 'Reciente'}</td>

                    <td className="py-3.5 px-4">
                      {pending ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> Pendiente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Aprobado
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {pending ? (
                          <button
                            onClick={() => handleApprove(req.id, req.commerceName, req.planName, req.paymentType)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-extrabold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer"
                          >
                            {isRenewal ? 'Validar y Renovar Cuota' : 'Aprobar Alta de Comercio'}
                          </button>
                        ) : (
                          <a
                            href={`https://wa.me/549${req.phone || '3434001122'}?text=${encodeURIComponent(`Hola ${req.ownerName}, confirmamos la aprobación de tu pago para el ${req.planName} en ON MÁS.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 bg-[#25D366] text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-current" />
                            <span>Notificar WhatsApp</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(req.id, req.commerceName)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
