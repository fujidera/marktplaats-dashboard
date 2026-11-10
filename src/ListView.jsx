import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Search, Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 20;

const CATEGORIES = [
  { value: '', label: 'Все категории' },
  { value: 'antiek-en-kunst', label: 'Антиквариат и искусство' },
  { value: 'audio-tv-en-foto', label: 'Аудио, ТВ и фото' },
  { value: 'auto-onderdelen', label: 'Автозапчасти' },
  { value: 'auto-diversen', label: 'Авто (разное)' },
  { value: 'boeken', label: 'Книги' },
  { value: 'caravans-en-kamperen', label: 'Караваны и кемпинг' },
  { value: 'cd-s-en-dvd-s', label: 'CD и DVD' },
  { value: 'computers-en-software', label: 'Компьютеры и ПО' },
  { value: 'contacten-en-berichten', label: 'Контакты и сообщения' },
  { value: 'dieren-en-toebehoren', label: 'Животные и аксессуары' },
  { value: 'doe-het-zelf-en-verbouw', label: 'Стройка и ремонт' },
  { value: 'fietsen-en-brommers', label: 'Велосипеды и мопеды' },
  { value: 'hobby-en-vrije-tijd', label: 'Хобби и досуг' },
  { value: 'huis-en-inrichting', label: 'Дом и интерьер' },
  { value: 'kinderen-en-baby-s', label: 'Дети и малыши' },
  { value: 'kleding-dames', label: 'Женская одежда' },
  { value: 'kleding-heren', label: 'Мужская одежда' },
  { value: 'muziek-en-instrumenten', label: 'Музыка и инструменты' },
  { value: 'sieraden-tassen-en-uiterlijk', label: 'Украшения, сумки' },
  { value: 'spelcomputers-en-games', label: 'Игровые консоли и игры' },
  { value: 'sport-en-fitness', label: 'Спорт и фитнес' },
  { value: 'telecommunicatie', label: 'Телекоммуникации' },
  { value: 'tickets-en-kaartjes', label: 'Билеты' },
  { value: 'tuin-en-terras', label: 'Сад и терраса' },
  { value: 'witgoed-en-apparatuur', label: 'Бытовая техника' },
  { value: 'zakelijke-goederen', label: 'Деловые товары' },
  { value: 'diversen', label: 'Разное' },
];

export default function ListView() {
  const [listings, setListings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { setPage(1); }, [search, category]);
  useEffect(() => { fetchListings(); }, [search, category, page]);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    let query = supabase.from('marktplaats_listings').select('*', { count: 'exact' });
    if (search) query = query.ilike('title', `%${search}%`);
    if (category) query = query.eq('category', category);
    query = query.order('parsing_date', { ascending: false });
    const from = (page - 1) * ITEMS_PER_PAGE;
    query = query.range(from, from + ITEMS_PER_PAGE - 1);

    const { data, count, error } = await query;
    if (error) {
      setError(error.message);
    } else {
      setListings(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  const handleSearchSubmit = (e) => { e.preventDefault(); setSearch(searchInput); };
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));

  return (
    <div className="min-h-screen bg-[#0a0908] text-gray-300 p-6">
      <header className="flex justify-between items-center mb-8 border-b border-[#222] pb-4">
        <h1 className="text-xl font-semibold text-white">echo • Marktplaats Parser</h1>
        <span className="text-sm text-gray-500">Всего: {totalCount}</span>
      </header>

      <div className="bg-[#141414] p-4 rounded-lg border border-[#222] mb-6 flex flex-wrap gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 min-w-[250px]">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#0a0908] border border-[#333] rounded p-2 pl-9 text-white outline-none focus:border-gray-500"
            />
          </div>
          <button type="submit" className="px-4 bg-[#222] border border-[#333] rounded text-white hover:bg-[#2a2a2a]">
            Найти
          </button>
        </form>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-[#0a0908] border border-[#333] text-white p-2 rounded outline-none focus:border-gray-500 min-w-[200px]"
        >
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded mb-4">Ошибка: {error}</div>}

      {loading ? (
        <div className="text-center text-gray-500 py-20">Загрузка...</div>
      ) : listings.length === 0 ? (
        <div className="text-center text-gray-500 py-20">Ничего не найдено</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((item) => (
            <Link to={`/listing/${item.id}`} key={item.id}
              className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden hover:border-gray-500 transition">
              <div className="h-48 bg-[#222]">
                {item.image_url
                  ? <img src={item.image_url} className="w-full h-full object-cover" alt="" loading="lazy" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">Без фото</div>}
              </div>
              <div className="p-4">
                <h3 className="text-white text-sm line-clamp-2 min-h-[2.5rem]">{item.title}</h3>
                <div className="flex gap-3 text-xs text-gray-400 mt-2">
                  <span className="flex items-center gap-1"><Eye size={14} /> {item.views_count || 0}</span>
                  <span className="flex items-center gap-1"><Heart size={14} /> {item.favorites_count || 0}</span>
                </div>
                <strong className="text-lg text-white block mt-2">
                  {item.price_cents ? `€ ${(item.price_cents / 100).toFixed(0)}` : '—'}
                </strong>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 bg-[#141414] border border-[#333] rounded disabled:opacity-30 hover:bg-[#1a1a1a]"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm">Страница {page} из {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 bg-[#141414] border border-[#333] rounded disabled:opacity-30 hover:bg-[#1a1a1a]"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
