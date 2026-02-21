/**
 * Лабораторна №5: клієнтські запити до серверного API (оренди).
 * Варіант 23 — GET з фільтром за ціною, POST для збереження.
 */

const API_BASE = process.env.REACT_APP_API_URL || '';

function parseJson(res) {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Backend недоступний або повернув не JSON. Запустіть backend: cd backend && npm start');
  }
  return res.json();
}

/**
 * Отримати оренди користувача з фільтром за ціною (GET).
 * @param {string} userId
 * @param {{ minPrice?: number, maxPrice?: number }} options
 */
export async function getRentals(userId, options = {}) {
  const params = new URLSearchParams({ userId });
  if (options.minPrice != null) params.set('minPrice', options.minPrice);
  if (options.maxPrice != null) params.set('maxPrice', options.maxPrice);
  const res = await fetch(`${API_BASE}/api/rentals?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  const list = await parseJson(res);
  return list.map((r) => ({
    ...r,
    createdAt: r.createdAt ? new Date(r.createdAt) : null,
  }));
}

/**
 * Зберегти оренду (POST).
 * @param {{ userId: string, items: Array<{id, name, sportType, pricePerDay}>, days: number, total: number }} data
 */
export async function postRental(data) {
  const res = await fetch(`${API_BASE}/api/rentals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return parseJson(res);
}

/**
 * Оновити оренду, наприклад завершити (PATCH).
 */
export async function patchRental(rentalId, { status }) {
  const res = await fetch(`${API_BASE}/api/rentals/${rentalId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return parseJson(res);
}
