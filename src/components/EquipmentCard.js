import { Link } from 'react-router-dom';
import { SPORT_TYPES } from '../data/equipment';
import './EquipmentCard.css';

/**
 * Варіант 23: компонент картки обладнання.
 * Якщо onRent не передано (гость), показує посилання на вхід.
 */
function EquipmentCard({ item, onRent }) {
  const sportLabel = SPORT_TYPES[item.sportType] || item.sportType;

  return (
    <article className="equipment-card">
      <div className="equipment-card-image">
        <img src={item.image} alt={item.name} width="400" height="300" />
        <span className="equipment-card-sport">{sportLabel}</span>
      </div>
      <div className="equipment-card-body">
        <h3 className="equipment-card-title">{item.name}</h3>
        <p className="equipment-card-desc">{item.description}</p>
        <p className="equipment-card-price">
          {item.pricePerDay} грн <span className="per-day">/ добу</span>
        </p>
        {onRent ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onRent(item)}
          >
            Орендувати
          </button>
        ) : (
          <Link to="/login" className="btn btn-secondary equipment-card-login">
            Увійдіть, щоб орендувати
          </Link>
        )}
      </div>
    </article>
  );
}

export default EquipmentCard;
