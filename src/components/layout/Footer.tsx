'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Store, MessageCircle, MapPin, Mail, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#071e28] text-slate-300 border-t border-[#0f3443] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1d5b79] flex items-center justify-center text-[#52b788]">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                ENTRE RÍOS <span className="text-[#52b788]">ON</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Plataforma regional híbrida que integra el Directorio Comercial B2B, el Catálogo de Productos directo a WhatsApp y el Portal de Medios y Turismo de la Provincia de Entre Ríos.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="#sumar-comercio"
                className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-[#52b788]" />
                <span>Adherir mi Comercio</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Nodos Regionales</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/?city=parana" className="hover:text-white transition-colors">Paraná (Capital)</Link></li>
              <li><Link href="/?city=concordia" className="hover:text-white transition-colors">Concordia</Link></li>
              <li><Link href="/?city=colon" className="hover:text-white transition-colors">Colón</Link></li>
              <li><Link href="/?city=gualeguaychu" className="hover:text-white transition-colors">Gualeguaychú</Link></li>
              <li><Link href="/?city=concepcion-del-uruguay" className="hover:text-white transition-colors">Concepción del Uruguay</Link></li>
              <li><Link href="/?city=federacion" className="hover:text-white transition-colors">Federación</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sectores Destacados</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="#catalogo" className="hover:text-white transition-colors">Artesanías Regionales</Link></li>
              <li><Link href="#catalogo" className="hover:text-white transition-colors">Gastronomía del Litoral</Link></li>
              <li><Link href="#catalogo" className="hover:text-white transition-colors">Vinos & Bodegas Entre Ríos</Link></li>
              <li><Link href="#catalogo" className="hover:text-white transition-colors">Productores Citrícolas & Miel</Link></li>
              <li><Link href="#catalogo" className="hover:text-white transition-colors">Turismo Aventura & Paseos</Link></li>
            </ul>
          </div>

          {/* Contact & B2B */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Atención B2B</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#52b788]" />
                <span>Casa de Gobierno, Paraná, ER</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#52b788]" />
                <span>contacto@entrerioson.com.ar</span>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>+54 9 343 456-7890</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#0f3443] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Entre Ríos ON. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Desarrollado para potenciar Entre Ríos con</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
          </p>
        </div>

      </div>
    </footer>
  );
}
