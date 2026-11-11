import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { Search, Eye, Heart, SlidersHorizontal, RotateCcw, XCircle, Calendar as CalendarIcon, Tag, Euro } from 'lucide-react';
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

const SORT_OPTIONS = [
  { value: 'parsing_date:desc', label: 'Сначала новые' },
  { value: 'views_count:desc', label: 'По просмотрам' },
  { value: 'favorites_count:desc', label: 'По лайкам' },
  { value: 'price_cents:asc', label: 'Цена: по возрастанию' },
  { value: 'price_cents:desc', label: 'Цена: по убыванию' },
];

// Компонент для выезжающих панелей
function FilterDropdown({ title, icon: Icon, isActive, children, onClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-sm w-full transition-colors ${
          isActive 
            ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
            : 'bg-[#0a0908] border-[#333] text-gray-300 hover:bg-[#1a1a1a]'
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon size={16} />
          <span>{title}</span>
        </div>
        {isActive && (
          <div 
            onClick={(e) => { e.stopPropagation(); onClear(); setIsOpen(false); }}
            className="p-1 hover:bg-blue-600/50 rounded text-blue-400"
          >
            <XCircle size={14} />
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-[#141414] border border-[#333] rounded-xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ListView() {
  const [listings, setListings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  
  // Состояния фильтров
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [exclude, setExclude] = useState('');
  const [category, setCategory] = useState('');
  
  // От и До
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minViews, setMinViews] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [minLikes, setMinLikes] = useState('');
  const [maxLikes, setMaxLikes] = useState('');
  
  // Даты
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  const [sort, setSort] = useState('parsing_date:desc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { setPage(1); }, [search, exclude, category, minPrice, maxPrice, dateFrom, dateTo, minViews, maxViews, minLikes, maxLikes, sort]);
  useEffect(() => { fetchListings(); }, [search, exclude, category, minPrice, maxPrice, dateFrom, dateTo, minViews, maxViews, minLikes, maxLikes, sort, page]);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    let query = supabase.from('marktplaats_listings').select('*', { count: 'exact' });

    if (search) query = query.ilike('title', `%${search}%`);
    if (exclude) query = query.not('title', 'ilike', `%${exclude}%`);
    if (category) query = query.eq('category', category);

    // Цена
    if (minPrice) query = query.gte('price_cents', parseInt(minPrice) * 100);
    if (maxPrice) query = query.lte('price_cents', parseInt(maxPrice) * 100);

    // Просмотры
    if (minViews) query = query.gte('views_count', parseInt(minViews));
    if (maxViews) query = query.lte('views_count', parseInt(maxViews));

    // Лайки
    if (minLikes) query = query.gte('favorites_count', parseInt(minLikes));
    if (maxLikes) query = query.lte('favorites_count', parseInt(maxLikes));

    // Дата
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
    setMinViews(''); setMaxViews(''); setMinLikes(''); setMaxLikes('');
    setSort('parsing_date:desc');
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const inputClass = "w-full bg-[#0a0908] border border-[#333] text-white text-sm p-2 rounded outline-none focus:border-blue-500 transition-colors";
  const selectClass = "w-full bg-[#0a0908] border border-[#333] text-gray-300 text-sm p-2 rounded outline-none focus:border-blue-500 transition-colors cursor-pointer";

  return (
    <div className="min-h-screen bg-[#0a0908] text-gray-300 p-4 md:p-6">
      <header className="flex justify-between items-center mb-6 border-b border-[#222] pb-4">
        <h1 className="text-xl font-semibold text-white">Marktplaats Dashboard</h1>
        <span className="text-sm text-gray-500">Найдено: {totalCount}</span>
      </header>

      {/* Верхняя панель поиска */}
      <div className="bg-[#141414] p-4 rounded-xl border border-[#222] mb-4 flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 min-w-[250px]">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#0a0908] border border-[#333] rounded-lg p-2.5 pl-9 text-white outline-none focus:border-blue-500"
            />
          </div>
          <button type="submit" className="px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
            Найти
          </button>
        </form>
        
        <button onClick={resetFilters} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#333] bg-[#0a0908] text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition">
          <RotateCcw size={16} /> Сброс
        </button>
      </div>

      {/* Панель фильтров (с выезжающими меню) */}
      <div className="bg-[#141414] p-4 rounded-xl border border-[#222] mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          
          {/* Категория */}
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>

          {/* Цена (От и До) */}
          <FilterDropdown 
            title="Цена (€)" 
            icon={Euro} 
            isActive={!!minPrice || !!maxPrice}
            onClear={() => { setMinPrice(''); setMaxPrice(''); }}
          >
            <div className="flex gap-2">
              <input type="number" placeholder="От" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className={inputClass} />
              <input type="number" placeholder="До" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={inputClass} />
            </div>
          </FilterDropdown>

          {/* Дата */}
          <FilterDropdown 
            title="Дата" 
            icon={CalendarIcon} 
            isActive={!!dateFrom || !!dateTo}
            onClear={() => { setDateFrom(''); setDateTo(''); }}
          >
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">С даты</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">По дату</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputClass} />
              </div>
            </div>
          </FilterDropdown>

          {/* Просмотры (От и До) */}
          <FilterDropdown 
            title="Просмотры" 
            icon={Eye} 
            isActive={!!minViews || !!maxViews}
            onClear={() => { setMinViews(''); setMaxViews(''); }}
          >
            <div className="flex gap-2">
              <input type="number" placeholder="От" value={minViews} onChange={(e) => setMinViews(e.target.value)} className={inputClass} />
              <input type="number" placeholder="До" value={maxViews} onChange={(e) => setMaxViews(e.target.value)} className={inputClass} />
            </div>
          </FilterDropdown>

          {/* Лайки (От и До) */}
          <FilterDropdown 
            title="Лайки" 
            icon={Heart} 
            isActive={!!minLikes || !!maxLikes}
            onClear={() => { setMinLikes(''); setMaxLikes(''); }}
          >
            <div className="flex gap-2">
              <input type="number" placeholder="От" value={minLikes} onChange={(e) => setMinLikes(e.target.value)} className={inputClass} />
              <input type="number" placeholder="До" value={maxLikes} onChange={(e) => setMaxLikes(e.target.value)} className={inputClass} />
            </div>
          </FilterDropdown>

          {/* Сортировка */}
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
            {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

        </div>

        {/* Банворды */}
        <div className="mt-3">
          <div className="relative">
            <XCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Исключить слова из названия (банворды)..."
              value={exclude}
              onChange={(e) => setExclude(e.target.value)}
              className="w-full bg-[#0a0908] border border-[#333] rounded-lg p-2.5 pl-9 text-white text-sm outline-none focus:border-red-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg mb-4">Ошибка: {error}</div>}

      {/* Сетка карточек */}
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
