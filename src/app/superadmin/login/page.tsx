'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, Lock, Mail, ArrowRight, AlertCircle, KeyRound, ArrowLeft, ShieldCheck } from 'lucide-react';
import { loginSuperAdmin, isSuperAdminAuthenticated, grantSuperAdminAccess, ALLOWED_SUPERADMIN_EMAILS } from '@/lib/security/superadmin-auth';
import { createClient } from '@/lib/supabase/client';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Auto-check if current logged-in user is an authorized SuperAdmin
  useEffect(() => {
    async function verifyUserSession() {
      if (isSuperAdminAuthenticated()) {
        router.push('/superadmin');
        return;
      }
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email && ALLOWED_SUPERADMIN_EMAILS.includes(user.email.trim().toLowerCase())) {
          grantSuperAdminAccess(user.email.trim().toLowerCase());
          router.push('/superadmin');
          return;
        }
      } catch (e) {
        console.warn('SuperAdmin session check error:', e);
      } finally {
        setCheckingAuth(false);
      }
    }
    verifyUserSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Por favor completá todos los campos.');
      setLoading(false);
      return;
    }

    if (!ALLOWED_SUPERADMIN_EMAILS.includes(cleanEmail)) {
      setError('Acceso denegado: El correo ingresado no cuenta con privilegios de SuperAdmin.');
      setLoading(false);
      return;
    }

    try {
      // Intentar autenticación vía Supabase primero
      const supabase = createClient();
      const { data, error: sbError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!sbError && data?.user) {
        grantSuperAdminAccess(cleanEmail);
        window.location.href = '/superadmin';
        return;
      }
    } catch (e) {
      console.warn('Supabase auth attempt notice:', e);
    }

    // Fallback a loginSuperAdmin
    try {
      const res = loginSuperAdmin(cleanEmail, password);
      if (res.success) {
        window.location.href = '/superadmin';
      } else {
        setError(res.message);
        setLoading(false);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al validar el acceso.');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0047BA] to-[#002878] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#00E5E8] border-t-transparent animate-spin mb-3" />
        <p className="text-xs font-black text-white tracking-wide">Verificando credenciales SuperAdmin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0047BA] to-[#002878] text-slate-800 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00E5E8]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#00ADB5]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Header Logo & Crown */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <div className="relative w-44 h-12 mx-auto">
              <Image
                src="/logo.png"
                alt="ON MÁS Portal"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] px-3.5 py-1.5 rounded-full text-xs font-black text-white shadow-sm">
            <Crown className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
            <span>Panel SuperAdmin Provincial</span>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Ingrese sus credenciales de administración general para acceder al panel de control provincial de ON MÁS.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-start gap-3 text-rose-800 text-xs font-bold animate-in fade-in duration-150 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Correo Electrónico de Administrador</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#00ADB5] focus:bg-white transition-all font-medium"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Contraseña de Administrador</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#00ADB5] focus:bg-white transition-all font-medium"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#0047BA] via-[#00ADB5] to-[#002878] hover:from-[#0B66FF] hover:to-[#0047BA] text-white py-3.5 rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Validando credenciales...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Ingresar al Panel SuperAdmin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security badge note (NO email addresses listed!) */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-bold">
          <ShieldCheck className="w-4 h-4 text-[#00ADB5]" />
          <span>Acceso cifrado y restringido a cuentas autorizadas</span>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-1">
          <Link href="/" className="text-xs text-slate-500 hover:text-[#0047BA] transition-colors font-bold inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al Portal ON MÁS</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

