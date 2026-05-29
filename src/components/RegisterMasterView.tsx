/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Award, Users, Wallet, CheckSquare, Square, ThumbsUp } from 'lucide-react';
import { Category, District, Service } from '../types';

interface RegisterMasterViewProps {
  categories: Category[];
  districts: District[];
  services: Service[];
  onRegisterMaster: (masterInfo: {
    fullName: string;
    phone: string;
    telegram: string;
    selectedServiceIds: string[];
    selectedDistrictIds: string[];
  }) => void;
  setView: (view: 'home' | 'register-master' | 'admin') => void;
}

export default function RegisterMasterView({
  categories,
  districts,
  services,
  onRegisterMaster,
  setView,
}: RegisterMasterViewProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleDistrict = (id: string) => {
    setSelectedDistricts((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const toggleCategory = (id: string) => {
    const isCurrentlySelected = selectedCategories.includes(id);
    let nextCategories = [];

    if (isCurrentlySelected) {
      nextCategories = selectedCategories.filter((c) => c !== id);
      // Remove any services belonging to the deselected category
      const servicesInDeCat = services.filter((s) => s.categoryId === id).map((s) => s.id);
      setSelectedServices((prev) => prev.filter((sId) => !servicesInDeCat.includes(sId)));
    } else {
      nextCategories = [...selectedCategories, id];
    }
    setSelectedCategories(nextCategories);
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSelectAllServices = (categoryId: string) => {
    const catServiceIds = services.filter((s) => s.categoryId === categoryId).map((s) => s.id);
    const allAreSelected = catServiceIds.every((sId) => selectedServices.includes(sId));

    if (allAreSelected) {
      // Deselect all
      setSelectedServices((prev) => prev.filter((sId) => !catServiceIds.includes(sId)));
    } else {
      // Select all for this category
      setSelectedServices((prev) => {
        const uniqueIds = new Set([...prev, ...catServiceIds]);
        return Array.from(uniqueIds);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !telegram) {
      alert('Пожалуйста, заполните основные поля: ФИО, телефон и Telegram');
      return;
    }
    if (selectedDistricts.length === 0) {
      alert('Пожалуйста, выберите хотя бы один район обслуживания');
      return;
    }
    if (selectedServices.length === 0) {
      alert('Пожалуйста, выберите хотя бы одну услугу в качестве вашей специализации');
      return;
    }
    if (!consent) {
      alert('Необходимо принять условия пользовательского соглашения');
      return;
    }

    onRegisterMaster({
      fullName,
      phone,
      telegram,
      selectedServiceIds: selectedServices,
      selectedDistrictIds: selectedDistricts,
    });

    setSuccess(true);
  };

  const resetFormAndGo = (view: 'home' | 'admin') => {
    setFullName('');
    setPhone('');
    setTelegram('');
    setSelectedDistricts([]);
    setSelectedCategories([]);
    setSelectedServices([]);
    setConsent(false);
    setSuccess(false);
    setView(view);
  };

  return (
    <div className="flex-grow bg-slate-50/70 py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {success ? (
          /* Success onboarding card */
          <div className="bg-white rounded-3xl border border-slate-200/50 shadow-xl p-8 md:p-12 text-center flex flex-col items-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              Заявка успешно принята! 🎉
            </h2>
            <p className="mt-4 text-sm md:text-base text-slate-500 max-w-lg leading-relaxed">
              Приветствуем в команде профессионалов <strong>Delo Tut</strong>, {fullName}! Ваша анкета сохранена. Вы успешно прошли предварительную верификацию.
            </p>

            <div className="bg-slate-50 rounded-2xl border border-slate-200/40 p-5 mt-8 w-full max-w-md text-left text-sm text-slate-600 space-y-2.5">
              <p>📍 <strong>Районы обслуживания:</strong> {selectedDistricts.map(id => districts.find(d => d.id === id)?.name).join(', ')}</p>
              <p>🛠️ <strong>Выбрано видов работ:</strong> {selectedServices.length} услуг(-и)</p>
              <p>📞 <strong>Контактный номер:</strong> {phone}</p>
              <p>✈️ <strong>Telegram для заказов:</strong> @{telegram}</p>
            </div>

            <p className="text-xs text-slate-400 mt-6 max-w-md">
              Теперь вы можете открыть Панель управления и назначать себя на новые активные заказы. Заказы со статусом «Новый» уже доступны для выполнения!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-md justify-center">
              <button
                onClick={() => resetFormAndGo('home')}
                className="px-6 py-3 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all"
              >
                Вернуться на главную
              </button>
              <button
                onClick={() => resetFormAndGo('admin')}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Проверить панель заказов
              </button>
            </div>
          </div>
        ) : (
          /* Normal form logic */
          <div>
            {/* Value proposition badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white px-5 py-4 rounded-xl border border-slate-200/70 shadow-xs flex items-center gap-3">
                <div className="p-2.5 bg-green-50 text-green-700 rounded-lg">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Высокий доход</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Вся прибыль напрямую вам</p>
                </div>
              </div>
              <div className="bg-white px-5 py-4 rounded-xl border border-slate-200/70 shadow-xs flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Постоянные клиенты</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Личный поток заказов ежедневно</p>
                </div>
              </div>
              <div className="bg-white px-5 py-4 rounded-xl border border-slate-200/70 shadow-xs flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-purple-700 rounded-lg">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight">Свободный график</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Выбирайте заказы когда удобно</p>
                </div>
              </div>
            </div>

            {/* Registration Card Layout */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-800 to-indigo-900 p-6 md:p-8 text-white relative">
                <div className="absolute top-4 right-4 bg-white/10 text-white/90 text-[10px] font-mono tracking-wider font-bold py-1 px-2.5 rounded-full border border-white/15">
                  РЕГИСТРАЦИЯ ИСПОЛНИТЕЛЯ
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold">Стать мастером Delo Tut</h1>
                <p className="text-slate-200 text-xs md:text-sm mt-1.5 max-w-xl">
                  Зарабатывайте стабильно, выполняя бытовые заказы. Укажите районы обслуживания, ваши основные компетенции и виды выполняемых работ.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                {/* Section 1: Контактные данные */}
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-xs">1</span>
                    <span>Контактные данные</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label htmlFor="fullname" className="block text-xs font-semibold text-slate-700">ФИО *</label>
                      <input
                        required
                        type="text"
                        id="fullname"
                        placeholder="Алексей Морозов"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-300 focus:border-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-slate-700">Телефон *</label>
                      <input
                        required
                        type="tel"
                        id="phone"
                        placeholder="+7 (926) 111-22-33"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1.5 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-300 focus:border-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="telegram" className="block text-xs font-semibold text-slate-700">Telegram Username *</label>
                      <div className="relative mt-1.5">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 text-sm">@</span>
                        <input
                          required
                          type="text"
                          id="telegram"
                          placeholder="alex_mor"
                          value={telegram}
                          onChange={(e) => setTelegram(e.target.value)}
                          className="block w-full rounded-lg border border-slate-200 pl-8 pr-3 py-2 text-sm placeholder:text-slate-300 focus:border-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: География */}
                <div className="border-t border-slate-100 pt-6">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-xs">2</span>
                    <span>Районы работы *</span>
                  </h2>
                  <p className="text-xs text-slate-400 mb-4 font-normal">Укажите один или несколько районов, в которых вы готовы выезжать на заказы.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {districts.map((d) => {
                      const isSelected = selectedDistricts.includes(d.id);
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => toggleDistrict(d.id)}
                          className={`p-3 rounded-lg border text-left text-xs font-medium flex items-center gap-2.5 transition-all focus:outline-none ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/40 text-blue-900 font-semibold'
                              : 'border-slate-200 bg-slate-50/40 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300 shrink-0" />
                          )}
                          <span>{d.name.includes('район') || d.name.includes('уточнить') || d.name === 'Абашево' || d.name === 'Байдаевка' || d.name === 'Редаково' || d.name === 'Ильинка' || d.name === 'Запсиб' ? d.name : `${d.name} район`}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 3: Специализация и Услуги */}
                <div className="border-t border-slate-100 pt-6">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-xs">3</span>
                    <span>Специализация и услуги *</span>
                  </h2>
                  <p className="text-xs text-slate-400 mb-4 font-normal">Выберите категории квалификации, чтобы развернуть и отметить конкретные услуги, которые вы умеете выполнять.</p>

                  {/* Category toggles */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((cat) => {
                      const isSelected = selectedCategories.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCategory(cat.id)}
                          className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all focus:outline-none ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic sub-services list */}
                  {selectedCategories.length === 0 ? (
                    <div className="p-6 rounded-xl bg-slate-50 text-center border border-dashed border-slate-200 flex flex-col items-center">
                      <ShieldAlert className="w-7 h-7 text-slate-400 mb-2" />
                      <p className="text-xs text-slate-400 max-w-xs font-medium">
                        Пожалуйста, сначала кликните на категории выше, чтобы отметить конкретные типы выполняемых вами услуг.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedCategories.map((catId) => {
                        const cat = categories.find((c) => c.id === catId);
                        const catServices = services.filter((s) => s.categoryId === catId);
                        const allSelected = catServices.every((s) => selectedServices.includes(s.id));

                        return (
                          <div key={catId} className="bg-slate-50/50 rounded-xl p-4 border border-slate-200/50">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="font-bold text-xs md:text-sm text-blue-900 uppercase tracking-tight">
                                {cat?.name}
                              </h3>
                              <button
                                type="button"
                                onClick={() => handleSelectAllServices(catId)}
                                className="text-[10px] font-semibold text-blue-700 hover:underline px-2 py-0.5"
                              >
                                {allSelected ? 'Снять все' : 'Выбрать все'}
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {catServices.map((s) => {
                                const isChecked = selectedServices.includes(s.id);
                                return (
                                  <label
                                    key={s.id}
                                    className={`p-3 rounded-lg border bg-white cursor-pointer select-none flex items-start gap-2.5 transition-all hover:bg-slate-50 ${
                                      isChecked ? 'border-blue-500 ring-1 ring-blue-500/10' : 'border-slate-200/70'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleService(s.id)}
                                      className="sr-only"
                                    />
                                    <div className="pt-0.5 shrink-0">
                                      {isChecked ? (
                                        <CheckSquare className="w-4 h-4 text-blue-600" />
                                      ) : (
                                        <Square className="w-4 h-4 text-slate-300" />
                                      )}
                                    </div>
                                    <div>
                                      <span className="text-xs font-semibold text-slate-900 block leading-tight">
                                        {s.name}
                                      </span>
                                      <span className="text-[10px] text-slate-400 block mt-0.5 leading-snug">
                                        {s.description} • от {s.price} ₽
                                      </span>
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Section 4: Согласие и Отправка */}
                <div className="border-t border-slate-150 pt-6 space-y-4">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      required
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="sr-only"
                    />
                    <div className="pt-0.5 shrink-0">
                      {consent ? (
                        <CheckSquare className="w-4.5 h-4.5 text-blue-600" />
                      ) : (
                        <Square className="w-4.5 h-4.5 text-slate-300" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500 leading-normal">
                      Я подтверждаю, что указал достоверную личную информацию и соглашаюсь на обработку моих персональных данных платформой Delo Tut в соответствии с <span className="text-blue-700 hover:underline">правилами сервиса</span>.
                    </span>
                  </label>

                  <div className="flex md:justify-end">
                    <button
                      type="submit"
                      className="w-full md:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm px-10 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Отправить анкету мастера
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
