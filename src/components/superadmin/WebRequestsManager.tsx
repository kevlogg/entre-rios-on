'use client';

import React, { useState, useEffect } from 'react';
import { Globe, MessageCircle, Clock, CheckCircle2, Building, Mail, Phone, ExternalLink, RefreshCw } from 'lucide-react';
import { getWebRequests } from '@/lib/dal/portal';
import { getWebRequestsAction, updateWebRequestStatusAction } from '@/server/actions/superadmin';

interface WebRequest {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  desiredDomain: string;
  notes: string;
  date?: string;
  status: string;
}

const isPendingWebStatus = (s?: string): boolean => {
  if (!s) return true;
  const str = s.trim().toUpperCase();
  return str === 'PENDING' || str === 'PENDIENTE';
};

const isContactedWebStatus = (s?: string): boolean => {
  if (!s) return false;
  const str = s.trim().toUpperCase();
  return str === 'CONTACTED' || str === 'CONTACTADO';
};

export function WebRequestsManager() {
  const [requests, setRequests] = useState<WebRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const res = await getWebRequestsAction();
      if (res.success && res.data && res.data.length > 0) {
        setRequests(
          res.data.map((r) => ({
            id: r.id,
            businessName: r.businessName,
            contactName: r.contactName,
            phone: r.phoneWhatsApp,
            email: r.email || '',
            desiredDomain: r.desiredDomain || '',
            notes: r.notes || '',
            status: r.status || 'PENDING',
            date: r.createdAt ? new Date(r.createdAt).toLocaleString('es-AR') : undefined,
          }))
        );
      } else {
        const data = await getWebRequests();
        if (data) {
          setRequests(
            data.map((r) => ({
              id: r.id,
              businessName: r.businessName,
              contactName: r.contactName,
              phone: r.phoneWhatsApp,
              email: r.email || '',
              desiredDomain: r.desiredDomain || '',
              notes: r.notes || '',
              status: r.status || 'PENDING',
              date: r.createdAt ? new Date(r.createdAt).toLocaleString('es-AR') : undefined,
            }))
          );
        }
      }
    } catch (e) {
      console.warn('Error cargando solicitudes web:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateStatus = async (reqId: string, newStatus: string) => {
    try {
      await updateWebRequestStatusAction(reqId, newStatus);
    } catch (err) {
      console.warn('Error actualizando estado de solicitud web:', err);
    }

    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: newStatus } : r))
    );
  };

  const pendingCount = requests.filter((r) => isPendingWebStatus(r.status)).length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#00ADB5]" />
            Soluciones Web B2B
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Solicitudes "Mi Sitio Web Propio"
          </h2>
          <p className="text-xs text-slate-500">
            Comercios que solicitaron el desarrollo de su propia página web corporativa o tienda online.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadRequests}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer"
            title="Actualizar solicitudes"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 px-3.5 py-2 rounded-2xl text-xs font-bold text-[#0047BA]">
            <Globe className="w-4 h-4 text-[#00ADB5]" />
            <span>{pendingCount} solicitud{pendingCount === 1 ? '' : 'es'} pendiente{pendingCount === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-xs font-bold space-y-2">
          <Globe className="w-8 h-8 mx-auto text-slate-300" />
          <p>No hay solicitudes registradas de Sitio Web Propio por el momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req) => {
            const isPending = isPendingWebStatus(req.status);
            const isContacted = isContactedWebStatus(req.status);

            return (
              <div key={req.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/60 space-y-4 hover:border-[#00ADB5] transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{req.businessName}</h3>
                    <p className="text-xs text-slate-500 font-medium">{req.contactName} {req.date ? `• ${req.date}` : ''}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                    isPending ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    isContacted ? 'bg-cyan-100 text-[#0047BA] border border-cyan-300' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isPending ? 'Pendiente' : isContacted ? 'Contactado' : 'En Desarrollo'}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  <p className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-[#00ADB5]" />
                    <span className="font-bold">Dominio deseado:</span>
                    <span className="font-mono text-[#0047BA]">{req.desiredDomain || 'No especificado'}</span>
                  </p>
                  {req.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.email}</span>
                    </p>
                  )}
                  {req.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>+54 9 {req.phone}</span>
                    </p>
                  )}
                  {req.notes && (
                    <p className="text-slate-600 italic pt-1 border-t border-slate-100">
                      "{req.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <a
                    href={`https://wa.me/549${req.phone || '3434001122'}?text=${encodeURIComponent(`Hola ${req.contactName}, recibimos tu solicitud en ON MÁS para la creación del sitio web de ${req.businessName}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Contactar por WhatsApp</span>
                  </a>

                  {isPending && (
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'CONTACTED')}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer"
                    >
                      Marcar Contactado
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
