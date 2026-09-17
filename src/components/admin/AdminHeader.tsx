'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, ShieldCheck, ExternalLink, Bell, LogOut, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdminHeaderProps {
  commerceName: string;
  commerceSlug: string;
  cityName: string;
}

export function AdminHeader({ commerceName, commerceSlug, cityName }: AdminHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 transition-all shadow-xs">
      {/* Top Banner Ribbon - Matches Main Site Header */}
      <div className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] text-white text-xs py-1.5 px-4 text-center font-semibold flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span> Panel B2B Corporativo • ON MÁS (Santa Fe & Entre Ríos) </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px]">
            <span className="bg-white/20 text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Socio Comercial Verificado
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Active Commerce Badge */}
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

            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-slate-800 shadow-2xs">
              <Store className="w-4 h-4 text-[#00ADB5]" />
              <span className="font-black text-[#0047BA]">{commerceName}</span>
              <span className="text-slate-500 font-medium">({cityName})</span>
              <ShieldCheck className="w-4 h-4 text-[#00ADB5]" />
            </div>
          </div>

          {/* Action CTAs: Ver Perfil Público, Notificaciones, User Profile & Logout */}
          <div className="flex items-center gap-3">
            <Link
              href={`/comercio/${commerceSlug}`}
              target="_blank"
              className="bg-gradient-to-r from-[#00ADB5] to-[#007C8A] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
            >
              <span>Ver Perfil Público</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-colors relative cursor-pointer"
              title="Notificaciones de Consultas"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00E5E8] animate-pulse" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={handleSignOut}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Cerrar Sesión"
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
