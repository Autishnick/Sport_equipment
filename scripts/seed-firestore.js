/**
 * Заповнення Firestore даними: обладнання та приклади відгуків.
 * Запуск: npm run seed (перед цим заповніть .env з Firebase config).
 */
const path = require('path');
const fs = require('fs');

// Завантажити .env з кореня проєкту
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const {
  initializeApp,
} = require('firebase/app');
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

async function seed() {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('Помилка: заповніть .env (REACT_APP_FIREBASE_*). Див. .env.example');
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log('Підключено до Firestore:', firebaseConfig.projectId);

  // 1. Обладнання
  const equipmentPath = path.join(__dirname, 'equipment-data.json');
  const equipment = JSON.parse(fs.readFileSync(equipmentPath, 'utf8'));
  const equipmentCol = collection(db, 'equipment');

  const existingEquipment = await getDocs(equipmentCol);
  if (existingEquipment.size > 0) {
    console.log(`Колекція "equipment" вже містить ${existingEquipment.size} документів. Пропускаємо.`);
  } else {
    for (const item of equipment) {
      await addDoc(equipmentCol, {
        name: item.name,
        sportType: item.sportType,
        description: item.description,
        pricePerDay: item.pricePerDay,
        image: item.image,
      });
    }
    console.log('Додано обладнання:', equipment.length, 'позицій.');
  }

  // 2. Приклади відгуків (якщо колекція порожня)
  const feedbackCol = collection(db, 'feedback');
  const existingFeedback = await getDocs(feedbackCol);
  if (existingFeedback.size > 0) {
    console.log(`Колекція "feedback" вже містить ${existingFeedback.size} документів. Пропускаємо.`);
  } else {
    const sampleFeedback = [
      { name: 'Олександр', email: 'oleksandr@example.com', rating: 5, message: 'Чудовий сервіс, обладнання в ідеальному стані. Рекомендую!' },
      { name: 'Марія', email: 'maria@example.com', rating: 4, message: 'Зручно орендувати онлайн. Хотілося б більше вибору лиж.' },
      { name: 'Анонім', email: null, rating: 5, message: 'Швидко оформили оренду велосипеда. Дякую!' },
    ];
    for (const item of sampleFeedback) {
      await addDoc(feedbackCol, {
        ...item,
        userId: null,
        createdAt: serverTimestamp(),
      });
    }
    console.log('Додано приклади відгуків:', sampleFeedback.length);
  }

  console.log('Готово. Хмарна БД заповнена.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Помилка:', err.message);
  process.exit(1);
});
