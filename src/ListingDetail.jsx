import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Eye, Heart, ExternalLink, ArrowLeft, Calendar, Tag, User, Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function ListingDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownloadZip = async () => {
    if (!item) return;
    setIsDownloading(true);

    try {
      const zip = new JSZip();

      // 1. info.txt
      const priceStr = item.price_cents ? `${(item.price_cents / 100).toFixed(0)} €` : 'Не указана';
      let infoText = `Название\n${item.title}\n\nЦена\n${priceStr}\n\nКатегория\n${item.category || '—'}\n\n`;
      infoText += `Описание\n${item.description || 'Описание отсутствует.'}\n\nХарактеристики\n`;
      infoText += `Продавец: ${item.seller_name || '—'}\nПросмотры: ${item.views_count || 0}\n`;
      infoText += `В избранном: ${item.favorites_count || 0}\nДата: ${item.publication_date || '—'}\n`;
      infoText += `Ссылка: ${item.url}\n`;
      zip.file("info.txt", infoText);

      // 2. Скачиваем ВСЕ фото
      const urls = item.image_urls && item.image_urls.length > 0 
        ? item.image_urls 
        : (item.image_url ? [item.image_url] : []);
      
      for (let i = 0; i < urls.length; i++) {
        try {
          const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(urls[i])}`;
          const imgResponse = await fetch(proxyUrl);
          const imgBlob = await imgResponse.blob();
          zip.file(`image_${i + 1}.jpg`, imgBlob);
        } catch (err) {
          console.error(`Не удалось скачать фото ${i + 1}`);
        }
      }

      // 3. Генерация и сохранение
      const content = await zip.generateAsync({ type: "blob" });
      const safeTitle = item.title.replace(/[/\\?%*:|"<>]/g, '-').substring(0, 50);
      saveAs(content, `${safeTitle}.zip`);

    } catch (err) {
      alert("Ошибка: " + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return <div className="text-white p-6 min-h-screen bg-[#0a0908]">Загрузка...</div>;
  if (error || !item) return (
    <div className="p-6 min-h-screen bg-[#0a0908] text-white">
      <Link to="/" className="flex items-center gap-2 mb-6 hover:text-gray-400"><ArrowLeft size={20}/> Назад</Link>
      <div className="text-red-400">Объявление не найдено. {error}</div>
    </div>
  );

  // Формируем список фото для отображения
  const displayImages = item.image_urls && item.image_urls.length > 0 
    ? item.image_urls 
    : (item.image_url ? [item.image_url] : []);

  return (
    <div className="min-h-screen bg-[#0a0908] text-gray-300 p-6">
      <Link to="/" className="flex items-center gap-2 text-white mb-6 hover:text-gray-400">
        <ArrowLeft size={20} /> Назад к списку
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Галерея фото */}
        <div className="w-full md:w-1/2 bg-[#141414] border border-[#222] rounded-xl overflow-hidden">
          {displayImages.length > 0 ? (
            <div className={`grid gap-1 h-full max-h-[500px] ${displayImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {displayImages.map((url, idx) => (
                <div key={idx} className="bg-black flex items-center justify-center overflow-hidden">
                  <img src={url} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" alt={`${item.title} - ${idx + 1}`} />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center text-gray-600">Без изображения</div>
          )}
        </div>

        {/* Информация */}
        <div className="w-full md:w-1/2 flex flex-col">
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
            {item.seller_name && (
              <span className="flex items-center gap-1 text-blue-400 font-medium">
                <User size={14} /> {item.seller_name}
              </span>
            )}
          </div>

          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href={item.url} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-[#222] hover:bg-[#333] border border-[#333] text-white text-center rounded-lg transition text-sm font-medium">
              На Marktplaats <ExternalLink size={16} />
            </a>
            <button 
              onClick={handleDownloadZip} 
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-center rounded-lg transition text-sm font-medium"
            >
              {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {isDownloading ? 'Сборка...' : 'Скачать ZIP'}
            </button>
          </div>
        </div>
      </div>

      {item.description && (
        <div className="mt-8 bg-[#141414] border border-[#222] p-6 rounded-xl">
          <h2 className="text-lg text-white mb-4">Описание</h2>
          <p className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
            {item.description}
          </p>
        </div>
      )}

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
