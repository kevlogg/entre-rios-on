'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react';
import { loginSuperAdmin, isSuperAdminAuthenticated, ALLOWED_SUPERADMIN_EMAILS } from '@/lib/security/superadmin-auth';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSuperAdminAuthenticated()) {
      router.push('/superadmin');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = loginSuperAdmin(email, password);
      if (res.success) {
        router.push('/superadmin');
      } else {
        setError(res.message);
        setLoading(false);
      }
    }, 400);
  };

  const handleQuickFill = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setPassword('admin1234');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Glow Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00ADB5]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#0047BA]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        
        {/* Header Logo & Crown */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <div className="relative w-44 h-12 mx-auto">
              <Image
                src="/logo.png"
                alt="ON MÁS Portal"
                fill
                priority
                className="object-contain brightness-200"
              />
            </div>
          </Link>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-black text-amber-300">
            <Crown className="w-4 h-4 text-amber-400 fill-current animate-pulse" />
            <span>Acceso Restringido • Panel SuperAdmin</span>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            Ingrese sus credenciales de usuario autorizado para administrar el portal provincial.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/40 rounded-2xl p-4 flex items-start gap-3 text-rose-300 text-xs font-medium animate-in fade-in duration-150">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">Correo Electrónico Registrado</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="superadmin@onmas.gob.ar"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#00ADB5]"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">Contraseña de Administrador</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#00ADB5]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00ADB5] via-[#0047BA] to-[#002878] hover:from-[#00E5E8] hover:to-[#0047BA] text-white py-3 rounded-xl font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Verificando credenciales...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Ingresar al Panel SuperAdmin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo / Quick Credentials Box */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
            <span>Mails autorizados para acceso:</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#00ADB5]" />
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {ALLOWED_SUPERADMIN_EMAILS.map((accEmail) => (
              <button
                key={accEmail}
                type="button"
                onClick={() => handleQuickFill(accEmail)}
                className="w-full text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-1.5 text-[11px] text-slate-300 font-mono flex items-center justify-between transition-colors"
              >
                <span>{accEmail}</span>
                <span className="text-[10px] text-cyan-400 font-sans font-bold">Usar</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors font-medium">
            ← Volver al Portal ON MÁS
          </Link>
        </div>

      </div>
    </div>
  );
}
