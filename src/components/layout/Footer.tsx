'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Store, MessageCircle, MapPin, Mail, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#002878] via-[#0047BA] to-slate-950 text-slate-200 border-t border-slate-700 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative w-48 h-14 bg-white/95 rounded-2xl p-2 inline-block shadow-md">
              <Image
                src="/logo.png"
                alt="ON MÁS Portal"
                fill
                className="object-contain p-1"
              />
            </div>

            <p className="text-xs text-slate-200 leading-relaxed max-w-sm font-medium">
              Plataforma regional híbrida que integra el Directorio Comercial B2B, el Catálogo de Productos directo a WhatsApp y el Portal de Medios y Turismo de la Región (Santa Fe & Entre Ríos).
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/login?mode=signup&type=negocio_automotor"
                className="bg-gradient-to-r from-[#00E5E8] to-[#00ADB5] hover:from-[#00ADB5] hover:to-[#007C8A] text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Adherir mi Comercio</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Nodos Regionales</h4>
            <ul className="space-y-2 text-xs text-slate-200 font-medium">
              <li><Link href="/santa-fe/rosario" className="hover:text-[#00E5E8] transition-colors">Rosario (Santa Fe)</Link></li>
              <li><Link href="/santa-fe/santa-fe-capital" className="hover:text-[#00E5E8] transition-colors">Santa Fe Capital</Link></li>
              <li><Link href="/santa-fe/rafaela" className="hover:text-[#00E5E8] transition-colors">Rafaela</Link></li>
              <li><Link href="/entre-rios/parana" className="hover:text-[#00E5E8] transition-colors">Paraná (Entre Ríos)</Link></li>
              <li><Link href="/entre-rios/concordia" className="hover:text-[#00E5E8] transition-colors">Concordia</Link></li>
              <li><Link href="/entre-rios/colon" className="hover:text-[#00E5E8] transition-colors">Colón</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Sectores Destacados</h4>
            <ul className="space-y-2 text-xs text-slate-200 font-medium">
              <li><Link href="/#catalogo" className="hover:text-[#00E5E8] transition-colors">Artesanías Regionales</Link></li>
              <li><Link href="/#catalogo" className="hover:text-[#00E5E8] transition-colors">Gastronomía del Litoral</Link></li>
              <li><Link href="/#catalogo" className="hover:text-[#00E5E8] transition-colors">Vinos & Bodegas Entre Ríos</Link></li>
              <li><Link href="/#catalogo" className="hover:text-[#00E5E8] transition-colors">Productores Citrícolas & Miel</Link></li>
              <li><Link href="/#catalogo" className="hover:text-[#00E5E8] transition-colors">Turismo Aventura & Paseos</Link></li>
            </ul>
          </div>

          {/* Contact & B2B */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Atención B2B</h4>
            <div className="space-y-2 text-xs text-slate-200 font-medium">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00E5E8]" />
                <span>Casa de Gobierno, Paraná, ER</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00E5E8]" />
                <span>contacto@onmas.gob.ar</span>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>+54 9 343 456-7890</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-4">
          <p>© {new Date().getFullYear()} ON MÁS Portal. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1 font-medium">
              <span>Desarrollado para potenciar la región con</span>
              <Heart className="w-3.5 h-3.5 text-cyan-400 fill-current" />
            </p>
            <Link href="/superadmin" className="text-slate-500 hover:text-amber-400 transition-colors text-[11px] font-semibold" title="Acceso Panel SuperAdmin">
              SuperAdmin
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
