import { Metadata } from 'next';
import React from 'react';
import { notFound } from 'next/navigation';
import { getProductBySlug, getCommerceBySlug, getFeaturedProducts } from '@/lib/dal/portal';
import { DynamicLayoutWrapper } from '@/components/layout/DynamicLayoutWrapper';
import { JsonLd } from '@/components/common/JsonLd';
import { ProductDetailView } from '@/components/product/ProductDetailView';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Producto no encontrado | ON MÁS Portal Regional' };
  }

  return {
    title: `${product.title} - ${product.commerceName} (${product.cityName}) | ON MÁS`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.imageUrl }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const commerce = await getCommerceBySlug(product.commerceId);
  const allFeatured = await getFeaturedProducts(product.cityId, product.categoryId);
  const relatedProducts = allFeatured.filter((p) => p.id !== product.id && p.slug !== product.slug);

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.imageUrl,
    offers: {
      '@type': 'Offer',
      price: product.price || 0,
      priceCurrency: product.currency || 'ARS',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: product.commerceName,
      },
    },
  };

  return (
    <DynamicLayoutWrapper>
      <JsonLd data={jsonLdData} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <ProductDetailView 
          product={product} 
          commerce={commerce} 
          relatedProducts={relatedProducts} 
        />
      </main>
    </DynamicLayoutWrapper>
  );
}
