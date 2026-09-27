import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const defaultPayments = [
    {
      id: 'PAY-001',
      period: 'Mes 1 - Lanzamiento',
      concept: 'Setup Inicial Bonificado & Abono Mes 1 (Tramo 1: Semilla)',
      amount: '$49.000 ARS',
      dueDate: '01/09/2026',
      paidDate: '01/09/2026',
      status: 'waived',
      invoiceRef: 'SETUP-BONIF-01'
    },
    {
      id: 'PAY-002',
      period: 'Mes 2 - Septiembre 2026',
      concept: 'Abono Mensual Tramo 1 (Hasta 15 comercios)',
      amount: '$49.000 ARS',
      dueDate: '10/09/2026',
      paidDate: '05/09/2026',
      status: 'paid',
      invoiceRef: 'INV-2026-009'
    },
    {
      id: 'PAY-003',
      period: 'Mes 3 - Octubre 2026',
      concept: 'Abono Mensual Tramo 1 (Hasta 15 comercios)',
      amount: '$49.000 ARS',
      dueDate: '10/10/2026',
      status: 'pending',
      invoiceRef: 'INV-2026-010'
    }
  ];

  try {
    const kevdevUrl = process.env.KEVDEV_API_URL || 'https://www.kevdev.net.ar';
    const clienteId = process.env.KEVDEV_CLIENT_ID || 'onmas';
    const secret = process.env.KEVDEV_PAYMENTS_SECRET || 'kevdev_payments_sec_2026_key';

    const res = await fetch(`${kevdevUrl.replace(/\/$/, '')}/api/payments/client-history?clienteId=${clienteId}&t=${Date.now()}`, {
      headers: { 
        'x-kevdev-secret': secret,
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store',
    });

    if (res.ok) {
      const remoteData = await res.json();
      if (remoteData.payments && Array.isArray(remoteData.payments) && remoteData.payments.length > 0) {
        const mappedPayments = remoteData.payments.map((p: any) => ({
          id: p.id || `PAY-${p.date || Date.now()}`,
          period: p.period || p.date || 'Periodo General',
          concept: p.concept || p.concepto || 'Abono Mensual KevDev',
          amount: typeof p.amount === 'number' ? `$${p.amount.toLocaleString('es-AR')} ARS` : (p.amount || '$49.000 ARS'),
          dueDate: p.dueDate || p.date || 'N/A',
          paidDate: p.paidDate || p.date,
          status: p.confirmed === false ? 'pending' : (p.status || 'paid'),
          invoiceRef: p.referencia || p.id || 'KEVDEV-SYNC'
        }));

        return NextResponse.json({
          success: true,
          synced: true,
          estadoPago: remoteData.estadoPago || 'AL_DIA',
          payments: mappedPayments,
        }, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
      }
    }
  } catch (err: any) {
    console.warn('[OnMas] Warning sincronizando pagos desde KevDev API:', err?.message || err);
  }

  return NextResponse.json({
    success: true,
    synced: false,
    estadoPago: 'AL_DIA',
    payments: defaultPayments
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache'
    }
  });
}
