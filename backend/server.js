/**
 * Лабораторна №5, Варіант 23: серверна частина Node.js + Express.
 * - Хостинг статичних файлів (build клієнта)
 * - GET /api/rentals — отримання оренд користувача з фільтром за ціною
 * - POST /api/rentals — збереження оренди
 * - PATCH /api/rentals/:id — оновлення оренди (наприклад, завершити)
 */
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 5001;

// Service Account: файл serviceAccountKey.json (локально) або env FIREBASE_SERVICE_ACCOUNT_JSON (Render/деплой)
let db;
function initFirestore() {
  let serviceAccount = null;
  const envJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (envJson) {
    try {
      serviceAccount = JSON.parse(envJson);
    } catch (e) {
      console.warn('Помилка парсингу FIREBASE_SERVICE_ACCOUNT_JSON:', e.message);
      return null;
    }
  } else {
    const keyPath = path.join(__dirname, 'serviceAccountKey.json');
    if (fs.existsSync(keyPath)) {
      try {
        serviceAccount = require(keyPath);
      } catch (e) {
        console.warn('Помилка читання serviceAccountKey.json:', e.message);
        return null;
      }
    }
  }
  if (!serviceAccount) {
    console.warn('Увага: Firestore не налаштовано (немає ключа). API оренд поверне 503.');
    return null;
  }
  try {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('Firestore підключено.');
    return admin.firestore();
  } catch (err) {
    console.warn('Помилка ініціалізації Firestore:', err.message);
    return null;
  }
}
db = initFirestore();

app.use(cors());
app.use(express.json());

const RENTALS_COLLECTION = 'rentals';

/**
 * GET /api/rentals?userId=xxx&minPrice=0&maxPrice=999999
 * Отримання оренд користувача з фільтром за ціною (Варіант 23).
 */
app.get('/api/rentals', async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: 'База даних не налаштована. Додайте serviceAccountKey.json.' });
  }
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'Потрібен параметр userId.' });
  }
  const minPrice = req.query.minPrice != null ? Number(req.query.minPrice) : null;
  const maxPrice = req.query.maxPrice != null ? Number(req.query.maxPrice) : null;

  try {
    const snapshot = await db.collection(RENTALS_COLLECTION)
      .where('userId', '==', userId)
      .get();
    let list = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
      };
    });
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    if (minPrice != null && !Number.isNaN(minPrice)) {
      list = list.filter((r) => r.total >= minPrice);
    }
    if (maxPrice != null && !Number.isNaN(maxPrice)) {
      list = list.filter((r) => r.total <= maxPrice);
    }

    res.json(list);
  } catch (err) {
    console.error('GET /api/rentals', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/rentals — збереження оренди (Варіант 23).
 * Body: { userId, items: [{ id, name, sportType, pricePerDay }], days, total }
 */
app.post('/api/rentals', async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: 'База даних не налаштована. Додайте serviceAccountKey.json.' });
  }
  const { userId, items, days, total } = req.body;
  if (!userId || !items || !Array.isArray(items) || days == null || total == null) {
    return res.status(400).json({ error: 'Потрібні поля: userId, items, days, total.' });
  }

  try {
    const docRef = await db.collection(RENTALS_COLLECTION).add({
      userId,
      items: items.map(({ id, name, sportType, pricePerDay }) => ({ id, name, sportType, pricePerDay })),
      days: Number(days),
      total: Number(total),
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ id: docRef.id, message: 'Оренду збережено.' });
  } catch (err) {
    console.error('POST /api/rentals', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/rentals/:id — оновлення оренди (наприклад, status: 'completed').
 */
app.patch('/api/rentals/:id', async (req, res) => {
  if (!db) {
    return res.status(503).json({ error: 'База даних не налаштована.' });
  }
  const { id } = req.params;
  const { status } = req.body;
  if (!id || !status) {
    return res.status(400).json({ error: 'Потрібні id та status.' });
  }

  try {
    await db.collection(RENTALS_COLLECTION).doc(id).update({ status });
    res.json({ message: 'Оновлено.' });
  } catch (err) {
    console.error('PATCH /api/rentals/:id', err);
    res.status(500).json({ error: err.message });
  }
});

/** Перевірка роботи сервера */
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

/** Хостинг статичних файлів (build клієнта) — Варіант 23 */
const buildPath = path.join(__dirname, '..', 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(buildPath, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
} else {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.status(404).json({ message: 'Зберіть клієнт: npm run build у корені проєкту.' });
  });
}

const server = app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}. API: http://localhost:${PORT}/api/rentals`);
});
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Порт ${PORT} зайнятий. Зупиніть інший процес (lsof -i :${PORT}) або встановіть PORT=інший_порт`);
  }
  process.exit(1);
});
