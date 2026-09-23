export interface Province {
  id: string;
  name: string;
  slug: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  department: string;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
  commerceCount: number;
  provinceId?: string;
  provinceName?: string;
  bannerUrl?: string;
}

export interface Commerce {
  id: string;
  name: string;
  slug: string;
  category: string;
  cityId: string;
  cityName: string;
  provinceId?: string;
  provinceName?: string;
  description: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isSubscriptionActive: boolean;
  logoUrl: string;
  coverUrl: string;
  phoneWhatsApp: string;
  address: string;
  email?: string;
  isDigitalOnly?: boolean;
  website?: string;
  plan?: 'Bronce' | 'Plata' | 'Oro';
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
  provinceId?: string;
  provinceName?: string;
  imageUrl: string;
  category: string;
  categoryId?: string;
  isFeatured: boolean;
  description: string;
  phoneWhatsApp: string;
  whatsappMessageCustom?: string;
  commercePlan?: 'Bronce' | 'Plata' | 'Oro';
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
  provinceId?: string;
  provinceName?: string;
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

export interface JobItem {
  id: string;
  title: string;
  company: string;
  cityName: string;
  provinceId?: string;
  jobType: string;
  salary: string;
  description: string;
  phoneWhatsApp: string;
  status?: string;
  createdAt?: string;
}

export interface TourismService {
  id: string;
  name: string;
  category: string;
  cityName: string;
  provinceId?: string;
  price: string;
  planTier?: string;
  imageUrl: string;
  description?: string;
  phoneWhatsApp?: string;
  isVerified?: boolean;
  createdAt?: string;
}


export interface ClassifiedItem {
  id: string;
  title: string;
  category: string;
  provinceId?: string;
  cityName: string;
  price: string;
  imageUrl: string;
  description: string;
  phoneWhatsApp: string;
  status?: string;
  createdAt?: string;
}

export interface WebRequest {
  id: string;
  businessName: string;
  contactName: string;
  phoneWhatsApp: string;
  email?: string;
  desiredDomain?: string;
  notes?: string;
  status?: string;
  createdAt?: string;
}

export interface CashPayment {
  id: string;
  commerceName: string;
  ownerName: string;
  phoneWhatsApp: string;
  planName: string;
  amount: number;
  cityName: string;
  status?: string;
  createdAt?: string;
}

export interface Raffle {
  id: string;
  title: string;
  prize: string;
  sponsorName: string;
  imageUrl: string;
  drawDate: string;
  status: 'ACTIVE' | 'DRAWN' | 'CANCELLED';
  winnerName?: string;
  winnerPhone?: string;
  createdAt?: string;
}

export interface RaffleParticipant {
  id: string;
  raffleId: string;
  fullName: string;
  phoneWhatsApp: string;
  provinceId?: string;
  cityName: string;
  email?: string;
  createdAt?: string;
}

