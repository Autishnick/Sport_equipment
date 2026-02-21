import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

/**
 * Лабораторна №4: форма входу (Firebase Authentication).
 */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/equipment';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found'
        ? 'Невірний email або пароль.'
        : err.code === 'auth/invalid-email'
          ? 'Невірний формат email.'
          : err.message || 'Помилка входу.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-content auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Вхід</h1>
        <p className="auth-lead">Увійдіть, щоб орендувати обладнання та переглядати свої оренди.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="login-password">Пароль</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? 'Вхід...' : 'Увійти'}
          </button>
        </form>

        <p className="auth-footer">
          Немає облікового запису? <Link to="/register">Зареєструватися</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
