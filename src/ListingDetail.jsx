import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Eye, Heart, ExternalLink, ArrowLeft, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

export default function ListingDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: listing, error: err1 } = await supabase
        .from('marktplaats_listings').select('*').eq('id', id).single();
      if (err1) setError(err1.message);
      setItem(listing);

      const { data: snaps } = await supabase
        .from('marktplaats_snapshots').select('*')
        .eq('listing_id', id)
        .order('recorded_at', { ascending: false });
      setSnapshots(snaps || []);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="text-white p-6 min-h-screen bg-[#0a0908]">Загрузка...</div>;
  if (error || !item) return (
    <div className="p-6 min-h-screen bg-[#0a0908] text-white">
      <Link to="/" className="flex items-center gap-2 mb-6"><ArrowLeft size={20}/> Назад</Link>
      <div className="text-red-400">Объявление не найдено. {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0908] text-gray-300 p-6">
      <Link to="/" className="flex items-center gap-2 text-white mb-6 hover:text-gray-400">
        <ArrowLeft size={20} /> Назад к списку
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 bg-[#141414] border border-[#222] rounded-xl h-[400px] flex items-center justify-center overflow-hidden">
          {item.image_url
            ? <img src={item.image_url} className="w-full h-full object-contain" alt={item.title} />
            : <span className="text-gray-600">Без изображения</span>}
        </div>

        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold text-white mb-2">{item.title}</h1>
          <strong className="text-3xl text-white block mb-4">
            {item.price_cents ? `€ ${(item.price_cents / 100).toFixed(2)}` : '—'}
          </strong>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
            <span className="flex items-center gap-1"><Eye size={16} /> {item.views_count || 0} просмотров</span>
            <span className="flex items-center gap-1"><Heart size={16} /> {item.favorites_count || 0} в избранном</span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1"><Tag size={14} /> {item.category || '—'}</span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> Опубликовано: {item.publication_date || '—'}
            </span>
          </div>

          <a href={item.url} target="_blank" rel="noreferrer"
            className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition">
            Открыть на Marktplaats <ExternalLink size={18} className="inline ml-2" />
          </a>
        </div>
      </div>

      <div className="mt-8 bg-[#141414] border border-[#222] p-6 rounded-xl">
        <h2 className="text-lg text-white mb-4">История цен ({snapshots.length})</h2>
        {snapshots.length === 0 ? (
          <p className="text-sm text-gray-500">История цен пока отсутствует.</p>
        ) : (
          snapshots.map(s => (
            <div key={s.id} className="text-sm py-2 border-b border-[#222] flex justify-between">
              <span>{format(new Date(s.recorded_at), 'dd.MM.yyyy HH:mm')}</span>
              <span className="text-white">€ {(s.price_cents / 100).toFixed(2)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
