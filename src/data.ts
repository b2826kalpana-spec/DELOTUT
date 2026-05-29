/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Service, Master, Order, District } from './types';

export const INITIAL_DISTRICTS: District[] = [
  { id: 'central', name: 'Центральный' },
  { id: 'kuznetsky', name: 'Кузнецкий' },
  { id: 'kuybyshevsky', name: 'Куйбышевский' },
  { id: 'ordzhonikidzevsky', name: 'Орджоникидзевский' },
  { id: 'zavodskoy', name: 'Заводской' },
  { id: 'ilyinsky', name: 'Новоильинский' },
  { id: 'abashevo', name: 'Абашево' },
  { id: 'baydaevka', name: 'Байдаевка' },
  { id: 'redakovo', name: 'Редаково' },
  { id: 'ilinka', name: 'Ильинка' },
  { id: 'zapsib', name: 'Запсиб' },
  { id: 'other', name: 'Другой район / уточнить' },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'electrical', name: 'Электрика', icon: 'Zap' },
  { id: 'plumbing', name: 'Сантехника', icon: 'Droplets' },
  { id: 'loaders', name: 'Грузчики', icon: 'Truck' },
  { id: 'cleaning', name: 'Уборка', icon: 'Sparkles' },
  { id: 'tasks', name: 'Поручения', icon: 'FileText' },
  { id: 'furniture', name: 'Мебель', icon: 'Armchair' },
  { id: 'computer', name: 'Компьютерная помощь', icon: 'Laptop' },
  { id: 'handyman', name: 'Мелкий ремонт', icon: 'Hammer' },
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'general-clean',
    categoryId: 'cleaning',
    name: 'Генеральная уборка квартиры',
    description: 'Полный комплекс клининговых услуг для вашего дома.',
    price: 3500,
    rating: 4.9,
    reviewsCount: 120,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEkyxsBakU-RoXMYtkPGAfvECVY2NuTsQgDsX_dV-U8C5qZ3QSnQj_XUGDTfs5hbYoI8K0CPWuyxtsr05miTFL9WajeCKVtMPEFKtTaBVmzCxfv6SKdUecCcop3q0rYuMSOroO57NknMX_RtTpFDYUq3RoxGb2V6giGrh4sG2NFdvW7GoW-VRB8AlH6zEQe-UdY172G7bg7lA0RsY_xpTsYxKAsRaOjgGPB2T1cGZurE2xeVK_f4bTvSQeSUsKjKgE6jizRzEpQHrf',
    isPopular: true
  },
  {
    id: 'faucet',
    categoryId: 'plumbing',
    name: 'Установка смесителя',
    description: 'Сантехнические работы базового уровня.',
    price: 1500,
    rating: 4.8,
    reviewsCount: 85,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw5c4n3wMvVAuYEP0nfFAhOfpi2I7JDu0B2sWo6QNRyZZ0pd-_o8zQnPDLJtjGm22ShjuKF5BSW837Gm0JZC3FbFTdxBtmbVJx3J7XCepggWatCMfjCzHoKn5TOGOMRSpClWnF959f3U_VZinvfomZrBhwmaJVkqkehQ0fgxFrb5UHvYsK-ycde5mg-shemVw6NQ7U_aTKWGkekTvPjNsVXdUTZitAHpOJMqvUgAJwXiYjharjvnm2FGu6PWgYMpJiBQJbZr4PrFYH',
    isPopular: true
  },
  {
    id: 'website',
    categoryId: 'computer',
    name: 'Разработка веб-сайта',
    description: 'Создание современных адаптивных сайтов для вашего бизнеса.',
    price: 15000,
    rating: 5.0,
    reviewsCount: 210,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCbmD33vCWEppVPqXzKPi8G04iZAmt7iMuUGWU-EMwKfySiFGDXsL1TZToB-tDCI0GDoz4YBXBx6anyQM1WUpT5pZq9dkvIjFhhaSOAOK8zX5WhheVccAyainb81--9OUP3AdTPt4WnU1Y5JBRjA5L5mbcVZ-h7LOzsha1X-2fq-goGz8C9mkDLsK6xYzSXbSZkCz-lBSAJwWkycKcmfIzofh5xdvBPGwCKivHv_V19nUI2fID_y9KtVUw4USei747ayEaWY7me-w7',
    isPopular: true
  },
  {
    id: 'furniture-assemble',
    categoryId: 'furniture',
    name: 'Сборка мебели',
    description: 'Быстрая и аккуратная сборка любой корпусной мебели.',
    price: 2000,
    rating: 4.7,
    reviewsCount: 45,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwknCR6eP_7pHqSOAnG8l0q8HYXAOFjqbSbMAhwK5uJLJ0J0MkhmVdwXywWuIF2NxXXX0sCYcqlz5on9dPoH1HVmvkezvkqsBpxsnhdl4dLAFj_9jzU2TmYB4SVF3U9tTSdXJxBlf5U3ZFUQp7IEcNp1ho5S7Va9_-CdmWCFbNrrJXUtEwYTEdbUuaQ39NrjUjOkcbiy9f93lduabPllMeXQ2QVKEd1mj9ztG68_8TOQBH0USScRIk_QzlC__Np-JrqRjJaXKmPsQ7',
    isPopular: true
  },
  {
    id: 'pipes',
    categoryId: 'plumbing',
    name: 'Ремонт труб',
    description: 'Устранение протечек и замена поврежденных участков труб в квартире.',
    price: 1200,
    rating: 4.6,
    reviewsCount: 38,
    isPopular: false
  },
  {
    id: 'toilet',
    categoryId: 'plumbing',
    name: 'Установка унитаза',
    description: 'Монтаж нового унитаза с подключением к канализации и водопроводу.',
    price: 3000,
    rating: 4.8,
    reviewsCount: 29,
    isPopular: false
  },
  {
    id: 'wiring',
    categoryId: 'electrical',
    name: 'Монтаж проводки',
    description: 'Качественная безопасная разводка силовых кабелей по помещениям.',
    price: 5000,
    rating: 4.9,
    reviewsCount: 67,
    isPopular: false
  },
  {
    id: 'sockets',
    categoryId: 'electrical',
    name: 'Установка розеток и выключателей',
    description: 'Включает штробление стен, монтаж подрозетников и установку механизмов.',
    price: 800,
    rating: 4.7,
    reviewsCount: 41,
    isPopular: false
  },
  {
    id: 'lighting',
    categoryId: 'electrical',
    name: 'Подключение люстры',
    description: 'Надежная сборка, монтаж на потолок и безопасное подключение люстры.',
    price: 1000,
    rating: 4.8,
    reviewsCount: 54,
    isPopular: false
  },
  {
    id: 'office-clean',
    categoryId: 'cleaning',
    name: 'Уборка офиса',
    description: 'Профессиональная чистка рабочих мест, санузлов и коридоров.',
    price: 2500,
    rating: 4.5,
    reviewsCount: 19,
    isPopular: false
  },
  {
    id: 'pc-fix',
    categoryId: 'computer',
    name: 'Настройка ПК',
    description: 'Удаление вирусов, установка ОС, драйверов и прикладного софта.',
    price: 800,
    rating: 4.8,
    reviewsCount: 76,
    isPopular: false
  },
  {
    id: 'loaders-service',
    categoryId: 'loaders',
    name: 'Услуги бригады грузчиков',
    description: 'Переноска тяжестей, погрузка в машину, подъем крупногабаритных вещей на этаж.',
    price: 1800,
    rating: 4.6,
    reviewsCount: 81,
    isPopular: false
  }
];

export const INITIAL_MASTERS: Master[] = [
  {
    id: 'm1',
    fullName: 'Алексей Морозов',
    phone: '+7 (926) 111-22-33',
    telegram: 'alex_mor',
    rating: 4.8,
    serviceIds: ['faucet', 'pipes', 'toilet', 'sockets', 'lighting'],
    districtIds: ['central', 'kuznetsky', 'zavodskoy'],
    status: 'active'
  },
  {
    id: 'm2',
    fullName: 'Марина Клименко',
    phone: '+7 (950) 444-55-66',
    telegram: 'marina_clean',
    rating: 4.9,
    serviceIds: ['general-clean', 'office-clean'],
    districtIds: ['central', 'ilyinsky', 'kuybyshevsky'],
    status: 'active'
  },
  {
    id: 'm3',
    fullName: 'Иван Ковальчук',
    phone: '+7 (900) 888-99-00',
    telegram: 'ivan_dev',
    rating: 5.0,
    serviceIds: ['website', 'pc-fix'],
    districtIds: ['central', 'ordzhonikidzevsky'],
    status: 'active'
  },
  {
    id: 'm4',
    fullName: 'Сергей Баранов',
    phone: '+7 (913) 222-33-44',
    telegram: 'sergey_mebel',
    rating: 4.7,
    serviceIds: ['furniture-assemble'],
    districtIds: ['zavodskoy', 'kuybyshevsky'],
    status: 'active'
  }
];

// Seed two default orders as in the screen mockup
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-084',
    clientName: 'Иван Петров',
    clientPhone: '+7 (999) 123-45-67',
    clientAddress: 'ул. Ленина, д. 45, кв. 12',
    clientTelegram: 'petrov_ivan',
    status: 'new',
    createdAt: '2026-05-29T10:30:00Z',
    serviceIds: ['faucet', 'faucet'], // Repetitive count: Ремонт сантехники (2x)
    totalCost: 3000,
    assignedMasterId: null
  },
  {
    id: 'ORD-083',
    clientName: 'Анна Смирнова',
    clientPhone: '+7 (900) 987-65-43',
    clientAddress: 'пр. Мира, д. 120, оф. 405',
    clientTelegram: 'smirnova_a',
    status: 'in_progress',
    createdAt: '2026-05-29T08:15:00Z',
    serviceIds: ['office-clean'], // Уборка офиса (1x)
    totalCost: 2500,
    assignedMasterId: 'm2' // assigned to Marina Klimenko
  }
];

export const FAQ_ITEMS = [
  {
    question: 'Как оплатить услугу?',
    answer: 'Вы можете оплатить услугу наличными мастеру после завершения работ или переводом по СБП. В админ-панели скоро появится опция безопасной онлайн-оплаты.'
  },
  {
    question: 'Что делать, если мастер не приехал?',
    answer: 'Свяжитесь со службой поддержки Delo Tut по телефону или в Telegram. Мы оперативно подберем другого специалиста или выясним причину задержки.'
  },
  {
    question: 'Даете ли вы гарантию на работы?',
    answer: 'Все наши мастера проходят строгую верификацию документов. На сантехнические и электромонтажные работы распространяется гарантия платформы сроком до 1 года.'
  }
];
