import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postRental } from '../services/backendApi';
import { saveRental } from '../services/firestore';
import RentalList from '../components/RentalList';
import PaymentForm from '../components/PaymentForm';
import './Payment.css';

/**
 * Лабораторна №5: оплата зберігає оренду через серверний API (POST), fallback — Firestore.
 */
function Payment({ rentals, onRemove, onPaymentSuccess }) {
  const { user } = useAuth();
  const [days, setDays] = useState(1);
  const navigate = useNavigate();
  const total = rentals.reduce((sum, r) => sum + r.pricePerDay * days, 0);

  const handleSuccess = async () => {
    if (user && rentals.length > 0) {
      try {
        await postRental({
          userId: user.uid,
          items: rentals.map(({ id, name, sportType, pricePerDay }) => ({ id, name, sportType, pricePerDay })),
          days,
          total,
        });
      } catch (err) {
        try {
          await saveRental(user.uid, rentals, days, total);
        } catch (e) {
          console.error('Помилка збереження оренди:', e);
        }
      }
    }
    if (typeof onPaymentSuccess === 'function') onPaymentSuccess();
    setTimeout(() => navigate('/rentals'), 2000);
  };

  if (rentals.length === 0) {
    return (
      <main className="page-content payment-page">
        <div className="payment-page-inner">
          <h1 className="page-title">Оплата</h1>
          <p className="payment-empty">
            Список оренд порожній. <Link to="/equipment">Оберіть обладнання</Link> та додайте його до оренди.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-content payment-page">
      <div className="payment-page-inner">
        <h1 className="page-title">Оплата оренди</h1>

        <div className="payment-layout">
          <div className="payment-summary">
            <h3>Ваше замовлення</h3>
            <div className="payment-days">
              <label htmlFor="payment-days">Дні оренди:</label>
              <input
                id="payment-days"
                type="number"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
            </div>
            <RentalList rentals={rentals} onRemove={onRemove} days={days} />
          </div>
          <div className="payment-form-wrap">
            <PaymentForm
              total={total}
              onSuccess={handleSuccess}
              onCancel={() => navigate('/rentals')}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Payment;
