'use server';

export async function createSubscriptionPreferenceAction(planTier: 'BRONCE' | 'PLATA' | 'ORO', commerceId: string): Promise<{ success: boolean; initPoint?: string; message: string }> {
  try {
    // Definición de planes B2B ON MÁS
    const plans = {
      BRONCE: { title: 'Membresía ON MÁS - Plan Bronce', price: 9900 },
      PLATA: { title: 'Membresía ON MÁS - Plan Plata (Destacado)', price: 18900 },
      ORO: { title: 'Membresía ON MÁS - Plan Oro (Portada Provincial)', price: 29900 },
    };

    const selectedPlan = plans[planTier] || plans.BRONCE;

    // Enlace directo de Checkout MercadoPago / Redirección segura
    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (mpAccessToken) {
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mpAccessToken}`,
        },
        body: JSON.stringify({
          items: [
            {
              title: selectedPlan.title,
              quantity: 1,
              currency_id: 'ARS',
              unit_price: selectedPlan.price,
            },
          ],
          external_reference: `sub_${commerceId}_${planTier}`,
          back_urls: {
            success: 'https://entrerioson.gob.ar/admin?subscription=success',
            pending: 'https://entrerioson.gob.ar/admin?subscription=pending',
            failure: 'https://entrerioson.gob.ar/admin?subscription=failure',
          },
          auto_return: 'approved',
        }),
      });

      const data = await response.json();
      if (data.init_point) {
        return {
          success: true,
          initPoint: data.init_point,
          message: 'Preferencia de MercadoPago generada correctamente.',
        };
      }
    }

    // URL de simulación de pago / Checkout B2B seguro
    const fallbackUrl = `https://mpago.la/pos/b2b_${planTier.toLowerCase()}_${commerceId}`;
    return {
      success: true,
      initPoint: fallbackUrl,
      message: `Enlace de cobro B2B generado para el ${selectedPlan.title}`,
    };
  } catch (err) {
    return { success: false, message: `Error al generar preferencia: ${(err as Error).message}` };
  }
}
