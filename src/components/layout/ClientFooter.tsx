'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function ClientFooter() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-10 pb-0 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-between">
          
          {/* Left Column: Brand Logo & Handwritten Slogan */}
          <div className="md:col-span-4 space-y-3">
            <div className="relative w-44 h-14">
              <Image
                src="/logo.jpeg"
                alt="Entre Ríos ON Portal"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="font-handwritten text-2xl text-slate-700 font-bold">
              Lo nuestro también conecta
            </p>
          </div>

          {/* Center Column: Social Icons & Links */}
          <div className="md:col-span-4 flex flex-col items-center justify-center space-y-4 text-center">
            {/* Social icons */}
            <div className="flex items-center justify-center gap-3 text-slate-700">
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-100 hover:bg-[#00a859] hover:text-white rounded-full transition-colors" title="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-100 hover:bg-[#00a859] hover:text-white rounded-full transition-colors" title="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.592 9 4.416V8z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-100 hover:bg-[#00a859] hover:text-white rounded-full transition-colors" title="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-100 hover:bg-[#00a859] hover:text-white rounded-full transition-colors" title="TikTok">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.29-2.87 1.12-5.69 3.53-7.21 1.25-.8 2.73-1.22 4.22-1.19v4.06c-.84-.06-1.69.21-2.38.7-.99.71-1.54 1.92-1.46 3.14.07 1.22.75 2.33 1.8 2.94 1.05.62 2.38.65 3.44.07 1.06-.58 1.74-1.69 1.78-2.89.04-3.8.01-7.59.02-11.39z"/>
                </svg>
              </a>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-slate-500">
              <Link href="#sobre" className="hover:text-[#00a859]">Sobre ON Portal</Link>
              <span>|</span>
              <Link href="#ayuda" className="hover:text-[#00a859]">Ayuda</Link>
              <span>|</span>
              <Link href="#terminos" className="hover:text-[#00a859]">Términos y condiciones</Link>
              <span>|</span>
              <Link href="#privacidad" className="hover:text-[#00a859]">Privacidad</Link>
              <span>|</span>
              <Link href="#contacto" className="hover:text-[#00a859]">Contacto</Link>
            </div>
          </div>

          {/* Right Column: Province Outline & Slogan */}
          <div className="md:col-span-4 flex items-center justify-end gap-3 text-right">
            <div className="w-16 h-20 relative">
              <svg viewBox="0 0 100 120" className="w-full h-full text-slate-400 stroke-current fill-none stroke-[2]">
                <path d="M 30,10 C 50,5 75,15 70,35 C 80,50 85,70 75,95 C 60,110 35,115 20,95 C 15,70 10,40 30,10 Z" />
              </svg>
            </div>
            <div>
              <p className="font-handwritten text-2xl text-slate-800 font-bold leading-tight">
                Entre Ríos,<br />más cerca tuyo.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom River Wave Gradient Banner */}
      <div className="w-full h-12 bg-gradient-to-r from-[#00a859] via-[#29b6f6] to-[#005691]" />
    </footer>
  );
}
