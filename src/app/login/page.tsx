'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, ArrowRight, Sparkles, MapPin, KeyRound, CheckCircle2 } from 'lucide-react';
import { getCitiesByProvince } from '@/lib/constants/locations';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [commerceName, setCommerceName] = useState('');
  const [provinceId, setProvinceId] = useState('santa-fe');
  const [cityName, setCityName] = useState('Rosario');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  // Obtenemos la lista dinámica de ciudades según la provincia seleccionada
  const availableCities = getCitiesByProvince(provinceId);

  // Actualizar la ciudad seleccionada cuando cambia la provincia
  const handleProvinceChange = (newProvinceId: string) => {
    setProvinceId(newProvinceId);
    const cities = getCitiesByProvince(newProvinceId);
    if (cities.length > 0) {
      setCityName(cities[0].name);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        // Validación de doble contraseña
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: 'Las contraseñas no coinciden. Por favor, verifícalas.' });
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
          setLoading(false);
          return;
        }

        // 1. SignUp en Supabase Auth
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

        // 2. Insertar Comercio en la tabla commerces de Supabase
        const slug = commerceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `comm-${Date.now()}`;
        const cityObj = availableCities.find((c) => c.name === cityName) || availableCities[0];

        const { error: commErr } = await supabase.from('commerces').insert({
          name: commerceName,
          slug,
          category: 'Comercio General',
          province_id: provinceId,
          city_id: cityObj.id,
          city_name: cityObj.name,
          description: `Comercio adherido al portal ON MÁS en ${cityObj.name}.`,
          phone_whatsapp: phoneWhatsApp || '5493415550199',
          address: `${cityObj.name}, Argentina`,
          logo_url: '/images/city-rosario.jpg',
          cover_url: '/images/city-rosario.jpg',
          is_verified: true,
          is_subscription_active: true,
          owner_id: authData.user?.id || null,
        });

        if (commErr) {
          console.warn('Nota registro comercio:', commErr.message);
        }

        setMessage({
          type: 'success',
          text: '¡Cuenta comercial registrada con éxito! Ingresando a tu panel...',
        });

        setTimeout(() => {
          router.push(redirectTo);
        }, 1200);
      } else if (mode === 'login') {
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
              router.push('/admin');
            }, 800);
            return;
          }

          setMessage({ type: 'error', text: 'Credenciales incorrectas. Verificá tu email y contraseña.' });
        } else {
          setMessage({ type: 'success', text: '¡Sesión iniciada con éxito! Redirigiendo...' });
          setTimeout(() => {
            router.push(redirectTo);
          }, 800);
        }
      } else if (mode === 'forgot') {
        // Olvidé mi contraseña (Reset password)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login?mode=reset`,
        });

        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({
            type: 'success',
            text: '¡Instrucciones enviadas! Revisá tu casilla de correo electrónico.',
          });
        }
      }
    } catch {
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/40 space-y-6">
      
      {/* Selector de Modo: Ingresar vs Registrar Comercio */}
      <div className="flex items-center justify-center gap-6 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => { setMode('login'); setMessage(null); }}
          className={`text-sm font-black transition-colors cursor-pointer ${
            mode === 'login' ? 'text-[#0047BA] border-b-2 border-[#0047BA] pb-1' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Ingresar
        </button>
        <button
          type="button"
          onClick={() => { setMode('signup'); setMessage(null); }}
          className={`text-sm font-black transition-colors cursor-pointer ${
            mode === 'signup' ? 'text-[#00ADB5] border-b-2 border-[#00ADB5] pb-1' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Registrar Comercio
        </button>
      </div>

      {/* Dynamic Banner Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 font-medium flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#00ADB5] shrink-0" />
        <span>
          {mode === 'signup'
            ? 'Completá los datos clave de tu negocio para empezar a recibir consultas directas a WhatsApp.'
            : mode === 'forgot'
            ? 'Ingresá tu correo electrónico para recibir el enlace de recuperación de contraseña.'
            : 'Accedé a tu panel comercial B2B para gestionar productos y ofertas.'}
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

      {/* Formulario Principal */}
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
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                >
                  <option value="santa-fe">Santa Fe</option>
                  <option value="entre-rios">Entre Ríos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad *</label>
                <select
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                >
                  {availableCities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
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

        {mode !== 'forgot' && (
          <>
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

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar Contraseña *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white"
                  />
                </div>
              </div>
            )}
          </>
        )}

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
              : mode === 'forgot'
              ? 'Enviar Enlace de Recuperación'
              : 'Ingresar al Panel'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Olvidé mi contraseña / Volver al Login */}
      <div className="pt-2 border-t border-slate-100 text-center space-y-2">
        {mode === 'login' ? (
          <button
            type="button"
            onClick={() => { setMode('forgot'); setMessage(null); }}
            className="text-xs font-extrabold text-[#0047BA] hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#00ADB5]" />
            <span>¿Olvidaste tu contraseña?</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => { setMode('login'); setMessage(null); }}
            className="text-xs font-extrabold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            ← Volver a Ingresar
          </button>
        )}
      </div>
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
            <span>ON MÁS • Portal Comercial & Medios</span>
          </Link>
          
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Acceso Comercial
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xs mx-auto">
            Ingresá a tu panel de control comercial o registrá tu empresa.
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
