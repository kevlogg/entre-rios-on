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

  const [userType, setUserType] = useState<'particular' | 'agencia' | 'negocio_automotor'>('agencia');
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

        const rawType = (user.user_metadata?.user_type || 'agencia') as 'particular' | 'agencia' | 'negocio_automotor';
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

        // 3. Si el usuario no tiene registro aún en commerces por owner_id, intentar buscar si existe uno sin owner_id o crearlo
        if (!targetCommerce) {
          const merchantName =
            user.user_metadata?.commerce_name ||
            user.user_metadata?.full_name ||
            user.email?.split('@')[0] ||
            'Mi Empresa Comercial';
          const cleanSlug = merchantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'comercio';

          const { data: existingUnlinked } = await supabase
            .from('commerces')
            .select('*')
            .or(`slug.eq.${cleanSlug},slug.ilike.${cleanSlug}-%`)
            .is('owner_id', null)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (existingUnlinked) {
            const { data: updatedUnlinked } = await supabase
              .from('commerces')
              .update({ owner_id: user.id })
              .eq('id', existingUnlinked.id)
              .select()
              .single();

            if (updatedUnlinked) {
              targetCommerce = updatedUnlinked;
            }
          }

          if (!targetCommerce) {
            const { data: createdCommerce } = await supabase
              .from('commerces')
              .insert({
                name: merchantName,
                slug: cleanSlug,
                category: rawType === 'negocio_automotor' ? (user.user_metadata?.business_category || 'Negocio Automotor') : (rawType === 'agencia' ? 'Agencia Automotriz' : 'Particular'),
                province_id: user.user_metadata?.province_id || 'santa-fe',
                city_id: user.user_metadata?.city_id || 'rosario',
                city_name: user.user_metadata?.city_name || 'Rosario',
                description: `Perfil registrado en el portal ON MÁS.`,
                phone_whatsapp: user.user_metadata?.phone_whatsapp || '',
                address: '',
                logo_url: '/images/city-rosario.jpg',
                cover_url: '/images/city-rosario.jpg',
                is_verified: true,
                is_subscription_active: false,
                owner_id: user.id,
              })
              .select()
              .single();

            if (createdCommerce) {
              targetCommerce = createdCommerce;
            }
          }
        }

        // 4. Resolver objeto Commerce utilizando datos reales del usuario
        const merchantName =
          targetCommerce?.name ||
          user.user_metadata?.commerce_name ||
          user.user_metadata?.full_name ||
          user.email?.split('@')[0] ||
          'Mi Empresa Comercial';

        const cityName = targetCommerce?.city_name || user.user_metadata?.city_name || 'Rosario';
        const cleanSlug = merchantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'comercio';

        const hasActiveSub = targetCommerce?.is_subscription_active ?? (user.user_metadata?.is_subscription_active ?? false);
        setIsSubscriptionActive(Boolean(hasActiveSub));

        const resolvedCommerce: Commerce = {
          id: targetCommerce?.id || `comm-${user.id}`,
          name: targetCommerce?.name || user.user_metadata?.commerce_name || merchantName,
          slug: targetCommerce?.slug || cleanSlug,
          category: targetCommerce?.category || 'Comercio General',
          cityId: targetCommerce?.city_id || user.user_metadata?.city_id || 'rosario',
          cityName: targetCommerce?.city_name || user.user_metadata?.city_name || cityName,
          provinceId: targetCommerce?.province_id || user.user_metadata?.province_id || 'santa-fe',
          provinceName: targetCommerce?.province_name || (targetCommerce?.province_id === 'entre-rios' || user.user_metadata?.province_id === 'entre-rios' ? 'Entre Ríos' : 'Santa Fe'),
          description: targetCommerce?.description || `Comercio adherido al portal ON MÁS en ${cityName}.`,
          rating: Number(targetCommerce?.rating || 5.0),
          reviewCount: targetCommerce?.review_count || 1,
          isVerified: targetCommerce?.is_verified ?? true,
          isSubscriptionActive: Boolean(hasActiveSub),
          logoUrl: targetCommerce?.logo_url || user.user_metadata?.logo_url || '/images/city-rosario.jpg',
          coverUrl: targetCommerce?.cover_url || user.user_metadata?.cover_url || '/images/city-rosario.jpg',
          phoneWhatsApp: targetCommerce?.phone_whatsapp || user.user_metadata?.phone_whatsapp || '',
          address: targetCommerce?.address ?? '',
          email: user.email || targetCommerce?.email || '',
          isDigitalOnly: targetCommerce?.is_digital_only ?? user.user_metadata?.is_digital_only ?? false,
          website: targetCommerce?.website || '',
        };

        setCommerce(resolvedCommerce);

        // 5. Cargar métricas reales (Clicks de WhatsApp y Vistas de Perfil)
        if (targetCommerce?.id) {
          const { count: waCount } = await supabase
            .from('whatsapp_clicks')
            .select('*', { count: 'exact', head: true })
            .or(`commerce_id.eq.${targetCommerce.id},commerce_id.eq.${targetCommerce.slug}`);

          const totalWaClicks = Math.max(
            waCount || 0,
            Number(targetCommerce.whatsapp_clicks_count || 0)
          );

          setWaClicksCount(totalWaClicks);

          const totalViews = Math.max(
            Number(targetCommerce.views_count || 0),
            Number(targetCommerce.review_count || 0)
          );
          setViewsCount(totalViews);

          // Cargar productos pertenecientes al comercio
          const { data: prodsData } = await supabase
            .from('products')
            .select('*')
            .eq('commerce_id', targetCommerce.id);

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

            {/* CARTEL DE INACTIVIDAD CON ACCESO A SUSCRIPCIÓN */}
            {!isSubscriptionActive && (
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
                      Tu cuenta aún no está activa en el portal ON MÁS
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
            )}

            {/* TAB 1: DASHBOARD & KPIS */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                {/* Hero Greeting & Quick Actions */}
                <div className="bg-gradient-to-r from-[#004b87] to-[#00a859] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Panel • {isSubscriptionActive ? 'Perfil Activo' : 'Perfil Pendiente de Plan'}</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                      ¡Hola, {commerce.name}!
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-100 font-medium max-w-xl">
                      {isSubscriptionActive 
                        ? `Tu perfil comercial en ${commerce.cityName} se encuentra activo y listo para recibir consultas.`
                        : `Contratá tu plan para activar tu presencia en ${commerce.cityName}.`}
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

                {/* KPI Cards Row con métricas reales */}
                <KpiCardsRow
                  productCount={products.length}
                  whatsappClicksCount={waClicksCount}
                  profileViewsCount={viewsCount}
                />

                {/* Quick Catalog Preview */}
                <CatalogManager
                  commerce={commerce}
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
                  commerce={commerce}
                  products={products}
                  onAddProduct={handleAddProduct}
                  onDeleteProduct={handleDeleteProduct}
                />
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

            {/* TAB 4: SUBSCRIPTION */}
            {activeTab === 'subscription' && (
              <SubscriptionPlans
                commerceId={commerce.id}
                commerceName={commerce.name}
                cityName={commerce.cityName}
                phoneWhatsApp={commerce.phoneWhatsApp}
                userType={userType}
                onPlanActivated={(planName) => {
                  setCommerce({ ...commerce, isSubscriptionActive: true });
                  setIsSubscriptionActive(true);
                }}
              />
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
