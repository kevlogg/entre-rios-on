'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export function FloatingWhatsAppButton({
  phoneNumber = '5493426514889',
  message = 'Hola ON MÁS! Quisiera consultar sobre el portal.',
}: FloatingWhatsAppButtonProps) {
  const pathname = usePathname();
  const isProductPage = Boolean(pathname?.startsWith('/producto'));
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const [isCoveredByProductCTA, setIsCoveredByProductCTA] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    let activeCTAsCount = 0;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeCTAsCount++;
        } else {
          activeCTAsCount = Math.max(0, activeCTAsCount - 1);
        }
      });
      setIsCoveredByProductCTA(activeCTAsCount > 0);
    }, {
      threshold: 0.1,
    });

    const elements = document.querySelectorAll('[data-whatsapp-cta="true"]');
    elements.forEach((el) => observer.observe(el));

    const mutationObserver = new MutationObserver(() => {
      const currentElements = document.querySelectorAll('[data-whatsapp-cta="true"]');
      currentElements.forEach((el) => observer.observe(el));
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed bottom-[85px] sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-3 pointer-events-none transition-all duration-300 ${
        isCoveredByProductCTA || isProductPage ? 'opacity-0 scale-90 translate-y-3 pointer-events-none' : 'opacity-100 scale-100 translate-y-0'
      }`}
    >
      
      {/* Tooltip visible on hover / desktop */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-xl border border-slate-700/80 text-xs font-bold hover:bg-slate-900 transition-all hover:scale-105 group pointer-events-auto"
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span>¿Consultas? Hablá con ON MÁS</span>
      </a>

      {/* Floating Button Icon (56px) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto shrink-0"
        aria-label="Contactar por WhatsApp con ON MÁS"
        title="Contactar por WhatsApp con ON MÁS"
      >
        {/* Animated Ping Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none opacity-60" />
        
        {/* Icon */}
        <MessageCircle className="w-6 h-6 fill-current relative z-10" />
      </a>

    </div>
  );
}
