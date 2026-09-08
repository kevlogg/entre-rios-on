'use client';

import React, { useState } from 'react';
import { Gift, Trophy, Ticket, Users, RefreshCw, CheckCircle2, Sparkles, MapPin, Phone } from 'lucide-react';

const MOCK_PARTICIPANTS = [
  { id: '1', name: 'Martín Benítez', city: 'Paraná', phone: '343 4567890' },
  { id: '2', name: 'Sofía Casals', city: 'Colón', phone: '3447 411223' },
  { id: '3', name: 'Ignacio Roldán', city: 'Concordia', phone: '345 4998877' },
  { id: '4', name: 'Valeria Benítez', city: 'Gualeguaychú', phone: '3446 512345' },
  { id: '5', name: 'Lucía Maidana', city: 'Federación', phone: '3456 422334' },
];

export function RafflesManager() {
  const [winner, setWinner] = useState<{ id: string; name: string; city: string; phone: string } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const drawWinner = () => {
    setIsDrawing(true);
    setWinner(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * MOCK_PARTICIPANTS.length);
      setWinner(MOCK_PARTICIPANTS[randomIndex]);
      setIsDrawing(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-black text-[#004b87] flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#00a859]" />
            <span>Gestión de Sorteos ON & Selección de Ganadores</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Plataforma oficial de auditoría y ejecución de sorteos provinciales.
          </p>
        </div>

        <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Sorteo Mensual Activo: Septiembre 2026</span>
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#004b87]" />
            <span>Inscriptos Registrados</span>
          </span>
          <p className="text-3xl font-black text-[#004b87]">3.420</p>
          <p className="text-xs text-slate-500 font-medium">Vecinos de 17 departamentos</p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Gift className="w-3.5 h-3.5 text-[#00a859]" />
            <span>Premio Principal</span>
          </span>
          <p className="text-lg font-black text-slate-900 leading-snug">Estancia Termal 3D/2N</p>
          <p className="text-xs text-slate-500 font-medium">Federación para 2 personas</p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
            <Ticket className="w-3.5 h-3.5 text-amber-500" />
            <span>Fecha de Cierre</span>
          </span>
          <p className="text-lg font-black text-slate-900">30 Septiembre, 2026</p>
          <p className="text-xs text-emerald-700 font-bold">En curso • Auditado</p>
        </div>
      </div>

      {/* Winner Draw Selector Card */}
      <div className="bg-gradient-to-br from-slate-900 to-[#004b87] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
              Selector Aleatorio Transparente
            </span>
            <h4 className="text-2xl font-black mt-2">Realizar Sorteo del Ganador</h4>
            <p className="text-xs text-slate-200 font-medium mt-1">
              Presioná el botón para seleccionar al azar un participante registrado en la base provincial.
            </p>
          </div>

          <button
            onClick={drawWinner}
            disabled={isDrawing}
            className="bg-[#00a859] hover:bg-[#008746] disabled:opacity-50 text-white px-6 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isDrawing ? 'animate-spin' : ''}`} />
            <span>{isDrawing ? 'Sorteando...' : 'Sustraer Cupón Ganador'}</span>
          </button>
        </div>

        {/* Winner Result Display */}
        {winner && (
          <div className="bg-white text-slate-900 rounded-2xl p-6 space-y-4 border-2 border-amber-400 animate-in fade-in zoom-in-95 duration-300 shadow-xl">
            <div className="flex items-center gap-2 text-amber-600 font-black text-xs uppercase tracking-wider">
              <Trophy className="w-5 h-5 text-amber-500 fill-current" />
              <span>¡Ganador Seleccionado!</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-slate-100 py-3">
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Nombre Ganador</span>
                <p className="text-lg font-black text-slate-900">{winner.name}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Localidad</span>
                <p className="text-sm font-bold text-[#004b87] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00a859]" />
                  {winner.city}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Contacto WhatsApp</span>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {winner.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold pt-1">
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#00a859]" />
                Registrado y verificado en la base de Entre Ríos ON
              </span>

              <a
                href={`https://wa.me/549${winner.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hola ${winner.name}! Te contactamos oficialmente del portal Entre Ríos ON para avisarte que sos el GANADOR del sorteo termal en Federación.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm"
              >
                Notificar por WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
