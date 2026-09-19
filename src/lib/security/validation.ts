import { z } from 'zod';

export const WhatsAppLeadSchema = z.object({
  phone: z.string().optional().default('5493447451234'),
  message: z.string().max(500, 'El mensaje es demasiado largo').optional().default('Hola, vi su oferta en el portal Entre Ríos ON y me gustaría realizar una consulta.'),
  commerceId: z.string().max(100).nullable().optional(),
  productId: z.string().max(100).nullable().optional(),
  cityId: z.string().max(100).nullable().optional(),
});

export const ViewLeadSchema = z.object({
  commerceId: z.string().min(1, 'Falta commerceId').max(100, 'Identificador demasiado largo'),
});
