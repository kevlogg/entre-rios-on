'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Commerce } from '@/types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Store, 
  MapPin, 
  Sparkles, 
  MessageCircle, 
  Eye, 
  X, 
  Clock, 
  History, 
  Building2, 
  Award,
  DollarSign,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { 
  toggleCommerceVerificationAction, 
  getCommercePaymentHistoryAction,
  deleteCommerceAction
} from '@/server/actions/superadmin';

interface CommerceApprovalTableProps {
  commerces: Commerce[];
}

export function CommerceApprovalTable({ commerces: initialCommerces }: CommerceApprovalTableProps) {
  const [commerces, setCommerces] = useState<Commerce[]>(initialCommerces);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'comercio' | 'turismo' | 'particular'>('all');

  // Detail Modal State
  const [selectedCommerce, setSelectedCommerce] = useState<Commerce | null>(null);
  const [commerceHistory, setCommerceHistory] = useState<Array<{ id: string; planName: string; amount: number; status: string; createdAt: string; notes?: string }>>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Delete Modal State
  const [commerceToDelete, setCommerceToDelete] = useState<Commerce | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleOpenDetailModal = async (comm: Commerce) => {
    setSelectedCommerce(comm);
    setLoadingHistory(true);
    try {
      const res = await getCommercePaymentHistoryAction(comm.name, comm.id);
      if (res.success && Array.isArray(res.data)) {
        setCommerceHistory(res.data);
      } else {
        setCommerceHistory([]);
      }
    } catch (e) {
      console.warn('Error cargando historial de comercio:', e);
      setCommerceHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDeleteCommerce = async () => {
    if (!commerceToDelete || isDeleting) return;
    setIsDeleting(true);

    try {
      const res = await deleteCommerceAction(commerceToDelete.id);
      if (res.success) {
        setCommerces((prev) => prev.filter((c) => c.id !== commerceToDelete.id));
        if (selectedCommerce?.id === commerceToDelete.id) {
          setSelectedCommerce(null);
        }
        setCommerceToDelete(null);
      } else {
        alert(`Error al eliminar el comercio: ${res.message}`);
      }
    } catch (err) {
      console.warn('Error eliminando comercio:', err);
      alert('Ocurrió un error inesperado al intentar eliminar el comercio.');
    } finally {
      setIsDeleting(false);
    }
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
            Supervisión de perfiles y consulta de historiales de pago. Hacé clic en un comercio para inspeccionar su ficha e historial completo.
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
              <th className="pb-3 px-3">Categoría & Plan</th>
              <th className="pb-3 px-3 text-center">Insignia Verificado</th>
              <th className="pb-3 px-3 text-center">Estado del Plan (Lectura)</th>
              <th className="pb-3 px-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredCommerces.map((comm) => {
              const isGoldOrSilver = comm.isVerified;
              return (
                <tr key={comm.id} className="hover:bg-slate-50/90 transition-colors group">
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => handleOpenDetailModal(comm)}
                      className="flex items-center gap-3 text-left group-hover:text-[#0047BA] cursor-pointer"
                    >
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
                        <Image src={comm.logoUrl} alt={comm.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm group-hover:text-[#0047BA]">{comm.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{comm.address || comm.email || 'Sin dirección registrada'}</p>
                      </div>
                    </button>
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
                      title="Activar/Desactivar Insignia Verificado"
                    >
                      <ShieldCheck className={`w-3.5 h-3.5 ${comm.isVerified ? 'text-amber-600' : 'text-slate-400'}`} />
                      <span>{comm.isVerified ? 'Comercio Verificado' : 'Sin Verificar'}</span>
                    </button>
                  </td>

                  {/* Estado del Plan READ-ONLY */}
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black ${
                        comm.isSubscriptionActive
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                      title="Estado automático determinado por pagos validados o pasarela MercadoPago"
                    >
                      <span>{comm.isSubscriptionActive ? '✓ Plan Activo' : '⚠ Inactivo (Sin Plan)'}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenDetailModal(comm)}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-cyan-50 text-[#0047BA] hover:text-[#00ADB5] border border-slate-200 hover:border-[#00ADB5] px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition-all cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ficha e Historial</span>
                      </button>

                      <button
                        onClick={() => setCommerceToDelete(comm)}
                        className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 px-2.5 py-1.5 rounded-xl font-extrabold text-[11px] transition-all cursor-pointer shadow-2xs"
                        title="Eliminar Comercio"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Eliminar</span>
                      </button>

                      <a
                        href={`https://wa.me/${comm.phoneWhatsApp}?text=${encodeURIComponent(`Hola ${comm.name}, nos comunicamos del equipo SuperAdmin de Entre Ríos ON MÁS sobre la gestión de tu cuenta.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20ba5a] text-white px-2.5 py-1.5 rounded-xl font-extrabold text-[11px]"
                        title="Enviar WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ==================== MODAL FICHA DE COMERCIO E HISTORIAL DE PAGOS ==================== */}
      {selectedCommerce && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto relative scrollbar-none">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCommerce(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Comercio */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
                <Image src={selectedCommerce.logoUrl} alt={selectedCommerce.name} fill className="object-cover" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">{selectedCommerce.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    selectedCommerce.isSubscriptionActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedCommerce.isSubscriptionActive ? '✓ Suscripción Activa' : '⚠ Inactivo'}
                  </span>
                  {selectedCommerce.isVerified && (
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                      <ShieldCheck className="w-3 h-3 text-amber-600" /> Verificado
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedCommerce.category} • {selectedCommerce.cityName}, {selectedCommerce.provinceName}
                </p>
              </div>
            </div>

            {/* Grid de Información de Contacto y Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">WhatsApp / Contacto:</span>
                <strong className="text-slate-800 font-mono">{selectedCommerce.phoneWhatsApp || 'No especificado'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Correo Registrado:</span>
                <strong className="text-slate-800">{selectedCommerce.email || 'No registrado'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Dirección Física:</span>
                <strong className="text-slate-800">{selectedCommerce.address || 'Sin dirección fija (Digital)'}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-bold text-[10px] uppercase">Plan Actual en Sistema:</span>
                <strong className="text-[#0047BA]">{selectedCommerce.isVerified ? 'Plan Oro / Plata' : 'Plan Bronce'}</strong>
              </div>
            </div>

            {/* Historial de Pagos de la Cuenta */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#0047BA]" />
                  <span>Historial de Pagos y Suscripción</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-bold">Registros de Transacciones</span>
              </div>

              {loadingHistory ? (
                <div className="py-6 text-center text-xs text-slate-400 font-bold space-y-2">
                  <div className="w-6 h-6 border-2 border-[#00ADB5] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p>Cargando registros de historial...</p>
                </div>
              ) : commerceHistory.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center text-xs text-slate-500 font-medium">
                  No se registran pagos previos o avisos almacenados para este comercio.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                        <th className="py-2.5 px-3">Fecha</th>
                        <th className="py-2.5 px-3">Plan</th>
                        <th className="py-2.5 px-3">Monto</th>
                        <th className="py-2.5 px-3">Notas / Comprobante</th>
                        <th className="py-2.5 px-3 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {commerceHistory.map((h) => (
                        <tr key={h.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                            {h.createdAt ? new Date(h.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Reciente'}
                          </td>
                          <td className="py-2.5 px-3 font-extrabold text-slate-900">
                            Plan {h.planName}
                          </td>
                          <td className="py-2.5 px-3 font-black text-emerald-700">
                            ${h.amount.toLocaleString('es-AR')}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate text-[11px]">
                            {h.notes || 'Pago procesado'}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {h.status === 'APPROVED' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                Aprobado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                Pendiente
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${selectedCommerce.phoneWhatsApp}?text=${encodeURIComponent(`Hola ${selectedCommerce.name}, nos comunicamos desde la administración de ON MÁS.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs hover:bg-[#20ba5a]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Contactar por WhatsApp</span>
                </a>

                <button
                  onClick={() => setCommerceToDelete(selectedCommerce)}
                  className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Eliminar Comercio</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedCommerce(null)}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== MODAL CONFIRMACIÓN DE ELIMINACIÓN ==================== */}
      {commerceToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                ¿Eliminar el comercio &quot;{commerceToDelete.name}&quot;?
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Esta acción es <strong className="text-rose-600">permanente e irreversible</strong>. Se eliminará la cuenta, su ficha en <strong>{commerceToDelete.cityName}</strong> y todos sus productos o catálogo asociado en ON MÁS.
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setCommerceToDelete(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-3 rounded-xl cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteCommerce}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-3 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? 'Eliminando...' : 'Sí, Eliminar Comercio'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

