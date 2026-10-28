import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { SubscriptionPlans } from '@/components/admin/SubscriptionPlans';
import { Sparkles, ArrowLeft, Rocket, Store, ArrowRight, HelpCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { JsonLd } from '@/components/common/JsonLd';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Planes & Precios para Comercios | ON MÁS Portal',
  description: 'Conocé los planes oficiales de suscripción para comercios y servicios en Entre Ríos y Santa Fe. Publicá tu catálogo digital sin comisiones por venta.',
  alternates: {
    canonical: 'https://onmasportal.com.ar/planes',
  },
  openGraph: {
    title: 'Planes & Precios para Comercios | ON MÁS Portal',
    description: 'Publicá tu negocio y catálogo digital en ON MÁS con ventas directas por WhatsApp sin comisiones.',
    url: 'https://onmasportal.com.ar/planes',
    siteName: 'ON MÁS Portal',
    type: 'website',
    images: [{ url: '/logo1.png', width: 1200, height: 630, alt: 'Planes ON MÁS' }],
  },
};

export default async function PlanesPublicPage() {
  let isAuthenticated = false;
  let commerceData: { id: string; name: string; cityName: string; phoneWhatsApp: string } | null = null;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isAuthenticated = !!user;

    if (user) {
      const { data: comm } = await supabase
        .from('commerces')
        .select('id, name, city_name, phone_whatsapp')
        .eq('user_id', user.id)
        .maybeSingle();

      if (comm) {
        commerceData = {
          id: comm.id,
          name: comm.name,
          cityName: comm.city_name,
          phoneWhatsApp: comm.phone_whatsapp,
        };
      } else {
        commerceData = {
          id: `comm-${user.id}`,
          name: user.user_metadata?.commerce_name || user.user_metadata?.full_name || 'Comercio Adherido',
          cityName: user.user_metadata?.city_name || 'Rosario',
          phoneWhatsApp: user.user_metadata?.phone_whatsapp || '',
        };
      }
    }
  } catch (err) {
    console.warn('Error al verificar sesión en /planes:', err);
  }

  const heroContent = (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl w-fit flex items-center gap-2 text-xs font-extrabold text-white shadow-xs">
        <Link href="/" className="hover:text-cyan-300 text-slate-100 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Inicio</span>
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-cyan-300 font-black">Planes & Precios</span>
      </div>

      {/* Hero Section */}
      <div className="rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full">
            <Rocket className="w-4 h-4 text-[#00E5E8]" />
            <span>Propuesta Comercial • Planes ON MÁS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Planes para Comercios & Servicios
          </h1>

          <p className="text-sm text-slate-100 font-medium leading-relaxed">
            Elegí la mejor alternativa para promocionar tu negocio y escalá la visibilidad de tu marca con nuestros planes Bronce, Plata y Oro.
          </p>
        </div>
      </div>
    </div>
  );

  const faqs = [
    {
      q: '¿Cómo publico mi comercio en el portal ON MÁS?',
      a: 'Podés registrar tu comercio creando una cuenta desde el botón Publicá tu Negocio o contactando a nuestro equipo por WhatsApp. Una vez verificado tu comercio, podrás elegir tu plan y cargar tu catálogo inmediatamente.',
    },
    {
      q: '¿ON MÁS cobra comisiones por las ventas que realiza mi comercio?',
      a: 'No, en ON MÁS no cobramos ninguna comisión por venta. Tus clientes te contactan y pagan directamente a través de WhatsApp o mediante tu propia cuenta de Mercado Pago vinculada.',
    },
    {
      q: '¿Qué límites de productos tienen los planes?',
      a: 'El Plan Bronce permite publicar hasta 25 productos, el Plan Plata hasta 60 productos con soporte prioritario, y el Plan Oro permite publicaciones ilimitadas con máxima exposición en el portal.',
    },
    {
      q: '¿Qué medios de pago aceptan para abonar la suscripción?',
      a: 'Aceptamos pagos online mediante suscripción automática con Mercado Pago (tarjetas de crédito, débito o dinero en cuenta) y también transferencias bancarias o pagos en efectivo.',
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <DynamicLayoutWrapper heroContent={heroContent}>
      <JsonLd data={faqJsonLd} />
      <div className="space-y-8">
        {isAuthenticated && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#0047BA] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-black text-slate-900">
                  Sesión iniciada: <span className="text-[#0047BA]">{commerceData?.name || 'Tu Negocio'}</span>
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  Para contratar o abonar tu suscripción mensual, gestioná tu plan directamente desde tu panel.
                </p>
              </div>
            </div>
            <Link
              href="/admin?tab=subscription"
              className="inline-flex items-center justify-center gap-2 bg-[#0047BA] hover:bg-[#002878] text-white text-xs font-black px-5 py-3 rounded-2xl transition-transform active:scale-95 shrink-0 shadow-md"
            >
              <span>Ir a mi Panel de Control</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300/70 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-300/70 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0047BA]" />
              <span>Planes Disponibles</span>
            </h2>
            <span className="text-xs font-bold text-slate-500">Sin comisiones por venta</span>
          </div>

          <SubscriptionPlans
            userType="comercio"
            isAuthenticated={isAuthenticated}
            commerceId={commerceData?.id}
            commerceName={commerceData?.name}
            cityName={commerceData?.cityName}
            phoneWhatsApp={commerceData?.phoneWhatsApp}
            showHistory={false}
            allowDirectPayment={false}
          />
        </div>

        {/* Sección de Preguntas Frecuentes para SEO y Conversión */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300/70 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-4">
            <HelpCircle className="w-5 h-5 text-[#0047BA]" />
            <h3 className="text-xl font-black text-slate-900">Preguntas Frecuentes sobre los Planes</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-start gap-2">
                  <span className="text-[#0047BA] font-extrabold">Q.</span>
                  <span>{item.q}</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium pl-5">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DynamicLayoutWrapper>
  );
}
