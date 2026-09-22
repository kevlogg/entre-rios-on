'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingBag, Store, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/home/ProductCard';
import { CATEGORIES_LIST } from '@/lib/constants/categories';

interface FeaturedOffersGridProps {
  selectedCategory?: string;
  products?: Product[];
}

export function FeaturedOffersGrid({
  selectedCategory = 'all',
  products: initialProducts = [],
}: FeaturedOffersGridProps) {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);

  // If initialProducts is empty, fetch real products from portal DAL on mount
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProductsList(initialProducts);
    } else {
      import('@/lib/dal/portal').then((dal) => {
        dal.getFeaturedProducts().then((res) => {
          if (res && res.length > 0) {
            setProductsList(res);
          }
        });
      });
    }
  }, [initialProducts]);

  const activeCategoryObj = useMemo(() => {
    return CATEGORIES_LIST.find((c) => c.id === selectedCategory);
  }, [selectedCategory]);

  const displayedProducts = useMemo(() => {
    if (!productsList || productsList.length === 0) return [];
    if (selectedCategory === 'all') return productsList;

    const target = selectedCategory.toLowerCase().trim();
    return productsList.filter((p) => {
      const prodCatId = (p.categoryId || '').toLowerCase();
      const prodCatName = (p.category || '').toLowerCase();
      return (
        prodCatId === target ||
        prodCatId.includes(target) ||
        prodCatName.includes(target) ||
        target.includes(prodCatId)
      );
    });
  }, [productsList, selectedCategory]);

  return (
    <section id="ofertas-destacadas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#00ADB5]" />
            <span>Catálogo u Ofertas Destacadas</span>
            <span className="text-[#0047BA]">
              {selectedCategory !== 'all' && activeCategoryObj ? `• ${activeCategoryObj.label}` : ''}
            </span>
          </h2>
          {selectedCategory !== 'all' && activeCategoryObj && (
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {activeCategoryObj.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold text-[#0047BA] bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {displayedProducts.length} {displayedProducts.length === 1 ? 'producto real' : 'productos reales'}
          </span>
          <Link href="/catalogo" className="text-xs font-bold text-[#0047BA] hover:text-[#00ADB5] flex items-center gap-1 transition-colors">
            <span>Ver todo el catálogo</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#00ADB5]" />
          </Link>
        </div>
      </div>

      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3 shadow-2xs">
          <Store className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            No hay productos registrados en la base de datos para &ldquo;{activeCategoryObj?.label || selectedCategory}&rdquo;
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Podés publicar nuevos productos desde el panel de administración o explorar todo el catálogo regional.
          </p>
          <Link
            href="/catalogo"
            className="inline-block bg-[#0047BA] text-white px-4 py-2 rounded-xl text-xs font-extrabold hover:bg-[#002878] transition-colors"
          >
            Ver Todo el Catálogo
          </Link>
        </div>
      )}
    </section>
  );
}


