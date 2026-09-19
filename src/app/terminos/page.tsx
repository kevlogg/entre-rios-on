import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Términos y Condiciones | Entre Ríos ON MÁS',
  description: 'Términos y condiciones de uso de la plataforma Entre Ríos ON MÁS.',
};

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
      <h1 className="text-3xl font-bold mb-6 text-[#0047BA]">Términos y Condiciones de Uso</h1>
      
      <p className="text-sm text-slate-500 mb-8">Última actualización: Septiembre 2026</p>

      <section className="space-y-6 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar el portal Entre Ríos ON MÁS, el usuario acepta de manera plena e incondicional los presentes Términos y Condiciones de Uso. Si no está de acuerdo con alguno de los términos, deberá abstenerse de utilizar el servicio.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">2. Descripción del Servicio</h2>
          <p>
            Entre Ríos ON MÁS es una plataforma digital regional orientada a conectar comercios, emprendedores, productores y ciudadanos de la provincia de Entre Ríos y la región. Permite la visualización de catálogos de productos, contacto directo mediante WhatsApp y difusión de actividades turísticas y comerciales.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Registro y Cuentas de Comercios</h2>
          <p>
            Los comercios y usuarios registrados son responsables de mantener la confidencialidad de sus credenciales de acceso y de la veracidad y exactitud de la información publicada sobre sus establecimientos, productos y servicios.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Propiedad Intelectual</h2>
          <p>
            Todos los contenidos de la plataforma (diseños, marcas, logos, textos e imágenes de la interfaz) pertenecen a Entre Ríos ON MÁS o a sus respectivos titulares autorizados. Queda prohibida su reproducción sin autorización previa.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Limitación de Responsabilidad</h2>
          <p>
            Entre Ríos ON MÁS actúa como un canal de contacto y catálogo informativo. Las transacciones comerciales acordadas a través de canales externos (como WhatsApp) se realizan de forma exclusiva entre el comprador y el vendedor, no siendo el portal responsable por disputas comerciales, envíos o cobros.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">6. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigencia desde su publicación en esta sección.
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
