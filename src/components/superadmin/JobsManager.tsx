'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  CheckCircle2, 
  UserCheck, 
  MapPin, 
  Building, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  XCircle, 
  Laptop, 
  MessageCircle 
} from 'lucide-react';
import { 
  createJobAction, 
  getAllJobsAction, 
  approveJobAction, 
  rejectJobAction, 
  deleteJobAction 
} from '@/server/actions/superadmin';
import { JobItem } from '@/types';

export function JobsManager() {
  const [activeJobs, setActiveJobs] = useState<JobItem[]>([]);
  const [pendingJobs, setPendingJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State for New Job
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [modality, setModality] = useState('Presencial');
  const [city, setCity] = useState('Paraná');
  const [salary, setSalary] = useState('');
  const [type, setType] = useState<string>('Tiempo Completo');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAllJobs = async () => {
    setIsLoading(true);
    try {
      const [approvedRes, pendingRes] = await Promise.all([
        getAllJobsAction('APPROVED'),
        getAllJobsAction('PENDING'),
      ]);

      if (approvedRes.success && Array.isArray(approvedRes.data)) {
        setActiveJobs(approvedRes.data);
      }
      if (pendingRes.success && Array.isArray(pendingRes.data)) {
        setPendingJobs(pendingRes.data);
      }
    } catch (e) {
      console.warn('Error cargando empleos en SuperAdmin:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllJobs();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await createJobAction({
        title,
        company,
        cityName: city,
        workModality: modality,
        jobType: type,
        salary: salary || 'A convenir',
        description: description || `Búsqueda laboral activa para ${company} (${modality}).`,
        phoneWhatsApp: phone || '5493434567890',
        isSuperAdmin: true,
      });

      if (res.success) {
        setSuccessMsg(`¡Búsqueda laboral "${title}" publicada directamente en la web!`);
        setTitle('');
        setCompany('');
        setSalary('');
        setDescription('');
        setPhone('');
        await loadAllJobs();
      } else {
        alert(res.message);
      }
    } catch (e) {
      console.warn('Error creando trabajo en Supabase:', e);
    } finally {
      setIsSubmitting(false);
    }

    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleApproveJob = async (jobId: string, jobTitle: string) => {
    try {
      const res = await approveJobAction(jobId);
      if (res.success) {
        setSuccessMsg(`¡Oferta "${jobTitle}" aprobada y publicada exitosamente!`);
        await loadAllJobs();
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (e) {
      console.warn('Error aprobando empleo:', e);
    }
  };

  const handleRejectJob = async (jobId: string) => {
    try {
      const res = await rejectJobAction(jobId);
      if (res.success) {
        await loadAllJobs();
      }
    } catch (e) {
      console.warn('Error rechazando empleo:', e);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('¿Estás seguro de eliminar esta búsqueda laboral?')) return;
    try {
      const res = await deleteJobAction(jobId);
      if (res.success) {
        await loadAllJobs();
      }
    } catch (e) {
      console.warn('Error eliminando empleo:', e);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Formulario de Alta de Empleo desde SuperAdmin */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-[#00ADB5]" />
              Sección Empleos & Trabajo
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1">
              Publicar Nueva Búsqueda Laboral
            </h2>
            <p className="text-xs text-slate-500">
              Alta directa con verificación aprobada para figurar inmediatamente en la bolsa de trabajo provincial.
            </p>
          </div>

          <button
            onClick={loadAllJobs}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer"
            title="Actualizar listado"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-150">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateJob} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Título del Puesto *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Encargado de Local / Cajero"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Empresa o Comercio Solicita *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Ej. Bodega La Candelaria"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>

            {/* OPCCIÓN MODALIDAD DE TRABAJO (REQ: REMOTO, HÍBRIDO, PRESENCIAL) */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#0047BA] flex items-center gap-1">
                <Laptop className="w-3.5 h-3.5 text-[#00ADB5]" />
                <span>Modalidad de Trabajo *</span>
              </label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className="w-full bg-cyan-50/60 border border-cyan-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-extrabold"
              >
                <option value="Presencial">Presencial</option>
                <option value="Híbrido">Híbrido (Presencial + Home Office)</option>
                <option value="Remoto">100% Remoto</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Ciudad de Trabajo</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
              >
                <option value="Paraná">Paraná</option>
                <option value="Concordia">Concordia</option>
                <option value="Colón">Colón</option>
                <option value="Gualeguaychú">Gualeguaychú</option>
                <option value="Federación">Federación</option>
                <option value="Santa Fe Capital">Santa Fe Capital</option>
                <option value="Rosario">Rosario</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Remuneración Ofrecida</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Ej. $600.000 / mes o A convenir"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Tipo de Jornada</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
              >
                <option value="Tiempo Completo">Tiempo Completo</option>
                <option value="Medio Tiempo">Medio Tiempo</option>
                <option value="Pasantía">Pasantía</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Teléfono WhatsApp para Postulaciones</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 5493434567890"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Descripción / Requisitos de la Búsqueda</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Se requiere experiencia previa en atención y buena presencia."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#0047BA] to-[#00ADB5] hover:from-[#002878] hover:to-[#007C8A] text-white px-6 py-3 rounded-2xl font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Publicando...' : 'Publicar Búsqueda Laboral (Directa)'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECCIÓN DE MODERACIÓN: EMPLEOS PENDIENTES DE APROBACIÓN (SOLICITUDES DESDE /EMPLEOS) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Moderación Legal & Verificación B2B
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              Ofertas Laborales Pendientes de Aprobación ({pendingJobs.length})
            </h3>
            <p className="text-xs text-slate-500">
              Empleos publicados por usuarios/comercios desde la web que requieren ser revisados antes de publicarse visiblemente.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-300 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-extrabold">
            {pendingJobs.length} pendiente{pendingJobs.length === 1 ? '' : 's'}
          </div>
        </div>

        {pendingJobs.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-bold space-y-2">
            <ShieldCheck className="w-8 h-8 mx-auto text-emerald-500" />
            <p>¡No hay ofertas laborales pendientes de moderación! Todo al día.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingJobs.map((j) => (
              <div key={j.id} className="border-2 border-amber-300 rounded-2xl p-5 bg-amber-50/40 space-y-4 shadow-xs">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{j.title}</h4>
                    <p className="text-xs text-slate-600 font-bold flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{j.company}</span>
                      <span>•</span>
                      <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" />
                      <span>{j.cityName}</span>
                    </p>
                  </div>

                  <span className="bg-amber-200 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase border border-amber-400">
                    Pendiente de Revisión
                  </span>
                </div>

                <div className="space-y-1.5 text-xs bg-white p-3 rounded-xl border border-slate-200 text-slate-700">
                  <p className="flex items-center gap-2">
                    <Laptop className="w-3.5 h-3.5 text-[#00ADB5]" />
                    <span className="font-bold">Modalidad:</span>
                    <span className="font-black text-[#0047BA]">{j.workModality || 'Presencial'}</span>
                  </p>
                  <p><strong>Jornada:</strong> {j.jobType} • <strong>Sueldo:</strong> {j.salary}</p>
                  {j.phoneWhatsApp && (
                    <p className="flex items-center gap-1.5 text-slate-600">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Contacto WhatsApp: +{j.phoneWhatsApp}</span>
                    </p>
                  )}
                  {j.description && (
                    <p className="text-slate-600 italic pt-1 border-t border-slate-100">
                      "{j.description}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleRejectJob(j.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer"
                  >
                    Rechazar
                  </button>

                  <button
                    onClick={() => handleApproveJob(j.id, j.title)}
                    className="px-4 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprobar y Publicar en la Web</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Listado de Ofertas Laborales Activas en la Web */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#00ADB5]" />
          Búsquedas Laborales Publicadas Activas ({activeJobs.length})
        </h3>

        {activeJobs.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-bold">
            No hay empleos activos publicados por el momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeJobs.map((j) => (
              <div key={j.id} className="border border-slate-200 rounded-2xl p-5 hover:border-[#00ADB5] transition-all space-y-3 bg-slate-50/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-cyan-100 text-[#0047BA] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {j.workModality || 'Presencial'}
                    </span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {j.jobType}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">{j.salary}</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{j.title}</h4>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{j.company}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{j.cityName}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Publicación Verificada</span>
                  </span>
                  <button
                    onClick={() => handleDeleteJob(j.id)}
                    className="text-rose-600 hover:underline text-[11px] font-bold cursor-pointer"
                  >
                    Eliminar Búsqueda
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
