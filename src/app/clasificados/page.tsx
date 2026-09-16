import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowLeft, Car, Home, Wrench, Briefcase, PlusCircle, MessageCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';

export const revalidate = 60;

const CLASIFICADOS_MOCK = [
  {
    id: 'c1',
    title: 'Local Comercial Frente a Peatonal San Martín',
    category: 'Inmuebles',
    city: 'Paraná',
    price: '$450.000 ARS / mes',
    image: '/images/bento-6.jpg',
    date: 'Hace 1 hora',
    phone: '5493434112233',
    description: 'Excelente local de 120m2 con salón comercial principal, depósito y doble persiana microperforada.',
  },
  {
    id: 'c2',
    title: 'Lote de Terreno en Barrio Cerrado Costa del Uruguay',
    category: 'Inmuebles',
    city: 'Colón',
    price: 'USD $28.000',
    image: '/images/city-colon.jpg',
    date: 'Hace 5 horas',
    phone: '5493447451234',
    description: 'Superficie de 800m2 con todos los servicios soterrados. A 200m del río Uruguay.',
  },
  {
    id: 'c3',
    title: 'Tractor Agrícola John Deere 5075E con Pala Frontal',
    category: 'Maquinaria',
    city: 'Concordia',
    price: '$42.000.000 ARS',
    image: '/images/bento-4.jpg',
    date: 'Ayer',
    phone: '5493454112233',
    description: 'Año 2020, 1.800 horas de uso. Ideal para quintas de citrus y galpones de empaque.',
  },
  {
    id: 'c4',
    title: 'Servicio de Construcción Seca Durlock & Pintura Texturada',
    category: 'Servicios',
    city: 'Gualeguaychú',
    price: 'Presupuesto Sin Cargo',
    image: '/images/bento-7.jpg',
    date: 'Ayer',
    phone: '5493446584321',
    description: 'Empresa familiar con más de 15 años de trayectoria en el sur entrerriano.',
  },
];

export default function ClasificadosPage() {
  return (
    <DynamicLayoutWrapper>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-[#00ADB5] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <span className="text-[#0047BA]">Clasificados ON</span>
        </div>

        {/* Notice Banner: No Car Publishing - Redirect to Sitio Automotor Partner */}
        <div className="bg-gradient-to-r from-slate-900 via-[#002878] to-[#0047BA] rounded-3xl p-6 sm:p-8 text-white border border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Logo Sitio Automotor centrado verticalmente en la card */}
            <div className="relative w-36 h-20 sm:w-44 sm:h-24 bg-white/10 backdrop-blur-xs rounded-2xl p-2 shrink-0 border border-white/20 flex items-center justify-center shadow-md">
              <Image
                src="/logosa.png"
                alt="Sitio Automotor Logo"
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 text-amber-300 text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                <ExternalLink className="w-3 h-3" />
                Socio Comercial Automotor Oficial
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                ¿Querés comprar o vender un Auto / Vehículo?
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl font-medium">
                En esta sección de Clasificados ON <strong>no se permite la publicación de autos o vehículos particulares</strong>. La compra y venta de autos usados y 0km se realiza exclusivamente a través de nuestro portal especializado socio <strong>Sitio Automotor</strong>.
              </p>
            </div>
          </div>

          <a
            href="https://sitio-automotor.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#00E5E8] to-[#00ADB5] hover:from-[#00ADB5] hover:to-[#007C8A] text-slate-950 px-6 py-3.5 rounded-2xl font-extrabold text-xs shadow-xl shrink-0 transition-transform active:scale-95 text-center flex items-center gap-2 cursor-pointer"
          >
            <span>Ir a Sitio Automotor</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Page Header */}
        <div className="bg-gradient-to-r from-[#0047BA] to-[#00ADB5] rounded-3xl p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 max-w-2xl">
            <span className="bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              Compra y Venta Directa Regional
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">Clasificados ON</h1>
            <p className="text-sm text-slate-100 font-medium">
              Encontrá inmuebles, maquinaria de trabajo, herramientas y servicios en toda la provincia.
            </p>
          </div>

          <Link
            href="/clasificados/nuevo"
            className="bg-white hover:bg-slate-100 text-[#0047BA] px-6 py-3.5 rounded-2xl font-extrabold text-sm flex items-center gap-2 shadow-lg shrink-0 transition-transform active:scale-95"
          >
            <PlusCircle className="w-5 h-5 text-[#00ADB5]" />
            <span>Publicar un Clasificado</span>
          </Link>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
          <button className="bg-[#0047BA] text-white px-4 py-2 rounded-xl shrink-0">Todos</button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0 flex items-center gap-1.5">
            <Home className="w-4 h-4 text-[#00ADB5]" />
            <span>Inmuebles</span>
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0 flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-[#00ADB5]" />
            <span>Maquinaria</span>
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl shrink-0 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#00ADB5]" />
            <span>Servicios & Empleos</span>
          </button>

          {/* Partner Site Direct Pill for Autos */}
          <a
            href="https://sitio-automotor.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 px-4 py-2 rounded-xl shrink-0 flex items-center gap-1.5 transition-colors"
          >
            <Car className="w-4 h-4 text-amber-600" />
            <span>Autos & Vehículos (Sitio Automotor ↗)</span>
          </a>
        </div>

        {/* Clasificados Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CLASIFICADOS_MOCK.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs flex flex-col sm:flex-row hover:shadow-md transition-shadow">
              <div className="relative h-48 sm:h-auto sm:w-48 bg-slate-100 shrink-0">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
                <span className="absolute top-3 left-3 bg-[#0047BA] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                  {item.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span className="flex items-center gap-1 text-[#00ADB5]">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.city}
                    </span>
                    <span>{item.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-black text-[#0047BA]">{item.price}</span>
                  <a
                    href={`https://wa.me/${item.phone}?text=${encodeURIComponent(`Hola, vi en Clasificados ON tu anuncio "${item.title}" y me interesa consultar.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </DynamicLayoutWrapper>
  );
}

