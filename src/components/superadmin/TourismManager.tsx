'use client';

import React, { useState, useEffect } from 'react';
import { Compass, Plus, CheckCircle2, MapPin, Umbrella, Star, ShieldCheck, ExternalLink } from 'lucide-react';
import { getTourismServices } from '@/lib/dal/portal';
import { createTourismServiceAction } from '@/server/actions/superadmin';

interface TourismService {
  id: string;
  name: string;
  category: string;
  city: string;
  price: string;
  plan: string;
  imageUrl: string;
}

export function TourismManager() {
  const [services, setServices] = useState<TourismService[]>([]);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Alojamiento & Termas');
  const [city, setCity] = useState('Paraná');
  const [price, setPrice] = useState('');
  const [plan, setPlan] = useState<'Bronce' | 'Plata' | 'Oro'>('Plata');
  const [imageUrl, setImageUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadServices() {
      try {
        const fetched = await getTourismServices();
        if (fetched) {
          setServices(
            fetched.map((t) => ({
              id: t.id,
              name: t.name,
              category: t.category,
              city: t.cityName,
              price: t.price,
              plan: t.planTier || 'Plata',
              imageUrl: t.imageUrl,
            }))
          );
        }
      } catch (e) {
        console.warn('Error cargando servicios turísticos:', e);
      }
    }
    loadServices();
  }, []);


  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || isSubmitting) return;

    setIsSubmitting(true);
    const newService: TourismService = {
      id: `tour-${Date.now()}`,
      name,
      category,
      city,
      price: price || 'Consultar tarifa',
      plan,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
    };

    try {
      await createTourismServiceAction({
        name,
        category,
        cityName: city,
        price: price || 'Consultar tarifa',
        planTier: plan,
        imageUrl: imageUrl || '/images/city-federacion.jpg',
      });
    } catch (e) {
      console.warn('Error creando servicio de turismo:', e);
    } finally {
      setIsSubmitting(false);
    }

    setServices([newService, ...services]);
    setName('');
    setPrice('');
    setImageUrl('');
    setSuccessMsg(`¡Servicio de Turismo "${newService.name}" creado exitosamente!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };


  return (
    <div className="space-y-8">
      {/* Alta de Servicio de Turismo */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-[#0047BA] flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#00ADB5]" />
            Gestión Libre de Turismo
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Crear Nuevo Servicio Turístico / Alojamiento
          </h2>
          <p className="text-xs text-slate-500">
            Publicá posadas, complejos termales, paseos náuticos y atractivos para promocionarlos en la sección Turismo ON MÁS.
          </p>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs font-bold animate-in fade-in duration-150">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreateService} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Nombre del Alojamiento o Paseo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Cabañas Termales Sol del Paraná"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Categoría Turística</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
            >
              <option value="Alojamiento & Termas">Alojamiento & Termas</option>
              <option value="Excursión / Náutica">Excursión / Náutica</option>
              <option value="Gastronomía de Río">Gastronomía de Río</option>
              <option value="Enoturismo / Bodegas">Enoturismo / Bodegas</option>
              <option value="Aventura & Playas">Aventura & Playas</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Ciudad o Destino</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
            >
              <option value="Paraná">Paraná</option>
              <option value="Colón">Colón</option>
              <option value="Concordia">Concordia</option>
              <option value="Gualeguaychú">Gualeguaychú</option>
              <option value="Federación">Federación</option>
              <option value="Victoria">Victoria</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Tarifa / Precio Orientativo</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ej. $35.000 / noche o Consultar"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Plan de Suscripción</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold"
            >
              <option value="Bronce">Plan Bronce</option>
              <option value="Plata">Plan Plata (Incluye Badge Verificado)</option>
              <option value="Oro">Plan Oro (Verificado + Publicidad Exclusiva)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">URL Imagen de Fotografía</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white py-3 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publicar Servicio Turístico</span>
            </button>
          </div>
        </form>
      </div>

      {/* Grid de Servicios de Turismo */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <Umbrella className="w-5 h-5 text-[#00ADB5]" />
          Servicios Turísticos Activos ({services.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all bg-white flex flex-col justify-between">
              <div className="relative h-40 w-full bg-slate-100">
                <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                  {s.category}
                </div>
                {(s.plan === 'Plata' || s.plan === 'Oro') && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <ShieldCheck className="w-3 h-3" /> Verificado
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{s.name}</h4>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" />
                    <span>{s.city}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-black text-[#0047BA]">{s.price}</span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Plan {s.plan}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
