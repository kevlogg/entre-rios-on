'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Clock, DollarSign, Store, ShieldCheck, AlertCircle, MessageCircle } from 'lucide-react';

interface CashPaymentRequest {
  id: string;
  commerceName: string;
  ownerName: string;
  phone: string;
  planName: 'Bronce' | 'Plata' | 'Oro';
  amount: number;
  city: string;
  date: string;
  status: 'pendiente' | 'aprobado';
}

export function CashPaymentsManager() {
  const [requests, setRequests] = useState<CashPaymentRequest[]>([
    {
      id: 'cash-101',
      commerceName: 'Bodega La Candelaria',
      ownerName: 'Marcos Benítez',
      phone: '3454891234',
      planName: 'Oro',
      amount: 45000,
      city: 'Concordia',
      date: '2026-09-21 18:30',
      status: 'pendiente'
    },
    {
      id: 'cash-102',
      commerceName: 'Alfajores Del Litoral',
      ownerName: 'Sofía Giménez',
      phone: '3435112233',
      planName: 'Plata',
      amount: 28000,
      city: 'Paraná',
      date: '2026-09-21 14:15',
      status: 'pendiente'
    },
    {
      id: 'cash-103',
      commerceName: 'Paraná Mobile Repair',
      ownerName: 'Esteban Ramírez',
      phone: '3434998877',
      planName: 'Bronce',
      amount: 15000,
      city: 'Paraná',
      date: '2026-09-20 11:00',
      status: 'aprobado'
    }
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const handleApprove = (reqId: string, commerceName: string, planName: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: 'aprobado' } : r))
    );

    setNotification(`¡Pago en efectivo del plan ${planName} aprobado para "${commerceName}"! El comercio fue activado.`);
    setTimeout(() => setNotification(null), 4000);
  };

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

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl text-xs font-bold text-amber-800">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>{requests.filter((r) => r.status === 'pendiente').length} pagos pendientes</span>
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
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-extrabold text-slate-900">{req.commerceName}</div>
                  <div className="text-[11px] text-slate-400">{req.ownerName} • {req.phone}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                    req.planName === 'Oro' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    req.planName === 'Plata' ? 'bg-slate-200 text-slate-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    Plan {req.planName}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-black text-emerald-700">
                  ${req.amount.toLocaleString('es-AR')}
                </td>
                <td className="py-3.5 px-4">{req.city}</td>
                <td className="py-3.5 px-4 text-slate-400 text-[11px]">{req.date}</td>
                <td className="py-3.5 px-4">
                  {req.status === 'pendiente' ? (
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
                  {req.status === 'pendiente' ? (
                    <button
                      onClick={() => handleApprove(req.id, req.commerceName, req.planName)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-extrabold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer"
                    >
                      Aprobar Pago en Efectivo
                    </button>
                  ) : (
                    <a
                      href={`https://wa.me/549${req.phone}?text=${encodeURIComponent(`Hola ${req.ownerName}, confirmamos la aprobación de tu pago en efectivo para el plan ${req.planName} en ON MÁS.`)}`}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
