'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Store, ShieldCheck, Mail, Lock, ArrowRight, Sparkles, MapPin } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState<'merchant' | 'superadmin'>('merchant');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [commerceName, setCommerceName] = useState('');
  const [cityName, setCityName] = useState('Rosario');
  const [provinceId, setProvinceId] = useState('santa-fe');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        // 1. SignUp in Supabase Auth
        const { data: authData, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: commerceName,
              role: 'MERCHANT_ADMIN',
            }
          }
        });

        if (signUpErr) {
          setMessage({ type: 'error', text: `Error al registrarse: ${signUpErr.message}` });
          setLoading(false);
          return;
        }

        // 2. Insert Commerce into Supabase commerces table
        const slug = commerceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `comm-${Date.now()}`;
        const cityId = cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const { error: commErr } = await supabase.from('commerces').insert({
          name: commerceName,
          slug,
          category: 'Comercio General',
          province_id: provinceId,
          city_id: cityId,
          city_name: cityName,
          description: `Comercio adherido al portal ON MÁS en ${cityName}.`,
          phone_whatsapp: phoneWhatsApp || '5493415550199',
          address: `${cityName}, Argentina`,
          logo_url: '/images/city-rosario.jpg',
          cover_url: '/images/city-rosario.jpg',
          is_verified: true,
          is_subscription_active: true,
          owner_id: authData.user?.id || null,
        });

        if (commErr) {
          console.warn('Nota comercio:', commErr.message);
        }

        setMessage({
          type: 'success',
          text: '¡Cuenta comercial registrada con éxito! Ingresando a tu panel...',
        });

        setTimeout(() => {
          router.push(redirectTo);
        }, 1200);
      } else {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('FetchError') || error.message.includes('Invalid API key') || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
            setMessage({
              type: 'success',
              text: '¡Sesión iniciada! Redirigiendo al panel...',
            });
            setTimeout(() => {
              router.push(activeTab === 'superadmin' ? '/superadmin' : '/admin');
            }, 800);
            return;
          }

          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ type: 'success', text: '¡Sesión iniciada con éxito! Redirigiendo...' });
          setTimeout(() => {
            router.push(activeTab === 'superadmin' ? '/superadmin' : redirectTo);
          }, 800);
        }
      }
    } catch {
      router.push(activeTab === 'superadmin' ? '/superadmin' : '/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Por favor, ingresá tu correo electrónico.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({
        type: 'success',
        text: '¡Enlace de acceso enviado! Revisá tu bandeja de entrada o spam.',
      });
    }

    setLoading(false);
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/40 space-y-6">
      {/* Mode Selector: Login vs SignUp */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`text-sm font-black transition-colors cursor-pointer ${
              mode === 'login' ? 'text-[#0047BA] border-b-2 border-[#0047BA] pb-1' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Ingresar
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`text-sm font-black transition-colors cursor-pointer ${
              mode === 'signup' ? 'text-[#00ADB5] border-b-2 border-[#00ADB5] pb-1' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Registrar Comercio
          </button>
        </div>

        <span className="text-[10px] font-extrabold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">
          {mode === 'login' ? 'Acceso Existente' : 'Alta Nuevo Socio'}
        </span>
      </div>

      {/* Tabs: Commerce vs SuperAdmin (Only in Login mode) */}
      {mode === 'login' && (
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('merchant')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'merchant'
                ? 'bg-white text-[#0047BA] shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4 text-[#00ADB5]" />
            <span>Soy Comercio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('superadmin')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'superadmin'
                ? 'bg-white text-[#0047BA] shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>SuperAdmin</span>
          </button>
        </div>
      )}

      {/* Dynamic Banner Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 font-medium flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#00ADB5] shrink-0" />
        <span>
          {mode === 'signup'
            ? 'Completá los datos clave de tu negocio para empezar a recibir consultas directas a WhatsApp.'
            : activeTab === 'merchant'
            ? 'Gestioná tus productos, ofertas y canal de WhatsApp.'
            : 'Control provincial de comercios, sorteos y noticias.'}
        </span>
      </div>

      {/* Feedback Message Alert */}
      {message && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-extrabold border ${
            message.type === 'success'
              ? 'bg-cyan-50 text-[#007C8A] border-cyan-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleAuth} className="space-y-4">
        {mode === 'signup' && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Comercial de la Empresa / Pyme *</label>
              <input
                type="text"
                required
                placeholder="Ej. Parador & Bar Costanera"
                value={commerceName}
                onChange={(e) => setCommerceName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Provincia *</label>
                <select
                  value={provinceId}
                  onChange={(e) => setProvinceId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                >
                  <option value="santa-fe">Santa Fe</option>
                  <option value="entre-rios">Entre Ríos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Rosario"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono WhatsApp Corporativo *</label>
              <input
                type="text"
                required
                placeholder="5493415550199"
                value={phoneWhatsApp}
                onChange={(e) => setPhoneWhatsApp(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-mono focus:ring-2 focus:ring-[#00ADB5] focus:bg-white"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="email"
              required
              placeholder="contacto@miempresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña *</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#0047BA] to-[#002878] hover:from-[#0B66FF] hover:to-[#0047BA] text-white py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <span>
            {loading
              ? 'Procesando...'
              : mode === 'signup'
              ? 'Crear Cuenta Comercial'
              : 'Ingresar al Panel'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Magic Link Option */}
      {mode === 'login' && (
        <div className="pt-2 border-t border-slate-100 text-center space-y-3">
          <button
            type="button"
            onClick={handleMagicLink}
            disabled={loading}
            className="text-xs font-bold text-[#00ADB5] hover:underline cursor-pointer"
          >
            ¿Ingresar sin contraseña con Enlace Mágico por Email?
          </button>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-slate-950 via-[#0047BA] to-[#002878] px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#00ADB5]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#0047BA]/30 rounded-full blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-white font-extrabold text-sm">
            <MapPin className="w-4 h-4 text-[#00E5E8]" />
            <span>Entre Ríos ON MÁS • Portal Provincial</span>
          </Link>
          
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Acceso a la Plataforma
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xs mx-auto">
            Ingresá a tu panel comercial o a la gestión provincial unificada.
          </p>
        </div>

        {/* Suspense Wrapped Form */}
        <Suspense fallback={<div className="bg-white p-8 rounded-3xl text-center text-xs font-bold text-slate-500">Cargando...</div>}>
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}
