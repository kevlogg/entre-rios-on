'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { KpiCardsRow } from '@/components/admin/KpiCardsRow';
import { CatalogManager } from '@/components/admin/CatalogManager';
import { ProfileEditor } from '@/components/admin/ProfileEditor';
import { MessageCircle, ShieldCheck, Zap, Sparkles, ExternalLink, ArrowRight, Store, Gift } from 'lucide-react';

const INITIAL_MERCHANT_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'Juego de Mates de Cerámica Cincelada y Alpaca',
    slug: 'juego-mate-ceramica-alpaca',
    price: 34500,
    currency: 'ARS',
    commerceId: 'c1',
    commerceName: 'Alfarería & Cerámica Delta',
    cityId: 'colon',
    cityName: 'Colón',
    imageUrl: '/images/prod-mate.jpg',
    category: 'Hogar y Deco',
    categoryId: 'hogar',
    isFeatured: true,
    description: 'Mate de cerámica artesanal horneada a 1200°C con virola grabada en alpaca con motivos de flora autóctona. Incluye bombilla de plata alemana.',
    phoneWhatsApp: '5493447451234',
  },
  {
    id: 'p6',
    title: 'Cuchillo Criollo de Acero de Disco con Cabo de Guampa',
    slug: 'cuchillo-criollo-disco-guampa',
    price: 39000,
    currency: 'ARS',
    commerceId: 'c1',
    commerceName: 'Alfarería & Cerámica Delta',
    cityId: 'colon',
    cityName: 'Colón',
    imageUrl: '/images/prod-cuchillo.jpg',
    category: 'Hogar y Deco',
    categoryId: 'hogar',
    isFeatured: false,
    description: 'Forjado a mano por el maestro platero de Colón. Hoja de 18cm en acero de arado tratada térmicamente con vaina de cuero vacuno curtido.',
    phoneWhatsApp: '5493447451234',
  },
  {
    id: 'p13',
    title: 'Juego de Grifería Monocomando para Baño Cromo',
    slug: 'griferia-monocomando-bano-cromo',
    price: 78500,
    currency: 'ARS',
    commerceId: 'c1',
    commerceName: 'Alfarería & Cerámica Delta',
    cityId: 'colon',
    cityName: 'Colón',
    imageUrl: '/images/prod-mate.jpg',
    category: 'Construcción',
    categoryId: 'construccion',
    isFeatured: false,
    description: 'Set completo lavatorio y bidet monocomando con aireador ecológico ahorrador de agua.',
    phoneWhatsApp: '5493447451234',
  },
];

const INITIAL_COMMERCE = {
  id: 'c1',
  name: 'Alfarería & Cerámica Delta',
  slug: 'alfareria-ceramica-delta',
  category: 'Artesanías & Decoración',
  cityId: 'colon',
  cityName: 'Colón',
  description: 'Taller galardonado de cerámica modelada a mano utilizando arcillas nativas de Colón y diseños inspirados en la fauna del litoral.',
  rating: 4.9,
  reviewCount: 84,
  isVerified: true,
  isSubscriptionActive: true,
  logoUrl: '/images/commerce-alfareria.jpg',
  coverUrl: '/images/commerce-alfareria.jpg',
  phoneWhatsApp: '5493447451234',
  address: '12 de Octubre 450, Colón',
  instagram: '@ceramica.delta.colon',
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_MERCHANT_PRODUCTS);
  const [waMessageTemplate, setWaMessageTemplate] = useState(
    'Hola Alfarería Delta, vi su catálogo en el portal Entre Ríos ON y me gustaría realizar una consulta.'
  );

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Top Navbar */}
      <AdminHeader
        commerceName={INITIAL_COMMERCE.name}
        commerceSlug={INITIAL_COMMERCE.slug}
        cityName={INITIAL_COMMERCE.cityName}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Sidebar Navigation */}
          <AdminSidebar
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            productCount={products.length}
          />

          {/* Main Tab Content */}
          <div className="flex-1 space-y-8">

            {/* TAB 1: DASHBOARD & KPIS */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Hero Greeting & Quick Actions */}
                <div className="bg-gradient-to-r from-[#004b87] to-[#00a859] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Panel B2B • Comercio Activo</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                      ¡Hola, {INITIAL_COMMERCE.name}!
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-100 font-medium max-w-xl">
                      Tu perfil en Colón se encuentra activo y recibiendo consultas directas en WhatsApp sin intermediarios ni comisiones.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('catalog')}
                    className="bg-white hover:bg-slate-100 text-[#004b87] px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-lg shrink-0 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Store className="w-4 h-4 text-[#00a859]" />
                    <span>Publicar Oferta</span>
                  </button>
                </div>

                {/* KPI Cards Row */}
                <KpiCardsRow productCount={products.length} />

                {/* Quick Catalog Preview */}
                <CatalogManager
                  products={products}
                  onAddProduct={handleAddProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              </div>
            )}

            {/* TAB 2: CATALOG MANAGER */}
            {activeTab === 'catalog' && (
              <div className="animate-in fade-in duration-200">
                <CatalogManager
                  products={products}
                  onAddProduct={handleAddProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
              </div>
            )}

            {/* TAB 3: PROFILE EDITOR */}
            {activeTab === 'profile' && (
              <div className="animate-in fade-in duration-200">
                <ProfileEditor commerce={INITIAL_COMMERCE} />
              </div>
            )}

            {/* TAB 4: WHATSAPP INTEGRATION & SETUP */}
            {activeTab === 'whatsapp' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4 space-y-1">
                  <h3 className="text-xl font-extrabold text-[#004b87] flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                    <span>Canal de Ventas WhatsApp Directo</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Configurá el número corporativo y los mensajes automáticos que recibirás cuando los clientes hagan clic en tus productos.
                  </p>
                </div>

                <div className="space-y-4 max-w-2xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono WhatsApp Corporativo *</label>
                    <input
                      type="text"
                      value={INITIAL_COMMERCE.phoneWhatsApp}
                      readOnly
                      className="w-full bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-mono"
                    />
                    <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                      Incluye código de país y área de Entre Ríos (ej. 5493447451234).
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Plantilla de Mensaje de Entrada Predeterminada</label>
                    <textarea
                      rows={3}
                      value={waMessageTemplate}
                      onChange={(e) => setWaMessageTemplate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00a859]"
                    />
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                    <span className="text-xs font-extrabold text-emerald-800 block">Vista Previa de Prueba</span>
                    <p className="text-xs text-slate-600 font-medium">
                      Así recibirá tu equipo de atención el mensaje directo cuando un cliente presione &quot;Pedir por WhatsApp&quot;.
                    </p>
                    <a
                      href={`https://wa.me/${INITIAL_COMMERCE.phoneWhatsApp}?text=${encodeURIComponent(waMessageTemplate)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4 fill-current" />
                      <span>Probar Mensaje en WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: B2B SUBSCRIPTION & PLAN */}
            {activeTab === 'subscription' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#004b87] flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#00a859]" />
                      <span>Estado de la Suscripción B2B</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Membresía comercial activa en el Portal Entre Ríos ON.
                    </p>
                  </div>

                  <span className="bg-emerald-100 text-[#00a859] font-black text-xs px-3.5 py-1.5 rounded-full uppercase">
                    Plan Socio Pionero
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Comisiones por Ventas</span>
                    <p className="text-2xl font-black text-emerald-600">0% Libres</p>
                    <p className="text-xs text-slate-500 font-medium">El 100% del cobro va directo a tu cuenta comercial.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Publicación de Ofertas</span>
                    <p className="text-2xl font-black text-[#004b87]">Ilimitada</p>
                    <p className="text-xs text-slate-500 font-medium">Podés renovar o actualizar tu catálogo cuando quieras.</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Verificación Provincial</span>
                    <p className="text-2xl font-black text-amber-500">Insignia Gold</p>
                    <p className="text-xs text-slate-500 font-medium">Comercio auditado y respaldado en la región.</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#004b87] to-[#00a859] rounded-2xl p-6 text-white space-y-3">
                  <h4 className="text-lg font-extrabold">¿Querés destacar tus ofertas en la Portada Principal?</h4>
                  <p className="text-xs text-slate-100 font-medium max-w-xl">
                    Solicitá la posición destacada en el Bento Row o proponé una experiencia para la agenda cultural de Entre Ríos.
                  </p>
                  <a
                    href="https://wa.me/5493434567890?text=Hola%20equipo%20Entre%20R%C3%ADos%20ON,%20quiero%20consultar%20por%20espacios%20destacados."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-[#004b87] px-5 py-2.5 rounded-xl font-extrabold text-xs inline-flex items-center gap-1.5 shadow-md"
                  >
                    <span>Contactar Asesor B2B</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
