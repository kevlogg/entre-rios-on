import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCityBySlug, getFeaturedProducts, getUpcomingEvents, getAllCommerces } from '@/lib/dal/portal';
import { MapPin, Store, Calendar, ArrowLeft, Tag } from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const city = await getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const [products, events, commerces] = await Promise.all([
    getFeaturedProducts(city.id),
    getUpcomingEvents(city.id),
    getAllCommerces(),
  ]);

  const cityCommerces = commerces.filter((c) => c.cityId.toLowerCase() === city.id.toLowerCase());

  return (
    <DynamicLayoutWrapper selectedCityId={city.id}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/" className="hover:text-[#00a859] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </Link>
          <span>/</span>
          <span className="text-slate-400">Ciudades de Entre Ríos</span>
          <span>/</span>
          <span className="text-[#004b87]">{city.name}</span>
        </div>

        {/* City Hero Banner Card */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white min-h-[280px] sm:min-h-[340px] flex items-end p-6 sm:p-10 shadow-lg border border-slate-200">
          <Image
            src={city.imageUrl}
            alt={city.name}
            fill
            priority
            className="object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />

          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 bg-[#00a859] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Departamento {city.department}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-md">
              {city.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed drop-shadow-xs">
              {city.description}
            </p>
            <div className="flex items-center gap-4 text-xs font-bold text-amber-300 pt-1">
              <span>{city.commerceCount} Comercios & Servicios Registrados</span>
            </div>
          </div>
        </div>

        {/* Section 1: Local Commerces */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#004b87] flex items-center gap-2">
              <Store className="w-5 h-5 text-[#00a859]" />
              <span>Comercios & Emprendimientos en {city.name}</span>
            </h2>
            <span className="text-xs font-bold text-slate-500">
              {cityCommerces.length} verificados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityCommerces.length > 0 ? (
              cityCommerces.map((comm) => (
                <div key={comm.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <Image src={comm.logoUrl} alt={comm.name} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                        {comm.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base line-clamp-1">{comm.name}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{comm.description}</p>
                  <Link
                    href={`/comercio/${comm.slug}`}
                    className="bg-[#004b87] hover:bg-[#003663] text-white py-2 px-4 rounded-xl text-xs font-bold text-center block"
                  >
                    Ver Perfil Completo
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs font-bold text-slate-500">
                Mostrando todos los comercios del departamento de {city.name}.
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Local Products */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#004b87] flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#00a859]" />
              <span>Ofertas y Catálogo en {city.name}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div key={prod.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-100">
                  <Image src={prod.imageUrl} alt={prod.title} fill className="object-cover" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm line-clamp-2">{prod.title}</h3>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm font-extrabold text-[#004b87]">
                    ${prod.price ? prod.price.toLocaleString('es-AR') : 'Consultar'} ARS
                  </span>
                  <Link href={`/producto/${prod.slug}`} className="text-xs font-extrabold text-[#00a859] hover:underline">
                    Ver Oferta
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Events & Agenda */}
        {events.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#004b87] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#00a859]" />
                <span>Noticias & Agenda Cultural en {city.name}</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((evt) => (
                <div key={evt.id} className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
                  <span className="text-xs font-bold text-[#00a859]">{evt.formattedDate}</span>
                  <h3 className="font-bold text-slate-900 text-lg">{evt.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{evt.excerpt}</p>
                  <Link href={`/comunidad/${evt.id}`} className="inline-block text-xs font-extrabold text-[#004b87] hover:underline pt-1">
                    Leer nota completa →
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </DynamicLayoutWrapper>
  );
}
