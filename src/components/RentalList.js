import { SPORT_TYPES } from '../data/equipment';
import './RentalList.css';

/**
 * Варіант 23: компонент списку оренд.
 * Завдання 2: компонент з props (rentals, onRemove, days).
 * Відображає перелік обраного обладнання та суму.
 */
function RentalList({ rentals, onRemove, days = 1 }) {
  if (!rentals || rentals.length === 0) {
    return (
      <div className="rental-list rental-list-empty">
        <p>У вас поки немає орендованого обладнання.</p>
        <p className="rental-list-hint">Перейдіть до розділу «Обладнання» та додайте позиції.</p>
      </div>
    );
  }

  const total = rentals.reduce((sum, r) => sum + r.pricePerDay * days, 0);

  return (
    <div className="rental-list">
      <ul className="rental-list-items">
        {rentals.map((item) => (
          <li key={item.id} className="rental-list-item">
            <div className="rental-list-item-info">
              <span className="rental-list-item-name">{item.name}</span>
              <span className="rental-list-item-sport">
                {SPORT_TYPES[item.sportType] || item.sportType}
              </span>
              <span className="rental-list-item-price">
                {item.pricePerDay} грн/добу × {days} дн. = {item.pricePerDay * days} грн
              </span>
            </div>
            <button
              type="button"
              className="rental-list-remove"
              onClick={() => onRemove(item.id)}
              title="Прибрати з оренди"
              aria-label="Прибрати з оренди"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="rental-list-total">
        <strong>Всього за {days} дн.:</strong> {total} грн
      </div>
    </div>
  );
}

export default RentalList;
