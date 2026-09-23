'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, CheckCircle2, UserCheck, MapPin, Building, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { getJobs } from '@/lib/dal/portal';
import { createJobAction } from '@/server/actions/superadmin';

interface JobOffer {
  id: string;
  title: string;
  company: string;
  city: string;
  type: string;
  salary: string;
  applicantsCount: number;
  status: string;
}

export function JobsManager() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [city, setCity] = useState('Paraná');
  const [salary, setSalary] = useState('');
  const [type, setType] = useState<string>('Tiempo Completo');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      try {
        const fetched = await getJobs();
        if (fetched) {
          setJobs(
            fetched.map((j) => ({
              id: j.id,
              title: j.title,
              company: j.company,
              city: j.cityName,
              type: j.jobType || 'Tiempo Completo',
              salary: j.salary || 'A convenir',
              applicantsCount: 0,
              status: j.status || 'activa',
            }))
          );
        }
      } catch (e) {
        console.warn('Error cargando empleos:', e);
      }
    }
    loadJobs();
  }, []);


  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || isSubmitting) return;

    setIsSubmitting(true);
    const newJob: JobOffer = {
      id: `job-${Date.now()}`,
      title,
      company,
      city,
      type,
      salary: salary || 'A convenir',
      applicantsCount: 0,
      status: 'activa'
    };

    try {
      await createJobAction({
        title,
        company,
        cityName: city,
        jobType: type,
        salary: salary || 'A convenir',
        description: `Búsqueda laboral publicada para ${company} en ${city}.`,
        phoneWhatsApp: '5493434567890',
      });
    } catch (e) {
      console.warn('Error creando trabajo en Supabase:', e);
    } finally {
      setIsSubmitting(false);
    }

    setJobs([newJob, ...jobs]);
    setTitle('');
    setCompany('');
    setSalary('');
    setSuccessMsg(`¡Búsqueda laboral "${newJob.title}" publicada en la sección Empleos!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };


  return (
    <div className="space-y-8">
      {/* Formulario de Alta de Empleo */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#00ADB5]" />
            Sección Empleos & Trabajo
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Publicar Nueva Búsqueda Laboral
          </h2>
          <p className="text-xs text-slate-500">
            Ofrecé puestos de trabajo regionales para que los vecinos de Entre Ríos y la zona se postulen directamente.
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-150">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateJob} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Título del Puesto</label>
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
            <label className="block text-xs font-bold text-slate-700">Empresa o Comercio Solicita</label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Ej. Bodega La Candelaria"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
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
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
            >
              <option value="Tiempo Completo">Tiempo Completo</option>
              <option value="Medio Tiempo">Medio Tiempo</option>
              <option value="Pasantía">Pasantía</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0047BA] to-[#00ADB5] hover:from-[#002878] hover:to-[#007C8A] text-white py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Búsqueda Laboral</span>
            </button>
          </div>
        </form>
      </div>

      {/* Listado de Ofertas Laborales Activas */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#00ADB5]" />
          Búsquedas Laborales Publicadas ({jobs.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((j) => (
            <div key={j.id} className="border border-slate-200 rounded-2xl p-5 hover:border-[#00ADB5] transition-all space-y-3 bg-slate-50/50">
              <div className="flex items-start justify-between gap-2">
                <span className="bg-cyan-100 text-[#0047BA] text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  {j.type}
                </span>
                <span className="text-xs font-bold text-emerald-700">{j.salary}</span>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{j.title}</h4>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{j.company}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{j.city}</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-bold flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>{j.applicantsCount} postulaciones</span>
                </span>
                <button
                  onClick={() => setJobs(jobs.filter((item) => item.id !== j.id))}
                  className="text-rose-600 hover:underline text-[11px] font-bold"
                >
                  Cerrar Búsqueda
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Listado de Perfiles de Candidatos Registrados */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" />
            Candidatos Postulados desde la Web (2 Registrados)
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Base de Talentos Activa
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-xs">Mariana Gomez</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-black px-2 py-0.5 rounded-full">
                Paraná
              </span>
            </div>
            <p className="text-xs font-bold text-[#0047BA]">Administrativa & Contable</p>
            <p className="text-[11px] text-slate-600">5 años en gestión comercial y software de facturación.</p>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Contactar: 5493434556677</span>
              <span className="text-emerald-700 font-bold">Verificado</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-xs">Lucas Peralta</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-black px-2 py-0.5 rounded-full">
                Concordia
              </span>
            </div>
            <p className="text-xs font-bold text-[#0047BA]">Chofer Repartidor (Licencia B2)</p>
            <p className="text-[11px] text-slate-600">Experiencia en logística de alimentos y distribución en ruta.</p>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Contactar: 5493454112244</span>
              <span className="text-emerald-700 font-bold">Verificado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
