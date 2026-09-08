'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Store, MessageCircle, MapPin, Mail, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#004b87] text-slate-200 border-t border-slate-700 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative w-44 h-14 bg-white rounded-xl p-2 inline-block">
              <Image
                src="/logo.jpeg"
                alt="Entre Ríos ON Portal"
                fill
                className="object-contain p-1"
              />
            </div>

            <p className="text-xs text-slate-200 leading-relaxed max-w-sm font-medium">
              Plataforma regional híbrida que integra el Directorio Comercial B2B, el Catálogo de Productos directo a WhatsApp y el Portal de Medios y Turismo de la Provincia de Entre Ríos.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="#sumar-comercio"
                className="bg-[#00a859] hover:bg-[#008746] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-md"
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
              <li><Link href="/?city=parana" className="hover:text-[#8cc63f] transition-colors">Paraná (Capital)</Link></li>
              <li><Link href="/?city=concordia" className="hover:text-[#8cc63f] transition-colors">Concordia</Link></li>
              <li><Link href="/?city=colon" className="hover:text-[#8cc63f] transition-colors">Colón</Link></li>
              <li><Link href="/?city=gualeguaychu" className="hover:text-[#8cc63f] transition-colors">Gualeguaychú</Link></li>
              <li><Link href="/?city=concepcion-del-uruguay" className="hover:text-[#8cc63f] transition-colors">Concepción del Uruguay</Link></li>
              <li><Link href="/?city=federacion" className="hover:text-[#8cc63f] transition-colors">Federación</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Sectores Destacados</h4>
            <ul className="space-y-2 text-xs text-slate-200 font-medium">
              <li><Link href="#catalogo" className="hover:text-[#8cc63f] transition-colors">Artesanías Regionales</Link></li>
              <li><Link href="#catalogo" className="hover:text-[#8cc63f] transition-colors">Gastronomía del Litoral</Link></li>
              <li><Link href="#catalogo" className="hover:text-[#8cc63f] transition-colors">Vinos & Bodegas Entre Ríos</Link></li>
              <li><Link href="#catalogo" className="hover:text-[#8cc63f] transition-colors">Productores Citrícolas & Miel</Link></li>
              <li><Link href="#catalogo" className="hover:text-[#8cc63f] transition-colors">Turismo Aventura & Paseos</Link></li>
            </ul>
          </div>

          {/* Contact & B2B */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Atención B2B</h4>
            <div className="space-y-2 text-xs text-slate-200 font-medium">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8cc63f]" />
                <span>Casa de Gobierno, Paraná, ER</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8cc63f]" />
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
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 gap-4">
          <p>© {new Date().getFullYear()} Entre Ríos ON Portal. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1 font-medium">
            <span>Desarrollado para potenciar Entre Ríos con</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
          </p>
        </div>

      </div>
    </footer>
  );
}
