'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, MessageSquare, ThumbsUp, Sparkles, Send } from 'lucide-react';
import { ProductRatingSummary, submitProductRatingAction, getProductRatingsAction } from '@/server/actions/ratings';

interface ProductRatingWidgetProps {
  productId: string;
  productTitle: string;
  initialSummary?: ProductRatingSummary;
}

export function ProductRatingWidget({ productId, productTitle, initialSummary }: ProductRatingWidgetProps) {
  const [summary, setSummary] = useState<ProductRatingSummary | null>(initialSummary || null);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [userComment, setUserComment] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [userPreviousRating, setUserPreviousRating] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Cargar calificaciones iniciales y verificar si ya calificó en este navegador
  useEffect(() => {
    if (!summary) {
      getProductRatingsAction(productId).then((res) => {
        setSummary(res);
      }).catch(() => {});
    }

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`onmas_rated_${productId}`);
        if (stored) {
          const num = parseInt(stored, 10);
          if (!isNaN(num) && num >= 1 && num <= 5) {
            setHasRated(true);
            setUserPreviousRating(num);
            setSelectedRating(num);
          }
        }
      } catch (e) {}
    }
  }, [productId, summary]);

  const handleRateSubmit = async (ratingToSubmit: number) => {
    if (ratingToSubmit < 1 || ratingToSubmit > 5 || isSubmitting) return;

    setIsSubmitting(true);
    setSelectedRating(ratingToSubmit);

    try {
      const res = await submitProductRatingAction(
        productId,
        ratingToSubmit,
        userComment.trim() || undefined,
        authorName.trim() || undefined
      );

      if (res.success && res.data) {
        setSummary(res.data);
        setHasRated(true);
        setUserPreviousRating(ratingToSubmit);
        setSuccessMessage(res.message);

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`onmas_rated_${productId}`, ratingToSubmit.toString());
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentAvg = summary?.averageRating || 5.0;
  const totalCount = summary?.totalRatings || 0;
  const distribution = summary?.distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const history = summary?.history || [];

  return (
    <div id="calificaciones" className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header del Calificador */}
      <div className="p-5 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Calificaciones y Opiniones
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Valoraciones de usuarios y compradores para {productTitle}.
          </p>
        </div>

        {/* Badge de Promedio Resumen */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-2xl self-start sm:self-auto">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="text-xl font-black text-slate-900">{currentAvg.toFixed(1)}</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <span className="text-xs font-bold text-slate-500">
            {totalCount} {totalCount === 1 ? 'opinión' : 'opiniones'}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-8 space-y-8">
        {/* Grid de Resumen: Puntaje Promedio + Distribución de Estrellas */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-100">
          {/* Columna Izquierda: Nota Grande */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-2 border-b md:border-b-0 md:border-r border-slate-200/80 pb-5 md:pb-0 md:pr-6">
            <span className="text-4xl sm:text-5xl font-black text-[#002878] tracking-tight">
              {currentAvg.toFixed(1)}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(currentAvg)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Basado en {totalCount} {totalCount === 1 ? 'calificación' : 'calificaciones acumuladas'}
            </p>
          </div>

          {/* Columna Derecha: Barras de Distribución (5 a 1 estrella) */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((level) => {
              const count = distribution[level as 1 | 2 | 3 | 4 | 5] || 0;
              const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

              return (
                <div key={level} className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <div className="w-12 flex items-center justify-end gap-1 text-slate-700 shrink-0">
                    <span>{level}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                  </div>
                  <div className="flex-1 h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-[11px] text-slate-400 shrink-0 font-medium">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zona Interactiva: Calificar este Producto (1 a 5 estrellas) */}
        <div className="bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30 p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-blue-100/80 space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00ADB5]" />
              <span>{hasRated ? 'Tu Calificación' : '¿Probaste este producto o consultaste al comercio?'}</span>
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              {hasRated
                ? `Ya calificaste este producto con ${userPreviousRating} estrellas. Podés actualizarla si lo deseás:`
                : 'Hacé clic en las estrellas para dejar tu calificación (de 1 a 5 estrellas):'}
            </p>
          </div>

          {/* Selector de Estrellas Interactivo */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 p-2 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              {[1, 2, 3, 4, 5].map((star) => {
                const isLit = (hoverRating || selectedRating) >= star;

                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRateSubmit(star)}
                    disabled={isSubmitting}
                    className="p-1 sm:p-1.5 rounded-xl hover:scale-115 transition-all cursor-pointer focus:outline-hidden disabled:opacity-60"
                    aria-label={`Calificar con ${star} estrellas`}
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        isLit
                          ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                          : 'text-slate-300 hover:text-amber-200'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-black text-[#0047BA]">
              {(hoverRating || selectedRating) > 0 ? (
                <>
                  {(hoverRating || selectedRating) === 5 && '★★★★★ Excelente'}
                  {(hoverRating || selectedRating) === 4 && '★★★★ Muy bueno'}
                  {(hoverRating || selectedRating) === 3 && '★★★ Bueno'}
                  {(hoverRating || selectedRating) === 2 && '★★ Regular'}
                  {(hoverRating || selectedRating) === 1 && '★ A mejorar'}
                </>
              ) : (
                'Tocá para calificar'
              )}
            </span>
          </div>

          {/* Formulario Opcional de Comentario */}
          {!hasRated && (
            <div className="pt-2 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Tu nombre (opcional)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0047BA]"
                />
                <input
                  type="text"
                  placeholder="Breve comentario sobre el producto (opcional)"
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-[#0047BA]"
                />
              </div>

              {selectedRating > 0 && !hasRated && (
                <button
                  type="button"
                  onClick={() => handleRateSubmit(selectedRating)}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 bg-[#0047BA] hover:bg-[#002878] text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Guardando...' : 'Confirmar Calificación'}</span>
                </button>
              )}
            </div>
          )}

          {/* Mensaje de Confirmación */}
          {successMessage && (
            <div className="flex items-center gap-2 text-xs font-black text-emerald-800 bg-emerald-100/80 border border-emerald-200/90 px-3.5 py-2 rounded-xl animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Historial de Calificaciones Recientes */}
        {history.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0047BA]" />
              <span>Historial de Calificaciones ({history.length})</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {history.slice(0, 6).map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-3.5 space-y-2 hover:border-[#00ADB5] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= entry.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {new Date(entry.createdAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 font-medium line-clamp-2">
                    &ldquo;{entry.comment || 'Calificación de producto positiva.'}&rdquo;
                  </p>

                  <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
                    <ThumbsUp className="w-2.5 h-2.5 text-emerald-600" />
                    <span>{entry.authorName || 'Comprador Verificado'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
