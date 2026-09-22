'use client';

import React, { useState } from 'react';
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
  Send
} from 'lucide-react';

interface JobItem {
  id: string;
  title: string;
  company: string;
  city: string;
  type: 'Tiempo Completo' | 'Medio Tiempo' | 'Pasantía';
  salary: string;
  description: string;
  phone: string;
}

const INITIAL_JOBS: JobItem[] = [
  {
    id: 'j1',
    title: 'Vendedor B2B & Atención de Showroom',
    company: 'Citrus & Dulces del Uruguay',
    city: 'Concordia',
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
  const [jobs, setJobs] = useState<JobItem[]>(INITIAL_JOBS);
  const [candidates, setCandidates] = useState<CandidateProfile[]>(INITIAL_CANDIDATES);
  const [activeTab, setActiveTab] = useState<'offers' | 'candidates'>('offers');
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New Job Offer Form State
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newCity, setNewCity] = useState('Paraná');
  const [newSalary, setNewSalary] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Candidate Submission State
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [candName, setCandName] = useState('');
  const [candTitle, setCandTitle] = useState('');
  const [candCity, setCandCity] = useState('Paraná');
  const [candExp, setCandExp] = useState('');
  const [candSkills, setCandSkills] = useState('');
  const [candPhone, setCandPhone] = useState('');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCompany || !newPhone) return;

    const newJob: JobItem = {
      id: `j-${Date.now()}`,
      title: newTitle,
      company: newCompany,
      city: newCity,
      type: 'Tiempo Completo',
      salary: newSalary || 'A convenir',
      description: newDescription || 'Búsqueda activa publicada en ON MÁS.',
      phone: newPhone
    };

    setJobs([newJob, ...jobs]);
    setShowOfferModal(false);
    setNewTitle('');
    setNewCompany('');
    setNewSalary('');
    setNewDescription('');
    setNewPhone('');
    setSuccessMsg(`¡Tu oferta laboral "${newJob.title}" fue publicada exitosamente en Empleos ON MÁS!`);
    setTimeout(() => setSuccessMsg(null), 4000);
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
    setTimeout(() => setSuccessMsg(null), 4000);
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
              onClick={() => setShowOfferModal(true)}
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

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-150">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
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
                  <div className="flex items-center justify-between gap-2">
                    <span className="bg-cyan-100 text-[#0047BA] text-[10px] font-black px-3 py-1 rounded-full uppercase">
                      {job.type}
                    </span>
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
                  <span className="text-[11px] text-slate-400 font-bold">Verificado por ON MÁS</span>

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

        {/* Modal Ofertar Empleo */}
        {showOfferModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#00ADB5]" />
                  Publicar Oferta Laboral
                </h3>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
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
                    placeholder="Ej. Encargado de Salón / Vendedor"
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

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700">Ciudad</label>
                    <select
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
                    >
                      <option value="Paraná">Paraná</option>
                      <option value="Concordia">Concordia</option>
                      <option value="Colón">Colón</option>
                      <option value="Gualeguaychú">Gualeguaychú</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">Remuneración</label>
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

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00ADB5] to-[#0047BA] text-white py-3 rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  Publicar Oferta en Empleos ON MÁS
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Postularme / Perfil Candidato */}
        {showCandidateModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#00ADB5]" />
                  Publicar Perfil / Postulación Candidato
                </h3>
                <button
                  onClick={() => setShowCandidateModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
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
