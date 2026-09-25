'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { 
  Briefcase, 
  MapPin, 
  Building, 
  Plus, 
  CheckCircle2, 
  MessageCircle, 
  UserCheck, 
  ArrowLeft, 
  Search,
  Sparkles,
  Lock,
  User,
  Laptop,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { getJobs } from '@/lib/dal/portal';
import { createJobAction } from '@/server/actions/superadmin';
import { createClient } from '@/lib/supabase/client';

interface JobItemUI {
  id: string;
  title: string;
  company: string;
  city: string;
  workModality: string;
  type: string;
  salary: string;
  description: string;
  phone: string;
}

const INITIAL_JOBS: JobItemUI[] = [
  {
    id: 'j1',
    title: 'Vendedor B2B & Atención de Showroom',
    company: 'Citrus & Dulces del Uruguay',
    city: 'Concordia',
    workModality: 'Presencial',
    type: 'Tiempo Completo',
    salary: '$650.000 / mes',
    description: 'Buscamos persona proactiva con experiencia en ventas comerciales, manejo de WhatsApp Business y atención al cliente.',
    phone: '5493454891234'
  },
  {
    id: 'j2',
    title: 'Cocinero de Especialidad Pescados de Río',
    company: 'Comedor El Dorado',
    city: 'Paraná',
    workModality: 'Presencial',
    type: 'Tiempo Completo',
    salary: '$720.000 / mes',
    description: 'Restaurante de barranca solicita cocinero con experiencia comprobable en pescados a la parrilla y minutas.',
    phone: '5493434123456'
  },
  {
    id: 'j3',
    title: 'Recepcionista para Complejo Termal',
    company: 'Posada Sol de Federación',
    city: 'Federación',
    workModality: 'Híbrido',
    type: 'Medio Tiempo',
    salary: '$420.000 / mes',
    description: 'Atención al huésped, gestión de reservas y asesoramiento turístico. Buena presencia e idioma inglés deseable.',
    phone: '5493456112233'
  },
  {
    id: 'j4',
    title: 'Encargado de Logística & Reparto Regional',
    company: 'Alfarería & Cerámica Delta',
    city: 'Colón',
    workModality: 'Presencial',
    type: 'Tiempo Completo',
    salary: '$580.000 / mes',
    description: 'Despacho de encomiendas, embalaje de productos delicados y coordinación de fleteros en la provincia.',
    phone: '5493447998877'
  }
];

interface CandidateProfile {
  id: string;
  name: string;
  title: string;
  city: string;
  experience: string;
  skills: string;
  phone: string;
}

const INITIAL_CANDIDATES: CandidateProfile[] = [
  {
    id: 'c1',
    name: 'Mariana Gomez',
    title: 'Administrativa & Contable',
    city: 'Paraná',
    experience: '5 años en gestión comercial y software de facturación.',
    skills: 'Excel avanzado, Tango Gestión, Atención telefónica',
    phone: '5493434556677'
  },
  {
    id: 'c2',
    name: 'Lucas Peralta',
    title: 'Chofer Repartidor de Carga Ligera (Licencia B2)',
    city: 'Concordia',
    experience: 'Experiencia en logística de alimentos y distribución en ruta.',
    skills: 'Carnet profesional, conocimiento de rutas provinciales',
    phone: '5493454112244'
  }
];

export default function EmpleosPage() {
  const [jobs, setJobs] = useState<JobItemUI[]>([]);
  const [candidates, setCandidates] = useState<CandidateProfile[]>(INITIAL_CANDIDATES);
  const [activeTab, setActiveTab] = useState<'offers' | 'candidates'>('offers');
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Auth State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showAuthAlertModal, setShowAuthAlertModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // New Job Offer Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newModality, setNewModality] = useState('Presencial');
  const [newCity, setNewCity] = useState('Paraná');
  const [newSalary, setNewSalary] = useState('');
  const [newJobType, setNewJobType] = useState('Tiempo Completo');
  const [newDescription, setNewDescription] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Candidate Submission State
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [candName, setCandName] = useState('');
  const [candTitle, setCandTitle] = useState('');
  const [candCity, setCandCity] = useState('Paraná');
  const [candExp, setCandExp] = useState('');
  const [candSkills, setCandSkills] = useState('');
  const [candPhone, setCandPhone] = useState('');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check auth user on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user || null);
      } catch (e) {
        setCurrentUser(null);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    async function loadJobsFromSupabase() {
      try {
        const fetched = await getJobs();
        if (fetched && fetched.length > 0) {
          const mapped: JobItemUI[] = fetched.map((j) => ({
            id: j.id,
            title: j.title,
            company: j.company,
            city: j.cityName,
            workModality: j.workModality || 'Presencial',
            type: j.jobType || 'Tiempo Completo',
            salary: j.salary || 'A convenir',
            description: j.description,
            phone: j.phoneWhatsApp,
          }));
          setJobs(mapped);
        } else {
          setJobs(INITIAL_JOBS);
        }
      } catch (e) {
        console.warn('Error al cargar empleos:', e);
        setJobs(INITIAL_JOBS);
      }
    }
    loadJobsFromSupabase();
  }, []);

  const handleOpenOfferModal = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setShowAuthAlertModal(true);
        return;
      }
      setCurrentUser(user);
    } catch (e) {
      setShowAuthAlertModal(true);
      return;
    }
    setShowOfferModal(true);
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesCity = selectedCity === 'all' || j.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesQuery = !searchQuery.trim() || 
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesQuery;
  });

  const filteredCandidates = candidates.filter((c) => {
    const matchesCity = selectedCity === 'all' || c.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesQuery = !searchQuery.trim() ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesQuery;
  });

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany || !newPhone || isSubmitting) return;

    // Strict Auth Check before posting
    if (!currentUser) {
      setShowOfferModal(false);
      setShowAuthAlertModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createJobAction({
        title: newTitle,
        company: newCompany,
        cityName: newCity,
        workModality: newModality,
        jobType: newJobType,
        salary: newSalary || 'A convenir',
        description: newDescription || 'Búsqueda laboral activa enviada desde la web.',
        phoneWhatsApp: newPhone,
        isSuperAdmin: false, // REQUIRES SUPERADMIN APPROVAL
      });

      if (res.success) {
        setShowOfferModal(false);
        setNewTitle('');
        setNewCompany('');
        setNewSalary('');
        setNewDescription('');
        setNewPhone('');
        setSuccessMsg(
          `¡Oferta laboral enviada a revisión! Tu aviso para "${newTitle}" fue recibido y se encuentra pendiente de aprobación por el equipo SuperAdmin para verificar que la información sea legal. Una vez aprobada, aparecerá visible públicamente.`
        );
        setTimeout(() => setSuccessMsg(null), 8000);
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.warn('Error al crear empleo:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName || !candTitle || !candPhone) return;

    const newCand: CandidateProfile = {
      id: `c-${Date.now()}`,
      name: candName,
      title: candTitle,
      city: candCity,
      experience: candExp || 'Experiencia comprobable en el rubro.',
      skills: candSkills || 'Proactivo y con disponibilidad inmediata.',
      phone: candPhone
    };

    setCandidates([newCand, ...candidates]);
    setShowCandidateModal(false);
    setCandName('');
    setCandTitle('');
    setCandExp('');
    setCandSkills('');
    setCandPhone('');
    setSuccessMsg(`¡Tu perfil de candidato para "${newCand.title}" fue publicado exitosamente!`);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  return (
    <DynamicLayoutWrapper>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-[#00ADB5] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <span className="text-[#0047BA]">Empleos & Oportunidades Laborales</span>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full">
              <Briefcase className="w-4 h-4 text-[#00E5E8]" />
              <span>Bolsa de Trabajo Regional • ON MÁS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Empleos & Oportunidades Laborales
            </h1>

            <p className="text-sm text-slate-100 font-medium leading-relaxed">
              Encontrá trabajo, postuláte directamente o publicá ofertas laborales y perfiles profesionales en la red provincial ON MÁS.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={handleOpenOfferModal}
              className="bg-white hover:bg-slate-100 text-[#0047BA] font-extrabold text-xs px-5 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#00ADB5]" />
              <span>Publicar Oferta de Empleo</span>
            </button>

            <button
              onClick={() => setShowCandidateModal(true)}
              className="bg-gradient-to-r from-[#00E5E8] to-[#00ADB5] hover:from-[#00ADB5] hover:to-[#007C8A] text-slate-950 font-black text-xs px-5 py-3.5 rounded-2xl shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Postularme / Cargar mi Perfil</span>
            </button>
          </div>
        </div>

        {/* Banner Mensaje de Éxito / Notificación */}
        {successMsg && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 flex items-start gap-3.5 text-emerald-950 text-xs font-bold animate-in fade-in duration-200 shadow-md">
            <Clock className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-sm font-black text-emerald-900 block">Solicitud de Empleo Enviada</span>
              <p className="text-slate-700 leading-relaxed font-semibold">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Tab Switcher & Filters */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'offers'
                  ? 'bg-gradient-to-r from-[#0047BA] to-[#00ADB5] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ofertas de Trabajo ({filteredJobs.length})
            </button>

            <button
              onClick={() => setActiveTab('candidates')}
              className={`flex-1 md:flex-none px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'candidates'
                  ? 'bg-gradient-to-r from-[#0047BA] to-[#00ADB5] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Candidatos & Perfiles ({filteredCandidates.length})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Buscar puesto, rubro o nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 w-full sm:w-auto"
            >
              <option value="all">Todas las ciudades</option>
              <option value="Paraná">Paraná</option>
              <option value="Concordia">Concordia</option>
              <option value="Colón">Colón</option>
              <option value="Federación">Federación</option>
              <option value="Gualeguaychú">Gualeguaychú</option>
              <option value="Santa Fe Capital">Santa Fe Capital</option>
              <option value="Rosario">Rosario</option>
            </select>
          </div>
        </div>

        {/* Content Grid based on activeTab */}
        {activeTab === 'offers' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-cyan-100 text-[#0047BA] text-[10px] font-black px-3 py-1 rounded-full uppercase flex items-center gap-1">
                        <Laptop className="w-3 h-3 text-[#00ADB5]" />
                        <span>{job.workModality || 'Presencial'}</span>
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                        {job.type}
                      </span>
                    </div>

                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {job.salary}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">{job.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mt-1">
                      <span className="flex items-center gap-1 text-[#0047BA]">
                        <Building className="w-3.5 h-3.5" /> {job.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" /> {job.city}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {job.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verificado ON MÁS</span>
                  </span>

                  <a
                    href={`https://wa.me/${job.phone}?text=${encodeURIComponent(`Hola! Me interesa postularme a la búsqueda de "${job.title}" publicada en Empleos ON MÁS.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Postularme por WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCandidates.map((cand) => (
              <div
                key={cand.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-3 py-1 rounded-full uppercase">
                      Perfil Candidato Vecino
                    </span>
                    <span className="text-xs font-bold text-[#0047BA] flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" /> {cand.city}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">{cand.name}</h3>
                    <p className="text-xs font-extrabold text-[#0047BA] mt-0.5">{cand.title}</p>
                  </div>

                  <div className="space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                    <span className="text-[10px] font-black uppercase text-slate-400 block">Experiencia & Habilidades</span>
                    <p className="text-slate-700 font-medium">{cand.experience}</p>
                    <p className="text-slate-500 font-medium text-[11px] pt-1 border-t border-slate-200">
                      <strong>Conocimientos:</strong> {cand.skills}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-bold">Disponible para Entrevista</span>

                  <a
                    href={`https://wa.me/${cand.phone}?text=${encodeURIComponent(`Hola ${cand.name}! Te contactamos desde un comercio en ON MÁS porque nos interesó tu perfil de "${cand.title}".`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Contactar Candidato</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL DE ALERTA DE REGISTRO REQUERIDO (SI NO ESTÁ AUTENTICADO) */}
        {showAuthAlertModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 text-center">
              <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                <Lock className="w-8 h-8" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Registro Requerido para Publicar</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Para publicar una oferta de empleo debés estar registrado e iniciar sesión en tu cuenta (ya sea como Vecino o Comercio). Esto nos permite verificar que la información sea genuina y legal para proteger la comunidad de ON MÁS.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => setShowAuthAlertModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-3 rounded-xl cursor-pointer"
                >
                  Entendido / Cerrar
                </button>
                <Link
                  href="/login"
                  className="flex-1 bg-gradient-to-r from-[#0047BA] to-[#00ADB5] hover:from-[#002878] hover:to-[#007C8A] text-white font-black text-xs py-3 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <User className="w-4 h-4" />
                  <span>Iniciar Sesión / Registrarme</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Modal Ofertar Empleo */}
        {showOfferModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 my-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#00ADB5]" />
                    Publicar Oferta Laboral
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Suelta a revisión previa del equipo SuperAdmin.</p>
                </div>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Título del Puesto *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Encargado de Salón / Vendedor B2B"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Nombre de la Empresa o Comercio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Bodega La Candelaria"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                {/* MODALIDAD DE TRABAJO (REQ: PRESENCIAL, HÍBRIDO, REMOTO) */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#0047BA] flex items-center gap-1">
                      <Laptop className="w-3.5 h-3.5 text-[#00ADB5]" />
                      <span>Modalidad *</span>
                    </label>
                    <select
                      value={newModality}
                      onChange={(e) => setNewModality(e.target.value)}
                      className="w-full bg-cyan-50 border border-cyan-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-extrabold"
                    >
                      <option value="Presencial">Presencial</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Remoto">100% Remoto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">Ciudad de Trabajo</label>
                    <select
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
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
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">Tipo de Jornada</label>
                    <select
                      value={newJobType}
                      onChange={(e) => setNewJobType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
                    >
                      <option value="Tiempo Completo">Tiempo Completo</option>
                      <option value="Medio Tiempo">Medio Tiempo</option>
                      <option value="Pasantía">Pasantía</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">Remuneración / Sueldo</label>
                    <input
                      type="text"
                      placeholder="Ej. $650.000 / mes"
                      value={newSalary}
                      onChange={(e) => setNewSalary(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Teléfono WhatsApp para Postulaciones *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 5493434123456"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Descripción / Requisitos de la Búsqueda</label>
                  <textarea
                    rows={2}
                    placeholder="Detalles sobre tareas, horarios y requisitos..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Tu publicación pasará a revisión por el SuperAdmin antes de mostrarse en la web.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#00ADB5] to-[#0047BA] text-white py-3 rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  {isSubmitting ? 'Enviando a Revisión...' : 'Enviar Oferta a Revisión SuperAdmin'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Postularme / Perfil Candidato */}
        {showCandidateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 my-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#00ADB5]" />
                  Publicar Perfil / Postulación Candidato
                </h3>
                <button
                  onClick={() => setShowCandidateModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCandidate} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700">Nombre y Apellido *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Valeria Benítez"
                    value={candName}
                    onChange={(e) => setCandName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">Puesto / Oficio *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Secretaria / Electricista"
                      value={candTitle}
                      onChange={(e) => setCandTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">Ciudad de Residencia</label>
                    <select
                      value={candCity}
                      onChange={(e) => setCandCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
                    >
                      <option value="Paraná">Paraná</option>
                      <option value="Concordia">Concordia</option>
                      <option value="Colón">Colón</option>
                      <option value="Gualeguaychú">Gualeguaychú</option>
                      <option value="Federación">Federación</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Teléfono WhatsApp para Entrevistas *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 5493446512345"
                    value={candPhone}
                    onChange={(e) => setCandPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Experiencia Laboral Previa</label>
                  <textarea
                    rows={2}
                    placeholder="Resumen de trabajos anteriores..."
                    value={candExp}
                    onChange={(e) => setCandExp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700">Habilidades & Idiomas / Disponibilidad</label>
                  <input
                    type="text"
                    placeholder="Ej. Excel, Licencia B1, Disponibilidad full time"
                    value={candSkills}
                    onChange={(e) => setCandSkills(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00ADB5] to-[#0047BA] text-white py-3 rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  Publicar mi Perfil de Candidato
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </DynamicLayoutWrapper>
  );
}
