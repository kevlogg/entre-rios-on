'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { Plus, Edit2, Trash2, Power, CheckCircle, Tag, ShoppingBag, X, Sparkles, MessageCircle } from 'lucide-react';
import { CATEGORIES_LIST } from '@/lib/constants/categories';
import { ALL_CITIES } from '@/lib/constants/locations';
import { createProductAction, deleteProductAction } from '@/server/actions/catalog';
import { ImageUploader } from '@/components/common/ImageUploader';

interface CatalogManagerProps {
  products: Product[];
  onAddProduct: (newProd: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export function CatalogManager({ products, onAddProduct, onDeleteProduct }: CatalogManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pausedMap, setPausedMap] = useState<Record<string, boolean>>({});

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('gastronomia');
  const [cityId, setCityId] = useState('rosario');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/prod-mate.jpg');

  const togglePause = (id: string) => {
    setPausedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || isSubmitting) return;

    setIsSubmitting(true);
    const selectedCatObj = CATEGORIES_LIST.find((c) => c.id === category);
    const selectedCity = ALL_CITIES.find((c) => c.id === cityId) || ALL_CITIES[0];

    const newProd: Product = {
      id: `p-new-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      price: parseFloat(price) || 0,
      currency: 'ARS',
      commerceId: 'c1',
      commerceName: 'Comercio ON MÁS',
      cityId: selectedCity.id,
      cityName: selectedCity.name,
      provinceId: selectedCity.provinceId,
      imageUrl: imageUrl || '/images/prod-mate.jpg',
      category: selectedCatObj ? selectedCatObj.label : 'Productos',
      categoryId: category,
      isFeatured: true,
      description: description || 'Producto destacado publicado por el comercio socio.',
      phoneWhatsApp: '5493415550199',
      whatsappMessageCustom: `Hola, vi en el portal ON MÁS el producto "${title}" y quisiera consultar disponibilidad.`,
    };

    try {
      await createProductAction(newProd);
    } catch (err) {
      console.warn('Server Action response fallback:', err);
    }

    onAddProduct(newProd);
    setIsModalOpen(false);
    setIsSubmitting(false);

    // Reset Form
    setTitle('');
    setPrice('');
    setDescription('');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProductAction(id);
    } catch (err) {
      console.warn('Server Action delete fallback:', err);
    }
    onDeleteProduct(id);
  };

  const formatPrice = (val?: number) => {
    if (!val) return 'Consultar';
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#0047BA] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#00ADB5]" />
            <span>Gestión del Catálogo de Productos</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Administrá tus publicaciones en tiempo real. Los cambios se reflejan inmediatamente en el portal.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-[#00ADB5] to-[#007C8A] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Nuevo Producto</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((prod) => {
          const isPaused = pausedMap[prod.id];
          return (
            <div
              key={prod.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between p-4 space-y-4 min-h-[340px] h-full ${
                isPaused
                  ? 'bg-slate-50 border-slate-300 opacity-60'
                  : 'bg-white border-slate-200 shadow-2xs hover:shadow-md'
              }`}
            >
              <div className="space-y-3 flex-1 flex flex-col">
                <div className="relative h-44 w-full bg-slate-100 rounded-xl overflow-hidden shrink-0">
                  <Image src={prod.imageUrl} alt={prod.title} fill className="object-cover" />
                  <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                    {prod.category}
                  </span>
                  {isPaused && (
                    <span className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold uppercase">
                      Pausado
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 flex-1 flex flex-col justify-start">
                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">{prod.title}</h4>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{prod.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Precio</span>
                  <span className="text-sm font-black text-[#0047BA]">
                    {formatPrice(prod.price)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => togglePause(prod.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isPaused ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title={isPaused ? 'Activar Publicación' : 'Pausar Publicación'}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                    title="Eliminar del Catálogo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Publicar Nuevo Producto */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-auto max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky -top-6 -mt-6 bg-white z-20 pt-6 pb-3 flex items-center justify-between border-b border-slate-100">
              <h3 className="text-base sm:text-lg font-extrabold text-[#0047BA] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00ADB5] shrink-0" />
                <span>Publicar Nuevo Producto</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título de la Oferta / Producto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juego de Mates de Cerámica y Alpaca"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio ($ ARS) *</label>
                  <input
                    type="number"
                    required
                    placeholder="34500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rubro / Categoría *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                  >
                    {CATEGORIES_LIST.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción del Producto</label>
                <textarea
                  rows={3}
                  placeholder="Describí las características, materiales, dimensiones o modalidad del servicio..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00ADB5]"
                />
              </div>

              <ImageUploader
                label="Imagen del Producto / Oferta"
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                presetOptions={[
                  { label: 'Mates & Cerámica', url: '/images/prod-mate.jpg' },
                  { label: 'Gastronomía Fluvial', url: '/images/prod-dorado.jpg' },
                  { label: 'Vinos & Bodega', url: '/images/prod-vino-tannat.jpg' },
                  { label: 'Citrus & Dulces', url: '/images/prod-dulces.jpg' },
                  { label: 'Indumentaria', url: '/images/offer-1.jpg' },
                  { label: 'Electro / Tecno', url: '/images/offer-2.jpg' },
                ]}
              />

              <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-3 text-xs text-[#007C8A] font-semibold flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#00ADB5] shrink-0" />
                <span>Los compradores podrán solicitar este producto directamente por WhatsApp sin comisión.</span>
              </div>

              <div className="sticky -bottom-6 -mb-6 bg-white z-20 pt-3 pb-6 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#00ADB5] to-[#007C8A] hover:from-[#00E5E8] hover:to-[#00ADB5] text-white px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Guardando...' : 'Publicar Producto Ahora'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
