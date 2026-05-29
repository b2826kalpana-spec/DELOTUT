/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, User, Bell, Shield, Layers, HelpCircle, X, Trash2, CheckCircle } from 'lucide-react';
import { Service } from '../types';

const DISTRICTS = [
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

interface HeaderProps {
  currentView: 'home' | 'register-master' | 'admin';
  setView: (view: 'home' | 'register-master' | 'admin') => void;
  cart: { service: Service; quantity: number }[];
  clearCart: () => void;
  removeFromCart: (serviceId: string) => void;
  updateQuantity: (serviceId: string, delta: number) => void;
  onSubmitOrder: (clientInfo: { name: string; phone: string; address: string; telegram: string; district: string }) => void;
}

export default function Header({
  currentView,
  setView,
  cart,
  clearCart,
  removeFromCart,
  updateQuantity,
  onSubmitOrder,
}: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('central');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [apartment, setApartment] = useState('');
  const [entrance, setEntrance] = useState('');
  const [floor, setFloor] = useState('');
  const [intercom, setIntercom] = useState('');
  const [comment, setComment] = useState('');
  const [telegram, setTelegram] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.service.price * item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !street || !building) {
      alert('Пожалуйста, заполните обязательные ФИО, Телефон, Улицу и Дом');
      return;
    }

    const districtObj = DISTRICTS.find(d => d.id === selectedDistrict);
    const districtLabel = districtObj ? districtObj.name : 'Центральный';

    // Construct full address struct
    const addressParts = [
      `Район: ${districtLabel}`,
      `ул. ${street}`,
      `д. ${building}`,
      apartment ? `кв. ${apartment}` : '',
      entrance ? `подъезд ${entrance}` : '',
      floor ? `этаж ${floor}` : '',
      intercom ? `код ${intercom}` : '',
      comment ? `комм: ${comment}` : '',
    ].filter(Boolean);

    const fullAddress = addressParts.join(', ');

    onSubmitOrder({ name, phone, address: fullAddress, telegram, district: selectedDistrict });
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setIsCartOpen(false);
      clearCart();
      setName('');
      setPhone('');
      setStreet('');
      setBuilding('');
      setApartment('');
      setEntrance('');
      setFloor('');
      setIntercom('');
      setComment('');
      setTelegram('');
    }, 2500);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand logo */}
        <button
          onClick={() => setView('home')}
          className="flex items-center gap-2 text-left focus:outline-none group"
          id="btn-brand-home"
        >
          <div className="p-2 bg-blue-50 text-blue-800 rounded-lg group-hover:bg-blue-100 transition-colors">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold text-blue-900 tracking-tight block">Delo Tut</span>
            <span className="text-[10px] text-gray-400 block -mt-1 font-mono uppercase tracking-widest">Новокузнецк</span>
          </div>
        </button>

        {/* Navigation buttons */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setView('home')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              currentView === 'home'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Каталог услуг
          </button>
          <button
            onClick={() => setView('register-master')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              currentView === 'register-master'
                ? 'bg-blue-50 text-blue-700 font-bold border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Стать мастером
          </button>
          <button
            onClick={() => setView('admin')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              currentView === 'admin'
                ? 'bg-purple-50 text-purple-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Shield className="w-4 h-4 text-purple-600" />
            Админ Панель
          </button>
        </nav>

        {/* Action icons / Mobile buttons */}
        <div className="flex items-center gap-2">
          {/* Quick Admin view shortcut icon */}
          <button
            onClick={() => setView('admin')}
            className={`p-2 rounded-full md:hidden hover:bg-gray-100 relative ${
              currentView === 'admin' ? 'text-purple-600 bg-purple-50' : 'text-gray-500'
            }`}
            title="Админ Панель"
            id="btn-nav-admin-mobile"
          >
            <Shield className="w-5 h-5" />
          </button>

          {/* Become a master shortcut for mobile */}
          <button
            onClick={() => setView('register-master')}
            className="p-2 rounded-full md:hidden hover:bg-gray-100 text-gray-500"
            title="Стать мастером"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Shopping cart widget */}
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors focus:ring-2 focus:ring-blue-100 focus:outline-none"
            title="Корзина заказов"
            id="btn-cart-toggle"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Decorative notifications button */}
          <button
            onClick={() => alert('Нет новых уведомлений')}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Background overlay */}
            <div
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-gray-500/75 backdrop-blur-xs transition-opacity"
            ></div>

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between border-b border-gray-100 pb-5">
                      <h2 className="text-lg font-bold text-gray-900" id="slide-over-title">Выбранные услуги</h2>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {orderSuccess ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle className="w-16 h-16 text-emerald-500 mb-4 animate-scale" />
                        <h3 className="text-xl font-bold text-gray-900">Заказ успешно создан!</h3>
                        <p className="mt-2 text-sm text-gray-500 max-w-xs">
                          Вы можете отслеживать статус заказа #ORD-{Math.floor(Math.random() * 900 + 100)} в Панели управления. Наш менеджер скоро свяжется с вами!
                        </p>
                      </div>
                    ) : cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <ShoppingCart className="w-12 h-12 text-gray-300 mb-3" />
                        <h3 className="text-md font-medium text-gray-900">Ваша корзина пуста</h3>
                        <p className="mt-1 text-sm text-gray-400 max-w-xs">
                          Выберите необходимые услуги в каталоге, и они отобразятся здесь для быстрого оформления заказа.
                        </p>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Перейти к каталогу
                        </button>
                      </div>
                    ) : (
                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-100">
                            {cart.map((item) => (
                              <li key={item.service.id} className="flex py-6">
                                <div className="h-20 w-24 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50 flex items-center justify-center">
                                  {item.service.imageUrl ? (
                                    <img
                                      src={item.service.imageUrl}
                                      alt={item.service.name}
                                      className="size-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="text-blue-500 bg-blue-50 p-2 rounded-full font-mono font-bold text-xs">
                                      Услуга
                                    </div>
                                  )}
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-semibold text-gray-900">
                                      <h3 className="line-clamp-1">{item.service.name}</h3>
                                      <p className="ml-4 tabular-nums text-blue-900">
                                        {item.service.price * item.quantity} ₽
                                      </p>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                                      {item.service.description}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center border border-gray-200 rounded-md">
                                      <button
                                        onClick={() => updateQuantity(item.service.id, -1)}
                                        className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                                      >
                                        -
                                      </button>
                                      <span className="px-3 min-w-[24px] text-center font-mono font-bold text-gray-800">
                                        {item.quantity}
                                      </span>
                                      <button
                                        onClick={() => updateQuantity(item.service.id, 1)}
                                        className="px-2 py-1 text-gray-500 hover:bg-gray-50"
                                      >
                                        +
                                      </button>
                                    </div>

                                    <button
                                      onClick={() => removeFromCart(item.service.id)}
                                      type="button"
                                      className="font-medium text-red-600 hover:text-red-500 flex items-center gap-0.5 text-xs bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Удалить
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Customer Information Form */}
                        <form onSubmit={handleCheckout} className="mt-8 border-t border-gray-100 pt-6">
                          <h3 className="text-sm font-semibold text-gray-900 mb-4">Данные для вызова мастера</h3>
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="client-name" className="block text-xs font-medium text-gray-700">ФИО *</label>
                              <input
                                required
                                type="text"
                                id="client-name"
                                placeholder="Иван Петров"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-300 focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white text-gray-900"
                              />
                            </div>
                            <div>
                              <label htmlFor="client-phone" className="block text-xs font-medium text-gray-700">Телефон *</label>
                              <input
                                required
                                type="tel"
                                id="client-phone"
                                placeholder="+7 (999) 123-45-67"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-300 focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white text-gray-900"
                              />
                            </div>
                            
                            {/* Structured Address Block */}
                            <div>
                              <label htmlFor="client-district" className="block text-xs font-medium text-gray-700">Район Новокузнецка *</label>
                              <select
                                id="client-district"
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white text-gray-900"
                              >
                                {DISTRICTS.map((dst) => (
                                  <option key={dst.id} value={dst.id}>
                                    {dst.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label htmlFor="client-street" className="block text-xs font-medium text-gray-700">Улица *</label>
                                <input
                                  required
                                  type="text"
                                  id="client-street"
                                  placeholder="Ленина"
                                  value={street}
                                  onChange={(e) => setStreet(e.target.value)}
                                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-300 focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white text-gray-900"
                                />
                              </div>
                              <div>
                                <label htmlFor="client-building" className="block text-xs font-medium text-gray-700">Дом *</label>
                                <input
                                  required
                                  type="text"
                                  id="client-building"
                                  placeholder="45"
                                  value={building}
                                  onChange={(e) => setBuilding(e.target.value)}
                                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-300 focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white text-gray-900"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label htmlFor="client-apt" className="block text-xs font-medium text-gray-700">Кв.</label>
                                <input
                                  type="text"
                                  id="client-apt"
                                  placeholder="12"
                                  value={apartment}
                                  onChange={(e) => setApartment(e.target.value)}
                                  className="mt-1 block w-full rounded-md border border-gray-200 px-2 py-2 text-sm placeholder:text-gray-300 focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white text-gray-900"
                                />
                              </div>
                              <div>
                                <label htmlFor="client-ent" className="block text-xs font-medium text-gray-700">Подъезд</label>
                                <input
                                  type="text"
                                  id="client-ent"
                                  placeholder="2"
                                  value={entrance}
                                  onChange={(e) => setEntrance(e.target.value)}
                                  className="mt-1 block w-full rounded-md border border-gray-200 px-2 py-2 text-sm placeholder:text-gray-300 focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white text-gray-900"
                                />
                              </div>
                              <div>
                                <label htmlFor="client-floor" className="block text-xs font-medium text-gray-700">Этаж</label>
                                <input
                                  type="text"
                                  id="client-floor"
                                  placeholder="4"
                                  value={floor}
                                  onChange={(e) => setFloor(e.target.value)}
                                  className="mt-1 block w-full rounded-md border border-gray-200 px-2 py-2 text-sm placeholder:text-gray-300 focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white text-gray-900"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label htmlFor="client-intercom" className="block text-xs font-medium text-gray-700">Домофон/Код</label>
                                <input
                                  type="text"
                                  id="client-intercom"
                                  placeholder="#456"
                                  value={intercom}
                                  onChange={(e) => setIntercom(e.target.value)}
                                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-300 focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white text-gray-900"
                                />
                              </div>
                              <div>
                                <label htmlFor="client-tg" className="block text-xs font-medium text-gray-700">Ник Telegram</label>
                                <div className="relative mt-1">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-sm">@</span>
                                  <input
                                    type="text"
                                    id="client-tg"
                                    placeholder="username"
                                    value={telegram}
                                    onChange={(e) => setTelegram(e.target.value)}
                                    className="block w-full rounded-md border border-gray-200 pl-8 pr-3 py-2 text-sm placeholder:text-gray-300 focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white text-gray-900"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label htmlFor="client-comment" className="block text-xs font-medium text-gray-700">Комментарий диспетчеру</label>
                              <textarea
                                id="client-comment"
                                rows={2}
                                placeholder="Например: Люстра тяжелая, нужен высокий уровень стремянки..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-300 focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white text-gray-900 resize-none font-sans"
                              />
                            </div>
                          </div>

                          <div className="mt-6 border-t border-gray-100 pt-5">
                            <div className="flex justify-between text-base font-bold text-gray-900 mb-4">
                              <span>Итого к оплате:</span>
                              <span className="text-blue-900 font-mono tabular-nums">{cartTotal} ₽</span>
                            </div>
                            <button
                              type="submit"
                              className="w-full justify-center rounded-xl bg-blue-700 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                              Оформить вызов мастера
                            </button>
                            <p className="mt-2.5 text-[10px] text-center text-gray-400">
                              Оплата производится наличными или переводом непосредственно мастеру после успешного оказания услуги.
                            </p>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
