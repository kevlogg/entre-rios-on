import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad | Entre Ríos ON MÁS',
  description: 'Política de privacidad y protección de datos personales de Entre Ríos ON MÁS.',
};

export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
      <h1 className="text-3xl font-bold mb-6 text-[#0047BA]">Política de Privacidad</h1>
      
      <p className="text-sm text-slate-500 mb-8">Última actualización: Septiembre 2026</p>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Compromiso con la Privacidad</h2>
          <p>
            Entre Ríos ON MÁS respeta la privacidad de sus usuarios y cumple con la legislación aplicable en materia de Protección de Datos Personales (Ley N° 25.326 de la República Argentina y normativas complementarias).
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Información Recopilada</h2>
          <p>
            Recopilamos información necesaria para la operación de la plataforma, que puede incluir:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Datos de perfil de comercios (nombre comercial, dirección, contacto, catálogo de productos).</li>
            <li>Datos de registro y autenticación para la gestión de cuentas.</li>
            <li>Información de uso anónima para optimizar la experiencia de navegación (cookies funcionales).</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Uso de la Información</h2>
          <p>
            La información se utiliza exclusivamente para:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Facilitar la visibilidad del catálogo de comercios y la conexión con clientes.</li>
            <li>Administrar y mejorar el funcionamiento técnico del portal.</li>
            <li>Enviar notificaciones operativas relativas al servicio.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Protección de Datos y Derechos ARCO</h2>
          <p>
            Los usuarios pueden ejercer sus derechos de acceso, rectificación, actualización y supresión de sus datos personales conforme a la normativa vigente, contactando al equipo de administración del portal.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Cookies y Tecnologías de Seguimiento</h2>
          <p>
            Utilizamos cookies únicamente con fines analíticos y para recordar preferencias de navegación. El usuario puede configurar su navegador para bloquear o deshabilitar la instalación de cookies si así lo desea.
          </p>
        </div>
      </section>

      <div className="mt-10 pt-6 border-t border-slate-200">
        <Link href="/" className="text-[#00ADB5] hover:underline text-sm font-semibold">
          &larr; Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
