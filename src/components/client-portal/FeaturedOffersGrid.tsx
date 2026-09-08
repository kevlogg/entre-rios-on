'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { trackWhatsAppClick } from '@/lib/analytics/events';
import { CATEGORIES_LIST } from '@/lib/constants/categories';

interface OfferItem {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  phoneWhatsApp: string;
  categoryKey: string;
  categoryLabel: string;
  slug?: string;
}

const CLIENT_OFFERS: OfferItem[] = [
  {
    id: 'off-1',
    title: 'Zapatillas Urbanas de Cuero Litoral',
    location: 'Paraná',
    price: 59900,
    image: '/images/offer-1.jpg',
    phoneWhatsApp: '5493434229876',
    categoryKey: 'indumentaria',
    categoryLabel: 'Indumentaria',
    slug: 'zapatillas-urbanas-cuero-litoral',
  },
  {
    id: 'off-2',
    title: 'Cafetera Espresso Digital Barista 15 Bar',
    location: 'Concordia',
    price: 125000,
    image: '/images/offer-2.jpg',
    phoneWhatsApp: '5493454112233',
    categoryKey: 'tecnologia',
    categoryLabel: 'Tecnología',
    slug: 'cafetera-espresso-digital-barista',
  },
  {
    id: 'off-3',
    title: 'Juego de Comedor Nórdico Muebles Litoral',
    location: 'Gualeguaychú',
    price: 420000,
    image: '/images/offer-3.jpg',
    phoneWhatsApp: '5493446584321',
    categoryKey: 'hogar',
    categoryLabel: 'Hogar y Deco',
    slug: 'juego-comedor-nordico-madera',
  },
  {
    id: 'off-4',
    title: 'iPhone 15 128 GB Silicon Shield 5G',
    location: 'Paraná',
    price: 1250000,
    image: '/images/offer-4.jpg',
    phoneWhatsApp: '5493434229876',
    categoryKey: 'tecnologia',
    categoryLabel: 'Tecnología',
    slug: 'iphone-15-128gb-silicon-shield',
  },
  {
    id: 'off-5',
    title: 'Camioneta Ford Ranger 4x4 Doble Cabina 0km',
    location: 'Concepción del Uruguay',
    price: 34500000,
    image: '/images/offer-5.jpg',
    phoneWhatsApp: '5493442445566',
    categoryKey: 'autos',
    categoryLabel: 'Autos y Motos',
    slug: 'ford-ranger-4x4-doble-cabina',
  },
  {
    id: 'off-6',
    title: 'Compresor Industrial Trifásico 100L 3HP',
    location: 'Concordia',
    price: 890000,
    image: '/images/offer-6.jpg',
    phoneWhatsApp: '5493446584321',
    categoryKey: 'industria',
    categoryLabel: 'Industria',
    slug: 'compresor-industrial-trifasico-100l',
  },
  {
    id: 'off-7',
    title: 'Juego de Mates Cerámica Cincelada & Alpaca',
    location: 'Colón',
    price: 34500,
    image: '/images/prod-mate.jpg',
    phoneWhatsApp: '5493447451234',
    categoryKey: 'productos',
    categoryLabel: 'Productos',
    slug: 'juego-mate-ceramica-alpaca',
  },
  {
    id: 'off-8',
    title: 'Dorado a la Parrilla con Hierbas del Litoral',
    location: 'Paraná',
    price: 28000,
    image: '/images/prod-dorado.jpg',
    phoneWhatsApp: '5493434229876',
    categoryKey: 'gastronomia',
    categoryLabel: 'Gastronomía',
    slug: 'dorado-a-la-parrilla-para-dos',
  },
  {
    id: 'off-9',
    title: 'Caja Estuche Trilogía Vinos Tannat Reserva',
    location: 'Gualeguaychú',
    price: 42000,
    image: '/images/prod-vino-tannat.jpg',
    phoneWhatsApp: '5493446584321',
    categoryKey: 'gastronomia',
    categoryLabel: 'Gastronomía',
    slug: 'estuche-trilogia-tannat-reserva',
  },
  {
    id: 'off-10',
    title: 'Paseo Guiado en Lancha por las Islas del Paraná',
    location: 'Paraná',
    price: 22000,
    image: '/images/prod-lancha.jpg',
    phoneWhatsApp: '5493434229876',
    categoryKey: 'turismo',
    categoryLabel: 'Turismo',
    slug: 'paseo-guiado-lancha-islas-parana',
  },
  {
    id: 'off-11',
    title: 'Grifería Monocomando para Baño Cromo',
    location: 'Colón',
    price: 78500,
    image: '/images/prod-mate.jpg',
    phoneWhatsApp: '5493447451234',
    categoryKey: 'construccion',
    categoryLabel: 'Construcción',
    slug: 'griferia-monocomando-bano-cromo',
  },
  {
    id: 'off-12',
    title: 'Pase Día Termal & Masaje Holístico Federación',
    location: 'Federación',
    price: 18500,
    image: '/images/city-federacion.jpg',
    phoneWhatsApp: '5493454112233',
    categoryKey: 'salud',
    categoryLabel: 'Salud y Bienestar',
    slug: 'pase-dia-termal-masaje-federacion',
  },
  {
    id: 'off-13',
    title: 'Servicio de Asesoría B2B & Marketing Digital',
    location: 'Paraná',
    price: 45000,
    image: '/images/city-parana.jpg',
    phoneWhatsApp: '5493434229876',
    categoryKey: 'comercios',
    categoryLabel: 'Comercios y Servicios',
    slug: 'asesoria-b2b-marketing-digital-pymes',
  },
  {
    id: 'off-14',
    title: 'Bicicleta Eléctrica Urbana E-Bike Litoral 350W',
    location: 'Colón',
    price: 890000,
    image: '/images/prod-lancha.jpg',
    phoneWhatsApp: '5493447451234',
    categoryKey: 'mas',
    categoryLabel: 'Más categorías',
    slug: 'bicicleta-electrica-urbana-ebike-litoral',
  }
];

interface FeaturedOffersGridProps {
  selectedCategory?: string;
}

export function FeaturedOffersGrid({ selectedCategory = 'all' }: FeaturedOffersGridProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleWhatsApp = (item: OfferItem) => {
    trackWhatsAppClick(item.id, 'commerce-client', item.title, item.location);
    const cleanPhone = item.phoneWhatsApp.replace(/[^\d]/g, '');
    const msg = encodeURIComponent(`Hola, vi en el Portal Entre Ríos ON el producto "${item.title}" por ${formatPrice(item.price)} y me gustaría comprarlo.`);
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  const activeCategoryObj = CATEGORIES_LIST.find((c) => c.id === selectedCategory);

  const displayedOffers = selectedCategory === 'all'
    ? CLIENT_OFFERS
    : CLIENT_OFFERS.filter((item) => item.categoryKey === selectedCategory);

  return (
    <section id="ofertas-destacadas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <span>Catálogo u Ofertas</span>
            <span className="text-[#00a859]">
              {selectedCategory !== 'all' && activeCategoryObj ? `• ${activeCategoryObj.label}` : 'Destacadas'}
            </span>
          </h2>
          {selectedCategory !== 'all' && activeCategoryObj && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {activeCategoryObj.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {displayedOffers.length} {displayedOffers.length === 1 ? 'resultado' : 'resultados'}
          </span>
          <Link href="/comercios" className="text-xs font-bold text-[#004b87] hover:text-[#00a859] flex items-center gap-1">
            <span>Ver todo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {displayedOffers.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {displayedOffers.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-50 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-md text-slate-400 hover:text-red-500 transition-colors shadow-xs"
                    aria-label="Agregar a favoritos"
                  >
                    <Heart className={`w-4 h-4 ${favorites[item.id] ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                    {item.categoryLabel}
                  </span>
                </div>

                <div className="p-3 space-y-1">
                  <Link href={item.slug ? `/producto/${item.slug}` : '#'}>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover:text-[#00a859] transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-[11px] font-medium text-slate-400">
                    {item.location}
                  </p>
                </div>
              </div>

              <div className="p-3 pt-0 flex items-center justify-between mt-2">
                <span className="text-sm font-extrabold text-slate-900">
                  {formatPrice(item.price)}
                </span>

                <button
                  onClick={() => handleWhatsApp(item)}
                  className="bg-[#00a859] hover:bg-[#008746] text-white p-2 rounded-xl transition-all active:scale-95 shadow-xs"
                  title="Pedir por WhatsApp"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3">
          <p className="text-sm font-bold text-slate-700">
            No se encontraron ofertas activas en la categoría &ldquo;{activeCategoryObj?.label}&rdquo; por el momento.
          </p>
          <p className="text-xs text-slate-500">
            Podés consultar el directorio de comercios o ver todos los productos.
          </p>
        </div>
      )}
    </section>
  );
}

