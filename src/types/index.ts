export interface City {
  id: string;
  name: string;
  slug: string;
  department: string;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
  commerceCount: number;
}

export interface Commerce {
  id: string;
  name: string;
  slug: string;
  category: string;
  cityId: string;
  cityName: string;
  description: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isSubscriptionActive: boolean;
  logoUrl: string;
  coverUrl: string;
  phoneWhatsApp: string;
  address: string;
  instagram?: string;
  website?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  price?: number;
  currency: string;
  commerceId: string;
  commerceName: string;
  cityId: string;
  cityName: string;
  imageUrl: string;
  category: string;
  isFeatured: boolean;
  description: string;
  phoneWhatsApp: string;
  whatsappMessageCustom?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  category: 'Festival' | 'Gastronomía' | 'Cultura' | 'Deportes' | 'Turismo' | 'Emprendedores';
  date: string;
  formattedDate: string;
  location: string;
  cityId: string;
  cityName: string;
  imageUrl: string;
  readTimeMinutes: number;
  excerpt: string;
  fullStory?: string;
  isFeatured: boolean;
  author: {
    name: string;
    avatarUrl: string;
  };
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeType: 'event' | 'commerce' | 'news' | 'tourism';
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  cityTag: string;
  publishedAt: string;
}
