'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Commerce } from '@/types';
import { ShieldCheck, CheckCircle2, XCircle, Search, Filter, Store, MapPin, Plus, Sparkles, MessageCircle } from 'lucide-react';
import { toggleCommerceVerificationAction } from '@/server/actions/superadmin';

interface CommerceApprovalTableProps {
  commerces: Commerce[];
}

export function CommerceApprovalTable({ commerces: initialCommerces }: CommerceApprovalTableProps) {
  const [commerces, setCommerces] = useState<Commerce[]>(initialCommerces);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'comercio' | 'turismo' | 'particular'>('all');

  React.useEffect(() => {
    setCommerces(initialCommerces);
  }, [initialCommerces]);

  const toggleVerification = async (id: string) => {
    const target = commerces.find((c) => c.id === id);
    if (!target) return;

    try {
      await toggleCommerceVerificationAction(id, target.isVerified);
    } catch (err) {
      console.warn('Verification Server Action fallback:', err);
    }

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
    
    let matchesType = true;
    const catLower = c.category.toLowerCase();
    if (typeFilter === 'comercio') {
      matchesType = !catLower.includes('turismo') && !catLower.includes('particular') && !catLower.includes('vecino');
    } else if (typeFilter === 'turismo') {
      matchesType = catLower.includes('turismo') || catLower.includes('alojamiento') || catLower.includes('hotel') || catLower.includes('termas') || catLower.includes('posada') || catLower.includes('cabaña');
    } else if (typeFilter === 'particular') {
      matchesType = catLower.includes('particular') || catLower.includes('vecino');
    }
    
    return matchesSearch && matchesCity && matchesType;
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
      
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-black text-[#0047BA] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#00ADB5]" />
            <span>Gestión de Cuentas B2B & Usuarios (ON MÁS Portal)</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Supervisión y control de planes: Comercios (Bronce, Plata, Oro), Servicios de Turismo y Vecinos Particulares.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por comercio o ciudad..."
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
            <option value="concordia">Concordia</option>
            <option value="colon">Colón</option>
            <option value="federacion">Federación</option>
            <option value="gualeguaychu">Gualeguaychú</option>
            <option value="santa-fe-capital">Santa Fe Capital</option>
            <option value="rosario">Rosario</option>
          </select>
        </div>
      </div>

      {/* Profile Type Filter Buttons */}
      <div className="flex items-center gap-2 text-xs font-bold overflow-x-auto pb-1">
        <span className="text-slate-400 font-black text-[11px] uppercase mr-1">Perfil:</span>
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            typeFilter === 'all' ? 'bg-[#0047BA] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Todos ({commerces.length})
        </button>
        <button
          onClick={() => setTypeFilter('comercio')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            typeFilter === 'comercio' ? 'bg-[#00ADB5] text-white shadow-xs' : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
          }`}
        >
          Comercios & Empresas (Oro / Plata / Bronce)
        </button>
        <button
          onClick={() => setTypeFilter('turismo')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            typeFilter === 'turismo' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
          }`}
        >
          Turismo & Experiencias (Oro / Plata / Bronce)
        </button>
        <button
          onClick={() => setTypeFilter('particular')}
          className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            typeFilter === 'particular' ? 'bg-slate-700 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Vecinos / Particulares
        </button>
      </div>

      {/* Commerces Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-extrabold uppercase tracking-wider">
              <th className="pb-3 px-3">Cuenta / Nombre</th>
              <th className="pb-3 px-3">Localidad</th>
              <th className="pb-3 px-3">Categoría & Plan ON MÁS</th>
              <th className="pb-3 px-3 text-center">Insignia Verificado</th>
              <th className="pb-3 px-3 text-center">Estado del Plan</th>
              <th className="pb-3 px-3 text-right">Contacto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredCommerces.map((comm) => {
              const isGoldOrSilver = comm.isVerified;
              return (
                <tr key={comm.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <Image src={comm.logoUrl} alt={comm.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">{comm.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{comm.address || comm.email || 'Sin dirección registrada'}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-bold text-[#0047BA]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" />
                      {comm.cityName}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase w-fit">
                        {comm.category}
                      </span>
                      <span className="text-[10px] font-bold text-[#0047BA]">
                        {isGoldOrSilver ? 'Plan Oro / Plata' : 'Plan Bronce'}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => toggleVerification(comm.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition-colors ${
                        comm.isVerified
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      <ShieldCheck className={`w-3.5 h-3.5 ${comm.isVerified ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span>{comm.isVerified ? 'Comercio Verificado' : 'Sin Verificar'}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => toggleSubscription(comm.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black cursor-pointer transition-transform active:scale-95 ${
                        comm.isSubscriptionActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      <span>{comm.isSubscriptionActive ? '✓ Plan Activo' : '⚠ Inactivo (Sin Plan)'}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <a
                      href={`https://wa.me/${comm.phoneWhatsApp}?text=${encodeURIComponent(`Hola ${comm.name}, nos comunicamos del equipo SuperAdmin de Entre Ríos ON MÁS sobre la gestión de tu cuenta.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-1.5 rounded-xl font-extrabold text-[11px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>WhatsApp</span>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
