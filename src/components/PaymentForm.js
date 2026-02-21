import { useState } from 'react';
import './PaymentForm.css';

/**
 * Варіант 23: компонент форми оплати.
 * Завдання 2: компонент форми; Завдання 3: керування станом (useState для полів та повідомлень).
 */
function PaymentForm({ total, onSuccess, onCancel }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [holder, setHolder] = useState('');
  const [cvv, setCvv] = useState('');
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2);
    return v;
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e) => {
    setExpiry(formatExpiry(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      setMessage({ type: 'error', text: 'Введіть коректний номер картки (16 цифр).' });
      return;
    }
    if (!expiry || expiry.length < 5) {
      setMessage({ type: 'error', text: 'Введіть термін дії (ММ/РР).' });
      return;
    }
    if (!holder.trim()) {
      setMessage({ type: 'error', text: 'Введіть ім\'я власника картки.' });
      return;
    }
    if (!cvv || cvv.length < 3) {
      setMessage({ type: 'error', text: 'Введіть CVV (3 цифри).' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: 'info', text: 'Обробка оплати...' });

    setTimeout(() => {
      setIsSubmitting(false);
      setMessage({ type: 'success', text: 'Оплату успішно проведено! Дякуємо за оренду.' });
      if (typeof onSuccess === 'function') onSuccess();
    }, 1500);
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <h3 className="payment-form-title">Оплата оренди</h3>
      <p className="payment-form-total">До сплати: <strong>{total} грн</strong></p>

      <div className="payment-form-group">
        <label htmlFor="payment-card">Номер картки</label>
        <input
          id="payment-card"
          type="text"
          placeholder="0000 0000 0000 0000"
          value={cardNumber}
          onChange={handleCardNumberChange}
          maxLength={19}
          autoComplete="cc-number"
        />
      </div>

      <div className="payment-form-row">
        <div className="payment-form-group">
          <label htmlFor="payment-expiry">Термін дії (ММ/РР)</label>
          <input
            id="payment-expiry"
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={handleExpiryChange}
            maxLength={5}
            autoComplete="cc-exp"
          />
        </div>
        <div className="payment-form-group">
          <label htmlFor="payment-cvv">CVV</label>
          <input
            id="payment-cvv"
            type="password"
            placeholder="***"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            autoComplete="cc-csc"
          />
        </div>
      </div>

      <div className="payment-form-group">
        <label htmlFor="payment-holder">Ім'я на картці</label>
        <input
          id="payment-holder"
          type="text"
          placeholder="IVAN IVANOV"
          value={holder}
          onChange={(e) => setHolder(e.target.value.toUpperCase())}
          autoComplete="cc-name"
        />
      </div>

      {message && (
        <div className={`payment-form-message payment-form-message--${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="payment-form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Обробка...' : 'Сплатити'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
}

export default PaymentForm;
