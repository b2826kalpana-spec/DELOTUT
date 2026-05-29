/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, Phone, Send, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  setView: (view: 'home' | 'register-master' | 'admin') => void;
}

export default function Footer({ setView }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: Brand details */}
          <div className="space-y-4">
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 text-left focus:outline-none group"
            >
              <div className="p-2 bg-blue-600 rounded-lg text-white font-black">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight block">Delo Tut</span>
                <span className="text-[9px] text-blue-400 font-mono tracking-widest block uppercase">Новокузнецк</span>
              </div>
            </button>
            <p className="text-xs text-slate-400 leading-relaxed">
              Платформа бытовых услуг для поиска проверенных мастеров в городе Новокузнецк. Сервис мелкого бытового ремонта, сантехники, электрики и клининга.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="p-1.5 bg-blue-600/10 text-blue-400 rounded-full">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-slate-350">Безопасность подтверждена</span>
            </div>
          </div>

          {/* Column 2: Quick navigation */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Навигация</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => setView('home')} className="hover:text-white transition-colors">
                  Каталог бытовых услуг
                </button>
              </li>
              <li>
                <button onClick={() => setView('register-master')} className="hover:text-white transition-colors font-semibold text-blue-400">
                  Стать исполнителем (мастером)
                </button>
              </li>
              <li>
                <button onClick={() => setView('admin')} className="hover:text-white transition-colors">
                  Административная панель
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Category Tags links */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Популярное</h4>
            <div className="flex flex-wrap gap-1.5 max-w-xs">
              <span className="text-[10px] bg-slate-800/60 text-slate-350 px-2.5 py-1 rounded-md border border-slate-700/50">
                Сантехника
              </span>
              <span className="text-[10px] bg-slate-800/60 text-slate-350 px-2.5 py-1 rounded-md border border-slate-700/50">
                Электрика
              </span>
              <span className="text-[10px] bg-slate-800/60 text-slate-350 px-2.5 py-1 rounded-md border border-slate-700/50">
                Генеральная уборка
              </span>
              <span className="text-[10px] bg-slate-800/60 text-slate-350 px-2.5 py-1 rounded-md border border-slate-700/50">
                Сборка шкафов
              </span>
              <span className="text-[10px] bg-slate-800/60 text-slate-350 px-2.5 py-1 rounded-md border border-slate-700/50">
                Настройка ПК
              </span>
            </div>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-3 text-xs text-slate-400">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Контакты</h4>
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Кемеровская область, г. Новокузнецк</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-500 shrink-0" />
              <strong>Тел.:</strong> <span className="text-slate-300">+7 (3843) 99-00-99</span>
            </p>
            <p className="flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-400 shrink-0" />
              <strong>Telegram:</strong>{' '}
              <a href="https://t.me/delotut_novokuznetsk" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                @delotut_nvkz
              </a>
            </p>
          </div>
        </div>

        {/* Divider bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} ООО «Дело Тут Новокузнецк». Все права защищены.</p>
          <div className="flex items-center gap-1.5">
            <span>Разработано с заботой о вашем доме</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
