'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, ArrowRight, Sparkles, MapPin, KeyRound, User, Car, Building2, Wrench, CheckCircle2 } from 'lucide-react';
import { getCitiesByProvince } from '@/lib/constants/locations';

type UserType = 'particular' | 'agencia' | 'negocio_automotor';

const USER_TYPES: { id: UserType; icon: React.ReactNode; title: string; subtitle: string; color: string; borderColor: string; bgColor: string }[] = [
  {
    id: 'particular',
    icon: <Car className="w-7 h-7" />,
    title: 'Particular',
    subtitle: 'Quiero publicar o comprar un vehículo',
    color: 'text-blue-600',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'agencia',
    icon: <Building2 className="w-7 h-7" />,
    title: 'Agencia / Concesionaria',
    subtitle: 'Tengo un negocio de venta de autos',
    color: 'text-violet-600',
    borderColor: 'border-violet-500',
    bgColor: 'bg-violet-50',
  },
  {
    id: 'negocio_automotor',
    icon: <Wrench className="w-7 h-7" />,
    title: 'Negocio Automotor',
    subtitle: 'Taller, repuestos, seguros, lavado…',
    color: 'text-emerald-600',
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-50',
  },
];

const NEGOCIO_AUTO_CATEGORIES = [
  'Taller Mecánico',
  'Repuestos y Accesorios',
  'Seguros Automotor',
  'Financiación de Vehículos',
  'Lavado & Detailing',
  'Electricidad del Automotor',
  'Chapa y Pintura',
  'Neumáticos',
  'Gestoría del Automotor',
  'Otro',
];

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [signupStep, setSignupStep] = useState<'type' | 'form'>('type');
  const [userType, setUserType] = useState<UserType>('particular');

  // Auth Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState(NEGOCIO_AUTO_CATEGORIES[0]);
  const [provinceId, setProvinceId] = useState('santa-fe');
  const [cityName, setCityName] = useState('Rosario');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();
  const availableCities = getCitiesByProvince(provinceId);

  const handleProvinceChange = (newProvinceId: string) => {
    setProvinceId(newProvinceId);
    const cities = getCitiesByProvince(newProvinceId);
    if (cities.length > 0) setCityName(cities[0].name);
  };

  const handleSelectUserType = (type: UserType) => {
    setUserType(type);
    setSignupStep('form');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: 'Las contraseñas no coinciden. Por favor, verificalas.' });
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
          setLoading(false);
          return;
        }

        const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://entre-rios-on.vercel.app';
        const cityObj = availableCities.find((c) => c.name === cityName) || availableCities[0];
        const fullName = `${firstName} ${lastName}`.trim();

        const needsBusiness = userType === 'agencia' || userType === 'negocio_automotor';
        const computedRole = needsBusiness ? 'MERCHANT_ADMIN' : 'PUBLIC_USER';
        const computedRedirect = needsBusiness ? '/admin' : (redirectTo === '/admin' ? '/' : redirectTo);

        const { data: authData, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${redirectOrigin}/auth/callback?next=${computedRedirect}`,
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: fullName,
              user_type: userType,
              commerce_name: needsBusiness ? businessName : undefined,
              business_category: userType === 'negocio_automotor' ? businessCategory : undefined,
              phone_whatsapp: phoneWhatsApp,
              province_id: provinceId,
              city_id: cityObj?.id,
              city_name: cityName,
              role: computedRole,
            },
          },
        });

        if (signUpErr) {
          let errText = signUpErr.message;
          if (signUpErr.message.includes('rate limit') || signUpErr.message.includes('over_email_send_rate_limit')) {
            errText = 'Superaste el límite de correos por hora. Aguardá 10-15 minutos o probá con otra casilla.';
          } else if (signUpErr.message.includes('User already registered') || signUpErr.message.includes('already exists')) {
            errText = 'Este correo ya está registrado. Podés ingresar desde la pestaña "Ingresar".';
          }
          setMessage({ type: 'error', text: errText });
          setLoading(false);
          return;
        }

        // Registrar en Server Actions
        if (authData.user?.id) {
          try {
            const { registerUserOnSignUpAction } = await import('@/server/actions/profile');
            await registerUserOnSignUpAction({
              userId: authData.user.id,
              email,
              userType,
              fullName,
              phoneWhatsApp,
              provinceId,
              cityId: cityObj?.id || '',
              cityName: cityObj?.name || cityName,
              businessName: needsBusiness ? businessName : undefined,
              businessCategory: userType === 'negocio_automotor' ? businessCategory : undefined,
            });
          } catch (regErr) {
            console.warn('Nota registro Server Action:', regErr);
          }
        }

        // Auto-login si no requiere confirmación
        const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
        if (signInData?.session) {
          setMessage({ type: 'success', text: '¡Cuenta registrada e iniciada con éxito! Redirigiendo...' });
          window.location.href = needsBusiness ? '/admin' : computedRedirect;
        } else {
          setMessage({
            type: 'success',
            text: `¡Registro exitoso! Enviamos un correo de confirmación a ${email}. Revisá tu casilla (y Spam) para activar tu cuenta.`,
          });
          setLoading(false);
        }
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setMessage({ type: 'error', text: error.message || 'Credenciales incorrectas o correo no confirmado.' });
          setLoading(false);
        } else {
          setMessage({ type: 'success', text: '¡Sesión iniciada con éxito! Redirigiendo...' });
          window.location.href = redirectTo;
        }
      } else if (mode === 'forgot') {
        const redirectOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://entre-rios-on.vercel.app';
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${redirectOrigin}/login?mode=reset`,
        });
        if (error) {
          setMessage({ type: 'error', text: error.message });
        } else {
          setMessage({ type: 'success', text: '¡Instrucciones enviadas! Revisá tu casilla de correo.' });
        }
        setLoading(false);
      }
    } catch {
      router.push('/admin');
      setLoading(false);
    }
  };

  const selectedTypeConfig = USER_TYPES.find((t) => t.id === userType);
  const needsBusiness = userType === 'agencia' || userType === 'negocio_automotor';

  return (
    <div className="bg-white/95 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-white/40 space-y-6">

      {/* Selector de Modo */}
      <div className="flex items-center justify-center gap-6 border-b border-slate-200 pb-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => { setMode('login'); setMessage(null); }}
          className={`text-sm font-black transition-colors cursor-pointer disabled:opacity-50 ${
            mode === 'login' ? 'text-[#0047BA] border-b-2 border-[#0047BA] pb-1' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Ingresar
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => { setMode('signup'); setSignupStep('type'); setMessage(null); }}
          className={`text-sm font-black transition-colors cursor-pointer disabled:opacity-50 ${
            mode === 'signup' ? 'text-[#00ADB5] border-b-2 border-[#00ADB5] pb-1' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Crear Cuenta
        </button>
      </div>

      {/* ========================= SIGNUP STEP 1: Selector de tipo ========================= */}
      {mode === 'signup' && signupStep === 'type' && (
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <p className="text-sm font-black text-slate-800">¿Cómo querés usar la plataforma?</p>
            <p className="text-xs text-slate-500">Elegí tu perfil para personalizar tu experiencia</p>
          </div>

          <div className="space-y-3">
            {USER_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleSelectUserType(type.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left group hover:shadow-md cursor-pointer
                  border-slate-200 hover:${type.borderColor} hover:${type.bgColor}`}
              >
                <div className={`${type.color} transition-transform group-hover:scale-110`}>
                  {type.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-black ${type.color}`}>{type.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{type.subtitle}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================= SIGNUP STEP 2: Formulario ========================= */}
      {mode === 'signup' && signupStep === 'form' && (
        <>
          {/* Badge de tipo seleccionado */}
          <button
            type="button"
            onClick={() => setSignupStep('type')}
            className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 ${selectedTypeConfig?.borderColor} ${selectedTypeConfig?.bgColor} cursor-pointer`}
          >
            <div className={selectedTypeConfig?.color}>{selectedTypeConfig?.icon}</div>
            <div className="flex-1 text-left">
              <p className={`text-xs font-black ${selectedTypeConfig?.color}`}>{selectedTypeConfig?.title}</p>
              <p className="text-[11px] text-slate-500">Tocá para cambiar el tipo de cuenta</p>
            </div>
            <CheckCircle2 className={`w-4 h-4 ${selectedTypeConfig?.color}`} />
          </button>

          <form onSubmit={handleAuth} className="space-y-4">
            <fieldset disabled={loading} className="space-y-4">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      autoComplete="given-name"
                      placeholder="Juan"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white disabled:bg-slate-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Apellido *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      autoComplete="family-name"
                      placeholder="Pérez"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white disabled:bg-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Nombre comercial (solo agencias y negocios automotores) */}
              {needsBusiness && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {userType === 'agencia' ? 'Nombre de la Agencia / Concesionaria *' : 'Nombre del Negocio *'}
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="organization"
                      placeholder={userType === 'agencia' ? 'Ej. Automotores El Paraná' : 'Ej. Taller García'}
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white disabled:bg-slate-100"
                    />
                  </div>

                  {userType === 'negocio_automotor' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Rubro del Negocio *</label>
                      <select
                        value={businessCategory}
                        onChange={(e) => setBusinessCategory(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5] disabled:bg-slate-100"
                      >
                        {NEGOCIO_AUTO_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Provincia y Ciudad */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Provincia *</label>
                  <select
                    value={provinceId}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5] disabled:bg-slate-100"
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
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5] disabled:bg-slate-100"
                  >
                    {availableCities.map((city) => (
                      <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* WhatsApp (todos) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {needsBusiness ? 'WhatsApp del Negocio *' : 'WhatsApp Personal (opcional)'}
                </label>
                <input
                  type="text"
                  required={needsBusiness}
                  autoComplete="tel"
                  placeholder="5493415550199"
                  value={phoneWhatsApp}
                  onChange={(e) => setPhoneWhatsApp(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 font-mono focus:ring-2 focus:ring-[#00ADB5] focus:bg-white disabled:bg-slate-100"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white disabled:bg-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirmar Contraseña *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white disabled:bg-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0047BA] to-[#002878] hover:from-[#0B66FF] hover:to-[#0047BA] text-white py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Procesando...' : 'Crear Cuenta'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </fieldset>
          </form>
        </>
      )}

      {/* ========================= LOGIN FORM ========================= */}
      {mode === 'login' && (
        <>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00ADB5] shrink-0" />
            <span>Accedé a tu panel de control para gestionar tus publicaciones o negocio.</span>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <fieldset disabled={loading} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white disabled:bg-slate-100"
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
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white disabled:bg-slate-100"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0047BA] to-[#002878] hover:from-[#0B66FF] hover:to-[#0047BA] text-white py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Ingresando...' : 'Ingresar al Panel'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </fieldset>
          </form>
        </>
      )}

      {/* ========================= FORGOT FORM ========================= */}
      {mode === 'forgot' && (
        <>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 font-medium flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#00ADB5] shrink-0" />
            <span>Ingresá tu correo para recibir el enlace de recuperación de contraseña.</span>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <fieldset disabled={loading} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-[#00ADB5] focus:bg-white disabled:bg-slate-100"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#0047BA] to-[#002878] hover:from-[#0B66FF] hover:to-[#0047BA] text-white py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </fieldset>
          </form>
        </>
      )}

      {/* Feedback */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold border leading-relaxed shadow-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Links inferiores */}
      <div className="pt-2 border-t border-slate-100 text-center space-y-2">
        {mode === 'login' ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => { setMode('forgot'); setMessage(null); }}
            className="text-xs font-extrabold text-[#0047BA] hover:underline cursor-pointer inline-flex items-center gap-1 disabled:opacity-50"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#00ADB5]" />
            <span>¿Olvidaste tu contraseña?</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={() => { setMode('login'); setSignupStep('type'); setMessage(null); }}
            className="text-xs font-extrabold text-slate-500 hover:text-slate-800 cursor-pointer disabled:opacity-50"
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
            <span>ON MÁS • Portal Automotor Regional</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Acceso a tu Cuenta
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xs mx-auto">
            Ingresá o registrate para publicar vehículos y gestionar tu presencia automotriz.
          </p>
        </div>

        <Suspense fallback={<div className="bg-white p-8 rounded-3xl text-center text-xs font-bold text-slate-500">Cargando...</div>}>
          <LoginFormContent />
        </Suspense>
      </div>
    </div>
  );
}
