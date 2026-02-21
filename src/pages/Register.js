import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

/**
 * Лабораторна №4: форма реєстрації (Firebase Authentication).
 */
function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Паролі не збігаються.');
      return;
    }
    if (password.length < 6) {
      setError('Пароль має бути не менше 6 символів.');
      return;
    }
    setSubmitting(true);
    try {
      await register(email, password);
      navigate('/equipment', { replace: true });
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'Цей email вже зареєстровано.'
        : err.code === 'auth/invalid-email'
          ? 'Невірний формат email.'
          : err.code === 'auth/weak-password'
            ? 'Пароль занадто простий.'
            : err.message || 'Помилка реєстрації.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-content auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Реєстрація</h1>
        <p className="auth-lead">Створіть обліковий запис, щоб орендувати обладнання.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="reg-password">Пароль</label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="мін. 6 символів"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="reg-confirm">Підтвердіть пароль</label>
            <input
              id="reg-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? 'Реєстрація...' : 'Зареєструватися'}
          </button>
        </form>

        <p className="auth-footer">
          Вже є обліковий запис? <Link to="/login">Увійти</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
