export interface SubscriptionLifecycle {
  isActive: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysRemaining: number;
  startDate: string | null;
  expiresAt: string | null;
  tier: 'Bronce' | 'Plata' | 'Oro';
  lastPaymentAmount?: number;
}

/**
 * Calcula el ciclo de 30 días de la suscripción de un comercio
 * basándose en su último pago aprobado o fecha de activación.
 */
export function calculateSubscriptionLifecycle(
  commerce: {
    id?: string;
    name?: string;
    is_subscription_active?: boolean | null;
    subscription_tier?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
  },
  latestApprovedPayment?: {
    created_at: string;
    amount?: number;
    plan_name?: string;
  } | null
): SubscriptionLifecycle {
  const rawTier = (commerce.subscription_tier || latestApprovedPayment?.plan_name || 'BRONCE').toUpperCase();
  const tier: 'Bronce' | 'Plata' | 'Oro' = rawTier.includes('ORO')
    ? 'Oro'
    : rawTier.includes('PLATA')
    ? 'Plata'
    : 'Bronce';

  // Si no tiene pago registrado y está explícitamente inactivo
  if (!latestApprovedPayment && commerce.is_subscription_active === false) {
    return {
      isActive: false,
      isExpired: true,
      isExpiringSoon: false,
      daysRemaining: 0,
      startDate: null,
      expiresAt: null,
      tier,
    };
  }

  // Determinar la fecha base del ciclo de 30 días
  let startTimestamp: number;
  if (latestApprovedPayment?.created_at) {
    startTimestamp = new Date(latestApprovedPayment.created_at).getTime();
  } else if (commerce.updated_at || commerce.created_at) {
    startTimestamp = new Date(commerce.updated_at || commerce.created_at!).getTime();
  } else {
    startTimestamp = Date.now();
  }

  const durationMs = 30 * 24 * 60 * 60 * 1000; // 30 días en milisegundos
  const expiryTimestamp = startTimestamp + durationMs;
  const now = Date.now();
  const diffMs = expiryTimestamp - now;

  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const isExpired = diffMs <= 0 || commerce.is_subscription_active === false;
  const isActive = !isExpired && commerce.is_subscription_active !== false;
  const isExpiringSoon = isActive && daysRemaining <= 5;

  return {
    isActive,
    isExpired,
    isExpiringSoon,
    daysRemaining,
    startDate: new Date(startTimestamp).toISOString(),
    expiresAt: new Date(expiryTimestamp).toISOString(),
    tier,
    lastPaymentAmount: latestApprovedPayment?.amount,
  };
}
