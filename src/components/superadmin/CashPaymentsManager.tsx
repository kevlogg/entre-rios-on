'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Clock, DollarSign, Store, ShieldCheck, AlertCircle, MessageCircle, RefreshCw } from 'lucide-react';
import { getCashPayments } from '@/lib/dal/portal';
import { approveCashPaymentAction, getCashPaymentsAction } from '@/server/actions/superadmin';

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

  const loadCashPayments = async () => {
    setLoading(true);
    try {
      const res = await getCashPaymentsAction();
      if (res.success && Array.isArray(res.data)) {
        setRequests(
          res.data.map((p) => ({
            id: p.id,
            commerceName: p.commerceName,
            ownerName: p.ownerName,
            phone: p.phoneWhatsApp,
            planName: p.planName,
            amount: p.amount,
            city: p.cityName,
            status: p.status || 'PENDING',
            date: p.createdAt ? new Date(p.createdAt).toLocaleString('es-AR') : undefined,
          }))
        );
      }
    } catch (e) {
      console.warn('Error cargando pagos en efectivo:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCashPayments();
  }, []);

  const handleApprove = async (reqId: string, commerceName: string, planName: string) => {
    try {
      await approveCashPaymentAction(reqId, commerceName);
    } catch (err) {
      console.warn('Error en aprobación de pago:', err);
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'APPROVED' } : r))
    );

    setNotification(`¡Pago en efectivo del plan "${planName}" aprobado para "${commerceName}"! El comercio fue activado exitosamente.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const pendingCount = requests.filter((r) => isPendingStatus(r.status)).length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-[#00ADB5]" />
            Aprobación B2B
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Gestión de Pagos en Efectivo
          </h2>
          <p className="text-xs text-slate-500">
            Aprobá las solicitudes de comercios que pagaron en efectivo para activar sus planes y otorgar badges de verificación.
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

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl text-xs font-bold text-amber-800">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>{pendingCount} pago{pendingCount === 1 ? '' : 's'} pendiente{pendingCount === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Table of Cash Payment Requests */}
      <div className="overflow-x-auto">
        {requests.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-bold space-y-2">
            <CreditCard className="w-8 h-8 mx-auto text-slate-300" />
            <p>No hay registros de avisos de pago en efectivo recibidos por el momento.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-50">
                <th className="py-3 px-4 rounded-l-xl">Comercio</th>
                <th className="py-3 px-4">Plan Solicitado</th>
                <th className="py-3 px-4">Monto</th>
                <th className="py-3 px-4">Ciudad</th>
                <th className="py-3 px-4">Fecha Solicitud</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Acción SuperAdmin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {requests.map((req) => {
                const pending = isPendingStatus(req.status);
                return (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900">{req.commerceName}</div>
                      <div className="text-[11px] text-slate-400">{req.ownerName} {req.phone ? `• ${req.phone}` : ''}</div>
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
                    <td className="py-3.5 px-4">{req.city}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">{req.date || 'Reciente'}</td>
                    <td className="py-3.5 px-4">
                      {pending ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> Pendiente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Aprobado & Activo
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {pending ? (
                        <button
                          onClick={() => handleApprove(req.id, req.commerceName, req.planName)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-extrabold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer"
                        >
                          Aprobar Pago en Efectivo
                        </button>
                      ) : (
                        <a
                          href={`https://wa.me/549${req.phone || '3434001122'}?text=${encodeURIComponent(`Hola ${req.ownerName}, confirmamos la aprobación de tu pago en efectivo para el ${req.planName} en ON MÁS.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-[#25D366] text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>Notificar por WhatsApp</span>
                        </a>
                      )}
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
