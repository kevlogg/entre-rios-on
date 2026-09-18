'use client';

import { useEffect } from 'react';

interface ProfileViewTrackerProps {
  commerceId: string;
}

export function ProfileViewTracker({ commerceId }: ProfileViewTrackerProps) {
  useEffect(() => {
    if (!commerceId) return;

    fetch(`/api/lead/view?commerceId=${encodeURIComponent(commerceId)}`, {
      method: 'GET',
      cache: 'no-store',
    }).catch((err) => {
      console.warn('Error al enviar metrica de vista de perfil:', err);
    });
  }, [commerceId]);

  return null;
}
