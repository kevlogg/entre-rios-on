'use client';

/**
 * PageBackground — Fondo animado de identidad de marca ON MÁS
 * Patrón: Cian ("ON") | Azul Eléctrico ("MÁS") | Violeta (extensión)
 * Renderizado como position:fixed z-index:-1, invisible para el árbol de componentes.
 */
export function PageBackground() {
  return (
    <div className="page-bg-canvas" aria-hidden="true">
      <div className="glow-layer glow-cyan" />
      <div className="glow-layer glow-blue" />
      <div className="glow-layer glow-purple" />
    </div>
  );
}
