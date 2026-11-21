'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, CloudSun, TrendingUp, RefreshCw, MapPin } from 'lucide-react';

interface DolarData {
  compra: number;
  venta: number;
  fechaActualizacion?: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  weatherCode: number;
  conditionText: string;
  icon: string;
}

function getWeatherCondition(code: number): { conditionText: string; icon: string } {
  if (code === 0) return { conditionText: 'Cielo despejado', icon: '☀️' };
  if (code === 1 || code === 2) return { conditionText: 'Parcialmente nublado', icon: '🌤️' };
  if (code === 3) return { conditionText: 'Nublado', icon: '☁️' };
  if (code >= 45 && code <= 48) return { conditionText: 'Neblina', icon: '🌫️' };
  if (code >= 51 && code <= 55) return { conditionText: 'Llovizna', icon: '🌦️' };
  if (code >= 61 && code <= 65) return { conditionText: 'Lluvia', icon: '🌧️' };
  if (code >= 80 && code <= 82) return { conditionText: 'Chubascos', icon: '🌧️' };
  if (code >= 95) return { conditionText: 'Tormenta eléctrica', icon: '⛈️' };
  return { conditionText: 'Agradable', icon: '🌤️' };
}

interface MarketWeatherWidgetProps {
  variant?: 'compact' | 'banner';
  className?: string;
}

export function MarketWeatherWidget({ variant = 'compact', className = '' }: MarketWeatherWidgetProps) {
  const [dolar, setDolar] = useState<DolarData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const [dolarRes, weatherRes] = await Promise.allSettled([
          fetch('https://dolarapi.com/v1/dolares/blue', { next: { revalidate: 300 } }).then((r) =>
            r.ok ? r.json() : null
          ),
          fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=-31.6333&longitude=-60.7&current=temperature_2m,relative_humidity_2m,weather_code&timezone=America%2FArgentina%2FCordoba',
            { next: { revalidate: 600 } }
          ).then((r) => (r.ok ? r.json() : null)),
        ]);

        if (!isMounted) return;

        if (dolarRes.status === 'fulfilled' && dolarRes.value) {
          setDolar({
            compra: dolarRes.value.compra,
            venta: dolarRes.value.venta,
            fechaActualizacion: dolarRes.value.fechaActualizacion,
          });
        } else {
          // Fallback razonable
          setDolar({ compra: 1655, venta: 1675 });
        }

        if (weatherRes.status === 'fulfilled' && weatherRes.value?.current) {
          const cur = weatherRes.value.current;
          const info = getWeatherCondition(cur.weather_code);
          setWeather({
            temperature: Math.round(cur.temperature_2m),
            humidity: cur.relative_humidity_2m,
            weatherCode: cur.weather_code,
            conditionText: info.conditionText,
            icon: info.icon,
          });
        } else {
          setWeather({
            temperature: 25,
            humidity: 50,
            weatherCode: 1,
            conditionText: 'Despejado',
            icon: '🌤️',
          });
        }
      } catch (err) {
        console.warn('Error fetching market/weather:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 sm:gap-2 select-none ${className}`}>
        {/* Dólar Blue Pill */}
        <div 
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-slate-300 shadow-2xs transition-all"
          title={`Dólar Blue hoy: Compra $${dolar?.compra || '1.655'} / Venta $${dolar?.venta || '1.675'}`}
        >
          <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 hidden min-[400px]:block">
              DÓLAR BLUE
            </span>
            <span className="text-xs font-black text-slate-900 tracking-tight">
              ${dolar ? Number(dolar.venta).toLocaleString('es-AR') : '1.675'}
            </span>
          </div>
        </div>

        {/* Clima Santa Fe Pill */}
        <div 
          className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-slate-300 shadow-2xs transition-all"
          title={`Santa Fe: ${weather?.temperature || '25'}°C, ${weather?.conditionText || 'Despejado'}, Humedad ${weather?.humidity || '50'}%`}
        >
          <div className="w-5 h-5 rounded-lg bg-sky-100 flex items-center justify-center text-xs shrink-0">
            <span>{weather?.icon || '🌤️'}</span>
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 hidden min-[400px]:block">
              SANTA FE
            </span>
            <span className="text-xs font-black text-slate-900 tracking-tight">
              {weather ? `${weather.temperature}°C` : '25°C'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Variant === 'banner'
  return (
    <div className={`w-full bg-gradient-to-r from-slate-900 via-[#002878] to-[#0047BA] text-white rounded-2xl p-3 sm:p-4 shadow-sm border border-white/10 flex flex-wrap items-center justify-between gap-3 ${className}`}>
      {/* Sección Izquierda: Dólar */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-wider uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-400/30">
              COTIZACIÓN DEL DÍA
            </span>
            <span className="text-[11px] font-extrabold text-white/70">Dólar Blue Argentina</span>
          </div>
          <div className="flex items-baseline gap-2.5 mt-0.5">
            <span className="text-base sm:text-lg font-black text-white">
              Venta: ${dolar ? Number(dolar.venta).toLocaleString('es-AR') : '1.675'}
            </span>
            <span className="text-xs font-bold text-slate-300">
              Compra: ${dolar ? Number(dolar.compra).toLocaleString('es-AR') : '1.655'}
            </span>
          </div>
        </div>
      </div>

      {/* Divisor vertical */}
      <div className="hidden md:block w-px h-8 bg-white/20" />

      {/* Sección Derecha: Clima Santa Fe */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 flex items-center justify-center text-xl shrink-0 shadow-2xs">
          <span>{weather?.icon || '🌤️'}</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#00ADB5]" />
            <span className="text-xs font-black text-white">Santa Fe Capital</span>
            <span className="text-[11px] font-medium text-cyan-200/90">• {weather?.conditionText || 'Despejado'}</span>
          </div>
          <div className="flex items-baseline gap-2.5 mt-0.5">
            <span className="text-base sm:text-lg font-black text-white">
              {weather ? `${weather.temperature}°C` : '25°C'}
            </span>
            <span className="text-xs font-bold text-slate-300">
              Humedad: {weather?.humidity || 48}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
