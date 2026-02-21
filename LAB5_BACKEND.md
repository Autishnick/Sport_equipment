# Лабораторна №5 — підключення бекенду (Варіант 23)

Серверна частина на Node.js + Express обробляє API оренд та (опційно) віддає статику збірки.

## Що реалізовано

1. **Серверна частина (backend/)**  
   - Express, CORS, firebase-admin.  
   - **GET /api/rentals?userId=xxx&minPrice=0&maxPrice=999999** — оренди користувача з фільтром за ціною.  
   - **POST /api/rentals** — збереження оренди (userId, items, days, total).  
   - **PATCH /api/rentals/:id** — оновлення оренди (наприклад, status: 'completed').  
   - Хостинг статичних файлів з папки `build` (якщо вона є).

2. **Клієнт**  
   - Сторінка «Мої оренди» отримує дані через **GET /api/rentals** з фільтром за ціною (поля «від» / «до»).  
   - Після оплати оренда зберігається через **POST /api/rentals**.  
   - Завершення оренди — **PATCH /api/rentals/:id**.  
   - У режимі розробки запити на `/api/*` проксуються на порт 5000 (`"proxy": "http://localhost:5000"` у package.json).

## Як запустити

### 1. Підключення бекенду до Firebase (щоб у консолі були чіткі запити на бек без 503)

1. Відкрийте [Firebase Console](https://console.firebase.google.com/) → проєкт **sport-equipment-rent**.  
2. **Project settings** (шестерня) → **Service accounts**.  
3. Натисніть **Generate new private key** → збережіть завантажений JSON.  
4. Перейменуйте файл у **`serviceAccountKey.json`** і покладіть його в папку **backend/** (рядом з `server.js`).  
5. Перезапустіть бекенд: `cd backend && npm start`. У консолі має з’явитися: `Firestore підключено.`

Після цього запити **GET /api/rentals** та **POST /api/rentals** повертатимуть 200 і JSON — у DevTools буде видно чіткі успішні запити на бек.

Без цього файлу сервер запуститься, але `/api/rentals` повертатиме 503 (клієнт тоді використовує Firestore напряму).

### 2. Запуск у режимі розробки

**Термінал 1 — бекенд:**

```bash
cd backend
npm start
```

Сервер слухає порт **5001** (5000 на macOS часто зайнятий).

**Термінал 2 — клієнт:**

```bash
npm start
```

Клієнт на порту **3000**. У **.env** додано **REACT_APP_API_URL=http://localhost:5001** — клієнт звертається до бекенду напряму (без proxy), щоб уникнути проблем із craco.

### 3. Перевірка API

- У браузері: `http://localhost:5001/api/message` — має повернути `{ "message": "Hello from the backend!" }`.
- Оренди: увійдіть у додаток, додайте обладнання в кошик, оформте оплату — оренда має з’явитися в «Мої оренди» через API. Фільтр «від»/«до» (грн) обмежує список за сумою.

## Структура backend

- `server.js` — точка входу, Express, Firestore, маршрути API та статика.  
- `serviceAccountKey.json` — не комітити (додано в backend/.gitignore).  
- `package.json` — залежності: express, cors, firebase-admin.

Деплой (Render тощо) поки не налаштовується — лише локальна перевірка.
