'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, ExternalLink, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { logoutSuperAdmin, getSuperAdminSession, SuperAdminUser } from '@/lib/security/superadmin-auth';

export function SuperAdminHeader() {
  const router = useRouter();
  const [userSession, setUserSession] = useState<SuperAdminUser | null>(null);

  useEffect(() => {
    setUserSession(getSuperAdminSession());
  }, []);

  const handleLogout = () => {
    logoutSuperAdmin();
    router.push('/superadmin/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 transition-all shadow-xs">
      {/* Top Banner Ribbon - Matches Site Header */}
      <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] text-white text-xs py-1.5 px-4 font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span> Panel SuperAdmin Provincial • Control Central ON MÁS (Santa Fe & Entre Ríos) </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px]">
            <span className="bg-amber-400/20 text-amber-200 border border-amber-300/30 font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Administrador General
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & SuperAdmin Crown Badge */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="relative w-44 h-12">
                <Image
                  src="/logo.png"
                  alt="ON MÁS Portal"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <span className="hidden md:inline-block h-7 w-px bg-slate-200" />

            <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-amber-900 shadow-2xs">
              <Crown className="w-4 h-4 text-amber-600 fill-current" />
              <span className="font-black text-[#0047BA]">SuperAdmin Provincial</span>
              <ShieldCheck className="w-4 h-4 text-[#00ADB5]" />
            </div>
          </div>

          {/* Quick Shortcuts & Live Portal Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="bg-gradient-to-r from-[#00ADB5] to-[#007C8A] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
            >
              <span>Ver Portal ON MÁS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* User Session Info & Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black text-xs shadow-xs">
                  SA
                </div>
                <div className="hidden lg:block text-left text-xs">
                  <p className="font-black leading-none text-slate-900">{userSession?.name || 'SuperAdmin'}</p>
                  <p className="text-[10px] text-[#0047BA] font-bold truncate max-w-[140px] mt-0.5">
                    {userSession?.email || 'superadmin@onmas.gob.ar'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

