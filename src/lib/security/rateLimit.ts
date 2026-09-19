interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Limpiar periódicamente registros expirados (cada 5 minutos)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  /** Número máximo de peticiones permitidas en la ventana de tiempo */
  limit?: number;
  /** Ventana de tiempo en milisegundos (por defecto 60.000 ms = 1 minuto) */
  windowMs?: number;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; limit: number; remaining: number; resetInMs: number } {
  const limit = options.limit ?? 30; // 30 peticiones por defecto
  const windowMs = options.windowMs ?? 60 * 1000; // 1 minuto por defecto
  const now = Date.now();

  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetInMs: windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetInMs: record.resetAt - now,
    };
  }

  record.count += 1;
  rateLimitMap.set(identifier, record);

  return {
    success: true,
    limit,
    remaining: limit - record.count,
    resetInMs: record.resetAt - now,
  };
}

/** Obtiene la dirección IP del cliente a partir de los headers de NextRequest */
export function getClientIp(headers: Headers): string {
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0].trim();
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
