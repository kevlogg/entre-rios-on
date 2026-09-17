import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { ClassifiedsInteractiveView, ClassifiedItem } from '@/components/classifieds/ClassifiedsInteractiveView';

export const revalidate = 60;

const CLASIFICADOS_MOCK: ClassifiedItem[] = [
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
          <span className="text-[#0047BA]">Clasificados ON MÁS</span>
        </div>

        {/* Vista interactiva de clasificados */}
        <ClassifiedsInteractiveView initialItems={CLASIFICADOS_MOCK} />
      </main>
    </DynamicLayoutWrapper>
  );
}


