import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { Search, Eye, Heart, RotateCcw, XCircle, Calendar as CalendarIcon, Euro } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryTreeFilter from './CategoryTreeFilter';

// Импорты для календаря
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from 'date-fns/locale';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 20;

const CATEGORY_TREE = [
  {
    name: 'antiek-en-kunst', label: 'Антиквариат и искусство',
    children: [
      { name: 'curiosa-en-brocante', label: 'Винтаж и старина' },
      { name: 'antiek-glas-en-kristal', label: 'Антикварное стекло' },
      { name: 'antiek-keramiek-en-aardewerk', label: 'Керамика и гончарные изделия' },
      { name: 'antiek-servies-los', label: 'Антикварная посуда' },
      { name: 'kunst-schilderijen-klassiek', label: 'Классическая живопись' },
      { name: 'kunst-etsen-en-gravures', label: 'Офорты и гравюры' },
      { name: 'antiek-boeken-en-bijbels', label: 'Старинные книги и библии' },
      { name: 'kunst-beelden-en-houtsnijwerken', label: 'Скульптуры и резьба по дереву' },
      { name: 'antiek-wandborden-en-tegels', label: 'Тарелки и плитка' },
      { name: 'antiek-koper-en-brons', label: 'Медь и бронза' }
    ]
  },
  {
    name: 'audio-tv-en-foto', label: 'Аудио, ТВ и фото',
    children: [
      { name: 'luidsprekers', label: 'Колонки' },
      { name: 'televisies', label: 'Телевизоры' },
      { name: 'fotocamera-s-digitaal', label: 'Цифровые фотоаппараты' },
      { name: 'fotografie-lenzen-en-objectieven', label: 'Объективы' },
      { name: 'fotocamera-s-analoog', label: 'Пленочные фотоаппараты' },
      { name: 'afstandsbedieningen', label: 'Пульты ДУ' },
      { name: 'fotografie-fotolijsten', label: 'Фоторамки' },
      { name: 'versterkers-en-receivers', label: 'Усилители и ресиверы' },
      { name: 'koptelefoons', label: 'Наушники' },
      { name: 'audiokabels-en-televisiekabels', label: 'Аудио и ТВ кабели' }
    ]
  },
  {
    name: 'auto-onderdelen', label: 'Автозапчасти',
    children: [
      { name: 'banden-en-velgen', label: 'Шины и диски' },
      { name: 'motoren', label: 'Двигатели' },
      { name: 'carrosserie', label: 'Кузовные детали' }
    ]
  },
  {
    name: 'auto-diversen', label: 'Авто (разное)',
    children: [
      { name: 'overige-auto-diversen', label: 'Прочее (авто)' },
      { name: 'autogereedschap', label: 'Автоинструмент' },
      { name: 'auto-accessoires', label: 'Автоаксессуары' },
      { name: 'tuning-en-styling', label: 'Тюнинг и стайлинг' },
      { name: 'handleidingen-en-instructieboekjes', label: 'Руководства' },
      { name: 'dakdragers', label: 'Багажники на крышу' },
      { name: 'autoradio-s', label: 'Автомагнитолы' },
      { name: 'onderhoudsmiddelen', label: 'Автохимия и уход' },
      { name: 'wieldoppen', label: 'Колпаки на диски' },
      { name: 'aanhangwagen-onderdelen', label: 'Запчасти для прицепов' }
    ]
  },
  {
    name: 'boeken', label: 'Книги',
    children: [
      { name: 'studieboeken-en-cursussen', label: 'Учебники и курсы' },
      { name: 'schoolboeken', label: 'Школьные учебники' },
      { name: 'wetenschap', label: 'Наука' },
      { name: 'overige-boeken', label: 'Прочие книги' },
      { name: 'romans', label: 'Романы' },
      { name: 'thrillers', label: 'Триллеры' },
      { name: 'literatuur', label: 'Литература' },
      { name: 'stripboeken', label: 'Комиксы' },
      { name: 'kinderboeken-jeugd-onder-10-jaar', label: 'Детские книги' },
      { name: 'auto-s-folders-en-tijdschriften', label: 'Автожурналы' }
    ]
  },
  {
    name: 'caravans-en-kamperen', label: 'Караваны и кемпинг',
    children: [
      { name: 'kampeeraccessoires', label: 'Аксессуары для кемпинга' },
      { name: 'caravan-accessoires', label: 'Аксессуары для караванов' },
      { name: 'tenten', label: 'Палатки' },
      { name: 'campers', label: 'Кемперы' },
      { name: 'caravans', label: 'Караваны' },
      { name: 'camper-accessoires', label: 'Аксессуары для кемперов' },
      { name: 'kampeermeubelen', label: 'Кемпинговая мебель' },
      { name: 'slaapzakken', label: 'Спальные мешки' },
      { name: 'koelboxen', label: 'Термобоксы' },
      { name: 'kampeergereedschap', label: 'Кемпинговые инструменты' }
    ]
  },
  {
    name: 'cd-s-en-dvd-s', label: 'CD и DVD',
    children: [
      { name: 'vinyl-singles', label: 'Виниловые синглы' },
      { name: 'cd-s-overige-cd-s', label: 'Прочие CD' },
      { name: 'cd-s-pop', label: 'CD Поп' },
      { name: 'cd-s-rock', label: 'CD Рок' },
      { name: 'vinyl-pop', label: 'Винил Поп' },
      { name: 'vinyl-rock', label: 'Винил Рок' },
      { name: 'blu-ray', label: 'Blu-ray' },
      { name: 'dvd-s-actie', label: 'DVD Боевики' },
      { name: 'cd-singles', label: 'CD Синглы' },
      { name: 'cd-s-klassiek', label: 'CD Классика' }
    ]
  },
  {
    name: 'computers-en-software', label: 'Компьютеры и ПО',
    children: [
      { name: 'printerbenodigdheden', label: 'Расходники для принтеров' },
      { name: 'monitoren', label: 'Мониторы' },
      { name: 'windows-laptops', label: 'Ноутбуки Windows' },
      { name: 'desktop-pc-s', label: 'Настольные ПК' },
      { name: 'pc-en-netwerkkabels', label: 'ПК и сетевые кабели' },
      { name: 'laptop-opladers', label: 'Зарядки для ноутбуков' },
      { name: 'printers', label: 'Принтеры' },
      { name: 'toetsenborden', label: 'Клавиатуры' },
      { name: 'overige-computers-en-software', label: 'Прочее' },
      { name: 'apple-ipads', label: 'Apple iPad' }
    ]
  },
  { name: 'contacten-en-berichten', label: 'Контакты и сообщения', children: [] },
  {
    name: 'dieren-en-toebehoren', label: 'Животные и аксессуары',
    children: [
      { name: 'vissen-aquaria-en-toebehoren', label: 'Рыбки, аквариумы' },
      { name: 'paardrijkleding', label: 'Одежда для верховой езды' },
      { name: 'paarden-en-pony-s-dekens-en-dekjes', label: 'Попоны для лошадей' },
      { name: 'honden-accessoires', label: 'Собачьи аксессуары' },
      { name: 'paarden-en-pony-s-hoofdstellen-en-tuigage', label: 'Упряжь для лошадей' },
      { name: 'vissen-aquariumvissen', label: 'Аквариумные рыбки' },
      { name: 'knaagdieren-en-konijnen-hokken-en-kooien', label: 'Клетки для грызунов' },
      { name: 'dierenvoeding', label: 'Корм для животных' },
      { name: 'paarden-en-pony-s-overige-paardenspullen', label: 'Прочее для лошадей' },
      { name: 'pluimvee', label: 'Домашняя птица' }
    ]
  },
  {
    name: 'doe-het-zelf-en-verbouw', label: 'Стройка и ремонт',
    children: [
      { name: 'sanitair', label: 'Сантехника' },
      { name: 'overige-doe-het-zelf-en-verbouw', label: 'Прочее' },
      { name: 'verwarming-en-radiatoren', label: 'Отопление и радиаторы' },
      { name: 'elektra-en-kabels', label: 'Электрика и кабели' },
      { name: 'hang-en-sluitwerk', label: 'Замки и фурнитура' },
      { name: 'tegels', label: 'Плитка' },
      { name: 'verf-beits-en-lak', label: 'Краска и лак' },
      { name: 'deuren-en-horren', label: 'Двери и москитные сетки' },
      { name: 'gereedschap-handgereedschap', label: 'Ручной инструмент' },
      { name: 'ijzerwaren-en-bevestigingsmiddelen', label: 'Стройматериалы и крепеж' }
    ]
  },
  {
    name: 'fietsen-en-brommers', label: 'Велосипеды и мопеды',
    children: [
      { name: 'brommeronderdelen-scooters', label: 'Запчасти для скутеров' },
      { name: 'fietsonderdelen', label: 'Велосипедные запчасти' },
      { name: 'fietsen-mountainbikes-en-atb', label: 'Горные велосипеды' },
      { name: 'fietsen-dames-damesfietsen', label: 'Женские велосипеды' },
      { name: 'elektrische-fietsen', label: 'Электровелосипеды' },
      { name: 'fietsaccessoires-fietsstoeltjes', label: 'Детские кресла' },
      { name: 'fietsen-racefietsen', label: 'Шоссейные велосипеды' },
      { name: 'steps', label: 'Электросамокаты' },
      { name: 'fietsen-heren-herenfietsen', label: 'Мужские велосипеды' },
      { name: 'fietsaccessoires-fietskleding', label: 'Велоодежда' }
    ]
  },
  {
    name: 'hobby-en-vrije-tijd', label: 'Хобби и досуг',
    children: [
      { name: 'verzamelkaartspellen-pokemon', label: 'Карточные игры (Pokemon)' },
      { name: 'feestartikelen', label: 'Праздничные товары' },
      { name: 'denksport-en-puzzels', label: 'Головоломки' },
      { name: 'gezelschapsspellen-bordspellen', label: 'Настольные игры' },
      { name: 'modelauto-s-1-43', label: 'Модели авто 1:43' },
      { name: 'modelauto-s-overige-schalen', label: 'Модели авто (другие)' },
      { name: 'knutselen', label: 'Рукоделие' },
      { name: 'overige-hobby-en-vrije-tijd', label: 'Прочее' },
      { name: 'gezelschapsspellen-kaartspellen', label: 'Карточные игры' },
      { name: 'modeltreinen-h0', label: 'Железнодорожные модели' }
    ]
  },
  {
    name: 'huis-en-inrichting', label: 'Дом и интерьер',
    children: [
      { name: 'keuken-servies', label: 'Посуда' },
      { name: 'stoelen', label: 'Стулья' },
      { name: 'slaapkamer-bedden', label: 'Кровати' },
      { name: 'lampen-hanglampen', label: 'Подвесные лампы' },
      { name: 'keuken-keukenbenodigdheden', label: 'Кухонные принадлежности' },
      { name: 'fauteuils', label: 'Кресла' },
      { name: 'woonaccessoires-overige', label: 'Декор' },
      { name: 'tafels-eettafels', label: 'Обеденные столы' },
      { name: 'stoffering-tapijten-en-kleden', label: 'Ковры' },
      { name: 'tafels-salontafels', label: 'Журнальные столики' }
    ]
  },
  {
    name: 'kinderen-en-baby-s', label: 'Дети и малыши',
    children: [
      { name: 'speelgoed-duplo-en-lego', label: 'Lego и Duplo' },
      { name: 'kinderkleding-schoenen-en-sokken', label: 'Детская обувь' },
      { name: 'speelgoed-knuffels-en-pluche', label: 'Мягкие игрушки' },
      { name: 'speelgoed-playmobil', label: 'Playmobil' },
      { name: 'autostoeltjes', label: 'Автокресла' },
      { name: 'speelgoed-educatief-en-creatief', label: 'Развивающие игрушки' },
      { name: 'kinderwagens-en-combinaties', label: 'Детские коляски' },
      { name: 'speelgoed-houten-speelgoed', label: 'Деревянные игрушки' },
      { name: 'babywiegjes-en-ledikanten', label: 'Люльки и колыбели' },
      { name: 'kinderkleding-maat-152', label: 'Детская одежда (152)' }
    ]
  },
  {
    name: 'kleding-dames', label: 'Женская одежда',
    children: [
      { name: 'schoenen', label: 'Обувь' },
      { name: 'jurken', label: 'Платья' },
      { name: 'blouses-en-tunieken', label: 'Блузки и туники' },
      { name: 'broeken-en-pantalons', label: 'Брюки' },
      { name: 'tops', label: 'Топы' },
      { name: 'truien-en-vesten', label: 'Свитера и кардиганы' },
      { name: 't-shirts', label: 'Футболки' },
      { name: 'rokken', label: 'Юбки' },
      { name: 'spijkerbroeken-en-jeans', label: 'Джинсы' },
      { name: 'jasjes-kostuums-en-pakken', label: 'Жакеты и костюмы' }
    ]
  },
  {
    name: 'kleding-heren', label: 'Мужская одежда',
    children: [
      { name: 'schoenen', label: 'Обувь' },
      { name: 't-shirts', label: 'Футболки' },
      { name: 'truien-en-vesten', label: 'Свитера и кардиганы' },
      { name: 'overhemden', label: 'Рубашки' },
      { name: 'spijkerbroeken-en-jeans', label: 'Джинсы' },
      { name: 'broeken-en-pantalons', label: 'Брюки' },
      { name: 'sportkleding', label: 'Спортивная одежда' },
      { name: 'polo-s', label: 'Поло' },
      { name: 'jassen-zomer', label: 'Куртки (лето)' },
      { name: 'jassen-winter', label: 'Куртки (зима)' }
    ]
  },
  {
    name: 'muziek-en-instrumenten', label: 'Музыка и инструменты',
    children: [
      { name: 'bladmuziek', label: 'Ноты' },
      { name: 'licht-en-laser', label: 'Свет и лазеры' },
      { name: 'effecten', label: 'Эффекты' },
      { name: 'microfoons', label: 'Микрофоны' },
      { name: 'snaarinstrumenten-gitaren-akoestisch', label: 'Акустические гитары' },
      { name: 'piano-s', label: 'Пианино' },
      { name: 'versterkers-bas-en-gitaar', label: 'Усилители' },
      { name: 'snaarinstrumenten-gitaren-elektrisch', label: 'Электрогитары' },
      { name: 'keyboards', label: 'Клавишные' },
      { name: 'drumstellen-en-slagwerk', label: 'Барабаны' }
    ]
  },
  { name: 'sieraden-tassen-en-uiterlijk', label: 'Украшения, сумки', children: [] },
  { name: 'spelcomputers-en-games', label: 'Игровые консоли и игры', children: [] },
  {
    name: 'sport-en-fitness', label: 'Спорт и фитнес',
    children: [
      { name: 'voetbal', label: 'Футбол' },
      { name: 'fitnessapparatuur', label: 'Тренажеры' },
      { name: 'fitnessmaterialen', label: 'Фитнес-инвентарь' },
      { name: 'skeelers', label: 'Роликовые коньки' },
      { name: 'bergsport-en-wandelen', label: 'Альпинизм и походы' },
      { name: 'loopsport-en-atletiek', label: 'Бег и атлетика' },
      { name: 'golf', label: 'Гольф' },
      { name: 'gezondheidsproducten-en-wellness', label: 'Здоровье и велнес' },
      { name: 'wielrennen', label: 'Велоспорт' },
      { name: 'skateboarden', label: 'Скейтбординг' }
    ]
  },
  { name: 'telecommunicatie', label: 'Телекоммуникации', children: [] },
  { name: 'tickets-en-kaartjes', label: 'Билеты', children: [] },
  {
    name: 'tuin-en-terras', label: 'Сад и терраса',
    children: [
      { name: 'tuinsets-en-loungesets', label: 'Садовые гарнитуры' },
      { name: 'tegels-en-klinkers', label: 'Плитка и брусчатка' },
      { name: 'bloempotten', label: 'Цветочные горшки' },
      { name: 'zwembaden', label: 'Бассейны' },
      { name: 'tuinstoelen', label: 'Садовые стулья' },
      { name: 'zwembad-toebehoren', label: 'Аксессуары для бассейнов' },
      { name: 'buitenverlichting', label: 'Уличное освещение' },
      { name: 'planten-tuinplanten', label: 'Садовые растения' },
      { name: 'tuinmeubel-accessoires', label: 'Аксессуары для садовой мебели' },
      { name: 'bloembakken-en-plantenbakken', label: 'Кашпо и ящики' }
    ]
  },
  { name: 'witgoed-en-apparatuur', label: 'Бытовая техника', children: [] },
  { name: 'zakelijke-goederen', label: 'Деловые товары', children: [] },
  { name: 'diversen', label: 'Разное', children: [] }
];

const SORT_OPTIONS = [
  { value: 'parsing_date:desc', label: 'Сначала новые' },
  { value: 'views_count:desc', label: 'По просмотрам' },
  { value: 'favorites_count:desc', label: 'По лайкам' },
  { value: 'price_cents:asc', label: 'Цена: по возрастанию' },
  { value: 'price_cents:desc', label: 'Цена: по убыванию' },
];

function FilterDropdown({ title, icon: Icon, isActive, children, onClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
          <div onClick={(e) => { e.stopPropagation(); onClear(); setIsOpen(false); }} className="p-1 hover:bg-blue-600/50 rounded text-blue-400">
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
  
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [exclude, setExclude] = useState('');
  
  const [excludedCategories, setExcludedCategories] = useState([]);
  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minViews, setMinViews] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [minLikes, setMinLikes] = useState('');
  const [maxLikes, setMaxLikes] = useState('');
  
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  
  const [sort, setSort] = useState('parsing_date:desc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageErrors, setImageErrors] = useState({}); // <--- Состояние для битых картинок

  useEffect(() => { setPage(1); }, [search, exclude, excludedCategories, minPrice, maxPrice, dateFrom, dateTo, minViews, maxViews, minLikes, maxLikes, sort]);
  useEffect(() => { fetchListings(); }, [search, exclude, excludedCategories, minPrice, maxPrice, dateFrom, dateTo, minViews, maxViews, minLikes, maxLikes, sort, page]);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    let query = supabase.from('marktplaats_listings').select('*', { count: 'exact' });

    if (search) query = query.ilike('title', `%${search}%`);
    if (exclude) query = query.not('title', 'ilike', `%${exclude}%`);

    if (excludedCategories.length > 0) {
      const excludedL1 = excludedCategories.filter(c => !c.includes('/'));
      const excludedL2 = excludedCategories.filter(c => c.includes('/')).map(c => c.split('/')[1]);

      if (excludedL1.length > 0) {
        query = query.not('category_l1', 'in', `(${excludedL1.map(c => `"${c}"`).join(',')})`);
      }
      if (excludedL2.length > 0) {
        query = query.not('category_l2', 'in', `(${excludedL2.map(c => `"${c}"`).join(',')})`);
      }
    }

    if (minPrice) query = query.gte('price_cents', parseInt(minPrice) * 100);
    if (maxPrice) query = query.lte('price_cents', parseInt(maxPrice) * 100);
    if (minViews) query = query.gte('views_count', parseInt(minViews));
    if (maxViews) query = query.lte('views_count', parseInt(maxViews));
    if (minLikes) query = query.gte('favorites_count', parseInt(minLikes));
    if (maxLikes) query = query.lte('favorites_count', parseInt(maxLikes));
    
    if (dateFrom) query = query.gte('publication_date', format(dateFrom, 'yyyy-MM-dd'));
    if (dateTo) query = query.lte('publication_date', format(dateTo, 'yyyy-MM-dd'));

    const [sortCol, sortDir] = sort.split(':');
    query = query.order(sortCol, { ascending: sortDir === 'asc' });

    const from = (page - 1) * ITEMS_PER_PAGE;
    query = query.range(from, from + ITEMS_PER_PAGE - 1);

    const { data, count, error } = await query;
    if (error) setError(error.message);
    else {
      setListings(data || []);
      setTotalCount(count || 0);
    }
    setLoading(false);
  };

  const handleSearchSubmit = (e) => { e.preventDefault(); setSearch(searchInput); };

  const resetFilters = () => {
    setSearchInput(''); setSearch(''); setExclude(''); setExcludedCategories([]);
    setMinPrice(''); setMaxPrice(''); setDateFrom(null); setDateTo(null);
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

      <div className="bg-[#141414] p-4 rounded-xl border border-[#222] mb-4 flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 min-w-[250px]">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Поиск по названию..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full bg-[#0a0908] border border-[#333] rounded-lg p-2.5 pl-9 text-white outline-none focus:border-blue-500" />
          </div>
          <button type="submit" className="px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">Найти</button>
        </form>
        <button onClick={resetFilters} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#333] bg-[#0a0908] text-gray-400 hover:text-white hover:bg-[#1a1a1a] transition">
          <RotateCcw size={16} /> Сброс
        </button>
      </div>

      <div className="bg-[#141414] p-4 rounded-xl border border-[#222] mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          
          <CategoryTreeFilter categories={CATEGORY_TREE} excluded={excludedCategories} onChange={setExcludedCategories} />

          <FilterDropdown title="Цена (€)" icon={Euro} isActive={!!minPrice || !!maxPrice} onClear={() => { setMinPrice(''); setMaxPrice(''); }}>
            <div className="flex gap-2">
              <input type="number" placeholder="От" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className={inputClass} />
              <input type="number" placeholder="До" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={inputClass} />
            </div>
          </FilterDropdown>

          <FilterDropdown title="Дата" icon={CalendarIcon} isActive={!!dateFrom || !!dateTo} onClear={() => { setDateFrom(null); setDateTo(null); }}>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">С даты</label>
                <DatePicker 
                  selected={dateFrom} 
                  onChange={(date) => setDateFrom(date)} 
                  locale={ru}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Выберите дату"
                  className={inputClass}
                  isClearable
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">По дату</label>
                <DatePicker 
                  selected={dateTo} 
                  onChange={(date) => setDateTo(date)} 
                  locale={ru}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Выберите дату"
                  className={inputClass}
                  isClearable
                />
              </div>
            </div>
          </FilterDropdown>

          <FilterDropdown title="Просмотры" icon={Eye} isActive={!!minViews || !!maxViews} onClear={() => { setMinViews(''); setMaxViews(''); }}>
            <div className="flex gap-2">
              <input type="number" placeholder="От" value={minViews} onChange={(e) => setMinViews(e.target.value)} className={inputClass} />
              <input type="number" placeholder="До" value={maxViews} onChange={(e) => setMaxViews(e.target.value)} className={inputClass} />
            </div>
          </FilterDropdown>

          <FilterDropdown title="Лайки" icon={Heart} isActive={!!minLikes || !!maxLikes} onClear={() => { setMinLikes(''); setMaxLikes(''); }}>
            <div className="flex gap-2">
              <input type="number" placeholder="От" value={minLikes} onChange={(e) => setMinLikes(e.target.value)} className={inputClass} />
              <input type="number" placeholder="До" value={maxLikes} onChange={(e) => setMaxLikes(e.target.value)} className={inputClass} />
            </div>
          </FilterDropdown>

          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
            {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

        </div>

        <div className="mt-3">
          <div className="relative">
            <XCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Исключить слова из названия (банворды)..." value={exclude} onChange={(e) => setExclude(e.target.value)} className="w-full bg-[#0a0908] border border-[#333] rounded-lg p-2.5 pl-9 text-white text-sm outline-none focus:border-red-500 transition-colors" />
          </div>
        </div>
      </div>

      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 p-3 rounded-lg mb-4">Ошибка: {error}</div>}

      {loading ? (
        <div className="text-center text-gray-500 py-20 animate-pulse">Загрузка данных...</div>
      ) : listings.length === 0 ? (
        <div className="text-center text-gray-500 py-20 bg-[#141414] rounded-xl border border-[#222]">По вашим фильтрам ничего не найдено</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {listings.map((item) => (
            <Link to={`/listing/${item.id}`} key={item.id} className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden hover:border-gray-500 transition-all group flex flex-col">
              <div className="h-44 bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center">
                {/* Обработка битых картинок */}
                {item.image_url && !imageErrors[item.id] ? (
                  <img 
                    src={item.image_url} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    alt="" 
                    loading="lazy" 
                    onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">Без фото</div>
                )}
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-white text-sm line-clamp-2 min-h-[2.5rem] font-medium leading-tight">{item.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2 mb-2">
                  <span className="flex items-center gap-1"><Eye size={14} /> {item.views_count || 0}</span>
                  <span className="flex items-center gap-1"><Heart size={14} /> {item.favorites_count || 0}</span>
                </div>
                <div className="mt-auto">
                  <strong className="text-lg text-white block">{item.price_cents ? `€ ${(item.price_cents / 100).toFixed(0)}` : 'См. описание'}</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 pb-10">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-[#141414] border border-[#333] rounded-lg disabled:opacity-30 hover:bg-[#1a1a1a] text-sm">Назад</button>
          <span className="text-sm text-gray-400">Страница {page} из {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 bg-[#141414] border border-[#333] rounded-lg disabled:opacity-30 hover:bg-[#1a1a1a] text-sm">Вперед</button>
        </div>
      )}
    </div>
  );
}
