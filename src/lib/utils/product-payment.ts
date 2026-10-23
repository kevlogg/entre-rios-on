import { ProductPaymentConfig } from '@/types';

export const DEFAULT_PAYMENT_CONFIG: ProductPaymentConfig = {
  discountPercent: undefined,
  installments: 'none',
  acceptsCash: true,
  acceptsTransfer: true,
  acceptsVisa: true,
  acceptsMastercard: true,
  acceptsMercadoPago: true,
};

/**
 * Parsea la configuración de pagos y promociones guardada en la descripción
 * manteniendo retrocompatibilidad total con publicaciones existentes.
 */
export function parseProductPayment(
  rawDesc?: string,
  price?: number,
  originalPrice?: number
): { description: string; paymentConfig: ProductPaymentConfig } {
  let paymentConfig: ProductPaymentConfig = { ...DEFAULT_PAYMENT_CONFIG };

  // Si tiene precio original mayor que precio actual, calcular descuento automático de base
  if (price && originalPrice && originalPrice > price) {
    const autoDiscount = Math.round(((originalPrice - price) / originalPrice) * 100);
    if (autoDiscount > 0) {
      paymentConfig.discountPercent = autoDiscount;
    }
  }

  if (!rawDesc) {
    return { description: '', paymentConfig };
  }

  const match = rawDesc.match(/<!--payment_config:([\s\S]*?)-->/);
  if (match) {
    try {
      const parsed = JSON.parse(match[1]);
      if (parsed && typeof parsed === 'object') {
        paymentConfig = {
          discountPercent: typeof parsed.discountPercent === 'number' && parsed.discountPercent > 0 ? parsed.discountPercent : paymentConfig.discountPercent,
          installments: ['3', '6', '12', 'none'].includes(parsed.installments) ? parsed.installments : 'none',
          acceptsCash: parsed.acceptsCash !== undefined ? !!parsed.acceptsCash : true,
          acceptsTransfer: parsed.acceptsTransfer !== undefined ? !!parsed.acceptsTransfer : true,
          acceptsVisa: parsed.acceptsVisa !== undefined ? !!parsed.acceptsVisa : false,
          acceptsMastercard: parsed.acceptsMastercard !== undefined ? !!parsed.acceptsMastercard : false,
          acceptsMercadoPago: parsed.acceptsMercadoPago !== undefined ? !!parsed.acceptsMercadoPago : false,
        };
      }
    } catch (e) {
      console.warn('Error parseando payment_config:', e);
    }
  }

  const cleanDescription = rawDesc.replace(/<!--payment_config:[\s\S]*?-->/g, '').trim();

  return {
    description: cleanDescription,
    paymentConfig,
  };
}

/**
 * Serializa la configuración de promociones y medios de pago dentro de la descripción
 */
export function encodeProductPayment(
  description?: string,
  paymentConfig?: ProductPaymentConfig
): string {
  const clean = (description || '').replace(/<!--payment_config:[\s\S]*?-->/g, '').trim();

  if (!paymentConfig) {
    return clean;
  }

  return `${clean}\n\n<!--payment_config:${JSON.stringify(paymentConfig)}-->`;
}
