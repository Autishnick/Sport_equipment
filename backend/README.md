# Backend — Лабораторна №5, Варіант 23

Node.js + Express сервер для API оренд та хостингу статики.

## Налаштування

1. Встановити залежності: `npm install`
2. **Firebase Service Account:** у Firebase Console → Project settings → Service accounts → **Generate new private key**. Зберегти JSON-файл у папку `backend` під іменем **`serviceAccountKey.json`**. Без нього API оренд повертатиме 503.
3. Запуск: `npm start` (порт 5001; якщо зайнятий — встановіть `PORT=5002` тощо).

## API

- **GET** `/api/rentals?userId=xxx&minPrice=0&maxPrice=999999` — оренди користувача з фільтром за ціною
- **POST** `/api/rentals` — зберегти оренду (body: `userId`, `items`, `days`, `total`)
- **PATCH** `/api/rentals/:id` — оновити оренду (body: `status`)

## Режим розробки

- Клієнт: `npm start` у корені проєкту (порт 3000), у `package.json` — `"proxy": "http://localhost:5001"`.
- Сервер: у папці `backend` виконати `npm start` (порт 5001).

Після `npm run build` у корені можна запускати лише backend — він віддасть збірку з папки `build`.
