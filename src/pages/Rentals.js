import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRentals, patchRental } from '../services/backendApi';
import { getUserRentals, completeRental } from '../services/firestore';
import RentalList from '../components/RentalList';
import './Rentals.css';

/**
 * Лабораторна №5: мої оренди з серверного API (GET з фільтром за ціною).
 * За потреби — fallback на Firestore.
 */
function Rentals({ rentals, onRemove }) {
  const { user } = useAuth();
  const [days, setDays] = useState(1);
  const [userRentals, setUserRentals] = useState([]);
  const [loadingRentals, setLoadingRentals] = useState(true);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function load() {
      try {
        const options = {};
        if (minPrice !== '') options.minPrice = Number(minPrice);
        if (maxPrice !== '') options.maxPrice = Number(maxPrice);
        const list = await getRentals(user.uid, options);
        if (!cancelled) setUserRentals(list);
      } catch (err) {
        try {
          const list = await getUserRentals(user.uid);
          if (!cancelled) setUserRentals(list);
        } catch (e) {
          console.error(e);
        }
      } finally {
        if (!cancelled) setLoadingRentals(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user, minPrice, maxPrice]);

  const handleComplete = async (rentalId) => {
    try {
      await patchRental(rentalId, { status: 'completed' });
      setUserRentals((prev) =>
        prev.map((r) => (r.id === rentalId ? { ...r, status: 'completed' } : r))
      );
    } catch (err) {
      try {
        await completeRental(rentalId);
        setUserRentals((prev) =>
          prev.map((r) => (r.id === rentalId ? { ...r, status: 'completed' } : r))
        );
      } catch (e) {
        console.error(e);
      }
    }
  };

  const activeRentals = userRentals.filter((r) => r.status === 'active');
  const pastRentals = userRentals.filter((r) => r.status === 'completed');
  const total = rentals.reduce((sum, r) => sum + r.pricePerDay * days, 0);

  return (
    <main className="page-content rentals-page">
      <div className="rentals-page-inner">
        <h1 className="page-title">Мої оренди</h1>
        <p className="page-lead">
          Поточний кошик, активні та минулі оренди (дані з серверного API, фільтр за ціною).
        </p>

        {/* Фільтр за ціною — Варіант 23 */}
        <div className="rentals-filter-price">
          <label>Фільтр за сумою (грн):</label>
          <input
            type="number"
            placeholder="від"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="до"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* Поточний кошик */}
        <section className="rentals-section">
          <h2 className="rentals-section-title">Поточний кошик</h2>
          <div className="rentals-days">
            <label htmlFor="rental-days">Кількість днів оренди:</label>
            <input
              id="rental-days"
              type="number"
              min={1}
              max={30}
              value={days}
              onChange={(e) => setDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
          </div>
          <RentalList rentals={rentals} onRemove={onRemove} days={days} />
          {rentals.length > 0 && (
            <div className="rentals-actions">
              <Link to="/payment" className="btn btn-primary">
                Перейти до оплати ({total} грн)
              </Link>
              <Link to="/equipment" className="btn btn-secondary">
                Додати ще обладнання
              </Link>
            </div>
          )}
        </section>

        <section className="rentals-section">
          <h2 className="rentals-section-title">Активні оренди</h2>
          {loadingRentals ? (
            <p className="rentals-loading">Завантаження...</p>
          ) : activeRentals.length === 0 ? (
            <p className="rentals-empty">Немає активних оренд.</p>
          ) : (
            <ul className="rentals-history-list">
              {activeRentals.map((r) => (
                <li key={r.id} className="rentals-history-item">
                  <div className="rentals-history-info">
                    <span className="rentals-history-date">
                      {r.createdAt ? r.createdAt.toLocaleDateString('uk-UA') : '—'}
                    </span>
                    <span className="rentals-history-total">{r.total} грн</span>
                    <span className="rentals-history-days">{r.days} дн.</span>
                    <ul className="rentals-history-items">
                      {r.items?.map((i) => (
                        <li key={i.id}>{i.name}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleComplete(r.id)}
                  >
                    Завершити оренду
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rentals-section">
          <h2 className="rentals-section-title">Минулі оренди</h2>
          {loadingRentals ? null : pastRentals.length === 0 ? (
            <p className="rentals-empty">Немає минулих оренд.</p>
          ) : (
            <ul className="rentals-history-list">
              {pastRentals.map((r) => (
                <li key={r.id} className="rentals-history-item rentals-history-item-past">
                  <div className="rentals-history-info">
                    <span className="rentals-history-date">
                      {r.createdAt ? r.createdAt.toLocaleDateString('uk-UA') : '—'}
                    </span>
                    <span className="rentals-history-total">{r.total} грн</span>
                    <span className="rentals-history-days">{r.days} дн.</span>
                    <ul className="rentals-history-items">
                      {r.items?.map((i) => (
                        <li key={i.id}>{i.name}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default Rentals;
