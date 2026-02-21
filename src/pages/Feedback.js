import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { saveFeedback } from '../services/firestore';
import './Feedback.css';

/**
 * Форма відгуку — збереження в Firestore.
 */
function Feedback() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.email?.split('@')[0] || '');
  const [email, setEmail] = useState(user?.email || '');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!message.trim()) {
      setStatus({ type: 'error', text: 'Введіть текст відгуку.' });
      return;
    }
    setSubmitting(true);
    try {
      await saveFeedback({
        name: name.trim() || 'Анонім',
        email: email.trim() || null,
        rating: Number(rating),
        message: message.trim(),
        userId: user?.uid || null,
      });
      setStatus({ type: 'success', text: 'Дякуємо за відгук! Він збережений.' });
      setMessage('');
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: 'Не вдалося надіслати відгук. Спробуйте пізніше.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-content feedback-page">
      <div className="feedback-page-inner">
        <h1 className="page-title">Форма відгуку</h1>
        <p className="page-lead">
          Поділіться враженнями від оренди обладнання. Ваша думка допоможе нам стати краще.
        </p>

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="feedback-row">
            <div className="feedback-field">
              <label htmlFor="feedback-name">Ім'я</label>
              <input
                id="feedback-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше ім'я"
              />
            </div>
            <div className="feedback-field">
              <label htmlFor="feedback-email">Email</label>
              <input
                id="feedback-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="feedback-field">
            <label>Оцінка</label>
            <div className="feedback-rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="feedback-rating-star">
                  <input
                    type="radio"
                    name="rating"
                    value={value}
                    checked={rating === value}
                    onChange={() => setRating(value)}
                  />
                  <span className="star">★</span>
                </label>
              ))}
            </div>
          </div>

          <div className="feedback-field">
            <label htmlFor="feedback-message">Відгук *</label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Напишіть ваш відгук..."
              rows={5}
              required
            />
          </div>

          {status && (
            <div className={`feedback-status feedback-status--${status.type}`}>
              {status.text}
            </div>
          )}

          <button type="submit" className="btn btn-primary feedback-submit" disabled={submitting}>
            {submitting ? 'Надсилання...' : 'Надіслати відгук'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Feedback;
