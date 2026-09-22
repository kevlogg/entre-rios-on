'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, ExternalLink, LogOut, ShieldCheck } from 'lucide-react';
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
    <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & SuperAdmin Crown Badge */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-36 h-10">
                <Image
                  src="/logo.png"
                  alt="ON MÁS"
                  fill
                  className="object-contain object-left brightness-200"
                />
              </div>
            </Link>

            <span className="hidden md:inline-block h-6 w-px bg-slate-800" />

            <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-500/40 px-3.5 py-1 rounded-xl text-xs font-black text-amber-300">
              <Crown className="w-4 h-4 text-amber-400 fill-current animate-pulse" />
              <span>SuperAdmin Provincial</span>
            </div>
          </div>

          {/* Quick Shortcuts & Live Portal Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="bg-gradient-to-r from-[#00ADB5] to-[#007C8A] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Ver Portal ON MÁS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* User Session Info & Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
                  SA
                </div>
                <div className="hidden lg:block text-left text-xs">
                  <p className="font-black leading-none text-slate-100">{userSession?.name || 'SuperAdmin'}</p>
                  <p className="text-[10px] text-cyan-400 font-medium truncate max-w-[140px] mt-0.5">
                    {userSession?.email || 'superadmin@onmas.gob.ar'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Cerrar sesión"
                className="bg-slate-900 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 p-2 rounded-xl border border-slate-800 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
