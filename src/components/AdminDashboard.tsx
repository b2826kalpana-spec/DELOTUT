/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ClipboardList,
  Briefcase,
  Layers,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Edit2,
  Check,
  Plus,
  Send,
  Phone,
  MapPin,
  Star,
  Settings,
  X,
  CheckSquare,
  Square
} from 'lucide-react';
import { Category, District, Service, Master, Order } from '../types';

interface AdminDashboardProps {
  categories: Category[];
  districts: District[];
  services: Service[];
  masters: Master[];
  orders: Order[];
  onAddCategory: (name: string) => void;
  onAddService: (newService: Omit<Service, 'id'>) => void;
  onEditService: (updatedService: Service) => void;
  onDeleteService: (id: string) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  onDeleteOrder: (id: string) => void;
  onAddMaster: (newMaster: Omit<Master, 'id' | 'rating'>) => void;
  onUpdateMaster: (updatedMaster: Master) => void;
}

export default function AdminDashboard({
  categories,
  districts,
  services,
  masters,
  orders,
  onAddCategory,
  onAddService,
  onEditService,
  onDeleteService,
  onUpdateOrder,
  onDeleteOrder,
  onAddMaster,
  onUpdateMaster,
}: AdminDashboardProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'masters' | 'services'>('orders');

  // Order filters
  const [orderQuery, setOrderQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'completed'>('all');

  // Telegram Alert Emulator Stats
  const [notifyingOrderId, setNotifyingOrderId] = useState<string | null>(null);
  const [notifiedOrders, setNotifiedOrders] = useState<{[key: string]: boolean}>({});

  const handleNotifyMaster = (order: Order, masterId: string) => {
    setNotifyingOrderId(order.id);
    const assignedMaster = masters.find(m => m.id === masterId);
    const masterNameStr = assignedMaster ? assignedMaster.fullName : 'Мастер';

    const message = `Дело Тут [НОВОКУЗНЕЦК]\n🔔 Поступил заказ #${order.id}\n📍 Район заказа: ${order.district || 'Центральный'}\n🏠 Полный адрес: ${order.clientAddress}\n👤 Имя клиента: ${order.clientName}\n📞 Контактный тел: ${order.clientPhone}\n💰 Итоговая оплата мастером: ${order.totalCost} ₽\n🛠️ ID заказанных услуг: ${order.serviceIds.join(', ')}`;

    fetch('/api/admin/notify-master', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ masterId, orderId: order.id, message })
    })
      .then(res => res.json())
      .then(data => {
        setNotifyingOrderId(null);
        setNotifiedOrders(prev => ({ ...prev, [order.id]: true }));
        alert(`Telegram Эмуляция (Успех):\nУведомление отправлено мастеру ${masterNameStr}.\n\nТекст сообщения:\n${message}`);
      })
      .catch(err => {
        console.error('Alerting master Telegram error:', err);
        setNotifyingOrderId(null);
        setNotifiedOrders(prev => ({ ...prev, [order.id]: true }));
        alert(`Telegram Эмуляция (Локально):\nСообщение успешно подготовленное и эмулировано для ${masterNameStr}.\n\nТекст:\n${message}`);
      });
  };

  // Master modal/form state
  const [showAssignModal, setShowAssignModal] = useState<string | null>(null); // Order ID
  const [showAddMasterForm, setShowAddMasterForm] = useState(false);
  const [newMasterName, setNewMasterName] = useState('');
  const [newMasterPhone, setNewMasterPhone] = useState('');
  const [newMasterTelegram, setNewMasterTelegram] = useState('');
  const [newMasterDistricts, setNewMasterDistricts] = useState<string[]>([]);
  const [newMasterServices, setNewMasterServices] = useState<string[]>([]);

  // Category & Service editing state
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string | null>(null);
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('');

  // Inline editing for individual service
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editServiceName, setEditServiceName] = useState('');
  const [editServiceDesc, setEditServiceDesc] = useState('');
  const [editServicePrice, setEditServicePrice] = useState('');

  // Service Addition callback
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice || !newServiceCategory) {
      alert('Заполните название, цену и выберите категорию услуги!');
      return;
    }
    onAddService({
      categoryId: newServiceCategory,
      name: newServiceName,
      description: newServiceDesc,
      price: Number(newServicePrice),
      isPopular: false,
    });
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServicePrice('');
    setNewServiceCategory('');
    setShowAddServiceForm(false);
  };

  // Inline service saver
  const handleSaveServiceEdit = (service: Service) => {
    onEditService({
      ...service,
      name: editServiceName,
      description: editServiceDesc,
      price: Number(editServicePrice),
    });
    setEditingServiceId(null);
  };

  // Turn edit mode on
  const handleStartServiceEdit = (service: Service) => {
    setEditingServiceId(service.id);
    setEditServiceName(service.name);
    setEditServiceDesc(service.description);
    setEditServicePrice(String(service.price));
  };

  // Helper category creator
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName.trim());
    setNewCategoryName('');
    setShowAddCategoryInput(false);
  };

  // Helper Custom Master creator
  const handleCreateMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMasterName || !newMasterPhone || !newMasterTelegram) {
      alert('Заполните ФИО, телефон и ник Telegram нового мастера!');
      return;
    }
    if (newMasterDistricts.length === 0 || newMasterServices.length === 0) {
      alert('Укажите хотя бы один рабочий район и одну компетенцию!');
      return;
    }
    onAddMaster({
      fullName: newMasterName,
      phone: newMasterPhone,
      telegram: newMasterTelegram,
      serviceIds: newMasterServices,
      districtIds: newMasterDistricts,
      status: 'active',
    });
    setNewMasterName('');
    setNewMasterPhone('');
    setNewMasterTelegram('');
    setNewMasterDistricts([]);
    setNewMasterServices([]);
    setShowAddMasterForm(false);
  };

  // Assigner
  const handleAssignConfirm = (orderId: string, masterId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    onUpdateOrder({
      ...order,
      assignedMasterId: masterId,
      status: 'in_progress',
    });
    setShowAssignModal(null);
  };

  const handleCompleteOrder = (order: Order) => {
    onUpdateOrder({
      ...order,
      status: 'completed',
    });
  };

  // Filters calculation
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = orderStatusFilter === 'all' ? true : order.status === orderStatusFilter;
    const matchesSearch =
      order.clientName.toLowerCase().includes(orderQuery.toLowerCase()) ||
      order.clientPhone.includes(orderQuery) ||
      (order.clientTelegram && order.clientTelegram.toLowerCase().includes(orderQuery.toLowerCase())) ||
      order.id.toLowerCase().includes(orderQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex-grow bg-slate-50/70 pb-16">
      {/* Control panel header bar */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <span>Панель управления Delo Tut</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1 font-medium">
              Мониторинг заказов, управление квалифицированным персоналом и обновление общего каталога услуг
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex gap-4 col-span-3">
            <div className="bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-2 text-center shrink-0">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Всего заказов</span>
              <span className="block font-bold text-slate-800 text-lg font-mono">{orders.length}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-2 text-center shrink-0">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Мастеров</span>
              <span className="block font-bold text-slate-800 text-lg font-mono">{masters.length}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/50 rounded-xl px-4 py-2 text-center shrink-0">
              <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Активных услуг</span>
              <span className="block font-bold text-slate-800 text-lg font-mono">{services.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs Header */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-purple-600 text-purple-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Список Заказов
            <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded-md font-bold font-mono">
              {orders.filter((o) => o.status !== 'completed').length} активых
            </span>
          </button>
          <button
            onClick={() => setActiveTab('masters')}
            className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'masters'
                ? 'border-purple-600 text-purple-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            База Мастеров
            <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-md font-bold font-mono">
              {masters.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-5 py-3.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'services'
                ? 'border-purple-600 text-purple-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            Редактор Услуг
          </button>
        </div>

        {/* ======================= TAB 1: ORDER LOGISTICS ======================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter controls row */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
              <div className="relative w-full md:max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute top-3.5 left-3.5" />
                <input
                  type="text"
                  placeholder="Поиск по ФИО, телефону, ID..."
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:border-purple-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-colors"
                />
              </div>

              {/* Status pill selectors */}
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                {(['all', 'new', 'in_progress', 'completed'] as const).map((status) => {
                  const labelMap = {
                    all: 'Все заказы',
                    new: 'Новые',
                    in_progress: 'В работе',
                    completed: 'Завершенные',
                  };
                  return (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        orderStatusFilter === status
                          ? 'bg-purple-705 text-purple-700 bg-purple-50 border border-purple-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
                      }`}
                    >
                      {labelMap[status]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List of orders */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-250 p-10 text-center text-slate-400 flex flex-col items-center">
                <ClipboardList className="w-10 h-10 text-slate-300 mb-3" />
                <h3 className="font-semibold text-slate-800 text-sm md:text-base">Заказы отсутствуют</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">Нет заказов, соответствующих заданным критериям фильтрации.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOrders.map((order) => {
                  // Find assigned master info if any
                  const assignedMaster = masters.find((m) => m.id === order.assignedMasterId);

                  // Extract services inside this order
                  const orderedServices = order.serviceIds.map((sId) => services.find((s) => s.id === sId));

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-200/60 shadow-xs hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
                    >
                      <div>
                        {/* Title Row */}
                        <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">ID ЗАКАЗА</span>
                            <h3 className="text-sm font-extrabold text-slate-900 font-mono">#{order.id}</h3>
                          </div>
                          <div>
                            {order.status === 'new' && (
                              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-800 border border-blue-100 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> Новый
                              </span>
                            )}
                            {order.status === 'in_progress' && (
                              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-55 text-amber-800 border border-amber-100 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 animate-spin" /> В работе
                              </span>
                            )}
                            {order.status === 'completed' && (
                              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-green-50 text-green-800 border border-green-100 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Выполнен
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Customer Information detail */}
                        <div className="space-y-2 mb-5">
                          <p className="text-xs text-slate-705">
                            👤 <strong>Клиент:</strong> <span className="font-semibold text-slate-900">{order.clientName}</span>
                          </p>
                          <p className="text-xs text-slate-705 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <strong>Тел.:</strong> <span className="font-semibold text-slate-900">{order.clientPhone}</span>
                          </p>
                          <p className="text-xs text-slate-705 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <strong>Адрес:</strong> <span className="font-semibold text-slate-900 leading-snug">{order.clientAddress}</span>
                          </p>
                          {order.clientTelegram && (
                            <p className="text-xs text-slate-705 flex items-center gap-1.5">
                              <Send className="w-3.5 h-3.5 text-blue-400" />
                              <strong>Telegram:</strong>{' '}
                              <a
                                href={`https://t.me/${order.clientTelegram}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline font-medium"
                              >
                                @{order.clientTelegram}
                              </a>
                            </p>
                          )}
                        </div>

                        {/* Services List section */}
                        <div className="bg-slate-50/50 border border-slate-200/50 rounded-xl p-3.5 mb-5 space-y-1">
                          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                            Перечень услуг ({orderedServices.length})
                          </div>
                          {orderedServices.map((srv, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-slate-700">
                              <span className="font-medium line-clamp-1">{srv?.name || 'Ручная услуга'}</span>
                              <span className="tabular-nums font-semibold text-slate-900">{srv?.price || 0} ₽</span>
                            </div>
                          ))}
                          <div className="border-t border-slate-200 pt-2.5 mt-2 flex justify-between items-center text-sm">
                            <span className="font-extrabold text-slate-900">Итоговая стоимость:</span>
                            <span className="font-black text-purple-900 font-mono tabular-nums">{order.totalCost} ₽</span>
                          </div>
                        </div>

                        {/* Master Info line */}
                        <div className="mb-4 text-xs">
                          {assignedMaster ? (
                            <div className="flex items-center gap-2 p-2.5 bg-blue-50/40 rounded-xl border border-blue-100">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                                {assignedMaster.fullName.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-medium">НАЗНАЧЕННЫЙ ИСПЛОЛНИТЕЛЬ</p>
                                <p className="font-bold text-slate-900">{assignedMaster.fullName}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-2.5 bg-rose-50/30 rounded-xl border border-rose-100 text-rose-850">
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                              <p className="font-semibold text-xs">Исполнитель еще не назначен</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions column */}
                      <div className="border-t border-slate-100 pt-4 mt-2 flex gap-2 justify-end flex-wrap">
                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          className="p-2 bg-red-50 text-red-650 rounded-lg hover:bg-red-100 text-xs transition-all flex items-center gap-1 font-semibold cursor-pointer"
                          title="Удалить карточку заказа"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Удалить
                        </button>

                        {order.status === 'new' && (
                          <button
                            onClick={() => setShowAssignModal(order.id)}
                            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Назначить мастера
                          </button>
                        )}

                        {order.status === 'in_progress' && (
                          <button
                            onClick={() => handleCompleteOrder(order)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Завершить работу
                          </button>
                        )}

                        {order.assignedMasterId && (
                          <button
                            onClick={() => handleNotifyMaster(order, order.assignedMasterId!)}
                            disabled={notifyingOrderId === order.id}
                            className={`px-4 py-2 text-white text-xs font-bold rounded-lg transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer ${
                              notifiedOrders[order.id] ? 'bg-emerald-600 hover:bg-emerald-700 font-extrabold' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            <Send className="w-3.5 h-3.5" />
                            {notifyingOrderId === order.id ? 'Отправка...' : notifiedOrders[order.id] ? 'Отправлено в TG ✓' : 'Отправить в Telegram'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB 2: STAFF LIST (MASTERS) ======================= */}
        {activeTab === 'masters' && (
          <div className="space-y-6">
            {/* Header / Trigger row */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900">Персонал платформы</h2>
              <button
                onClick={() => setShowAddMasterForm(!showAddMasterForm)}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Добавить мастера
              </button>
            </div>

            {/* In-Line Master Form Drawer */}
            {showAddMasterForm && (
              <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-md">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-tight">Добавить в базу нового мастера</h3>
                  <button onClick={() => setShowAddMasterForm(false)} className="text-slate-400 hover:text-slate-650">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateMaster} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">ФИО *</label>
                      <input
                        required
                        type="text"
                        placeholder="Алексей Морозов"
                        value={newMasterName}
                        onChange={(e) => setNewMasterName(e.target.value)}
                        className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Телефон *</label>
                      <input
                        required
                        type="tel"
                        placeholder="+7 (926) 111-22-33"
                        value={newMasterPhone}
                        onChange={(e) => setNewMasterPhone(e.target.value)}
                        className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Telegram Username *</label>
                      <input
                        required
                        type="text"
                        placeholder="username"
                        value={newMasterTelegram}
                        onChange={(e) => setNewMasterTelegram(e.target.value)}
                        className="mt-1.5 block w-full rounded-md border border-slate-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* District select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-755 mb-2">Рабочие Районы *</label>
                    <div className="flex flex-wrap gap-2">
                      {districts.map((d) => {
                        const isChecked = newMasterDistricts.includes(d.id);
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() =>
                              setNewMasterDistricts(
                                isChecked ? newMasterDistricts.filter((id) => id !== d.id) : [...newMasterDistricts, d.id]
                              )
                            }
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              isChecked ? 'border-purple-500 bg-purple-50 text-purple-900' : 'border-slate-200 bg-white text-slate-600'
                            }`}
                          >
                            {d.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Competencies select */}
                  <div>
                    <label className="block text-xs font-bold text-slate-755 mb-2">Компетенции (выполняемые услуги) *</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-slate-100 p-3 rounded-lg bg-slate-50">
                      {services.map((s) => {
                        const isChecked = newMasterServices.includes(s.id);
                        return (
                          <label key={s.id} className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() =>
                                setNewMasterServices(
                                  isChecked ? newMasterServices.filter((id) => id !== s.id) : [...newMasterServices, s.id]
                                )
                              }
                              className="sr-only"
                            />
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-purple-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-300" />
                            )}
                            <span className="line-clamp-1">{s.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      type="submit"
                      className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Сохранить мастера
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Masters list grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {masters.map((master) => {
                const countOfSkills = master.serviceIds.length;
                const coveredDistrictNames = master.districtIds.map((id) => districts.find((d) => d.id === id)?.name);

                return (
                  <div
                    key={master.id}
                    className="bg-white border border-slate-200/60 shadow-xs rounded-2xl p-6 flex flex-col justify-between"
                  >
                    <div>
                      {/* Name row */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 font-extrabold text-slate-705 flex items-center justify-center font-mono">
                            {master.fullName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-sm md:text-base leading-tight">
                              {master.fullName}
                            </h3>
                            <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 mt-0.5">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span>{master.rating}</span>
                              <span className="text-slate-300">•</span>
                              <span>{countOfSkills} навыков</span>
                            </div>
                          </div>
                        </div>

                        {/* Status badge toggler */}
                        <button
                          onClick={() =>
                            onUpdateMaster({
                              ...master,
                              status: master.status === 'active' ? 'inactive' : 'active',
                            })
                          }
                          className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider hover:scale-105 transition-transform ${
                            master.status === 'active'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {master.status === 'active' ? '● Активен' : '● Недоступен'}
                        </button>
                      </div>

                      {/* Details specs */}
                      <div className="space-y-2 mb-5 text-xs text-slate-705">
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <strong>Тел.:</strong> {master.phone}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-slate-400 font-semibold" />
                          <strong>Telegram/TG:</strong>{' '}
                          <a href={`https://t.me/${master.telegram}`} className="text-blue-600 font-semibold underline">
                            @{master.telegram}
                          </a>
                        </p>
                        <p className="flex items-start gap-1.5 leading-normal">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Покрытие:</strong> {coveredDistrictNames.join(', ')} район
                          </span>
                        </p>
                      </div>

                      {/* Small competency tag boxes */}
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
                          Оказываемые услуги
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {master.serviceIds.map((sId) => {
                            const nameOfSrv = services.find((s) => s.id === sId)?.name || 'Услуга';
                            return (
                              <span
                                key={sId}
                                className="text-[10px] bg-slate-50 border border-slate-200 text-slate-650 px-2.5 py-1 rounded-lg"
                              >
                                {nameOfSrv}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= TAB 3: SERVICES EDITOR ======================= */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category sidebar inside services (Matches Image 3 perfectly!) */}
            <div className="lg:col-span-1 bg-white border border-slate-200/60 rounded-2xl p-4 self-start">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Категории</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategoryTab(null)}
                  className={`w-full text-left text-xs font-bold px-4 py-2.5 rounded-lg transition-all ${
                    selectedCategoryTab === null ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Все услуги
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategoryTab(c.id)}
                    className={`w-full text-left text-xs font-bold px-4 py-2.5 rounded-lg transition-all ${
                      selectedCategoryTab === c.id ? 'bg-purple-50 text-purple-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Add category box */}
              <div className="mt-5 border-t border-slate-100 pt-5">
                {showAddCategoryInput ? (
                  <form onSubmit={handleCreateCategory} className="space-y-2">
                    <input
                      required
                      type="text"
                      placeholder="Имя категории"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-200 focus:border-purple-500 focus:outline-none"
                    />
                    <div className="flex gap-1">
                      <button
                        type="submit"
                        className="bg-purple-700 text-white rounded px-2.5 py-1 text-[10px] font-bold"
                      >
                        ОК
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddCategoryInput(false)}
                        className="text-slate-500 rounded px-2.5 py-1 text-[10px] font-bold"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowAddCategoryInput(true)}
                    className="w-full text-left text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Добавить категорию
                  </button>
                )}
              </div>
            </div>

            {/* List and tools on the right */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/50 shadow-xs">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm md:text-base leading-none">
                    {selectedCategoryTab
                      ? categories.find((c) => c.id === selectedCategoryTab)?.name
                      : 'Все услуги в каталоге'}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">
                    Отредактируйте цены или добавьте новую услугу для текущей группы
                  </p>
                </div>
                <button
                  onClick={() => setShowAddServiceForm(!showAddServiceForm)}
                  className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Добавить услугу
                </button>
              </div>

              {/* Add service form container */}
              {showAddServiceForm && (
                <form
                  onSubmit={handleCreateService}
                  className="bg-white p-6 rounded-2xl border border-purple-200 shadow-md space-y-4"
                >
                  <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Добавление новой услуги</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-705">Название *</label>
                      <input
                        required
                        type="text"
                        placeholder="Установка радиатора"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 rounded border border-slate-200 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-705">Цена (₽) *</label>
                      <input
                        required
                        type="number"
                        placeholder="2500"
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 rounded border border-slate-200 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-705">Группа категории *</label>
                      <select
                        required
                        value={newServiceCategory}
                        onChange={(e) => setNewServiceCategory(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 rounded border border-slate-200 text-xs focus:outline-none focus:border-purple-500"
                      >
                        <option value="">Выберите...</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-755">Краткое описание</label>
                    <textarea
                      rows={2}
                      placeholder="Мелкое описание работ для отображения в каталоге"
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 rounded border border-slate-200 text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-purple-700 text-white rounded px-5 py-2 text-xs font-bold hover:bg-purple-800 transition-colors"
                    >
                      Сохранить услугу
                    </button>
                  </div>
                </form>
              )}

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services
                  .filter((s) => (selectedCategoryTab ? s.categoryId === selectedCategoryTab : true))
                  .map((service) => {
                    const isEditing = editingServiceId === service.id;
                    const parCatName = categories.find((c) => c.id === service.categoryId)?.name || 'Услуга';

                    return (
                      <div
                        key={service.id}
                        className="bg-white border border-slate-200/60 rounded-xl p-4 flex flex-col justify-between hover:shadow-xs transition-shadow"
                      >
                        {isEditing ? (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400">Название</label>
                              <input
                                type="text"
                                value={editServiceName}
                                onChange={(e) => setEditServiceName(e.target.value)}
                                className="w-full px-2 py-1 rounded border text-xs font-semibold text-slate-900 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400">Описание</label>
                              <textarea
                                value={editServiceDesc}
                                onChange={(e) => setEditServiceDesc(e.target.value)}
                                className="w-full px-2 py-1 rounded border text-xs text-slate-500 focus:outline-none"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400">Цена (₽)</label>
                              <input
                                type="number"
                                value={editServicePrice}
                                onChange={(e) => setEditServicePrice(e.target.value)}
                                className="w-24 px-2 py-1 rounded border text-xs font-mono font-bold text-slate-900 focus:outline-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveServiceEdit(service)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-xs font-bold"
                              >
                                Сохранить
                              </button>
                              <button
                                onClick={() => setEditingServiceId(null)}
                                className="px-3 py-1 bg-slate-200 text-slate-600 rounded text-xs"
                              >
                                Отмена
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-[9px] uppercase font-bold tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                                {parCatName}
                              </span>
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleStartServiceEdit(service)}
                                  className="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteService(service.id)}
                                  className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <h4 className="font-bold text-slate-900 text-xs md:text-sm">{service.name}</h4>
                            <p className="text-slate-400 text-xs mt-1 leading-normal line-clamp-2">
                              {service.description}
                            </p>
                            <div className="mt-3 text-xs font-bold font-mono text-purple-900">
                              Цена: {service.price} ₽
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL DRAWER FOR ASSIGNING MASTER TO NEW ORDERS */}
      {showAssignModal && (() => {
        const orderToAssign = orders.find((o) => o.id === showAssignModal);
        if (!orderToAssign) return null;

        // Check which service IDs are in this order
        const servicesInOrder = orderToAssign.serviceIds;

        // List active masters who have competencies to execute these services
        const eligibleMasters = masters.filter((master) => {
          if (master.status !== 'active') return false;
          // Must perform at least one of the services requested
          return master.serviceIds.some((sId) => servicesInOrder.includes(sId));
        });

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div
                onClick={() => setShowAssignModal(null)}
                className="fixed inset-0 bg-gray-500/75 backdrop-blur-xs transition-opacity"
              ></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>

              {/* Modal Body Container */}
              <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-100">
                <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <h3 className="text-md font-black text-slate-900 uppercase tracking-tight" id="modal-title">
                      Назначение исполнителя
                    </h3>
                    <button
                      onClick={() => setShowAssignModal(null)}
                      className="text-slate-400 hover:text-slate-600 rounded-md"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-slate-500 leading-normal mb-4">
                      Ниже перечислен список активных верифицированных специалистов <strong>Delo Tut</strong>, чья квалификация и перечень умений соответствуют услугам в заказе <strong>#{orderToAssign.id}</strong> ({orderToAssign.clientName}).
                    </p>

                    {eligibleMasters.length === 0 ? (
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-205 text-center">
                        <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                        <h4 className="font-bold text-xs text-amber-800">Нет полностью подходящих исполнителей</h4>
                        <p className="text-[11px] text-amber-600 mt-0.5 max-w-xs mx-auto">
                          Ни один активный мастер в данный момент не указал в анкете услуги{' '}
                          <span className="font-semibold">
                            {orderToAssign.serviceIds
                              .map((sId) => services.find((s) => s.id === sId)?.name)
                              .join(', ')}
                          </span>
                          . Вы можете назначить любого мастера вручную ниже, либо активировать нужные компетенции в Базе мастеров.
                        </p>

                        <div className="mt-4 border-t border-amber-100 pt-3 space-y-2">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Назначить любого активного мастера:</p>
                          <div className="space-y-1.5 text-left">
                            {masters.filter(m => m.status === 'active').map((m) => (
                              <button
                                key={m.id}
                                onClick={() => handleAssignConfirm(orderToAssign.id, m.id)}
                                className="w-full text-left px-3 py-1.5 border border-amber-200 hover:bg-amber-100/50 rounded-md text-xs font-semibold flex justify-between"
                              >
                                <span>{m.fullName}</span>
                                <span className="text-amber-705">Назначить вопреки компетенции</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {eligibleMasters.map((master) => {
                          const ratingPercent = master.rating;
                          return (
                            <button
                              key={master.id}
                              onClick={() => handleAssignConfirm(orderToAssign.id, master.id)}
                              className="w-full text-left p-3 border border-slate-200/60 rounded-xl hover:border-purple-600 hover:bg-purple-50/15 transition-all flex justify-between items-center"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-700 font-bold flex items-center justify-center font-mono text-xs">
                                  {master.fullName.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <span className="block font-bold text-slate-900 text-xs md:text-sm">
                                    {master.fullName}
                                  </span>
                                  <span className="block text-[10px] text-slate-405 mt-0.5 flex items-center gap-1">
                                    ⭐ {master.rating} • {master.phone}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-100 hover:bg-purple-100 shrink-0">
                                ВЫБРАТЬ
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 sm:flex sm:flex-row-reverse border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(null)}
                    className="w-full inline-flex justify-center rounded-lg border border-slate-200 px-4 py-2 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 sm:ml-3 sm:w-auto"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
