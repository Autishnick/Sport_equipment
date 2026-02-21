import { Link } from 'react-router-dom';
import './Home.css';

/**
 * Варіант 23: головна сторінка платформи оренди спортивного обладнання.
 */
function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <h1>Платформа для оренди спортивного обладнання</h1>
        <p className="home-meta">Варіант 23 · Лабораторна робота №3 · React</p>
        <p className="home-lead">
          Орендуйте спортивне обладнання: футбол, теніс, лижі, велосипеди, плавання та фітнес. Увійдіть, щоб додавати обладнання в кошик та переглядати свої оренди.
        </p>
        <ul className="home-features">
          <li>Реєстрація та вхід (Firebase Authentication)</li>
          <li>Обладнання з Firestore та фільтр за типом спорту</li>
          <li>Кошик та оформлення оренди тільки для авторизованих</li>
          <li>Активні та минулі оренди зберігаються в Firestore</li>
          <li>Форма відгуку — залиште ваш відгук про сервіс</li>
        </ul>
        <div className="home-actions">
          <Link to="/equipment" className="btn btn-primary">
            Обладнання
          </Link>
          <Link to="/feedback" className="btn btn-secondary">
            Відгуки
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Увійти
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Реєстрація
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
