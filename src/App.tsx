/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { Category, District, Service, Master, Order } from './types';
import {
  INITIAL_CATEGORIES,
  INITIAL_DISTRICTS,
  INITIAL_SERVICES,
  INITIAL_MASTERS,
  INITIAL_ORDERS,
} from './data';
import Header from './components/Header';
import HomeView from './components/HomeView';
import RegisterMasterView from './components/RegisterMasterView';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

export default function App() {
  const [currentView, setView] = useState<'home' | 'register-master' | 'admin'>('home');

  // Core Database States synced with SQLite Express API on mount
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [districts] = useState<District[]>(INITIAL_DISTRICTS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [masters, setMasters] = useState<Master[]>(INITIAL_MASTERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Client shopping cart state
  const [cart, setCart] = useState<{ service: Service; quantity: number }[]>([]);

  // Hydrate states from SQLite Backend API
  const refreshData = () => {
    fetch('/api/public/data')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
        if (data.services) setServices(data.services);
      })
      .catch((err) => console.error('Error fetching public services/categories:', err));

    fetch('/api/admin/orders')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .catch((err) => console.error('Error fetching admin orders:', err));

    fetch('/api/admin/masters')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMasters(data);
      })
      .catch((err) => console.error('Error fetching admin masters:', err));
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  // ==================== CART ACTIONS ====================
  const handleAddToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.service.id === service.id);
      if (existing) {
        return prev.map((item) =>
          item.service.id === service.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (serviceId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.service.id === serviceId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (serviceId: string) => {
    setCart((prev) => prev.filter((item) => item.service.id !== serviceId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // ==================== ORDER CREATOR FLOW ====================
  const handleCheckoutSubmit = (clientInfo: {
    name: string;
    phone: string;
    address: string;
    telegram: string;
    district: string;
  }) => {
    // Generate listed service IDs in expanded format
    const serviceIds: string[] = [];
    let priceTotal = 0;

    cart.forEach((item) => {
      priceTotal += item.service.price * item.quantity;
      for (let i = 0; i < item.quantity; i++) {
        serviceIds.push(item.service.id);
      }
    });

    const orderPayload = {
      clientName: clientInfo.name,
      clientPhone: clientInfo.phone,
      clientAddress: clientInfo.address,
      clientTelegram: clientInfo.telegram || undefined,
      district: clientInfo.district,
      cartItems: cart,
      totalCost: priceTotal,
    };

    fetch('/api/public/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          refreshData();
        }
      })
      .catch((err) => {
        console.error('API Error placing order, falling back locally:', err);
        const newOrder: Order = {
          id: `ORD-${Math.floor(Math.random() * 900 + 100)}`,
          clientName: clientInfo.name,
          clientPhone: clientInfo.phone,
          clientAddress: clientInfo.address,
          clientTelegram: clientInfo.telegram || undefined,
          status: 'new',
          createdAt: new Date().toISOString(),
          serviceIds,
          totalCost: priceTotal,
          assignedMasterId: null,
          district: clientInfo.district,
        };
        setOrders((prev) => [newOrder, ...prev]);
      });
  };

  // ==================== HANDYMAN ONBOARDING ====================
  const handleOnboardMaster = (masterDetails: {
    fullName: string;
    phone: string;
    telegram: string;
    selectedServiceIds: string[];
    selectedDistrictIds: string[];
  }) => {
    fetch('/api/public/masters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(masterDetails),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          refreshData();
        }
      })
      .catch((err) => {
        console.error('API Error onboarding master, falling back locally:', err);
        const newMaster: Master = {
          id: `m${Date.now()}`,
          fullName: masterDetails.fullName,
          phone: masterDetails.phone,
          telegram: masterDetails.telegram,
          rating: 5.0,
          serviceIds: masterDetails.selectedServiceIds,
          districtIds: masterDetails.selectedDistrictIds,
          status: 'pending',
        };
        setMasters((prev) => [newMaster, ...prev]);
      });
  };

  // ==================== ADMIN ACTIONS ====================
  const handleAdminAddCategory = (name: string) => {
    fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
      .then((r) => r.json())
      .then(() => refreshData())
      .catch((err) => {
        console.error('API Error adding category, adding locally:', err);
        const newCat: Category = {
          id: `cat-${Date.now()}`,
          name,
          icon: 'Hammer',
        };
        setCategories((prev) => [...prev, newCat]);
      });
  };

  const handleAdminAddService = (srv: Omit<Service, 'id'>) => {
    fetch('/api/admin/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(srv),
    })
      .then((r) => r.json())
      .then(() => refreshData())
      .catch((err) => {
        console.error('API Error adding service, adding locally:', err);
        const newService: Service = {
          ...srv,
          id: `srv-${Date.now()}`,
          rating: 4.8,
          reviewsCount: 1,
        };
        setServices((prev) => [...prev, newService]);
      });
  };

  const handleAdminEditService = (srv: Service) => {
    fetch(`/api/admin/services/${srv.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(srv),
    })
      .then((r) => r.json())
      .then(() => refreshData())
      .catch((err) => {
        console.error('API Error editing service, falling back locally:', err);
        setServices((prev) => prev.map((item) => (item.id === srv.id ? srv : item)));
      });
  };

  const handleAdminDeleteService = (id: string) => {
    fetch(`/api/admin/services/${id}`, {
      method: 'DELETE',
    })
      .then((r) => r.json())
      .then(() => refreshData())
      .catch((err) => {
        console.error('API Error deleting service, falling back locally:', err);
        setServices((prev) => prev.filter((item) => item.id !== id));
      });
    setCart((prev) => prev.filter((item) => item.service.id !== id));
  };

  const handleAdminUpdateOrder = (ord: Order) => {
    fetch(`/api/admin/orders/${ord.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: ord.status, assignedMasterId: ord.assignedMasterId }),
    })
      .then((r) => r.json())
      .then(() => refreshData())
      .catch((err) => {
        console.error('API Error updating order, falling back locally:', err);
        setOrders((prev) => prev.map((item) => (item.id === ord.id ? ord : item)));
      });
  };

  const handleAdminDeleteOrder = (id: string) => {
    // There is no specific delete order in specs but we have it locally, so we can support it
    setOrders((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdminAddMasterRaw = (m: Omit<Master, 'id' | 'rating'>) => {
    fetch('/api/public/masters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: m.fullName,
        phone: m.phone,
        telegram: m.telegram,
        selectedServiceIds: m.serviceIds,
        selectedDistrictIds: m.districtIds,
      }),
    })
      .then((r) => r.json())
      .then(() => refreshData())
      .catch((err) => {
        console.error('API Error adding master raw, falling back locally:', err);
        const nm: Master = {
          ...m,
          id: `m-${Date.now()}`,
          rating: 4.8,
        };
        setMasters((prev) => [nm, ...prev]);
      });
  };

  const handleAdminUpdateMaster = (m: Master) => {
    fetch(`/api/admin/masters/${m.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: m.status }),
    })
      .then((r) => r.json())
      .then(() => refreshData())
      .catch((err) => {
        console.error('API Error updating master status, falling back locally:', err);
        setMasters((prev) => prev.map((item) => (item.id === m.id ? m : item)));
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <Header
        currentView={currentView}
        setView={setView}
        cart={cart}
        clearCart={handleClearCart}
        removeFromCart={handleRemoveFromCart}
        updateQuantity={handleUpdateCartQuantity}
        onSubmitOrder={handleCheckoutSubmit}
      />

      {/* Main Multi-Screen switch */}
      <main className="flex-grow flex flex-col">
        {currentView === 'home' && (
          <HomeView
            categories={categories}
            services={services}
            onAddToCart={handleAddToCart}
            setView={setView}
            cart={cart}
          />
        )}

        {currentView === 'register-master' && (
          <RegisterMasterView
            categories={categories}
            districts={districts}
            services={services}
            onRegisterMaster={handleOnboardMaster}
            setView={setView}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            categories={categories}
            districts={districts}
            services={services}
            masters={masters}
            orders={orders}
            onAddCategory={handleAdminAddCategory}
            onAddService={handleAdminAddService}
            onEditService={handleAdminEditService}
            onDeleteService={handleAdminDeleteService}
            onUpdateOrder={handleAdminUpdateOrder}
            onDeleteOrder={handleAdminDeleteOrder}
            onAddMaster={handleAdminAddMasterRaw}
            onUpdateMaster={handleAdminUpdateMaster}
          />
        )}
      </main>

      <Footer setView={setView} />
    </div>
  );
}
