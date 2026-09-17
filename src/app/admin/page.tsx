'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, Commerce } from '@/types';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { KpiCardsRow } from '@/components/admin/KpiCardsRow';
import { CatalogManager } from '@/components/admin/CatalogManager';
import { ProfileEditor } from '@/components/admin/ProfileEditor';
import { SubscriptionPlans } from '@/components/admin/SubscriptionPlans';
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

const INITIAL_COMMERCE: Commerce = {
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
  website: 'https://alfareriadelta.com',
};

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [commerce, setCommerce] = useState(INITIAL_COMMERCE);
  const [products, setProducts] = useState<Product[]>(INITIAL_MERCHANT_PRODUCTS);
  const [waMessageTemplate, setWaMessageTemplate] = useState(
    'Hola, vi su negocio en el portal ON MÁS y me gustaría realizar una consulta.'
  );

  React.useEffect(() => {
    async function loadRealData() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();

        // 1. Obtener sesión del usuario autenticado
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        let targetCommerce = null;

        // Buscar el comercio propiedad del usuario autenticado
        const { data: userCommerces } = await supabase
          .from('commerces')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (userCommerces && userCommerces.length > 0) {
          targetCommerce = userCommerces[0];
        }

        // Si el usuario registrado no tiene comercio creado aún, lo creamos dinámicamente
        if (!targetCommerce) {
          const merchantName = user.user_metadata?.commerce_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Mi Comercio Comercial';
          const slug = merchantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `comm-${Date.now()}`;

          const { data: createdCommerce } = await supabase
            .from('commerces')
            .insert({
              name: merchantName,
              slug,
              category: 'Comercio General',
              province_id: 'santa-fe',
              city_id: 'rosario',
              city_name: 'Rosario',
              description: `Comercio adherido al portal ON MÁS.`,
              phone_whatsapp: '5493415550199',
              address: 'Rosario, Argentina',
              logo_url: '/images/city-rosario.jpg',
              cover_url: '/images/city-rosario.jpg',
              is_verified: true,
              is_subscription_active: true,
              owner_id: user.id,
            })
            .select()
            .single();

          if (createdCommerce) {
            targetCommerce = createdCommerce;
          }
        }

        if (targetCommerce) {
          const c = targetCommerce;
          setCommerce({
            id: c.id,
            name: c.name,
            slug: c.slug,
            category: c.category || 'Comercio General',
            cityId: c.city_id || 'rosario',
            cityName: c.city_name || 'Rosario',
            description: c.description || `Comercio adherido al portal ON MÁS en ${c.city_name}.`,
            rating: Number(c.rating || 5.0),
            reviewCount: c.review_count || 1,
            isVerified: c.is_verified ?? true,
            isSubscriptionActive: c.is_subscription_active ?? true,
            logoUrl: c.logo_url || '/images/city-rosario.jpg',
            coverUrl: c.cover_url || '/images/city-rosario.jpg',
            phoneWhatsApp: c.phone_whatsapp || '',
            address: c.address || `${c.city_name}, Argentina`,
            instagram: c.instagram || '',
            website: c.website || '',
          });

          // 2. Cargar productos vinculados a este comercio específico
          const { data: prodsData } = await supabase
            .from('products')
            .select('*')
            .eq('commerce_id', c.id);

          if (prodsData && prodsData.length > 0) {
            setProducts(
              prodsData.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                price: p.price ? Number(p.price) : undefined,
                currency: p.currency || 'ARS',
                commerceId: p.commerce_id,
                commerceName: p.commerce_name,
                cityId: p.city_id,
                cityName: p.city_name,
                provinceId: p.province_id,
                imageUrl: p.image_url,
                category: p.category,
                categoryId: p.category_id,
                isFeatured: p.is_featured,
                description: p.description,
                phoneWhatsApp: p.phone_whatsapp,
                whatsappMessageCustom: p.whatsapp_message_custom,
              }))
            );
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.warn('Fallback a datos de demostración en Admin:', err);
      }
    }

    loadRealData();
  }, []);

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
        commerceName={commerce.name}
        commerceSlug={commerce.slug}
        cityName={commerce.cityName}
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
                      ¡Hola, {commerce.name}!
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-100 font-medium max-w-xl">
                      Tu perfil en {commerce.cityName} se encuentra activo y recibiendo consultas directas en WhatsApp sin intermediarios ni comisiones.
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
                <ProfileEditor commerce={commerce} />
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
                      value={commerce.phoneWhatsApp}
                      readOnly
                      className="w-full bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-mono"
                    />
                    <span className="text-[11px] text-slate-400 font-medium mt-1 block">
                      Incluye código de país y área (ej. 5493415550199).
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
                      href={`https://wa.me/${commerce.phoneWhatsApp}?text=${encodeURIComponent(waMessageTemplate)}`}
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

            {/* TAB 5: SUBSCRIPTION */}
            {activeTab === 'subscription' && (
              <SubscriptionPlans commerceId={commerce.id} />
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
