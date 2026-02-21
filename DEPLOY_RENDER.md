# Деплой на Render (один Web Service)

Один сервіс: Node.js віддає збірку React і API. Порт і статика налаштовуються автоматично.

## 1. Репозиторій

Закомітьте проєкт у GitHub (папки `backend/`, `src/`, `public/`, `package.json`, `craco.config.js` тощо). Файл `backend/serviceAccountKey.json` не комітиться (.gitignore).

## 2. Новий Web Service на Render

1. [Render](https://render.com) → **Dashboard** → **New** → **Web Service**.
2. Підключіть репозиторій (GitHub).
3. Налаштування:
   - **Name:** наприклад `sport-equip-rent`
   - **Region:** на вибір
   - **Root Directory:** залишити порожнім (корінь репо)
   - **Runtime:** Node
   - **Build Command:**
     ```bash
     npm install && npm run build && cd backend && npm install
     ```
   - **Start Command:**
     ```bash
     cd backend && node server.js
     ```
   - **Instance Type:** Free (або платний)

## 3. Змінні середовища (Environment)

У **Environment** додайте змінні. Усі змінні з префіксом `REACT_APP_` потрібні на етапі **Build**, решта — під **Run**.

### Для збірки (Build) — Firebase клієнт і API URL

| Key | Value | Примітка |
|-----|--------|----------|
| `REACT_APP_FIREBASE_API_KEY` | ваш apiKey | з Firebase Console → Project settings |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | `sport-equipment-rent.firebaseapp.com` | |
| `REACT_APP_FIREBASE_PROJECT_ID` | `sport-equipment-rent` | |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | `sport-equipment-rent.firebasestorage.app` | |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | ваш sender id | |
| `REACT_APP_FIREBASE_APP_ID` | ваш appId | |
| `REACT_APP_API_URL` | *(порожньо)* | Щоб API йшло на той самий домен (/api/...) |

Значення можна взяти з вашого локального `.env`.

### Для запуску (Run) — Firestore на бекенді

| Key | Value |
|-----|--------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | **Весь вміст** файлу `serviceAccountKey.json` (один рядок JSON) |

Як отримати: відкрийте локальний `backend/serviceAccountKey.json`, скопіюйте **весь** JSON (від `{` до `}`). У Render у полі Value вставте його як один рядок (Render дозволяє багаторядкові значення — можна вставити як є).

Якщо JSON в один рядок: вставте його в Value. Якщо з переносами — теж підійде.

## 4. Firebase Console — дозволений домен

Щоб увійти через Firebase Auth на проді:

1. [Firebase Console](https://console.firebase.google.com/) → проєкт **sport-equipment-rent**.
2. **Authentication** → **Settings** → **Authorized domains**.
3. **Add domain** → введіть домен Render, наприклад: `sport-equip-rent.onrender.com` (ваш URL після деплою буде видно в Render Dashboard).

## 5. Деплой

Натисніть **Create Web Service**. Render виконає Build, потім Start. Після деплою відкрийте **URL сервісу** (наприклад `https://sport-equip-rent.onrender.com`).

- Головна та SPA: той самий URL.
- API: `https://ваш-сервіс.onrender.com/api/rentals`, `/api/message` тощо.

## 6. Free tier

На безкоштовному інстансі сервіс “засинає” після ~15 хв без запитів; перший запит після цього може тривати 30–50 с (cold start). Для здачі лаби це нормально.

## Підсумок команд

| Етап | Команда |
|------|---------|
| Build | `npm install && npm run build && cd backend && npm install` |
| Start | `cd backend && node server.js` |

Перевірка: у логах Render має з’явитися `Firestore підключено.` і `Сервер запущено на порту 10000` (або інший PORT, який дає Render).
