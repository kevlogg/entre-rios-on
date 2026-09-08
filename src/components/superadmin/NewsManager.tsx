'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CommunityEvent } from '@/types';
import { Newspaper, Plus, Trash2, Calendar, MapPin, Sparkles, X, User } from 'lucide-react';

interface NewsManagerProps {
  events: CommunityEvent[];
}

export function NewsManager({ events: initialEvents }: NewsManagerProps) {
  const [events, setEvents] = useState<CommunityEvent[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Festival' | 'Gastronomía' | 'Cultura' | 'Deportes' | 'Turismo' | 'Emprendedores'>('Turismo');
  const [cityId, setCityId] = useState('gualeguaychu');
  const [excerpt, setExcerpt] = useState('');
  const [authorName, setAuthorName] = useState('Valeria Benítez');
  const [imageUrl, setImageUrl] = useState('/images/commerce-bodega.jpg');

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt) return;

    const newEvt: CommunityEvent = {
      id: `evt-${Date.now()}`,
      title,
      category,
      date: new Date().toISOString().split('T')[0],
      formattedDate: 'Hoy, 2026',
      location: cityId === 'gualeguaychu' ? 'Gualeguaychú' : cityId === 'parana' ? 'Paraná' : 'Colón',
      cityId,
      cityName: cityId === 'gualeguaychu' ? 'Gualeguaychú' : cityId === 'parana' ? 'Paraná' : 'Colón',
      imageUrl,
      readTimeMinutes: 4,
      excerpt,
      isFeatured: true,
      author: {
        name: authorName,
        avatarUrl: '/images/avatar-author.jpg',
      },
    };

    setEvents([newEvt, ...events]);
    setIsModalOpen(false);

    // Reset Form
    setTitle('');
    setExcerpt('');
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-black text-[#004b87] flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-[#00a859]" />
            <span>Gestión de Prensa, Comunidad ON & Agenda Cultural</span>
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Publicá artículos, notas de enoturismo y comunicados oficiales para toda la provincia.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#00a859] hover:bg-[#008746] text-white px-5 py-2.5 rounded-2xl font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Redactar Nueva Noticia</span>
        </button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((evt) => (
          <div key={evt.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-[#004b87] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase">
                  {evt.category}
                </span>
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#00a859]" />
                  {evt.cityName}
                </span>
              </div>

              <h4 className="font-extrabold text-slate-900 text-base leading-snug">{evt.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-2">{evt.excerpt}</p>
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-700">{evt.author.name}</span>
              </div>

              <button
                onClick={() => handleDelete(evt.id)}
                className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                title="Eliminar Noticia"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Redactar Noticia */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-[#004b87] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00a859]" />
                <span>Publicar Nota Editorial Provincial</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Título de la Nota / Noticia *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. El auge del Enoturismo en Gualeguaychú"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-[#00a859]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Categoría Editorial</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value="Turismo">Turismo</option>
                    <option value="Gastronomía">Gastronomía</option>
                    <option value="Festival">Festival</option>
                    <option value="Cultura">Cultura</option>
                    <option value="Deportes">Deportes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ciudad Destacada</label>
                  <select
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value="gualeguaychu">Gualeguaychú</option>
                    <option value="parana">Paraná</option>
                    <option value="colon">Colón</option>
                    <option value="concordia">Concordia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Extracto / Copete de la Nota *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Escribí una síntesis atractiva para la portada..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Autor de la Nota</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs font-semibold text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="bg-[#00a859] hover:bg-[#008746] text-white px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md"
                >
                  Publicar Nota en Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
