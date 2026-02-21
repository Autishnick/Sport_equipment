/**
 * Лабораторна №4: робота з Firestore — обладнання та оренди.
 */
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const EQUIPMENT_COLLECTION = 'equipment';
const RENTALS_COLLECTION = 'rentals';
const FEEDBACK_COLLECTION = 'feedback';

/**
 * Зчитати все обладнання з Firestore.
 * Повертає масив об'єктів з полем id = document id.
 */
export async function getEquipmentFromFirestore() {
  const snap = await getDocs(collection(db, EQUIPMENT_COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Записати приклад обладнання в Firestore (один раз для наповнення БД).
 */
export async function seedEquipment(equipmentList) {
  const col = collection(db, EQUIPMENT_COLLECTION);
  for (const item of equipmentList) {
    const { id, ...data } = item;
    await addDoc(col, {
      name: data.name,
      sportType: data.sportType,
      description: data.description,
      pricePerDay: data.pricePerDay,
      image: data.image,
    });
  }
}

/**
 * Зберегти оренду в Firestore (після оплати).
 */
export async function saveRental(userId, items, days, total) {
  const col = collection(db, RENTALS_COLLECTION);
  await addDoc(col, {
    userId,
    items: items.map(({ id, name, sportType, pricePerDay }) => ({
      id,
      name,
      sportType,
      pricePerDay,
    })),
    days,
    total,
    status: 'active',
    createdAt: serverTimestamp(),
  });
}

/**
 * Отримати оренди поточного користувача (активні та минулі).
 */
export async function getUserRentals(userId) {
  const col = collection(db, RENTALS_COLLECTION);
  const q = query(col, where('userId', '==', userId));
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => {
    const data = d.data();
    return { id: d.id, ...data, createdAt: data.createdAt?.toDate?.() };
  });
  list.sort((a, b) => (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0));
  return list;
}

/**
 * Позначити оренду як завершену (минула).
 */
export async function completeRental(rentalId) {
  await updateDoc(doc(db, RENTALS_COLLECTION, rentalId), { status: 'completed' });
}

/**
 * Зберегти відгук у Firestore.
 */
export async function saveFeedback(data) {
  const col = collection(db, FEEDBACK_COLLECTION);
  await addDoc(col, {
    ...data,
    createdAt: serverTimestamp(),
  });
}
