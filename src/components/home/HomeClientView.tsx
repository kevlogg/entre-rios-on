'use client';

import React, { useState, useEffect } from 'react';
import { City, Product, CommunityEvent, BannerSlide, Commerce } from '@/types';
import { HeroSlider } from '@/components/home/HeroSlider';
import { CityFilterBar } from '@/components/home/CityFilterBar';
import { ProductCard } from '@/components/home/ProductCard';
import { CommunityEvents } from '@/components/home/CommunityEvents';
import { Store, MessageCircle, ShieldCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';

interface HomeClientViewProps {
  slides: BannerSlide[];
  cities: City[];
  initialProducts: Product[];
  events: CommunityEvent[];
  featuredCommerce: Commerce;
  weekendEvent: CommunityEvent;
}

export function HomeClientView({
  slides,
  cities,
  initialProducts,
  events,
  featuredCommerce,
  weekendEvent,
}: HomeClientViewProps) {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [filteredEvents, setFilteredEvents] = useState<CommunityEvent[]>(events);

  // Sync with URL query param if present
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const cityParam = params.get('city') || 'all';
      setSelectedCity(cityParam);
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Update products when selected city changes
  useEffect(() => {
    if (selectedCity === 'all') {
      setFilteredProducts(initialProducts);
      setFilteredEvents(events);
    } else {
      setFilteredProducts(
        initialProducts.filter((p) => p.cityId.toLowerCase() === selectedCity.toLowerCase())
      );
      setFilteredEvents(
        events.filter((e) => e.cityId.toLowerCase() === selectedCity.toLowerCase())
      );
    }
  }, [selectedCity, initialProducts, events]);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section Híbrida (Editorial + Bento Lateral) */}
      <HeroSlider
        slides={slides}
        featuredCommerce={featuredCommerce}
        weekendEvent={weekendEvent}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 2. Persistent City Filter Bar */}
        <CityFilterBar
          cities={cities}
          selectedCity={selectedCity}
          onSelectCity={(cityId) => setSelectedCity(cityId)}
        />

        {/* 3. Comercios & Catálogo Destacado Section */}
        <section id="catalogo" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#eae3d2] pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#1d5b79] flex items-center gap-1.5">
                <Store className="w-4 h-4 text-[#2d6a4f]" />
                Directorio Comercial B2B & Catálogo
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f3443] tracking-tight mt-1">
                Catálogo con Pedido Directo a WhatsApp
              </h2>
            </div>
            <span className="text-sm font-semibold text-slate-500">
              {filteredProducts.length} productos / servicios en exhibición
            </span>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#eae3d2] space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#f4efe6] text-[#1d5b79] mx-auto flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No hay productos exhibidos para esta localidad por el momento</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                ¿Tenés un comercio en esta zona? Sumate como socio pionero en Entre Ríos ON.
              </p>
              <button
                onClick={() => setSelectedCity('all')}
                className="bg-[#1d5b79] text-white px-5 py-2.5 rounded-xl font-bold text-xs"
              >
                Ver todos los productos de Entre Ríos
              </button>
            </div>
          )}
        </section>

        {/* 4. B2B Subscription CTA Banner */}
        <section id="sumar-comercio" className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0f3443] via-[#1d5b79] to-[#1b4332] text-white p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#52b788]/20 border border-[#52b788]/40 text-[#52b788] text-xs font-bold px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Suscripción Comercial B2B Entre Ríos ON
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                ¿Tenés un negocio, posada o taller artesanal en Entre Ríos?
              </h2>
              <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
                Posicioná tus productos en la plataforma regional líder, recibí consultas y pedidos sin comisiones directo en tu WhatsApp personal o corporativo.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-[#52b788]" />
                  <span>Perfil Verificado Regional</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Sin comisión por ventas</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Publicación Ilimitada</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <a
                href="https://wa.me/5493434567890?text=Hola%20equipo%20Entre%20R%C3%ADos%20ON,%20quiero%20sumar%20mi%20comercio%20al%20directorio."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-4 rounded-2xl font-extrabold text-base shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95 text-center"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Sumar Mi Negocio Ahora</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* 5. Agenda de la Comunidad y Noticias */}
        <CommunityEvents events={filteredEvents} />

      </div>
    </div>
  );
}
