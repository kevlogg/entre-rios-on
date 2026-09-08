'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Commerce } from '@/types';
import { ShieldCheck, CheckCircle2, XCircle, Search, Filter, Store, MapPin, Plus, Sparkles, MessageCircle } from 'lucide-react';

interface CommerceApprovalTableProps {
  commerces: Commerce[];
}

export function CommerceApprovalTable({ commerces: initialCommerces }: CommerceApprovalTableProps) {
  const [commerces, setCommerces] = useState<Commerce[]>(initialCommerces);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  const toggleVerification = (id: string) => {
    setCommerces((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isVerified: !c.isVerified } : c))
    );
  };

  const toggleSubscription = (id: string) => {
    setCommerces((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isSubscriptionActive: !c.isSubscriptionActive } : c))
    );
  };

  const filteredCommerces = commerces.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.cityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = cityFilter === 'all' || c.cityId.toLowerCase() === cityFilter.toLowerCase();
    return matchesSearch && matchesCity;
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
      
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-black text-[#004b87] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#00a859]" />
            <span>Gestión Provincial de Comercios & Socios B2B</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Control de altas, insignias de verificación Gold y estados de cuenta en los 17 departamentos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar comercio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700"
          >
            <option value="all">Todas las Ciudades</option>
            <option value="parana">Paraná</option>
            <option value="colon">Colón</option>
            <option value="concordia">Concordia</option>
            <option value="gualeguaychu">Gualeguaychú</option>
          </select>
        </div>
      </div>

      {/* Commerces Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider">
              <th className="pb-3 px-3">Comercio / Negocio</th>
              <th className="pb-3 px-3">Localidad</th>
              <th className="pb-3 px-3">Rubro</th>
              <th className="pb-3 px-3 text-center">Insignia Verificado</th>
              <th className="pb-3 px-3 text-center">Suscripción B2B</th>
              <th className="pb-3 px-3 text-right">Acciones SuperAdmin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredCommerces.map((comm) => (
              <tr key={comm.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <Image src={comm.logoUrl} alt={comm.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">{comm.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{comm.address}</p>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-3 font-bold text-[#004b87]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00a859]" />
                    {comm.cityName}
                  </span>
                </td>

                <td className="py-3.5 px-3">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase">
                    {comm.category}
                  </span>
                </td>

                <td className="py-3.5 px-3 text-center">
                  <button
                    onClick={() => toggleVerification(comm.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition-colors ${
                      comm.isVerified
                        ? 'bg-emerald-100 text-[#00a859]'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{comm.isVerified ? 'Gold Verificado' : 'Sin Verificar'}</span>
                  </button>
                </td>

                <td className="py-3.5 px-3 text-center">
                  <button
                    onClick={() => toggleSubscription(comm.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition-colors ${
                      comm.isSubscriptionActive
                        ? 'bg-blue-100 text-[#004b87]'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <span>{comm.isSubscriptionActive ? 'Plan Activo 0%' : 'Pausado'}</span>
                  </button>
                </td>

                <td className="py-3.5 px-3 text-right">
                  <a
                    href={`https://wa.me/${comm.phoneWhatsApp}?text=${encodeURIComponent(`Hola ${comm.name}, me comunico del equipo SuperAdmin de Entre Ríos ON.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-1.5 rounded-xl font-extrabold text-[11px]"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
