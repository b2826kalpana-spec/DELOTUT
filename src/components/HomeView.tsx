/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Zap,
  Droplets,
  Truck,
  Sparkles,
  FileText,
  Armchair,
  Laptop,
  Hammer,
  Check,
  Star,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Headphones,
  Coins,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react';
import { Category, Service } from '../types';
import { FAQ_ITEMS } from '../data';

interface HomeViewProps {
  categories: Category[];
  services: Service[];
  onAddToCart: (service: Service) => void;
  setView: (view: 'home' | 'register-master' | 'admin') => void;
  cart: { service: Service; quantity: number }[];
}

export default function HomeView({
  categories,
  services,
  onAddToCart,
  setView,
  cart,
}: HomeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({});
  const [promoClaimed, setPromoClaimed] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState<{ [key: string]: boolean }>({});

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getCategoryIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5" />;
      case 'Truck':
        return <Truck className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'FileText':
        return <FileText className="w-5 h-5" />;
      case 'Armchair':
        return <Armchair className="w-5 h-5" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5" />;
      default:
        return <HardwareIcon />;
    }
  };

  // Falling-back generic icon
  const HardwareIcon = () => <Hammer className="w-5 h-5" />;

  // Filter services by category pill OR search query
  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory ? service.categoryId === selectedCategory : true;
    const matchesSearch = searchQuery
      ? service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  const handleAddToCartWithAnim = (service: Service) => {
    onAddToCart(service);
    setAddedAnimation((prev) => ({ ...prev, [service.id]: true }));
    setTimeout(() => {
      setAddedAnimation((prev) => ({ ...prev, [service.id]: false }));
    }, 2000);
  };

  return (
    <div className="flex-grow bg-slate-50/70 pb-16">
      {/* 1. Hero Search Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 py-12 md:py-20 px-4">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-blue-50/50 rounded-full blur-2xl -z-10"></div>

        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Бытовые услуги в <span className="text-blue-700">Новокузнецке</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed">
            Находите надежных специалистов для любых задач. От мелкого точечного ремонта до комплексного клининга жилых и офисных помещений.
          </p>

          {/* Core Search input card */}
          <div className="w-full max-w-xl mt-8 p-1.5 bg-white rounded-xl shadow-md border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all flex items-center">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder="Какая услуга вам нужна? Например: смеситель, уборка"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-transparent text-slate-800 placeholder:text-slate-300 focus:outline-none text-sm md:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 font-medium"
              >
                Очистить
              </button>
            )}
            <button
              onClick={() => setSelectedCategory(null)}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors shrink-0"
            >
              Найти
            </button>
          </div>

          {/* Quick link actions */}
          <div className="flex flex-wrap gap-2.5 justify-center mt-6">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className="text-xs font-semibold px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 bg-white"
            >
              🗂️ Все услуги
            </button>
            <button
              onClick={() => setView('register-master')}
              className="text-xs font-semibold px-4 py-2 rounded-full border border-blue-100 text-blue-700 hover:bg-blue-50/50 bg-white"
            >
              ✨ Стать мастером
            </button>
          </div>
        </div>
      </section>

      {/* 2. Horizontal Category Pills Selector */}
      <section className="py-4 bg-white border-b border-slate-100 sticky top-[65px] z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto flex gap-2 scrollbar-none pb-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === null
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Все категории
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* 3. Promo Banner section */}
        <section className="mb-12">
          <div className="bg-indigo-900 rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-800 rounded-full opacity-60"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-850 rounded-full opacity-60"></div>

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-800/80 rounded-xl flex items-center justify-center text-white font-bold text-lg border border-indigo-700">
                %
              </div>
              <div className="max-w-2xl">
                <h3 className="text-lg font-bold text-white">Индивидуальная скидка на строительные материалы</h3>
                <p className="text-slate-300 text-xs md:text-sm mt-1">
                  Через наших проверенных партнеров вы получаете специальные условия закупки и максимальные скидки на любые стройматериалы в Новокузнецке при заказе услуг на платформе.
                </p>
              </div>
            </div>
            <div className="relative z-10 shrink-0 text-left md:text-right">
              <span className="inline-block bg-amber-500 text-slate-950 text-xs font-extrabold px-4.5 py-2 rounded-lg shadow-sm uppercase tracking-wider">
                Скидки у партнеров
              </span>
              <p className="text-[10px] text-indigo-300 mt-2 font-mono">
                * Не является публичной офертой.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Grid of 8 Core Category Cards (Matches exact design representation) */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>Категории услуг</span>
            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-normal">
              {categories.length} разделов
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  className={`p-5 rounded-xl border text-left flex flex-col items-start gap-4 transition-all focus:outline-none focus:ring-2 focus:ring-blue-200 select-none bg-white ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-500/10 bg-blue-50/30'
                      : 'border-slate-200/60 hover:border-blue-300 hover:shadow-xs'
                  }`}
                >
                  <div className={`p-3 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-blue-50 text-blue-800'
                  }`}>
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-950 text-sm md:text-base leading-snug">{cat.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Перейти к списку</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. Service Catalog of popular services */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Популярные услуги</h2>
              <p className="text-slate-400 text-xs mt-1">Отобрано на основе предпочтений жителей города Новокузнецк</p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Показать все
              </button>
            )}
          </div>

          {filteredServices.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center flex flex-col items-center">
              <Sparkles className="w-8 h-8 text-slate-300 mb-3" />
              <h4 className="text-base font-semibold text-slate-800">Услуги не найдены</h4>
              <p className="text-sm text-slate-400 mt-1 max-w-sm">
                Попробуйте сбросить фильтрацию по категориям или изменить поисковый запрос.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg text-xs hover:bg-blue-100 transition-colors"
              >
                Сбросить поиск
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              {filteredServices.map((service) => {
                const isItemInCart = cart.some((item) => item.service.id === service.id);
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl border border-slate-200/60 shadow-xs hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden relative group"
                    id={`service-card-${service.id}`}
                  >
                    <div className="h-40 bg-slate-100 relative overflow-hidden">
                      {service.imageUrl ? (
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-800">
                          {getCategoryIcon(categories.find((c) => c.id === service.categoryId)?.icon)}
                        </div>
                      )}
                      <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs rounded-full p-1.5 shadow-xs">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      </div>
                    </div>

                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                            {categories.find((c) => c.id === service.categoryId)?.name || 'Услуга'}
                          </span>
                          <div className="flex items-center gap-0.5 text-xs font-semibold text-slate-500">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>{service.rating || '4.8'}</span>
                            <span className="text-slate-300 font-normal">({service.reviewsCount || '15'})</span>
                          </div>
                        </div>

                        <h3 className="font-bold text-slate-950 text-sm md:text-base leading-snug tracking-tight">
                          {service.name}
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-500 leading-normal line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[11px] text-slate-400 font-normal">от</span>
                          <span className="font-bold text-base md:text-lg text-slate-900 tracking-tight">
                            {service.price} ₽
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCartWithAnim(service)}
                          className={`px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 shrink-0 ${
                            addedAnimation[service.id]
                              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                              : isItemInCart
                              ? 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                              : 'bg-blue-700 text-white hover:bg-blue-850'
                          }`}
                        >
                          {addedAnimation[service.id] ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Добавлено
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              В корзину
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 6. How it works section */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-8">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 text-center flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-50 text-blue-800 font-extrabold text-base rounded-full flex items-center justify-center shadow-xs">
                1
              </div>
              <h3 className="font-bold text-sm md:text-base mt-4 text-slate-900">Выберите услугу</h3>
              <p className="mt-2 text-xs md:text-sm text-slate-400 leading-relaxed max-w-xs">
                Найдите нужную категорию в каталоге или воспользуйтесь интеллектуальным поиском.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 text-center flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-50 text-blue-800 font-extrabold text-base rounded-full flex items-center justify-center shadow-xs">
                2
              </div>
              <h3 className="font-bold text-sm md:text-base mt-4 text-slate-900">Оформите заявку</h3>
              <p className="mt-2 text-xs md:text-sm text-slate-400 leading-relaxed max-w-xs">
                Опишите задачу, укажите удобное время и адрес, заполните контактные данные в корзине.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/50 text-center flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-50 text-blue-800 font-extrabold text-base rounded-full flex items-center justify-center shadow-xs">
                3
              </div>
              <h3 className="font-bold text-sm md:text-base mt-4 text-slate-900">Встречайте мастера</h3>
              <p className="mt-2 text-xs md:text-sm text-slate-400 leading-relaxed max-w-xs">
                Квалифицированный специалист приедет в назначенное время и аккуратно выполнит работу.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Why choose us safety section */}
        <section className="mb-16 py-10 bg-slate-100/50 rounded-2xl px-6 border border-slate-200/40">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-8">Почему через платформу безопаснее</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-white text-blue-700 rounded-full shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mt-4 text-sm md:text-base">Проверенные мастера</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed max-w-xs">
                Исполнители при регистрации проходят верификацию по документам, мы отслеживаем отзывы и строим честный рейтинг.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-white text-blue-700 rounded-full shadow-xs">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mt-4 text-sm md:text-base">Служба поддержки</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed max-w-xs">
                Мы на связи 7 дней в неделю, контролируем качество каждого заказа и помогаем решать спорные ситуации.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-3 bg-white text-blue-700 rounded-full shadow-xs">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 mt-4 text-sm md:text-base">Фиксированные цены</h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed max-w-xs">
                Цены понятны и прозрачны. Конечная стоимость оговаривается и утверждается до непосредственного старта работ.
              </p>
            </div>
          </div>
        </section>

        {/* 8. Bottom Master CTA (Glassmorphism look) */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-1/2 -right-24 w-60 h-60 bg-blue-700 rounded-full mix-blend-screen filter blur-3xl opacity-20 -z-10"></div>
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-700 rounded-full mix-blend-screen filter blur-3xl opacity-20 -z-10"></div>

            <div className="relative z-10 max-w-lg text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Зарабатывайте вместе с нами</h2>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Вы специалист в ремонте, уборке, IT или сборке мебели? Заполните профиль и получайте стабильный поток реальных заказов уже с сегодняшнего дня!
              </p>
            </div>
            <button
              onClick={() => setView('register-master')}
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-md shrink-0 block mx-auto cursor-pointer"
            >
              Стать мастером
            </button>
          </div>
        </section>

        {/* 9. Collapsible FAQ Section */}
        <section className="bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-8">Частые вопросы</h2>
          <div className="divide-y divide-slate-100 max-w-4xl mx-auto">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = !!faqOpen[index];
              return (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left text-sm md:text-base font-semibold text-slate-800 hover:text-blue-700 focus:outline-none py-1 transition-colors"
                  >
                    <span>{item.question}</span>
                    <span className="p-1 rounded-full bg-slate-50 text-slate-500 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  <div
                    className={`mt-2 text-xs md:text-sm text-slate-500 leading-relaxed overflow-hidden transition-all duration-350 ${
                      isOpen ? 'max-h-40 opacity-100 pb-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
