import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';

// Initialize SQLite database
const db = new Database('delotut.sqlite');

// Create database tables if they do not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    base_price REAL,
    description TEXT,
    price_type TEXT,
    unit TEXT,
    min_order INTEGER,
    is_active INTEGER DEFAULT 1,
    image_url TEXT,
    rating REAL DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 1,
    is_popular INTEGER DEFAULT 0,
    FOREIGN KEY(category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS masters (
    id TEXT PRIMARY KEY,
    fullName TEXT NOT NULL,
    name TEXT,
    phone TEXT NOT NULL,
    telegram TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, active, approved, rejected, paused
    districts TEXT, -- JSON array of strings
    service_ids TEXT, -- JSON array of strings
    rating REAL DEFAULT 5.0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    clientName TEXT NOT NULL,
    customer_name TEXT,
    clientPhone TEXT NOT NULL,
    phone TEXT,
    clientAddress TEXT NOT NULL,
    address_full TEXT,
    district TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- new, accepted, searching_master, assigned, in_work, done, cancelled, need_clarification
    serviceIds TEXT, -- JSON array of string service IDs
    cart_items TEXT, -- JSON array of objects {service, quantity}
    totalCost REAL NOT NULL,
    total_amount REAL,
    assignedMasterId TEXT,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    master_id TEXT,
    order_id TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread', -- unread, read
    created_at TEXT NOT NULL
  );
`);

// Seed Initial Categories
const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
if (categoryCount.count === 0) {
  const insertCategory = db.prepare(`
    INSERT INTO categories (id, name, slug, icon, sort_order) 
    VALUES (?, ?, ?, ?, ?)
  `);
  
  insertCategory.run('electrical', 'Электрика', 'electrical', 'Zap', 1);
  insertCategory.run('plumbing', 'Сантехника', 'plumbing', 'Droplets', 2);
  insertCategory.run('loaders', 'Грузчики', 'loaders', 'Truck', 3);
  insertCategory.run('cleaning', 'Уборка', 'cleaning', 'Sparkles', 4);
  insertCategory.run('tasks', 'Поручения', 'tasks', 'FileText', 5);
  insertCategory.run('furniture', 'Мебель', 'furniture', 'Armchair', 6);
  insertCategory.run('computer', 'Компьютерная помощь', 'computer', 'Laptop', 7);
  insertCategory.run('handyman', 'Мелкий ремонт', 'handyman', 'Hammer', 8);
}

// Seed Initial Services (Prices matching v1 specifications and tasks)
const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get() as { count: number };
if (serviceCount.count === 0) {
  const insertService = db.prepare(`
    INSERT INTO services (id, category_id, slug, name, price, base_price, description, price_type, unit, min_order, is_popular, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Tasks specific seeds:
  // Сантехника: Замена крана 1500р
  insertService.run(
    'faucet-replace',
    'plumbing',
    'zavena-krana',
    'Замена крана (смесителя)',
    1500,
    1500,
    'Демонтаж старого смесителя и установка нового качественного крана.',
    'работа',
    'шт',
    1500,
    1,
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400'
  );

  // Электрика: Установка розетки 500р
  insertService.run(
    'socket-install',
    'electrical',
    'ustanovka-rozetki',
    'Установка и монтаж розетки',
    500,
    500,
    'Монтаж и подключение стандартной розетки в готовый подрозетник.',
    'работа',
    'точка',
    500,
    1,
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400'
  );

  // Additional catalogue services from the guidelines list (v1 Pricing Framework)
  insertService.run(
    'electrical-diagnostic',
    'electrical',
    'diagnostika-elektriki',
    'Диагностика электрики',
    900,
    900,
    'Осмотр неисправности силовой проводки, выключателей и шита.',
    'выезд',
    'выезд',
    900,
    0,
    ''
  );
  insertService.run(
    'replace-socket',
    'electrical',
    'zamena-rozetki',
    'Замена розетки',
    900,
    900,
    'Демонтаж и монтаж стандартной точки розетки.',
    'точка',
    'точка',
    900,
    0,
    ''
  );
  insertService.run(
    'replace-switch',
    'electrical',
    'zamena-vyklyuchatelya',
    'Замена выключателя',
    800,
    800,
    'Замена стандартного клавишного выключателя освещения.',
    'точка',
    'точка',
    800,
    0,
    ''
  );
  insertService.run(
    'install-chandelier',
    'electrical',
    'ustanovka-lustry',
    'Установка люстры',
    1500,
    1500,
    'Сборка, монтаж и безопасное подключение простой люстры к потолку.',
    'предмет',
    'шт',
    1500,
    1,
    'https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&q=80&w=400'
  );
  insertService.run(
    'plumbing-diagnostic',
    'plumbing',
    'diagnostika-santekhniki',
    'Диагностика сантехники',
    900,
    900,
    'Осмотр и выявление протечек, засоров и других дефектов водоснабжения.',
    'выезд',
    'выезд',
    900,
    0,
    ''
  );
  insertService.run(
    'general-clean',
    'cleaning',
    'generalnaya-uborka',
    'Генеральная уборка квартиры',
    2500,
    2500,
    'Глубокая влажная и сухая уборка всех комнат, включая санузел и кухню.',
    'заказ',
    'до 40 м2',
    2500,
    1,
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400'
  );
  insertService.run(
    'loaders-hour',
    'loaders',
    'gruzchik-chas',
    'Услуги грузчика (1 человек)',
    700,
    700,
    'Погрузочно-разгрузочные работы. Минимальный заказ - 2 часа.',
    'час',
    'час',
    1400,
    0,
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400'
  );
  insertService.run(
    'furniture-assemble-simple',
    'furniture',
    'sborka-stula-tumby',
    'Сборка стула или тумбы',
    900,
    900,
    'Быстрая аккуратная сборка простых мебельных предметов.',
    'шт',
    'шт',
    900,
    0,
    ''
  );
  insertService.run(
    'handyman-hour',
    'handyman',
    'master-na-chas',
    'Мастер на час',
    1200,
    1200,
    'Мелкие бытовые задачи: монтаж полок, карнизов, зеркал.',
    'час',
    'час',
    1200,
    1,
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400'
  );
  insertService.run(
    'pc-diagnostic',
    'computer',
    'diagnostika-pk',
    'Диагностика ПК',
    900,
    900,
    'Выявление программных неисправностей, вирусов или проблем с железом.',
    'выезд',
    'выезд',
    900,
    0,
    ''
  );
}

// Seed Initial Masters
const masterCount = db.prepare('SELECT COUNT(*) as count FROM masters').get() as { count: number };
if (masterCount.count === 0) {
  const insertMaster = db.prepare(`
    INSERT INTO masters (id, fullName, name, phone, telegram, status, districts, service_ids)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertMaster.run(
    'm1',
    'Алексей Морозов',
    'Алексей',
    '+7 (926) 111-22-33',
    'alex_mor',
    'active',
    JSON.stringify(['central', 'kuznetsky', 'zavodskoy']),
    JSON.stringify(['faucet-replace', 'socket-install', 'replace-socket', 'install-chandelier'])
  );

  insertMaster.run(
    'm2',
    'Марина Клименко',
    'Марина',
    '+7 (950) 444-55-66',
    'marina_clean',
    'active',
    JSON.stringify(['central', 'ilyinsky', 'kuybyshevsky']),
    JSON.stringify(['general-clean'])
  );
}

// Seed Initial Orders
const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
if (orderCount.count === 0) {
  const insertOrder = db.prepare(`
    INSERT INTO orders (id, clientName, customer_name, clientPhone, phone, clientAddress, address_full, district, status, serviceIds, cart_items, totalCost, total_amount, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const cart = [{ service: { id: 'faucet-replace', name: 'Замена крана (смесителя)', price: 1500 }, quantity: 1 }];
  insertOrder.run(
    'ORD-084',
    'Иван Петров',
    'Иван Петров',
    '+7 (999) 123-45-67',
    '+7 (999) 123-45-67',
    'ул. Ленина, д. 45, кв. 12',
    'ул. Ленина, д. 45, кв. 12',
    'central',
    'new',
    JSON.stringify(['faucet-replace']),
    JSON.stringify(cart),
    1500,
    1500,
    new Date().toISOString()
  );
}

// Start building full-stack express app
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === PUBLIC API ENDPOINTS ===

  // GET /api/health - check server health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // GET /api/public/categories - fetch all active categories
  app.get('/api/public/categories', (req, res) => {
    try {
      const categories = db.prepare('SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC').all();
      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/public/services - fetch all active services
  app.get('/api/public/services', (req, res) => {
    try {
      const services = db.prepare('SELECT * FROM services WHERE is_active = 1').all();
      // Map to camelCase to ensure standard frontend hydration without breakage
      const mapped = services.map((s: any) => ({
        id: s.id,
        categoryId: s.category_id,
        slug: s.slug,
        name: s.name,
        price: s.price,
        base_price: s.price,
        description: s.description,
        price_type: s.price_type,
        unit: s.unit,
        min_order: s.min_order,
        imageUrl: s.image_url,
        rating: s.rating,
        reviewsCount: s.reviews_count,
        isPopular: s.is_popular === 1
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/public/data - returns both categories and active services
  app.get('/api/public/data', (req, res) => {
    try {
      const categories = db.prepare('SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC').all();
      const servicesRaw = db.prepare('SELECT * FROM services WHERE is_active = 1').all();
      const services = servicesRaw.map((s: any) => ({
        id: s.id,
        categoryId: s.category_id,
        slug: s.slug,
        name: s.name,
        price: s.price,
        base_price: s.price,
        description: s.description,
        price_type: s.price_type,
        unit: s.unit,
        min_order: s.min_order,
        imageUrl: s.image_url,
        rating: s.rating,
        reviewsCount: s.reviews_count,
        isPopular: s.is_popular === 1
      }));
      res.json({ categories, services });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/public/orders - submit client order form
  app.post('/api/public/orders', (req, res) => {
    try {
      const {
        clientName,
        clientPhone,
        clientAddress,
        clientTelegram,
        district,
        cartItems,
        totalCost,
      } = req.body;

      const orderId = `ORD-${Math.floor(Math.random() * 900 + 100)}`;
      const createdAt = new Date().toISOString();

      // Convert details to array for backward compatible tracking if needed
      const serviceIdsFromCart = cartItems ? cartItems.map((item: any) => item.service.id) : [];

      const stmt = db.prepare(`
        INSERT INTO orders (id, clientName, customer_name, clientPhone, phone, clientAddress, address_full, district, status, serviceIds, cart_items, totalCost, total_amount, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?, ?, ?)
      `);

      stmt.run(
        orderId,
        clientName,
        clientName,
        clientPhone,
        clientPhone,
        clientAddress,
        clientAddress,
        district || 'central',
        JSON.stringify(serviceIdsFromCart),
        JSON.stringify(cartItems || []),
        totalCost,
        totalCost,
        createdAt
      );

      res.status(201).json({ success: true, orderId, order: { id: orderId, clientName, clientPhone, clientAddress, totalCost, status: 'new' } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/public/masters - onboard a new handyman application (on master-view)
  app.post('/api/public/masters', (req, res) => {
    try {
      const {
        fullName,
        phone,
        telegram,
        selectedServiceIds,
        selectedDistrictIds,
      } = req.body;

      const masterId = `m-${Date.now()}`;

      const stmt = db.prepare(`
        INSERT INTO masters (id, fullName, name, phone, telegram, status, districts, service_ids)
        VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)
      `);

      stmt.run(
        masterId,
        fullName,
        fullName.split(' ')[0] || fullName,
        phone,
        telegram,
        JSON.stringify(selectedDistrictIds || []),
        JSON.stringify(selectedServiceIds || [])
      );

      res.status(201).json({ success: true, masterId });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // === ADMIN API ENDPOINTS ===

  // GET /api/admin/orders - fetch all orders for the dispatcher admin dashboard
  app.get('/api/admin/orders', (req, res) => {
    try {
      const rows = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();
      const mapped = rows.map((o: any) => ({
        id: o.id,
        clientName: o.clientName,
        clientPhone: o.clientPhone,
        clientAddress: o.clientAddress,
        clientTelegram: o.clientTelegram || undefined,
        district: o.district,
        status: o.status,
        createdAt: o.createdAt,
        serviceIds: JSON.parse(o.serviceIds || '[]'),
        cartItems: JSON.parse(o.cart_items || '[]'),
        totalCost: o.totalCost,
        assignedMasterId: o.assignedMasterId || null
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT /api/admin/orders/:id/status - edit order status or set assigned master
  app.put('/api/admin/orders/:id/status', (req, res) => {
    try {
      const { id } = req.params;
      const { status, assignedMasterId } = req.body;

      const current = db.prepare('SELECT * FROM orders WHERE id = ?').get() as any;
      if (!current) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const nextStatus = status || current.status;
      const nextMaster = assignedMasterId !== undefined ? assignedMasterId : current.assignedMasterId;

      const stmt = db.prepare('UPDATE orders SET status = ?, assignedMasterId = ? WHERE id = ?');
      stmt.run(nextStatus, nextMaster, id);

      res.json({ success: true, orderId: id, status: nextStatus, assignedMasterId: nextMaster });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/admin/masters - dispatcher retrieves handymen
  app.get('/api/admin/masters', (req, res) => {
    try {
      const rows = db.prepare('SELECT * FROM masters ORDER BY id DESC').all();
      const mapped = rows.map((m: any) => ({
        id: m.id,
        fullName: m.fullName,
        phone: m.phone,
        telegram: m.telegram,
        status: m.status,
        rating: m.rating,
        districtIds: JSON.parse(m.districts || '[]'),
        serviceIds: JSON.parse(m.service_ids || '[]')
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT /api/admin/masters/:id/status - update master application status (approved / rejected / active / pending)
  app.put('/api/admin/masters/:id/status', (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const stmt = db.prepare('UPDATE masters SET status = ? WHERE id = ?');
      stmt.run(status, id);

      res.json({ success: true, id, status });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/admin/notify-master - simulate dispatcher alerting a worker
  app.post('/api/admin/notify-master', (req, res) => {
    try {
      const { masterId, orderId, message } = req.body;
      const createdAt = new Date().toISOString();

      const stmt = db.prepare('INSERT INTO notifications (master_id, order_id, message, created_at) VALUES (?, ?, ?, ?)');
      stmt.run(masterId, orderId, message, createdAt);

      res.json({ success: true, message: 'Уведомление отправлено мастеру в Telegram (эмуляция успешно выполнена)' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET/POST/PUT/DELETE for services & categories (Admin management panel)
  app.get('/api/admin/services', (req, res) => {
    try {
      const rows = db.prepare('SELECT * FROM services').all();
      res.json(rows.map((s: any) => ({
        id: s.id,
        categoryId: s.category_id,
        name: s.name,
        price: s.price,
        base_price: s.price,
        description: s.description,
        imageUrl: s.image_url,
        isPopular: s.is_popular === 1,
        isActive: s.is_active === 1
      })));
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/services', (req, res) => {
    try {
      const { categoryId, name, price, description, isPopular } = req.body;
      const id = `srv-${Date.now()}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const stmt = db.prepare(`
        INSERT INTO services (id, category_id, slug, name, price, base_price, description, is_active, is_popular)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
      `);
      stmt.run(id, categoryId, slug, name, price, price, description, isPopular ? 1 : 0);

      res.status(201).json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/admin/services/:id', (req, res) => {
    try {
      const { id } = req.params;
      const { categoryId, name, price, description, isPopular } = req.body;

      const stmt = db.prepare(`
        UPDATE services 
        SET category_id = COALESCE(?, category_id), 
            name = COALESCE(?, name), 
            price = COALESCE(?, price), 
            description = COALESCE(?, description), 
            is_popular = COALESCE(?, is_popular)
        WHERE id = ?
      `);
      stmt.run(categoryId, name, price, description, isPopular ? 1 : null, id);

      res.json({ success: true, id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/admin/services/:id', (req, res) => {
    try {
      const { id } = req.params;
      const stmt = db.prepare('DELETE FROM services WHERE id = ?');
      stmt.run(id);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/categories', (req, res) => {
    try {
      const { name } = req.body;
      const id = `cat-${Date.now()}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const stmt = db.prepare('INSERT INTO categories (id, name, slug, icon) VALUES (?, ?, ?, "Hammer")');
      stmt.run(id, name, slug);

      res.status(201).json({ success: true, category: { id, name } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Auth helper endpoint
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
      res.json({ success: true, token: 'fake-jwt-token-for-dispatcher' });
    } else {
      res.status(401).json({ error: 'Неверные учетные данные' });
    }
  });

  // Vite Integration for Dev or Static Files serving for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
