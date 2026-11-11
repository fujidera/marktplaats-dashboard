import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Search, Eye, Heart, SlidersHorizontal, RotateCcw, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 20;

const CATEGORIES = [
  { value: '', label: 'Все категории' },
  { value: 'antiek-en-kunst', label: 'Антиквариат' },
  { value: 'audio-tv-en-foto', label: 'Аудио, ТВ' },
  { value: 'auto-onderdelen', label: 'Автозапчасти' },
  { value: 'computers-en-software', label: 'Компьютеры' },
  { value: 'fietsen-en-brommers', label: 'Велосипеды' },
  { value: 'huis-en-inrichting', label: 'Дом и интерьер' },
  { value: 'kleding-dames', label: 'Женская одежда' },
  { value: 'kleding-heren', label: 'Мужская одежда' },
  { value: 'spelcomputers-en-games', label: 'Игровые консоли' },
  { value: 'telecommunicatie', label: 'Телекоммуникации' },
];

const VIEWS_RANGES = [
  { value: '', label: 'Любые просмотры' },
  { value: '0-50', label: 'До 50' },
  { value: '50-200', label: '50 - 200' },
  { value: '200-500', label: '200 - 500' },
  { value: '500-', label: 'Более 500' },
];

const LIKES_RANGES = [
  { value: '', label: 'Любые лайки' },
  { value: '0-5', label: 'До 5' },
  { value: '5-20', label: '5 - 20' },
  { value: '20-', label: 'Более 20' },
];

const SORT_OPTIONS = [
  { value: 'parsing_date:desc', label: 'Сначала новые' },
  { value: 'views_count:desc', label: 'По просмотрам' },
  { value: 'favorites_count:desc', label: 'По лайкам' },
  { value: 'price_cents:asc', label: 'Цена: по возрастанию' },
  { value: 'price_cents:desc', label: 'Цена: по убыванию' },
];

export default function ListView() {
  const [listings, setListings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  
  // Состояния фильтров
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [exclude, setExclude] = useState('');
  const [category, setCategory] = useState('');
  
  // Новые состояния для цены и даты
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [viewsRange, setViewsRange] = useState('');
  const [likesRange, setLikesRange] = useState('');
  const [sort, setSort] = useState('parsing_date:desc');
  
  const [showFilters, setShowFilters] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Следим за изменениями фильтров, чтобы сбрасывать страницу на 1-ю
  useEffect(() => { 
    setPage(1); 
  }, [search, exclude, category, minPrice, maxPrice, dateFrom, dateTo, viewsRange, likesRange, sort]);

  useEffect(() => { 
    fetchListings(); 
  }, [search, exclude, category, minPrice, maxPrice, dateFrom, dateTo, viewsRange, likesRange, sort, page]);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    let query = supabase.from('marktplaats_listings').select('*', { count: 'exact' });

    if (search) query = query.ilike('title', `%${search}%`);
    if (exclude) query = query.not('title', 'ilike', `%${exclude}%`);
    if (category) query = query.eq('category', category);

    // Логика фильтрации по цене (От и До)
    if (minPrice) query = query.gte('price_cents', parseInt(minPrice) * 100);
    if (maxPrice) query = query.lte('price_cents', parseInt(maxPrice) * 100);

    // Логика фильтрации по просмотрам
    if (viewsRange) {
      const [min, max] = viewsRange.split('-');
      if (min) query = query.gte('views_count', parseInt(min));
      if (max) query = query.lte('views_count', parseInt(max));
    }

    // Логика фильтрации по лайкам
    if (likesRange) {
      const [min, max] = likesRange.split('-');
      if (min) query = query.gte('favorites_count', parseInt(min));
      if (max) query = query.lte('favorites_count', parseInt(max));
    }

    // Логика фильтрации по дате (От и До)
    if (dateFrom) query = query.gte('publication_date', dateFrom);
    if (dateTo) query = query.lte('publication_date', dateTo);

    const [sortCol, sortDir] = sort.split(':');
    query = query.order(sortCol, { ascending: sortDir === 'asc' });

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

  const resetFilters = () => {
    setSearchInput(''); setSearch(''); setExclude(''); setCategory('');
    setMinPrice(''); setMaxPrice(''); setDateFrom(''); setDateTo('');
    setViewsRange(''); setLikesRange('');
    setSort('parsing_date:desc');
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const selectClass = "w-full bg-[#0a0908] border border-[#333] text-gray-300 text-sm p-2 rounded outline-none focus:border-gray-500 transition-colors cursor-pointer";
  const inputClass = "w-full bg-[#0a0908] border border-[#333] text-white text-sm p-2 rounded outline-none focus:border-gray-500";

  return (
    <div className="min-h-screen bg-[#0a0908] text-gray-300 p-4 md:p-6">
      <header className="flex justify-between items-center mb-6 border-b border-[#222] pb-4">
        <h1 className="text-xl font-semibold text-white">Marktplaats Dashboard</h1>
        <span className="text-sm text-gray-500">Найдено: {totalCount}</span>
      </header>

      <div className="bg-[#141414] p-4 rounded-xl border border-[#222] mb-4 flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 min-w-[250px]">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#0a0908] border border-[#333] rounded-lg p-2.5 pl-9 text-white outline-none focus:border-gray-500"
            />
          </div>
          <button type="submit" className="px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
            Найти
          </button>
        </form>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${showFilters ? 'bg-[#2a2a2a] border-[#444] text-white' : 'bg-[#0a0908] border-[#333] text-gray-400 hover:bg-[#1a1a1a]'}`}
        >
          <SlidersHorizontal size={16} /> Фильтры
        </button>
        <button onClick={resetFilters} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#333] bg-[#0a0908] text-gray-400 hover:text-white hover:bg-[#1a1a1a]">
          <RotateCcw size={16} /> Сброс
        </button>
      </div>

      {showFilters && (
        <div className="bg-[#141414] p-4 rounded-xl border border-[#222] mb-6 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-3">
            
            {/* Категория */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 ml-1">Категория</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            {/* Цена (От и До) */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 ml-1">Цена (€)</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="От" 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(e.target.value)} 
                  className={inputClass} 
                />
                <input 
                  type="number" 
                  placeholder="До" 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(e.target.value)} 
                  className={inputClass} 
                />
              </div>
            </div>

            {/* Дата (С и По - с календарем) */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 ml-1">Дата публикации</label>
              <div className="flex gap-2">
                <input 
                  type="date" 
                  value={dateFrom} 
                  onChange={(e) => setDateFrom(e.target.value)} 
                  className={inputClass} 
                  title="С даты"
                />
                <input 
                  type="date" 
                  value={dateTo} 
                  onChange={(e) => setDateTo(e.target.value)} 
                  className={inputClass} 
                  title="По дату"
                />
              </div>
            </div>

            {/* Просмотры */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 ml-1">Просмотры</label>
              <select value={viewsRange} onChange={(e) => setViewsRange(e.target.value)} className={selectClass}>
                {VIEWS_RANGES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
              </select>
            </div>

            {/* Лайки */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 ml-1">Лайки</label>
              <select value={likesRange} onChange={(e) => setLikesRange(e.target.value)} className={selectClass}>
                {LIKES_RANGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>

          {/* Второй ряд фильтров */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Сортировка */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 ml-1">Сортировка</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
                {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {/* Банворды */}
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 ml-1">Исключить слова (Банворды)</label>
              <div className="relative">
                <XCircle size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Например: битые, ремонт, копия..."
                  value={exclude}
                  onChange={(e) => setExclude(e.target.value)}
                  className="w-full bg-[#0a0908] border border-[#333] rounded p-2 pl-8 text-white text-sm outline-none focus:border-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg mb-4">Ошибка: {error}</div>}

      {loading ? (
        <div className="text-center text-gray-500 py-20 animate-pulse">Загрузка данных...</div>
      ) : listings.length === 0 ? (
        <div className="text-center text-gray-500 py-20 bg-[#141414] rounded-xl border border-[#222]">По вашим фильтрам ничего не найдено</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {listings.map((item) => (
            <Link to={`/listing/${item.id}`} key={item.id}
              className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden hover:border-gray-500 transition-all group flex flex-col">
              <div className="h-44 bg-[#1a1a1a] relative overflow-hidden">
                {item.image_url
                  ? <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="" loading="lazy" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">Без фото</div>}
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-white text-sm line-clamp-2 min-h-[2.5rem] font-medium leading-tight">{item.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2 mb-2">
                  <span className="flex items-center gap-1"><Eye size={14} /> {item.views_count || 0}</span>
                  <span className="flex items-center gap-1"><Heart size={14} /> {item.favorites_count || 0}</span>
                </div>
                <div className="mt-auto">
                  <strong className="text-lg text-white block">
                    {item.price_cents ? `€ ${(item.price_cents / 100).toFixed(0)}` : 'См. описание'}
                  </strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 pb-10">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-[#141414] border border-[#333] rounded-lg disabled:opacity-30 hover:bg-[#1a1a1a] text-sm">
            Назад
          </button>
          <span className="text-sm text-gray-400">Страница {page} из {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-[#141414] border border-[#333] rounded-lg disabled:opacity-30 hover:bg-[#1a1a1a] text-sm">
            Вперед
          </button>
        </div>
      )}
    </div>
  );
}
