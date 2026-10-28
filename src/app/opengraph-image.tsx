import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ON MÁS Portal | Directorio Comercial & Turismo del Litoral';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #00153B 0%, #002878 50%, #0047BA 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Glow decoration */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(0, 229, 232, 0.25)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(0, 229, 232, 0.4)',
            padding: '10px 24px',
            borderRadius: '9999px',
            color: '#00E5E8',
            fontSize: '22px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '24px',
          }}
        >
          Portal Regional Multisectorial
        </div>

        {/* Brand Title */}
        <div
          style={{
            fontSize: '76px',
            fontWeight: 900,
            letterSpacing: '-2px',
            textAlign: 'center',
            lineHeight: 1.1,
            marginBottom: '20px',
          }}
        >
          ON MÁS PORTAL
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#E2E8F0',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.35,
            fontWeight: 500,
            marginBottom: '32px',
          }}
        >
          Directorio Comercial, Catálogo directo a WhatsApp y Turismo de Entre Ríos y Santa Fe
        </div>

        {/* Highlights Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: '#00ADB5',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '16px',
              fontSize: '20px',
              fontWeight: 800,
            }}
          >
            ✓ Sin Comisiones
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '16px',
              fontSize: '20px',
              fontWeight: 800,
            }}
          >
            Comercios & Industrias
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '16px',
              fontSize: '20px',
              fontWeight: 800,
            }}
          >
            Pedidos por WhatsApp
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
