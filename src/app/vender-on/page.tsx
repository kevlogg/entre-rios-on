import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Building2, 
  Clock, 
  MessageCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Vender en ON+ • Sumate como Asesor Comercial y Ganá Comisiones',
  description: 'Programa oficial de promotores y vendedores independientes ON+. Ganá comisiones atractivas y recurrentes adhiriendo comercios, pymes y servicios turísticos a nuestra plataforma.',
};

const COMMISSION_TIERS = [
  {
    tier: 'Plan Bronce',
    price: '$29.000 / mes',
    badge: 'Comisión Inicial',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    commissionAlta: '$12.000',
    commissionRecurring: '10% mensual recurrente',
    description: 'Ideal para comercios de barrio, talleres, emprendedores y servicios locales que buscan presencia digital.',
    features: [
      'Alta rápida y sencilla para el comercio',
      'Catálogo de hasta 5 productos',
      'Botonera directa a WhatsApp del local',
      'Comisión acreditada de forma inmediata',
    ],
    buttonColor: 'bg-slate-900 hover:bg-slate-800 text-white',
  },
  {
    tier: 'Plan Plata',
    price: '$49.000 / mes',
    badge: 'Más Comercializado • Recomendado',
    badgeColor: 'bg-gradient-to-r from-[#00ADB5] to-[#0047BA] text-white border-transparent',
    commissionAlta: '$22.000',
    commissionRecurring: '15% mensual recurrente',
    description: 'El plan favorito de comercios consolidados, tiendas de moda, gastronomía y tecnología con amplio catálogo.',
    features: [
      'Insignia Comercio Verificado Plata',
      'Catálogo ampliado de 20 productos',
      'Posicionamiento prioritario en su ciudad',
      'Excelente relación costo/beneficio para vender',
    ],
    highlight: true,
    buttonColor: 'bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#00969d] hover:to-[#002878] text-white',
  },
  {
    tier: 'Plan Oro',
    price: '$99.000 / mes',
    badge: 'Máxima Ganancia • VIP',
    badgeColor: 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 border-transparent',
    commissionAlta: '$45.000',
    commissionRecurring: '20% mensual recurrente',
    description: 'Diseñado para empresas líderes, industrias, concesionarias y complejos turísticos que demandan máxima cobertura.',
    features: [
      'Catálogo de productos ILIMITADO',
      'Destacado TOP en portada provincial',
      'Publicidad y notas de prensa oficiales',
      'Mayor margen de ganancia por cierre',
    ],
    buttonColor: 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Postulate y recibí tu Kit Comercial',
    desc: 'Completá tu solicitud o escribinos por WhatsApp. Te enviamos folletería digital, credencial de asesor y dossier de presentación para comercios.',
  },
  {
    num: '02',
    title: 'Visitá o contactá comercios y pymes',
    desc: 'Presentá los beneficios de ON+: botón a WhatsApp sin comisiones de venta (0%), catálogo online y presencia destacada en Santa Fe y Entre Ríos.',
  },
  {
    num: '03',
    title: 'Adherí al comercio a la plataforma',
    desc: 'Guiás al cliente a elegir su plan (Bronce, Plata u Oro) y registrarse con tu código o referencia de asesor.',
  },
  {
    num: '04',
    title: 'Cobrá tus comisiones en el acto',
    desc: 'Recibí tu pago por alta confirmada directo a tu cuenta bancaria o MercadoPago, más las comisiones acumulables por renovación.',
  },
];

const BENEFITS = [
  {
    icon: DollarSign,
    title: 'Ingresos Directos y Recurrentes',
    desc: 'Cobrás una comisión fija por cada nuevo comercio adherido más un porcentaje continuo por cada mes que el cliente renueve su cuota.',
  },
  {
    icon: Clock,
    title: '100% Flexibilidad Horaria',
    desc: 'Trabajá a tu propio ritmo. Podés hacerlo como actividad principal o como ingreso extra combinándolo con tu empleo o estudio.',
  },
  {
    icon: Building2,
    title: 'Herramientas y Respaldo Oficial',
    desc: 'Te facilitamos material promocional, argumentos de venta, soporte directo con la coordinación de ON+ y panel de control.',
  },
  {
    icon: TrendingUp,
    title: 'Amplio Mercado en Expansión',
    desc: 'Miles de comercios, pymes, prestadores de turismo y profesionales de la región necesitan visibilidad sin pagar comisiones por venta.',
  },
];

export default function VenderOnPage() {
  const whatsappUrl = `https://wa.me/5493434001122?text=${encodeURIComponent('Hola equipo ON+, quiero sumarme como asesor comercial para vender la plataforma y adherir comercios a comisión. ¿Cómo comenzamos?')}`;

  const heroContent = (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="bg-white/15 backdrop-blur-md border border-white/25 px-4 py-2 rounded-2xl w-fit flex items-center gap-2 text-xs font-extrabold text-white shadow-xs">
        <Link href="/" className="hover:text-cyan-300 text-slate-100 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Inicio</span>
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-cyan-300 font-black">Vender ON+ • Asesores Comerciales</span>
      </div>

      {/* Hero Section */}
      <div className="rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#00E5E8] text-xs font-extrabold px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4 text-[#00E5E8]" />
            <span>Programa Oficial de Asesores & Embajadores Comerciales</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Ganá Comisiones Vendiendo la Plataforma ON MÁS
          </h1>

          <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
            Sumá comercios, pymes, locales y prestadores turísticos en tu ciudad. Obtené comisiones inmediatas por cada adhesión más ingresos mensuales recurrentes.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-slate-950 text-slate-950" />
              <span>Postularme por WhatsApp</span>
            </a>

            <a
              href="#comisiones"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-2xl backdrop-blur-md transition-all cursor-pointer"
            >
              <span>Ver escala de comisiones</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Highlight Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-xl">
          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 block">
            Beneficio Destacado
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white leading-none">
            Hasta 45%
            <span className="block text-xs font-extrabold text-slate-200 mt-1">de comisión por cada alta comercial</span>
          </div>
          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            Sin techo de ganancias. Cuantos más comercios sumás a la red ON+, mayor es tu ingreso fijo mensual acumulado.
          </p>
          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs font-bold text-cyan-300">
            <span>Cobros semanales</span>
            <span>•</span>
            <span>Sin costo de ingreso</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DynamicLayoutWrapper heroContent={heroContent}>
      <div className="space-y-12">
        
        {/* 1. BENEFICIOS PRINCIPALES */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] font-black text-[#0047BA] uppercase tracking-wider block">
              ¿Por qué sumarte al equipo?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Ventajas de ser Asesor Comercial ON+
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Te brindamos toda la estructura, tecnología y respaldo para que puedas salir a comercializar con total confianza.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {BENEFITS.map((b, idx) => {
              const IconComp = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0047BA] to-[#00ADB5] text-white flex items-center justify-center font-black shadow-sm">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. ESCALA DE COMISIONES TRANSPARENTES */}
        <section id="comisiones" className="space-y-6 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] font-black text-[#00ADB5] uppercase tracking-wider block">
              Ganancias Claras
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Escala Oficial de Comisiones por Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Cobrás por cada nuevo comercio adherido más un porcentaje mensual por cada cuota activa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {COMMISSION_TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 flex flex-col justify-between space-y-6 transition-all border-2 ${
                  tier.highlight
                    ? 'bg-gradient-to-b from-blue-50/90 via-white to-slate-50 border-[#00ADB5] shadow-xl relative'
                    : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00ADB5] to-[#0047BA] text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                    PLAN MÁS VENDIDO
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${tier.badgeColor}`}>
                      {tier.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{tier.price}</span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{tier.tier}</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{tier.description}</p>
                  </div>

                  {/* Bloque de Ganancia */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Tu Ganancia por Alta:</span>
                      <span className="text-3xl font-black text-emerald-700">{tier.commissionAlta}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Ingreso Recurrente:</span>
                      <span className="text-[#0047BA]">{tier.commissionRecurring}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs font-semibold text-slate-700">
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 rounded-2xl text-xs font-black text-center shadow-md transition-all active:scale-95 cursor-pointer block ${tier.buttonColor}`}
                >
                  Postularme para vender {tier.tier}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* 3. CÓMO FUNCIONA EN 4 PASOS */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] font-black text-[#0047BA] uppercase tracking-wider block">
              Proceso Simple
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              ¿Cómo funciona el programa de asesores?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Podés comenzar esta misma semana en 4 simples pasos coordinados con nuestro equipo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s, idx) => (
              <div key={idx} className="relative space-y-3">
                <div className="text-4xl font-black text-[#00ADB5]/30">
                  {s.num}
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. BANNER DE CONTACTO FINAL / LLAMADO A LA ACCIÓN */}
        <section className="bg-gradient-to-r from-[#002878] via-[#0047BA] to-[#00ADB5] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
              ¡Comenzá a generar ingresos hoy!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black">
              ¿Listo para sumarte al equipo de ventas de ON MÁS?
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              Escribinos directamente a nuestro canal comercial oficial. Te responderemos en el día con todo el material para comenzar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl transition-all active:scale-95 cursor-pointer text-center"
            >
              <MessageCircle className="w-5 h-5 fill-slate-950 text-slate-950" />
              <span>Contactar por WhatsApp</span>
            </a>

            <Link
              href="/planes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-2xl backdrop-blur-md transition-all text-center"
            >
              <span>Ver Planes Comerciales</span>
            </Link>
          </div>
        </section>

      </div>
    </DynamicLayoutWrapper>
  );
}
