'use client';

import React, { useState } from 'react';
import { Globe, MessageCircle, Clock, CheckCircle2, Building, Mail, Phone, ExternalLink } from 'lucide-react';

interface WebRequest {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  desiredDomain: string;
  notes: string;
  date: string;
  status: 'pendiente' | 'contactado' | 'en-desarrollo';
}

export function WebRequestsManager() {
  const [requests, setRequests] = useState<WebRequest[]>([
    {
      id: 'web-1',
      businessName: 'Comedor El Dorado',
      contactName: 'Carlos Gómez',
      phone: '3434123456',
      email: 'contacto@eldorado.com.ar',
      desiredDomain: 'comedoreldorado.com.ar',
      notes: 'Quiero tener la carta completa con fotos y menú del día para reservas.',
      date: '2026-09-21 17:40',
      status: 'pendiente'
    },
    {
      id: 'web-2',
      businessName: 'Alfarería Delta',
      contactName: 'Laura Fernández',
      phone: '3434991122',
      email: 'alfajores@delta.com.ar',
      desiredDomain: 'alfareriadelta.com',
      notes: 'Sitio de artesanías con tienda online para enviar a todo el país.',
      date: '2026-09-20 12:10',
      status: 'contactado'
    }
  ]);

  const handleUpdateStatus = (reqId: string, newStatus: 'contactado' | 'en-desarrollo') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: newStatus } : r))
    );
  };

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

        <div className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 px-3.5 py-2 rounded-2xl text-xs font-bold text-[#0047BA]">
          <Globe className="w-4 h-4 text-[#00ADB5]" />
          <span>{requests.filter((r) => r.status === 'pendiente').length} solicitudes pendientes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((req) => (
          <div key={req.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/60 space-y-4 hover:border-[#00ADB5] transition-all">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{req.businessName}</h3>
                <p className="text-xs text-slate-500 font-medium">{req.contactName}</p>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                req.status === 'pendiente' ? 'bg-amber-100 text-amber-800' :
                req.status === 'contactado' ? 'bg-cyan-100 text-[#0047BA]' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {req.status === 'pendiente' ? 'Pendiente' : req.status === 'contactado' ? 'Contactado' : 'En Desarrollo'}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
              <p className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#00ADB5]" />
                <span className="font-bold">Dominio deseado:</span>
                <span className="font-mono text-[#0047BA]">{req.desiredDomain}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{req.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+54 9 {req.phone}</span>
              </p>
              <p className="text-slate-600 italic pt-1 border-t border-slate-100">
                "{req.notes}"
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <a
                href={`https://wa.me/549${req.phone}?text=${encodeURIComponent(`Hola ${req.contactName}, recibimos tu solicitud en ON MÁS para la creación del sitio web de ${req.businessName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Contactar por WhatsApp</span>
              </a>

              {req.status === 'pendiente' && (
                <button
                  onClick={() => handleUpdateStatus(req.id, 'contactado')}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer"
                >
                  Marcar Contactado
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
