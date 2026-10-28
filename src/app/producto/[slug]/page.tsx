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
    return { title: 'Producto no encontrado | ON MÁS' };
  }

  const title = `${product.title} - ${product.commerceName} (${product.cityName}) | ON MÁS`;
  const description = product.description || `Comprá ${product.title} en ${product.commerceName} (${product.cityName}). Catálogo directo con pedidos a WhatsApp en ON MÁS.`;
  const canonicalUrl = `https://onmasportal.com.ar/producto/${product.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'ON MÁS Portal',
      type: 'website',
      images: product.imageUrl ? [{ url: product.imageUrl, alt: product.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [commerce, allFeatured] = await Promise.all([
    getCommerceBySlug(product.commerceId),
    getFeaturedProducts(product.cityId, product.categoryId),
  ]);
  const relatedProducts = allFeatured.filter((p) => p.id !== product.id && p.slug !== product.slug);

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.imageUrl,
    url: `https://onmasportal.com.ar/producto/${product.slug}`,
    offers: {
      '@type': 'Offer',
      price: product.price || 0,
      priceCurrency: product.currency || 'ARS',
      availability: 'https://schema.org/InStock',
      url: `https://onmasportal.com.ar/producto/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: product.commerceName,
      },
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: 'https://onmasportal.com.ar',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Catálogo',
        item: 'https://onmasportal.com.ar/catalogo',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.commerceName,
        item: `https://onmasportal.com.ar/comercio/${commerce?.slug || product.commerceId}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.title,
        item: `https://onmasportal.com.ar/producto/${product.slug}`,
      },
    ],
  };

  return (
    <DynamicLayoutWrapper>
      <JsonLd data={jsonLdData} />
      <JsonLd data={breadcrumbJsonLd} />
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
