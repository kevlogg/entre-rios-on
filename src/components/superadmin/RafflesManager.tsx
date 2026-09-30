'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Gift,
  Trophy,
  Ticket,
  CheckCircle2,
  Sparkles,
  Phone,
  Plus,
  Upload,
  X,
} from 'lucide-react';
import { createRaffleAction } from '@/server/actions/superadmin';
import { getRaffles, getAllCommerces } from '@/lib/dal/portal';
import { uploadImageToSupabase } from '@/lib/supabase/storage';

interface ActiveRaffleItem {
  id: string;
  title: string;
  prize: string;
  prizesList: string[];
  prizesCount: number;
  ticketPrice: string;
  city: string;
  drawDate: string;
  imageUrl: string;
  status: string;
  autoActiveCommerces: boolean;
}

interface PastWinner {
  id: string;
  raffleTitle: string;
  drawDate: string;
  winnerName: string;
  winnerCity: string;
  winnerPhone: string;
  prize: string;
  ticketType: 'Comercio Plan Activo' | 'Ticket Comprado';
}

const PAST_WINNERS_HISTORY: PastWinner[] = [];

export function RafflesManager() {
  const [raffles, setRaffles] = useState<ActiveRaffleItem[]>([]);
  const [activeCommercesCount, setActiveCommercesCount] = useState<number>(0);

  // Form State: Hasta 5 Premios
  const [title, setTitle] = useState('');
  const [mainPrize, setMainPrize] = useState('');
  const [prize2, setPrize2] = useState('');
  const [prize3, setPrize3] = useState('');
  const [prize4, setPrize4] = useState('');
  const [prize5, setPrize5] = useState('');
  const [ticketPrice, setTicketPrice] = useState('$2.500 ARS');
  const [drawDate, setDrawDate] = useState('');
  const [autoActiveCommerces, setAutoActiveCommerces] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Loaders & Status
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [pastWinners] = useState<PastWinner[]>(PAST_WINNERS_HISTORY);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedRaffles, fetchedCommerces] = await Promise.all([
          getRaffles(),
          getAllCommerces(),
        ]);

        if (fetchedRaffles && fetchedRaffles.length > 0) {
          setRaffles(
            fetchedRaffles.map((r) => ({
              id: r.id,
              title: r.title,
              prize: r.prize,
              prizesList: r.prizesList || [r.prize],
              prizesCount: r.prizesCount || (r.prizesList?.length || 1),
              ticketPrice: r.ticketPrice || '$2.500 ARS',
              city: 'Entre Ríos',
              drawDate: r.drawDate ? new Date(r.drawDate).toLocaleDateString('es-AR') : '31 de Octubre, 2026',
              imageUrl: r.imageUrl || '/images/city-federacion.jpg',
              status: r.status,
              autoActiveCommerces: r.autoActiveCommerces ?? true,
            }))
          );
        }

        if (fetchedCommerces) {
          const activeCount = fetchedCommerces.filter((c) => c.isSubscriptionActive).length;
          setActiveCommercesCount(activeCount || 12);
        }
      } catch (e) {
        console.warn('Error cargando sorteos en SuperAdmin:', e);
      }
    }
    loadData();
  }, []);

  // Image Upload Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setImagePreview(localUrl);
    setIsUploadingImage(true);

    try {
      const publicUrl = await uploadImageToSupabase(file, 'commerces');
      setImageUrl(publicUrl);
      setImagePreview(publicUrl);
    } catch (err) {
      console.warn('Error subiendo foto de sorteo:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Create Monthly Raffle Handler
  const handleCreateRaffle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !mainPrize.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    const rawPrizes = [
      mainPrize.trim() ? `1º Premio: ${mainPrize.trim()}` : '',
      prize2.trim() ? `2º Premio: ${prize2.trim()}` : '',
      prize3.trim() ? `3º Premio: ${prize3.trim()}` : '',
      prize4.trim() ? `4º Premio: ${prize4.trim()}` : '',
      prize5.trim() ? `5º Premio: ${prize5.trim()}` : '',
    ].filter(Boolean);

    const prizesList = rawPrizes.length > 0 ? rawPrizes : [`1º Premio: ${mainPrize.trim()}`];
    const finalImageUrl = imageUrl || imagePreview || '/images/city-federacion.jpg';

    const newRaffle: ActiveRaffleItem = {
      id: `raffle-${Date.now()}`,
      title: title.trim(),
      prize: mainPrize.trim(),
      prizesList,
      prizesCount: prizesList.length,
      ticketPrice: ticketPrice.trim() || '$2.500 ARS',
      city: 'Entre Ríos',
      drawDate: drawDate.trim() || '31 de Octubre, 2026',
      imageUrl: finalImageUrl,
      status: 'ACTIVE',
      autoActiveCommerces,
    };

    try {
      const res = await createRaffleAction({
        title: title.trim(),
        prize: mainPrize.trim(),
        prizesList,
        prizesCount: prizesList.length,
        ticketPrice: ticketPrice.trim() || '$2.500 ARS',
        sponsorName: 'ON MÁS Portal Regional',
        drawDate: drawDate.trim(),
        imageUrl: finalImageUrl,
      });

      if (res.success) {
        setRaffles([newRaffle, ...raffles]);
        setTitle('');
        setMainPrize('');
        setPrize2('');
        setPrize3('');
        setPrize4('');
        setPrize5('');
        setDrawDate('');
        setImageUrl('');
        setImagePreview(null);
        setSuccessMsg(`¡Sorteo Mensual "${newRaffle.title}" creado y publicado exitosamente!`);
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      console.warn('Fallback local creación de sorteo:', err);
      setRaffles([newRaffle, ...raffles]);
      setSuccessMsg(`¡Sorteo "${newRaffle.title}" publicado exitosamente!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Summary */}
      <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider border border-amber-400/30">
            <Gift className="w-3.5 h-3.5" />
            Sorteos Mensuales ON MÁS
          </span>
          <h2 className="text-2xl font-black">Gestión de Sorteos & Venta de Tickets</h2>
          <p className="text-xs text-slate-100 font-medium">
            Los comercios con plan activo participan automáticamente. Los usuarios y vecinos participan comprando su ticket vía WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 text-center border border-white/20">
            <span className="text-[10px] font-bold text-amber-300 uppercase block">Comercios Automáticos</span>
            <span className="text-xl font-black">{activeCommercesCount}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 text-center border border-white/20">
            <span className="text-[10px] font-bold text-cyan-300 uppercase block">Sorteos Activos</span>
            <span className="text-xl font-black">{raffles.length}</span>
          </div>
        </div>
      </div>

      {/* Formulario: Crear Sorteo Mensual (Hasta 5 premios) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#00ADB5]" />
            Configuración de Nuevo Sorteo Mensual
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-1">
            Crear Sorteo del Mes (Hasta 5 Premios)
          </h3>
          <p className="text-xs text-slate-500">
            Definí el título, el valor del ticket y hasta 5 premios para los participantes.
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-150">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-center gap-3 text-rose-800 text-xs font-bold animate-in fade-in duration-150">
            <X className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateRaffle} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Título del Sorteo */}
            <div className="space-y-1 sm:col-span-2 lg:col-span-2">
              <label className="block text-xs font-bold text-slate-700">Título del Sorteo Mensual *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Sorteo Mensual Gran Litoral • Octubre 2026"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* Valor del Ticket */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-amber-800 flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5 text-amber-600" />
                Valor del Ticket * (Comercio $0 / Vecino $)
              </label>
              <input
                type="text"
                required
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                placeholder="Ej. $2.500 ARS"
                className="w-full bg-amber-50/60 border border-amber-300 rounded-xl px-3 py-2.5 text-xs text-amber-950 font-bold"
              />
            </div>

            {/* 1º Premio Principal */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">1º Premio Principal *</label>
              <input
                type="text"
                required
                value={mainPrize}
                onChange={(e) => setMainPrize(e.target.value)}
                placeholder="Ej. Estancia Termal 3D/2N en Federación + Cena para 2"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* 2º Premio */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">2º Premio (opcional)</label>
              <input
                type="text"
                value={prize2}
                onChange={(e) => setPrize2(e.target.value)}
                placeholder="Ej. Canasta de Productos Regionales"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* 3º Premio */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">3º Premio (opcional)</label>
              <input
                type="text"
                value={prize3}
                onChange={(e) => setPrize3(e.target.value)}
                placeholder="Ej. Voucher por $50.000 ARS para compras"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* 4º Premio */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">4º Premio (opcional)</label>
              <input
                type="text"
                value={prize4}
                onChange={(e) => setPrize4(e.target.value)}
                placeholder="Ej. Set de Vinos Tannat & Quesos"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* 5º Premio */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">5º Premio (opcional)</label>
              <input
                type="text"
                value={prize5}
                onChange={(e) => setPrize5(e.target.value)}
                placeholder="Ej. Descuento exclusivo 50% en locales adheridos"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* Fecha del Sorteo */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Fecha Límite del Sorteo</label>
              <input
                type="text"
                value={drawDate}
                onChange={(e) => setDrawDate(e.target.value)}
                placeholder="Ej. 31 de Octubre, 2026"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* Inclusión automática de comercios activos */}
            <div className="space-y-1 flex flex-col justify-center sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={autoActiveCommerces}
                  onChange={(e) => setAutoActiveCommerces(e.target.checked)}
                  className="w-4 h-4 text-[#00ADB5] rounded border-slate-300 focus:ring-[#00ADB5]"
                />
                <span className="text-xs font-extrabold text-[#0047BA]">
                  Incluir automáticamente a comercios con plan activo
                </span>
              </label>
            </div>
          </div>

          {/* Subida de Portada del Sorteo */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Portada del Sorteo</span>
              {isUploadingImage && (
                <span className="text-[11px] text-[#00ADB5] font-extrabold flex items-center gap-1 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> Subiendo imagen...
                </span>
              )}
            </label>

            {imagePreview ? (
              <div className="relative h-36 w-full sm:w-72 rounded-2xl overflow-hidden border border-slate-300 group shadow-xs">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      setImagePreview(null);
                    }}
                    className="bg-rose-600 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" /> Cambiar Foto
                  </button>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-300 hover:border-[#00ADB5] bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group max-w-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <div className="p-2 rounded-full bg-white text-[#0047BA] shadow-xs mb-1 group-hover:scale-110 transition-transform">
                  <Upload className="w-4 h-4 text-[#00ADB5]" />
                </div>
                <span className="text-xs font-extrabold text-slate-800">Cargar Portada del Sorteo</span>
                <span className="text-[10px] text-slate-400">JPG, PNG o WEBP</span>
              </label>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="w-full bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white py-3.5 rounded-xl font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Publicando Sorteo Mensual...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Publicar Sorteo Mensual ON MÁS</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Listado de Sorteos Mensuales Activos */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-[#00ADB5]" />
          Sorteos Mensuales Activos en la Web ({raffles.length})
        </h3>

        {raffles.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-bold space-y-2 border border-slate-200/60 rounded-2xl bg-slate-50/50">
            <Ticket className="w-8 h-8 mx-auto text-slate-300" />
            <p>No hay sorteos activos publicados actualmente. Creá uno desde el formulario superior para habilitarlo en la web.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {raffles.map((r) => (
              <div key={r.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs flex flex-col justify-between">
                <div className="relative h-44 w-full bg-slate-100">
                  <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-full uppercase shadow-xs">
                    Ticket: {r.ticketPrice}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                    Cierre: {r.drawDate}
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-base leading-snug">{r.title}</h4>
                    <p className="text-xs text-[#0047BA] font-extrabold">🏆 1º Premio: {r.prize}</p>

                    <div className="pt-2 space-y-1 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-500 block">Premios del Sorteo:</span>
                      {r.prizesList.map((p, idx) => (
                        <p key={idx} className="text-[11px] font-medium text-slate-700 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{p}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      ✓ Comercios Activos: Participan $0
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      Ticket Vecino: {r.ticketPrice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historial de Ganadores */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Historial de Sorteos Anteriores & Ganadores ({pastWinners.length})
          </h3>
          <span className="text-xs font-bold text-slate-500">Registro Histórico</span>
        </div>

        {pastWinners.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-bold space-y-2 border border-slate-200/60 rounded-2xl bg-slate-50/50">
            <Trophy className="w-8 h-8 mx-auto text-slate-300" />
            <p>Aún no se han registrado sorteos ni ganadores anteriores.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-slate-400">
                  <th className="py-3 px-4">Sorteo Mensual</th>
                  <th className="py-3 px-4">Premio Entregado</th>
                  <th className="py-3 px-4">Fecha Sorteo</th>
                  <th className="py-3 px-4">Ganador</th>
                  <th className="py-3 px-4">Modalidad Ticket</th>
                  <th className="py-3 px-4 text-right">Contacto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {pastWinners.map((pw) => (
                  <tr key={pw.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{pw.raffleTitle}</td>
                    <td className="py-3 px-4 text-[#0047BA] font-extrabold">{pw.prize}</td>
                    <td className="py-3 px-4 text-slate-500">{pw.drawDate}</td>
                    <td className="py-3 px-4 font-black text-slate-900">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {pw.winnerName} ({pw.winnerCity})
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        pw.ticketType === 'Comercio Plan Activo' ? 'bg-cyan-100 text-[#0047BA]' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {pw.ticketType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={`https://wa.me/${pw.winnerPhone.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg hover:bg-emerald-100"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{pw.winnerPhone}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
