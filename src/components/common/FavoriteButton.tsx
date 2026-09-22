'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Lock, ArrowRight, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface FavoriteButtonProps {
  itemId: string;
  itemType?: 'auto' | 'agencia' | 'producto' | 'comercio';
  itemTitle?: string;
  className?: string;
}

export function FavoriteButton({
  itemId,
  itemType = 'auto',
  itemTitle = 'este ítem',
  className = '',
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);

        if (data.user) {
          const storedFavs = localStorage.getItem(`onmas_favs_${data.user.id}`);
          if (storedFavs) {
            const parsed = JSON.parse(storedFavs);
            setIsFavorite(Boolean(parsed[itemId]));
          }
        }
      } catch (err) {
        console.warn('Favorite check note:', err);
      }
    }

    checkAuth();
  }, [itemId]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Re-verificar si el usuario está autenticado
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setShowAuthModal(true);
      return;
    }

    const nextState = !isFavorite;
    setIsFavorite(nextState);

    try {
      const storedFavs = localStorage.getItem(`onmas_favs_${data.user.id}`) || '{}';
      const parsed = JSON.parse(storedFavs);
      if (nextState) {
        parsed[itemId] = { id: itemId, type: itemType, title: itemTitle, addedAt: new Date().toISOString() };
      } else {
        delete parsed[itemId];
      }
      localStorage.setItem(`onmas_favs_${data.user.id}`, JSON.stringify(parsed));
    } catch (err) {
      console.warn('Error saving favorite:', err);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggleFavorite}
        aria-label="Guardar en favoritos"
        className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
          isFavorite
            ? 'bg-rose-500 text-white shadow-md scale-105'
            : 'bg-white/90 hover:bg-white text-slate-600 hover:text-rose-500 shadow-sm border border-slate-200'
        } ${className}`}
      >
        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      {/* Auth Modal required for favorites */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-snug">
                Registro Requerido
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Para guardar <strong>{itemTitle}</strong> en tus favoritos tenés que estar registrado e ingresar con tu cuenta.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <a
                href={`/login?redirectTo=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/')}`}
                className="w-full bg-[#0047BA] hover:bg-[#002878] text-white py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 text-center cursor-pointer"
              >
                <span>Ingresar a mi Cuenta</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`/login?mode=signup&type=particular`}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-2xl font-extrabold text-xs text-center block transition-colors cursor-pointer"
              >
                Crear Cuenta Gratis
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
