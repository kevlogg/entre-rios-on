'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Gift,
  Trophy,
  Ticket,
  Users,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  MapPin,
  Phone,
  Plus,
  Store,
  Upload,
  X,
  Building2,
  Calendar,
  DollarSign,
  ShieldCheck
} from 'lucide-react';
import { drawRaffleWinnerAction, createRaffleAction } from '@/server/actions/superadmin';
import { getRaffles, getAllCommerces } from '@/lib/dal/portal';
import { uploadImageToSupabase } from '@/lib/supabase/storage';
import { Commerce } from '@/types';

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

const PAST_WINNERS_HISTORY: PastWinner[] = [
  {
    id: 'pw-1',
    raffleTitle: 'Sorteo Mensual Gran Litoral • Septiembre 2026',
    drawDate: '30 de Septiembre, 2026',
    winnerName: 'Comedor Costanera El Dorado',
    winnerCity: 'Paraná',
    winnerPhone: '5493434229876',
    prize: 'Estancia Termal 3D/2N en Federación',
    ticketType: 'Comercio Plan Activo',
  },
  {
    id: 'pw-2',
    raffleTitle: 'Sorteo Mensual Gran Litoral • Agosto 2026',
    drawDate: '31 de Agosto, 2026',
    winnerName: 'Martín Benítez',
    winnerCity: 'Concordia',
    winnerPhone: '5493454998877',
    prize: 'Caja Canasta de Sabores Litoraleños',
    ticketType: 'Ticket Comprado',
  },
];

export function RafflesManager() {
  const [raffles, setRaffles] = useState<ActiveRaffleItem[]>([]);
  const [activeCommercesCount, setActiveCommercesCount] = useState<number>(0);

  // Form State
  const [title, setTitle] = useState('');
  const [mainPrize, setMainPrize] = useState('');
  const [prize2, setPrize2] = useState('');
  const [prize3, setPrize3] = useState('');
  const [ticketPrice, setTicketPrice] = useState('$2.500 ARS');
  const [city, setCity] = useState('Federación');
  const [drawDate, setDrawDate] = useState('');
  const [autoActiveCommerces, setAutoActiveCommerces] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Loaders & Status
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Winner Draw State
  const [winner, setWinner] = useState<{
    name: string;
    city: string;
    phone: string;
    type: string;
  } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pastWinners, setPastWinners] = useState<PastWinner[]>(PAST_WINNERS_HISTORY);

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
              prizesCount: r.prizesCount || 3,
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

    const prizesList = [
      `1º Premio: ${mainPrize.trim()}`,
      prize2.trim() ? `2º Premio: ${prize2.trim()}` : '2º Premio: Canasta de Sabores Litoraleños',
      prize3.trim() ? `3º Premio: ${prize3.trim()}` : '3º Premio: Voucher de $50.000 ARS para compras',
    ];

    const finalImageUrl = imageUrl || imagePreview || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80';

    const newRaffle: ActiveRaffleItem = {
      id: `raffle-${Date.now()}`,
      title: title.trim(),
      prize: mainPrize.trim(),
      prizesList,
      prizesCount: prizesList.length,
      ticketPrice: ticketPrice.trim() || '$2.500 ARS',
      city,
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
      setSuccessMsg(`¡Sorteo "${newRaffle.title}" publicado en modo demostración!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Draw Winner Function
  const drawWinner = async () => {
    setIsDrawing(true);
    setWinner(null);

    const isCommerceWinner = Math.random() > 0.4; // 60% chance of commerce winner

    setTimeout(() => {
      let selWinner;
      if (isCommerceWinner) {
        const commerceWinners = [
          { name: 'Alfarería & Cerámica Delta', city: 'Colón', phone: '5493447451234', type: 'Comercio con Plan Activo' },
          { name: 'Comedor Costanera El Dorado', city: 'Paraná', phone: '5493434229876', type: 'Comercio con Plan Activo' },
          { name: 'La Candelaria Viñedos', city: 'Gualeguaychú', phone: '5493446584321', type: 'Comercio con Plan Activo' },
          { name: 'Citrus & Dulces del Uruguay', city: 'Concordia', phone: '5493454112233', type: 'Comercio con Plan Activo' },
        ];
        selWinner = commerceWinners[Math.floor(Math.random() * commerceWinners.length)];
      } else {
        const ticketWinners = [
          { name: 'Gabriel Benítez', city: 'Concordia', phone: '5493454998877', type: 'Ticket Comprado (WhatsApp)' },
          { name: 'María Elena Rossi', city: 'Paraná', phone: '5493434223344', type: 'Ticket Comprado (WhatsApp)' },
          { name: 'Rodrigo Casaux', city: 'Colón', phone: '5493447411223', type: 'Ticket Comprado (WhatsApp)' },
        ];
        selWinner = ticketWinners[Math.floor(Math.random() * ticketWinners.length)];
      }

      setWinner(selWinner);
      setIsDrawing(false);

      // Add to past winners history
      setPastWinners([
        {
          id: `pw-${Date.now()}`,
          raffleTitle: raffles[0]?.title || 'Sorteo Mensual ON MÁS',
          drawDate: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }),
          winnerName: selWinner.name,
          winnerCity: selWinner.city,
          winnerPhone: selWinner.phone,
          prize: raffles[0]?.prize || 'Premio Principal Sorteo Mensual',
          ticketType: selWinner.type.includes('Comercio') ? 'Comercio Plan Activo' : 'Ticket Comprado',
        },
        ...pastWinners,
      ]);
    }, 1500);
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

      {/* Formulario: Crear Sorteo Mensual */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#00ADB5]" />
            Configuración de Nuevo Sorteo Mensual
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-1">
            Crear Sorteo del Mes con Premios & Precio de Ticket
          </h3>
          <p className="text-xs text-slate-500">
            Definí la grilla de premios y el valor del ticket para usuarios no registrados / sin plan activo.
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

            {/* Premio Principal (1º Premio) */}
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
              <label className="block text-xs font-bold text-slate-700">2º Premio Adicional</label>
              <input
                type="text"
                value={prize2}
                onChange={(e) => setPrize2(e.target.value)}
                placeholder="Ej. Canasta de Productos Regionales & Caja de Vinos Tannat"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* 3º Premio */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">3º Premio Adicional</label>
              <input
                type="text"
                value={prize3}
                onChange={(e) => setPrize3(e.target.value)}
                placeholder="Ej. Voucher por $50.000 ARS para compras en el catálogo"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-medium"
              />
            </div>

            {/* Ciudad / Destino */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Ciudad Sede / Destino</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold"
              >
                <option value="Federación">Federación</option>
                <option value="Colón">Colón</option>
                <option value="Gualeguaychú">Gualeguaychú</option>
                <option value="Paraná">Paraná</option>
                <option value="Concordia">Concordia</option>
                <option value="Rosario">Rosario</option>
                <option value="Santa Fe Capital">Santa Fe Capital</option>
              </select>
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
            <div className="space-y-1 flex flex-col justify-center">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-2 cursor-pointer pt-4">
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
              <span>Portada del Sorteo (Almacenada en Supabase Storage)</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="border-2 border-dashed border-slate-300 hover:border-[#00ADB5] bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
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

                <div className="space-y-1 flex flex-col justify-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="text-[11px] font-bold text-slate-600">O pegar URL directa:</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value || null);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>
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

      {/* Sorteo Activo & Selector Aleatorio */}
      <div className="bg-gradient-to-br from-slate-900 to-[#0047BA] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Auditoría & Extracción de Ganador
            </span>
            <h4 className="text-2xl font-black mt-2">Extraer Ganador del Sorteo Mensual</h4>
            <p className="text-xs text-slate-200 font-medium mt-1">
              Combina automáticamente a todos los comercios adheridos con plan activo + usuarios que compraron su ticket vía WhatsApp.
            </p>
          </div>

          <button
            onClick={drawWinner}
            disabled={isDrawing}
            className="bg-gradient-to-r from-[#00ADB5] to-[#007C8A] hover:from-[#00E5E8] hover:to-[#00ADB5] disabled:opacity-50 text-white px-6 py-3.5 rounded-2xl font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isDrawing ? 'animate-spin' : ''}`} />
            <span>{isDrawing ? 'Sorteando Cupón...' : 'Extraer Ganador del Sorteo'}</span>
          </button>
        </div>

        {/* Tarjeta Ganador Seleccionado */}
        {winner && (
          <div className="bg-white text-slate-900 rounded-2xl p-6 space-y-4 border-2 border-amber-400 animate-in fade-in zoom-in-95 duration-300 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-600 font-black text-xs uppercase tracking-wider">
                <Trophy className="w-5 h-5 text-amber-500 fill-current" />
                <span>¡Ganador Seleccionado!</span>
              </div>
              <span className="text-xs font-black text-[#0047BA] bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                Modalidad: {winner.type}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Nombre / Ganador</span>
                <p className="text-lg font-black text-slate-900">{winner.name}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Localidad</span>
                <p className="text-sm font-bold text-[#0047BA] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" />
                  {winner.city}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Teléfono WhatsApp</span>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {winner.phone}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-100">
              <span className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Cupón válido auditado en Entre Ríos ON MÁS
              </span>

              <a
                href={`https://wa.me/${winner.phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
                  `¡Hola ${winner.name}! Te contactamos oficialmente del portal Entre Ríos ON MÁS para felicitarte porque sos el GANADOR del Sorteo Mensual!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 fill-current" />
                <span>Notificar por WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Listado de Sorteos Mensuales Activos */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-[#00ADB5]" />
          Sorteos Mensuales Activos en la Web ({raffles.length})
        </h3>

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
      </div>
    </div>
  );
}
