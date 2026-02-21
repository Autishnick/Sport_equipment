import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

/**
 * Лабораторна №4: Header з посиланнями та станом автентифікації (Увійти / Вийти).
 */
function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { to: '/', label: 'Головна' },
    { to: '/equipment', label: 'Обладнання' },
    { to: '/feedback', label: 'Відгуки' },
    ...(user ? [{ to: '/rentals', label: 'Мої оренди' }, { to: '/payment', label: 'Оплата' }] : []),
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">⚽</span>
          <span className="logo-text">SportRent</span>
        </Link>
        <nav className="main-nav" aria-label="Головне меню">
          <ul className="nav-list">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`nav-link ${location.pathname === to ? 'active' : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
            {user ? (
              <li className="header-user">
                <span className="header-email" title={user.email}>
                  {user.email}
                </span>
                <button type="button" className="header-logout" onClick={() => logout()}>
                  Вийти
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/login" className="nav-link">Увійти</Link>
                </li>
                <li>
                  <Link to="/register" className="nav-link nav-link-register">Реєстрація</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
