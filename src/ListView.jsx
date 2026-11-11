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
