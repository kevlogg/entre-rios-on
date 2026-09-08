'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Store, ShieldCheck, ExternalLink, Bell, User, CheckCircle } from 'lucide-react';

interface AdminHeaderProps {
  commerceName: string;
  commerceSlug: string;
  cityName: string;
}

export function AdminHeader({ commerceName, commerceSlug, cityName }: AdminHeaderProps) {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-11 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Merchant Badge */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-32 h-10">
                <Image
                  src="/logo.jpeg"
                  alt="Entre Ríos ON"
                  fill
                  className="object-contain object-left brightness-200"
                />
              </div>
            </Link>

            <span className="hidden md:inline-block h-6 w-px bg-slate-700" />

            <div className="hidden sm:flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1 rounded-xl text-xs">
              <Store className="w-3.5 h-3.5 text-[#00a859]" />
              <span className="font-extrabold text-slate-100">{commerceName}</span>
              <span className="text-slate-400">({cityName})</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#00a859]" />
            </div>
          </div>

          {/* Action CTAs: Ver Perfil Público, Notificaciones, Usuario */}
          <div className="flex items-center gap-3">
            <Link
              href={`/comercio/${commerceSlug}`}
              target="_blank"
              className="bg-[#00a859] hover:bg-[#008746] text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Ver Perfil Público</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors relative"
              title="Notificaciones de Consultas"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00a859] animate-pulse" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-[#004b87] text-white flex items-center justify-center font-bold text-xs">
                ED
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-extrabold leading-none text-slate-200">Admin Delta</p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Socio Verificado</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
