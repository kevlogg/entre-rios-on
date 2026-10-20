'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, Commerce } from '@/types';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { ClientFooter } from '@/components/layout/ClientFooter';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { KpiCardsRow } from '@/components/admin/KpiCardsRow';
import { CatalogManager } from '@/components/admin/CatalogManager';
import { ProfileEditor } from '@/components/admin/ProfileEditor';
import { SubscriptionPlans } from '@/components/admin/SubscriptionPlans';
import { MessageCircle, ShieldCheck, Zap, Sparkles, ExternalLink, ArrowRight, Store, Gift } from 'lucide-react';
import { parseProductGallery } from '@/lib/utils/product-gallery';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [commerce, setCommerce] = useState<Commerce | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [waClicksCount, setWaClicksCount] = useState<number>(0);
  const [viewsCount, setViewsCount] = useState<number>(0);
  const [waMessageTemplate, setWaMessageTemplate] = useState(
    'Hola, vi su negocio en el portal ON MÁS y me gustaría realizar una consulta.'
  );

  const [userType, setUserType] = useState<'particular' | 'comercio' | 'turismo'>('comercio');
  const [isSubscriptionActive, setIsSubscriptionActive] = useState<boolean>(true);

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

        // Obtener perfil en profiles para tipo de usuario actualizado
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        const rawType = (profile?.user_type || user.user_metadata?.user_type || 'comercio') as 'particular' | 'comercio' | 'turismo';
        setUserType(rawType);

        let targetCommerce: any = null;

        // 2. Buscar el comercio propiedad del usuario autenticado por owner_id
        const { data: userCommerces } = await supabase
          .from('commerces')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (userCommerces && userCommerces.length > 0) {
          targetCommerce = userCommerces[0];
        }

        // 4. Resolver objeto Commerce utilizando datos reales del usuario
        const merchantName =
          targetCommerce?.name ||
          user.user_metadata?.commerce_name ||
          profile?.full_name ||
          user.user_metadata?.full_name ||
          user.email?.split('@')[0] ||
          (rawType === 'particular' ? 'Vecino ON MÁS' : rawType === 'turismo' ? 'Mi Complejo Turístico' : 'Mi Empresa Comercial');

        const cityName = targetCommerce?.city_name || profile?.city_name || user.user_metadata?.city_name || 'Rosario';
        const cleanSlug = merchantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'comercio';

        const hasActiveSub = targetCommerce?.is_subscription_active ?? (rawType === 'particular' ? false : (user.user_metadata?.is_subscription_active ?? false));
        setIsSubscriptionActive(Boolean(hasActiveSub));

        const rawTier = (targetCommerce?.subscription_tier || 'BRONCE').toUpperCase();
        const mappedPlan: 'Bronce' | 'Plata' | 'Oro' =
          rawTier.includes('ORO') ? 'Oro' :
          rawTier.includes('PLATA') ? 'Plata' : 'Bronce';

        const resolvedCommerce: Commerce = {
          id: targetCommerce?.id || `comm-${user.id}`,
          name: targetCommerce?.name || user.user_metadata?.commerce_name || merchantName,
          slug: targetCommerce?.slug || cleanSlug,
          category: targetCommerce?.category || (rawType === 'turismo' ? 'Turismo & Alojamientos' : 'Comercio General'),
          cityId: targetCommerce?.city_id || user.user_metadata?.city_id || 'rosario',
          cityName: targetCommerce?.city_name || user.user_metadata?.city_name || cityName,
          provinceId: targetCommerce?.province_id || user.user_metadata?.province_id || 'santa-fe',
          provinceName: targetCommerce?.province_name || (targetCommerce?.province_id === 'entre-rios' || user.user_metadata?.province_id === 'entre-rios' ? 'Entre Ríos' : 'Santa Fe'),
          description: targetCommerce?.description || (rawType === 'particular' ? `Cuenta vecino registrada en ${cityName}.` : `Comercio adherido al portal ON MÁS en ${cityName}.`),
          rating: Number(targetCommerce?.rating || 5.0),
          reviewCount: targetCommerce?.review_count || 1,
          isVerified: targetCommerce?.is_verified ?? (rawType !== 'particular'),
          isSubscriptionActive: Boolean(hasActiveSub),
          logoUrl: (targetCommerce?.logo_url && !targetCommerce.logo_url.includes('city-rosario.jpg')) ? targetCommerce.logo_url : (user.user_metadata?.logo_url && !user.user_metadata.logo_url.includes('city-rosario.jpg') ? user.user_metadata.logo_url : ''),
          coverUrl: (targetCommerce?.cover_url && !targetCommerce.cover_url.includes('city-rosario.jpg')) ? targetCommerce.cover_url : (user.user_metadata?.cover_url && !user.user_metadata.cover_url.includes('city-rosario.jpg') ? user.user_metadata.cover_url : '/images/default-commerce-cover.jpg'),
          phoneWhatsApp: targetCommerce?.phone_whatsapp || profile?.phone_whatsapp || user.user_metadata?.phone_whatsapp || '',
          address: targetCommerce?.address ?? '',
          email: user.email || targetCommerce?.email || '',
          isDigitalOnly: Boolean(
            targetCommerce?.is_digital_only ||
            user.user_metadata?.is_digital_only ||
            user.user_metadata?.is_online_only ||
            targetCommerce?.province_id === 'online'
          ),
          website: targetCommerce?.website || '',
          plan: mappedPlan,
        };

        setCommerce(resolvedCommerce);

        // 5. Cargar métricas reales (WhatsApp Clicks y Vistas de Perfil)
        if (targetCommerce?.id) {
          // Contar clicks de WhatsApp desde la tabla de eventos (source of truth)
          const { count: waEventCount } = await supabase
            .from('whatsapp_clicks')
            .select('*', { count: 'exact', head: true })
            .eq('commerce_id', targetCommerce.id);

          // Contar vistas de perfil desde la tabla de historial granular
          const { count: viewEventCount } = await supabase
            .from('profile_views')
            .select('*', { count: 'exact', head: true })
            .eq('commerce_id', targetCommerce.id);

          const totalWaClicks = Math.max(
            waEventCount || 0,
            Number(targetCommerce.whatsapp_clicks_count || 0)
          );

          const totalViews = Math.max(
            viewEventCount || 0,
            Number(targetCommerce.views_count || 0)
          );

          setWaClicksCount(totalWaClicks);
          setViewsCount(totalViews);

          // Cargar productos pertenecientes al comercio
          const { data: prodsData } = await supabase
            .from('products')
            .select('*')
            .eq('commerce_id', targetCommerce.id);

          if (prodsData && prodsData.length > 0) {
            setProducts(
              prodsData.map((p) => {
                const { description: cleanDesc, galleryImages } = parseProductGallery(p.description, p.image_url, p.gallery_images);
                return {
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
                  galleryImages,
                  category: p.category,
                  categoryId: p.category_id,
                  isFeatured: p.is_featured,
                  description: cleanDesc,
                  phoneWhatsApp: p.phone_whatsapp,
                  whatsappMessageCustom: p.whatsapp_message_custom,
                };
              })
            );
          } else {
            setProducts([]);
          }
        } else {
          setWaClicksCount(0);
          setViewsCount(0);
          setProducts([]);
        }

      } catch (err) {
        console.warn('Error al cargar datos en Admin:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRealData();
  }, [router]);

  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? { ...p, ...updatedProd } : p))
    );
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading || !commerce) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-4 border-[#00ADB5] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-300">Cargando tu panel comercial...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Top Navbar */}
      <AdminHeader
        commerceName={commerce.name}
        commerceSlug={commerce.slug}
        cityName={commerce.cityName}
        userType={userType}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Sidebar Navigation */}
          <AdminSidebar
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            productCount={products.length}
            userType={userType}
          />

          {/* Main Tab Content */}
          <div className="flex-1 space-y-8">

            {/* CARTEL INFORMATIVO PARA VECINOS O CUENTAS INACTIVAS */}
            {!isSubscriptionActive && (
              userType === 'particular' ? (
                <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border-2 border-cyan-400 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="p-3 bg-[#0047BA] text-white rounded-2xl shrink-0 font-black text-xl shadow-xs">
                      🏡
                    </div>
                    <div className="space-y-0.5">
                      <div className="inline-flex items-center gap-1.5 bg-[#0047BA]/10 border border-[#0047BA]/30 text-[#0047BA] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Espacio Vecino • Usuario Registrado
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                        ¿Querés publicar tu comercio o complejo turístico en ON MÁS?
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        Actualmente tu cuenta es de vecino. Podés activar tu perfil comercial o turístico en cualquier momento contratando un plan. Tu cuenta se convertirá automáticamente.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('subscription')}
                    className="w-full sm:w-auto bg-[#0047BA] hover:bg-[#002878] text-white px-5 py-3 rounded-2xl font-black text-xs shadow-md transition-all active:scale-95 shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#00E5E8]" />
                    <span>Ver Planes de Activación</span>
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shrink-0 font-black text-xl shadow-xs">
                      ⚠️
                    </div>
                    <div className="space-y-0.5">
                      <div className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Acción Requerida • Cuenta Inactiva
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                        Tu {userType === 'turismo' ? 'complejo turístico' : 'comercio'} aún no está activo en ON MÁS
                      </h3>
                      <p className="text-xs text-slate-600 font-medium">
                        Hasta que no contrates un plan no estarás visible en las búsquedas. Elegí un plan para comenzar a publicar.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('subscription')}
                    className="w-full sm:w-auto bg-[#0047BA] hover:bg-[#002878] text-white px-5 py-3 rounded-2xl font-black text-xs shadow-md transition-all active:scale-95 shrink-0 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#00E5E8]" />
                    <span>Ver Planes de Suscripción</span>
                  </button>
                </div>
              )
            )}

            {/* TAB 1: DASHBOARD & KPIS */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Hero Greeting & Quick Actions */}
                <div className={`rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md ${
                  userType === 'particular'
                    ? 'bg-gradient-to-r from-slate-900 via-[#0047BA] to-cyan-700'
                    : userType === 'turismo'
                    ? 'bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#00ADB5]'
                    : 'bg-gradient-to-r from-[#004b87] to-[#00a859]'
                }`}>
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {userType === 'particular'
                          ? 'Espacio Vecino • Usuario Registrado'
                          : userType === 'turismo'
                          ? `Gestión Turística • ${isSubscriptionActive ? 'Perfil Activo' : 'Pendiente de Plan'}`
                          : `Panel Comercial • ${isSubscriptionActive ? 'Perfil Activo' : 'Pendiente de Plan'}`}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                      ¡Hola, {commerce.name}!
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-100 font-medium max-w-xl">
                      {userType === 'particular'
                        ? 'Estás en tu Espacio Vecino. Podés explorar comercios, contactar prestadores y sumarte a sorteos. Si tenés un negocio, activá tu plan para publicar.'
                        : isSubscriptionActive 
                        ? (userType === 'turismo'
                            ? `Tu perfil turístico en ${commerce.cityName} se encuentra activo y listo para recibir consultas y reservas directas a tu WhatsApp.`
                            : `Tu perfil comercial en ${commerce.cityName} se encuentra activo y listo para recibir consultas.`)
                        : `Contratá tu plan para activar tu presencia en ${commerce.cityName}.`}
                    </p>
                  </div>

                  {userType === 'particular' ? (
                    <button
                      onClick={() => setActiveTab('subscription')}
                      className="bg-white hover:bg-slate-100 text-[#0047BA] px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-lg shrink-0 transition-transform active:scale-95 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-600" />
                      <span>Activar Mi Negocio</span>
                    </button>
                  ) : isSubscriptionActive ? (
                    <button
                      onClick={() => setActiveTab('catalog')}
                      className="bg-white hover:bg-slate-100 text-[#004b87] px-5 py-3 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-lg shrink-0 transition-transform active:scale-95 cursor-pointer"
                    >
                      <Store className="w-4 h-4 text-[#00a859]" />
                      <span>{userType === 'turismo' ? 'Publicar Servicio / Cabaña' : 'Publicar Oferta'}</span>
                    </button>
                  ) : null}
                </div>

                {/* KPI Cards Row con métricas reales */}
                <KpiCardsRow
                  productCount={products.length}
                  whatsappClicksCount={waClicksCount}
                  profileViewsCount={viewsCount}
                />

                {/* Quick Catalog Preview - Solo visible si la suscripción está activa y no es particular */}
                {isSubscriptionActive && userType !== 'particular' && (
                  <CatalogManager
                    commerce={commerce}
                    products={products}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                )}
              </div>
            )}

            {/* TAB 2: CATALOG MANAGER */}
            {activeTab === 'catalog' && (
              <div className="animate-in fade-in duration-200">
                {isSubscriptionActive && userType !== 'particular' ? (
                  <CatalogManager
                    commerce={commerce}
                    products={products}
                    onAddProduct={handleAddProduct}
                    onUpdateProduct={handleUpdateProduct}
                    onDeleteProduct={handleDeleteProduct}
                  />
                ) : (
                  <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-2">
                      <ShieldCheck className="w-8 h-8 text-[#00ADB5]" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800">
                      {userType === 'particular' 
                        ? 'Catálogo reservado para Comercios y Turismo' 
                        : userType === 'turismo'
                        ? 'Servicios y Cabañas Pausados'
                        : 'Catálogo Bloqueado'}
                    </h2>
                    <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                      {userType === 'particular'
                        ? 'Como usuario Vecino podés navegar y comprar. Para publicar tus productos, promociones o cabañas en el portal ON MÁS y recibir clientes por WhatsApp, contratá un plan para activar tu cuenta comercial.'
                        : userType === 'turismo'
                        ? 'Para agregar cabañas, posadas y servicios turísticos a tu catálogo, debés tener un plan de turismo activo.'
                        : 'Para agregar productos y ofertas a tu catálogo, debés tener un plan de suscripción comercial activo.'}
                    </p>
                    <button
                      onClick={() => setActiveTab('subscription')}
                      className="mt-4 bg-[#0047BA] hover:bg-[#002878] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      {userType === 'particular' ? 'Ver Planes y Activar Negocio' : 'Activar Plan Ahora'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PROFILE EDITOR */}
            {activeTab === 'profile' && (
              <div className="animate-in fade-in duration-200">
                <ProfileEditor
                  commerce={commerce}
                  onUpdateCommerce={(updated) => setCommerce(updated)}
                />
              </div>
            )}

            {/* TAB 4: MI SITIO WEB */}
            {activeTab === 'website' && (
              <div className="animate-in fade-in duration-200">
                {/* Dynamically imported website promo component */}
                {React.createElement(
                  require('@/components/admin/WebsitePromotion').WebsitePromotion,
                  { commerce }
                )}
              </div>
            )}

            {/* TAB 5: SUBSCRIPTION */}
            {activeTab === 'subscription' && (
              <SubscriptionPlans
                commerceId={commerce.id}
                commerceName={commerce.name}
                cityName={commerce.cityName}
                phoneWhatsApp={commerce.phoneWhatsApp}
                userType={userType}
                isAuthenticated={true}
                showHistory={true}
                onPlanActivated={(planName) => {
                  setCommerce({ ...commerce, isSubscriptionActive: true });
                  setIsSubscriptionActive(true);
                  if (userType === 'particular') {
                    setUserType(planName.toLowerCase().includes('turismo') ? 'turismo' : 'comercio');
                  }
                }}
              />
            )}

          </div>

        </div>
      </main>
      <ClientFooter />
    </div>
  );
}
