'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export function FloatingWhatsAppButton({
  phoneNumber = '5493434567890',
  message = 'Hola ON MÁS! Quisiera consultar sobre el portal.',
}: FloatingWhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 pointer-events-auto">
      
      {/* Tooltip visible on hover / desktop */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700/80 text-xs font-bold hover:bg-slate-900 transition-all hover:scale-105 group"
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span>¿Consultas? Hablá con ON MÁS</span>
      </a>

      {/* Floating Button Icon */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        aria-label="Contactar por WhatsApp con ON MÁS"
        title="Contactar por WhatsApp con ON MÁS"
      >
        {/* Animated Ping Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/50 animate-ping pointer-events-none opacity-75" />
        
        {/* Icon */}
        <MessageCircle className="w-7 h-7 fill-current relative z-10" />
      </a>

    </div>
  );
}
