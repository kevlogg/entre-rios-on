/**
 * DataLayer & Analytics Tracking Layer for Entre Ríos ON
 * Strictly decoupled with snake_case parameter naming.
 */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export interface WhatsAppClickPayload {
  [key: string]: unknown;
  event: 'whatsapp_click';
  product_id: string;
  commerce_id: string;
  product_name: string;
  commerce_name?: string;
  timestamp: string;
}

export interface CitySelectPayload {
  [key: string]: unknown;
  event: 'select_city_filter';
  city_id: string;
  city_name: string;
  timestamp: string;
}

export interface SearchQueryPayload {
  [key: string]: unknown;
  event: 'global_search_query';
  search_term: string;
  timestamp: string;
}

/**
 * Tracks WhatsApp click event when a user clicks on "Pedir por WhatsApp"
 */
export function trackWhatsAppClick(
  productId: string,
  commerceId: string,
  productName: string,
  commerceName?: string
): void {
  const payload: WhatsAppClickPayload = {
    event: 'whatsapp_click',
    product_id: productId,
    commerce_id: commerceId,
    product_name: productName,
    commerce_name: commerceName || 'Desconocido',
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    
    // Log in development for analytical tracing
    console.log('[Analytics Event - snake_case]', payload);
  }
}

/**
 * Tracks when a user selects a city from persistent header or quick filter bar
 */
export function trackCitySelect(cityId: string, cityName: string): void {
  const payload: CitySelectPayload = {
    event: 'select_city_filter',
    city_id: cityId,
    city_name: cityName,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    console.log('[Analytics Event - snake_case]', payload);
  }
}

/**
 * Tracks global search queries submitted by users
 */
export function trackSearchQuery(query: string): void {
  if (!query.trim()) return;
  const payload: SearchQueryPayload = {
    event: 'global_search_query',
    search_term: query.trim(),
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    console.log('[Analytics Event - snake_case]', payload);
  }
}
