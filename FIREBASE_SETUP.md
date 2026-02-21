# Лабораторна №4 — налаштування Firebase (Варіант 23)

Щоб автентифікація та база даних працювали, потрібно створити проєкт у Firebase та додати конфігурацію в додаток.

---

## 1. Створення проєкту Firebase

1. Перейдіть на [https://firebase.google.com/](https://firebase.google.com/) та увійдіть (Google-акаунт).
2. Відкрийте **Firebase Console** → **Додати проєкт** (або виберіть існуючий).
3. Введіть назву проєкту (наприклад, `sport-rent-lab4`), при потребі увімкніть Google Analytics → **Створити проєкт**.

---

## 2. Налаштування Authentication (вхід/реєстрація)

1. У лівому меню: **Build** → **Authentication** → **Get started**.
2. У вкладці **Sign-in method** увімкніть **Email/Password** (перший пункт):
   - Увімкніть **Email/Password**.
   - Збережіть.

Після цього користувачі зможуть реєструватися та входити через email і пароль.

---

## 3. Налаштування Firestore (база даних)

1. У лівому меню: **Build** → **Firestore Database** → **Create database**.
2. Оберіть режим:
   - **Test mode** — для навчання (доступ на запис/читання на 30 днів з обмеженнями).
   - Або **Production mode** — потім у **Rules** можна обмежити доступ за `request.auth`.
3. Оберіть регіон (наприклад, `europe-west`) → **Enable**.

Правила безпеки для тесту можна залишити тимчасово відкритими; для захисту даних пізніше налаштуйте Rules (наприклад, доступ до `rentals` тільки для `request.auth != null` та перевірка `request.auth.uid === resource.data.userId`).

---

## 4. Отримання конфігурації для веб-додатку

1. У Firebase Console натисніть **іконку шестерні** (⚙️) біля «Project Overview» → **Project settings**.
2. Прокрутіть до блоку **Your apps**.
3. Натисніть **</>** (Web). Якщо додаток уже додано — виберіть його.
4. Введіть nickname (наприклад, `SportRent Web`) → **Register app**.
5. Скопіюйте об’єкт `firebaseConfig` (поля `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).

---

## 5. Додавання конфігурації в проєкт

1. У корені проєкту створіть файл **`.env`** (як у прикладі `.env.example`).
2. Заповніть змінні з вашої конфігурації Firebase:

```env
REACT_APP_FIREBASE_API_KEY=ваш_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=ваш_projekt_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=ваш_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=ваш_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=ваш_sender_id
REACT_APP_FIREBASE_APP_ID=ваш_app_id
```

3. Перезапустіть dev-сервер (`npm start`), щоб змінні з `.env` підхопились.

**Важливо:** файл `.env` не комітиться в git (додано в `.gitignore`), щоб ключі не потрапляли в репозиторій.

---

## 6. Заповнення хмарної БД даними

Якщо колекція `equipment` порожня, у додатку на сторінці **Обладнання** з’явиться кнопка **«Завантажити приклад обладнання в Firestore»**. Натисніть її один раз (краще будучи увійшовшим) — у Firestore з’явиться приклад обладнання для оренди.

**Команда:** `npm run seed` — заповнить **equipment** (12 позицій) та **feedback** (приклади). **Через додаток:** сторінка Обладнання → кнопка «Завантажити приклад обладнання», якщо список порожній.

### Якщо `npm run seed` дає «Missing or insufficient permissions»

1. Відкрийте [Firebase Console](https://console.firebase.google.com/) → ваш проєкт **sport-equipment-rent**.
2. Перейдіть у **Firestore Database** → вкладка **Rules**.
3. Замініть правила на тимчасові (дозвіл для запису з будь-якого клієнта):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Натисніть **Publish**.
5. У терміналі знову виконайте: `npm run seed`.
6. Після успішного заповнення можна повернути більш жорсткі правила (наприклад, `allow read, write: if request.auth != null;` для окремих колекцій).

---

## Підсумок кроків у Firebase Console

| Крок | Дія |
|------|-----|
| 1 | Створити проєкт Firebase |
| 2 | **Authentication** → Sign-in method → увімкнути **Email/Password** |
| 3 | **Firestore Database** → Create database (Test або Production) → обрати регіон |
| 4 | **Project settings** → Your apps → додати Web app → скопіювати конфіг |
| 5 | У проєкті створити `.env` і вставити значення з конфігу |
| 6 | Перезапустити `npm start` |

Після цього реєстрація, вхід, вихід та робота з обладнанням і орендами з Firestore мають працювати.
