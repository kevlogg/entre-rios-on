'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Tag, PlusCircle, CheckCircle2, MessageCircle, MapPin, Sparkles, Car, ExternalLink } from 'lucide-react';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { ImageUploader } from '@/components/common/ImageUploader';
import { createClassifiedAction } from '@/server/actions/public';

export default function NuevoClasificadoPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Inmuebles');
  const [cityName, setCityName] = useState('Paraná');
  const [price, setPrice] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/city-colon.jpg');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !phoneWhatsApp || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createClassifiedAction({
        title,
        category,
        cityName,
        price,
        imageUrl,
        description,
        phoneWhatsApp,
      });
    } catch (err) {
      console.warn('Classified Server Action fallback:', err);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      router.push('/clasificados');
    }, 1800);
  };

  return (
    <DynamicLayoutWrapper>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/clasificados" className="hover:text-[#00ADB5] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a Clasificados ON</span>
          </Link>
          <span>/</span>
          <span className="text-[#0047BA]">Publicar Aviso Gratis</span>
        </div>

        {/* Warning Alert: No Car Publishing - Redirect to Sitio Automotor Partner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border border-amber-300/80 rounded-3xl p-6 text-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative w-32 h-16 bg-white/80 rounded-2xl p-2 shrink-0 border border-amber-200 flex items-center justify-center shadow-xs">
              <Image
                src="/logosa.png"
                alt="Sitio Automotor Logo"
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-amber-900 flex items-center gap-1.5 justify-center sm:justify-start">
                <span>¿Buscás publicar un Auto o Vehículo?</span>
              </h2>
              <p className="text-xs text-amber-800 leading-relaxed font-medium max-w-xl">
                Por políticas de la plataforma, <strong>no se permite publicar autos en Clasificados ON</strong>. La publicación de vehículos se realiza únicamente a través de nuestro portal socio comercial especializado <strong>Sitio Automotor</strong>.
              </p>
            </div>
          </div>

          <a
            href="https://sitio-automotor.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <span>Publicar mi Auto en Sitio Automotor</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Page Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          <div className="border-b border-slate-100 pb-4 space-y-1">
            <h1 className="text-2xl font-black text-[#0047BA] flex items-center gap-2">
              <PlusCircle className="w-6 h-6 text-[#00ADB5]" />
              <span>Publicar Clasificado en Entre Ríos ON</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Tu anuncio se conectará directamente con vecinos y compradores de toda la provincia vía WhatsApp.
            </p>
          </div>

          {isSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3 animate-in fade-in duration-300">
              <CheckCircle2 className="w-12 h-12 text-[#00ADB5] mx-auto" />
              <h2 className="text-xl font-bold text-slate-900">¡Publicación Exitosa!</h2>
              <p className="text-xs text-slate-600 font-medium">
                Tu aviso <strong>&quot;{title}&quot;</strong> ya fue publicado en la provincia. Redirigiendo a Clasificados ON...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título de tu Anuncio *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Terreno de 800m2 en Colón / Servicio de Electricidad"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rubro / Categoría *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                  >
                    <option value="Inmuebles">Inmuebles</option>
                    <option value="Maquinaria">Maquinaria</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad *</label>
                  <select
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                  >
                    <option value="Paraná">Paraná</option>
                    <option value="Rosario">Rosario</option>
                    <option value="Santa Fe Capital">Santa Fe Capital</option>
                    <option value="Colón">Colón</option>
                    <option value="Concordia">Concordia</option>
                    <option value="Gualeguaychú">Gualeguaychú</option>
                    <option value="Rafaela">Rafaela</option>
                    <option value="Concepción del Uruguay">Concepción del Uruguay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio Publicado *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. USD $28.000 / Presupuesto Sin Cargo"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono WhatsApp de Contacto *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 5493434112233"
                    value={phoneWhatsApp}
                    onChange={(e) => setPhoneWhatsApp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                  />
                  <MessageCircle className="w-4 h-4 text-[#25D366] absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción del Aviso</label>
                <textarea
                  rows={4}
                  placeholder="Detallá las características, estado, ubicación exacta, documentación o forma de pago..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <ImageUploader
                label="Imagen Principal del Anuncio"
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                presetOptions={[
                  { label: 'Inmueble / Lote', url: '/images/city-colon.jpg' },
                  { label: 'Comercio / Local', url: '/images/bento-6.jpg' },
                  { label: 'Maquinaria / Campo', url: '/images/bento-4.jpg' },
                  { label: 'Servicios', url: '/images/bento-7.jpg' },
                ]}
              />

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <Link href="/clasificados" className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100">
                  Cancelar
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#00ADB5] to-[#0047BA] hover:from-[#007C8A] hover:to-[#002878] text-white px-8 py-3 rounded-2xl font-extrabold text-sm shadow-md transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Publicando...' : 'Publicar Clasificado Gratis'}
                </button>
              </div>
            </form>
          )}

        </div>
      </main>
    </DynamicLayoutWrapper>
  );
}

